import './assets/main.css';

import { createApp } from 'vue';
import { createPinia } from 'pinia';
import 'virtual:svg-icons-register';
import App from './App.vue';
import Svg from "@/components/svgComponent.vue";


const app = createApp(App);

app.use(createPinia());
app.component("xqSvg",Svg);
app.mount('#app');
