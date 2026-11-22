import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "GPT SEAPUS 5.5 AI STUDIO",
  description: "Your personal AI Studio",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
      <body style={{ margin: 0, fontFamily: "Arial, sans-serif" }}>
        {children}
      </body>
    </html>
  );
}
