'use client';

import { useState } from 'react';
import Navbar from '../Components/navbar';
import { FiMail, FiPhone, FiMapPin, FiSend } from 'react-icons/fi';
import { motion } from 'framer-motion';

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: '',
    });
    
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        setIsSubmitting(false);
        setIsSubmitted(true);
        setFormData({ name: '', email: '', subject: '', message: '' });
        
        setTimeout(() => setIsSubmitted(false), 3000);
    };

    return (
        <div>
            <Navbar/>
            <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 font-sans">
            <div className="w-11/12 max-w-7xl mx-auto my-12 p-8">
                <motion.div 
                    className="text-center mb-12"
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-cyan-400 bg-clip-text text-transparent">Get in Touch</h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">We'd love to hear from you. Please fill out the form below or reach out via the contact information.</p>
                </motion.div>

                <div className="flex flex-wrap gap-8 mb-12">
                    <motion.div 
                        className="flex-1 min-w-[300px] flex flex-col gap-6"
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl hover:-translate-y-1 transition duration-300">
                            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-blue-600 to-cyan-400 mb-4">
                                <FiMapPin className="text-white text-xl" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">Our Location</h3>
                            <p className="text-gray-600 my-1">SRMIST, SRM Nagar</p>
                            <p className="text-gray-600 my-1">Kattankulathur, 603203</p>
                        </div>

                        <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl hover:-translate-y-1 transition duration-300">
                            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-blue-600 to-cyan-400 mb-4">
                                <FiPhone className="text-white text-xl" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">Phone Number</h3>
                            <p className="text-gray-600 my-1">9876543210</p>
                            <p className="text-gray-600 my-1">Mon-Fri, 9am-5pm</p>
                        </div>

                        <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl hover:-translate-y-1 transition duration-300">
                            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-blue-600 to-cyan-400 mb-4">
                                <FiMail className="text-white text-xl" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">Email Address</h3>
                            <p className="text-gray-600 my-1">hello@ecobay.ml</p>
                            <p className="text-gray-600 my-1">support@ecobay.ml</p>
                        </div>
                    </motion.div>

                    <motion.div 
                        className="flex-[1.5] min-w-[350px] bg-white rounded-2xl shadow-md hover:shadow-xl transition duration-300 overflow-hidden"
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                    >
                        {isSubmitted ? (
                            <div className="flex flex-col items-center justify-center h-full p-12 text-center">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: "spring", stiffness: 200, damping: 10 }}
                                >
                                    <div className="flex items-center justify-center w-20 h-20 text-3xl bg-gradient-to-r from-blue-600 to-cyan-400 text-white rounded-full mb-6">✓</div>
                                    <h3 className="text-2xl font-semibold text-gray-800 mb-4">Thank You!</h3>
                                    <p className="text-gray-600 mb-2">Your message has been sent successfully.</p>
                                    <p className="text-gray-600">We'll get back to you as soon as possible.</p>
                                </motion.div>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="p-8">
                                <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Send Us a Message</h2>
                                
                                <div className="relative mb-6">
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        placeholder=" "
                                        className="w-full p-4 border-2 border-gray-200 rounded-lg bg-transparent focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                                    />
                                    <label 
                                        htmlFor="name" 
                                        className="absolute left-4 top-4 text-gray-500 transition-all pointer-events-none 
                                        peer-focus:-top-2 peer-focus:left-3 peer-focus:text-xs peer-focus:bg-white peer-focus:px-2 peer-focus:text-blue-500
                                        peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:left-3 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:bg-white peer-[:not(:placeholder-shown)]:px-2"
                                    >
                                        Your Name
                                    </label>
                                </div>
                                
                                <div className="relative mb-6">
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        placeholder=" "
                                        className="w-full p-4 border-2 border-gray-200 rounded-lg bg-transparent focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                                    />
                                    <label 
                                        htmlFor="email" 
                                        className="absolute left-4 top-4 text-gray-500 transition-all pointer-events-none 
                                        peer-focus:-top-2 peer-focus:left-3 peer-focus:text-xs peer-focus:bg-white peer-focus:px-2 peer-focus:text-blue-500
                                        peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:left-3 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:bg-white peer-[:not(:placeholder-shown)]:px-2"
                                    >
                                        Your Email
                                    </label>
                                </div>
                                
                                <div className="relative mb-6">
                                    <input
                                        type="text"
                                        id="subject"
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        required
                                        placeholder=" "
                                        className="w-full p-4 border-2 border-gray-200 rounded-lg bg-transparent focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                                    />
                                    <label 
                                        htmlFor="subject" 
                                        className="absolute left-4 top-4 text-gray-500 transition-all pointer-events-none 
                                        peer-focus:-top-2 peer-focus:left-3 peer-focus:text-xs peer-focus:bg-white peer-focus:px-2 peer-focus:text-blue-500
                                        peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:left-3 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:bg-white peer-[:not(:placeholder-shown)]:px-2"
                                    >
                                        Subject
                                    </label>
                                </div>
                                
                                <div className="relative mb-6">
                                    <textarea
                                        id="message"
                                        name="message"
                                        rows={5}
                                        value={formData.message}
                                        onChange={handleChange}
                                        required
                                        placeholder=" "
                                        className="w-full p-4 border-2 border-gray-200 rounded-lg bg-transparent focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                                    ></textarea>
                                    <label 
                                        htmlFor="message" 
                                        className="absolute left-4 top-4 text-gray-500 transition-all pointer-events-none 
                                        peer-focus:-top-2 peer-focus:left-3 peer-focus:text-xs peer-focus:bg-white peer-focus:px-2 peer-focus:text-blue-500
                                        peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:left-3 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:bg-white peer-[:not(:placeholder-shown)]:px-2"
                                    >
                                        Your Message
                                    </label>
                                </div>
                                
                                <button 
                                    type="submit" 
                                    className="w-full p-4 bg-gradient-to-r from-blue-600 to-cyan-400 text-white font-semibold rounded-lg flex items-center justify-center gap-2 hover:-translate-y-1 hover:shadow-lg active:translate-y-0 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? 'Sending...' : (
                                        <>
                                            Send Message <FiSend className="transition-transform duration-300 group-hover:translate-x-1" />
                                        </>
                                    )}
                                </button>
                            </form>
                        )}
                    </motion.div>
                </div>
            </div>

            <div className="w-full h-[450px] overflow-hidden mt-8">
                <iframe 
                    src="https://maps.google.com/maps?width=600&amp;height=400&amp;hl=en&amp;q=SRMIST kattankulathur&amp;t=&amp;z=14&amp;ie=UTF8&amp;iwloc=B&amp;output=embed"
                    width="100%" 
                    height="450" 
                    style={{ border: 0 }} 
                    allowFullScreen 
                    loading="lazy" 
                    title="location map"
                ></iframe>
            </div>
                </div>
            </div>
        );
    }