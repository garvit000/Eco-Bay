'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShoppingCart, User, LogIn, Menu, X } from 'lucide-react';



const Navbar = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const router = useRouter();

    useEffect(() => {
        // Check if user is logged in from localStorage or your auth system
        const userToken = localStorage.getItem('userToken');
        setIsLoggedIn(!!userToken);
    }, []);

    const handleCartClick = () => {
        if (isLoggedIn) {
            router.push('/cart');
        } else {
            router.push('./login');
        }
    };

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    return (
        <nav className="bg-white shadow-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link href="/" className="flex-shrink-0 flex items-center">
                            <span className="text-2xl font-bold text-emerald-600">Eco-Bay</span>
                        </Link>
                        
                        <div className="hidden md:ml-6 md:flex md:space-x-8">
                            <Link href="/" className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-700 hover:text-emerald-600 hover:border-b-2 hover:border-emerald-500 transition-colors">
                                Home
                            </Link>
                            <Link href="/products" className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-700 hover:text-emerald-600 hover:border-b-2 hover:border-emerald-500 transition-colors">
                                Products
                            </Link>
                            <Link href="/about" className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-700 hover:text-emerald-600 hover:border-b-2 hover:border-emerald-500 transition-colors">
                                About
                            </Link>
                            <Link href="/contact" className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-700 hover:text-emerald-600 hover:border-b-2 hover:border-emerald-500 transition-colors">
                                Contact
                            </Link>
                        </div>
                    </div>
                    
                    <div className="hidden md:flex items-center space-x-4">
                        {isLoggedIn ? (
                            <Link href="/profile" className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 hover:text-emerald-600">
                                <User className="h-5 w-5 mr-1" />
                                Profile
                            </Link>
                        ) : (
                            <Link href="/login" className="inline-flex items-center px-4 py-2 text-sm font-medium bg-emerald-500 text-white rounded-md hover:bg-emerald-600 transition-colors">
                                <LogIn className="h-5 w-5 mr-1" />
                                Login / Signup
                            </Link>
                        )}
                        
                        <button
                            onClick={handleCartClick}
                            className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 hover:text-emerald-600"
                        >
                            <ShoppingCart className="h-5 w-5" />
                            <span className="ml-1">Cart</span>
                            <span className="absolute -top-1 -right-1 bg-emerald-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                0
                            </span>
                        </button>
                    </div>
                    
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={handleCartClick}
                            className="relative p-2 text-gray-700 hover:text-emerald-600 mr-2"
                        >
                            <ShoppingCart className="h-6 w-6" />
                            <span className="absolute -top-1 -right-1 bg-emerald-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                0
                            </span>
                        </button>
                        
                        <button
                            onClick={toggleMobileMenu}
                            className="p-2 rounded-md text-gray-700 hover:text-emerald-600 focus:outline-none"
                        >
                            {isMobileMenuOpen ? (
                                <X className="h-6 w-6" />
                            ) : (
                                <Menu className="h-6 w-6" />
                            )}
                        </button>
                    </div>
                </div>
            </div>
            
            {isMobileMenuOpen && (
                <div className="md:hidden">
                    <div className="px-2 pt-2 pb-3 space-y-1 border-t">
                        <Link href="/" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-emerald-600 hover:bg-gray-50">
                            Home
                        </Link>
                        <Link href="/products" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-emerald-600 hover:bg-gray-50">
                            Products
                        </Link>
                        <Link href="/about" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-emerald-600 hover:bg-gray-50">
                            About
                        </Link>
                        <Link href="/contact" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-emerald-600 hover:bg-gray-50">
                            Contact
                        </Link>
                        {!isLoggedIn && (
                            <Link href="/login" className="block px-3 py-2 rounded-md text-base font-medium text-white bg-emerald-500 hover:bg-emerald-600">
                                Login / Signup
                            </Link>
                        )}
                        {isLoggedIn && (
                            <Link href="/profile" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-emerald-600 hover:bg-gray-50">
                                Profile
                            </Link>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;