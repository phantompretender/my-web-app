import { motion } from "framer-motion";
import PillArchImage from "@/components/PillArchImage";

export default function About() {
  return (
    <main className="pt-24 lg:pt-32 pb-24 px-6 lg:px-8 bg-stone min-h-screen">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="font-serif text-4xl lg:text-5xl text-rose-deep mb-8">
            Our Story
          </h1>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-12 items-start mb-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:w-1/2"
          >
            <div className="max-w-[400px]">
              <PillArchImage
                src="/images/products/english-rose.jpg"
                alt="Velvet Rose Atelier"
                aspectRatio="1 / 1.2"
                className="shadow-card"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:w-1/2"
          >
            <p className="text-lg text-foreground/70 leading-relaxed mb-6">
              Velvet Rose was born from a simple belief: every flower has a story to tell. Founded in 2018 by a collective of botanical artisans, our atelier has become a sanctuary for those who seek beauty in the ephemeral.
            </p>
            <p className="text-foreground/70 leading-relaxed mb-6">
              We work exclusively with local growers and sustainable farms, ensuring that each stem in our arrangements carries not just beauty, but purpose. Our florists are trained in both classical European techniques and modern sculptural design, allowing us to create pieces that honor tradition while embracing innovation.
            </p>
            <p className="text-foreground/70 leading-relaxed">
              From intimate bouquets to grand event installations, every creation that leaves our shop is a love letter to the natural world.
            </p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          <div className="text-center">
            <p className="font-serif text-4xl text-rose-deep mb-2">12</p>
            <p className="text-sm text-foreground/60">Local Grower Partners</p>
          </div>
          <div className="text-center">
            <p className="font-serif text-4xl text-rose-deep mb-2">5,000+</p>
            <p className="text-sm text-foreground/60">Arrangements Created</p>
          </div>
          <div className="text-center">
            <p className="font-serif text-4xl text-rose-deep mb-2">100%</p>
            <p className="text-sm text-foreground/60">Sustainably Sourced</p>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
