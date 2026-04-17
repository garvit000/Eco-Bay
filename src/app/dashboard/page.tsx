"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../Components/navbar";
import { auth } from "../../../ecobaybackend/lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { ShoppingBag, Leaf, Recycle, Star, Package, TrendingUp } from "lucide-react";
import Link from "next/link";

const stats = [
  { label: "Orders Placed", value: "0", icon: ShoppingBag, color: "bg-emerald-100 text-emerald-600" },
  { label: "Cart Items", value: "0", icon: Package, color: "bg-teal-100 text-teal-600" },
  { label: "Eco Points", value: "0", icon: Star, color: "bg-yellow-100 text-yellow-600" },
  { label: "CO₂ Saved", value: "0 kg", icon: Leaf, color: "bg-green-100 text-green-600" },
];

const quickLinks = [
  { label: "Browse Products", href: "/products", icon: ShoppingBag, desc: "Discover eco-friendly items" },
  { label: "Sustainability Tips", href: "/#eco-checker", icon: Recycle, desc: "Check any product's impact" },
  { label: "Our Mission", href: "/about", icon: TrendingUp, desc: "Learn why we do this" },
];

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (!firebaseUser) {
        router.push("/login");
      } else {
        setUser(firebaseUser);
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-emerald-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-emerald-400 border-t-transparent rounded-full animate-spin" />
          <p className="text-emerald-700 font-medium">Loading your dashboard…</p>
        </div>
      </div>
    );
  }

  if (!auth) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen flex items-center justify-center bg-emerald-50 px-6">
          <div className="max-w-lg bg-white border border-emerald-200 rounded-2xl shadow-sm p-6 text-center">
            <h1 className="text-xl font-semibold text-emerald-800">Firebase is not configured</h1>
            <p className="mt-2 text-sm text-gray-600">
              Add your NEXT_PUBLIC_FIREBASE_* environment variables in Vercel Project Settings,
              then redeploy.
            </p>
          </div>
        </main>
      </>
    );
  }

  const displayName = user?.displayName ?? user?.email?.split("@")[0] ?? "there";

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-white">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-700 to-green-600 text-white px-6 py-12">
          <div className="max-w-5xl mx-auto">
            <p className="text-emerald-200 mb-1">Welcome back,</p>
            <h1 className="text-3xl md:text-4xl font-bold capitalize">{displayName} 👋</h1>
            <p className="mt-2 text-emerald-100 text-sm">{user?.email}</p>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-6 py-10 space-y-10">
          {/* Stats */}
          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Your Overview</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {stats.map((stat) => (
                <div key={stat.label} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-col gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.color}`}>
                    <stat.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Quick links */}
          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
            <div className="grid md:grid-cols-3 gap-4">
              {quickLinks.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md hover:border-emerald-200 transition-all group"
                >
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <item.icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-semibold text-gray-800 group-hover:text-emerald-600 transition-colors">{item.label}</h3>
                  <p className="text-sm text-gray-500 mt-1">{item.desc}</p>
                </Link>
              ))}
            </div>
          </section>

          {/* Recent activity */}
          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Activity</h2>
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center">
              <Leaf className="w-12 h-12 text-emerald-200 mx-auto mb-3" />
              <p className="text-gray-500 font-medium">No activity yet</p>
              <p className="text-sm text-gray-400 mt-1">Start shopping to see your eco impact here!</p>
              <Link
                href="/products"
                className="inline-block mt-4 px-6 py-2 bg-emerald-600 text-white text-sm font-medium rounded-full hover:bg-emerald-700 transition-colors"
              >
                Shop Now
              </Link>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
