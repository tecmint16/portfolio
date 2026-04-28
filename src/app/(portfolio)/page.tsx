import { createClient } from "@/utils/supabase/server";
import HeroSection from "@/components/sections/HeroSection";
import ExperienceSection from "@/components/sections/ExperienceSection";
import InternshipSection from "@/components/sections/InternshipSection";
import SkillSection from "@/components/sections/SkillSection";
import ProjectSection from "@/components/sections/ProjectSection";
import ContactSection from "@/components/sections/ContactSection";
import Footer from "@/components/layout/Footer";

export const revalidate = 60; // ISR: revalidate every 60 seconds

export default async function HomePage() {
  const supabase = await createClient();

  // Fetch semua data secara paralel
  const [
    { data: profile },
    { data: projects },
    { data: skills },
    { data: experiences },
    { data: internships },
  ] = await Promise.all([
    supabase.from("profiles").select("*").limit(1).single(),
    supabase.from("projects").select("*").order("order_index", { ascending: true }),
    supabase.from("skills").select("*").order("category").order("order_index"),
    supabase.from("work_experiences").select("*").order("order_index").order("start_date", { ascending: false }),
    supabase.from("internships").select("*").order("order_index").order("start_date", { ascending: false }),
  ]);

  return (
    <>
      <HeroSection profile={profile} />
      <ExperienceSection experiences={experiences ?? []} />
      <InternshipSection internships={internships ?? []} />
      <SkillSection skills={skills ?? []} />
      <ProjectSection projects={projects ?? []} />
      <ContactSection profile={profile} />
      <Footer />
    </>
  );
}
