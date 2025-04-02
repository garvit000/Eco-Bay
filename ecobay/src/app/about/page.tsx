'use client';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { FaLeaf, FaRecycle, FaHandsHelping } from 'react-icons/fa';
import { useInView } from 'react-intersection-observer';
import React from 'react';
import Navbar from '../Components/navbar';

export default function AboutPage() {
    const [ref1, inView1] = useInView({ threshold: 0.1, triggerOnce: true });
    const [ref2, inView2] = useInView({ threshold: 0.1, triggerOnce: true });
    const [ref3, inView3] = useInView({ threshold: 0.1, triggerOnce: true });

    return (
        <>
        <Navbar/>
        <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100">
            <section className="relative h-[70vh] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <Image 
                        src="/images/eco-forest.jpg" 
                        alt="Nature backdrop"
                        fill
                        className="object-cover opacity-75"
                        priority
                    />
                    <div className="absolute inset-0 bg-green-900/30 backdrop-blur-sm"></div>
                </div>
                
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="relative z-10 text-center px-4 sm:px-6 max-w-4xl mx-auto"
                >
                    <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">About Eco-Bay</h1>
                    <p className="text-xl md:text-2xl text-white/90 mb-8">Reimagining commerce for a sustainable future</p>
                    <div className="w-32 h-1 bg-green-400 mx-auto rounded-full"></div>
                </motion.div>
            </section>

            <section className="py-20 px-4 sm:px-6 max-w-7xl mx-auto">
                <motion.div 
                    ref={ref1}
                    initial={{ opacity: 0 }}
                    animate={inView1 ? { opacity: 1 } : { opacity: 0 }}
                    transition={{ duration: 0.8 }}
                    className="grid md:grid-cols-2 gap-12 items-center"
                >
                    <div>
                        <h2 className="text-3xl md:text-4xl font-bold text-green-800 mb-6">Our Mission</h2>
                        <p className="text-lg text-gray-700 mb-6">
                            At Eco-Bay, we're on a mission to revolutionize how people buy and sell pre-loved items, 
                            reducing waste and promoting circular economy principles. We believe that every item 
                            given a second life is one less item in a landfill.
                        </p>
                        <p className="text-lg text-gray-700">
                            Our platform connects eco-conscious buyers with sellers who share the same values, 
                            creating a community dedicated to sustainable consumption.
                        </p>
                    </div>
                    <div className="relative h-96 rounded-xl overflow-hidden shadow-2xl">
                        <Image 
                            src="/images/eco-mission.jpg" 
                            alt="Our mission"
                            fill
                            className="object-cover"
                        />
                    </div>
                </motion.div>
            </section>

            <section className="py-20 px-4 sm:px-6 bg-white">
                <div className="max-w-7xl mx-auto">
                    <motion.div 
                        ref={ref2}
                        initial={{ opacity: 0, y: 30 }}
                        animate={inView2 ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                        transition={{ duration: 0.8 }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold text-green-800 mb-6">Our Core Values</h2>
                        <div className="w-24 h-1 bg-green-400 mx-auto rounded-full"></div>
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <motion.div 
                            initial={{ opacity: 0, y: 30 }}
                            animate={inView2 ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="bg-green-50 p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
                        >
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6 mx-auto">
                                <FaLeaf className="text-3xl text-green-600" />
                            </div>
                            <h3 className="text-xl font-semibold text-green-800 mb-4 text-center">Sustainability First</h3>
                            <p className="text-gray-700 text-center">
                                Every decision we make is guided by our commitment to reducing environmental impact.
                            </p>
                        </motion.div>

                        <motion.div 
                            initial={{ opacity: 0, y: 30 }}
                            animate={inView2 ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                            className="bg-green-50 p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
                        >
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6 mx-auto">
                                <FaRecycle className="text-3xl text-green-600" />
                            </div>
                            <h3 className="text-xl font-semibold text-green-800 mb-4 text-center">Circular Economy</h3>
                            <p className="text-gray-700 text-center">
                                We promote reuse, refurbishment, and recycling to extend product lifecycles.
                            </p>
                        </motion.div>

                        <motion.div 
                            initial={{ opacity: 0, y: 30 }}
                            animate={inView2 ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                            transition={{ duration: 0.8, delay: 0.6 }}
                            className="bg-green-50 p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
                        >
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6 mx-auto">
                                <FaHandsHelping className="text-3xl text-green-600" />
                            </div>
                            <h3 className="text-xl font-semibold text-green-800 mb-4 text-center">Community Empowerment</h3>
                            <p className="text-gray-700 text-center">
                                We believe in creating meaningful connections that empower sustainable choices.
                            </p>
                        </motion.div>
                    </div>
                </div>
            </section>

            <section className="py-20 px-4 sm:px-6 max-w-7xl mx-auto">
                <motion.div 
                    ref={ref3}
                    initial={{ opacity: 0 }}
                    animate={inView3 ? { opacity: 1 } : { opacity: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl md:text-4xl font-bold text-green-800 mb-6">Our Team</h2>
                    <p className="text-lg text-gray-700 max-w-3xl mx-auto">
                        Behind Eco-Bay is a passionate team of sustainability advocates, technology enthusiasts, 
                        and marketplace experts committed to making a positive impact.
                    </p>
                    <div className="w-24 h-1 bg-green-400 mx-auto rounded-full mt-6"></div>
                </motion.div>

                <div className="grid md:grid-cols gap-8">
                    {[1, 2].map((person) => (
                        <motion.div 
                            key={person}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={inView3 ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.6, delay: person * 0.2 }}
                            className="bg-white p-6 rounded-xl shadow-lg overflow-hidden"
                        >
                            <div className="relative w-48 h-48 rounded-full overflow-hidden mx-auto mb-6">
                                <Image 
                                    src={`/images/team-member-${person}.jpg`} 
                                    alt={`Team member ${person}`}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <h3 className="text-xl font-semibold text-green-800 mb-2 text-center">Team Member {person}</h3>
                            <p className="text-green-600 mb-4 text-center">Position Title</p>
                            <p className="text-gray-700 text-center">
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus lacinia odio vitae vestibulum.
                            </p>
                        </motion.div>
                    ))}
                </div>
            </section>

            <section className="py-20 px-4 sm:px-6 bg-green-800 text-white">
                <div className="max-w-4xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-3xl md:text-4xl font-bold mb-6">Join Our Sustainable Journey</h2>
                        <p className="text-lg text-green-100 mb-8">
                            Whether you're looking to sell items you no longer need or find pre-loved treasures, 
                            Eco-Bay is your destination for conscious commerce.
                        </p>
                        <button className="bg-white text-green-800 font-semibold py-3 px-8 rounded-full text-lg hover:bg-green-100 transition-colors">
                            Get Started Today
                        </button>
                    </motion.div>
                </div>
            </section>
        </div>
        </>
    );
}