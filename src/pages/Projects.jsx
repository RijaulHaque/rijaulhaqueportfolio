import { ExternalLink, FolderGit2 } from 'lucide-react';
import projectsData from '../data/projects.json';

export default function Projects() {
  return (
    <div className="w-full max-w-6xl mx-auto px-6 md:px-16 space-y-12 py-16">
      <div className="max-w-2xl border-b-2 border-primary pb-4">
        <div className="flex items-center gap-4 mb-4">
          <FolderGit2 className="text-primary flex-shrink-0" size={40} />
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-wide md:tracking-widest uppercase text-primary">Projects & Achievements</h1>
        </div>
        <p className="text-xl text-primary/80 font-semibold italic">
          A showcase of my recent academic and personal projects. Building things to solve real problems.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {projectsData.map((project, index) => (
          <div 
            key={project.id}
            className="group relative flex flex-col justify-between p-8 bg-card border-2 border-primary shadow-[6px_6px_0px_var(--shadow-color)] hover:-translate-y-1 hover:shadow-[8px_8px_0px_var(--shadow-color)] transition-all"
          >
            <div className="absolute top-4 right-4 group-hover:scale-110 transition-transform">
              <a href={project.link} className="text-primary hover:text-primary/70">
                <ExternalLink size={24} />
              </a>
            </div>
            <div className="pr-8">
              <h3 className="text-2xl font-bold mb-4 text-primary uppercase">{project.title}</h3>
              <p className="text-primary/80 text-base leading-relaxed mb-6 font-semibold text-justify">
                {project.description}
              </p>
            </div>
            <div className="flex flex-wrap gap-2 mt-auto">
              {project.tech.map(tech => (
                <span key={tech} className="text-sm font-bold px-3 py-1 bg-secondary border border-primary text-primary">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
