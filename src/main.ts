import { createApp } from 'vue'
import LoadScript from "vue-plugin-load-script"
import App from './App.vue'

import './assets/main.css'

const app = createApp(App);
  app.use(LoadScript);

  app.mount("#app");

  
