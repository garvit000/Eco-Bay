"use client";
import Link from "next/link";
import { FaLeaf, FaShoppingBag, FaRecycle, FaLink, FaBarcode, FaEnvelope, FaStar, FaArrowRight } from "react-icons/fa";
import { useState, useEffect } from "react";

export default function Home() {
    const [productUrl, setProductUrl] = useState("");
    const [rating, setRating] = useState<number | null>(null);
    const [isScanning, setIsScanning] = useState(false);
    const [email, setEmail] = useState("");
    const [isScrolled, setIsScrolled] = useState(false);

   useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const checkSustainability = () => {
        if (!productUrl.trim()) return;
        
        const mockRatings = [2.5, 3.8, 4.2, 1.7, 5.0];
        const randomRating = mockRatings[Math.floor(Math.random() * mockRatings.length)];
        setRating(randomRating);
    };

    const handleScan = () => {
        setIsScanning(true);
        setTimeout(() => {
            setIsScanning(false);
            checkSustainability();
        }, 2000);
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-green-50 via-emerald-50 to-white overflow-hidden">
            <div className="relative h-[600px] overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-green-800 to-emerald-900 opacity-90 z-0"></div>
                <div className="absolute inset-0 bg-[url('/nature-pattern.png')] bg-cover opacity-20 mix-blend-overlay z-0"></div>
                
                <div className="absolute inset-0 z-0">
                    {Array.from({ length: 20 }).map((_, i) => (
                        <div 
                            key={i}
                            className="absolute rounded-full bg-green-400/20 animate-float"
                            style={{
                                width: `${Math.random() * 100 + 50}px`,
                                height: `${Math.random() * 100 + 50}px`,
                                top: `${Math.random() * 100}%`,
                                left: `${Math.random() * 100}%`,
                                animationDuration: `${Math.random() * 10 + 10}s`,
                                animationDelay: `${Math.random() * 5}s`
                            }}
                        ></div>
                    ))}
                </div>
                
                <div className="relative z-20 h-full flex flex-col items-center justify-center p-8 text-center">
                    <div className="animate-fadeIn">
                        <h1 className="text-6xl md:text-8xl font-extrabold text-white drop-shadow-xl tracking-tight">
                            Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-emerald-400">EcoBay</span>
                        </h1>
                        <p className="text-xl md:text-2xl mt-8 max-w-3xl mx-auto text-green-50 font-light leading-relaxed">
                            Your premium marketplace for eco-friendly and sustainable products that make a difference for our planet
                        </p>
                        <div className="mt-12 flex flex-col sm:flex-row gap-6 justify-center">
                            <Link href="/products">
                                <button className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-10 py-4 rounded-full hover:from-green-600 hover:to-emerald-700 transform transition-all duration-300 hover:scale-105 shadow-xl hover:shadow-green-500/30 flex items-center gap-3 font-semibold text-lg group">
                                    <FaShoppingBag className="text-xl group-hover:animate-pulse" /> 
                                    Shop Now
                                    <FaArrowRight className="ml-1 opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all duration-300" />
                                </button>
                            </Link>
                            <Link href="/about">
                                <button className="bg-white/10 backdrop-blur-md text-white border-2 border-green-300/50 px-10 py-4 rounded-full hover:bg-white/20 transition-all duration-300 hover:scale-105 shadow-lg font-semibold text-lg group">
                                    Learn More
                                    <span className="inline-block transition-transform duration-300 group-hover:translate-x-1 ml-2">→</span>
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
                
               <div className="absolute bottom-0 left-0 right-0 h-20 z-10">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="absolute bottom-0 w-full h-full">
                        <path fill="#f8fafc" fillOpacity="1" d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,208C672,213,768,203,864,181.3C960,160,1056,128,1152,133.3C1248,139,1344,181,1392,202.7L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
                    </svg>
                </div>
            </div>

            <div className="max-w-5xl mx-auto py-24 px-6 relative">
               <div className="absolute top-10 right-0 w-64 h-64 bg-green-100 rounded-full filter blur-3xl opacity-30 -z-10"></div>
                <div className="absolute bottom-10 left-0 w-72 h-72 bg-emerald-100 rounded-full filter blur-3xl opacity-30 -z-10"></div>
                
                <div className="text-center mb-16 reveal-animation">
                    <span className="inline-block px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-semibold tracking-wide mb-4">ECO CHECKER</span>
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6 leading-tight">Check Product <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-700">Sustainability</span></h2>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">Enter a product URL or scan a barcode to instantly check its environmental impact and sustainability rating</p>
                </div>
                
                <div className="bg-white p-10 rounded-2xl shadow-2xl transition-all duration-500 hover:shadow-[0_20px_60px_-15px_rgba(22,163,74,0.3)] backdrop-blur-sm bg-white/90 border border-gray-100 reveal-animation">
                    <div className="flex flex-col md:flex-row gap-5 mb-8">
                        <div className="flex-grow relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <FaLink className="text-green-500" />
                            </div>
                            <input 
                                type="text" 
                                placeholder="Enter product URL or link" 
                                className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-200 shadow-sm focus:ring-4 focus:ring-green-200 focus:border-green-500 transition-all duration-300 text-gray-700"
                                value={productUrl}
                                onChange={(e) => setProductUrl(e.target.value)}
                            />
                        </div>
                        <div className="flex gap-3">
                            <button 
                                onClick={checkSustainability}
                                className="bg-gradient-to-r from-green-600 to-green-700 text-white px-8 py-4 rounded-xl hover:from-green-700 hover:to-green-800 shadow-lg hover:shadow-green-500/30 flex items-center justify-center gap-2 transition-all duration-300 transform hover:scale-105 font-medium"
                            >
                                Check Now
                            </button>
                            <button 
                                onClick={handleScan}
                                className={`${isScanning ? 'bg-gray-400' : 'bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800'} text-white px-8 py-4 rounded-xl shadow-lg hover:shadow-emerald-500/30 flex items-center justify-center gap-2 transition-all duration-300 transform hover:scale-105 font-medium`}
                                disabled={isScanning}
                            >
                                <FaBarcode className={`${isScanning ? 'animate-pulse' : ''}`} /> 
                                {isScanning ? "Scanning..." : "Scan Barcode"}
                            </button>
                        </div>
                    </div>
                    
                    {rating !== null && (
                        <div className="mt-10 p-8 border border-green-100 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 transform transition-all duration-700 animate-fadeIn shadow-inner">
                            <h3 className="text-2xl font-bold text-green-800 mb-6 flex items-center">
                                <FaLeaf className="mr-3 text-green-500" /> Sustainability Rating
                            </h3>
                            <div className="flex flex-col gap-4">
                                <div className="flex items-center">
                                    <div className="w-full bg-gray-100 rounded-full h-8 overflow-hidden shadow-inner">
                                        <div 
                                            className={`h-8 rounded-full ${
                                                rating < 2 ? 'bg-gradient-to-r from-red-400 to-red-500' : 
                                                rating < 3.5 ? 'bg-gradient-to-r from-yellow-400 to-yellow-500' : 
                                                'bg-gradient-to-r from-green-400 to-green-600'
                                            } transition-all duration-1500 ease-out flex items-center justify-end pr-2`}
                                            style={{ width: `${(rating / 5) * 100}%` }}
                                        >
                                            {rating >= 3.5 && <span className="text-white text-xs font-bold">Excellent!</span>}
                                        </div>
                                    </div>
                                    <div className="ml-6 flex items-center bg-white py-2 px-4 rounded-full shadow-md">
                                        <span className="font-bold text-xl text-gray-800">{rating.toFixed(1)}</span>
                                        <span className="text-gray-400 font-medium">/5.0</span>
                                    </div>
                                </div>
                                
                                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                                    <div className="flex items-start gap-4">
                                        <div className={`p-3 rounded-full ${
                                            rating < 2 ? 'bg-red-100 text-red-500' : 
                                            rating < 3.5 ? 'bg-yellow-100 text-yellow-600' : 
                                            'bg-green-100 text-green-600'
                                        }`}>
                                            {rating < 2 ? <FaStar className="text-xl" /> : 
                                             rating < 3.5 ? <FaStar className="text-xl" /> : 
                                             <FaLeaf className="text-xl" />}
                                        </div>
                                        <div>
                                            <h4 className="text-lg font-semibold text-gray-800 mb-2">
                                                {rating < 2 ? 'Poor Environmental Impact' : 
                                                 rating < 3.5 ? 'Average Sustainability' : 
                                                 'Excellent Eco-Friendly Choice!'}
                                            </h4>
                                            <p className="text-gray-600">
                                                {rating < 2 ? 'This product has significant environmental concerns. Consider exploring greener alternatives.' : 
                                                 rating < 3.5 ? 'This product meets basic sustainability standards but there\'s room for improvement.' : 
                                                 'This product exceeds our sustainability standards and is an excellent choice for eco-conscious consumers!'}
                                            </p>
                                            
                                            {rating >= 3.5 && (
                                                <div className="mt-4 flex flex-wrap gap-2">
                                                    <span className="inline-block bg-green-100 text-green-700 text-xs font-medium px-3 py-1 rounded-full">Eco-certified</span>
                                                    <span className="inline-block bg-green-100 text-green-700 text-xs font-medium px-3 py-1 rounded-full">Low Carbon Footprint</span>
                                                    <span className="inline-block bg-green-100 text-green-700 text-xs font-medium px-3 py-1 rounded-full">Sustainable Materials</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

           <div className="max-w-7xl mx-auto py-28 px-6 relative">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-green-50 rounded-full filter blur-3xl opacity-50 -z-10"></div>
                
                <div className="text-center mb-20 reveal-animation">
                    <span className="inline-block px-4 py-2 bg-emerald-100 text-emerald-800 rounded-full text-sm font-semibold tracking-wide mb-4">WHY CHOOSE US</span>
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6 leading-tight">The <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-700">EcoBay</span> Difference</h2>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">We're committed to making sustainable shopping accessible, transparent, and impactful</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-x-10 gap-y-16">
                    <div className="bg-gradient-to-br from-white to-green-50 p-10 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:shadow-green-200/50 group hover:-translate-y-3 border border-gray-100">
                        <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white mb-8 transform transition-transform group-hover:scale-110 group-hover:rotate-3 shadow-lg">
                            <FaLeaf className="text-3xl" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-4 group-hover:text-green-600 transition-colors">Sustainable Products</h3>
                        <p className="text-gray-600 leading-relaxed">All our products are rigorously vetted to meet the highest sustainability standards, ensuring minimal environmental impact.</p>
                        <div className="mt-8 pt-6 border-t border-green-100">
                            <span className="text-green-600 font-medium flex items-center group-hover:font-semibold">
                                Learn about our standards
                                <svg className="w-4 h-4 ml-2 transform transition-transform group-hover:translate-x-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                            </span>
                        </div>
                    </div>
                    
                    <div className="bg-gradient-to-br from-white to-emerald-50 p-10 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:shadow-emerald-200/50 group hover:-translate-y-3 border border-gray-100 md:mt-10">
                        <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white mb-8 transform transition-transform group-hover:scale-110 group-hover:rotate-3 shadow-lg">
                            <FaRecycle className="text-3xl" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-4 group-hover:text-emerald-600 transition-colors">Eco-Friendly Packaging</h3>
                        <p className="text-gray-600 leading-relaxed">We eliminate waste with innovative, minimal, and fully recyclable packaging solutions for all deliveries.</p>
                        <div className="mt-8 pt-6 border-t border-emerald-100">
                            <span className="text-emerald-600 font-medium flex items-center group-hover:font-semibold">
                                Our packaging approach
                                <svg className="w-4 h-4 ml-2 transform transition-transform group-hover:translate-x-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                            </span>
                        </div>
                    </div>
                    
                    <div className="bg-gradient-to-br from-white to-green-50 p-10 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:shadow-green-200/50 group hover:-translate-y-3 border border-gray-100">
                        <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white mb-8 transform transition-transform group-hover:scale-110 group-hover:rotate-3 shadow-lg">
                            <FaShoppingBag className="text-3xl" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-4 group-hover:text-green-600 transition-colors">Ethical Marketplace</h3>
                        <p className="text-gray-600 leading-relaxed">We partner exclusively with businesses committed to ethical practices, fair trade, and sustainable development.</p>
                        <div className="mt-8 pt-6 border-t border-green-100">
                            <span className="text-green-600 font-medium flex items-center group-hover:font-semibold">
                                Our seller standards
                                <svg className="w-4 h-4 ml-2 transform transition-transform group-hover:translate-x-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                            </span>
                        </div>
                    </div>
                </div>
            </div>

         <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-green-800 to-emerald-900 skew-y-3 transform origin-top-right -z-10 h-[120%]"></div>
                <div className="max-w-5xl mx-auto py-32 px-6 relative z-10">
                    <div className="bg-white rounded-3xl shadow-2xl p-12 backdrop-blur-sm">
                        <div className="text-center mb-10">
                            <h2 className="text-4xl font-bold text-gray-800 mb-4">Join Our Eco-Friendly Community</h2>
                            <p className="text-xl text-gray-600 max-w-2xl mx-auto">Get sustainable living tips, early access to new products, and exclusive offers.</p>
                        </div>
                        
                        <div className="max-w-lg mx-auto">
                            <div className="flex flex-col sm:flex-row gap-4">
                                <div className="relative flex-grow">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center">
                                        <FaEnvelope className="text-green-500" />
                                    </div>
                                    <input 
                                        type="email" 
                                        placeholder="Your email address" 
                                        className="pl-12 pr-4 py-4 rounded-xl border border-gray-200 shadow-sm focus:ring-4 focus:ring-green-200 focus:border-green-500 transition-all w-full"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                                <button className="bg-gradient-to-r from-green-600 to-emerald-700 text-white px-8 py-4 rounded-xl hover:from-green-700 hover:to-emerald-800 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-green-500/30 font-medium">
                                    Subscribe
                                </button>
                            </div>
                            <p className="text-sm text-gray-500 mt-4 text-center">By subscribing, you agree to receive marketing emails from EcoBay. You can unsubscribe at any time.</p>
                        </div>
                        
                        <div className="flex flex-wrap justify-center gap-4 mt-12">
                            <div className="flex items-center gap-2 bg-green-50 px-4 py-2 rounded-full">
                                <FaLeaf className="text-green-600" />
                                <span className="text-sm font-medium text-green-800">Eco Tips</span>
                            </div>
                            <div className="flex items-center gap-2 bg-green-50 px-4 py-2 rounded-full">
                                <FaShoppingBag className="text-green-600" />
                                <span className="text-sm font-medium text-green-800">New Products</span>
                            </div>
                            <div className="flex items-center gap-2 bg-green-50 px-4 py-2 rounded-full">
                                <FaStar className="text-green-600" />
                                <span className="text-sm font-medium text-green-800">Exclusive Offers</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
