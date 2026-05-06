import { useState } from "react";
import { Link } from "react-router";
import { motion } from "framer-motion";
import { ChevronDown, ArrowRight } from "lucide-react";
import PillArchImage from "@/components/PillArchImage";
import { trpc } from "@/providers/trpc";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";

function HeroSection() {
  return (
    <section className="relative min-h-screen bg-rose-cream flex flex-col items-center justify-center px-6 overflow-hidden">
      <div className="absolute top-24 left-6 lg:left-16">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="font-serif text-5xl md:text-7xl lg:text-8xl text-rose-deep tracking-tight"
        >
          Velvet Rose
        </motion.h1>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 0.3 }}
        className="mt-16 md:mt-8"
      >
        <div className="w-[280px] md:w-[350px] lg:w-[400px]">
          <PillArchImage
            src="/images/products/english-rose.jpg"
            alt="Botanical arrangement"
            aspectRatio="1 / 1.25"
          />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1 }}
        className="absolute bottom-12 left-0 right-0 text-center"
      >
        <p className="text-xs uppercase tracking-[0.05em] font-sans font-medium text-foreground/60 mb-4">
          A flower shop inspired by stories
        </p>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        >
          <ChevronDown size={20} className="mx-auto text-foreground/40" />
        </motion.div>
      </motion.div>
    </section>
  );
}

function FeaturedSection() {
  const { data: products } = trpc.product.list.useQuery({ featured: true });
  const { openCart } = useCart();
  const utils = trpc.useUtils();

  const addToCart = trpc.cart.add.useMutation({
    onSuccess: () => {
      utils.cart.get.invalidate();
      openCart();
    },
  });

  const handleAddToCart = (productId: number) => {
    addToCart.mutate({ productId, quantity: 1 });
    toast.success("Added to your collection");
  };

  return (
    <section className="py-24 lg:py-32 px-6 lg:px-8 bg-stone">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
          <div className="flex-1">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6 }}
              className="font-serif text-4xl lg:text-5xl text-rose-deep mb-12"
            >
              Featured
            </motion.h2>

            <div className="flex flex-col gap-12">
              {products?.slice(0, 3).map((product, i) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.6, delay: i * 0.15 }}
                  className={`flex flex-col md:flex-row gap-6 group ${
                    i % 2 === 1 ? "md:flex-row-reverse" : ""
                  }`}
                >
                  <div className="w-full md:w-[280px] lg:w-[300px] flex-shrink-0">
                    <Link to={`/product/${product.id}`}>
                      <PillArchImage
                        src={product.imageUrl || "/images/products/eternal-rose.jpg"}
                        alt={product.name}
                        aspectRatio="1 / 1.3"
                        className="shadow-card group-hover:shadow-card-hover transition-shadow duration-300"
                      />
                    </Link>
                  </div>
                  <div className="flex flex-col justify-center">
                    <Link to={`/product/${product.id}`}>
                      <h3 className="font-serif text-2xl text-foreground group-hover:text-rose-coral transition-colors duration-200">
                        {product.name}
                      </h3>
                    </Link>
                    <p className="text-lg text-rose-coral font-medium mt-2">
                      ${(product.price / 100).toFixed(2)}
                    </p>
                    <p className="text-sm text-foreground/60 mt-3 line-clamp-2">
                      {product.description}
                    </p>
                    <button
                      onClick={() => handleAddToCart(product.id)}
                      className="mt-4 text-sm font-sans font-medium text-rose-deep hover:text-rose-coral transition-colors inline-flex items-center gap-1 group/btn"
                    >
                      Add to Cart
                      <ArrowRight size={14} className="transition-transform group-hover/btn:translate-x-1" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="lg:w-72 flex-shrink-0">
            <div className="lg:sticky lg:top-24">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="bg-rose-pink rounded-xl p-8"
              >
                <p className="font-serif text-xl text-rose-deep leading-relaxed">
                  Every bloom has a story
                </p>
                <p className="text-sm text-foreground/60 mt-4 leading-relaxed">
                  Our florists source the freshest seasonal flowers each morning, creating arrangements that speak the language of petals.
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function InSeasonSection() {
  const { data: products } = trpc.product.list.useQuery();
  const seasonalProduct = products?.find((p) => p.name.includes("Dahlia")) || products?.[0];

  return (
    <section className="py-24 lg:py-32 px-6 lg:px-8 bg-rose-cream">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
            className="w-full lg:w-1/2"
          >
            <div className="max-w-[500px] mx-auto lg:mx-0">
              <PillArchImage
                src={seasonalProduct?.imageUrl || "/images/products/dahlia-sunset.jpg"}
                alt="In season collection"
                aspectRatio="1 / 1.2"
                className="shadow-card"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="w-full lg:w-1/2"
          >
            <h2 className="font-serif text-4xl lg:text-5xl text-rose-deep mb-6">
              In Season
            </h2>
            <p className="text-lg text-foreground/70 leading-relaxed mb-6">
              Discover our curated selection of blooms at the peak of their beauty. Each arrangement captures the fleeting magic of the season.
            </p>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 text-rose-coral font-medium hover:text-rose-deep transition-colors group"
            >
              Explore Collection
              <span className="w-8 h-[1px] bg-rose-coral group-hover:w-12 group-hover:bg-rose-deep transition-all" />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function PressSection() {
  const stories = [
    { title: "The Art of Botanical Arrangement", image: "/images/products/peony-dreams.jpg" },
    { title: "Seasonal Blooms: A Guide", image: "/images/products/wild-meadow.jpg" },
    { title: "Velvet Rose Opens New Atelier", image: "/images/products/gardenia-centerpiece.jpg" },
    { title: "Sustainable Floristry", image: "/images/products/lavender-wreath.jpg" },
  ];

  return (
    <section className="py-24 lg:py-32 px-6 lg:px-8 bg-stone">
      <div className="max-w-7xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="font-serif text-4xl lg:text-5xl text-rose-deep mb-12"
        >
          Press & Stories
        </motion.h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stories.map((story, i) => (
            <motion.div
              key={story.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group cursor-pointer"
            >
              <div className="relative overflow-hidden rounded-xl aspect-square mb-4">
                <img
                  src={story.image}
                  alt={story.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
              </div>
              <h3 className="font-serif text-lg text-foreground group-hover:text-rose-coral transition-colors duration-200">
                {story.title}
              </h3>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  return (
    <section className="py-24 lg:py-32 px-6 lg:px-8 bg-stone">
      <div className="max-w-xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-serif text-4xl lg:text-5xl text-rose-deep mb-4">
            The Rose Gazette
          </h2>
          <p className="text-foreground/60 mb-8">
            Monthly stories, care tips, and first access to rare blooms
          </p>

          {submitted ? (
            <p className="font-serif text-xl text-rose-coral">
              Welcome to the garden
            </p>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (email) setSubmitted(true);
              }}
              className="flex flex-col sm:flex-row gap-3"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                className="flex-1 h-12 px-4 rounded-lg border border-borderMuted bg-white text-sm focus:outline-none focus:border-rose-coral transition-colors"
                required
              />
              <button
                type="submit"
                className="h-12 px-6 bg-rose-cream text-rose-deep font-sans font-medium text-sm rounded-lg hover:bg-rose-blush transition-colors"
              >
                Subscribe
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-rose-cream border-t border-borderMuted">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <h3 className="font-serif text-2xl text-rose-deep mb-4">Velvet Rose</h3>
            <p className="text-sm text-foreground/60 leading-relaxed">
              128 Bloom Street<br />
              Garden District<br />
              Open Mon-Sat 9am-7pm
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <Link to="/shop" className="text-sm text-foreground/70 hover:text-rose-coral transition-colors">Shop</Link>
            <Link to="/about" className="text-sm text-foreground/70 hover:text-rose-coral transition-colors">About</Link>
            <Link to="/contact" className="text-sm text-foreground/70 hover:text-rose-coral transition-colors">Contact</Link>
          </div>

          <div>
            <p className="text-sm text-foreground/60 mb-3">Follow our garden</p>
            <div className="flex gap-4">
              <a href="#" className="text-foreground/60 hover:text-rose-coral transition-colors text-sm">Instagram</a>
              <a href="#" className="text-foreground/60 hover:text-rose-coral transition-colors text-sm">Pinterest</a>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-borderMuted/50 text-center">
          <p className="text-xs text-foreground/40">
            &copy; {new Date().getFullYear()} Velvet Rose. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default function Home() {
  return (
    <main>
      <HeroSection />
      <FeaturedSection />
      <InSeasonSection />
      <PressSection />
      <NewsletterSection />
      <Footer />
    </main>
  );
}
