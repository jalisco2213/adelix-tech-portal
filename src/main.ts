import { createApp } from 'vue'
import './assets/normalize.css';
import './assets/common.scss';

import App from './App.vue'
// import router from './router'

const app = createApp(App)

// app.use(router) //use router
app.mount('#app')
