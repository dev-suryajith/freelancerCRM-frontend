import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import Header from "./Header";

function Page404() {
  return (
    <div>
      <Header />

      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-gray-900 via-gray-800 to-black px-6 py-24 text-white">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="text-center max-w-lg"
        >
          {/* Floating 404 */}
          <motion.h1
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, type: "spring" }}
            className="text-8xl md:text-9xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-purple-500 mb-6"
          >
            404
          </motion.h1>

          {/* Message */}
          <p className="text-xl text-gray-300 mb-6">
            Oops! The page you're looking for doesn't exist or has been moved.
          </p>

          {/* Button */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-block"
          >
            <Link
              to="/"
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 transition shadow-lg"
            >
              <ArrowLeft size={20} /> Back to Home
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

export default Page404;
