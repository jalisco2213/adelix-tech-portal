import {createWebHashHistory, createRouter} from "vue-router";
import ShieldsView from "@/views/ShieldsView.vue";
import ProtocolsView from "@/views/ProtocolsView.vue";

const routes = [
  {
    path: '/shields',
    name: 'shields',
    component: ShieldsView,
  },
  {
    path: '/',
    name: 'protocols',
    component: ProtocolsView,
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
