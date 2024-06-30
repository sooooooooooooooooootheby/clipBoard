import "@/assets/sass/main.scss";
import "//at.alicdn.com/t/c/font_4604269_vu4jc9j9p1.js";

import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";

import VueMarkdownEditor from "@kangc/v-md-editor";
import "@kangc/v-md-editor/lib/style/base-editor.css";
import vuepressTheme from "@kangc/v-md-editor/lib/theme/vuepress.js";
import "@kangc/v-md-editor/lib/theme/style/vuepress.css";

import Prism from "prismjs";

VueMarkdownEditor.use(vuepressTheme, {
    Prism,
});

import router from "./router";
import axios from "axios";
axios.defaults.baseURL = "http://47.100.101.113:8080/api";

const app = createApp(App);

app.use(createPinia());
app.use(VueMarkdownEditor);
app.use(router);

app.mount("#app");
