import type { Metadata } from 'next';
import '@styles/globals.css';

export const metadata: Metadata = {
  title: 'Blair Health',
  description: 'Blair Health',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content="Blair Health" />
        <title>Blair Health</title>
      </head>
      <body className="bg-gray-100">
        <div className="mx-auto min-h-screen max-w-md shadow-xl">
          {children}
        </div>
      </body>
    </html>
  );
}
