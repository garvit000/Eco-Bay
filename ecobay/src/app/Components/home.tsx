"use client";
import Link from "next/link";
import { FaLeaf, FaShoppingBag, FaRecycle, FaLink, FaBarcode, FaEnvelope } from "react-icons/fa";
import { useState } from "react";

export default function Home() {
    const [productUrl, setProductUrl] = useState("");
    const [rating, setRating] = useState<number | null>(null);
    const [isScanning, setIsScanning] = useState(false);
    const [email, setEmail] = useState("");

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
        <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
            {/* Hero Section */}
            <div className="relative h-[500px] overflow-hidden">
                <div className="absolute inset-0 bg-green-800/30 z-10"></div>
                <div className="relative z-20 h-full flex flex-col items-center justify-center p-8 text-center">
                    <h1 className="text-5xl md:text-7xl font-bold text-white drop-shadow-lg">
                        Welcome to <span className="text-green-400">EcoBay</span>
                    </h1>
                    <p className="text-xl mt-6 max-w-2xl text-white font-light">
                        Your marketplace for eco-friendly and sustainable products
                    </p>
                    <div className="mt-10 flex gap-6">
                        <Link href="/products">
                            <button className="bg-green-600 text-white px-8 py-3 rounded-full hover:bg-green-700 transform transition duration-300 hover:scale-105 shadow-lg flex items-center gap-2">
                                <FaShoppingBag /> Shop Now
                            </button>
                        </Link>
                        <Link href="/about">
                            <button className="bg-white/80 backdrop-blur-sm text-green-700 border-2 border-green-600 px-8 py-3 rounded-full hover:bg-white transition duration-300 hover:scale-105 shadow-lg">
                                Learn More
                            </button>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Sustainability Checker Section */}
            <div className="max-w-4xl mx-auto py-16 px-4">
                <h2 className="text-3xl font-bold text-center text-green-800 mb-6">Check Product Sustainability</h2>
                <p className="text-center text-gray-700 mb-8">Enter a product URL or scan a barcode to check its sustainability rating</p>
                
                <div className="bg-white p-8 rounded-xl shadow-lg transition-all hover:shadow-xl">
                    <div className="flex flex-col md:flex-row gap-4 mb-6">
                        <div className="flex-grow">
                            <input 
                                type="text" 
                                placeholder="Enter product URL" 
                                className="w-full px-4 py-3 rounded-md border border-gray-300 shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                                value={productUrl}
                                onChange={(e) => setProductUrl(e.target.value)}
                            />
                        </div>
                        <button 
                            onClick={checkSustainability}
                            className="bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 shadow-md flex items-center justify-center gap-2 transition-colors"
                        >
                            <FaLink /> Check URL
                        </button>
                        <button 
                            onClick={handleScan}
                            className={`${isScanning ? 'bg-gray-500' : 'bg-green-700 hover:bg-green-800'} text-white px-6 py-3 rounded-md shadow-md flex items-center justify-center gap-2 transition-colors`}
                            disabled={isScanning}
                        >
                            <FaBarcode /> {isScanning ? "Scanning..." : "Scan Barcode"}
                        </button>
                    </div>
                    
                    {rating !== null && (
                        <div className="mt-6 p-6 border border-green-200 rounded-lg bg-green-50 transform transition-all animate-fadeIn">
                            <h3 className="text-xl font-semibold text-green-800 mb-4">Sustainability Rating</h3>
                            <div className="flex items-center">
                                <div className="w-full bg-gray-200 rounded-full h-6">
                                    <div 
                                        className={`h-6 rounded-full ${
                                            rating < 2 ? 'bg-red-500' : 
                                            rating < 3.5 ? 'bg-yellow-500' : 
                                            'bg-green-500'
                                        } transition-all duration-1000 ease-out`}
                                        style={{ width: `${(rating / 5) * 100}%` }}
                                    ></div>
                                </div>
                                <span className="ml-4 font-bold text-lg">{rating.toFixed(1)}/5.0</span>
                            </div>
                            <p className="mt-4 text-gray-700">
                                {rating < 2 ? 'This product has poor sustainability ratings.' : 
                                 rating < 3.5 ? 'This product has average sustainability ratings.' : 
                                 'This product has excellent sustainability ratings!'}
                            </p>
                            <div className="mt-4 text-sm text-gray-500">
                                {rating >= 3.5 && (
                                    <p className="flex items-center gap-1"><FaLeaf className="text-green-500" /> Eco-friendly choice!</p>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

           {/* Features Section */}
           <div className="max-w-6xl mx-auto py-20 px-4">
                <h2 className="text-4xl font-bold text-center text-green-800 mb-16">Why Choose EcoBay?</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    <div className="bg-white p-10 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group">
                        <div className="text-green-500 text-5xl mb-6 flex justify-center group-hover:scale-110 transition-transform">
                            <FaLeaf />
                        </div>
                        <h3 className="text-2xl font-semibold text-center text-gray-800 mb-4">Sustainable Products</h3>
                        <p className="text-gray-600 text-center">All our products are carefully selected to meet strict sustainability standards.</p>
                    </div>
                    
                    <div className="bg-white p-10 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group">
                        <div className="text-green-500 text-5xl mb-6 flex justify-center group-hover:scale-110 transition-transform">
                            <FaRecycle />
                        </div>
                        <h3 className="text-2xl font-semibold text-center text-gray-800 mb-4">Eco-Friendly Packaging</h3>
                        <p className="text-gray-600 text-center">We ensure all our deliveries use minimal and recyclable packaging materials.</p>
                    </div>
                    
                    <div className="bg-white p-10 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group">
                        <div className="text-green-500 text-5xl mb-6 flex justify-center group-hover:scale-110 transition-transform">
                            <FaShoppingBag />
                        </div>
                        <h3 className="text-2xl font-semibold text-center text-gray-800 mb-4">Ethical Marketplace</h3>
                        <p className="text-gray-600 text-center">Supporting businesses that prioritize ethical practices and sustainability.</p>
                    </div>
                </div>
            </div>

            {/* Newsletter Section */}
            <div className="bg-gradient-to-r from-green-100 to-green-200 py-20">
                <div className="max-w-4xl mx-auto text-center px-4">
                    <h2 className="text-3xl font-bold text-green-800 mb-4">Join Our Eco-Friendly Community</h2>
                    <p className="text-gray-700 mb-8">Be the first to know about new sustainable products and exclusive offers.</p>
                    <div className="flex flex-col sm:flex-row justify-center gap-3">
                        <input 
                            type="email" 
                            placeholder="Your email address" 
                            className="px-4 py-3 rounded-md border-gray-300 shadow-sm focus:ring-green-500 focus:border-green-500 flex-grow max-w-md"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <button className="bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 shadow-md transition-colors flex items-center justify-center gap-2">
                            <FaEnvelope /> Subscribe
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
