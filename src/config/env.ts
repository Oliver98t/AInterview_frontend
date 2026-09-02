export interface AppEnv {
  VITE_COGNITO_DOMAIN?: string;
  VITE_COGNITO_AUTHORITY?: string;
  VITE_AUTH0_CLIENT_ID?: string;
  VITE_AWS_SECRET_ACCESS_KEY?: string;
  VITE_AWS_ACCESS_KEY_ID?: string;
  VITE_RESPONSE_URL?: string;
  VITE_LOCAL_TEST?: boolean;
}

export const appEnv: AppEnv = globalThis.__APP_ENV__ ?? {};