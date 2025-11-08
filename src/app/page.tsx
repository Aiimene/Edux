import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <span className="text-blue-600 font-bold text-2xl">Edux ↑</span>
            </div>
            <div className="flex gap-4">
              <Link
                href="/login"
                className="px-4 py-2 text-gray-700 hover:text-blue-600"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Welcome to Edux
          </h1>
          <p className="text-xl text-gray-600 mb-4">
            Education Tracking & Attendance System
          </p>
          <p className="text-lg text-gray-500 max-w-3xl mx-auto mb-12">
            A comprehensive platform for managing supplementary courses, tracking
            student attendance, and facilitating communication between
            administrators, teachers, students, and parents.
          </p>

          {/* Role Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
            <RoleCard
              title="Administrator"
              description="Manage the entire system, users, and academic operations"
              icon="👨‍💼"
              href="/admin/dashboard"
            />
            <RoleCard
              title="Teacher"
              description="Track attendance, manage classes and communicate with students"
              icon="👨‍🏫"
              href="/teacher/dashboard"
            />
            <RoleCard
              title="Student"
              description="View courses, check attendance and stay updated"
              icon="👨‍🎓"
              href="/student/dashboard"
            />
            <RoleCard
              title="Parent"
              description="Monitor your children's progress and attendance"
              icon="👨‍👩‍👧"
              href="/parent/dashboard"
            />
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-24">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Key Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon="📊"
              title="Analytics Dashboard"
              description="Comprehensive insights into attendance patterns and performance"
            />
            <FeatureCard
              icon="✅"
              title="Attendance Tracking"
              description="Real-time attendance management for all supplementary courses"
            />
            <FeatureCard
              icon="📅"
              title="Timetable Management"
              description="Organize and view class schedules efficiently"
            />
            <FeatureCard
              icon="📢"
              title="Announcements"
              description="Stay connected with important updates and notifications"
            />
            <FeatureCard
              icon="👥"
              title="Member Management"
              description="Efficiently manage students, teachers, and parents"
            />
            <FeatureCard
              icon="📚"
              title="Course Modules"
              description="Organize supplementary courses and learning materials"
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white mt-24 py-8 border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-600">
          <p>&copy; 2025 Edux. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

function RoleCard({
  title,
  description,
  icon,
  href,
}: {
  title: string;
  description: string;
  icon: string;
  href: string;
}) {
  return (
    <Link href={href}>
      <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-shadow cursor-pointer h-full">
        <div className="text-4xl mb-4">{icon}</div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 text-sm">{description}</p>
      </div>
    </Link>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="text-3xl mb-3">{icon}</div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
    </div>
  );
}
