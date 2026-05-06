import { useState } from "react";
import { useParams, Link } from "react-router";
import { motion } from "framer-motion";
import { Heart, Minus, Plus, ArrowLeft, ShoppingBag } from "lucide-react";
import PillArchImage from "@/components/PillArchImage";
import { trpc } from "@/providers/trpc";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const productId = Number(id);
  const { data: product, isLoading } = trpc.product.getById.useQuery({ id: productId });
  const { data: allProducts } = trpc.product.list.useQuery();
  const [quantity, setQuantity] = useState(1);
  const { openCart } = useCart();
  const utils = trpc.useUtils();

  const addToCart = trpc.cart.add.useMutation({
    onSuccess: () => {
      utils.cart.get.invalidate();
      openCart();
    },
  });

  const handleAddToCart = () => {
    addToCart.mutate({ productId, quantity });
    toast.success(`${product?.name} has been added to your collection`);
  };

  const relatedProducts = allProducts?.filter((p) => p.id !== productId).slice(0, 4);

  if (isLoading) {
    return (
      <main className="pt-24 lg:pt-32 pb-24 px-6 lg:px-8 bg-stone min-h-screen">
        <div className="max-w-7xl mx-auto animate-pulse">
          <div className="flex flex-col lg:flex-row gap-12">
            <div className="lg:w-[55%] aspect-[3/4] rounded-pill bg-borderMuted/50" />
            <div className="lg:w-[45%] space-y-4">
              <div className="h-8 bg-borderMuted/50 rounded w-3/4" />
              <div className="h-6 bg-borderMuted/50 rounded w-1/4" />
              <div className="h-4 bg-borderMuted/50 rounded w-full" />
              <div className="h-4 bg-borderMuted/50 rounded w-2/3" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="pt-24 lg:pt-32 pb-24 px-6 lg:px-8 bg-stone min-h-screen text-center">
        <p className="font-serif text-xl text-foreground/60">Product not found</p>
        <Link to="/shop" className="text-rose-coral hover:text-rose-deep mt-4 inline-block">
          Back to Shop
        </Link>
      </main>
    );
  }

  return (
    <main className="pt-24 lg:pt-32 pb-24 px-6 lg:px-8 bg-stone min-h-screen">
      <div className="max-w-7xl mx-auto">
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 text-sm text-foreground/60 hover:text-rose-coral transition-colors mb-8"
        >
          <ArrowLeft size={16} />
          Back to Collection
        </Link>

        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
          {/* Image Area */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:w-[55%]"
          >
            <div className="max-w-[500px] mx-auto lg:mx-0">
              <PillArchImage
                src={product.imageUrl || "/images/products/eternal-rose.jpg"}
                alt={product.name}
                aspectRatio="1 / 1.3"
                className="shadow-card"
              />
            </div>
          </motion.div>

          {/* Content Area */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:w-[45%] flex flex-col"
          >
            <h1 className="font-serif text-3xl lg:text-4xl text-rose-deep mb-2">
              {product.name}
            </h1>
            <p className="text-2xl text-rose-coral font-medium mb-6">
              ${(product.price / 100).toFixed(2)}
            </p>

            <p className="text-foreground/70 leading-relaxed mb-8">
              {product.description}
            </p>

            {/* Quantity */}
            <div className="flex items-center gap-4 mb-6">
              <span className="text-sm font-medium text-foreground/60">Quantity</span>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 rounded-full border border-borderMuted flex items-center justify-center text-foreground/60 hover:border-rose-coral transition-colors"
                >
                  <Minus size={14} />
                </button>
                <span className="text-sm font-medium w-6 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-8 h-8 rounded-full border border-borderMuted flex items-center justify-center text-foreground/60 hover:border-rose-coral transition-colors"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>

            {/* Add to Cart */}
            <button
              onClick={handleAddToCart}
              className="w-full h-12 bg-rose-deep text-white font-sans font-medium rounded-lg hover:bg-rose-deep/90 transition-colors flex items-center justify-center gap-2"
            >
              <ShoppingBag size={18} />
              Add to Cart
            </button>

            {/* Wishlist */}
            <button className="mt-4 flex items-center gap-2 text-sm text-foreground/60 hover:text-rose-coral transition-colors self-center">
              <Heart size={16} />
              Add to Wishlist
            </button>

            {/* Meta */}
            <div className="mt-8 pt-6 border-t border-borderMuted/50">
              <div className="flex flex-col gap-2 text-sm text-foreground/50">
                <p>Category: <span className="capitalize text-foreground/70">{product.category}</span></p>
                <p>Stock: <span className="text-foreground/70">{product.stock} available</span></p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Related Products */}
        {relatedProducts && relatedProducts.length > 0 && (
          <div className="mt-24">
            <h2 className="font-serif text-2xl text-rose-deep mb-8">You May Also Love</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((p, i) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                >
                  <Link to={`/product/${p.id}`} className="group">
                    <PillArchImage
                      src={p.imageUrl || "/images/products/eternal-rose.jpg"}
                      alt={p.name}
                      aspectRatio="1 / 1.3"
                      className="shadow-card group-hover:shadow-card-hover transition-shadow"
                    />
                    <h3 className="font-serif text-base text-foreground group-hover:text-rose-coral transition-colors mt-3">
                      {p.name}
                    </h3>
                    <p className="text-rose-coral text-sm font-medium mt-1">
                      ${(p.price / 100).toFixed(2)}
                    </p>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
