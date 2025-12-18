import React from 'react'

function Footer() {
    return (
        <>
            <footer className="bg-blue-950 text-white py-10">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-10">

                    {/* Company Info */}
                    <div>
                        <h2 className="text-xl font-bold mb-3">Your Company</h2>
                        <p className="text-sm text-blue-100 leading-relaxed">
                            We provide top-notch digital solutions, helping businesses grow with
                            technology, innovation, and smart automation.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-lg font-semibold mb-3">Quick Links</h3>
                        <ul className="space-y-2 text-blue-100">
                            <li><a href="#" className="hover:text-white transition">About Us</a></li>
                            <li><a href="#" className="hover:text-white transition">Services</a></li>
                            <li><a href="client" className="hover:text-white transition">Clients</a></li>
                            <li><a href="freelancer" className="hover:text-white transition">Freelancers</a></li>
                            <li><a href="admin" className="hover:text-white transition">Careers</a></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="text-lg font-semibold mb-3">Contact</h3>
                        <ul className="text-blue-100 space-y-2 text-sm">
                            <li>Email: support@atlascrm.com</li>
                            <li>Phone: +91 12345 67890</li>
                            <li>Location: Bengaluru, India</li>
                        </ul>

                        {/* Social Icons */}
                        <div className="flex gap-4 mt-4">
                            <a href="#" className="bg-white/20 p-2 rounded-full hover:bg-white/30 transition">
                                <i className="fa-brands fa-facebook-f"></i>
                            </a>
                            <a href="#" className="bg-white/20 p-2 rounded-full hover:bg-white/30 transition">
                                <i className="fa-brands fa-instagram"></i>
                            </a>
                            <a href="#" className="bg-white/20 p-2 rounded-full hover:bg-white/30 transition">
                                <i className="fa-brands fa-linkedin-in"></i>
                            </a>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-blue-400 mt-10 pt-4 text-center text-blue-100 text-sm">
                    © {new Date().getFullYear()} Your Company. All Rights Reserved.
                </div>
            </footer>

        </>
    )
}

export default Footer