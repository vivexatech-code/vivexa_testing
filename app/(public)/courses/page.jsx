import CoursesClient from "@/app/courses/CoursesClient";
import { getPublicCourses } from "@/lib/getPublicCourses";

export const metadata = {
  title: "Professional Computer Courses | Vivexa Institute of Technology",
  description: "Explore practical computer, development, design, accounting, and AI courses.",
};

export default async function CoursesPage() {
  const courses = await getPublicCourses();
  return <CoursesClient initialCourses={courses} />;
}
