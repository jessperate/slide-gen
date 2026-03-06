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
  const PPTX_MIME = 'application/vnd.openxmlformats-officedocument.presentationml.presentation';
  const metadata: Record<string, unknown> = { name };
  if (folderId) metadata.parents = [folderId];

  // Step 1: Initiate a resumable upload session — most reliable for binary files
  const initRes = await fetch(
    `https://www.googleapis.com/upload/drive/v3/files?uploadType=resumable`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'X-Upload-Content-Type': PPTX_MIME,
        'X-Upload-Content-Length': String(pptxBlob.size),
      },
      body: JSON.stringify(metadata),
    },
  );

  if (!initRes.ok) {
    const err = await initRes.json().catch(() => ({}));
    throw new Error(`Upload init failed ${initRes.status}: ${JSON.stringify(err)}`);
  }

  const uploadUrl = initRes.headers.get('Location');
  if (!uploadUrl) throw new Error('No upload URL returned from Drive API');

  // Step 2: Upload the PPTX bytes
  const uploadRes = await fetch(uploadUrl, {
    method: 'PUT',
    headers: { 'Content-Type': PPTX_MIME },
    body: pptxBlob,
  });

  if (!uploadRes.ok) {
    const err = await uploadRes.json().catch(() => ({}));
    throw new Error(`Upload failed ${uploadRes.status}: ${JSON.stringify(err)}`);
  }

  const data = await uploadRes.json();
  const fileId = data.id as string;

  // Step 3: Convert the uploaded PPTX to Google Slides format
  const convertRes = await fetch(
    `https://www.googleapis.com/drive/v3/files/${fileId}/copy`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, mimeType: 'application/vnd.google-apps.presentation' }),
    },
  );

  if (!convertRes.ok) {
    // Conversion failed — return the raw PPTX file ID so the user can still open it
    return fileId;
  }

  const converted = await convertRes.json();
  // Clean up the original PPTX file silently
  fetch(`https://www.googleapis.com/drive/v3/files/${fileId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${accessToken}` },
  }).catch(() => {});

  return converted.id as string;
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
