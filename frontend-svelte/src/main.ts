import { mount } from "svelte";
import "./assets/css/style.css";
import App from "./App.svelte";

const app = mount(App, {
  target: document.getElementById("root")!,
});

export default app;
