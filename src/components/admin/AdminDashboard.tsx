'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import {
  Building2,
  Users,
  FileText,
  TrendingUp,
  AlertCircle,
  Activity,
  User
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import type { DashboardStats, ActivityLog } from '@/types';

export const AdminDashboard = () => {
  const { user, loading } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user?.isAdmin) return;

      try {
        const [statsResponse, activitiesResponse] = await Promise.all([
          fetch('/api/admin/stats'),
          fetch('/api/admin/activities')
        ]);

        const statsData = await statsResponse.json();
        const activitiesData = await activitiesResponse.json();

        setStats(statsData);
        setActivities(activitiesData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoadingData(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  if (loading || loadingData) {
    return <div>Loading...</div>;
  }

  if (!user?.isAdmin) {
    return <div>Access denied. Admin privileges required.</div>;
  }

  return (
    <div className="p-6 space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Users"
          value={stats?.totalUsers || 0}
          icon={<User className="w-6 h-6" />}
          trend={stats?.usersTrend || []}
        />
        <StatCard
          title="Total Companies"
          value={stats?.totalCompanies || 0}
          icon={<Building2 className="w-6 h-6" />}
          trend={stats?.companiesTrend || []}
        />
        <StatCard
          title="New Documents"
          value={stats?.newDocuments || 0}
          icon={<FileText className="w-6 h-6" />}
          trend={stats?.documentsTrend || []}
        />
        <StatCard
          title="System Health"
          value={stats?.systemHealth.status || 'N/A'}
          icon={<AlertCircle className="w-6 h-6" />}
          status={stats?.systemHealth.status}
        />
      </div>

      {/* Activity Chart */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium mb-4">Activity Overview</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={stats?.activityData || []}>
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#3B82F6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Activity Log */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium mb-4">Recent Activity</h3>
        <div className="space-y-4">
          {activities.map((activity) => (
            <ActivityItem key={activity.id} activity={activity} />
          ))}
        </div>
      </div>
    </div>
  );
};

interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  trend?: { date: string; count: number }[];
  status?: 'healthy' | 'warning' | 'error';
}

const StatCard = ({ title, value, icon, trend, status }: StatCardProps) => (
  <div className="bg-white p-6 rounded-lg shadow">
    <div className="flex items-center">
      <div className={`p-2 rounded-lg ${
        status === 'error' ? 'bg-red-50' :
        status === 'warning' ? 'bg-yellow-50' :
        'bg-blue-50'
      }`}>
        {React.cloneElement(icon as React.ReactElement, {
          className: `w-6 h-6 ${
            status === 'error' ? 'text-red-500' :
            status === 'warning' ? 'text-yellow-500' :
            'text-blue-500'
          }`
        })}
      </div>
      <div className="ml-4">
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        <p className="text-2xl font-semibold">{value}</p>
      </div>
    </div>
    {trend && trend.length > 0 && (
      <div className="mt-4 h-16">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={trend}>
            <Line type="monotone" dataKey="count" stroke="#3B82F6" dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    )}
  </div>
);
