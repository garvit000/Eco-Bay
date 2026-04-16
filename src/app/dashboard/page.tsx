import Navbar from "../Components/navbar";

export default function DashboardPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-white px-6 py-16">
        <section className="mx-auto max-w-4xl rounded-2xl border border-emerald-100 bg-white p-8 shadow-xl">
          <h1 className="text-3xl font-bold text-emerald-800">Dashboard</h1>
          <p className="mt-3 text-gray-700">
            Login successful. You are now signed in with the mock account.
          </p>
        </section>
      </main>
    </>
  );
}
