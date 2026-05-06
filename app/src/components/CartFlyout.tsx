import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Minus, ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { trpc } from "@/providers/trpc";
import { Link } from "react-router";

export default function CartFlyout() {
  const { isOpen, closeCart, cartItems, removeItem, updateQuantity, totalPrice } = useCart();
  const utils = trpc.useUtils();

  const updateMutation = trpc.cart.update.useMutation({
    onSuccess: () => utils.cart.get.invalidate(),
  });
  const removeMutation = trpc.cart.remove.useMutation({
    onSuccess: () => utils.cart.get.invalidate(),
  });

  const handleUpdateQuantity = (itemId: number, newQuantity: number) => {
    if (newQuantity < 1) {
      removeItem(itemId);
      removeMutation.mutate({ itemId });
      return;
    }
    updateQuantity(itemId, newQuantity);
    updateMutation.mutate({ itemId, quantity: newQuantity });
  };

  const handleRemove = (itemId: number) => {
    removeItem(itemId);
    removeMutation.mutate({ itemId });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/30 z-[200]"
            onClick={closeCart}
          />

          {/* Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed top-0 right-0 bottom-0 w-full max-w-[420px] bg-white z-[200] shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-borderMuted">
              <h2 className="font-serif text-xl text-rose-deep">Your Collection</h2>
              <button
                onClick={closeCart}
                className="p-2 text-foreground/60 hover:text-rose-deep transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {cartItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <ShoppingBag size={48} className="text-borderMuted mb-4" strokeWidth={1} />
                  <p className="font-serif text-lg text-foreground/60 mb-2">Your cart is empty</p>
                  <button
                    onClick={closeCart}
                    className="text-sm text-rose-coral hover:text-rose-deep transition-colors underline"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {cartItems.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: 50 }}
                      className="flex gap-4 pb-4 border-b border-borderMuted/50"
                    >
                      {/* Image */}
                      <div className="w-20 h-24 rounded-pill overflow-hidden border border-borderMuted flex-shrink-0">
                        <img
                          src={item.product.imageUrl || "/images/products/eternal-rose.jpg"}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Details */}
                      <div className="flex-1 min-w-0">
                        <Link
                          to={`/product/${item.product.id}`}
                          onClick={closeCart}
                          className="font-serif text-sm text-foreground truncate block hover:text-rose-coral transition-colors"
                        >
                          {item.product.name}
                        </Link>
                        <p className="text-xs text-rose-coral font-medium mt-1">
                          ${(item.product.price / 100).toFixed(2)}
                        </p>

                        <div className="flex items-center gap-2 mt-2">
                          <button
                            onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                            className="w-6 h-6 rounded-full border border-borderMuted flex items-center justify-center text-foreground/60 hover:border-rose-coral transition-colors"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                          <button
                            onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                            className="w-6 h-6 rounded-full border border-borderMuted flex items-center justify-center text-foreground/60 hover:border-rose-coral transition-colors"
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                      </div>

                      {/* Remove */}
                      <button
                        onClick={() => handleRemove(item.id)}
                        className="text-foreground/40 hover:text-rose-deep transition-colors self-start"
                      >
                        <X size={16} />
                      </button>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {cartItems.length > 0 && (
              <div className="border-t border-borderMuted px-6 py-5">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-foreground/70">Subtotal</span>
                  <span className="font-serif text-lg text-rose-deep">
                    ${(totalPrice / 100).toFixed(2)}
                  </span>
                </div>
                <button className="w-full h-12 bg-rose-deep text-white font-sans text-sm font-medium rounded-lg hover:bg-rose-deep/90 transition-colors">
                  Checkout
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
