import { createApp } from 'vue';
import ElementUI from 'element-plus';
import 'element-plus/dist/index.css'
import router from './router'
import App from './App.vue'
import axios from "axios";
import VueAxios from 'vue-axios'


let app = createApp(App);
app.use(ElementUI)
app.use(router)
app.use(VueAxios, axios)
app.mount('#app');
