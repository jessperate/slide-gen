import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'AirOps SlideGen — AI-powered presentation builder';
export const size = { width: 1200, height: 675 }; // 16:9
export const contentType = 'image/png';

export default async function Image() {
  const host = process.env.VERCEL_URL ?? 'localhost:3000';
  const base = process.env.VERCEL_URL ? `https://${host}` : `http://${host}`;

  const [saansBold, saansRegular, serrifVF] = await Promise.all([
    fetch(`${base}/fonts/Saans-Bold.ttf`).then((r) => r.arrayBuffer()),
    fetch(`${base}/fonts/Saans-Regular.ttf`).then((r) => r.arrayBuffer()),
    fetch(`${base}/fonts/SerrifVF.ttf`).then((r) => r.arrayBuffer()),
  ]);

  // AirOps logo paths (white)
  const logoPaths = [
    'M111.828 65.6415V88.4663C101.564 72.0112 85.627 61.9258 65.9084 61.9258C23.7703 61.9258 0 92.9782 0 134.647C0 176.581 24.0404 208.695 66.4487 208.695C86.1672 208.695 101.834 198.609 111.828 182.154V204.979H144.782V65.6415H111.828ZM72.9315 181.093C48.8911 181.093 35.1152 159.064 35.1152 134.647C35.1152 110.76 48.621 89.7933 73.4717 89.7933C94.0006 89.7933 111.558 104.391 111.558 134.116C111.558 163.31 94.8109 181.093 72.9315 181.093Z',
    'M173.137 65.6494V204.987H208.252V65.6494H173.137Z',
    'M272.998 100.141V65.6386H237.883V204.976H272.998V125.355C272.998 104.919 287.314 96.691 300.82 96.691C308.653 96.691 316.757 98.8143 321.079 100.407V63.25C298.119 63.25 279.211 76.7856 272.998 100.141Z',
    'M329.629 108.115C329.629 151.377 359.882 182.163 403.371 182.163C447.13 182.163 477.115 151.377 477.115 108.115C477.115 65.6507 447.13 35.3945 403.371 35.3945C359.882 35.3945 329.629 65.6507 329.629 108.115ZM441.997 108.115C441.997 135.187 427.141 154.561 403.371 154.561C379.33 154.561 364.744 135.187 364.744 108.115C364.744 82.1058 379.33 63.2621 403.371 63.2621C427.141 63.2621 441.997 82.1058 441.997 108.115Z',
    'M575.086 61.9258C554.557 61.9258 537.81 73.869 528.896 92.9782V65.6415H493.781V251.425H528.896V180.031C538.891 197.282 557.529 208.695 577.247 208.695C615.604 208.695 642.345 179.235 642.345 137.035C642.345 92.7128 614.523 61.9258 575.086 61.9258ZM568.874 182.685C545.374 182.685 528.896 163.31 528.896 135.708C528.896 107.31 545.374 87.4047 568.874 87.4047C591.293 87.4047 607.23 107.841 607.23 136.77C607.23 163.841 591.293 182.685 568.874 182.685Z',
    'M653.555 156.675C653.555 181.889 676.244 208.695 721.624 208.695C767.274 208.695 783.751 182.42 783.751 161.983C783.751 130.666 746.205 125.092 721.084 120.315C704.066 117.395 693.262 115.007 693.262 105.452C693.262 94.5706 705.417 87.6701 718.383 87.6701C735.94 87.6701 742.693 99.6133 743.233 112.353H778.349C778.349 91.6511 763.492 61.9258 717.572 61.9258C677.865 61.9258 658.147 83.9544 658.147 107.575C658.147 141.282 696.233 144.732 721.354 149.509C735.94 152.163 748.636 155.348 748.636 165.699C748.636 176.05 736.21 182.95 722.975 182.95C710.549 182.95 688.67 176.05 688.67 156.675H653.555Z',
    'M191.339 48.6576C176.921 48.6576 166.578 38.4949 166.578 24.6368C166.578 10.7786 176.921 0 191.339 0C205.13 0 216.1 10.7786 216.1 24.6368C216.1 38.4949 205.13 48.6576 191.339 48.6576Z',
  ];

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          background: '#002910',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Main content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            padding: '80px 96px',
            justifyContent: 'center',
          }}
        >
          {/* Eyebrow */}
          <div
            style={{
              fontSize: 20,
              color: '#00ff64',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              marginBottom: 32,
              fontFamily: 'Saans',
              fontWeight: 700,
              display: 'flex',
            }}
          >
            AirOps 2026
          </div>

          {/* Headline line 1 */}
          <div
            style={{
              fontSize: 100,
              color: '#ffffff',
              lineHeight: 1.0,
              fontFamily: 'Serrif VF',
              fontWeight: 400,
              display: 'flex',
            }}
          >
            Content operations
          </div>

          {/* Headline line 2 */}
          <div
            style={{
              fontSize: 100,
              color: '#ffffff',
              lineHeight: 1.0,
              fontFamily: 'Serrif VF',
              fontWeight: 400,
              marginBottom: 40,
              display: 'flex',
            }}
          >
            at scale.
          </div>

          {/* Subheadline */}
          <div
            style={{
              fontSize: 26,
              color: 'rgba(255,255,255,0.45)',
              fontFamily: 'Saans',
              fontWeight: 400,
              display: 'flex',
            }}
          >
            AI-powered workflows for modern marketing teams
          </div>
        </div>

        {/* Bottom strip: logo + green bar */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '0 48px 20px',
            }}
          >
            {/* AirOps logo (white, ~100px wide) */}
            <svg
              width={100}
              height={Math.round(100 * (252 / 784))}
              viewBox="0 0 784 252"
              fill="none"
            >
              {logoPaths.map((d, i) => (
                <path key={i} d={d} fill="rgba(255,255,255,0.4)" />
              ))}
            </svg>
          </div>

          {/* Green accent bar */}
          <div
            style={{
              height: 8,
              background: '#00ff64',
              width: '100%',
              display: 'flex',
            }}
          />
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: 'Saans', data: saansBold, weight: 700, style: 'normal' },
        { name: 'Saans', data: saansRegular, weight: 400, style: 'normal' },
        { name: 'Serrif VF', data: serrifVF, weight: 400, style: 'normal' },
      ],
    },
  );
}
