import Link from "next/link";

export default function Unauthorized() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-center px-4">
      <h1 className="text-5xl font-bold text-red-600">403</h1>
      <h2 className="text-2xl font-semibold mt-4">Access Denied</h2>
      <p className="text-gray-600 mt-2">
        You do not have permission to view this page.
      </p>

      <Link
        href="/"
        className="mt-6 px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition"
      >
        Go Back Home
      </Link>
    </div>
  );
}
