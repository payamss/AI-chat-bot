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
      <body className="bg-primary-neutral-gray-900 text-gray-300 min-h-screen">
        {children}
      </body>
    </html>
  );
}
