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

            if (direction === "up") initClass.push("translate-y-16");
            if (direction === "left") initClass.push("-translate-x-full", "md:-translate-x-32");
            if (direction === "right") initClass.push("translate-x-full", "md:translate-x-32");
            if (direction === "scale") initClass.push("scale-75");

            initClass.forEach(c => el.classList.add(c));
            el.classList.add("transition-all", "duration-1000", "ease-out", "will-change-transform");
        });

        const io = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const el = entry.target as HTMLElement;
                if (entry.isIntersecting) {
                    el.classList.remove("opacity-0", "translate-y-16", "-translate-x-full", "md:-translate-x-32", "translate-x-full", "md:translate-x-32", "scale-75");
                    el.classList.add("opacity-100", "translate-x-0", "translate-y-0", "scale-100");
                    io.unobserve(el);
                }
            });
        }, { threshold: 0.3 });

        elements.forEach(el => io.observe(el));
        return () => io.disconnect();
    }, []);

    return (
        <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-100 min-h-[calc(100vh-1px)] font-sans leading-normal [text-rendering:optimizeLegibility] overflow-x-hidden">

            {/* قصتنا */}
            <section data-reveal="up" className="py-20 mb-20">
                <div className="container mx-auto px-6 lg:px-12">
                    <div className="grid md:grid-cols-2 gap-16 items-center">

                        {/* النص */}
                        <div data-reveal="left" className="text-right space-y-6 [text-wrap:pretty]">
                            <h2 className="text-4xl md:text-5xl font-extrabold leading-tight bg-gradient-to-r from-blue-500 via-cyan-400 to-teal-300 bg-clip-text text-transparent py-1">
                                قصتنا: من فكرة إلى واقع
                            </h2>
                            <div className="text-gray-300 text-lg space-y-4 [&>span]:block [&>span]:leading-[2.2] [&>span]:text-justify [&>span]:py-1 [&>span]:overflow-visible">
                                <p className="text-gray-300 text-lg leading-relaxed">
                                    عام 2025 ، <span className="font-semibold text-cyan-300">AITU Dev</span>   تأسس فريق
                                    <br></br>
                                    على يد مجموعة من طلاب <span className="text-blue-400 font-medium">تكنولوجيا المعلومات</span>،
                                    الذين جمعهم شغف مشترك بالتعلم والابتكار.
                                </p>



                                <span className="block">
                                    بدأنا كـ <span className="text-cyan-200 font-medium">مجموعة صغيرة</span> تتبادل الأفكار وتتعلم معًا،
                                    نؤمن أن العمل الجماعي هو الطريق الأسرع للنمو واكتساب الخبرة.
                                </span>

                                <span className="block">
                                    واليوم أصبحنا <span className="text-teal-300 font-semibold">مجتمعًا تقنيًا نابضًا بالحياة </span>
                                    يجمع الطلاب المبدعين لتطوير حلول رقمية تخدم
                                    <span className="text-blue-300"> جامعتنا </span> ومجتمعنا الأوسع.
                                </span>
                            </div>


                            {/* التفاصيل */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8 text-sm">
                                <div className="flex items-center justify-end gap-2 bg-gray-800/50 px-4 py-2 rounded-lg">
                                    <span className="text-gray-300 whitespace-nowrap">تأسس في 2025</span>
                                    <Calendar className="w-4 h-4 text-primary" />
                                </div>
                                <div className="flex items-center justify-end gap-2 bg-gray-800/50 px-4 py-2 rounded-lg">
                                    <span className="text-gray-300 whitespace-nowrap">جامعة أسيوط الدولية التكنولوجية AITU</span>
                                    <MapPin className="w-4 h-4 text-primary" />
                                </div>
                            </div>
                        </div>

                        {/* الصورة */}
                        <div data-reveal="right" className="relative group [perspective:1000px]">
                            <div className="relative rounded-2xl overflow-hidden transform-gpu group-hover:rotate-1 group-hover:scale-[1.03] transition-all duration-700 border border-gray-700/70 shadow-xl hover:border-blue-400">
                                <Image
                                    src="/team.jpg"
                                    alt="فريق AITU Dev"
                                    width={600}
                                    height={400}
                                    className="object-cover w-full h-full group-hover:brightness-110 transition duration-500"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>


            {/* رؤيتنا */}
            <section data-reveal="up" className=" text-center container mx-auto px-4">
                <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">رؤيتنا</h2>
                <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                    أن نكون مركزًا للإبداع التقني في جامعتنا، حيث نحول الأفكار الطموحة إلى مشاريع برمجية حقيقية تخدم المجتمع الطلابي وتواكب المستقبل الرقمي.
                </p>
            </section>

            {/* قيمنا */}
            <section data-reveal="up" className="py-20 mb-20">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-4xl md:text-5xl font-bold mb-12 bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">قيمنا الأساسية</h2>
                    <div className="grid md:grid-cols-3 gap-12">
                        <div data-reveal="up" className="flex flex-col items-center hover:-translate-y-2 transition-transform duration-500">
                            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center mb-6 shadow-lg shadow-blue-500/20">
                                <Lightbulb className="w-10 h-10 text-gray-50" />
                            </div>
                            <h3 className="text-2xl font-bold mb-3 text-white">الابتكار</h3>
                            <p className="text-gray-300">نبحث دائمًا عن حلول إبداعية وغير تقليدية للتحديات التقنية.</p>
                        </div>
                        <div data-reveal="up" className="flex flex-col items-center hover:-translate-y-2 transition-transform duration-500">
                            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center mb-6 shadow-lg shadow-blue-500/20">
                                <Users className="w-10 h-10 text-gray-50" />
                            </div>
                            <h3 className="text-2xl font-bold mb-3 text-white">التعاون</h3>
                            <p className="text-gray-300">نؤمن بقوة العمل الجماعي ومشاركة المعرفة لتحقيق أفضل النتائج.</p>
                        </div>
                        <div data-reveal="up" className="flex flex-col items-center hover:-translate-y-2 transition-transform duration-500">
                            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center mb-6 shadow-lg shadow-blue-500/20">
                                <Award className="w-10 h-10 text-gray-50" />
                            </div>
                            <h3 className="text-2xl font-bold mb-3 text-white">الجودة</h3>
                            <p className="text-gray-300">نلتزم بأعلى معايير الجودة في كل سطر من الكود وكل تصميم ننتجه.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* الفريق */}
            <header className="text-center py-20">
                <h1 className="text-5xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">العقول المبدعة</h1>
                <p className="text-2xl text-gray-300"> AITU Dev - تعرف على الفريق الذي يقف وراء </p>
            </header>

            {isLoading ? (
                <div className="flex justify-center items-center h-96">
                    <Loader2 className="w-12 h-12 animate-spin text-secondary" />
                </div>
            ) : (
                <main className="container mx-auto px-4">
                    {teamMembers.map((member, index) => (
                        <section key={member._id} className="min-h-screen flex items-center py-12">
                            <div className={`flex flex-col md:flex-row items-center gap-12 ${index % 2 !== 0 ? "md:flex-row-reverse" : ""}`}>

                                {/* الصورة */}
                                <div className="md:w-1/2 w-full flex-shrink-0 group" data-reveal={index % 2 === 0 ? "left" : "right"}>
                                    <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-secondary/20 transform-gpu transition-transform duration-500 group-hover:scale-[1.02] group-hover:rotate-[0.5deg]">
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
                                <div className="md:w-1/2 w-full" data-reveal={index % 2 === 0 ? "right" : "left"}>
                                    <h2 className="text-5xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">{member.name}</h2>
                                    <p className="text-2xl text-blue-300 mb-6">{member.role}</p>
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
                    <h2 data-reveal="up" className="text-5xl font-bold mb-12 bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">مشاريعنا المميزة</h2>
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
                                    className="bg-gray-800/50 backdrop-blur-sm rounded-2xl overflow-hidden group translate-y-20 transition-all duration-700 border border-gray-700 hover:border-blue-400 hover:shadow-lg hover:shadow-blue-500/20"
                                    style={{ transitionDelay: `${index * 200}ms` }} // stagger delay
                                >
                                    <div className="relative h-64 transform-gpu group-hover:scale-[1.03] transition-transform duration-500 border-b border-gray-700">
                                        <Image
                                            src={(typeof project.image === "object" ? project.image.url : project.image) || "/project-placeholder.png"}
                                            alt={project.name}
                                            fill
                                            className="object-cover transition-transform duration-500"
                                        />
                                    </div>
                                    <div className="p-6">
                                        <h3 className="text-xl font-bold mb-3 text-white">{project.name}</h3>
                                        <div className="flex flex-wrap gap-2 justify-center">
                                            {project.technologies.slice(0, 4).map((tech) => (
                                                <Badge key={tech} variant="secondary" className="bg-gray-700/50 text-gray-200 border border-gray-600 hover:bg-gray-600/50 hover:border-blue-400 transition-colors">
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

            <footer className="text-center py-12 text-gray-400">
                <p>&copy; {new Date().getFullYear()} AITU Dev. كل الإبداع يبدأ بفكرة.</p>
            </footer>
        </div>
    );
}
