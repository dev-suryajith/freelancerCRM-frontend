import React from "react";
import Header from "./Header";
import { motion } from "framer-motion";
import { ArrowRight, Star, Rocket, ShieldCheck } from "lucide-react";

export default function LandingPage() {
  return (
    <>
      <Header />

      <div className="min-h-screen bg-linear-to-br from-gray-900 via-gray-800 to-black text-white px-6 pt-28 pb-20">
        {/* Hero Section */}
        <section className="max-w-6xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-5xl md:text-6xl font-bold mb-6 leading-tight"
          >
            Build Faster. Launch Smarter.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-10"
          >
            A modern platform to help developers create beautiful, scalable apps with ease.
          </motion.p>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            className="bg-blue-600 hover:bg-blue-500 px-8 py-4 rounded-2xl text-lg font-semibold shadow-xl flex items-center gap-2 mx-auto"
          >
            Get Started <ArrowRight size={20} />
          </motion.button>
        </section>

        {/* Features Section */}
        <section className="max-w-6xl mx-auto mt-32 grid md:grid-cols-3 gap-10">
          {[
            {
              icon: <Rocket className="w-10 h-10" />,
              title: "Blazing Fast",
              desc: "Optimized tools to help you ship projects at lightning speed.",
            },
            {
              icon: <Star className="w-10 h-10" />,
              title: "Beautiful UI",
              desc: "Clean, modern components to make your product stand out.",
            },
            {
              icon: <ShieldCheck className="w-10 h-10" />,
              title: "Secure by Design",
              desc: "Industry-level security built in from the ground up.",
            },
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.2 }}
              viewport={{ once: true }}
              className="bg-gray-800/40 backdrop-blur-lg border border-gray-700 p-8 rounded-2xl shadow-xl text-center"
            >
              <div className="flex justify-center mb-4 text-blue-400">{feature.icon}</div>
              <h3 className="text-2xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-400 text-base">{feature.desc}</p>
            </motion.div>
          ))}
        </section>

        {/* CTA Section */}
        <section className="max-w-5xl mx-auto mt-32 text-center bg-gray-800/30 border border-gray-700 rounded-3xl py-20 px-10 shadow-2xl">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-bold mb-6"
          >
            Ready to Launch?
          </motion.h2>

          <p className="text-gray-300 text-lg max-w-2xl mx-auto mb-10">
            Join thousands of developers using our platform to build apps smarter and faster.
          </p>

          <motion.button
            whileHover={{ scale: 1.07 }}
            whileTap={{ scale: 0.95 }}
            className="bg-blue-600 hover:bg-blue-500 px-10 py-4 rounded-2xl text-lg font-semibold shadow-xl flex items-center gap-2 mx-auto"
          >
            Join Now <ArrowRight size={20} />
          </motion.button>
        </section>
      </div>
    </>
  );
}