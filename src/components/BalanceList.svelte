<script lang="ts">
  import type { Coin } from "@cosmjs/stargate";
  export let balances: Coin[];
  export let title: string;
</script>

<div class="balances-container">
  <h4>
    {title}
  </h4>
  <ul>
    {#each balances as balance (balance.denom)}
      <li>
        {balance.amount} <span class="symbol">{balance.denom}</span>
      </li>
    {/each}
  </ul>
</div>

<style>
  .balances-container {
    margin-top: 1.2rem;
  }

  h4 {
    color: white;
    font-weight: bold;
  }
</style>
