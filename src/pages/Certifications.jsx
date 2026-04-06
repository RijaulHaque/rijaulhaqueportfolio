import { ExternalLink, Award } from 'lucide-react';
import certsData from '../data/certifications.json';

// Explicitly mapping Vite asset imports for the interactive buttons
import c1 from '../assets/Certificate for Mathematical Foundations for Machine Learning.jpg';
import c2 from '../assets/Programming with Generative AI.jpeg';
import c3 from '../assets/Machine Learning.pdf';
import c4 from '../assets/Linear Algebra.pdf';

const certAssets = {
  "cert-1": c1,
  "cert-2": c2,
  "cert-3": c3,
  "cert-4": c4
};

export default function Certifications() {
  return (
    <div className="w-full max-w-6xl mx-auto px-6 md:px-16 py-16 relative z-10">
      
      {/* Header section */}
      <div className="max-w-3xl border-b-2 border-primary pb-4 mb-16">
        <div className="flex items-center gap-4 mb-4">
          <Award className="text-primary flex-shrink-0" size={40} />
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-widest text-primary uppercase">
            Certifications &amp; Achievements
          </h1>
        </div>
        <p className="text-xl text-primary/80 font-semibold italic leading-relaxed">
          A documented track record of my formal accomplishments, external coursework, and professional milestones across Theoretical AI and Computer Science bounds.
        </p>
      </div>

      {/* Grid mapping */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-14">
        {certsData.map((cert) => (
          <div 
            key={cert.id} 
            className="flex flex-col p-8 border-[3px] border-primary bg-card shadow-[8px_8px_0px_var(--shadow-color)] hover:-translate-y-1 hover:shadow-[10px_10px_0px_var(--shadow-color)] transition-all duration-300 relative group"
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-extrabold text-2xl text-primary pr-4 leading-tight">{cert.title}</h3>
              <span className="text-sm shrink-0 text-primary font-bold border-2 border-primary px-3 py-1 bg-secondary">{cert.date}</span>
            </div>
            <p className="text-lg font-semibold text-primary/80 italic mb-8">{cert.issuer}</p>
            
            <div className="mt-auto pt-6 border-t-2 border-primary/20 flex justify-end">
              <a 
                href={certAssets[cert.id]}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 px-6 py-3 font-bold text-primary border-2 border-primary hover:bg-primary hover:text-primary-foreground transition-colors uppercase tracking-widest text-sm"
              >
                <span>View Credential</span>
                <ExternalLink size={16} strokeWidth={3} />
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Achievement Blocks */}
      <div className="mt-24 space-y-8 border-t-2 border-primary/20 pt-16">
        <h2 className="text-3xl font-extrabold uppercase text-primary mb-8 border-l-4 border-primary pl-4">Notable Milestones</h2>
        <ul className="text-primary list-disc ml-8 space-y-4 text-lg leading-relaxed font-semibold">
          <li>Ranked in the <strong>Top 5%</strong> of candidates globally in the NPTEL course "Programming with Generative AI" with a consolidated score of 80%, certified by IISc Bangalore.</li>
          <li>Qualified and participated in the State-level Science-based Extempore Speech (Native Language) Competition mapping scientific fundamentals.</li>
        </ul>
      </div>

    </div>
  );
}
