import { createApp } from 'vue'
import App from './App.vue'
import VueWeb3 from "./plugins/vue-web3";
import tooltip from "./directives/tooltips.js";
import "@/assets/tooltips.css";

createApp(App)
  .use(VueWeb3)
  .directive("tooltip", tooltip)
  .mount('#app')
