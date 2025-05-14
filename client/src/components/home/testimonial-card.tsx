import { Testimonial } from '@shared/schema';
import { Card, CardContent } from '@/components/ui/card';

interface TestimonialCardProps {
  testimonial: Testimonial;
}

const TestimonialCard = ({ testimonial }: TestimonialCardProps) => {
  return (
    <Card className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
      <CardContent className="p-0">
        <div className="flex text-accent mb-4">
          {[...Array(testimonial.rating)].map((_, idx) => (
            <span key={idx} className="material-icons">star</span>
          ))}
          {[...Array(5 - testimonial.rating)].map((_, idx) => (
            <span key={idx + testimonial.rating} className="material-icons text-gray-300">star</span>
          ))}
        </div>
        <p className="text-gray-700 mb-6 italic">"{testimonial.content}"</p>
        <div className="flex items-center">
          {testimonial.imageUrl ? (
            <img 
              src={testimonial.imageUrl} 
              alt={testimonial.name} 
              className="w-10 h-10 rounded-full mr-3"
            />
          ) : (
            <div className="w-10 h-10 bg-gray-200 rounded-full mr-3 flex items-center justify-center">
              <span className="material-icons text-gray-400">person</span>
            </div>
          )}
          <div>
            <h4 className="font-semibold">{testimonial.name}</h4>
            <p className="text-gray-500 text-sm">{testimonial.role}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TestimonialCard;
