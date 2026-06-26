import { useEffect } from 'react';
import useCartStore from '../store/cartStore';
import useAuthStore from '../store/authStore';

/**
 * Hook to auto-fetch cart when user is authenticated
 */
export const useCart = () => {
  const cart = useCartStore();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated()) {
      cart.fetchCart();
    }
  }, []);

  return cart;
};
