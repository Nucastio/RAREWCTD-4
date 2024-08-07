import { create } from "zustand";

export interface IAccount {
  stake_address?: string | null;
  address?: string;
  assets: string[];
}

interface WalletStore {
  isLoading: boolean;
  setIsLoading: (w: boolean) => void;
  connected_wallet: string | null;
  setWallet: (wallet: string) => void;
  account: IAccount | null;
  saveAccount: (acc: IAccount) => void;
  resetWallet: () => void;
}

export const useWalletStore = create<WalletStore>()((set) => ({
  account: null,
  connected_wallet: null,
  isLoading: true,
  resetWallet: () => set(() => ({ connected_wallet: null, account: null })),
  saveAccount: (acc) => set(() => ({ account: acc })),
  setIsLoading: (l) => set(() => ({ isLoading: l })),
  setWallet: (wallet) => set(() => ({ connected_wallet: wallet })),
}));
