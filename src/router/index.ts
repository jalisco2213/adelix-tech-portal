import {createWebHashHistory, createRouter} from "vue-router";
import {supabase} from "../ts/client/supabase";

let localUser;

const routes = [
  {
    path: '/',
    name: 'login',
    component: () => import('../views/LoginView.vue')
  },
  {
    path: '/shields',
    name: 'shields',
    component: () => import('../views/ShieldsView.vue'),
    meta: { requiresAuth: true},
  },
  {
    path: '/protocols',
    name: 'protocols',
    component: () => import('../views/ProtocolsView.vue'),
    meta: { requiresAuth: true},
  },
  {
    path: '/storage',
    name: 'storage',
    component: () => import('../views/StorageView.vue'),
    meta: { requiresAuth: true},
  },
  {
    path: '/registration',
    name: 'registration',
    component: () => import('../views/RegistrationView.vue'),
    meta: { requiresAuth: true},
  },
  {
    path: '/repository',
    name: 'repository',
    component: () => import('../views/RepositoryView.vue'),
    meta: { requiresAuth: true},
  },
  {
    path: '/list-shields',
    name: 'list-shields',
    component: () => import('../views/ListShieldsView.vue'),
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
