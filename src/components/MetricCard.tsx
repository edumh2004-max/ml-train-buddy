import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: "up" | "down" | "neutral";
  icon?: React.ReactNode;
  variant?: "default" | "success" | "warning" | "primary";
}

export const MetricCard = ({ 
  title, 
  value, 
  subtitle, 
  trend, 
  icon,
  variant = "default" 
}: MetricCardProps) => {
  return (
    <Card 
      className={cn(
        "p-6 transition-all duration-300 hover:shadow-lg",
        variant === "primary" && "bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20",
        variant === "success" && "bg-gradient-to-br from-success/10 to-success/5 border-success/20",
        variant === "warning" && "bg-gradient-to-br from-warning/10 to-warning/5 border-warning/20"
      )}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-2 flex-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className={cn(
            "text-3xl font-bold tracking-tight",
            variant === "primary" && "bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent",
            variant === "success" && "text-success",
            variant === "warning" && "text-warning"
          )}>
            {value}
          </p>
          {subtitle && (
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              {trend && (
                <span className={cn(
                  trend === "up" && "text-success",
                  trend === "down" && "text-destructive"
                )}>
                  {trend === "up" ? "↑" : trend === "down" ? "↓" : "→"}
                </span>
              )}
              {subtitle}
            </p>
          )}
        </div>
        {icon && (
          <div className={cn(
            "p-3 rounded-lg",
            variant === "primary" && "bg-primary/10",
            variant === "success" && "bg-success/10",
            variant === "warning" && "bg-warning/10",
            variant === "default" && "bg-muted"
          )}>
            {icon}
          </div>
        )}
      </div>
    </Card>
  );
};
