import { createApp } from 'vue'
import App from './App.vue'
import VueWeb3 from "./plugins/vue-web3";
import router from "./router";

import tooltip from "./directives/tooltips.js";
import "@/assets/tooltips.css";

createApp(App)
  .use(router)
  .use(VueWeb3)
  .directive("tooltip", tooltip)
  .mount('#app')
