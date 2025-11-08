import DashboardLayout from '@/components/layout/DashboardLayout';
import StatCard from '@/components/ui/StatCard';
import { ADMIN_NAV_ITEMS } from '@/lib/constants/navigation';

export default function AdminDashboard() {
  return (
    <DashboardLayout navItems={ADMIN_NAV_ITEMS} role="admin">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Administrator Dashboard
        </h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Students"
            value="1,234"
            icon="👨‍🎓"
            trend={{ value: 12, isPositive: true }}
          />
          <StatCard
            title="Total Teachers"
            value="56"
            icon="👨‍🏫"
            trend={{ value: 5, isPositive: true }}
          />
          <StatCard
            title="Active Modules"
            value="28"
            icon="📚"
          />
          <StatCard
            title="Attendance Rate"
            value="94.5%"
            icon="✅"
            trend={{ value: 2.3, isPositive: true }}
          />
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          <div className="space-y-3">
            <ActivityItem
              text="New student registered: John Doe"
              time="2 hours ago"
            />
            <ActivityItem
              text="Attendance marked for Module CS101"
              time="3 hours ago"
            />
            <ActivityItem
              text="New announcement posted"
              time="5 hours ago"
            />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Add New Student
            </button>
            <button className="px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700">
              Create Announcement
            </button>
            <button className="px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
              Generate Report
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

function ActivityItem({ text, time }: { text: string; time: string }) {
  return (
    <div className="flex items-center justify-between py-2 border-b last:border-b-0">
      <span className="text-gray-700">{text}</span>
      <span className="text-sm text-gray-500">{time}</span>
    </div>
  );
}

