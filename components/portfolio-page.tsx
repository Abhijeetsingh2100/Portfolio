"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
} from "framer-motion";
import {
  ArrowUpRight,
  ChevronDown,
  Download,
  Github,
  Linkedin,
  Mail,
  Moon,
  Sparkles,
  SunMedium,
  BadgeCheck,
} from "lucide-react";
import {
  useEffect,
  useMemo,
  useState,
  useRef,
  type ReactNode,
} from "react";
import { MagneticButton } from "./magnetic-button";

const HeroScene = dynamic(() => import("./hero-scene"), {
  ssr: false,
  loading: () => <HeroFallback />,
});

const Comic3DView = dynamic(() => import("./comic-3d-view"), {
  ssr: false,
});

const skills = [
  "React Native",
  "Expo",
  "NativeWind",
  "Clerk Authentication",
  "Kotlin",
  "Firebase",
  "API Integration",
  "Responsive UI Design",
  "Git/GitHub Workflow",
];

const projects = [
  {
    id: "spendlock",
    name: "SpendLock",
    category: "Flagship Product",
    description:
      "A modern subscription management experience that helps users track recurring expenses, stay in control of renewal dates, and understand their spending patterns with a polished mobile-first flow.",
    tech: ["React Native", "Expo", "NativeWind", "Clerk"],
    details:
      "Designed as a premium case-study style product with a cinematic onboarding experience, modular dashboard cards, and interactive bill-tracking flows that feel ready for production.",
    github: "https://github.com/Abhijeetsingh2100/SpendLock",
    live: "https://expo.dev/accounts/abhijeetsingh200/projects/SpendLock/builds/5441157e-deee-4a80-ab81-76adb6313f42",
    featured: true,
  },
  {
    id: "weather",
    name: "Weather App",
    category: "Native Android",
    description:
      "Built in Kotlin with Weather API integration to gain practical experience handling external data, forecasting interfaces, and native app performance tuning.",
    tech: ["Kotlin", "Weather API"],
    details:
      "A focused native build emphasizing clean card layouts, temperature breakdowns, and resilient async data handling.",
    github: "https://github.com/Abhijeetsingh2100/Weather_app",
    live: "https://github.com/Abhijeetsingh2100/Weather_app",
    featured: false,
  },
  {
    id: "news",
    name: "News App",
    category: "Live Content",
    description:
      "A dynamic news application using REST-based News API data to deliver fast, readable headlines and category-driven browsing with a minimal UI.",
    tech: ["Kotlin", "REST API"],
    details:
      "Built to practice real-time content rendering, article cards, and a crisp editorial interface on mobile.",
    github: "https://github.com/Abhijeetsingh2100",
    live: "#contact",
    featured: false,
  },
];

const timeline = [
  {
    year: "2024",
    title: "Web development internship",
    text: "Built practical frontend experience through an internship, strengthening real-world product thinking and implementation discipline.",
  },
  {
    year: "2025",
    title: "Moved into Android with Kotlin",
    text: "Shifted toward native Android development and deepened my understanding of app architecture, performance, and platform-specific UI.",
  },
  {
    year: "2026",
    title: "Chose React Native",
    text: "Focused on cross-platform development with React Native to build polished mobile experiences faster while keeping production quality high.",
  },
  {
    year: "Now",
    title: "4th-year engineering student shipping real apps",
    text: "Continuing to grow full-stack depth while building recruiter-ready mobile experiences with premium presentation.",
  },
];

// Interactive 3D Card Tilt Component
function TiltCard({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { stiffness: 180, damping: 20, mass: 0.5 };
  const mouseX = useSpring(x, springConfig);
  const mouseY = useSpring(y, springConfig);

  const rotateX = useTransform(mouseY, [-0.5, 0.5], [8, -8]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], [-8, 8]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseXVal = e.clientX - rect.left - width / 2;
    const mouseYVal = e.clientY - rect.top - height / 2;
    x.set(mouseXVal / width);
    y.set(mouseYVal / height);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      className={`relative transition-all duration-300 ${className}`}
    >
      <div style={{ transform: "translateZ(12px)", transformStyle: "preserve-3d" }}>
        {children}
      </div>
    </motion.div>
  );
}

export default function PortfolioPage() {
  const reducedMotion = useReducedMotion() ?? false;
  const { scrollYProgress } = useScroll();
  const heroLift = useTransform(scrollYProgress, [0, 0.22], [0, 32]);
  const heroFade = useTransform(scrollYProgress, [0, 0.14], [1, 0.94]);
  const panelTilt = useTransform(scrollYProgress, [0, 0.2], [0, 6]);
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [expandedProject, setExpandedProject] = useState("spendlock");
  const [cursor, setCursor] = useState({ x: 0, y: 0, visible: false });
  const [mounted, setMounted] = useState(false);
  const [contactState, setContactState] = useState<{
    success: string | null;
  }>({ success: null });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const storedTheme = window.localStorage.getItem("portfolio-theme");
    const nextTheme =
      storedTheme === "light" || storedTheme === "dark" ? storedTheme : "dark";
    setTheme(nextTheme);
    document.documentElement.dataset.theme = nextTheme;
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem("portfolio-theme", theme);
  }, [theme]);

  useEffect(() => {
    if (reducedMotion) return;
    const finePointer = window.matchMedia("(pointer:fine)").matches;
    if (!finePointer) return;

    const onMove = (event: MouseEvent) => {
      setCursor({ x: event.clientX, y: event.clientY, visible: true });
    };
    const onLeave = () => setCursor((value) => ({ ...value, visible: false }));
    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseleave", onLeave);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave);
    };
  }, [reducedMotion]);

  const activeProject = useMemo(
    () => projects.find((project) => project.id === expandedProject) ?? projects[0],
    [expandedProject],
  );

  return (
    <div className="relative overflow-hidden bg-halftone">
      <motion.div
        style={{ scaleX: scrollYProgress }}
        className="pointer-events-none fixed left-0 top-0 z-[60] h-[5px] w-full origin-left bg-gradient-to-r from-cyan-400 via-amber-400 to-rose-400 border-b-2 border-slate-900 dark:border-slate-950"
      />
      
      {/* Decorative gradient overlay */}
      <AnimatePresence mode="wait">
        <motion.div
          key={theme}
          initial={false}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
        >
          <div
            className={`absolute -left-24 top-20 h-[34rem] w-[34rem] rounded-full blur-3xl ${
              theme === "dark" ? "bg-cyan-400/12" : "bg-cyan-300/18"
            }`}
          />
          <div
            className={`absolute -right-20 top-52 h-[28rem] w-[28rem] rounded-full blur-3xl ${
              theme === "dark" ? "bg-amber-400/10" : "bg-amber-300/15"
            }`}
          />
        </motion.div>
      </AnimatePresence>

      <div className="pointer-events-none fixed inset-0 grid-noise opacity-30" />
      <div className="pointer-events-none fixed inset-0 noise-overlay opacity-30" />
      <div className="pointer-events-none fixed inset-0 bg-radial-fade" />
      <FloatingParticles cursor={cursor} reducedMotion={reducedMotion} />

      {!reducedMotion && cursor.visible ? (
        <motion.div
          animate={{ x: cursor.x - 14, y: cursor.y - 14, opacity: 1 }}
          transition={{ type: "spring", stiffness: 280, damping: 28, mass: 0.4 }}
          className="pointer-events-none fixed left-0 top-0 z-50 hidden h-7 w-7 rounded-lg border-2 border-slate-900 dark:border-cyan-300 bg-cyan-300/20 shadow-[3px_3px_0px_0px_#000] dark:shadow-[3px_3px_0px_0px_#22d3ee] md:block"
        />
      ) : null}

      <header className="sticky top-0 z-40 border-b-[3px] border-slate-900 dark:border-slate-950 bg-[rgb(var(--bg)/0.8)] backdrop-blur-xl transition-colors duration-200">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link href="#hero" className="group flex items-center gap-3">
            <span className="relative flex h-10 w-10 items-center justify-center rounded-xl border-[3px] border-slate-900 dark:border-slate-950 bg-[rgb(var(--accent))] text-sm font-black text-slate-900 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] dark:shadow-[3px_3px_0px_0px_rgb(var(--card-shadow-color))] transform -rotate-3 transition group-hover:rotate-0">
              AS
            </span>
            <div>
              <p className="text-sm font-black tracking-wider text-[rgb(var(--text))]">
                ABHIJEET SINGH
              </p>
              <p className="text-[10px] uppercase font-bold tracking-widest text-[rgb(var(--muted))]">
                Full Stack Mobile Developer
              </p>
            </div>
          </Link>

          <nav className="hidden items-center gap-6 text-sm font-bold text-[rgb(var(--text))/0.8] md:flex">
            {[
              ["About", "#about"],
              ["Skills", "#skills"],
              ["Projects", "#projects"],
              ["Knowledge", "#knowledge"],
              ["Resume", "#resume"],
              ["Contact", "#contact"],
            ].map(([label, href]) => (
              <Link key={href} href={href} className="transition-colors hover:text-[rgb(var(--cyan))]">
                {label}
              </Link>
            ))}
          </nav>

          <button
            type="button"
            onClick={() => setTheme((current) => (current === "dark" ? "light" : "dark"))}
            className="inline-flex items-center gap-2 rounded-xl border-[3px] border-slate-900 dark:border-slate-950 bg-[rgb(var(--surface-2))] px-4 py-2 text-sm font-bold text-[rgb(var(--text))] shadow-[3px_3px_0px_0px_rgb(var(--card-shadow-color))] transition transform hover:translate-x-[-1px] hover:translate-y-[-1px] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <SunMedium size={16} /> : <Moon size={16} />}
            <span className="hidden sm:inline">{theme === "dark" ? "Light" : "Dark"}</span>
          </button>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
        <section
          id="hero"
          className="grid min-h-[calc(100vh-88px)] items-center gap-12 py-16 lg:grid-cols-[1.15fr_0.85fr]"
        >
          <motion.div
            initial={false}
            animate={mounted ? { opacity: 1, y: 0 } : false}
            transition={{ duration: 0.7, ease: "easeOut" }}
            style={{ y: heroLift, opacity: heroFade }}
            className="relative z-10"
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-xl border-[3px] border-slate-900 dark:border-slate-950 bg-[rgb(var(--cyan))] px-4 py-2 text-xs font-black uppercase tracking-wider text-slate-900 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] dark:shadow-[3px_3px_0px_0px_rgb(var(--card-shadow-color))] transform -rotate-1">
              <Sparkles size={14} />
              React Native + Kotlin + Product UI Craft
            </div>

            <h1 className="max-w-4xl text-5xl font-black leading-[0.9] tracking-tight text-[rgb(var(--text))] sm:text-6xl lg:text-7xl">
              <span className="block text-gradient">Building modern</span>
              <span className="inline-block bg-[rgb(var(--accent))] text-slate-900 border-[3px] border-slate-900 dark:border-slate-950 px-4 py-1.5 my-2 rounded-2xl shadow-[5px_5px_0px_0px_rgba(15,23,42,1)] dark:shadow-[5px_5px_0px_0px_rgb(var(--card-shadow-color))] transform rotate-1">
                cross-platform mobile
              </span>
              <span className="block">applications.</span>
            </h1>

            <p className="mt-8 max-w-2xl text-base font-medium leading-7 text-[rgb(var(--text))]/0.8 sm:text-lg">
              Building modern cross-platform mobile applications with React Native and
              Kotlin. I am a 4th-year engineering student focused on polished interfaces,
              practical API integration, and production-style app experiences.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <MagneticButton href="#projects">View Projects</MagneticButton>
              <MagneticButton href="#contact" variant="secondary">
                Contact Me
              </MagneticButton>
              <MagneticButton href="/Resume(react).pdf" variant="secondary" download>
                <Download size={16} />
                Download Resume
              </MagneticButton>
            </div>

            <div className="mt-12 grid gap-6 sm:grid-cols-3">
              {[
                ["Mobile builds", "08+"],
                ["UI systems", "Comic + motion"],
                ["Focus", "Recruiter-ready apps"],
              ].map(([label, value]) => (
                <TiltCard key={label} className="w-full">
                  <div className="glass rounded-2xl p-5 border-[3px] border-slate-900 dark:border-slate-950 shadow-[4px_4px_0px_0px_rgb(var(--card-shadow-color))] bg-halftone">
                    <p className="text-[10px] uppercase font-black tracking-wider text-[rgb(var(--muted))]">{label}</p>
                    <p className="mt-2 text-lg font-black text-[rgb(var(--text))]">{value}</p>
                  </div>
                </TiltCard>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={false}
            animate={mounted ? { opacity: 1, scale: 1 } : false}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
            style={{ y: heroLift, rotateX: panelTilt }}
            className="relative h-[500px] [perspective:1200px] lg:h-[600px]"
          >
            <TiltCard className="h-full w-full">
              <div className="glass absolute inset-0 overflow-hidden rounded-[2rem] border-[3px] border-slate-900 dark:border-slate-950 shadow-[6px_6px_0px_0px_rgb(var(--card-shadow-color))]">
                <div className="absolute inset-0 mesh-gradient opacity-90" />
                <HeroScene theme={theme} />

                {/* Comic bubble aura banner */}
                <div className="absolute left-5 top-5 rounded-xl border-2 border-slate-900 dark:border-slate-950 bg-[rgb(var(--accent))] px-3 py-2 text-slate-900 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] dark:shadow-[2px_2px_0px_0px_rgb(var(--card-shadow-color))] transform -rotate-2">
                  <p className="text-[9px] uppercase font-black tracking-wider">
                    Interactive
                  </p>
                  <p className="text-xs font-black">
                    Toon-shaded 3D aura
                  </p>
                </div>

                <div className="absolute bottom-5 left-5 right-5 grid gap-3 sm:grid-cols-3">
                  {[
                    ["React Native", "Cross-platform"],
                    ["Kotlin", "Native Android"],
                    ["API", "Auth + data"],
                  ].map(([label, value]) => (
                    <div
                      key={label}
                      className="glass rounded-xl border-2 border-slate-900 dark:border-slate-950 bg-[rgb(var(--surface))/0.9] px-3 py-2 backdrop-blur-md shadow-[2px_2px_0px_0px_rgb(var(--card-shadow-color))]"
                    >
                      <p className="text-[9px] uppercase font-black tracking-wider text-[rgb(var(--muted))]">
                        {label}
                      </p>
                      <p className="mt-1 text-xs font-bold text-[rgb(var(--text))]">{value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </TiltCard>
          </motion.div>
        </section>

        <SectionDivider label="PAGE 01 / PROFILE" />

        <Section id="about" eyebrow="01 / About" title="A mobile-focused builder with design instincts.">
          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <TiltCard>
              <GlassCard className="bg-halftone h-full border-[3px] border-slate-900 dark:border-slate-950 shadow-[6px_6px_0px_0px_rgb(var(--card-shadow-color))]">
                <p className="text-lg font-bold leading-8 text-[rgb(var(--text))]/0.85">
                  I'm passionate about mobile app development and the craft behind products
                  that feel premium from the first interaction. My work focuses on frontend
                  experience, polished UI systems, and practical integrations that make apps
                  feel complete.
                </p>
                <p className="mt-4 text-lg font-medium leading-8 text-[rgb(var(--text))]/0.8">
                  I enjoy building production-style applications with authentication,
                  API-driven flows, responsive layouts, and careful motion design. I'm
                  constantly learning, refining, and pushing toward cleaner architecture and
                  better delivery.
                </p>
              </GlassCard>
            </TiltCard>

            <div className="grid gap-4">
              {[
                ["Product mindset", "I think in flows, friction, and polish."],
                ["Integration ready", "Comfortable wiring auth, APIs, and data layers."],
                ["Learning velocity", "I iterate quickly and improve with each build."],
              ].map(([title, text]) => (
                <TiltCard key={title}>
                  <GlassCard className="p-5 border-[3px] border-slate-900 dark:border-slate-950 shadow-[4px_4px_0px_0px_rgb(var(--card-shadow-color))]">
                    <div className="flex items-start gap-4">
                      <div className="rounded-xl border-2 border-slate-900 dark:border-slate-950 bg-[rgb(var(--cyan))] p-2.5 text-slate-900 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] dark:shadow-[2px_2px_0px_0px_rgb(var(--card-shadow-color))]">
                        <BadgeCheck size={18} />
                      </div>
                      <div>
                        <p className="font-extrabold text-[rgb(var(--text))]">{title}</p>
                        <p className="mt-1 text-sm font-medium leading-6 text-[rgb(var(--text))]/0.75">{text}</p>
                      </div>
                    </div>
                  </GlassCard>
                </TiltCard>
              ))}
            </div>
          </div>
        </Section>

        <SectionDivider label="PAGE 02 / SKILLS" />

        <Section id="skills" eyebrow="02 / Skills" title="Strong technical depth, framed with interactive presentation.">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {skills.map((skill, index) => (
              <TiltCard key={skill}>
                <div className="glass premium-border bg-halftone rounded-2xl p-5 border-[3px] border-slate-900 dark:border-slate-950 shadow-[4px_4px_0px_0px_rgb(var(--card-shadow-color))]">
                  <div className="flex items-center justify-between">
                    <p className="text-lg font-black text-[rgb(var(--text))]">{skill}</p>
                    <span className="rounded-lg border-2 border-slate-900 dark:border-slate-950 bg-[rgb(var(--accent))] px-2.5 py-0.5 text-xs font-black text-slate-900 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] dark:shadow-[2px_2px_0px_0px_rgb(var(--card-shadow-color))]">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <div className="mt-4 h-[3px] bg-slate-900 dark:bg-white" />
                  <p className="mt-4 text-sm font-medium leading-6 text-[rgb(var(--text))]/0.75">
                    Built into polished mobile interfaces with smooth interactions and
                    production-minded implementation details.
                  </p>
                </div>
              </TiltCard>
            ))}
          </div>
        </Section>

        <SectionDivider label="PAGE 03 / PROJECTS" />

        <Section
          id="projects"
          eyebrow="03 / Featured Projects"
          title="Case-study style project stories with motion, depth, and clear actions."
        >
          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
            <TiltCard>
              <article className="glass bg-halftone overflow-hidden rounded-[2rem] p-6 lg:p-8 border-[3px] border-slate-900 dark:border-slate-950 shadow-[6px_6px_0px_0px_rgb(var(--card-shadow-color))]">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="text-[10px] uppercase font-black tracking-wider text-[rgb(var(--muted))]">
                      Featured / {activeProject.category}
                    </p>
                    <h3 className="mt-2 text-3xl font-black text-[rgb(var(--text))] sm:text-4xl">
                      {activeProject.name}
                    </h3>
                  </div>

                  <div className="flex gap-3">
                    <a
                      href={activeProject.github}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-xl border-2 border-slate-900 dark:border-slate-950 bg-[rgb(var(--surface-2))] px-4 py-2 text-xs font-bold text-[rgb(var(--text))] shadow-[2.5px_2.5px_0px_0px_rgb(var(--card-shadow-color))] transform hover:translate-x-[-1px] hover:translate-y-[-1px] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
                    >
                      <Github size={14} />
                      GitHub
                    </a>
                    {activeProject.live.startsWith("http") ? (
                      <a
                        href={activeProject.live}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 rounded-xl border-2 border-slate-900 dark:border-slate-950 bg-[rgb(var(--cyan))] px-4 py-2 text-xs font-black text-slate-900 shadow-[2.5px_2.5px_0px_0px_rgba(15,23,42,1)] dark:shadow-[2.5px_2.5px_0px_0px_rgb(var(--card-shadow-color))] transform hover:translate-x-[-1px] hover:translate-y-[-1px] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
                      >
                        Live Demo
                        <ArrowUpRight size={14} />
                      </a>
                    ) : (
                      <Link
                        href={activeProject.live}
                        className="inline-flex items-center gap-2 rounded-xl border-2 border-slate-900 dark:border-slate-950 bg-[rgb(var(--cyan))] px-4 py-2 text-xs font-black text-slate-900 shadow-[2.5px_2.5px_0px_0px_rgba(15,23,42,1)] dark:shadow-[2.5px_2.5px_0px_0px_rgb(var(--card-shadow-color))] transform hover:translate-x-[-1px] hover:translate-y-[-1px] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
                      >
                        Live Demo
                        <ArrowUpRight size={14} />
                      </Link>
                    )}
                  </div>
                </div>

                <div className="mt-8 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
                  <div className="space-y-4">
                    <p className="text-base font-bold leading-7 text-[rgb(var(--text))]/0.8">
                      {activeProject.description}
                    </p>
                    <p className="text-sm font-medium leading-6 text-[rgb(var(--text))]/0.7">{activeProject.details}</p>
                    <div className="flex flex-wrap gap-2 pt-3">
                      {activeProject.tech.map((tech) => (
                        <span
                          key={tech}
                          className="rounded-lg border-2 border-slate-900 dark:border-slate-950 bg-[rgb(var(--surface))] px-3 py-1 text-xs font-bold text-[rgb(var(--text))] shadow-[2px_2px_0px_0px_rgb(var(--card-shadow-color))]"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* 3D Mockup phone card */}
                  <div className="relative overflow-hidden rounded-[2rem] border-[3px] border-slate-900 dark:border-slate-950 bg-[rgb(var(--surface-2))]/50 p-4">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(45,212,191,0.18),transparent_50%)]" />
                    
                    <div className="relative flex justify-center items-center h-full">
                      {/* Stylized physical comic phone */}
                      <div className="relative mx-auto flex h-[320px] w-[180px] items-center justify-center rounded-[2.2rem] border-[4px] border-slate-900 dark:border-slate-950 bg-slate-950 p-3 shadow-[6px_6px_0px_0px_rgb(var(--card-shadow-color))]">
                        {/* Notch */}
                        <div className="absolute top-2 left-1/2 h-3.5 w-16 -translate-x-1/2 rounded-full bg-slate-900 dark:bg-white z-20 border border-slate-900 dark:border-slate-950" />
                        
                        <div className="h-full w-full overflow-hidden rounded-[1.6rem] border-2 border-slate-900 dark:border-slate-950 bg-[rgb(var(--surface))] relative flex flex-col justify-between p-3">
                          {/* 3D Toon Component */}
                          <div className="absolute inset-0 z-0">
                            <Comic3DView
                              shape={
                                expandedProject === "weather"
                                  ? "cloud"
                                  : expandedProject === "news"
                                  ? "globe"
                                  : "box"
                              }
                              theme={theme}
                            />
                          </div>

                          <div className="relative z-10 flex justify-between items-center">
                            <span className="text-[9px] font-black uppercase text-slate-900 bg-[rgb(var(--accent))] border-2 border-slate-900 dark:border-slate-950 px-2 py-0.5 rounded shadow-[1.5px_1.5px_0px_0px_rgba(15,23,42,1)] transform -rotate-3">
                              3D DEMO
                            </span>
                          </div>

                          <div className="relative z-10 bg-slate-950/75 border-2 border-slate-900 dark:border-slate-950 backdrop-blur-xs rounded-xl p-2.5 mb-1.5 shadow-[2px_2px_0px_0px_rgb(var(--card-shadow-color))] text-left">
                            <p className="text-[10px] uppercase font-black text-[rgb(var(--cyan))] tracking-wider">
                              {activeProject.name}
                            </p>
                            <p className="text-[9px] text-white/90 leading-tight mt-0.5 line-clamp-2">
                              {activeProject.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            </TiltCard>

            <div className="space-y-4">
              {projects.map((project) => {
                const expanded = expandedProject === project.id;
                return (
                  <TiltCard key={project.id}>
                    <button
                      type="button"
                      onClick={() => setExpandedProject(project.id)}
                      className={`glass w-full rounded-[1.75rem] p-5 text-left border-[3px] shadow-[4px_4px_0px_0px_rgb(var(--card-shadow-color))] bg-halftone transition-colors duration-150 ${
                        expanded 
                          ? "border-[rgb(var(--cyan))] bg-cyan-300/8 shadow-[4px_4px_0px_0px_rgb(var(--cyan))]" 
                          : "border-slate-900 dark:border-slate-950 hover:bg-slate-100/10"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p className="text-[10px] uppercase font-black tracking-wider text-[rgb(var(--muted))]">
                            {project.category}
                          </p>
                          <h4 className="mt-1 text-xl font-black text-[rgb(var(--text))]">{project.name}</h4>
                        </div>
                        <ChevronDown
                          size={18}
                          className={`transition transform duration-200 ${expanded ? "rotate-180 text-[rgb(var(--cyan))]" : ""}`}
                        />
                      </div>
                      <p className="mt-3 text-sm font-medium leading-6 text-[rgb(var(--text))]/0.75">{project.description}</p>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {project.tech.map((tech) => (
                          <span
                            key={tech}
                            className="rounded-lg border-2 border-slate-900 dark:border-slate-950 bg-[rgb(var(--surface-2))]/60 px-2.5 py-0.5 text-[11px] font-bold text-[rgb(var(--text))]"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>

                      <AnimatePresence initial={false}>
                        {expanded ? (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.22 }}
                            className="overflow-hidden"
                          >
                            <div className="mt-4 flex flex-wrap gap-3">
                              <a
                                href={project.github}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1.5 rounded-lg border-2 border-slate-900 dark:border-slate-950 bg-[rgb(var(--surface))] px-3 py-1.5 text-xs font-bold text-[rgb(var(--text))]"
                              >
                                <Github size={12} />
                                GitHub
                              </a>
                              {project.live.startsWith("http") ? (
                                <a
                                  href={project.live}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="inline-flex items-center gap-1.5 rounded-lg border-2 border-slate-900 dark:border-slate-950 bg-[rgb(var(--cyan))] px-3 py-1.5 text-xs font-black text-slate-900"
                                >
                                  Demo
                                  <ArrowUpRight size={12} />
                                </a>
                              ) : (
                                <Link
                                  href={project.live}
                                  className="inline-flex items-center gap-1.5 rounded-lg border-2 border-slate-900 dark:border-slate-950 bg-[rgb(var(--cyan))] px-3 py-1.5 text-xs font-black text-slate-900"
                                >
                                  Demo
                                  <ArrowUpRight size={12} />
                                </Link>
                              )}
                            </div>
                          </motion.div>
                        ) : null}
                      </AnimatePresence>
                    </button>
                  </TiltCard>
                );
              })}
            </div>
          </div>
        </Section>

        <SectionDivider label="PAGE 04 / METRICS" />

        <Section id="knowledge" eyebrow="04 / Knowledge" title="Practical knowledge depth with recruiter-friendly stats.">
          <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
            <TiltCard>
              <GlassCard className="space-y-5 border-[3px] border-slate-900 dark:border-slate-950 shadow-[6px_6px_0px_0px_rgb(var(--card-shadow-color))] h-full bg-halftone">
                <p className="text-sm font-bold leading-7 text-[rgb(var(--text))]/0.75">
                  A quick snapshot of your technical strengths, centered on the skills you
                  can demonstrate in production-style mobile and full-stack work.
                </p>
                
                <div className="grid gap-4 sm:grid-cols-2">
                  {[
                    { label: "Mobile UI Craft", value: "Expert" },
                    { label: "API Integration", value: "Strong" },
                    { label: "Auth Systems", value: "Strong" },
                    { label: "Android Kotlin", value: "Strong" },
                  ].map((stat) => (
                    <div
                      key={stat.label}
                      className="rounded-xl border-[3px] border-slate-900 dark:border-slate-950 bg-[rgb(var(--surface-2))]/60 p-4 shadow-[3px_3px_0px_0px_rgb(var(--card-shadow-color))]"
                    >
                      <p className="text-[10px] uppercase font-black tracking-wider text-[rgb(var(--muted))]">
                        {stat.label}
                      </p>
                      <p className="mt-2 text-2xl font-black text-[rgb(var(--text))]">{stat.value}</p>
                    </div>
                  ))}
                </div>

                <div className="rounded-xl border-[3px] border-slate-900 dark:border-slate-950 bg-[rgb(var(--cyan))]/12 p-5">
                  <p className="text-[10px] uppercase font-black tracking-wider text-[rgb(var(--cyan))]">
                    Positioning
                  </p>
                  <p className="mt-2 text-base font-bold leading-7 text-[rgb(var(--text))]/0.85">
                    Full stack mobile developer focused on polished product interfaces,
                    practical API flows, and clean implementation.
                  </p>
                </div>
              </GlassCard>
            </TiltCard>

            <TiltCard>
              <GlassCard className="space-y-6 border-[3px] border-slate-900 dark:border-slate-950 shadow-[6px_6px_0px_0px_rgb(var(--card-shadow-color))] h-full bg-halftone">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] uppercase font-black tracking-wider text-[rgb(var(--muted))]">
                      Knowledge metrics
                    </p>
                    <p className="mt-1 text-xl font-black text-[rgb(var(--text))]">What you can build well</p>
                  </div>
                  <Sparkles className="text-[rgb(var(--cyan))]" size={20} />
                </div>

                <div className="space-y-4">
                  {[
                    ["React Native + Expo", 92],
                    ["Kotlin + Android", 84],
                    ["NativeWind + UI polish", 90],
                    ["Clerk + Auth flows", 81],
                    ["Firebase + APIs", 87],
                    ["Git/GitHub workflow", 88],
                  ].map(([label, value]) => (
                    <div key={label} className="space-y-2">
                      <div className="flex items-center justify-between text-sm font-bold text-[rgb(var(--text))]/0.8">
                        <span>{label}</span>
                        <span>{value}%</span>
                      </div>
                      
                      {/* Comic loading bar */}
                      <div className="h-4 rounded-lg border-[3px] border-slate-900 dark:border-slate-950 bg-slate-900 overflow-hidden shadow-[2px_2px_0px_0px_rgb(var(--card-shadow-color))]">
                        <div
                          className="h-full bg-gradient-to-r from-[rgb(var(--cyan))] via-[rgb(var(--teal))] to-[rgb(var(--accent))] border-r-[3px] border-slate-900 dark:border-slate-950"
                          style={{ width: `${value}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </TiltCard>
          </div>
        </Section>

        <SectionDivider label="PAGE 05 / TIMELINE" />

        <Section id="resume" eyebrow="05 / Resume" title="Learning timeline and growth trajectory.">
          <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
            <TiltCard>
              <GlassCard className="space-y-6 border-[3px] border-slate-900 dark:border-slate-950 shadow-[6px_6px_0px_0px_rgb(var(--card-shadow-color))] h-full bg-halftone">
                <p className="text-base font-bold leading-7 text-[rgb(var(--text))]/0.8">
                  This section is framed like a high-end professional summary with a resume
                  download action and a timeline that highlights your development journey.
                </p>
                <MagneticButton href="/Resume(react).pdf" download>
                  <Download size={16} />
                  Download Resume
                </MagneticButton>
                
                <div className="rounded-xl border-[3px] border-slate-900 dark:border-slate-950 bg-[rgb(var(--surface-2))]/60 p-5 shadow-[4px_4px_0px_0px_rgb(var(--card-shadow-color))]">
                  <p className="text-[10px] uppercase font-black tracking-wider text-[rgb(var(--muted))]">
                    Current status
                  </p>
                  <p className="mt-2 text-lg font-black text-[rgb(var(--text))]">4th-year engineering student</p>
                  <p className="mt-2 text-sm font-medium leading-6 text-[rgb(var(--text))]/0.75">
                    Balancing academics with real-world mobile app building, technical depth,
                    and continuous portfolio refinement.
                  </p>
                </div>
              </GlassCard>
            </TiltCard>

            <div className="space-y-5">
              {timeline.map((item) => (
                <TiltCard key={item.year}>
                  <div className="glass bg-halftone rounded-[1.75rem] p-5 border-[3px] border-slate-900 dark:border-slate-950 shadow-[4px_4px_0px_0px_rgb(var(--card-shadow-color))]">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="rounded-full border-2 border-slate-900 dark:border-slate-950 bg-[rgb(var(--accent))] px-3.5 py-1 text-xs font-black text-slate-900 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] dark:shadow-[2px_2px_0px_0px_rgb(var(--card-shadow-color))] transform -rotate-1">
                        {item.year}
                      </span>
                      <h4 className="text-lg font-black text-[rgb(var(--text))]">{item.title}</h4>
                    </div>
                    <p className="mt-3 text-sm font-medium leading-7 text-[rgb(var(--text))]/0.75">{item.text}</p>
                  </div>
                </TiltCard>
              ))}
            </div>
          </div>
        </Section>

        <SectionDivider label="PAGE 06 / CONTACT" />

        <Section id="contact" eyebrow="06 / Contact" title="A premium contact surface for recruiters and product teams.">
          <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
            <TiltCard>
              <GlassCard className="space-y-6 border-[3px] border-slate-900 dark:border-slate-950 shadow-[6px_6px_0px_0px_rgb(var(--card-shadow-color))] bg-halftone">
                <div className="grid gap-4 sm:grid-cols-2">
                  <TiltCard>
                    <ContactField label="Email" value="abhijeet200508@gmail.com" icon={<Mail size={16} />} />
                  </TiltCard>
                  <TiltCard>
                    <ContactField
                      label="LinkedIn"
                      value="linkedin.com/in/abhijeet-singh-a6571b325"
                      icon={<Linkedin size={16} />}
                    />
                  </TiltCard>
                </div>
                
                <form
                  className="grid gap-4"
                  onSubmit={async (event) => {
                    event.preventDefault();
                    const formElement = event.currentTarget;
                    const formData = new FormData(formElement);
                    const name = String(formData.get("name") ?? "").trim();
                    const email = String(formData.get("email") ?? "").trim();
                    const message = String(formData.get("message") ?? "").trim();
                    const subject = encodeURIComponent(`Portfolio message from ${name || "visitor"}`);
                    const body = encodeURIComponent(
                      `Name: ${name}\nEmail: ${email}\n\n${message}`,
                    );

                    window.location.href =
                      `mailto:abhijeet200508@gmail.com?subject=${subject}&body=${body}`;

                    formElement.reset();
                    setContactState({
                      success: "Your email app opened with the message prefilled.",
                    });
                  }}
                >
                  <div className="grid gap-4 sm:grid-cols-2">
                    <input
                      name="name"
                      type="text"
                      placeholder="Your name"
                      required
                      className="rounded-xl border-[3px] border-slate-900 dark:border-slate-950 bg-white dark:bg-slate-950 px-4 py-3 text-sm font-bold text-[rgb(var(--text))] outline-none shadow-[3px_3px_0px_0px_rgb(var(--card-shadow-color))] transition placeholder:text-[rgb(var(--text))]/0.4 focus:border-[rgb(var(--cyan))]"
                    />
                    <input
                      name="email"
                      type="email"
                      placeholder="Your email"
                      required
                      className="rounded-xl border-[3px] border-slate-900 dark:border-slate-950 bg-white dark:bg-slate-950 px-4 py-3 text-sm font-bold text-[rgb(var(--text))] outline-none shadow-[3px_3px_0px_0px_rgb(var(--card-shadow-color))] transition placeholder:text-[rgb(var(--text))]/0.4 focus:border-[rgb(var(--cyan))]"
                    />
                  </div>
                  <textarea
                    name="message"
                    rows={4}
                    required
                    placeholder="Tell me about the role, product, or collaboration..."
                    className="rounded-xl border-[3px] border-slate-900 dark:border-slate-950 bg-white dark:bg-slate-950 px-4 py-3 text-sm font-bold text-[rgb(var(--text))] outline-none shadow-[3px_3px_0px_0px_rgb(var(--card-shadow-color))] transition placeholder:text-[rgb(var(--text))]/0.4 focus:border-[rgb(var(--cyan))]"
                  />
                  <div className="flex flex-wrap gap-3 pt-2">
                    <button
                      type="submit"
                      className="inline-flex items-center justify-center gap-2 rounded-xl border-[3px] border-slate-900 dark:border-slate-950 bg-[rgb(var(--cyan))] px-6 py-3 text-xs font-black tracking-wider uppercase text-slate-900 shadow-[4px_4px_0px_0px_rgb(var(--card-shadow-color))] transition transform hover:translate-x-[-1px] hover:translate-y-[-1px] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none cursor-pointer"
                    >
                      <Mail size={14} />
                      Send Email
                    </button>
                    <MagneticButton href="https://github.com/Abhijeetsingh2100" variant="secondary">
                      <Github size={14} />
                      GitHub
                    </MagneticButton>
                  </div>
                  {contactState.success ? <p className="text-sm font-bold text-[rgb(var(--cyan))] mt-2">{contactState.success}</p> : null}
                </form>
              </GlassCard>
            </TiltCard>

            <TiltCard>
              <GlassCard className="relative overflow-hidden border-[3px] border-slate-900 dark:border-slate-950 shadow-[6px_6px_0px_0px_rgb(var(--card-shadow-color))] bg-halftone h-full flex flex-col justify-between">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(45,212,191,0.18),transparent_50%)] pointer-events-none" />
                <div className="relative space-y-5">
                  <p className="text-[10px] uppercase font-black tracking-wider text-[rgb(var(--muted))]">Social links</p>
                  <div className="grid gap-4">
                    <SocialLink
                      icon={<Github size={18} />}
                      label="GitHub"
                      href="https://github.com/Abhijeetsingh2100"
                      value="github.com/Abhijeetsingh2100"
                    />
                    <SocialLink
                      icon={<Linkedin size={18} />}
                      label="LinkedIn"
                      href="https://www.linkedin.com/in/abhijeet-singh-a6571b325/"
                      value="linkedin.com/in/abhijeet-singh-a6571b325"
                    />
                    <SocialLink
                      icon={<Mail size={18} />}
                      label="Email"
                      href="mailto:abhijeet200508@gmail.com"
                      value="abhijeet200508@gmail.com"
                    />
                  </div>
                </div>

                <div className="rounded-xl border-[3px] border-slate-900 dark:border-slate-950 bg-[rgb(var(--cyan))]/10 p-5 mt-6 text-left">
                  <p className="text-[10px] uppercase font-black tracking-wider text-[rgb(var(--cyan))]">
                    Portfolio intent
                  </p>
                  <p className="mt-2 text-base font-bold leading-7 text-[rgb(var(--text))]/0.85">
                    A polished futuristic portfolio of a modern mobile developer capable of
                    building production-quality cross-platform applications.
                  </p>
                </div>
              </GlassCard>
            </TiltCard>
          </div>
        </Section>
      </main>

      <footer className="border-t-[3px] border-slate-900 dark:border-slate-950 px-4 py-8 text-center text-sm font-bold text-[rgb(var(--text))]/0.5 bg-[rgb(var(--surface-2))]/30 transition-colors duration-200">
        <p>Abhijeet Singh portfolio concept built with Next.js, Tailwind CSS, Framer Motion, and Three.js.</p>
      </footer>
    </div>
  );
}

function FloatingParticles({
  cursor,
  reducedMotion,
}: {
  cursor: { x: number; y: number; visible: boolean };
  reducedMotion: boolean;
}) {
  const [viewport, setViewport] = useState({ width: 1, height: 1 });
  const particles = [
    { left: 8, top: 18, size: 10, delay: 0, drift: 0.12 },
    { left: 18, top: 42, size: 14, delay: 0.6, drift: 0.08 },
    { left: 32, top: 14, size: 8, delay: 1.2, drift: 0.16 },
    { left: 52, top: 28, size: 12, delay: 0.3, drift: 0.1 },
    { left: 68, top: 12, size: 9, delay: 0.9, drift: 0.14 },
    { left: 82, top: 38, size: 13, delay: 0.2, drift: 0.09 },
    { left: 90, top: 16, size: 7, delay: 0.8, drift: 0.15 },
    { left: 12, top: 70, size: 11, delay: 1.1, drift: 0.07 },
    { left: 26, top: 84, size: 8, delay: 0.4, drift: 0.11 },
    { left: 58, top: 76, size: 14, delay: 1.4, drift: 0.1 },
    { left: 74, top: 64, size: 9, delay: 0.5, drift: 0.13 },
    { left: 88, top: 84, size: 10, delay: 0.95, drift: 0.08 },
  ];

  useEffect(() => {
    const update = () =>
      setViewport({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    update();
    window.addEventListener("resize", update, { passive: true });
    return () => window.removeEventListener("resize", update);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-[1] overflow-hidden">
      {particles.map((particle, index) => {
        const parallaxX =
          reducedMotion || !cursor.visible
            ? 0
            : (cursor.x - viewport.width / 2) * particle.drift * 0.018;
        const parallaxY =
          reducedMotion || !cursor.visible
            ? 0
            : (cursor.y - viewport.height / 2) * particle.drift * 0.018;

        return (
          <motion.span
            key={index}
            className="absolute rounded-lg bg-[rgb(var(--cyan))]/30 border border-slate-900 dark:border-slate-950 shadow-[1px_1px_0px_0px_rgba(0,0,0,0.15)]"
            style={{
              left: `${particle.left}%`,
              top: `${particle.top}%`,
              width: particle.size,
              height: particle.size,
              x: parallaxX,
              y: parallaxY,
            }}
            animate={
              reducedMotion
                ? undefined
                : {
                    y: [0, -12, 0],
                    opacity: [0.25, 0.85, 0.25],
                    scale: [1, 1.15, 1],
                  }
            }
            transition={{
              duration: 6 + index * 0.25,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
              delay: particle.delay,
            }}
          />
        );
      })}
    </div>
  );
}

function HeroFallback() {
  return (
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(45,212,191,0.16),transparent_40%),radial-gradient(circle_at_70%_70%,rgba(20,184,166,0.16),transparent_40%)]" />
  );
}

function Section({
  id,
  eyebrow,
  title,
  children,
}: {
  id: string;
  eyebrow: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="py-12 sm:py-16 lg:py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.18 }}
        transition={{ duration: 0.65, ease: "easeOut" }}
      >
        <span className="comic-badge mb-2">
          {eyebrow}
        </span>
        <h2 className="mt-3 max-w-3xl text-3xl font-black tracking-tight text-[rgb(var(--text))] sm:text-4xl lg:text-5xl">
          {title}
        </h2>
      </motion.div>
      <div className="mt-8">{children}</div>
    </section>
  );
}

function SectionDivider({ label }: { label?: string }) {
  return (
    <div className="relative my-16 flex items-center justify-center">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t-[4px] border-slate-900 dark:border-slate-950" />
      </div>
      {label && (
        <span className="relative z-10 bg-[rgb(var(--accent))] text-slate-900 font-extrabold text-xs uppercase px-4 py-2 border-[3px] border-slate-900 dark:border-slate-950 rounded-lg shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] dark:shadow-[3px_3px_0px_0px_rgb(var(--card-shadow-color))] transform -rotate-1">
          {label}
        </span>
      )}
    </div>
  );
}

function GlassCard({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`glass rounded-[2rem] p-6 ${className}`}>{children}</div>
  );
}

function ContactField({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: ReactNode;
}) {
  return (
    <div className="rounded-xl border-[3px] border-slate-900 dark:border-slate-950 bg-[rgb(var(--surface-2))]/60 p-4 shadow-[3px_3px_0px_0px_rgb(var(--card-shadow-color))] h-full">
      <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[rgb(var(--muted))]">
        <span className="p-1 rounded bg-[rgb(var(--accent))] text-slate-900 border border-slate-900 dark:border-slate-950">
          {icon}
        </span>
        {label}
      </div>
      <p className="mt-3 break-all text-sm font-bold text-[rgb(var(--text))]/0.85">{value}</p>
    </div>
  );
}

function SocialLink({
  label,
  value,
  href,
  icon,
}: {
  label: string;
  value: string;
  href: string;
  icon: ReactNode;
}) {
  const external = href.startsWith("http") || href.startsWith("mailto:");
  const innerClass = "group flex items-center justify-between rounded-xl border-[3px] border-slate-900 dark:border-slate-950 bg-[rgb(var(--surface-2))]/50 p-4 shadow-[3px_3px_0px_0px_rgb(var(--card-shadow-color))] transition transform hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[5px_5px_0px_0px_rgb(var(--card-shadow-color))] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none w-full";
  
  const content = (
    <>
      <div className="flex items-center gap-3">
        <div className="rounded-lg border-2 border-slate-900 dark:border-slate-950 bg-[rgb(var(--accent))] p-2 text-slate-900 shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)]">
          {icon}
        </div>
        <div className="text-left">
          <p className="font-extrabold text-[rgb(var(--text))] text-sm">{label}</p>
          <p className="text-xs font-medium text-[rgb(var(--muted))]">{value}</p>
        </div>
      </div>
      <ArrowUpRight
        size={18}
        className="text-[rgb(var(--muted))] transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[rgb(var(--cyan))]"
      />
    </>
  );

  if (external) {
    return (
      <a
        href={href}
        target={href.startsWith("http") ? "_blank" : undefined}
        rel={href.startsWith("http") ? "noreferrer" : undefined}
        className={innerClass}
      >
        {content}
      </a>
    );
  }

  return (
    <Link href={href} className={innerClass}>
      {content}
    </Link>
  );
}
