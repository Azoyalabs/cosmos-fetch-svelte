import { CHAIN_ID, REGISTRY_CHAIN_NAME } from "@/constants";
import {
  type IbcExtension,
  QueryClient,
  StargateClient,
  setupIbcExtension,
} from "@cosmjs/stargate";
import type { AccountData, OfflineAminoSigner } from "@keplr-wallet/types";
import { chains } from "chain-registry";
import { CosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import { Tendermint34Client } from "@cosmjs/tendermint-rpc";
import { derived, get, writable } from "svelte/store";

export const signerStore = (() => {
  const { subscribe, set, update } = writable<{
    signer: OfflineAminoSigner;
    account: AccountData;
  } | null>(null);

  return {
    subscribe,
    connectToWallet: async () => {
      if (window.keplr) {
        const keplr = window.keplr;
        await keplr.enable([CHAIN_ID]);
        const signer = keplr.getOfflineSigner(CHAIN_ID);
        //set(signer);

        const accounts = await signer.getAccounts();
        //setAccount(accounts[0]);

        set({
          signer,
          account: accounts[0],
        });
      }
    },
  };
})();

export const isConnected = derived(signerStore, ($signerStore) => {
  return $signerStore !== null;
});

export const useQueryClient = () => {
  const { subscribe, set, update } = writable<StargateClient | null>(null);

  async function initialize() {
    const rpc = chains.find((c) => c.chain_name === REGISTRY_CHAIN_NAME)!.apis!
      .rpc![0].address;

    const client = await StargateClient.connect(rpc);

    set(client);
  }

  return {
    subscribe,
    initialize
  };
};

/*

interface QueryStore {
  queryClient: StargateClient | null;
  initialize: () => Promise<void>;
  useInitializedClient: () => Promise<StargateClient>;
}
export const useQueryClient = create<QueryStore>((set, get) => {
  return {
    queryClient: null,
    useInitializedClient: async () => {
      let client = get().queryClient;
      if (client) {
        return client;
      } else {
        await get().initialize();
        client = get().queryClient;
        return client!;
      }
    },
    initialize: async () => {
      const rpc = chains.find((c) => c.chain_name === REGISTRY_CHAIN_NAME)!
        .apis!.rpc![0].address;

      const client = await StargateClient.connect(rpc);

      set((state) => ({
        queryClient: client,
      }));
    },
  };
});

interface WasmQueryStore {
  queryClient: CosmWasmClient | null;
  initialize: () => Promise<void>;
  useInitializedClient: () => Promise<CosmWasmClient>;
}
export const useWasmQueryClient = create<WasmQueryStore>((set, get) => {
  return {
    queryClient: null,
    useInitializedClient: async () => {
      let client = get().queryClient;
      if (client) {
        return client;
      } else {
        await get().initialize();
        client = get().queryClient;
        return client!;
      }
    },
    initialize: async () => {
      const rpc = chains.find((c) => c.chain_name === REGISTRY_CHAIN_NAME)!
        .apis!.rpc![0].address;

      const client = await CosmWasmClient.connect(rpc);

      set((state) => ({
        queryClient: client,
      }));
    },
  };
});

interface TendermintQueryStore {
  queryClient: IbcExtension | null;
  initialize: () => Promise<void>;
  useInitializedClient: () => Promise<IbcExtension>;
}
export const useTendermintQueryClient = create<TendermintQueryStore>(
  (set, get) => {
    return {
      queryClient: null,
      useInitializedClient: async () => {
        let client = get().queryClient;
        if (client) {
          return client;
        } else {
          await get().initialize();
          client = get().queryClient;
          return client!;
        }
      },
      initialize: async () => {
        const rpc = chains.find((c) => c.chain_name === REGISTRY_CHAIN_NAME)!
          .apis!.rpc![0].address;

        const tm = await Tendermint34Client.connect(rpc);

        const client = setupIbcExtension(new QueryClient(tm));

        set((state) => ({
          queryClient: client,
        }));
      },
    };
  }
);
*/
