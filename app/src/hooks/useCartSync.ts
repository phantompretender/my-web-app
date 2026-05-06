import { useEffect } from "react";
import { trpc } from "@/providers/trpc";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/hooks/useAuth";

export function useCartSync() {
  const { user, isAuthenticated } = useAuth();
  const { setCartItems } = useCart();

  const { data: serverCart } = trpc.cart.get.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  useEffect(() => {
    if (serverCart?.items && serverCart.items.length > 0) {
      setCartItems(
        serverCart.items.map((item) => ({
          id: item.id,
          userId: item.userId,
          productId: item.productId,
          quantity: item.quantity,
          product: {
            id: item.product.id,
            name: item.product.name,
            price: item.product.price,
            imageUrl: item.product.imageUrl,
          },
        }))
      );
    }
  }, [serverCart, setCartItems]);
}
