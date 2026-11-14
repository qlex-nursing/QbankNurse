import Navbar from "@/components/marketing/navbar";
import Hero from "@/components/marketing/hero";
import ExamCategories from "@/components/marketing/exam-categories";
import StudyBenefits from "@/components/marketing/study-benefits";
import LearningApproach from "@/components/marketing/learning-approach";
import ExamLibrary from "@/components/marketing/exam-library";
import StudentLearningBenefits from "@/components/marketing/student-learning-benefits";
import StudentSuccess from "@/components/marketing/student-success";
import StudentStories from "@/components/marketing/student-stories";
import FAQ from "@/components/marketing/faq";
import Footer from "@/components/marketing/footer";


export default function HomePage() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <ExamCategories />
      <StudyBenefits />
      <LearningApproach />
      <ExamLibrary />
        <StudentLearningBenefits />
        <StudentSuccess />
        <StudentStories />
        <FAQ />
        <Footer />
    </main>
  );
}