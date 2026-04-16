"use client";
import { motion } from "framer-motion";
import { FaLeaf, FaRecycle, FaHandsHelping, FaLinkedin, FaTwitter } from "react-icons/fa";
import { useInView } from "react-intersection-observer";
import React from "react";
import Navbar from "../Components/navbar";
import Link from "next/link";

const teamMembers = [
  {
    name: "Priya Sharma",
    role: "Co-Founder & CEO",
    bio: "Environmental engineer turned entrepreneur. 8 years driving sustainable supply chains at Fortune 500 companies before founding EcoBay.",
    avatar: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=300&h=300&q=80&fit=crop",
    linkedin: "#",
    twitter: "#",
  },
  {
    name: "Aditya Nair",
    role: "Co-Founder & CTO",
    bio: "Full-stack engineer passionate about using tech for good. Built green logistics platforms before joining forces to launch EcoBay.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&q=80&fit=crop",
    linkedin: "#",
    twitter: "#",
  },
  {
    name: "Zara Khan",
    role: "Head of Sustainability",
    bio: "MSc in Environmental Science. Leads our product vetting process and ensures every item in the marketplace meets our strict eco-standards.",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=300&q=80&fit=crop",
    linkedin: "#",
    twitter: "#",
  },
];

const stats = [
  { value: "12K+", label: "Eco Products" },
  { value: "50K+", label: "Happy Customers" },
  { value: "8.5T", label: "CO₂ Saved (kg)" },
  { value: "200+", label: "Verified Sellers" },
];

export default function AboutPage() {
  const [ref1, inView1] = useInView({ threshold: 0.1, triggerOnce: true });
  const [ref2, inView2] = useInView({ threshold: 0.1, triggerOnce: true });
  const [ref3, inView3] = useInView({ threshold: 0.1, triggerOnce: true });

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100">
        {/* Hero */}
        <section className="relative h-[70vh] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.unsplash.com/photo-1448375240586-882707db888b?w=1400&q=80"
              alt="Nature backdrop"
              className="w-full h-full object-cover opacity-75"
            />
            <div className="absolute inset-0 bg-green-900/40 backdrop-blur-sm" />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="relative z-10 text-center px-4 sm:px-6 max-w-4xl mx-auto"
          >
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">About Eco-Bay</h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8">Reimagining commerce for a sustainable future</p>
            <div className="w-32 h-1 bg-green-400 mx-auto rounded-full" />
          </motion.div>
        </section>

        {/* Stats banner */}
        <div className="bg-white shadow-md">
          <div className="max-w-5xl mx-auto px-6 py-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {stats.map((s) => (
              <div key={s.label}>
                <p className="text-3xl font-extrabold text-emerald-600">{s.value}</p>
                <p className="text-sm text-gray-500 mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Mission */}
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
                At Eco-Bay, we&apos;re on a mission to revolutionize how people buy and sell eco-friendly products,
                reducing waste and promoting circular economy principles. We believe that every sustainable
                purchase is a vote for the planet.
              </p>
              <p className="text-lg text-gray-700">
                Our platform connects eco-conscious buyers with sellers who share the same values,
                creating a community dedicated to sustainable consumption — verified by AI and certified by experts.
              </p>
            </div>
            <div className="relative h-96 rounded-xl overflow-hidden shadow-2xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&q=80"
                alt="Our mission — sustainable living"
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>
        </section>

        {/* Core Values */}
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
              <div className="w-24 h-1 bg-green-400 mx-auto rounded-full" />
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                { icon: FaLeaf, title: "Sustainability First", desc: "Every decision we make is guided by our commitment to reducing environmental impact.", delay: 0.2 },
                { icon: FaRecycle, title: "Circular Economy", desc: "We promote reuse, refurbishment, and recycling to extend product lifecycles.", delay: 0.4 },
                { icon: FaHandsHelping, title: "Community Empowerment", desc: "We believe in creating meaningful connections that empower sustainable choices.", delay: 0.6 },
              ].map((item) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 30 }}
                  animate={inView2 ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                  transition={{ duration: 0.8, delay: item.delay }}
                  className="bg-green-50 p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
                >
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6 mx-auto">
                    <item.icon className="text-3xl text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-green-800 mb-4 text-center">{item.title}</h3>
                  <p className="text-gray-700 text-center">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Team */}
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
            <div className="w-24 h-1 bg-green-400 mx-auto rounded-full mt-6" />
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {teamMembers.map((member, i) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={inView3 ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.6, delay: i * 0.2 }}
                className="bg-white p-6 rounded-xl shadow-lg text-center hover:shadow-xl transition-shadow"
              >
                <div className="relative w-32 h-32 rounded-full overflow-hidden mx-auto mb-5 ring-4 ring-green-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-semibold text-green-800 mb-1">{member.name}</h3>
                <p className="text-emerald-500 text-sm font-medium mb-3">{member.role}</p>
                <p className="text-gray-600 text-sm leading-relaxed">{member.bio}</p>
                <div className="flex justify-center gap-3 mt-4">
                  <a href={member.linkedin} className="text-gray-400 hover:text-blue-600 transition-colors">
                    <FaLinkedin size={18} />
                  </a>
                  <a href={member.twitter} className="text-gray-400 hover:text-sky-500 transition-colors">
                    <FaTwitter size={18} />
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* CTA */}
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
                Whether you&apos;re looking to find eco-friendly products or learn how to reduce your footprint,
                EcoBay is your destination for conscious commerce.
              </p>
              <Link href="/products">
                <button className="bg-white text-green-800 font-semibold py-3 px-8 rounded-full text-lg hover:bg-green-100 transition-colors">
                  Get Started Today
                </button>
              </Link>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
}