import { Card } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";

interface TrainingChartProps {
  data: Array<{ epoch: number; loss: number; accuracy?: number }>;
  title: string;
}

export const TrainingChart = ({ data, title }: TrainingChartProps) => {
  const chartConfig = {
    loss: {
      label: "Loss",
    },
    accuracy: {
      label: "Accuracy",
    },
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <ChartContainer config={chartConfig} className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis 
              dataKey="epoch" 
              label={{ value: "Epoch", position: "insideBottom", offset: -5 }}
              className="text-xs"
            />
            <YAxis className="text-xs" />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Line 
              type="monotone" 
              dataKey="loss" 
              stroke="hsl(var(--primary))" 
              strokeWidth={2}
              dot={{ fill: "hsl(var(--primary))", r: 4 }}
              activeDot={{ r: 6 }}
            />
            {data[0]?.accuracy !== undefined && (
              <Line 
                type="monotone" 
                dataKey="accuracy" 
                stroke="hsl(var(--success))" 
                strokeWidth={2}
                dot={{ fill: "hsl(var(--success))", r: 4 }}
                activeDot={{ r: 6 }}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </ChartContainer>
    </Card>
  );
};
