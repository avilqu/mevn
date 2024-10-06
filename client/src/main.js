import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "@/App.vue";
import router from "@/router";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { fab } from "@fortawesome/free-brands-svg-icons";
library.add(fas);
library.add(fab);

const app = createApp(App);

app.use(router);
app.use(createPinia());
// eslint-disable-next-line
app.component("fa", FontAwesomeIcon);
app.mount("#app");
