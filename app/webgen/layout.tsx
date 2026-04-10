import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AirOps PageGen",
  description: "AI-powered landing page builder for AirOps",
};

export default function WebGenLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{ overflow: 'auto', height: '100vh' }}>
      {children}
    </div>
  );
}
