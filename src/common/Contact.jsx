import React from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import Header from "./Header";

function Contact() {
    return (
        <div>
            <Header />
            <div className="min-h-screen bg-linear-to-br from-gray-900 via-gray-800 to-black text-white px-6 pt-28 pb-20">
                <div className="max-w-5xl mx-auto">
                    {/* Header */}
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-4xl font-bold text-center mb-10"
                    >
                        Contact Us
                    </motion.h1>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        {/* Contact Info */}
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="space-y-6"
                        >
                            <div className="flex items-start space-x-4">
                                <Mail className="w-7 h-7 text-blue-400" />
                                <div>
                                    <h3 className="text-lg font-semibold">Email</h3>
                                    <p className="text-gray-300">support@example.com</p>
                                </div>
                            </div>

                            <div className="flex items-start space-x-4">
                                <Phone className="w-7 h-7 text-blue-400" />
                                <div>
                                    <h3 className="text-lg font-semibold">Phone</h3>
                                    <p className="text-gray-300">+1 (555) 123-4567</p>
                                </div>
                            </div>

                            <div className="flex items-start space-x-4">
                                <MapPin className="w-7 h-7 text-blue-400" />
                                <div>
                                    <h3 className="text-lg font-semibold">Address</h3>
                                    <p className="text-gray-300">123 Avenue, City, Country</p>
                                </div>
                            </div>
                        </motion.div>

                        {/* Contact Form */}
                        <motion.form
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="bg-gray-800 p-6 rounded-2xl shadow-lg space-y-5"
                        >
                            <input
                                type="text"
                                placeholder="Your Name"
                                className="w-full p-3 rounded-xl bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />

                            <input
                                type="email"
                                placeholder="Your Email"
                                className="w-full p-3 rounded-xl bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />

                            <textarea
                                placeholder="Your Message"
                                rows="5"
                                className="w-full p-3 rounded-xl bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />

                            <button
                                type="submit"
                                className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 transition-all p-3 rounded-xl font-semibold"
                            >
                                Send Message <Send className="w-5 h-5" />
                            </button>
                        </motion.form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Contact;