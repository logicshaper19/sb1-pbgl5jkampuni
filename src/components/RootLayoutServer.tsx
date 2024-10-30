import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'UseKampuni',
  description: 'Business Registration Platform',
};

export function RootLayoutServer({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
