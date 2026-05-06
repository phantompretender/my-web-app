import { useState } from "react";
import { Link } from "react-router";
import { motion } from "framer-motion";
import { ShoppingBag } from "lucide-react";
import PillArchImage from "@/components/PillArchImage";
import { trpc } from "@/providers/trpc";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";

const categories = [
  { label: "All", value: undefined },
  { label: "Bouquets", value: "bouquets" as const },
  { label: "Arrangements", value: "arrangements" as const },
  { label: "Plants", value: "plants" as const },
  { label: "Gifts", value: "gifts" as const },
];

export default function Shop() {
  const [activeCategory, setActiveCategory] = useState<string | undefined>(undefined);
  const { data: products, isLoading } = trpc.product.list.useQuery(
    activeCategory ? { category: activeCategory as "bouquets" | "arrangements" | "plants" | "gifts" } : {}
  );
  const { openCart } = useCart();
  const utils = trpc.useUtils();

  const addToCart = trpc.cart.add.useMutation({
    onSuccess: () => {
      utils.cart.get.invalidate();
      openCart();
    },
  });

  const handleQuickAdd = (productId: number) => {
    addToCart.mutate({ productId, quantity: 1 });
    toast.success("Added to your collection");
  };

  return (
    <main className="pt-24 lg:pt-32 pb-24 px-6 lg:px-8 bg-stone min-h-screen">
      <div className="max-w-7xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="font-serif text-4xl lg:text-5xl text-rose-deep mb-12"
        >
          The Collection
        </motion.h1>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Sidebar Filter */}
          <div className="lg:w-48 flex-shrink-0">
            <div className="lg:sticky lg:top-24">
              <p className="text-xs uppercase tracking-[0.05em] font-sans font-semibold text-foreground/40 mb-4">
                Categories
              </p>
              <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
                {categories.map((cat) => (
                  <button
                    key={cat.label}
                    onClick={() => setActiveCategory(cat.value)}
                    className={`text-sm font-sans whitespace-nowrap px-3 py-2 rounded-lg transition-colors text-left ${
                      activeCategory === cat.value || (!activeCategory && !cat.value)
                        ? "bg-rose-cream text-rose-deep"
                        : "text-foreground/60 hover:text-foreground"
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Product Grid */}
          <div className="flex-1">
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="aspect-[3/4] rounded-pill bg-borderMuted/50" />
                    <div className="h-4 bg-borderMuted/50 rounded mt-3 w-3/4" />
                    <div className="h-3 bg-borderMuted/50 rounded mt-2 w-1/4" />
                  </div>
                ))}
              </div>
            ) : (
              <motion.div
                layout
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {products?.map((product, i) => (
                  <motion.div
                    key={product.id}
                    layout
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: i * 0.08 }}
                    className="group"
                  >
                    <div className="relative">
                      <Link to={`/product/${product.id}`}>
                        <PillArchImage
                          src={product.imageUrl || "/images/products/eternal-rose.jpg"}
                          alt={product.name}
                          aspectRatio="1 / 1.3"
                          className="shadow-card group-hover:shadow-card-hover transition-shadow duration-300"
                        />
                      </Link>

                      {/* Quick Add */}
                      <motion.button
                        initial={{ opacity: 0, y: 10 }}
                        whileHover={{ scale: 1.05 }}
                        onClick={() => handleQuickAdd(product.id)}
                        className="absolute bottom-4 left-4 right-4 h-10 bg-white/90 backdrop-blur-sm rounded-lg text-sm font-sans font-medium text-rose-deep flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-sm hover:bg-white"
                      >
                        <ShoppingBag size={14} />
                        Quick Add
                      </motion.button>
                    </div>

                    <div className="pt-4">
                      <Link to={`/product/${product.id}`}>
                        <h3 className="font-serif text-lg text-foreground group-hover:text-rose-coral transition-colors duration-200">
                          {product.name}
                        </h3>
                      </Link>
                      <p className="text-rose-coral font-medium mt-1">
                        ${(product.price / 100).toFixed(2)}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
