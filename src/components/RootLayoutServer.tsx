import type { Metadata } from 'next';

// Define the correct type for constants
interface AppConfig {
  APP_NAME: string;
  API_VERSION: string;
  title: string;
  description: string;
}

const config: AppConfig = {
  APP_NAME: 'UseKampuni',
  API_VERSION: 'v1',
  title: 'UseKampuni',
  description: 'Company search platform'
};

export const metadata: Metadata = {
  title: config.title,
  description: config.description,
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
