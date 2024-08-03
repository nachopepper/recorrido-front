import { createApp } from "vue";
import App from "./App.vue";
import { Quasar } from "quasar";
import quasarUserOptions from "./quasar-user-options";
import moment from "moment";
import router from './router'

moment.updateLocale("es", {
  week: {
    dow: 1, // Monday is the first day of the week
  },
});

createApp(App).use(router).use(Quasar, quasarUserOptions).mount("#app");
