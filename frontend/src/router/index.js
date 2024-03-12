import { createRouter, createWebHistory } from "vue-router";
import Main from "@/views/Main.vue";
import Login from "@/views/Login.vue";
import Monitoring from "@/views/Monitoring.vue";
import { useStore } from "vuex";
import store from "@/store";
import jwtDecode from "jwt-decode";

const routes = [
  {
    path: "/",
    name: "Main",
    component: Main,
    redirect: "/login",
    meta: {
      title: "Main",
    },
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
    meta: {
      title: "Login",
    },
  },
  {
    path: "/monitoring",
    name: "Monitoring",
    component: Monitoring,
    meta: {
      title: "Monitoring",
    },
  },
  {
    path: "/:pathMatch(.*)*",
    component: Main,
    redirect: "/login",
    meta: {
      title: "Main",
    },
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.URL),
  routes,
});

const isTokenExpired = (token) => {
  const decodedToken = jwtDecode(token);
  const currentTime = Date.now() / 1000; // Convert to seconds

  return decodedToken.exp < currentTime;
}

router.beforeEach((to, _, next) => {
  if (typeof to.meta.title === "string") {
    document.title = "Web Monitoring | " + to.meta.title;
  }

  // Redirect to Login when access token expired
  if ((store.getters.user.data == null) && to.name == "Login") {
    next();
  }
  else if (store.getters.user.data) {
    if (isTokenExpired(store.getters.user.data.accessToken)) {
      store.dispatch("logOut");
      window.location.href = "/login";
    }
    else {
      next();
    }
  } else {
    next()
  }

});

export default router;
