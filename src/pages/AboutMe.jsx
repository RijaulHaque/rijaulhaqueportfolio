import nitImg from '../assets/NIT_internship_1.jpg';
import bcplImg from '../assets/BCPL_internship_1.jpg';
import conf1 from '../assets/NCMNC_conference.jpg';
import conf2 from '../assets/NCMNC_conference_2.jpg';
import conf3 from '../assets/NCMNC_conference_3.jpg';
import desktopImg from '../assets/rij_new_white_bg_full.jpeg';
import experienceData from '../data/experience.json';
import { User } from 'lucide-react';

export default function AboutMe() {
  return (
    <div className="w-full max-w-6xl mx-auto px-6 md:px-16 space-y-16 py-16">

      {/* Bio Header Layout */}
      <section className="flex flex-col lg:flex-row gap-12 border-b-2 border-primary pb-16 pt-4 mb-4">

        <div className="w-full lg:w-2/3 space-y-6">
          <div className="flex items-center gap-4">
            <User className="text-primary flex-shrink-0" size={40} />
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-wide md:tracking-widest text-primary uppercase">About Me</h1>
          </div>
          <div className="space-y-4 text-lg md:text-xl text-primary/80 font-bold text-justify leading-relaxed">
            <p>
              Hi there! I'm <strong>Rijaul Haque</strong>, an undergraduate student at Dibrugarh University, pursuing Computer Science & Engineering.
            </p>
            <p>
              From a young age, I've been deeply fascinated by science and technology — always curious about how things work, whether it's the vastness of space or the intricate design of nano-chips. This curiosity evolved into a passion for innovation and problem-solving, eventually leading me to follow my dream of becoming an engineer.
            </p>
            <p>
              I believe in the power of Technology-Enthusiasm-Innovation to address real-world challenges in meaningful and practical ways. I'm always eager to learn, explore, and collaborate on exciting tech-driven ideas.
            </p>
            <p className="italic font-semibold text-primary">
              Thanks for stopping by my portfolio — feel free to connect or share your thoughts. Let's build something amazing together!
            </p>
          </div>
        </div>

        <div className="lg:w-1/3 flex justify-center items-start pt-6 lg:pt-0">
          <div className="w-full max-w-sm border-[4px] border-primary p-2 bg-secondary shadow-[8px_8px_0px_var(--shadow-color)]">
            <img src={desktopImg} alt="Rijaul Portrait" className="w-full h-auto object-cover grayscale-[20%]" />
          </div>
        </div>
      </section>

      {/* Internships Section */}
      <section className="space-y-8">
        <h2 className="text-4xl font-extrabold tracking-widest text-primary uppercase">Ex-Intern At</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* NIT */}
          <div className="flex flex-col bg-card border-2 border-primary shadow-[6px_6px_0px_var(--shadow-color)]">
            <div className="h-64 border-b-2 border-primary overflow-hidden">
              <img src={nitImg} alt="NIT Meghalaya Internship" className="w-full h-full object-cover object-center grayscale-0 md:grayscale md:hover:grayscale-0 transition-all duration-500" />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-primary mb-2 uppercase">National Institute of Technology Meghalaya</h3>
              <p className="font-semibold text-primary/70 italic text-sm mb-4">(An institute of national importance under the Ministry of Education)</p>
              <div className="flex justify-between font-bold text-primary">
                <span>Meghalaya, India</span>
                <span>June '24 - July '24</span>
              </div>
            </div>
          </div>

          {/* BCPL */}
          <div className="flex flex-col bg-card border-2 border-primary shadow-[6px_6px_0px_var(--shadow-color)]">
            <div className="h-64 border-b-2 border-primary overflow-hidden">
              <img src={bcplImg} alt="BCPL Internship" className="w-full h-full object-cover object-[50%_55%] grayscale-0 md:grayscale md:hover:grayscale-0 transition-all duration-500" />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-primary mb-2 uppercase">Brahmaputra Cracker and Polymer Limited</h3>
              <p className="font-semibold text-primary/70 italic text-sm mb-4">(A Government of India Enterprise under the Ministry of Petroleum and Natural Gas)</p>
              <div className="flex justify-between font-bold text-primary">
                <span>Assam, India</span>
                <span>January 2025</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Experience Section — copied from Home */}
      <section className="space-y-8 border-t-2 border-primary/20 pt-16">
        <h2 className="text-4xl font-extrabold tracking-widest text-primary uppercase">Experience</h2>

        <div className="space-y-8">
          {experienceData.map((exp) => (
            <div key={exp.id} className="relative pl-8 ml-4 border-l-2 border-primary">
              <div className="absolute -left-[7px] top-2 w-3 h-3 rounded-full border-2 border-primary bg-background" />
              <h3 className="text-xl font-bold text-primary">{exp.role}</h3>
              <p className="text-primary/80 font-bold mb-1 italic">{exp.company}</p>
              <div className="flex justify-between text-sm text-primary/60 mb-3 font-semibold">
                <span>{exp.location}</span>
                <span>{exp.duration}</span>
              </div>
              <ul className="text-primary list-disc ml-4 space-y-2 text-sm leading-relaxed font-semibold">
                {exp.points.map((point, i) => <li key={i}>{point}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Education Timeline */}
      <section className="space-y-8 border-t-2 border-primary/20 pt-16">
        <h2 className="text-4xl font-extrabold tracking-widest text-primary uppercase">Education</h2>

        <div className="space-y-0 ml-4">

          {/* Dibrugarh University — copied from Home */}
          <div className="relative pl-8 border-l-2 border-primary pb-10">
            <div className="absolute -left-[7px] top-2 w-3 h-3 rounded-full border-2 border-primary bg-background" />
            <h3 className="text-xl font-bold text-primary uppercase">Dibrugarh University</h3>
            <p className="text-primary/80 font-bold mb-1 italic">B.Tech in Computer Science and Engineering</p>
            <p className="text-sm font-extrabold text-primary px-2 py-1 bg-secondary border border-primary inline-block mb-3">August 2022 - August 2026</p>
            <ul className="text-primary list-disc ml-4 space-y-2 text-sm leading-relaxed font-semibold">
              <li><strong>CGPA:</strong> 8.482/10.0 (After 7th Semester)</li>
              <li><strong>Minor Specialization:</strong> Artificial Intelligence and Machine Learning</li>
              <li><strong>Coursework:</strong> Data Structures & Algorithms, Object-Oriented Programming, Database Management Systems, Computer Networks, Operating Systems, Machine Learning, Deep Learning, Practical Reinforcement Learning, Cryptography & Network Security, Software Engineering.</li>
            </ul>
          </div>

          {/* Higher Secondary */}
          <div className="relative pl-8 border-l-2 border-primary pb-10">
            <div className="absolute -left-[7px] top-2 w-3 h-3 rounded-full border-2 border-primary bg-background" />
            <h3 className="text-xl font-bold text-primary uppercase">Pragmatic Academy Junior College</h3>
            <p className="text-primary/80 font-bold mb-1 italic">Higher Secondary (Science)</p>
            <p className="text-sm font-extrabold text-primary px-2 py-1 bg-secondary border border-primary inline-block mb-3">July 2019 - July 2021</p>
            <ul className="list-disc ml-4 text-primary font-semibold space-y-1 text-sm">
              <li>Physics, Chemistry, Mathematics, Biology</li>
              <li>Aggregate: 86.20%</li>
            </ul>
          </div>

          {/* Matriculation */}
          <div className="relative pl-8 border-l-2 border-primary pb-2">
            <div className="absolute -left-[7px] top-2 w-3 h-3 rounded-full border-2 border-primary bg-background" />
            <h3 className="text-xl font-bold text-primary uppercase">K.B. Deulkuchi H.S. School</h3>
            <p className="text-primary/80 font-bold mb-1 italic">Matriculation</p>
            <p className="text-sm font-extrabold text-primary px-2 py-1 bg-secondary border border-primary inline-block mb-3">January 2014 - June 2019</p>
            <ul className="list-disc ml-4 text-primary font-semibold space-y-1 text-sm">
              <li>Aggregate: 84.17%</li>
            </ul>
          </div>

        </div>
      </section>

      {/* Conference Highlights Gallery */}
      <section className="space-y-8 border-y-2 border-primary/20 py-16">
        <h2 className="text-4xl font-extrabold tracking-widest text-primary uppercase text-center pb-2 mx-auto flex w-max">Conferences & Extracurriculars</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 items-start">

          {/* Conference Photo 1 */}
          <div className="group border-[4px] border-primary bg-card shadow-[6px_6px_0px_var(--shadow-color)] overflow-hidden">
            <img src={conf1} alt="NCMNC Conference 1" className="w-full h-72 object-cover object-center grayscale group-hover:grayscale-0 transition-all duration-500" />
            {/* Text panel slides open below the image */}
            <div className="max-h-0 group-hover:max-h-40 overflow-hidden transition-all duration-400 ease-out">
              <div className="bg-primary p-4">
                <p className="text-xs font-extrabold tracking-widest uppercase text-primary-foreground/70 mb-1">National Conference, 2025</p>
                <h4 className="text-base font-extrabold uppercase text-primary-foreground leading-tight">
                  NCMNC — New Concepts in Modern Networking & Computing
                </h4>
                <p className="text-sm text-primary-foreground/80 font-semibold mt-1">
                  Volunteered at the national-level technical symposium, Dibrugarh University.
                </p>
              </div>
            </div>
          </div>

          {/* Conference Photo 2 */}
          <div className="group border-[4px] border-primary bg-card shadow-[6px_6px_0px_var(--shadow-color)] overflow-hidden">
            <img src={conf2} alt="NCMNC Conference 2" className="w-full h-72 object-cover object-center grayscale group-hover:grayscale-0 transition-all duration-500" />
            {/* Text panel slides open below the image */}
            <div className="max-h-0 group-hover:max-h-40 overflow-hidden transition-all duration-400 ease-out">
              <div className="bg-primary p-4">
                <p className="text-xs font-extrabold tracking-widest uppercase text-primary-foreground/70 mb-1">National Conference, 2025</p>
                <h4 className="text-base font-extrabold uppercase text-primary-foreground leading-tight">
                  NCMNC — New Concepts in Modern Networking & Computing
                </h4>
                <p className="text-sm text-primary-foreground/80 font-semibold mt-1">
                  Attended sessions on emerging AI paradigms and networked computing infrastructure.
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}
