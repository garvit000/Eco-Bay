import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-4xl font-bold text-center text-green-600">Welcome to EcoBay</h1>
      <p className="text-center mt-2 text-gray-600">
        Discover and shop for truly sustainable products.
      </p>

      {/* Button to go to product listings */}
      <div className="flex justify-center mt-6">
        <Link href="/products">
          <button className="bg-green-500 text-white px-6 py-3 rounded-md hover:bg-green-700">
            Browse Products
          </button>
        </Link>
      </div>
    </div>
  );
}
