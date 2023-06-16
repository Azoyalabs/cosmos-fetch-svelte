import AboutView from "./routes/AboutView.svelte";
import HomeView from "./routes/HomeView.svelte";

const routes = [
  {
    name: "/",
    component: HomeView,
  },
  { name: "about", component: AboutView },
];

export { routes };
