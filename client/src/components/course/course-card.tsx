import { Link } from 'wouter';
import { Course } from '@shared/schema';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface CourseCardProps {
  course: Course;
}

const CourseCard = ({ course }: CourseCardProps) => {
  return (
    <Card className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow">
      <div className="h-48 bg-gray-200 overflow-hidden">
        {course.image ? (
          <img 
            src={course.image} 
            alt={course.title} 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <span className="material-icons text-4xl text-gray-400">menu_book</span>
          </div>
        )}
      </div>
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-semibold">{course.title}</h3>
          {course.featured && (
            <Badge className="bg-accent text-white hover:bg-accent">Featured</Badge>
          )}
        </div>
        <p className="text-gray-700 mb-4">
          {course.description.length > 100 
            ? `${course.description.substring(0, 100)}...` 
            : course.description}
        </p>
        <div className="flex justify-between items-center mb-4">
          <span className="text-gray-500">
            <span className="material-icons text-sm align-middle">schedule</span> {course.duration}
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
            <div className="w-10 h-10 rounded-full bg-gray-200 mr-2 flex items-center justify-center">
              <span className="material-icons text-gray-400">person</span>
            </div>
          )}
          <div>
            <p className="text-sm font-medium">{course.instructorName || "Instructor"}</p>
            <p className="text-xs text-gray-500">{course.instructorTitle || "Teacher"}</p>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <span className="text-accent font-bold mr-1">{course.rating}</span>
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => {
                const rating = parseFloat(course.rating.toString());
                if (star <= Math.floor(rating)) {
                  return <span key={star} className="material-icons text-accent text-sm">star</span>;
                } else if (star === Math.ceil(rating) && !Number.isInteger(rating)) {
                  return <span key={star} className="material-icons text-accent text-sm">star_half</span>;
                } else {
                  return <span key={star} className="material-icons text-gray-300 text-sm">star</span>;
                }
              })}
            </div>
            <span className="text-gray-500 text-xs ml-1">({course.reviewCount})</span>
          </div>
          <Link href={`/courses/${course.id}`}>
            <a className="text-primary text-sm font-medium">View Details →</a>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default CourseCard;
