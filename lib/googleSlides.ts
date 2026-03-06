// Google OAuth + Drive API upload → opens directly in Google Slides
// Requires NEXT_PUBLIC_GOOGLE_CLIENT_ID env var


declare global {
  interface Window {
    google: {
      accounts: {
        oauth2: {
          initTokenClient: (config: {
            client_id: string;
            scope: string;
            callback: (resp: { access_token?: string; error?: string }) => void;
          }) => { requestAccessToken: () => void };
        };
      };
    };
  }
}

function loadGsi(): Promise<void> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') return;
    if (window.google?.accounts?.oauth2) return resolve();
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.onload = () => resolve();
    document.head.appendChild(script);
  });
}

function getAccessToken(clientId: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const tokenClient = window.google.accounts.oauth2.initTokenClient({
      client_id: clientId,
      scope: 'https://www.googleapis.com/auth/drive.file',
      callback: (resp) => {
        if (resp.error || !resp.access_token) {
          reject(new Error(resp.error ?? 'OAuth failed'));
        } else {
          resolve(resp.access_token);
        }
      },
    });
    tokenClient.requestAccessToken();
  });
}


/** Find or create a "SlideGen" folder in Drive. Does NOT cache — avoids stale folder errors. */
async function getOrCreateFolder(accessToken: string): Promise<string> {
  const res = await fetch('https://www.googleapis.com/drive/v3/files', {
    method: 'POST',
    headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'SlideGen', mimeType: 'application/vnd.google-apps.folder' }),
  });

  if (!res.ok) {
    // Non-fatal — just upload to root if folder creation fails
    return '';
  }
  const data = await res.json();
  return data.id as string;
}

async function uploadPptxToDrive(accessToken: string, pptxBlob: Blob, name: string, folderId: string): Promise<string> {
  const metadata: Record<string, unknown> = {
    name,
    mimeType: 'application/vnd.google-apps.presentation',
  };
  if (folderId) metadata.parents = [folderId];

  // Build multipart body manually — FormData doesn't reliably work with Drive API
  const boundary = 'boundary_slidegen_' + Math.random().toString(36).slice(2);
  const metaJson = JSON.stringify(metadata);
  const pptxBytes = await pptxBlob.arrayBuffer();

  const encoder = new TextEncoder();
  const metaPart = encoder.encode(
    `--${boundary}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n${metaJson}\r\n`,
  );
  const filePart = encoder.encode(
    `--${boundary}\r\nContent-Type: application/vnd.openxmlformats-officedocument.presentationml.presentation\r\n\r\n`,
  );
  const closing = encoder.encode(`\r\n--${boundary}--`);

  const body = new Uint8Array(metaPart.byteLength + filePart.byteLength + pptxBytes.byteLength + closing.byteLength);
  let offset = 0;
  body.set(metaPart, offset); offset += metaPart.byteLength;
  body.set(filePart, offset); offset += filePart.byteLength;
  body.set(new Uint8Array(pptxBytes), offset); offset += pptxBytes.byteLength;
  body.set(closing, offset);

  const res = await fetch(
    'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': `multipart/related; boundary=${boundary}`,
      },
      body,
    },
  );

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message ?? `Upload failed: ${res.status}`);
  }

  const data = await res.json();
  return data.id as string;
}

/** Returns the Google Slides edit URL after uploading the PPTX blob to Drive. */
export async function openInGoogleSlides(
  pptxBlob: Blob,
  deckTitle?: string,
): Promise<string> {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  if (!clientId) {
    throw new Error('NEXT_PUBLIC_GOOGLE_CLIENT_ID is not set');
  }

  const name = deckTitle?.trim() || 'AirOps Deck';

  await loadGsi();
  const accessToken = await getAccessToken(clientId);
  const folderId = await getOrCreateFolder(accessToken);
  const fileId = await uploadPptxToDrive(accessToken, pptxBlob, name, folderId);

  return `https://docs.google.com/presentation/d/${fileId}/edit`;
}
