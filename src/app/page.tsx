import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Welcome to Edux</h1>
        <p className="text-gray-600 mb-8">Education Tracking & Attendance System</p>
        <div className="space-x-4">
          <Link href="/login" className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Login
          </Link>
          <Link href="/register" className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700">
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}
