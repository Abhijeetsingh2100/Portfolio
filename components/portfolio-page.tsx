"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
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
  type ReactNode,
} from "react";
import { MagneticButton } from "./magnetic-button";

const HeroScene = dynamic(() => import("./hero-scene"), {
  ssr: false,
  loading: () => <HeroFallback />,
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

export default function PortfolioPage() {
  const reducedMotion = useReducedMotion() ?? false;
  const { scrollYProgress } = useScroll();
  const heroLift = useTransform(scrollYProgress, [0, 0.22], [0, 36]);
  const heroFade = useTransform(scrollYProgress, [0, 0.14], [1, 0.94]);
  const panelTilt = useTransform(scrollYProgress, [0, 0.2], [0, 8]);
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
    <div className="relative overflow-hidden">
      <motion.div
        style={{ scaleX: scrollYProgress }}
        className="pointer-events-none fixed left-0 top-0 z-[60] h-[3px] w-full origin-left bg-gradient-to-r from-cyan-300 via-teal-300 to-sky-200"
      />
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
              theme === "dark" ? "bg-cyan-400/10" : "bg-sky-300/25"
            }`}
          />
          <div
            className={`absolute -right-20 top-52 h-[28rem] w-[28rem] rounded-full blur-3xl ${
              theme === "dark" ? "bg-teal-400/10" : "bg-cyan-300/20"
            }`}
          />
          <div
            className={`absolute bottom-0 left-1/2 h-[20rem] w-[50rem] -translate-x-1/2 rounded-full blur-3xl ${
              theme === "dark" ? "bg-sky-400/8" : "bg-teal-200/30"
            }`}
          />
        </motion.div>
      </AnimatePresence>
      <div className="pointer-events-none fixed inset-0 grid-noise opacity-35" />
      <div className="pointer-events-none fixed inset-0 noise-overlay opacity-35" />
      <div className="pointer-events-none fixed inset-0 bg-radial-fade" />
      <FloatingParticles cursor={cursor} reducedMotion={reducedMotion} />

      {!reducedMotion && cursor.visible ? (
        <motion.div
          animate={{ x: cursor.x - 14, y: cursor.y - 14, opacity: 1 }}
          transition={{ type: "spring", stiffness: 280, damping: 28, mass: 0.4 }}
          className="pointer-events-none fixed left-0 top-0 z-50 hidden h-7 w-7 rounded-full border border-cyan-300/70 bg-cyan-300/10 shadow-[0_0_24px_rgba(45,212,191,0.4)] backdrop-blur-md md:block"
        />
      ) : null}

      <header className="sticky top-0 z-40 border-b border-white/5 bg-[rgb(var(--bg)/0.68)] backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link href="#hero" className="group flex items-center gap-3">
            <span className="relative flex h-10 w-10 items-center justify-center rounded-full border border-cyan-300/25 bg-cyan-300/10 text-sm font-semibold text-cyan-200 shadow-glow">
              AS
            </span>
            <div>
              <p className="text-sm font-semibold tracking-[0.25em] text-white/90">
                ABHIJEET SINGH
              </p>
              <p className="text-xs uppercase tracking-[0.32em] text-white/40">
                Full Stack Mobile Developer
              </p>
            </div>
          </Link>

          <nav className="hidden items-center gap-5 text-sm text-white/70 md:flex">
            {[
              ["About", "#about"],
              ["Skills", "#skills"],
              ["Projects", "#projects"],
              ["Knowledge", "#knowledge"],
              ["Resume", "#resume"],
              ["Contact", "#contact"],
            ].map(([label, href]) => (
              <Link key={href} href={href} className="transition hover:text-white">
                {label}
              </Link>
            ))}
          </nav>

          <button
            type="button"
            onClick={() => setTheme((current) => (current === "dark" ? "light" : "dark"))}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80 transition hover:border-cyan-300/30 hover:bg-white/10"
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
          className="grid min-h-[calc(100vh-88px)] items-center gap-12 py-16 lg:grid-cols-[1.1fr_0.9fr]"
        >
          <motion.div
            initial={false}
            animate={mounted ? { opacity: 1, y: 0 } : false}
            transition={{ duration: 0.7, ease: "easeOut" }}
            style={{ y: heroLift, opacity: heroFade }}
            className="relative z-10"
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/8 px-4 py-2 text-xs uppercase tracking-[0.3em] text-cyan-100/90">
              <Sparkles size={14} />
              React Native + Kotlin + Product UI Craft
            </div>

            <h1 className="max-w-4xl text-5xl font-semibold leading-[0.95] tracking-[-0.05em] text-white sm:text-6xl lg:text-8xl">
              <span className="block text-gradient">Building modern</span>
              <span className="block">cross-platform mobile</span>
              <span className="block">applications.</span>
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-7 text-white/72 sm:text-lg">
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

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {[
                ["Mobile builds", "08+"],
                ["UI systems", "Glass + motion"],
                ["Focus", "Recruiter-ready apps"],
              ].map(([label, value]) => (
                <motion.div
                  key={label}
                  initial={false}
                  animate={mounted ? { opacity: 1, y: 0 } : false}
                  transition={{ delay: 0.1, duration: 0.6 }}
                  className="glass premium-border rounded-3xl p-4"
                >
                  <p className="text-xs uppercase tracking-[0.3em] text-white/45">{label}</p>
                  <p className="mt-2 text-lg font-semibold text-white">{value}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={false}
            animate={mounted ? { opacity: 1, scale: 1 } : false}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
            style={{ y: heroLift, rotateX: panelTilt }}
            className="relative h-[540px] [perspective:1200px] lg:h-[680px]"
          >
            <div className="glass premium-border absolute inset-0 overflow-hidden rounded-[2rem]">
              <div className="absolute inset-0 mesh-gradient opacity-90" />
              <HeroScene />

              <div className="absolute left-5 top-5 rounded-2xl border border-white/10 bg-black/20 px-4 py-3 backdrop-blur-xl">
                <p className="text-[10px] uppercase tracking-[0.4em] text-cyan-100/70">
                  Live 3D
                </p>
                <p className="mt-1 text-sm font-medium text-white/90">
                  Interactive product aura
                </p>
              </div>

              <div className="absolute bottom-5 left-5 right-5 grid gap-4 sm:grid-cols-3">
                {[
                  ["React Native", "Cross-platform"],
                  ["Kotlin", "Native Android"],
                  ["API", "Auth + data"],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="glass rounded-2xl border border-white/10 px-4 py-3 backdrop-blur-2xl"
                  >
                    <p className="text-[10px] uppercase tracking-[0.32em] text-white/45">
                      {label}
                    </p>
                    <p className="mt-2 text-sm text-white/86">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </section>

        <SectionDivider />

        <Section id="about" eyebrow="01 / About" title="A mobile-focused builder with design instincts.">
          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <GlassCard>
              <p className="text-lg leading-8 text-white/75">
                I'm passionate about mobile app development and the craft behind products
                that feel premium from the first interaction. My work focuses on frontend
                experience, polished UI systems, and practical integrations that make apps
                feel complete.
              </p>
              <p className="mt-4 text-lg leading-8 text-white/75">
                I enjoy building production-style applications with authentication,
                API-driven flows, responsive layouts, and careful motion design. I'm
                constantly learning, refining, and pushing toward cleaner architecture and
                better delivery.
              </p>
            </GlassCard>

            <div className="grid gap-4">
              {[
                ["Product mindset", "I think in flows, friction, and polish."],
                ["Integration ready", "Comfortable wiring auth, APIs, and data layers."],
                ["Learning velocity", "I iterate quickly and improve with each build."],
              ].map(([title, text]) => (
                <GlassCard key={title} className="p-5">
                  <div className="flex items-start gap-3">
                    <div className="rounded-2xl border border-cyan-300/15 bg-cyan-300/10 p-3 text-cyan-100">
                      <BadgeCheck size={18} />
                    </div>
                    <div>
                      <p className="font-semibold text-white">{title}</p>
                      <p className="mt-2 text-sm leading-6 text-white/66">{text}</p>
                    </div>
                  </div>
                </GlassCard>
              ))}
            </div>
          </div>
        </Section>

        <Section id="skills" eyebrow="02 / Skills" title="Strong technical depth, framed with interactive presentation.">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {skills.map((skill, index) => (
              <motion.div
                key={skill}
                whileHover={{ y: -8, scale: 1.01 }}
                transition={{ type: "spring", stiffness: 240, damping: 18 }}
                className="glass premium-border group rounded-3xl p-5"
              >
                <div className="flex items-center justify-between">
                  <p className="text-lg font-semibold text-white">{skill}</p>
                  <span className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-[10px] uppercase tracking-[0.28em] text-cyan-100/80">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>
                <div className="mt-6 h-px bg-gradient-to-r from-white/5 via-cyan-300/40 to-white/5" />
                <p className="mt-4 text-sm leading-6 text-white/62">
                  Built into polished mobile interfaces with smooth interactions and
                  production-minded implementation details.
                </p>
              </motion.div>
            ))}
          </div>
        </Section>

        <Section
          id="projects"
          eyebrow="03 / Featured Projects"
          title="Case-study style project stories with motion, depth, and clear actions."
        >
          <div className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
            <motion.article
              layout
              className="glass premium-border overflow-hidden rounded-[2rem] p-6 lg:p-8"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.35em] text-cyan-100/70">
                    Featured / {activeProject.category}
                  </p>
                  <h3 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">
                    {activeProject.name}
                  </h3>
                </div>

                <div className="flex gap-3">
                  <a
                    href={activeProject.github}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80 transition hover:bg-white/10"
                  >
                    <Github size={16} />
                    GitHub
                  </a>
                  {activeProject.live.startsWith("http") ? (
                    <a
                      href={activeProject.live}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-full border border-cyan-300/25 bg-cyan-300/12 px-4 py-2 text-sm text-white transition hover:bg-cyan-300/18"
                    >
                      Live Demo
                      <ArrowUpRight size={16} />
                    </a>
                  ) : (
                    <Link
                      href={activeProject.live}
                      className="inline-flex items-center gap-2 rounded-full border border-cyan-300/25 bg-cyan-300/12 px-4 py-2 text-sm text-white transition hover:bg-cyan-300/18"
                    >
                      Live Demo
                      <ArrowUpRight size={16} />
                    </Link>
                  )}
                </div>
              </div>

              <div className="mt-8 grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
                <div className="space-y-4">
                  <p className="text-base leading-7 text-white/72">
                    {activeProject.description}
                  </p>
                  <p className="text-sm leading-6 text-white/56">{activeProject.details}</p>
                  <div className="flex flex-wrap gap-2 pt-3">
                    {activeProject.tech.map((tech) => (
                      <span
                        key={tech}
                        className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/72"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02))] p-4">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(45,212,191,0.24),transparent_40%)]" />
                  <div className="relative grid gap-4 sm:grid-cols-[0.9fr_1.1fr]">
                    <div className="mx-auto flex h-[300px] w-[160px] items-center justify-center rounded-[2rem] border border-white/12 bg-black/35 p-3 shadow-[0_0_60px_rgba(0,0,0,0.25)]">
                      <div className="h-full w-full rounded-[1.45rem] border border-cyan-200/15 bg-[linear-gradient(180deg,rgba(10,16,23,1),rgba(20,40,43,0.95))] p-3">
                        <div className="h-2 w-14 rounded-full bg-white/20" />
                        <div className="mt-4 space-y-3">
                          <div className="h-20 rounded-2xl bg-cyan-300/12 p-3">
                            <p className="text-[10px] uppercase tracking-[0.3em] text-cyan-100/60">
                              Overview
                            </p>
                            <p className="mt-2 text-sm font-semibold text-white">Subscriptions</p>
                          </div>
                          <div className="h-16 rounded-2xl bg-white/6 p-3" />
                          <div className="h-16 rounded-2xl bg-white/6 p-3" />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                        <p className="text-xs uppercase tracking-[0.3em] text-white/40">
                          Why it matters
                        </p>
                        <p className="mt-2 text-sm leading-6 text-white/70">
                          Recruiter-ready UI with an intentional mobile information hierarchy.
                        </p>
                      </div>
                      <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                        <p className="text-xs uppercase tracking-[0.3em] text-white/40">
                          Mobile polish
                        </p>
                        <p className="mt-2 text-sm leading-6 text-white/70">
                          Animated cards, premium spacing, and app-like pacing designed to
                          feel production-grade.
                        </p>
                      </div>
                      <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                        <p className="text-xs uppercase tracking-[0.3em] text-white/40">
                          Focus
                        </p>
                        <p className="mt-2 text-sm leading-6 text-white/70">
                          Cross-platform delivery, authentication, and recurring expense
                          visibility.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.article>

            <div className="space-y-4">
              {projects.map((project) => {
                const expanded = expandedProject === project.id;
                return (
                  <motion.button
                    key={project.id}
                    type="button"
                    onClick={() => setExpandedProject(project.id)}
                    whileHover={{ y: -4 }}
                    className={`glass premium-border w-full rounded-[1.75rem] p-5 text-left transition ${
                      expanded ? "border-cyan-300/25 bg-cyan-300/8" : "hover:bg-white/8"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-xs uppercase tracking-[0.3em] text-white/40">
                          {project.category}
                        </p>
                        <h4 className="mt-2 text-xl font-semibold text-white">{project.name}</h4>
                      </div>
                      <ChevronDown
                        size={18}
                        className={`transition ${expanded ? "rotate-180" : ""}`}
                      />
                    </div>
                    <p className="mt-4 text-sm leading-6 text-white/66">{project.description}</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {project.tech.map((tech) => (
                        <span
                          key={tech}
                          className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] text-white/70"
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
                          transition={{ duration: 0.28 }}
                          className="overflow-hidden"
                        >
                          <div className="mt-4 flex flex-wrap gap-3">
                            <a
                              href={project.github}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-white/80"
                            >
                              <Github size={14} />
                              GitHub
                            </a>
                            {project.live.startsWith("http") ? (
                              <a
                                href={project.live}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-xs text-white"
                              >
                                Demo
                                <ArrowUpRight size={14} />
                              </a>
                            ) : (
                              <Link
                                href={project.live}
                                className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-xs text-white"
                              >
                                Demo
                                <ArrowUpRight size={14} />
                              </Link>
                            )}
                          </div>
                        </motion.div>
                      ) : null}
                    </AnimatePresence>
                  </motion.button>
                );
              })}
            </div>
          </div>
        </Section>

        <Section id="knowledge" eyebrow="04 / Knowledge" title="Practical knowledge depth with recruiter-friendly stats.">
          <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
            <GlassCard className="space-y-5">
              <p className="text-sm leading-7 text-white/70">
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
                  <div key={stat.label} className="rounded-3xl border border-white/10 bg-white/5 p-4">
                    <p className="text-xs uppercase tracking-[0.3em] text-white/40">
                      {stat.label}
                    </p>
                    <p className="mt-3 text-2xl font-semibold text-white">{stat.value}</p>
                  </div>
                ))}
              </div>
              <div className="rounded-3xl border border-cyan-300/20 bg-cyan-300/10 p-5">
                <p className="text-xs uppercase tracking-[0.3em] text-cyan-100/75">
                  Positioning
                </p>
                <p className="mt-3 text-base leading-7 text-white/85">
                  Full stack mobile developer focused on polished product interfaces,
                  practical API flows, and clean implementation.
                </p>
              </div>
            </GlassCard>

            <GlassCard className="space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-white/40">
                    Knowledge metrics
                  </p>
                  <p className="mt-2 text-xl font-semibold text-white">What you can build well</p>
                </div>
                <Sparkles className="text-cyan-100/80" size={20} />
              </div>

              <div className="space-y-3">
                {[
                  ["React Native + Expo", 92],
                  ["Kotlin + Android", 84],
                  ["NativeWind + UI polish", 90],
                  ["Clerk + Auth flows", 81],
                  ["Firebase + APIs", 87],
                  ["Git/GitHub workflow", 88],
                ].map(([label, value]) => (
                  <div key={label} className="space-y-2">
                    <div className="flex items-center justify-between text-sm text-white/72">
                      <span>{label}</span>
                      <span>{value}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-white/8">
                      <div
                        className="h-2 rounded-full bg-gradient-to-r from-cyan-300 via-teal-300 to-cyan-100 shadow-glow"
                        style={{ width: `${value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>
        </Section>

        <Section id="resume" eyebrow="05 / Resume" title="Learning timeline and growth trajectory.">
          <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
            <GlassCard className="space-y-6">
              <p className="text-base leading-7 text-white/72">
                This section is framed like a high-end professional summary with a resume
                download action and a timeline that highlights your development journey.
              </p>
              <MagneticButton href="/Resume(react).pdf" download>
                <Download size={16} />
                Download Resume
              </MagneticButton>
              <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                <p className="text-xs uppercase tracking-[0.3em] text-white/40">
                  Current status
                </p>
                <p className="mt-3 text-lg font-semibold text-white">4th-year engineering student</p>
                <p className="mt-2 text-sm leading-6 text-white/66">
                  Balancing academics with real-world mobile app building, technical depth,
                  and continuous portfolio refinement.
                </p>
              </div>
            </GlassCard>

            <div className="space-y-4">
              {timeline.map((item) => (
                <motion.div
                  key={item.year}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  className="glass premium-border rounded-[1.75rem] p-5"
                >
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-xs uppercase tracking-[0.3em] text-cyan-100/80">
                      {item.year}
                    </span>
                    <h4 className="text-lg font-semibold text-white">{item.title}</h4>
                  </div>
                  <p className="mt-3 text-sm leading-7 text-white/68">{item.text}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </Section>

        <Section id="contact" eyebrow="06 / Contact" title="A premium contact surface for recruiters and product teams.">
          <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
            <GlassCard className="space-y-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <ContactField label="Email" value="abhijeet200508@gmail.com" icon={<Mail size={16} />} />
                <ContactField
                  label="LinkedIn"
                  value="linkedin.com/in/abhijeet-singh-a6571b325"
                  icon={<Linkedin size={16} />}
                />
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
                    className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-cyan-300/30"
                  />
                  <input
                    name="email"
                    type="email"
                    placeholder="Your email"
                    required
                    className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-cyan-300/30"
                  />
                </div>
                <textarea
                  name="message"
                  rows={5}
                  required
                  placeholder="Tell me about the role, product, or collaboration..."
                  className="rounded-[1.4rem] border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-cyan-300/30"
                />
                <div className="flex flex-wrap gap-3">
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-[rgb(var(--cyan)/0.35)] bg-[rgb(var(--cyan)/0.12)] px-5 py-3 text-sm font-medium text-white transition hover:bg-[rgb(var(--cyan)/0.2)]"
                  >
                    <Mail size={16} />
                    Send Email
                  </button>
                  <MagneticButton href="https://github.com/Abhijeetsingh2100" variant="secondary">
                    <Github size={16} />
                    GitHub
                  </MagneticButton>
                </div>
                {contactState.success ? <p className="text-sm text-teal-200">{contactState.success}</p> : null}
              </form>
            </GlassCard>

            <GlassCard className="relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(45,212,191,0.18),transparent_44%)]" />
              <div className="relative space-y-5">
                <p className="text-xs uppercase tracking-[0.35em] text-white/40">Social links</p>
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

                <div className="rounded-[1.75rem] border border-cyan-300/15 bg-cyan-300/8 p-5">
                  <p className="text-sm uppercase tracking-[0.3em] text-cyan-100/75">
                    Portfolio intent
                  </p>
                  <p className="mt-3 text-lg leading-8 text-white/86">
                    A polished futuristic portfolio of a modern mobile developer capable of
                    building production-quality cross-platform applications.
                  </p>
                </div>
              </div>
            </GlassCard>
          </div>
        </Section>
      </main>

      <footer className="border-t border-white/5 px-4 py-8 text-center text-sm text-white/45">
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
            className="absolute rounded-full bg-cyan-200/60 blur-[1px]"
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
                    scale: [1, 1.2, 1],
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
        <p className="text-xs uppercase tracking-[0.38em] text-cyan-100/65">{eyebrow}</p>
        <h2 className="mt-3 max-w-3xl text-3xl font-semibold tracking-[-0.04em] text-white sm:text-4xl lg:text-5xl">
          {title}
        </h2>
      </motion.div>
      <div className="mt-8">{children}</div>
    </section>
  );
}

function SectionDivider() {
  return <div className="my-4 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />;
}

function GlassCard({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`glass premium-border rounded-[2rem] p-6 ${className}`}>{children}</div>
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
    <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
      <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-white/40">
        {icon}
        {label}
      </div>
      <p className="mt-3 break-all text-sm text-white/78">{value}</p>
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
  if (external) {
    return (
      <a
        href={href}
        target={href.startsWith("http") ? "_blank" : undefined}
        rel={href.startsWith("http") ? "noreferrer" : undefined}
        className="group flex items-center justify-between rounded-3xl border border-white/10 bg-white/5 p-4 transition hover:border-cyan-300/25 hover:bg-cyan-300/8"
      >
        <div className="flex items-center gap-3">
          <div className="rounded-2xl border border-white/10 bg-white/8 p-3 text-cyan-100">
            {icon}
          </div>
          <div>
            <p className="font-medium text-white">{label}</p>
            <p className="text-sm text-white/52">{value}</p>
          </div>
        </div>
        <ArrowUpRight
          size={18}
          className="text-white/45 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-white"
        />
      </a>
    );
  }

  return (
    <Link
      href={href}
      className="group flex items-center justify-between rounded-3xl border border-white/10 bg-white/5 p-4 transition hover:border-cyan-300/25 hover:bg-cyan-300/8"
    >
      <div className="flex items-center gap-3">
        <div className="rounded-2xl border border-white/10 bg-white/8 p-3 text-cyan-100">
          {icon}
        </div>
        <div>
          <p className="font-medium text-white">{label}</p>
          <p className="text-sm text-white/52">{value}</p>
        </div>
      </div>
      <ArrowUpRight
        size={18}
        className="text-white/45 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-white"
      />
    </Link>
  );
}
