import { Link } from 'wouter';
import { Course } from '@shared/schema';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Book, Star, User, StarHalf } from 'lucide-react';

interface CourseCardProps {
  course: Course;
}

const CourseCard = ({ course }: CourseCardProps) => {
  return (
    <Card className="bg-card rounded-lg shadow-md overflow-hidden border border-border hover:shadow-lg transition-shadow">
      <div className="h-48 bg-muted overflow-hidden">
        {course.image ? (
          <img 
            src={course.image} 
            alt={course.title} 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-muted">
            <Book className="h-12 w-12 text-muted-foreground" />
          </div>
        )}
      </div>
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-semibold">{course.title}</h3>
          {course.featured && (
            <Badge className="bg-accent text-accent-foreground">Featured</Badge>
          )}
        </div>
        <p className="text-muted-foreground mb-4">
          {course.description.length > 100 
            ? `${course.description.substring(0, 100)}...` 
            : course.description}
        </p>
        <div className="flex justify-between items-center mb-4">
          <span className="text-muted-foreground flex items-center">
            <Clock className="h-4 w-4 mr-1" /> {course.duration}
          </span>
          <span className="font-bold text-primary">${parseFloat(course.price.toString()).toFixed(2)}</span>
        </div>
        <div className="flex items-center mb-4">
          {course.instructorImage ? (
            <img 
              src={course.instructorImage} 
              alt={course.instructorName || "Instructor"} 
              className="w-10 h-10 rounded-full mr-2"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-muted mr-2 flex items-center justify-center">
              <User className="h-5 w-5 text-muted-foreground" />
            </div>
          )}
          <div>
            <p className="text-sm font-medium">{course.instructorName || "Instructor"}</p>
            <p className="text-xs text-muted-foreground">{course.instructorTitle || "Teacher"}</p>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            {course.rating && (
              <>
                <span className="text-accent font-bold mr-1">{course.rating}</span>
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => {
                    const rating = parseFloat(course.rating?.toString() || "0");
                    if (star <= Math.floor(rating)) {
                      return <Star key={star} className="h-4 w-4 text-accent fill-accent" />;
                    } else if (star === Math.ceil(rating) && !Number.isInteger(rating)) {
                      return <StarHalf key={star} className="h-4 w-4 text-accent fill-accent" />;
                    } else {
                      return <Star key={star} className="h-4 w-4 text-muted" />;
                    }
                  })}
                </div>
                <span className="text-muted-foreground text-xs ml-1">({course.reviewCount || 0})</span>
              </>
            )}
          </div>
          <Link href={`/courses/${course.id}`} className="text-primary text-sm font-medium">
            View Details →
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default CourseCard;
