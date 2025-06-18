/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_RAZORPAY_KEY_ID: string;
  readonly VITE_APP_NAME: string;
  readonly VITE_DEFAULT_ROI_RATE: string;
  readonly VITE_MAX_ROI_RETURN: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
