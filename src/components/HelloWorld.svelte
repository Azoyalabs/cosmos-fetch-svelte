<script lang="ts">
  import { CHAIN_NAME, PRETTY_NAME } from "@/constants";

  export let msg: string;
</script>

<div class="greetings">
  <h1 class="green">{msg}</h1>
  <h3>
    You’ve successfully created a project with
    <a href="https://vitejs.dev/" target="_blank" rel="noopener"> Vite </a>
    +
    <a href="https://svelte.dev/" target="_blank" rel="noopener">
      Svelte
    </a>
    on the
    <span id="chain-name">
      {PRETTY_NAME}
      {CHAIN_NAME}
    </span>
    network. What's next?
  </h3>
</div>


<style>
  h1 {
    font-weight: 500;
    font-size: 2.6rem;
    top: -10px;
  }
  
  h3 {
    font-size: 1.2rem;
  }
  
  .greetings h1,
  .greetings h3 {
    text-align: center;
  }
  
  .greetings #chain-name {
    text-transform: uppercase;
    font-weight: bold;
    color: var(--color-heading)
  }
</style>