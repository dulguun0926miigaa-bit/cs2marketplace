import { create } from 'zustand';
import { walletService } from '../services/marketplace.service';

const useWalletStore = create((set) => ({
  balance: 0,
  currency: 'USD',
  isLoading: false,
  transactions: [],

  fetchBalance: async () => {
    set({ isLoading: true });
    try {
      const { data } = await walletService.getBalance();
      set({
        balance: data.data.balance,
        currency: data.data.currency,
        isLoading: false,
      });
    } catch {
      set({ isLoading: false });
    }
  },

  setBalance: (balance) => set({ balance }),

  createDeposit: async (amount, method = 'CARD') => {
    try {
      const { data } = await walletService.createDeposit(amount, method);
      return { success: true, session: data.data.session };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Deposit failed' };
    }
  },

  confirmDeposit: async (sessionId) => {
    try {
      const { data } = await walletService.confirmDeposit(sessionId);
      set({ balance: data.data.balance });
      return { success: true, balance: data.data.balance, deposited: data.data.deposited };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Confirmation failed' };
    }
  },

  fetchTransactions: async (page = 1) => {
    try {
      const { data } = await walletService.getTransactions({ page });
      set({ transactions: data.data.transactions });
      return data.data;
    } catch {
      return null;
    }
  },
}));

export default useWalletStore;
