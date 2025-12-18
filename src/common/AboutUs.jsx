import React from "react";
import { motion } from "framer-motion";
import { Users, ShieldCheck, Rocket } from "lucide-react";
import Header from "./Header";

function AboutUs() {
  return (
    <div> 
        <Header/>
        <div className="min-h-screen bg-linear-to-br from-gray-900 via-gray-800 to-black text-white px-6 py-20">
          <div className="max-w-5xl mx-auto text-center">
            <motion.h2
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl font-bold mb-6"
            >
              About Us
            </motion.h2>
    
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-lg text-gray-300 max-w-3xl mx-auto leading-relaxed"
            >
              We are dedicated to delivering high-quality solutions that are intuitive,
              efficient, and built with passion. Our team constantly pushes boundaries,
              using modern technologies to create meaningful digital experiences.
            </motion.p>
          </div>
    
          {/* Values Section */}
          <div className="max-w-6xl mx-auto mt-20 grid md:grid-cols-3 gap-10">
            {[
              {
                icon: <Users size={40} />,
                title: "Our Team",
                desc: "A group of passionate developers, designers, and innovators working together.",
              },
              {
                icon: <ShieldCheck size={40} />,
                title: "Our Mission",
                desc: "To build secure, scalable, and user-friendly products that solve real problems.",
              },
              {
                icon: <Rocket size={40} />,
                title: "Our Vision",
                desc: "Empowering businesses and individuals through cutting-edge technology.",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="bg-gray-800/40 backdrop-blur-lg p-8 rounded-2xl shadow-xl text-center hover:bg-gray-800/60 transition"
              >
                <div className="flex justify-center mb-4 text-blue-400">
                  {item.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-400">{item.desc}</p>
              </motion.div>
            ))}
          </div>
    
          {/* Team Section */}
          <div className="max-w-6xl mx-auto mt-24 text-center">
            <motion.h3
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="text-3xl font-bold mb-4"
            >
              Meet The Team
            </motion.h3>
    
            <p className="text-gray-400 mb-10">
              A passionate and dedicated group striving for excellence.
            </p>
    
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-10">
              {["Alex", "Jordan", "Taylor"].map((name, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.2 }}
                  viewport={{ once: true }}
                  className="bg-gray-900 p-6 rounded-xl shadow-xl"
                >
                  <div className="w-24 h-24 rounded-full bg-gray-700 mx-auto mb-4"></div>
                  <h4 className="text-xl font-semibold">{name}</h4>
                  <p className="text-gray-400 text-sm">Software Engineer</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
    </div>
  );
}

export default AboutUs;
