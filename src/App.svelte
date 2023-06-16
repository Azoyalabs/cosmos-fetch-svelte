<script lang="ts">
  import svelteLogo from "./assets/svelte.svg";
  import viteLogo from "/vite.svg";
  import HelloWorld from "./components/HelloWorld.svelte";
  import { routes } from "./routes";
  import { Router } from "svelte-router-spa";
</script>

<header>
  <img
    alt="Svelte logo"
    class="logo svelte"
    src={svelteLogo}
    width="120"
    height="120"
  />

  <div class="wrapper">
    <HelloWorld msg="Welcome to Web3!" />
    <nav>
      <a href="/">Home</a>
      <a href="/about">About</a>

      <!-- <Link to={"/"}>Home</Link> -->
      <!-- <Link to={"/about"}>About</Link> -->
    </nav>
  </div>
</header>
<div>
  <Router {routes} />
</div>

<style>
  .logo {
    will-change: filter;
    transition: filter 300ms;
  }
  .logo:hover {
    filter: drop-shadow(0 0 2em #646cffaa);
  }
  .logo.svelte:hover {
    filter: drop-shadow(0 0 2em #ff3e00aa);
  }

  header {
    line-height: 1.5;
    max-height: 100vh;
    justify-content: center;
    flex-direction: column;
    display: flex;
    padding-left: 2rem;
    place-items: center;
    padding-right: 2rem;
  }

  .logo {
    display: block;
  }

  nav {
    width: 100%;
    min-width: 260px;
    font-size: 12px;
    text-align: center;
    margin-top: 2rem;
  }

  nav a.router-link-exact-active {
    color: var(--color-text);
  }

  nav a.router-link-exact-active:hover {
    background-color: transparent;
  }

  nav a {
    display: inline-block;
    padding: 0 1rem;
    border-left: 1px solid var(--color-border);
  }

  nav a:first-of-type {
    border: 0;
  }

  @media (min-width: 1024px) {
    header {
      place-items: center;
      padding-right: calc(var(--section-gap) / 2);
    }


    header .wrapper {
      display: flex;
      place-items: flex-start;
      flex-wrap: wrap;
    }

    nav {
      margin-left: -1rem;
      font-size: 1rem;

      padding: 1rem 0;
      margin-top: 1rem;
    }
  }
</style>
