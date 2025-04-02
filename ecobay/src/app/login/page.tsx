"use client";
import Navbar from "../Components/navbar";
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../../ecobaybackend/lib/firebase";
import { useRouter } from "next/navigation";

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); // Reset error message before trying to login

    try {
      // Try to log in with email and password
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/dashboard"); // Redirect to the dashboard after successful login
    } catch (error: any) {
      setError(error.message); // Show any error message (e.g., invalid credentials)
    }
  };
export default function Login() {
    return (
        <>
        <Navbar/>
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-50 to-teal-100 p-6">
            <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 border border-green-100">
                <div className="mb-6 text-center">
                    <h2 className="text-3xl font-bold text-green-800">Welcome Back</h2>
                    <p className="text-gray-600 mt-2">Sign in to your EcoBay account</p>
                </div>
                
                <form className="space-y-5">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                        <input 
                            type="email" 
                            id="email" 
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all" 
                            required 
                            placeholder="your@email.com"
                        />
                    </div>
                    
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input 
                            type="password" 
                            id="password" 
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all" 
                            required 
                            placeholder="••••••••"
                        />
                    </div>
                    
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <input id="remember-me" type="checkbox" className="h-4 w-4 text-green-600 rounded border-gray-300" />
                            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">Remember me</label>
                        </div>
                        <a href="#" className="text-sm font-medium text-green-600 hover:text-green-800">Forgot password?</a>
                    </div>
                    
                    <button 
                        type="submit" 
                        className="w-full py-3 px-4 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition duration-300 ease-in-out"
                    >
                        Sign in
                    </button>
                </form>
                
                <div className="mt-6 text-center text-sm text-gray-600">
                    Don't have an account?{" "}
                    <a href="/register" className="font-medium text-green-600 hover:text-green-800">
                        Sign up
                    </a>
                </div>
            </div>
        </div>
        </>
    );
}