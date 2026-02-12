import { Activity, Globe, Layout, Users } from "lucide-react";

interface DashboardStatsProps {
  totalWebsites: number;
  activeWebsites: number;
  totalViews?: number;
}

export function DashboardStats({
  totalWebsites,
  activeWebsites,
  totalViews = 0,
}: DashboardStatsProps) {
  const stats = [
    {
      label: "Tổng Website",
      value: totalWebsites,
      icon: Layout,
      color: "text-blue-500",
      bg: "bg-blue-50 dark:bg-blue-950/20",
    },
    {
      label: "Đang hoạt động",
      value: activeWebsites,
      icon: Globe,
      color: "text-green-500",
      bg: "bg-green-50 dark:bg-green-950/20",
    },
    {
      label: "Tổng lượt xem",
      value: totalViews.toLocaleString(),
      icon: Users,
      color: "text-orange-500",
      bg: "bg-orange-50 dark:bg-orange-950/20",
    },
    {
      label: "Hiệu suất TB",
      value: "98%",
      icon: Activity,
      color: "text-purple-500",
      bg: "bg-purple-50 dark:bg-purple-950/20",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="p-4 bg-background border rounded-xl shadow-sm flex items-center gap-4 transition-all hover:shadow-md"
        >
          <div className={`p-3 rounded-lg ${stat.bg}`}>
            <stat.icon className={`w-5 h-5 ${stat.color}`} />
          </div>
          <div>
            <p className="text-sm text-muted-foreground font-medium">
              {stat.label}
            </p>
            <h4 className="text-2xl font-bold tracking-tight">{stat.value}</h4>
          </div>
        </div>
      ))}
    </div>
  );
}
