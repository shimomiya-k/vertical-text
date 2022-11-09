import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import { key, store } from "./store";

const app = createApp(App);
app.use(store, key);
app.mount("#app");
