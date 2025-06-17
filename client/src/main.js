import { createApp } from "vue";
import { createPinia } from "pinia";
import { createI18n } from "vue-i18n";
import App from "@/App.vue";
import router from "@/router";
import en from "@/locales/en.json";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faArrowLeftLong, faCheck } from "@fortawesome/free-solid-svg-icons";
import { faGoogle, faFacebook } from "@fortawesome/free-brands-svg-icons";

library.add(faArrowLeftLong, faCheck, faGoogle, faFacebook);

const app = createApp(App);

app.use(router);
app.use(createPinia());
app.use(
  createI18n({
    legacy: false,
    locale: "en",
    fallbackLocale: "en",
    messages: {
      en,
    },
  })
);
// eslint-disable-next-line
app.component("fa", FontAwesomeIcon);
app.config.globalProperties.$env = process.env;
app.mount("#app");
