import { mount } from "svelte";
import { initializeApp } from "firebase/app";

import App from "./App.svelte";
import "./i18n.js";

initializeApp({
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
});

const app = mount(App, { target: document.body });

export default app;
