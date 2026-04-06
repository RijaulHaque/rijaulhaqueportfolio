import { motion } from 'framer-motion';
import skillsData from '../data/skills.json';
import experienceData from '../data/experience.json';
import certsData from '../data/certifications.json';
import desktopImg from '../assets/rij_new_white_bg_full.jpeg';
import sketchImg from '../assets/ai_rij Background Removed.png';
import cvPDF from '../assets/CV_Rijaul_Haque_31March_.pdf';
import { Download, ExternalLink } from 'lucide-react';
import { useState, useEffect } from 'react';
import PointCloudCanvas from '../components/PointCloudCanvas';

const TypingName = () => {
  const englishName = "RIJAUL HAQUE";
  const assameseName = "ৰিজাউল হক";
  
  const [displayText, setDisplayText] = useState("");
  const [isAssamese, setIsAssamese] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [charIndex, setCharIndex] = useState(0);

  useEffect(() => {
    const currentTarget = isAssamese ? assameseName : englishName;
    
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        // Typing
        if (charIndex < currentTarget.length) {
          setDisplayText(currentTarget.substring(0, charIndex + 1));
          setCharIndex(charIndex + 1);
        } else {
          // Pause at the end
          setTimeout(() => setIsDeleting(true), 2500);
        }
      } else {
        // Deleting
        if (charIndex > 0) {
          setDisplayText(currentTarget.substring(0, charIndex - 1));
          setCharIndex(charIndex - 1);
        } else {
          // Switch script and restart typing
          setIsDeleting(false);
          setIsAssamese(!isAssamese);
          setCharIndex(0);
        }
      }
    }, isDeleting ? 75 : 150); // Faster delete, smoother type

    return () => clearTimeout(timeout);
  }, [charIndex, isDeleting, isAssamese]);

  return (
    <div className="min-h-[4rem] md:min-h-[6rem] flex items-center">
      <motion.h1
        key={isAssamese ? 'as' : 'en'}
        initial={{ opacity: 0.8 }}
        animate={{ opacity: 1 }}
        className={`font-extrabold tracking-widest text-primary mt-1 md:mt-2 transition-all duration-300
          ${isAssamese 
            ? 'text-[2rem] md:text-[4rem] font-geetanjali leading-[1.1]' 
            : 'text-4xl md:text-6xl leading-normal'
          }`}
      >
        {displayText}
        <motion.span
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 0.8, repeat: Infinity }}
          className="inline-block w-1 h-8 md:h-12 bg-primary ml-1 align-middle"
        />
      </motion.h1>
    </div>
  );
};

export default function Home() {
  return (
    <div className="w-full flex flex-col relative min-h-screen">
      
      {/* --- HERO SECTION --- (Exact match to Demo.png) */}
      <section className="relative w-full min-h-[calc(100vh-80px)] flex flex-col justify-start px-6 md:px-16 pt-12 overflow-hidden mb-20 bg-background z-20">

        {/* Enormous Background Sketch — LiDAR Point Cloud */}
        <div className="absolute bottom-0 right-[-5%] md:right-0 w-[80%] md:w-[60%] lg:w-[50%] max-w-5xl z-0 pointer-events-none">
          <PointCloudCanvas src={sketchImg} />
        </div>

        {/* Content Wrapper (Left Aligned) */}
        <div className="relative z-10 flex flex-col max-w-2xl mt-8 md:mt-0">
          
          {/* Profile Photo Custom Box */}
          <div className="w-48 h-64 md:w-[280px] md:h-[340px] border-[5px] border-primary p-1 bg-card mb-6">
            <img 
              src={desktopImg} 
              alt="Rijaul Haque Profile" 
              className="w-full h-full object-cover object-center grayscale-[20%]"
            />
          </div>

          {/* Typography Strings */}
          <div className="mb-4">
            <h2 className="text-3xl md:text-5xl italic font-semibold text-primary">Hii, I'm</h2>
            <TypingName />
          </div>

          <div className="w-full md:w-[90%] lg:w-[110%]">
            <p className="text-lg md:text-xl text-primary font-bold text-justify leading-relaxed">
              I am a B.Tech candidate in <em>Computer Science and Engineering</em> at <em>Dibrugarh University</em>, with a Minor in <em>Artificial Intelligence and Machine Learning</em>. My primary interests lie in the mathematical and theoretical foundations of AI—particularly across machine learning, deep learning, and reinforcement learning. Driven by a curiosity to understand and optimize the mechanics behind these models, I am actively seeking hands-on research environments where I can collaborate with scholars, explore emerging paradigms, and contribute to meaningful advancements in theoretical AI.
            </p>
          </div>

        </div>
      </section>

      {/* --- SCROLLABLE CONTENT BELOW HERO --- */}
      <div className="w-full max-w-6xl mx-auto px-6 md:px-16 space-y-20 pb-40 relative z-10">
        
        {/* Education & Experience Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 pt-16 border-t-2 border-primary/20">
          {/* Education Section */}
          <section className="space-y-6">
            <h2 className="text-3xl font-bold tracking-widest uppercase border-b-2 border-primary inline-block pb-2 mb-4">Education</h2>
            
            <div className="relative pl-6 border-l-2 border-primary">
              <div className="absolute -left-[7px] top-2 w-3 h-3 rounded-full border-2 border-primary bg-background" />
              <h3 className="text-xl font-bold text-primary">Dibrugarh University</h3>
              <p className="text-primary/80 font-bold mb-1 italic">B.Tech in Computer Science and Engineering</p>
              <p className="text-sm text-primary/60 mb-3 font-semibold">Aug '22 – Aug '26</p>
              <ul className="text-primary list-disc ml-4 space-y-2 text-sm leading-relaxed font-semibold">
                <li><strong>CGPA:</strong> 8.482/10.0 (After 7th Semester)</li>
                <li><strong>Minor Specialization:</strong> Artificial Intelligence and Machine Learning</li>
                <li><strong>Coursework:</strong> Data Structures & Algorithms, Object-Oriented Programming, Database Management Systems, Computer Networks, Operating Systems, Machine Learning, Deep Learning, Practical Reinforcement Learning, Cryptography & Network Security, Software Engineering.</li>
              </ul>
            </div>
          </section>

          {/* Research Interests Section - From CV */}
          <section className="space-y-6">
            <h2 className="text-3xl font-bold tracking-widest uppercase border-b-2 border-primary inline-block pb-2 mb-4">Research Interests</h2>
            
            <div className="space-y-6">
              <div className="p-5 border-2 border-primary bg-card shadow-[4px_4px_0px_var(--shadow-color)] hover:-translate-y-1 hover:shadow-[8px_8px_0px_var(--shadow-color)] transition-all">
                <h3 className="font-bold text-lg text-primary mb-2 uppercase tracking-wide">Theoretical Machine & Deep Learning</h3>
                <p className="text-sm font-semibold text-primary/80 leading-relaxed">
                  Exploring foundational mechanics, mathematical optimization, and architectural design of ML/DL models to build robust, generalizable AI systems.
                </p>
              </div>
              <div className="p-5 border-2 border-primary bg-card shadow-[4px_4px_0px_var(--shadow-color)] hover:-translate-y-1 hover:shadow-[8px_8px_0px_var(--shadow-color)] transition-all">
                <h3 className="font-bold text-lg text-primary mb-2 uppercase tracking-wide">Reinforcement Learning & Decision Systems</h3>
                <p className="text-sm font-semibold text-primary/80 leading-relaxed">
                  Investigating exploration-exploitation dynamics, specifically Contextual Multi-Armed Bandits, to advance scalable sequential decision-making.
                </p>
              </div>
              <div className="p-5 border-2 border-primary bg-card shadow-[4px_4px_0px_var(--shadow-color)] hover:-translate-y-1 hover:shadow-[8px_8px_0px_var(--shadow-color)] transition-all">
                <h3 className="font-bold text-lg text-primary mb-2 uppercase tracking-wide">Multimodal AI & Sensor Fusion</h3>
                <p className="text-sm font-semibold text-primary/80 leading-relaxed">
                  Researching architectures capable of integrating 3D spatial data, vision, and text to enhance holistic scene understanding.
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* Skills Section */}
        <section className="space-y-8 pt-16 border-t-2 border-primary/20">
          <h2 className="text-3xl font-bold tracking-widest uppercase border-b-2 border-primary inline-block pb-2">My Skill-sets</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {Object.entries({
              "Programming Languages": skillsData.languages,
              "Frameworks & Libraries": skillsData.frameworks,
              "Tools & Technologies": skillsData.tools,
              "Web / Frontend": skillsData.web,
              "Soft Skills": skillsData.soft
            }).map(([category, items], idx) => (
              <div key={category} className="p-6 border-2 border-primary bg-secondary relative shadow-[4px_4px_0px_var(--shadow-color)] hover:-translate-y-1 hover:shadow-[8px_8px_0px_var(--shadow-color)] transition-all">
                <h3 className="text-xl font-bold mb-4 text-primary uppercase tracking-wider">{category}</h3>
                <div className="flex flex-wrap gap-2">
                  {items.map(skill => (
                    <span 
                      key={skill} 
                      className="px-3 py-1 text-sm font-bold border border-primary text-primary bg-background"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Curriculum Vitae Section */}
        <section className="space-y-8 pt-16 border-t-2 border-primary/20">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-widest uppercase border-b-2 border-primary inline-block pb-2">Curriculum Vitae</h2>
              <p className="text-primary/70 font-semibold italic">My latest academic and professional trajectory in detail.</p>
            </div>
            
            <div className="flex gap-4">
              <a 
                href={cvPDF} 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center gap-2 px-6 py-4 font-extrabold text-primary border-[3px] border-primary bg-background hover:bg-secondary hover:-translate-y-1 hover:shadow-[8px_8px_0px_var(--shadow-color)] transition-all shadow-[6px_6px_0px_var(--shadow-color)] active:translate-x-1 active:translate-y-1 active:shadow-none uppercase tracking-widest text-sm"
              >
                <ExternalLink size={20} strokeWidth={3} />
                <span>Full View</span>
              </a>
              <a 
                href={cvPDF} 
                download="Rijaul_Haque_CV.pdf"
                className="flex items-center gap-2 px-6 py-4 font-extrabold text-primary border-[3px] border-primary bg-background hover:bg-secondary hover:-translate-y-1 hover:shadow-[8px_8px_0px_var(--shadow-color)] transition-all shadow-[6px_6px_0px_var(--shadow-color)] active:translate-x-1 active:translate-y-1 active:shadow-none uppercase tracking-widest text-sm"
              >
                <Download size={20} strokeWidth={3} />
                <span>Download CV</span>
              </a>
            </div>
          </div>

          {/* CV Preview Iframe */}
          <div className="w-full h-[700px] border-4 border-primary shadow-[8px_8px_0px_var(--shadow-color)] bg-card overflow-hidden relative">
            <iframe 
              src={`${cvPDF}#toolbar=1`} 
              className="w-full h-full border-none"
              title="Rijaul Haque CV Preview"
            />
          </div>
        </section>

      </div>
    </div>
  );
}
