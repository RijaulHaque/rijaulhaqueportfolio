import { Mail } from 'lucide-react';

const GithubIcon = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.28 1.15-.28 2.35 0 3.5-.73 1.02-1.08 2.25-1 3.5 0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const LinkedinIcon = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const XIcon = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4l11.733 16H20L8.267 4z" />
    <path d="M4 20l6.768-6.768m2.46-2.46L20 4" />
  </svg>
);

const InstagramIcon = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

export default function Footer() {
  const socials = [
    { icon: <GithubIcon size={24} />, href: "https://github.com/RijaulHaque", label: "GitHub" },
    { icon: <LinkedinIcon size={24} />, href: "https://www.linkedin.com/in/rijaul-haque-78b17a22a/", label: "LinkedIn" },
    { icon: <XIcon size={24} />, href: "https://x.com/iamrijaulhaque", label: "X (Twitter)" },
    { icon: <InstagramIcon size={24} />, href: "https://www.instagram.com/realrijaulhaque/", label: "Instagram" }
  ];

  return (
    <footer className="w-full bg-secondary border-t-4 border-primary mt-auto relative z-50" style={{ backgroundColor: 'var(--secondary)' }}>
      <div className="max-w-6xl mx-auto px-6 md:px-16 py-16 flex flex-col items-center space-y-12">

       

        {/* Contact CTA */}
        <div className="flex flex-col items-center space-y-6 text-center w-full">
          <h3 className="text-2xl md:text-3xl font-extrabold tracking-widest uppercase text-primary">Get in touch</h3>
          <a
            href="mailto:project.rijaulhaque@gmail.com"
            className="flex items-center gap-4 px-8 py-4 bg-background border-[3px] border-primary text-primary font-bold shadow-[6px_6px_0px_var(--shadow-color)] hover:-translate-y-1 hover:shadow-[10px_10px_0px_var(--shadow-color)] transition-all active:translate-x-1 active:translate-y-1 active:shadow-none"
          >
            <Mail size={24} strokeWidth={3} />
            <span className="text-lg md:text-2xl lowercase font-bold">project.rijaulhaque@gmail.com</span>
          </a>
        </div>
        {/* Social Links */}
        <div className="flex flex-col items-center space-y-6 w-full">
          <h4 className="text-xl font-bold tracking-widest uppercase text-primary border-b-2 border-primary inline-block pb-1">My Social Handles</h4>
            <div className="flex flex-wrap justify-center gap-6">
              {socials.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  className="p-4 bg-background border-2 border-primary text-primary shadow-[4px_4px_0px_var(--shadow-color)] hover:-translate-y-1 hover:shadow-[8px_8px_0px_var(--shadow-color)] transition-all active:translate-x-1 active:translate-y-1 active:shadow-none"
                  aria-label={social.label}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </div>
        {/* Copyright */}
        <div className="border-t-2 border-primary/20 w-full text-center pt-8">
          <p className="text-xs md:text-sm font-bold text-primary/60 tracking-widest uppercase">
            © {new Date().getFullYear()} Rijaul Haque. All Rights Reserved.
          </p>
        </div>

    </footer>
  );
}
