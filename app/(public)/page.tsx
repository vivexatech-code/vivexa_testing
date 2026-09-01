import HomeClient from "@/app/HomeClient";
import { getPublicCourses } from "@/lib/getPublicCourses";

export const metadata = {
  title: "Vivexa Institute of Technology | Premium Computer Education",
  description: "Build your future with future-ready digital skills through practical, industry-led training.",
};

export default async function HomePage() {
  const courses = await getPublicCourses();
  return <HomeClient initialCourses={courses} />;
}
