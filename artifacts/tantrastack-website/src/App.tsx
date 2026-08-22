import { type CSSProperties, type FormEvent, type ReactNode, useEffect, useRef, useState } from 'react';
import { ArrowUpRight, Bot, Boxes, Check, Code2, Instagram, Mail, Menu, MonitorSmartphone, PenTool, X } from 'lucide-react';
import { Route, Switch, useLocation, Router as WouterRouter } from 'wouter';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';

const queryClient = new QueryClient();
const navItems = [['About', 'about'], ['Services', 'services'], ['Products', 'products'], ['Our Work', 'work'], ['Founders', 'founders']] as const;
const hastkalaImg = `${import.meta.env.BASE_URL}Hastkala-work-dp.jpeg`;
const artwork = `${import.meta.env.BASE_URL}tantrastack-artwork.jpeg`;

function Reveal({ children, className = '' }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    // If already in view on mount (e.g. above-the-fold or quick scroll), show immediately
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { node.classList.add('visible'); observer.disconnect(); }
    }, { threshold: .12 });
    observer.observe(node);
    // Fallback: make visible after 1.2s regardless, so content never stays hidden (SEO/a11y)
    const fallback = setTimeout(() => { node.classList.add('visible'); observer.disconnect(); }, 1200);
    return () => { observer.disconnect(); clearTimeout(fallback); };
  }, []);
  return <div ref={ref} className={`reveal ${className}`}>{children}</div>;
}

const nodeInfo: Record<string, [string, string, string, string]> = {
  JS: ['Logic', 'JavaScript', 'The interaction layer — motion, state, events and the living behavior of the experience.', '#ffe34d'],
  TS: ['Precision', 'TypeScript', 'The precision layer — stronger structure, safer interfaces and predictable system behavior.', '#3f8cff'],
  PY: ['Intelligence', 'Python', 'The intelligence layer — automation, data workflows, services and computational power.', '#ffe34d'],
  SQL: ['Memory', 'SQL', 'The memory layer — structured data, relationships, queries and persistent system knowledge.', '#ff9b12'],
  API: ['Connection', 'API', 'The connection layer — clean interfaces that let every part of the stack communicate.', '#29e8bd'],
  CSS: ['Interface', 'CSS', 'The visual layer — composition, motion, responsive behavior and the final experience.', '#4e8fff'],
  GIT: ['Versioning', 'Git', 'The evolution layer — collaboration, history and controlled changes across the system.', '#ff5337'],
  DB: ['Data', 'Database', 'The foundation of information — the place where structured application knowledge lives.', '#a98cff'],
};

function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<string | null>(null);
  const [snapshotPosition, setSnapshotPosition] = useState({ x: 0, y: 0 });
  const [pointer, setPointer] = useState({ x: '50%', y: '50%' });
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    let frame = 0;
    const move = (event: PointerEvent) => {
      if (active) return;
      const x = (event.clientX / window.innerWidth - .5) * 14;
      const y = (event.clientY / window.innerHeight - .5) * 10;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => { stage.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`; });
    };
    window.addEventListener('pointermove', move, { passive: true });
    return () => { window.removeEventListener('pointermove', move); cancelAnimationFrame(frame); };
  }, [active]);
  const choose = (key: string, element: HTMLButtonElement) => {
    const rect = element.getBoundingClientRect();
    setActive(key); setSnapshotPosition({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
    setPointer({ x: `${rect.left + rect.width / 2}px`, y: `${rect.top + rect.height / 2}px` });
  };
  const reset = () => { setActive(null); if (stageRef.current) stageRef.current.style.transform = 'translate(-50%,-50%)'; };
  const selected = active ? nodeInfo[active] : null;
  return (
    <section className={`hero ${active ? 'focused' : ''}`} id="hero" ref={heroRef} onKeyDown={(event) => event.key === 'Escape' && reset()}>
      <div className="hero-copy">
        <span className="eyebrow">Technology solutions / 01</span>
        <h1 className="display">Technology that works for your business.</h1>
        <p>Practical, modern, and scalable digital solutions — built around the way your business actually works.</p>
        <div className="hero-actions">
          <a className="button-primary" href="#contact" data-testid="link-start-project">Start a Project <ArrowUpRight size={15} /></a>
          <a className="button-secondary" href="#work" data-testid="link-explore-work">Explore Our Work</a>
        </div>
      </div>
      <div className="stage" id="stage" ref={stageRef} onMouseLeave={reset}>
        <div className="halo" />
        <img className="art" src={artwork} alt="TantraStack technology stack artwork" />
        {Object.keys(nodeInfo).map((key) => <button key={key} className={`node ${key.toLowerCase()} ${active === key ? 'selected' : ''}`} data-key={key} aria-label={`Explore ${nodeInfo[key][1]}`} onMouseEnter={(event) => choose(key, event.currentTarget)} onFocus={(event) => choose(key, event.currentTarget)} onClick={(event) => choose(key, event.currentTarget)} />)}
      </div>
      <div className="vignette" />
      <div className="focus" style={{ '--x': pointer.x, '--y': pointer.y } as CSSProperties}><div className="focus-ring" style={{ '--x': pointer.x, '--y': pointer.y, '--accent': selected?.[3] ?? '#2be7bd' } as CSSProperties} /></div>
      <div className={`snapshot ${active ? 'show' : ''}`} style={{ left: snapshotPosition.x > window.innerWidth * .7 ? snapshotPosition.x - 220 : snapshotPosition.x, top: snapshotPosition.y, '--accent': selected?.[3] ?? '#2be7bd' } as CSSProperties}>
        <button onClick={reset} aria-label="Close technology detail" data-testid="button-close-node"><X size={14} /></button>
        <div className="tiny">{selected?.[0] ?? 'Node'}</div><h2>{selected?.[1] ?? 'Technology'}</h2><p>{selected?.[2] ?? 'Explore the layers behind a thoughtful digital product.'}</p>
      </div>
      <div className="hero-scroll"><i /> Scroll to explore</div>
    </section>
  );
}

function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => { const handler = () => setScrolled(window.scrollY > 35); window.addEventListener('scroll', handler, { passive: true }); return () => window.removeEventListener('scroll', handler); }, []);
  const close = () => setOpen(false);
  return <>
    <header className={`topbar ${scrolled ? 'scrolled' : ''}`}><div className="container nav-inner">
      <a href="#hero" className="wordmark" aria-label="TantraStack home" data-testid="link-brand">Tantra<span>Stack</span></a>
      <nav className="nav-links" aria-label="Primary navigation">{navItems.map(([label, id]) => <a key={id} href={`#${id}`} className="nav-link" data-testid={`link-nav-${id}`}>{label}</a>)}</nav>
      <a href="#contact" className="nav-cta" data-testid="link-nav-contact">Start a Project <ArrowUpRight size={14} /></a>
      <button className="menu-toggle" aria-label={open ? 'Close menu' : 'Open menu'} onClick={() => setOpen(!open)} data-testid="button-menu">{open ? <X size={18} /> : <Menu size={18} />}</button>
    </div></header>
    {open && <nav className="mobile-nav" aria-label="Mobile navigation">{[...navItems, ['Contact', 'contact'] as const].map(([label, id]) => <a key={id} href={`#${id}`} onClick={close} data-testid={`link-mobile-${id}`}>{label}</a>)}</nav>}
  </>;
}

const services = [
  { icon: MonitorSmartphone, title: 'Web Development', text: 'Modern, responsive, and professional websites that establish your identity online.', items: ['Business Websites', 'Portfolio Websites', 'E-commerce Websites', 'Landing Pages', 'Custom Web Applications', 'Business Dashboards'] },
  { icon: Boxes, title: 'ERP & Business Management', text: 'Bring important operations into one connected digital ecosystem, customized to your workflow.', items: ['Inventory Management', 'Sales Management', 'Customer Management', 'Billing & Invoicing', 'Reporting', 'Role-Based Access'] },
  { icon: Code2, title: 'Custom Software Solutions', text: 'Software designed specifically around your processes, users, requirements, and goals.', items: ['Digitize Workflows', 'Manage Information', 'Improve Productivity', 'Better Experiences'] },
  { icon: Bot, title: 'AI & Automation', text: 'Find where AI can actually create value — reducing repetitive work and supporting decisions.', items: ['AI-Powered Applications', 'Intelligent Dashboards', 'Data-Driven Solutions', 'Intelligent Business Tools'] },
  { icon: PenTool, title: 'UI/UX & Digital Experiences', text: 'Clean, intuitive, responsive experiences that help people use powerful products comfortably.', items: ['Simple Interfaces', 'Clear Experiences', 'Better Products'] },
];

function About() {
  return <section className="light-section section-pad" id="about"><div className="container about-grid"><Reveal><span className="eyebrow">About us / 02</span><h2 className="display about-lede">We build.<br /><em>We solve.</em><br />We transform.</h2></Reveal><Reveal className="about-body"><p className="body-copy">TantraStack is a technology-driven venture founded by two Computer Science engineers, <strong>Maitri and Priyal</strong>, with a shared vision of using technology to solve real-world problems.</p><p className="body-copy">We believe technology should make businesses <strong>simpler, smarter, and more efficient</strong> — not more complicated.</p><p className="body-copy">Every business has its own way of working. That's why we don't believe in forcing businesses into rigid, one-size-fits-all software. Instead, we understand the problem, study the workflow, identify the right technology, and build a solution around the actual needs of the business.</p><div className="philosophy"><strong>Technology should adapt to the business — not the business to the technology.</strong><small>Our philosophy</small></div></Reveal></div></section>;
}

function Services() {
  return <section className="services-section" id="services"><div className="container"><Reveal className="section-intro"><div><span className="eyebrow">What we do / 03</span><h2 className="display section-title">Technology.<br /><span className="violet">Tailored to you.</span></h2></div><p className="body-copy">Technology solutions designed around your business, your users, and your goals.</p></Reveal><div className="service-grid">{services.map(({ icon: Icon, title, text, items }, index) => <Reveal key={title}><article className="service-card" data-testid={`card-service-${index}`}><span className="service-tag">0{index + 1}</span><Icon className="service-icon" size={25} strokeWidth={1.6} /><h3>{title}</h3><p>{text}</p><ul>{items.map((item) => <li key={item}>{item}</li>)}</ul></article></Reveal>)}</div></div></section>;
}

const modules = [['Dashboard', 'Centralized insights and analytics.'], ['Customers', 'Information and interactions in one place.'], ['Inventory', 'Products, stock levels, and movements.'], ['Sales', 'Sales processes and transactions.'], ['Purchases', 'Purchasing and supplier information.'], ['Employees', 'Employee information and workflows.'], ['Orders', 'From initiation to completion.'], ['Reports & Analytics', 'Turn data into useful insights.'], ['Role-Based Access', 'Control what users can manage.']];
function Products() {
  return <section className="dark-section" id="products"><div className="container product-section"><div className="product-grid"><Reveal className="product-copy"><span className="eyebrow">Our products / 04</span><h2 className="display section-title">Products built for <span className="violet">real-world problems.</span></h2><p className="body-copy">We don't only build solutions for clients. We are also working toward building our own technology products that can solve practical business problems.</p><div className="product-badge">Under Development</div></Reveal><Reveal><div className="module-panel"><div className="module-panel-head"><span>TantraStack ERP</span><span>Developing modules</span></div><div className="module-grid">{modules.map(([name, detail]) => <div className="module" key={name}><span className="module-name">{name}</span><span className="module-detail">{detail}</span></div>)}</div></div></Reveal></div></div><div className="container custom-section"><Reveal className="custom-callout"><div><span className="section-kicker">Custom business solutions</span><h2 className="display">Sometimes you don't need another product.<br /><span>You need your product.</span></h2></div><div><p className="body-copy">Every organization has unique challenges. A customized dashboard, internal management system, workflow application, reporting platform, or business tool can sometimes make a bigger difference than adopting a generic solution.</p><p className="body-copy">TantraStack works with businesses to understand these challenges and develop technology specifically around them.</p><a className="button-secondary" href="#contact" data-testid="link-custom-solutions">From idea to implementation <ArrowUpRight size={14} /></a><div className="status-available" style={{ marginTop: 22 }}>Available for development</div></div></Reveal></div></section>;
}

function Work() {
  return <section className="dark-section work-section" id="work"><div className="container"><Reveal className="work-header"><div><span className="eyebrow">Our work / 05</span><h2 className="display section-title">Turning ideas into <span className="accent">working products.</span></h2></div><p className="body-copy">We believe our work speaks louder than promises. Every project is an opportunity to understand a real problem and create something useful.</p></Reveal><Reveal><article className="work-card"><div className="work-art work-art--hastkala"><img src={hastkalaImg} alt="Hastkala by Siddhi website — jewellery and craft brand built by TantraStack" /><span className="work-art-label">Client project / 01</span></div><div className="work-detail"><div><span className="work-index">01 — HASTKALA BY SIDDHI</span><h3>A digital presence for a growing brand.</h3><p>Hastkala by Siddhi is a client project for which TantraStack developed a dedicated website to establish and strengthen the brand's digital presence. The website provides a professional online platform where customers can explore its offerings and connect with the business.</p><div className="project-meta"><div><span>Client</span><strong>Hastkala by Siddhi</strong></div><div><span>Category</span><strong>Business Website</strong></div><div><span>Service</span><strong>Web Development</strong></div></div></div><a className="project-link" href="https://hastkalabysiddhi.up.railway.app/" target="_blank" rel="noreferrer" data-testid="link-hastkala">View Hastkala by Siddhi <ArrowUpRight size={15} /></a></div></article></Reveal></div></section>;
}

const reasons = [['Business-First Thinking', 'Before building anything, we focus on understanding your business, your workflow, your users, and your actual problem.'], ['Customized Solutions', "We don't believe every business needs the same software. We build solutions around individual requirements."], ['Modern Technology', 'We use modern development practices and technologies to create solutions that are responsive, maintainable, and designed with scalability in mind.'], ['From Idea to Deployment', 'We help transform an idea from an initial concept into a functional digital product.'], ['Continuous Learning', 'Technology evolves every day. So do we. We continuously explore new technologies, development practices, AI capabilities, and better ways to solve problems.'], ['Young. Technical. Driven.', 'We are a young technology venture with an engineering mindset and a strong desire to learn, experiment, build, and create.']];
const steps = [['01', 'Understand', 'We begin by understanding your business, requirements, users, and the problem you want to solve.', 'We listen before we build.'], ['02', 'Plan', 'We define the requirements, functionality, technology, scope, and development roadmap.', 'A clear problem deserves a clear plan.'], ['03', 'Design', 'We structure the product and user experience before development begins.', 'We think about the experience, not just the interface.'], ['04', 'Build', 'We turn the approved concept into a functional digital product.', 'Ideas become technology.'], ['05', 'Test', 'We test functionality, responsiveness, usability, and reliability.', 'Because working is not enough. It needs to work well.'], ['06', 'Launch', 'Once the product is ready, we deploy it and make it accessible to its users.', 'From development environment to the real world.'], ['07', 'Evolve', 'Technology should grow with the business. We can continue improving, expanding, and adapting solutions as requirements evolve.', "Launch is not the end. It's the beginning."]];
function WhyAndProcess() {
  return <><section className="why-section"><div className="container why-grid"><Reveal className="why-intro"><span className="eyebrow">Why TantraStack / 06</span><h2 className="display section-title">More than just <span className="violet">development.</span></h2><p className="body-copy">Choosing a technology partner is not only about choosing someone who can write code. It's about choosing someone who can <strong>understand the problem behind the code.</strong></p></Reveal><div className="why-list">{reasons.map(([title, text], index) => <Reveal key={title}><div className="why-item"><span className="why-num">0{index + 1}</span><div><h3>{title}</h3><p>{text}</p></div></div></Reveal>)}</div></div></section><section className="process-section"><div className="container"><Reveal className="process-head"><div><span className="eyebrow">How we work / 07</span><h2 className="display section-title">From idea to <span className="violet">impact.</span></h2></div><span className="section-kicker">A considered process</span></Reveal><div className="process-track">{steps.map(([number, title, text, quote]) => <Reveal key={number} className="process-step"><span className="process-index">{number}</span><h3>{title}</h3><p>{text}</p><span className="process-quote">{quote}</span></Reveal>)}</div></div></section></>;
}

const audiences = [['Startups', 'Turn your idea into a digital product and establish your technology foundation from the beginning.'], ['Small Businesses', 'Move away from scattered spreadsheets and manual processes toward connected digital systems.'], ['Growing Businesses', 'Digitize workflows, automate repetitive processes, and create systems that can grow with you.'], ['Established Organizations', 'Develop customized applications, dashboards, automation systems, and digital tools around existing processes.'], ['Entrepreneurs', "Have an idea but don't know where to start? Let's turn the idea into something tangible."]];
function Vision() {
  return <><section className="audience-section"><div className="container"><Reveal className="audience-head"><div><span className="eyebrow">Who we work with / 08</span><h2 className="display section-title">Built for businesses <span className="accent">at every stage.</span></h2></div><p className="body-copy">Technology should meet you where you are — and grow with where you are going.</p></Reveal><div className="audience-list">{audiences.map(([title, text]) => <div className="audience-row" key={title}><h3>{title}</h3><p>{text}</p><ArrowUpRight size={17} /></div>)}</div></div></section><section className="vision-section"><div className="container vision-grid"><Reveal className="vision-card"><span className="eyebrow">Our vision / 09</span><h2 className="display">Technology should be <span className="violet">accessible</span> to every business.</h2><p>We envision TantraStack becoming a technology company that helps businesses of different sizes <strong>digitize, automate, innovate, and grow.</strong></p><p style={{ marginTop: 16 }}>We want to make modern technology more accessible to businesses that may not have large technology teams or massive development budgets.</p><p style={{ marginTop: 16 }}>Our long-term vision is to build a portfolio of software products, ERP platforms, AI-powered solutions, and business technologies that solve meaningful real-world problems.</p></Reveal><Reveal className="vision-card"><span className="eyebrow">Our mission / 10</span><h2 className="display">Turn business problems into <span className="violet">technology solutions.</span></h2><ul className="mission-list">{['Build technology around real business requirements.', 'Make digital transformation more accessible.', 'Develop practical and scalable software.', 'Help businesses reduce manual processes.', 'Create products that solve real problems.', 'Explore the potential of AI and automation.', 'Continuously learn, experiment, and innovate.', 'Build long-term relationships with the businesses we work with.'].map((item) => <li key={item}><Check size={15} />{item}</li>)}</ul></Reveal></div></section></>;
}

function Founders() {
  return <section className="founders-section" id="founders"><div className="container"><Reveal className="founders-header"><div><span className="eyebrow">Meet the founders / 11</span><h2 className="display section-title">Two founders.<br /><span className="accent">One vision.</span></h2></div><p>Two Computer Science engineers united by a passion for technology, innovation, and building solutions that create real-world value.</p></Reveal><div className="founder-grid"><Reveal><article className="founder-card"><div className="founder-mark" aria-hidden="true">MM</div><h3>Maitri</h3><span className="founder-role">Co-Founder & Technology / Product</span><p>Maitri is a Computer Science engineering student with a strong passion for technology, software development, product building, and solving real-world problems through innovative digital solutions.</p><p>As a co-founder of TantraStack, Maitri plays an important role in shaping the company's technical direction, developing products, understanding client requirements, and transforming ideas into practical, working solutions.</p><p>She brings a combination of technical curiosity, creativity, problem-solving ability, product thinking, and an eagerness to learn and experiment. At TantraStack, she contributes throughout the product journey — from understanding an idea and planning functionality to development, refinement, and transforming concepts into products that can create real value.</p><div className="founder-philosophy">“Build technology that solves a problem, creates value, and makes a difference.”</div></article></Reveal><Reveal><article className="founder-card"><div className="founder-mark" aria-hidden="true">PN</div><h3>Priyal</h3><span className="founder-role">Co-Founder & Technology / Product</span><p>Priyal is a Computer Science engineering student with a strong interest in Artificial Intelligence, Machine Learning, software development, research, and technology-driven problem solving.</p><p>As a co-founder of TantraStack, Priyal focuses on translating ideas and business challenges into practical technology solutions while exploring how software, AI, automation, and modern development practices can create meaningful impact.</p><p>She brings a research-oriented mindset, analytical thinking, technical curiosity, attention to detail, and a passion for exploring emerging technologies. At TantraStack, she contributes to product strategy, technical development, research, documentation, problem solving, and exploring new opportunities for innovation.</p><div className="founder-philosophy">“Understand the problem deeply. Build the solution thoughtfully.”</div></article></Reveal></div><Reveal className="together"><span className="eyebrow">Together</span><h2 className="display">Different strengths.<br /><span className="accent">One direction.</span></h2><p>Maitri and Priyal bring different strengths to TantraStack, but share the same belief:</p><strong>Technology becomes meaningful when it solves a real problem.</strong><p style={{ marginTop: 21 }}>Development · Product Thinking · Research · Problem Solving · Innovation · AI & Emerging Technology</p></Reveal></div></section>;
}

const budgetRanges = ['Under ₹25,000', '₹25,000 – ₹50,000', '₹50,000 – ₹1,00,000', '₹1,00,000 – ₹2,50,000', '₹2,50,000+', 'Not sure yet'];
const projectTypes = ['Website', 'Web App', 'Mobile App', 'ERP / Business Software', 'AI / Automation', 'UI/UX Design', 'Other'];

function Contact() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const formRef = useRef<HTMLFormElement>(null);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);

    // Honeypot check — if the hidden field is filled, silently abort
    if (data.get('website_url')) { setStatus('success'); return; }

    const name = (data.get('name') as string).trim();
    const email = (data.get('email') as string).trim();
    const message = (data.get('message') as string).trim();

    if (!name || !email || !message) {
      setErrorMsg('Please fill in your name, email, and message.');
      return;
    }
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!emailOk) { setErrorMsg('Please enter a valid email address.'); return; }

    setStatus('sending');
    setErrorMsg('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          projectType: data.get('projectType') as string,
          budget: data.get('budget') as string,
          message,
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error((body as { error?: string }).error ?? 'Server error');
      }
      setStatus('success');
      form.reset();
    } catch (err) {
      setStatus('error');
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong. Please try again or email us directly.');
    }
  };

  return (
    <>
      <section className="contact-section" id="contact">
        <div className="container contact-grid">
          <Reveal className="contact-copy">
            <span className="eyebrow">Start a project / 12</span>
            <h2 className="display">Let's <span className="accent">build it.</span></h2>
            <p>You don't need to have everything figured out before reaching out. Maybe you need a website, an ERP, an automated process, a software product — or simply have a problem and aren't sure whether technology can solve it.</p>
            <p><strong>Tell us about it.</strong> We'll listen, understand the problem, and explore what we can build together.</p>
            <div className="contact-details">
              <div className="contact-detail"><Mail size={17} /><div><strong>Email</strong><a href="mailto:we.tantra.stack@gmail.com">we.tantra.stack@gmail.com</a></div></div>
              <div className="contact-detail"><Instagram size={17} /><div><strong>Instagram</strong><a href="https://instagram.com/tantrastack" target="_blank" rel="noreferrer">@tantrastack</a></div></div>
            </div>
          </Reveal>
          <Reveal>
            <form className="contact-form" ref={formRef} onSubmit={submit} noValidate>
              {/* Honeypot — hidden from real users, bots fill it in */}
              <div aria-hidden="true" style={{ position: 'absolute', left: '-9999px', width: 0, height: 0, overflow: 'hidden' }}>
                <label htmlFor="website_url">Leave this blank</label>
                <input id="website_url" name="website_url" type="text" tabIndex={-1} autoComplete="off" />
              </div>

              <div className="form-row">
                <div className="field">
                  <label htmlFor="name">Name <span className="field-required" aria-hidden="true">*</span></label>
                  <input id="name" name="name" required placeholder="Your name" data-testid="input-name" autoComplete="name" />
                </div>
                <div className="field">
                  <label htmlFor="email">Email <span className="field-required" aria-hidden="true">*</span></label>
                  <input id="email" type="email" name="email" required placeholder="your@email.com" data-testid="input-email" autoComplete="email" />
                </div>
              </div>

              <div className="form-row">
                <div className="field">
                  <label htmlFor="projectType">Project Type</label>
                  <select id="projectType" name="projectType" defaultValue="" data-testid="select-project-type">
                    <option value="" disabled>Select type</option>
                    {projectTypes.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div className="field">
                  <label htmlFor="budget">Budget Range</label>
                  <select id="budget" name="budget" defaultValue="" data-testid="select-budget">
                    <option value="" disabled>Select range</option>
                    {budgetRanges.map((b) => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>
              </div>

              <div className="field">
                <label htmlFor="message">Message <span className="field-required" aria-hidden="true">*</span></label>
                <textarea id="message" name="message" required placeholder="Tell us about your project, idea, or problem…" data-testid="textarea-message" />
              </div>

              {errorMsg && (
                <div className="form-error" role="alert">{errorMsg}</div>
              )}

              {status === 'success' ? (
                <div className="form-success" role="status">
                  <Check size={16} /> Thanks! We'll get back to you within 24 hours.
                </div>
              ) : (
                <button className="button-primary form-submit" type="submit" disabled={status === 'sending'} data-testid="button-send-inquiry">
                  {status === 'sending' ? 'Sending…' : 'Start a Project'} <ArrowUpRight size={15} />
                </button>
              )}
            </form>
          </Reveal>
        </div>
      </section>

      <footer className="footer">
        <div className="container">
          <div className="footer-top">
            <div className="footer-brand">
              <a href="#hero" className="wordmark" data-testid="link-footer-brand">Tantra<span>Stack</span></a>
              <p>Technology That Works for Your Business.</p>
            </div>
            <div className="footer-contact">
              <a href="mailto:we.tantra.stack@gmail.com" className="footer-email"><Mail size={13} />we.tantra.stack@gmail.com</a>
              <a href="#contact" className="nav-cta footer-cta" data-testid="link-footer-start">Start a Project <ArrowUpRight size={13} /></a>
            </div>
            <nav className="footer-nav" aria-label="Footer navigation">
              {(['About', 'Services', 'Our Work', 'Founders'] as const).map((label) => {
                const id = label === 'Our Work' ? 'work' : label.toLowerCase();
                return <a key={id} href={`#${id}`} data-testid={`link-footer-${id}`}>{label}</a>;
              })}
            </nav>
          </div>
          <div className="footer-bottom">
            <span>© 2026 TantraStack. All rights reserved.</span>
            <span>Built with curiosity. Driven by technology.</span>
          </div>
        </div>
      </footer>
    </>
  );
}

function Home() {
  useEffect(() => { document.title = 'TantraStack — Technology That Works for Your Business'; const description = document.querySelector('meta[name="description"]'); description?.setAttribute('content', 'TantraStack builds practical, modern, and scalable technology solutions for businesses.'); }, []);
  return <div className="site-shell"><Navigation /><main><Hero /><About /><Services /><Products /><Work /><WhyAndProcess /><Vision /><Founders /><Contact /></main></div>;
}
function Router() { return <RoutedErrorBoundary><Switch><Route path="/" component={Home} /><Route component={NotFound} /></Switch></RoutedErrorBoundary>; }
function RoutedErrorBoundary({ children }: { children: ReactNode }) { const [location] = useLocation(); return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>; }
function App() { return <QueryClientProvider client={queryClient}><TooltipProvider><WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}><Router /></WouterRouter><Toaster /></TooltipProvider></QueryClientProvider>; }
export default App;