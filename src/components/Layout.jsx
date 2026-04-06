import Navbar from './Navbar';
import Footer from './Footer';

export default function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col transition-colors duration-300 relative overflow-hidden">

      {/* Global Fixed Vertical Name Overlays - RIGHT: two counter-scrolling lines */}
      <div
        className="fixed -right-10 top-24 bottom-24 z-10 hidden md:flex flex-col-reverse pointer-events-none gap-0 overflow-hidden"
        style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
      >
        <h1
          className="text-[4rem] xl:text-[5rem] leading-none font-bold text-transparent opacity-25 select-none tracking-widest whitespace-nowrap animate-vertical-up"
          style={{ WebkitTextStroke: '2px var(--muted)' }}
        >
          RIJAUL HAQUE RIJAUL HAQUE RIJAUL HAQUE RIJAUL HAQUE
        </h1>
        <h1
          className="text-[4rem] xl:text-[5rem] leading-none font-bold text-transparent opacity-20 select-none tracking-widest whitespace-nowrap animate-vertical-down"
          style={{ WebkitTextStroke: '2px var(--muted)' }}
        >
          RIJAUL HAQUE RIJAUL HAQUE RIJAUL HAQUE RIJAUL HAQUE
        </h1>
      </div>

      {/* Global Fixed Vertical Name Overlays - LEFT: two counter-scrolling lines */}
      <div
        className="fixed -left-10 top-24 bottom-24 z-10 hidden md:flex flex-col pointer-events-none gap-0 overflow-hidden"
        style={{ writingMode: 'vertical-rl' }}
      >
        <h1
          className="text-[4rem] xl:text-[5rem] leading-none font-bold text-transparent opacity-25 select-none tracking-widest whitespace-nowrap animate-vertical-down"
          style={{ WebkitTextStroke: '2px var(--muted)' }}
        >
          RIJAUL HAQUE RIJAUL HAQUE RIJAUL HAQUE RIJAUL HAQUE
        </h1>
        <h1
          className="text-[4rem] xl:text-[5rem] leading-none font-bold text-transparent opacity-20 select-none tracking-widest whitespace-nowrap animate-vertical-up"
          style={{ WebkitTextStroke: '2px var(--muted)' }}
        >
          RIJAUL HAQUE RIJAUL HAQUE RIJAUL HAQUE RIJAUL HAQUE
        </h1>
      </div>

      <Navbar />
      <main className="flex-grow w-full pt-20 relative">
        {children}
      </main>
      {/* Footer has z-50 + opaque bg so it naturally covers the fixed strips */}
      <Footer />
    </div>
  );
}
