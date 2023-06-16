<script lang="ts">
  import ExplainContainer from "@/components/ExplainContainer.svelte";
  import PrimaryButton from "@/components/PrimaryButton.svelte";
  import IconDocumentation from "@/components/icons/IconDocumentation.svelte";
  import {
    CHAIN_NAME,
    FNS_NFT_ADDRESS,
    FNS_NFT_TOKEN_ID,
    LUNA_CW20_ADDRESS,
    LUNA_CW20_OWNER_ADDRESS,
    REGISTRY_CHAIN_NAME,
  } from "@/constants";
  import { isConnected, signerStore } from "@/stores/wallet";
  import BalanceList from "@/components/BalanceList.svelte";
  import type { Coin } from "@keplr-wallet/types";
  import type { DenomTrace } from "cosmjs-types/ibc/applications/transfer/v1/transfer";
  import IconTooling from "@/components/icons/IconTooling.svelte";
  import IconCommunity from "@/components/icons/IconCommunity.svelte";
  import { onMount } from "svelte";
  import IconEcosystem from "@/components/icons/IconEcosystem.svelte";
  import { Tendermint34Client } from "@cosmjs/tendermint-rpc";
  import { chains } from "chain-registry";
  import {
    QueryClient,
    StargateClient,
    setupIbcExtension,
  } from "@cosmjs/stargate";
  import { fetchCW20Balance, fetchCW721Info } from "@/lib/queries";
  import { CosmWasmClient } from "@cosmjs/cosmwasm-stargate";
  import { findAssetFromDenom } from "@/lib/utils";

  let balances: readonly Coin[] | null = null;
  let smartBalances: readonly Coin[] | null = null;

  let ibcDenoms: DenomTrace[] | null = null;
  let cw20Info: {
    name: string;
    symbol: string;
    balance: number;
  } | null = null;

  let cw721Info: {
    name: string;
    owner: string;
    symbol: string;
    image: string;
    description: string;
  } | null = null;
  const rpc = chains.find((c) => c.chain_name === REGISTRY_CHAIN_NAME)!.apis!
    .rpc![0].address;
  const cosmwasmClient = CosmWasmClient.connect(rpc);
  const stargateClient = StargateClient.connect(rpc);

  onMount(async () => {
    const tm = await Tendermint34Client.connect(rpc);
    const tmQueryclient = setupIbcExtension(new QueryClient(tm));

    const { denomTraces } = await tmQueryclient.ibc.transfer.allDenomTraces();
    ibcDenoms = denomTraces;
  });

  signerStore.subscribe(async (s) => {
    if (s) {
      const initialized = await stargateClient;

      balances = await initialized.getAllBalances(s.account.address);

      smartBalances = balances
        .map((b) => {
          return {
            ...findAssetFromDenom(b.denom),
            ...b,
          };
        })
        .map((c) => {
          // NOTE: chain-registry is misconfigured for atestfet
          const decimals =
            c.denom_units?.find(
              (d) => d.denom === c.display || d.denom === "testfet"
            )?.exponent ?? 1;
          return {
            amount: (Math.pow(10, -decimals) * parseInt(c.amount)).toString(),
            denom: c.display ?? c.denom,
          };
        });
    }
  });
</script>

<main>
  <ExplainContainer>
    <svelte:fragment slot="icon">
      <IconDocumentation />
    </svelte:fragment>
    <svelte:fragment slot="heading">Wallet Connection</svelte:fragment>

    <div>
      {#if $isConnected}
        <div>Your connected wallet address is:</div>
        {#if $signerStore.account}
          <div class="address">
            {$signerStore.account.address}
          </div>
        {/if}
      {:else}
        <div>
          <PrimaryButton on:click={signerStore.connectToWallet}>
            Connect to your fetch wallet
          </PrimaryButton>
        </div>
      {/if}
      <div class="mt-2">
        Your crypto address is a unique identifier, it is used to receive and
        send messages, interact with the network and handle funds.
      </div>
    </div>
  </ExplainContainer>

  <ExplainContainer>
    <svelte:fragment slot="icon">
      <IconTooling />
    </svelte:fragment>
    <svelte:fragment slot="heading">Bank Balances</svelte:fragment>

    An address' balances can be queried using the Stargate or CosmWasm client.
    These balances are raw and you'll need to take into account both the
    decimals and the actual token denomination to display something
    comprehensible to the users. Your own balances will be shown after
    connecting your wallet.

    {#if balances}
      <div>
        <BalanceList balances={[...balances]} title="Raw Balances" />
      </div>
    {/if}
    {#if smartBalances}
      <div>
        <BalanceList balances={[...smartBalances]} title="Parsed Balances" />
      </div>
    {/if}
    <br />

    These balances will also include Interchain tokens, most commonly known as
    IBC tokens. You'll be able to spot them thanks to their special denomination
    as it starts with <code>ibc</code>.<br />

    {#if ibcDenoms}
      <div>
        <h4>
          The {CHAIN_NAME} network handles {ibcDenoms.length} such assets.
        </h4>
        {#if ibcDenoms.length > 0}
          <div class="mt-2">
            These are:
            <ul>
              {#each ibcDenoms as ibc (ibc.baseDenom)}
                <li>
                  <span class="symbol">{ibc.baseDenom}</span> using the ibc path {ibc.path}
                </li>
              {/each}
            </ul>
          </div>
        {/if}
      </div>
    {/if}

    <br />
    Any time you find yourself dealing with such a denomination, you can use the
    <code
      >ibc extension for the tendermint client and its ibc.transfer.denomTrace</code
    >
    to translate it into one of the human readable symbol, we've just shown. Token
    informations can usually be found in the
    <a href="https://github.com/cosmos/chain-registry"
      >chain registry repository</a
    >.
  </ExplainContainer>

  <ExplainContainer>
    <svelte:fragment slot="icon">
      <IconCommunity />
    </svelte:fragment>
    <svelte:fragment slot="heading"
      >Smart contract - Token (CW20)</svelte:fragment
    >
    The Cosmos ecosystem has its own version of the ERC20 token standard from EVM
    chains. These are treated differently from native denominations and require CosmWasm
    and a CosmWasm client to be interacted with.<br />
    Contrary to Native denominations, CW20 includes optional marketing info fields.
    <div class="mt-2">
      Balance for <span class="address">{LUNA_CW20_OWNER_ADDRESS}</span> on the
      sample <span class="address">{LUNA_CW20_ADDRESS}</span> token:
    </div>
    <div class="mt-2">
      {#if cw20Info}
        <div>
          <div>
            <div>
              <div>
                {cw20Info.name}
              </div>

              <div>
                {cw20Info.balance.toFixed(5)}
                <span class="symbol">
                  {cw20Info.symbol}
                </span>
              </div>
            </div>
          </div>
        </div>
      {:else}
        <div>
          <PrimaryButton
            on:click={async () => {
              const info = await fetchCW20Balance(await cosmwasmClient);
              cw20Info = info;
            }}>Query balance</PrimaryButton
          >
        </div>
      {/if}
    </div>
  </ExplainContainer>

  <ExplainContainer>
    <svelte:fragment slot="icon">
      <IconCommunity />
    </svelte:fragment>
    <svelte:fragment slot="heading"
      >Smart contract - NFT (CW721)</svelte:fragment
    >

    <div>
      Just like the CW20 standard, the CW721 standard is inspired by the EVM
      one. You can query any NFT collection, its information and all of its
      individual tokens using a CosmWasm compatible client.

      <div class="mt-2">
        NFT Info for <span class="symbol">{FNS_NFT_TOKEN_ID}</span> from the
        <span class="address">{FNS_NFT_ADDRESS}</span> collection.
      </div>
    </div>

    <div class="mt-2">
      {#if cw721Info}
        <div>
          <div class="nft__container">
            <div class="placeholder">
              <img src={cw721Info.image} />
            </div>
            <div class="">
              <div class="nft__container-title">
                {cw721Info.name}
                <span class="symbol">
                  ({cw721Info.symbol})
                </span>
              </div>

              <div>
                <div>
                  <h5>Owner</h5>
                  {cw721Info.owner}
                </div>
                <div>
                  <h5>Description</h5>

                  {cw721Info.description}
                </div>
              </div>
            </div>
          </div>
        </div>
      {:else}
        <div>
          <PrimaryButton
            on:click={async () => {
              const info = await fetchCW721Info(await cosmwasmClient);
              cw721Info = info;
            }}>Query NFT info</PrimaryButton
          >
        </div>
      {/if}
    </div>
  </ExplainContainer>

  <ExplainContainer>
    <svelte:fragment slot="icon">
      <IconEcosystem />
    </svelte:fragment>
    <svelte:fragment slot="heading">Ecosystem</svelte:fragment>

    If you need more resources on developing for Cosmos chains, we suggest
    paying
    <a
      href="https://github.com/cosmos/awesome-cosmos"
      target="_blank"
      rel="noopener">Awesome Cosmos</a
    >
    a visit.

    <br />You can also discover innovative projects on the Fetch.ai blockchain
    on their
    <a href="https://fetch.ai/ecosystem/" target="_blank" rel="noopener"
      >ecosystem page</a
    >.
  </ExplainContainer>
</main>

<style global>
  .nft__container {
    display: flex;
    margin-top: 1rem;
  }

  .nft__container-title {
    font-size: large;
    color: var(--color-heading);
    font-weight: 500;
  }

  .nft__container-title span {
    text-transform: uppercase;
    font-weight: 600;
    font-size: smaller;
  }

  .symbol,
  .address {
    color: var(--color-heading);
    font-weight: 600;
    font-size: smaller;
  }

  .symbol {
    text-transform: uppercase;
  }

  .mt-2 {
    margin-top: 1rem;
  }

  .placeholder {
    background-color: var(--color-background-mute);
    border-radius: 12px;
    width: 120px;
    height: 120px;
    margin-right: 1rem;
    overflow: hidden;
  }

  .placeholder img {
    width: 100%;
    height: 100%;
  }
</style>
