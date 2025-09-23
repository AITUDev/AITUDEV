"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Github, Linkedin, Loader2, MapPin, Lightbulb, Users, Award } from 'lucide-react'
import { useTeamMembers } from "@/hooks/useTeamMembers"
import { useProjects } from "@/hooks/useProjects"
import Image from 'next/image'
import { useEffect } from 'react'

export default function AITUDevBrochure() {
  const { teamMembers, loading: teamMembersLoading } = useTeamMembers()
  const { projects, loading: projectsLoading } = useProjects()
  const isLoading = teamMembersLoading || projectsLoading;

  // Scroll reveal animations
  useEffect(() => {
    const elements = document.querySelectorAll<HTMLElement>('[data-reveal]');

    elements.forEach(el => {
      const direction = el.dataset.reveal || "up"; 
      let initClass = ["opacity-0"];

      if (direction === "up") initClass.push("translate-y-12");
      if (direction === "left") initClass.push("-translate-x-12");
      if (direction === "right") initClass.push("translate-x-12");
      if (direction === "scale") initClass.push("scale-75");

      initClass.forEach(c => el.classList.add(c));
      el.classList.add("transition-all","duration-1000","ease-out","will-change-transform");
    });

    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const el = entry.target as HTMLElement;
        if (entry.isIntersecting) {
          el.classList.remove("opacity-0","translate-y-12","-translate-x-12","translate-x-12","scale-75");
          el.classList.add("opacity-100","translate-x-0","translate-y-0","scale-100");
          io.unobserve(el);
        }
      });
    }, { threshold: 0.2 });

    elements.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <div className="bg-black text-white min-h-screen font-sans">

      {/* قصتنا */}
      <section data-reveal="up" className="py-20 mb-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div data-reveal="left" className="text-right">
              <h2 className="text-4xl font-bold mb-6 text-primary">قصتنا: من فكرة إلى واقع</h2>
              <p className="text-gray-300 text-lg mb-6 leading-relaxed">
                تأسس فريق AITU Dev في عام 2025 من قبل مجموعة من طلاب IT المتحمسين الذين أدركوا الحاجة إلى التعاون للتعلم والابتكار. بدأنا كمجموعة صغيرة تشترك في شغف البرمجة، واليوم نحن مجتمع تقني نابض بالحياة يجمع بين الطلاب لتطوير حلول تخدم جامعتنا ومجتمعنا.
              </p>
              <div className="grid grid-cols-2 gap-4 text-sm text-gray-400 mt-8">
                <div className="flex items-center justify-end">
                  <span>تأسس في 2025</span>
                  <Calendar className="w-4 h-4 ml-2 text-primary" />
                </div>
                <div className="flex items-center justify-end">
                  <span>جامعة اسيوط الدولية التكنولوجية  AITU</span>
                  <MapPin className="w-4 h-4 ml-2 text-primary" />
                </div>
              </div>
            </div>
            <div data-reveal="right" className="relative group [perspective:1000px]">
              <div className="relative rounded-2xl shadow-2xl shadow-primary/20 overflow-hidden transform-gpu group-hover:rotate-1 group-hover:scale-[1.02] transition-transform duration-500">
                <Image src="/team.jpg" alt="فريق AITU Dev" width={600} height={400} className="object-cover" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* رؤيتنا */}
      <section data-reveal="up" className="py-20 text-center container mx-auto px-4">
        <h2 className="text-4xl font-bold mb-6 text-primary">رؤيتنا</h2>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
          أن نكون مركزًا للإبداع التقني في جامعتنا، حيث نحول الأفكار الطموحة إلى مشاريع برمجية حقيقية تخدم المجتمع الطلابي وتواكب المستقبل الرقمي.
        </p>
      </section>

      {/* قيمنا */}
      <section data-reveal="up" className="py-20 mb-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-12 text-primary">قيمنا الأساسية</h2>
          <div className="grid md:grid-cols-3 gap-12">
            <div data-reveal="up" className="flex flex-col items-center hover:-translate-y-2 transition-transform duration-500">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                <Lightbulb className="w-10 h-10 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-3">الابتكار</h3>
              <p className="text-gray-400">نبحث دائمًا عن حلول إبداعية وغير تقليدية للتحديات التقنية.</p>
            </div>
            <div data-reveal="up" className="flex flex-col items-center hover:-translate-y-2 transition-transform duration-500">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                <Users className="w-10 h-10 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-3">التعاون</h3>
              <p className="text-gray-400">نؤمن بقوة العمل الجماعي ومشاركة المعرفة لتحقيق أفضل النتائج.</p>
            </div>
            <div data-reveal="up" className="flex flex-col items-center hover:-translate-y-2 transition-transform duration-500">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                <Award className="w-10 h-10 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-3">الجودة</h3>
              <p className="text-gray-400">نلتزم بأعلى معايير الجودة في كل سطر من الكود وكل تصميم ننتجه.</p>
            </div>
          </div>
        </div>
      </section>

      {/* الفريق */}
      <header className="text-center py-20">
        <h1 className="text-6xl font-bold mb-4">العقول المبدعة</h1>
        <p className="text-2xl text-gray-400">تعرف على الفريق الذي يقف وراء AITU Dev</p>
      </header>

      {isLoading ? (
        <div className="flex justify-center items-center h-96">
          <Loader2 className="w-12 h-12 animate-spin text-primary" />
        </div>
      ) : (
        <main className="container mx-auto px-4">
          {teamMembers.map((member, index) => (
            <section key={member._id} className="min-h-screen flex items-center py-12">
              <div className={`flex flex-col md:flex-row items-center gap-12 ${index % 2 !== 0 ? "md:flex-row-reverse" : ""}`}>
                
                {/* الصورة */}
                <div className="md:w-1/2 w-full flex-shrink-0 group" data-reveal={index % 2 === 0 ? "left" : "right"}>
                  <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-primary/20 transform-gpu transition-transform duration-500 group-hover:scale-[1.02] group-hover:rotate-[0.5deg]">
                    <Image
                      src={(typeof member.avatar === "object" ? member.avatar.url : member.avatar) || "/default-avatar.png"}
                      alt={member.name}
                      width={800}
                      height={800}
                      className="object-cover"
                    />
                  </div>
                </div>

                {/* النص */}
                <div className="md:w-1/2 w-full" data-reveal="up">
                  <h2 className="text-5xl font-bold mb-4">{member.name}</h2>
                  <p className="text-2xl text-primary mb-6">{member.role}</p>
                  <p className="text-gray-300 text-lg mb-8 leading-relaxed">
                    {member.bio || "عضو فريق موهوب ومتفاني في AITU Dev، يساهم بشغف في بناء حلول تقنية مبتكرة."}
                  </p>
                  <div className="mb-8">
                    <h3 className="text-xl font-semibold mb-4 text-gray-400">أبرز المهارات</h3>
                    <div className="flex flex-wrap gap-3">
                      {member.skills.map((skill) => (
                        <Badge key={skill} className="bg-gray-800 text-gray-300 border-gray-700 text-md px-4 py-2">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    {member.socialLinks?.github && (
                      <a href={member.socialLinks.github} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary transition-colors">
                        <Github size={28} />
                      </a>
                    )}
                    {member.socialLinks?.linkedin && (
                      <a href={member.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary transition-colors">
                        <Linkedin size={28} />
                      </a>
                    )}
                    <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white bg-transparent">
                      عرض المشاريع
                    </Button>
                  </div>
                </div>
              </div>
            </section>
          ))}
        </main>
      )}

      {/* المشاريع */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 data-reveal="up" className="text-4xl font-bold mb-12 text-primary">مشاريعنا المميزة</h2>
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="w-12 h-12 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-8">
              {projects.slice(0, 3).map((project, index) => (
                <div
                  key={project._id}
                  data-reveal="up"
                  className="bg-gray-900/50 rounded-2xl overflow-hidden group translate-y-20 transition-all duration-700"
                  style={{ transitionDelay: `${index * 200}ms` }} // stagger delay
                >
                  <div className="relative h-64 transform-gpu group-hover:scale-[1.03] transition-transform duration-500">
                    <Image
                      src={(typeof project.image === "object" ? project.image.url : project.image) || "/project-placeholder.png"}
                      alt={project.name}
                      fill
                      className="object-cover transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-3">{project.name}</h3>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {project.technologies.slice(0, 4).map((tech) => (
                        <Badge key={tech} variant="secondary">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <footer className="text-center py-12 text-gray-500">
        <p>&copy; {new Date().getFullYear()} AITU Dev. كل الإبداع يبدأ بفكرة.</p>
      </footer>
    </div>
  );
}
