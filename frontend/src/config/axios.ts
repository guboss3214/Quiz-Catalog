import axios from "axios";

declare global {
  interface ImportMetaEnv {
    readonly VITE_REACT_APP_API_URL: string;
  }

  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
}

axios.defaults.baseURL = import.meta.env.VITE_REACT_APP_API_URL;

export default axios;
