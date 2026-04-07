"use client";

import React, { useState, useEffect, useMemo } from "react";
import Cookies from "js-cookie";
import { DateRange } from "react-day-picker";
import { 
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell 
} from "recharts";

import { analyticsApi } from "@/lib/dashboardApi";
import { FilterBar } from "@/components/dashboard/FilterBar";
import { useAuth } from "@/components/auth/AuthContext";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {

  const { user, isLoading, logout } = useAuth();
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [age, setAge] = useState<string>("all");
  const [gender, setGender] = useState<string>("all");
  
  const [barData, setBarData] = useState([]);
  const [lineDataRaw, setLineDataRaw] = useState([]);
  
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null);

  useEffect(() => {
    const savedAge = Cookies.get("filter_age");
    const savedGender = Cookies.get("filter_gender");
    const savedDateFrom = Cookies.get("filter_date_from");
    const savedDateTo = Cookies.get("filter_date_to");

    if (savedAge) setAge(savedAge);
    if (savedGender) setGender(savedGender);
    if (savedDateFrom) {
      setDateRange({
        from: new Date(savedDateFrom),
        to: savedDateTo ? new Date(savedDateTo) : undefined,
      });
    }
  }, []);

  useEffect(() => {
    const fetchAnalytics = async () => {
      Cookies.set("filter_age", age);
      Cookies.set("filter_gender", gender);
      if (dateRange?.from) Cookies.set("filter_date_from", dateRange.from.toISOString());
      if (dateRange?.to) Cookies.set("filter_date_to", dateRange.to.toISOString());

      const params: any = {};
      if (age !== "all") params.age = age;
      if (gender !== "all") params.gender = gender;
      if (dateRange?.from && dateRange?.to) {
        params.startDate = dateRange.from.toISOString();
        params.endDate = dateRange.to.toISOString();
      }

      try {
        const data = await analyticsApi.fetchData(params);
        setBarData(data.barChart);
        setLineDataRaw(data.lineChart);
        // Reset selected feature when filters change
        setSelectedFeature(null); 
      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
      }
    };

    fetchAnalytics();
  }, [age, gender, dateRange]);

  const processedLineData = useMemo(() => {
    if (!lineDataRaw.length) return [];

    const filtered = selectedFeature 
      ? lineDataRaw.filter((d: any) => d.feature_name === selectedFeature)
      : lineDataRaw;

    const counts: Record<string, number> = {};
    filtered.forEach((d: any) => {
      const dateStr = new Date(d.timestamp).toISOString().split('T')[0]; // Format: YYYY-MM-DD
      counts[dateStr] = (counts[dateStr] || 0) + 1;
    });

    return Object.entries(counts)
      .map(([date, clicks]) => ({ date, clicks }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [lineDataRaw, selectedFeature]);

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-7xl mx-auto space-y-6">


      <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Product Analytics</h1>
            <p className="text-slate-500 text-sm mt-1">Welcome back, {user ? user.username : "user"}</p>
          </div>
          <div className="flex items-center gap-4">
             {selectedFeature && (
              <button 
                onClick={() => setSelectedFeature(null)}
                className="text-sm text-blue-600 hover:underline"
              >
                Clear Chart Selection
              </button>
            )}
            <Button variant="outline" onClick={logout}>Logout</Button>
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          
          {selectedFeature && (
            <button 
              onClick={() => setSelectedFeature(null)}
              className="text-sm text-blue-600 hover:underline"
            >
              Clear Chart Selection
            </button>
          )}
        </div>

        <FilterBar 
          dateRange={dateRange} setDateRange={setDateRange}
          age={age} setAge={setAge}
          gender={gender} setGender={setGender}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* bar Chart section */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h2 className="text-lg font-semibold mb-6">Total Clicks by Feature</h2>
            <div className="h-75">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} layout="vertical" margin={{ left: 40 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" />
                  <YAxis dataKey="feature" type="category" width={100} fontSize={12} />
                  <Tooltip cursor={{fill: '#f1f5f9'}} />
                  <Bar 
                    dataKey="clicks" 
                    fill="#3b82f6" 
                    radius={[0, 4, 4, 0]}
                    onClick={(data:any) => setSelectedFeature(data.feature)}
                    className="cursor-pointer hover:opacity-80 transition-opacity"
                  >
                    {barData.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={selectedFeature === entry.feature ? '#1d4ed8' : '#3b82f6'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="text-xs text-slate-500 text-center mt-4">Click a bar to view its daily trend</p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h2 className="text-lg font-semibold mb-6">
              {selectedFeature ? `Daily Trend: ${selectedFeature}` : 'Daily Trend: All Features'}
            </h2>
            <div className="h-75">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={processedLineData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="date" fontSize={12} tickMargin={10} />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="clicks" 
                    stroke="#10b981" 
                    strokeWidth={3} 
                    dot={{ r: 4 }} 
                    activeDot={{ r: 6 }} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}