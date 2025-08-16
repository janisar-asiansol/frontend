
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, LineChart, Line } from "recharts";

const DashboardCharts = () => {
  const [timeFrame, setTimeFrame] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  
  const chartData = {
    daily: [
      { name: 'Mon', roi: 12.5, referral: 2.3, promo: 0 },
      { name: 'Tue', roi: 15.2, referral: 1.8, promo: 5.0 },
      { name: 'Wed', roi: 18.7, referral: 3.2, promo: 0 },
      { name: 'Thu', roi: 14.3, referral: 2.1, promo: 0 },
      { name: 'Fri', roi: 20.1, referral: 4.5, promo: 2.5 },
      { name: 'Sat', roi: 16.8, referral: 1.9, promo: 0 },
      { name: 'Sun', roi: 13.2, referral: 2.8, promo: 0 },
    ],
    weekly: [
      { name: 'Week 1', roi: 95.2, referral: 18.3, promo: 7.5 },
      { name: 'Week 2', roi: 108.7, referral: 22.1, promo: 5.0 },
      { name: 'Week 3', roi: 87.3, referral: 15.8, promo: 12.5 },
      { name: 'Week 4', roi: 124.1, referral: 28.4, promo: 2.5 },
    ],
    monthly: [
      { name: 'Jan', roi: 425.2, referral: 85.3, promo: 25.5 },
      { name: 'Feb', roi: 387.8, referral: 72.1, promo: 35.0 },
      { name: 'Mar', roi: 498.3, referral: 94.8, promo: 42.5 },
      { name: 'Apr', roi: 354.1, referral: 68.4, promo: 12.5 },
    ],
  };

  const chartConfig = {
    roi: {
      label: "Direct ROI",
      color: "hsl(var(--chart-1))",
    },
    referral: {
      label: "Referral Bonus",
      color: "hsl(var(--chart-2))",
    },
    promo: {
      label: "Promotional Bonus",
      color: "hsl(var(--chart-3))",
    },
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Reward Statistics</CardTitle>
          <div className="flex space-x-2">
            {(['daily', 'weekly', 'monthly'] as const).map((period) => (
              <Button
                key={period}
                variant={timeFrame === period ? "default" : "outline"}
                size="sm"
                onClick={() => setTimeFrame(period)}
                className="capitalize"
              >
                {period}
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData[timeFrame]}>
              <XAxis dataKey="name" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar
                dataKey="roi"
                fill="var(--color-roi)"
                name="Direct ROI"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="referral"
                fill="var(--color-referral)"
                name="Referral Bonus"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="promo"
                fill="var(--color-promo)"
                name="Promotional Bonus"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
        
        {/* Legend */}
        <div className="flex justify-center space-x-6 mt-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
            <span className="text-sm text-muted-foreground">Direct ROI</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <span className="text-sm text-muted-foreground">Referral Bonus</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-sm text-muted-foreground">Promotional Bonus</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DashboardCharts;
