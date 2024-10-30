declare namespace NodeJS {
  export interface ProcessEnv {
    NEXT_PUBLIC_API_URL: string;
    UNSPLASH_ACCESS_KEY: string;
    REPLICATE_API_TOKEN: string;
    AUTH_SECRET: string;
    AUTH_GITHUB_ID: string;
    AUTH_GITHUB_SECRET: string;
    AUTH_GOOGLE_ID: string;
    AUTH_GOOGLE_SECRET: string;
    DATABASE_URL: string;
  }
}
