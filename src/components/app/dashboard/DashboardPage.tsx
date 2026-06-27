"use client";
import DashboardChildrenLayout from '@/components/shared/DashboardChildrenLayout';
import DashboardStats from './DashboardStats';
import ClassPerformanceChart from './ClassPerformanceChart';
import StandardsMastery from './StandardsMastery';
import RecentActivity from './RecentActivity';
import QuickActions from './QuickActions';


const DashboardPage = () => {
  return (
    <DashboardChildrenLayout title="Good morning, Ms. Johnson 👋" subtitle=" Monday, June 16, 2026 — Grade 4">

      {/* 4 Stat Cards */}
      <DashboardStats />

      {/* Row 3 - Performance & Standards Mastery */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6">
        <ClassPerformanceChart />
        <StandardsMastery />
      </div>

      {/* Row 4 - Recent Activity & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5" id="activity-and-actions-row">
        {/* Left 60%: Recent Activity */}
        <RecentActivity/>

        {/* Right 40%: Quick Actions */}
        <QuickActions/>
      </div>
    </DashboardChildrenLayout>
  );
}

export default DashboardPage;