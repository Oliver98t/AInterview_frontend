// Allow importing CSS files in TypeScript
declare module '*.css';
/// <reference types="vite/client" />

interface ImportMetaEnv {
	readonly VITE_API_URL?: string;
    readonly VITE_AWS_SECRET_ACCESS_KEY?: string;
    readonly VITE_AWS_ACCESS_KEY_ID?: string;
    readonly VITE_RESPONSE_URL?: string;
    readonly VITE_LOCAL_TEST?: boolean;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}