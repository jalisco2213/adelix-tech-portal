import {createWebHashHistory, createRouter} from "vue-router";
import {supabase} from "../ts/client/supabase";
import ShieldsView from "@/views/ShieldsView.vue";
import ProtocolsView from "@/views/ProtocolsView.vue";
import StorageView from "../views/StorageView.vue";
import LoginView from "../views/LoginView.vue";

let localUser;

const routes = [
  {
    path: '/',
    name: 'login',
    component: LoginView,
  },
  {
    path: '/shields',
    name: 'shields',
    component: ShieldsView,
    meta: { requiresAuth: true},
  },
  {
    path: '/protocols',
    name: 'protocols',
    component: ProtocolsView,
    meta: { requiresAuth: true},
  },
  {
    path: '/storage',
    name: 'storage',
    component: StorageView,
    meta: { requiresAuth: true},
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});


async function getUser(next) {
  localUser = await supabase.auth.getSession();
  if (localUser.data.session === null) {
    next("/");
  } else {
    next();
  }
}

router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth) {
    getUser(next);
  }
  else {
    next();
  }
})

export default router;
