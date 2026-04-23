import { BookOpen, Download } from 'lucide-react';
import papersData from '../data/papers.json';

export default function ResearchPapers() {
  return (
    <div className="w-full max-w-6xl mx-auto px-6 md:px-16 space-y-12 py-16">
      
      <div className="max-w-2xl border-b-2 border-primary pb-4">
        <div className="flex items-center space-x-4 mb-4">
          <BookOpen className="text-primary" size={36} />
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-wide md:tracking-widest uppercase text-primary">
            Research Papers
          </h1>
        </div>
        <p className="text-xl text-primary/80 font-semibold italic">
          Exploring the frontiers of deep learning, natural language processing, and decentralized systems.
        </p>
      </div>

      <div className="space-y-8">
        {papersData.map((paper, index) => (
          <div 
            key={paper.id}
            className="group relative p-8 bg-card border-2 border-primary shadow-[6px_6px_0px_var(--shadow-color)] hover:-translate-y-1 hover:shadow-[8px_8px_0px_var(--shadow-color)] transition-all"
          >
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-sm font-bold uppercase tracking-widest text-primary border border-primary px-2 py-0.5">
                    {paper.year}
                  </span>
                  <span className="text-sm font-bold text-primary/70 italic">
                    {paper.conference}
                  </span>
                </div>
                <h3 className="text-2xl font-extrabold mb-4 text-primary group-hover:text-primary/70 transition-colors uppercase">
                  {paper.title}
                </h3>
                <p className="text-primary/80 text-justify font-semibold leading-relaxed mb-6">
                  {paper.abstract}
                </p>
                <div className="flex flex-wrap gap-2">
                  {paper.tags.map(tag => (
                    <span key={tag} className="px-3 py-1 text-xs font-bold bg-secondary text-primary border border-primary">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex-shrink-0 pt-2">
                <a href={paper.pdfUrl} className="inline-flex items-center justify-center px-4 py-2 border-2 border-primary text-primary hover:bg-secondary font-bold transition-colors shadow-[3px_3px_0px_#2f5c53] hover:shadow-[4px_4px_0px_var(--shadow-color)]">
                  <Download size={20} className="mr-2" />
                  <span>PDF</span>
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
