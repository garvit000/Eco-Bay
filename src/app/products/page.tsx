"use client";
import { useState } from "react";
import Navbar from "../Components/navbar";
import { FaLeaf, FaStar, FaShoppingCart } from "react-icons/fa";

const categories = ["All", "Clothing", "Home", "Beauty", "Food", "Accessories"] as const;
type Category = (typeof categories)[number];

interface Product {
  id: number;
  name: string;
  price: number;
  category: Exclude<Category, "All">;
  ecoRating: number;
  badge: string;
  badgeColor: string;
  description: string;
  image: string;
}

const products: Product[] = [
  {
    id: 1,
    name: "Organic Cotton Tee",
    price: 29.99,
    category: "Clothing",
    ecoRating: 5,
    badge: "Organic",
    badgeColor: "bg-green-100 text-green-700",
    description: "100% GOTS-certified organic cotton, fairwage-made.",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&q=80",
  },
  {
    id: 2,
    name: "Bamboo Toothbrush Set",
    price: 12.99,
    category: "Beauty",
    ecoRating: 5,
    badge: "Zero Waste",
    badgeColor: "bg-teal-100 text-teal-700",
    description: "Biodegradable handles, plant-based bristles. Pack of 4.",
    image: "https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=400&q=80",
  },
  {
    id: 3,
    name: "Beeswax Food Wraps",
    price: 18.50,
    category: "Home",
    ecoRating: 5,
    badge: "Reusable",
    badgeColor: "bg-yellow-100 text-yellow-700",
    description: "Replace single-use plastic wrap. Washable & reusable 200+ times.",
    image: "https://images.unsplash.com/photo-1610348725531-843dff563e2c?w=400&q=80",
  },
  {
    id: 4,
    name: "Recycled Denim Tote",
    price: 34.00,
    category: "Accessories",
    ecoRating: 4,
    badge: "Upcycled",
    badgeColor: "bg-blue-100 text-blue-700",
    description: "Crafted from post-consumer recycled denim. Extra sturdy.",
    image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=400&q=80",
  },
  {
    id: 5,
    name: "Organic Acai Powder",
    price: 22.00,
    category: "Food",
    ecoRating: 5,
    badge: "Organic",
    badgeColor: "bg-green-100 text-green-700",
    description: "Raw, freeze-dried, sustainably harvested from the Amazon.",
    image: "https://images.unsplash.com/photo-1490914327627-9fe8d52f4d90?w=400&q=80",
  },
  {
    id: 6,
    name: "Hemp Moisturiser",
    price: 27.99,
    category: "Beauty",
    ecoRating: 4,
    badge: "Vegan",
    badgeColor: "bg-emerald-100 text-emerald-700",
    description: "Cold-pressed hemp seed oil. Cruelty-free, glass packaging.",
    image: "https://images.unsplash.com/photo-1612817159949-195b6eb9e31a?w=400&q=80",
  },
  {
    id: 7,
    name: "Solar-Powered Lantern",
    price: 45.00,
    category: "Home",
    ecoRating: 5,
    badge: "Solar",
    badgeColor: "bg-amber-100 text-amber-700",
    description: "Charges in 6 hrs of sunlight. Lasts 12 hrs on a full charge.",
    image: "https://images.unsplash.com/photo-1524725407048-1117e2d45e64?w=400&q=80",
  },
  {
    id: 8,
    name: "Plant-Based Sneakers",
    price: 89.99,
    category: "Clothing",
    ecoRating: 4,
    badge: "Vegan",
    badgeColor: "bg-emerald-100 text-emerald-700",
    description: "Upper from corn leather, sole from natural rubber. Carbon-neutral shipping.",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80",
  },
  {
    id: 9,
    name: "Compostable Bin Liners",
    price: 9.99,
    category: "Home",
    ecoRating: 5,
    badge: "Compostable",
    badgeColor: "bg-lime-100 text-lime-700",
    description: "Certified EN13432 compostable. Pack of 30, 10L size.",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80",
  },
  {
    id: 10,
    name: "Reusable Coffee Cup",
    price: 19.99,
    category: "Accessories",
    ecoRating: 5,
    badge: "Zero Waste",
    badgeColor: "bg-teal-100 text-teal-700",
    description: "12oz glass & silicone. Leak-proof lid, dishwasher-safe.",
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&q=80",
  },
  {
    id: 11,
    name: "Whole-Grain Granola",
    price: 14.50,
    category: "Food",
    ecoRating: 4,
    badge: "Organic",
    badgeColor: "bg-green-100 text-green-700",
    description: "Oats, seeds & dried fruit. Plastic-free kraft paper bag.",
    image: "https://images.unsplash.com/photo-1517093728267-0b8ea7430b44?w=400&q=80",
  },
  {
    id: 12,
    name: "Linen Throw Blanket",
    price: 59.00,
    category: "Home",
    ecoRating: 4,
    badge: "Natural",
    badgeColor: "bg-stone-100 text-stone-700",
    description: "100% European flax linen. Free of dyes or chemical finishes.",
    image: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=400&q=80",
  },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <FaStar
          key={s}
          className={s <= rating ? "text-yellow-400" : "text-gray-200"}
          size={12}
        />
      ))}
    </div>
  );
}

export default function ProductsPage() {
  const [activeCategory, setActiveCategory] = useState<Category>("All");
  const [addedIds, setAddedIds] = useState<Set<number>>(new Set());

  const filtered =
    activeCategory === "All"
      ? products
      : products.filter((p) => p.category === activeCategory);

  const handleAdd = (id: number) => {
    setAddedIds((prev) => new Set(prev).add(id));
    setTimeout(() => {
      setAddedIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }, 1500);
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
        {/* Hero */}
        <div className="bg-gradient-to-r from-emerald-700 to-green-600 py-14 px-6 text-center text-white">
          <span className="inline-block bg-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full mb-4 uppercase tracking-widest">
            Marketplace
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-3">
            Eco-Friendly Products
          </h1>
          <p className="text-emerald-100 max-w-xl mx-auto text-lg">
            Every item here is vetted for sustainability — shop knowing you&apos;re making a difference.
          </p>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-10">
          {/* Category filter */}
          <div className="flex flex-wrap gap-2 mb-8 justify-center">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  activeCategory === cat
                    ? "bg-emerald-600 text-white shadow-md"
                    : "bg-white text-gray-600 border border-gray-200 hover:border-emerald-400 hover:text-emerald-600"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <p className="text-sm text-gray-500 mb-6 text-center">
            {filtered.length} product{filtered.length !== 1 ? "s" : ""}
            {activeCategory !== "All" ? ` in ${activeCategory}` : " across all categories"}
          </p>

          {/* Product grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col"
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden bg-gray-50">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                  <span
                    className={`absolute top-3 left-3 text-xs font-semibold px-2 py-1 rounded-full ${product.badgeColor}`}
                  >
                    {product.badge}
                  </span>
                </div>

                {/* Content */}
                <div className="p-4 flex flex-col flex-grow">
                  <div className="flex items-start justify-between mb-1">
                    <h3 className="font-semibold text-gray-800 text-sm leading-tight">{product.name}</h3>
                    <span className="text-emerald-600 font-bold text-sm ml-2 whitespace-nowrap">
                      ${product.price.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 mb-2">
                    <StarRating rating={product.ecoRating} />
                    <span className="text-xs text-gray-400">Eco {product.ecoRating}/5</span>
                  </div>

                  <p className="text-xs text-gray-500 leading-relaxed flex-grow">{product.description}</p>

                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
                    <span className="inline-flex items-center gap-1 text-xs text-emerald-600 font-medium">
                      <FaLeaf size={10} />
                      {product.category}
                    </span>
                    <button
                      onClick={() => handleAdd(product.id)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-300 ${
                        addedIds.has(product.id)
                          ? "bg-green-100 text-green-700"
                          : "bg-emerald-600 text-white hover:bg-emerald-700"
                      }`}
                    >
                      <FaShoppingCart size={10} />
                      {addedIds.has(product.id) ? "Added!" : "Add to Cart"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
