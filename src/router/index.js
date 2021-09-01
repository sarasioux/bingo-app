import { createRouter, createWebHistory } from "vue-router";
import Game from "../pages/Game";
import Console from "../pages/Console";
import About from "../pages/About";

const routes = [
  {
    // mode: 'history',
    path: "/",
    name: "Home",
    component: Console
  },
  {
    // mode: 'history',
    path: "/about",
    name: "About",
    component: About
  },
  {
    // mode: 'history',
    path: "/2",
    name: "Game",
    component: Game
  },
  {
    // mode: 'history',
    path: "/3",
    name: "Console",
    component: Console
  }

];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router;
