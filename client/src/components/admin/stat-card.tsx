import { Card, CardContent } from '@/components/ui/card';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: string;
  iconBgColor: string;
  iconColor: string;
  trend?: {
    value: string;
    isPositive: boolean;
  };
}

const StatCard = ({ title, value, icon, iconBgColor, iconColor, trend }: StatCardProps) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center">
          <div className={`${iconBgColor} p-3 rounded-full`}>
            <span className={`material-icons ${iconColor}`}>{icon}</span>
          </div>
          <div className="ml-4">
            <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
            <p className="text-2xl font-semibold">{value}</p>
          </div>
        </div>
        {trend && (
          <div className={`mt-4 text-sm font-medium flex items-center ${trend.isPositive ? 'text-green-500' : 'text-amber-500'}`}>
            <span className="material-icons text-sm mr-1">
              {trend.isPositive ? 'arrow_upward' : 'pending'}
            </span>
            {trend.value}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StatCard;
