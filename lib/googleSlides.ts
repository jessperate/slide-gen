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

async function uploadPptxToDrive(accessToken: string, pptxBlob: Blob): Promise<string> {
  const metadata = {
    name: 'AirOps Deck',
    mimeType: 'application/vnd.google-apps.presentation',
  };

  const body = new FormData();
  body.append(
    'metadata',
    new Blob([JSON.stringify(metadata)], { type: 'application/json' }),
  );
  body.append('file', pptxBlob);

  const res = await fetch(
    'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart',
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${accessToken}` },
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

export async function openInGoogleSlides(pptxBlob: Blob): Promise<void> {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  if (!clientId) {
    throw new Error('NEXT_PUBLIC_GOOGLE_CLIENT_ID is not set');
  }

  await loadGsi();
  const accessToken = await getAccessToken(clientId);
  const fileId = await uploadPptxToDrive(accessToken, pptxBlob);
  window.open(`https://docs.google.com/presentation/d/${fileId}/edit`, '_blank');
}
