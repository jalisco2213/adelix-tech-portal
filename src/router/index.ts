import {createWebHistory, createRouter} from "vue-router";
import ShieldsView from "../views/ShieldsView.vue";
import ProtocolsView from "../views/ProtocolsView.vue";


const routes = [];

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/shields',
      name: 'shields',
      component: ShieldsView,
    },
    {
      path: '/protocols',
      name: 'protocols',
      component: ProtocolsView,
    },
  ]
});

export default router;