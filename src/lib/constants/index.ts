export const APP_CONFIG = {
  name: 'UseKampuni',
  version: '1.0.0',
  api: {
    version: 'v1',
    baseUrl: '/api'
  }
} as const;

export type AppConfig = typeof APP_CONFIG; 