import HomePage from "@/components/HomePage.vue";
import SignUp from "@/components/SignUp.vue";
import SignIn from "@/components/SignIn.vue";
import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/home',
      component: HomePage
    },
    {
      path: '/sign-up',
      component: SignUp
    },
    {
      path: '/',
      component: SignIn
    }
  ]
})

export default router