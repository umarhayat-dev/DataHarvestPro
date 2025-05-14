import { Card, CardContent } from '@/components/ui/card';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: string;
  iconBgColor: string;
  iconColor: string;
}

const FeatureCard = ({ title, description, icon, iconBgColor, iconColor }: FeatureCardProps) => {
  return (
    <Card className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 text-center">
      <CardContent className="p-0">
        <div className={`${iconBgColor} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4`}>
          <span className={`material-icons ${iconColor} text-2xl`}>{icon}</span>
        </div>
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </CardContent>
    </Card>
  );
};

export default FeatureCard;
