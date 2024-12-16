import './globals.css';

export const metadata = {
  title: 'Chat App',
  description: 'A ChatGPT-like web UI for asking questions.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-100 text-gray-900">{children}</body>
    </html>
  );
}
