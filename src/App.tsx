import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Check,
  Download,
  ExternalLink,
  Heart,
  Menu,
  RefreshCcw,
  Sparkles,
  X,
} from "lucide-react";

// Edita aquí la identidad y los enlaces oficiales de la iniciativa.
const SOCIAL_HANDLE = "@amor_envisto";
const SOCIAL_LINKS = {
  instagram: "https://www.instagram.com/amor_envisto?bqrl=MTlrdjJ6cG81b2NmOA%3D%3D&utm_source=qr",
  tiktok: "https://tiktok.com/@amorenvisto",
};

// Preguntas y respuestas de la fase de idealización.
const ILLUSION_QUESTIONS = [
  {
    eyebrow: "El paisaje",
    question: "¿Cómo imaginas el amor ideal?",
    options: ["Un refugio eterno", "Una aventura sin reglas", "Dos mundos que se eligen"],
  },
  {
    eyebrow: "La entrega",
    question: "¿Qué esperas cuando entregas el corazón?",
    options: ["Que me cuiden igual", "Que nunca se vayan", "Poder ser quien soy"],
  },
  {
    eyebrow: "La promesa",
    question: "Para ti, amar significa…",
    options: ["Crecer en compañía", "Fundirse por completo", "Elegirse cada día"],
  },
];

const FRACTURES = [
  {
    title: "Expectativas vs. realidad",
    note: "No todo lo imaginado podía sostenerse.",
    x: "12%",
    y: "17%",
    rotate: -15,
  },
  {
    title: "El silencio repentino",
    note: "A veces, el silencio también duele.",
    x: "61%",
    y: "10%",
    rotate: 13,
  },
  {
    title: "Conversaciones inconclusas",
    note: "Hay palabras que nunca llegaron a enviarse.",
    x: "37%",
    y: "39%",
    rotate: -3,
  },
  { title: "Dar de más", note: "Te fuiste dejando para después.", x: "9%", y: "65%", rotate: 10 },
  {
    title: "La distancia",
    note: "A veces soltar también es una forma de amor.",
    x: "63%",
    y: "65%",
    rotate: -11,
  },
];

const LESSON_SUGGESTIONS = [
  "Aprendí a poner límites",
  "Me elegí a mí",
  "Amar no es perderme",
  "Soltar también es cuidarme",
  "Merezco reciprocidad",
];

type Screen = "home" | "illusion" | "storm" | "workshop" | "result";

function InstagramIcon({ size = 18 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect width="18" height="18" x="3" y="3" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r=".5" fill="currentColor" stroke="none" />
    </svg>
  );
}

function GoldDust() {
  return (
    <div className="dust" aria-hidden="true">
      {Array.from({ length: 18 }, (_, i) => (
        <i key={i} style={{ "--i": i } as React.CSSProperties} />
      ))}
    </div>
  );
}

function Brand() {
  return (
    <button
      className="brand"
      onClick={() => window.dispatchEvent(new Event("restart-experience"))}
      aria-label="Ir al inicio"
    >
      <span className="brand-mark">
        <svg viewBox="0 0 48 44" aria-hidden="true">
          <defs><linearGradient id="brandRibbon" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#FF007F"/><stop offset="1" stopColor="#FFB5D8"/></linearGradient></defs>
          <path d="M24 38C15 31 5 23 5 14 5 6 14 2 21 8c2 2 3 4 4 6" />
          <path d="M24 38C33 30 43 22 43 14 43 6 34 2 27 8c-2 2-3 4-4 6" />
          <path d="M13 10C17 7 21 9 24 15c3 6 7 8 12 6" className="brand-ribbon-cross" />
        </svg>
      </span>
      <span>
        AMOR
        <br />
        EN VISTO
      </span>
    </button>
  );
}

function HeartArtwork({
  stage = 3,
  repaired = false,
  className = "",
}: {
  stage?: number;
  repaired?: boolean;
  className?: string;
}) {
  return (
    <svg className={`heart-art brand-heart ${repaired ? "is-repaired" : ""} ${className}`} viewBox="0 0 420 390" role="img" aria-label="Corazón entrelazado de Amor en Visto">
      <defs>
        <linearGradient id="ribbonPink" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#FF007F" />
          <stop offset="1" stopColor="#D90069" />
        </linearGradient>
        <linearGradient id="ribbonSoft" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#FFD0E5" />
          <stop offset="1" stopColor="#FFB5D8" />
        </linearGradient>
        <filter id="ribbonGlow"><feGaussianBlur stdDeviation="7" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      </defs>
      <path className="heart-ribbon heart-ribbon-pink" d="M210 319C151 272 73 207 73 130C73 75 125 39 174 61C199 72 211 96 220 117" />
      <path className="heart-ribbon heart-ribbon-soft" d="M210 319C271 270 347 207 347 130C347 75 295 39 246 61C221 72 209 96 200 117" />
      <path className="heart-ribbon heart-ribbon-cross" d="M174 61C195 68 209 85 220 117C231 149 250 164 279 166" />
      <path className="heart-ribbon heart-ribbon-pink" d="M200 117C189 149 170 164 141 166" />
      <circle className="heart-break-dot" cx="279" cy="166" r="5" />
    </svg>
  );
}

function App() {
  const [screen, setScreen] = useState<Screen>("home");
  const [menuOpen, setMenuOpen] = useState(false);
  const [question, setQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [discovered, setDiscovered] = useState<number[]>([]);
  const [assembled, setAssembled] = useState<number[]>([]);
  const [activePiece, setActivePiece] = useState<number | null>(null);
  const [lessons, setLessons] = useState<string[]>(Array(5).fill(""));
  const [customLesson, setCustomLesson] = useState("");
  const mainRef = useRef<HTMLElement>(null);

  const reset = (goHome = true) => {
    setScreen(goHome ? "home" : "illusion");
    setQuestion(0);
    setAnswers([]);
    setDiscovered([]);
    setAssembled([]);
    setLessons(Array(5).fill(""));
    setActivePiece(null);
    setMenuOpen(false);
  };

  useEffect(() => {
    const restart = () => reset(true);
    window.addEventListener("restart-experience", restart);
    return () => window.removeEventListener("restart-experience", restart);
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    mainRef.current?.focus();
  }, [screen]);

  const archetype = useMemo(() => {
    const score = answers.reduce((a, b) => a + b, 0);
    if (score <= 2) return "Arquitecto de Sueños";
    if (score <= 4) return "Alquimista del Duelo";
    return "Corazón Despierto";
  }, [answers]);

  const chooseAnswer = (option: number) => {
    const next = [...answers];
    next[question] = option;
    setAnswers(next);
  };

  const nextQuestion = () => {
    if (question < ILLUSION_QUESTIONS.length - 1) setQuestion(question + 1);
    else setScreen("storm");
  };

  const selectLesson = (value: string) => {
    if (activePiece === null || !value.trim()) return;
    const next = [...lessons];
    next[activePiece] = value.trim();
    setLessons(next);
    setAssembled((prev) => [...new Set([...prev, activePiece])]);
    setActivePiece(null);
    setCustomLesson("");
  };

  const downloadCard = () => {
    const canvas = document.createElement("canvas");
    canvas.width = 1080;
    canvas.height = 1920;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const bg = ctx.createLinearGradient(0, 0, 1080, 1920);
    bg.addColorStop(0, "#FDFBF7");
    bg.addColorStop(1, "#F5E6D3");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, 1080, 1920);
    ctx.strokeStyle = "#FFB5D8";
    ctx.lineWidth = 2;
    ctx.strokeRect(54, 54, 972, 1812);
    ctx.textAlign = "center";
    ctx.fillStyle = "#FF007F";
    ctx.font = "500 26px Arial";
    ctx.fillText("AMOR EN VISTO", 540, 145);
    ctx.fillStyle = "#1D163B";
    ctx.font = "italic 66px Georgia";
    ctx.fillText("Mi historia", 540, 275);
    ctx.fillText("también merece ser escuchada", 540, 350);
    drawCanvasHeart(ctx, 540, 820, 1.75);
    ctx.fillStyle = "#1D163B";
    ctx.font = "500 23px Arial";
    ctx.fillText("LO QUE ME LLEVO", 540, 1320);
    ctx.fillStyle = "#1D163B";
    ctx.font = "italic 58px Georgia";
    ctx.fillText(archetype, 540, 1390);
    ctx.strokeStyle = "#FFB5D8";
    ctx.beginPath();
    ctx.moveTo(410, 1450);
    ctx.lineTo(670, 1450);
    ctx.stroke();
    const lesson = lessons.find(Boolean) || "De cada grieta también nace luz.";
    ctx.font = "italic 36px Georgia";
    wrapText(ctx, `“${lesson}”`, 540, 1535, 780, 50);
    ctx.fillStyle = "#FF007F";
    ctx.font = "500 27px Arial";
    ctx.fillText(SOCIAL_HANDLE, 540, 1765);
    ctx.fillStyle = "#1D163B";
    ctx.font = "22px Arial";
    ctx.fillText("#AmorEnVisto", 540, 1810);
    const link = document.createElement("a");
    link.download = "mi-historia-amor-en-visto.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <div className={`app-shell theme-${screen}`}>
      <GoldDust />
      <header className="site-header">
        <Brand />
        <nav className="desktop-nav" aria-label="Navegación principal">
          <button
            onClick={() =>
              document.getElementById("dinamica")?.scrollIntoView({ behavior: "smooth" })
            }
          >
            La dinámica
          </button>
          <a href={SOCIAL_LINKS.instagram} target="_blank" rel="noreferrer">
            Comunidad <ExternalLink size={13} />
          </a>
          {screen !== "home" && (
            <button onClick={() => reset(false)}>
              <RefreshCcw size={14} /> Reiniciar
            </button>
          )}
        </nav>
        <button
          className="menu-btn"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Abrir menú"
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X /> : <Menu />}
        </button>
        {menuOpen && (
          <div className="mobile-nav">
            <button
              onClick={() => {
                setScreen("home");
                setMenuOpen(false);
                setTimeout(() => document.getElementById("dinamica")?.scrollIntoView(), 50);
              }}
            >
              Cómo participar
            </button>
            <a href={SOCIAL_LINKS.instagram} target="_blank" rel="noreferrer">
              Visitar la comunidad
            </a>
            <button onClick={() => reset(false)}>Reiniciar experiencia</button>
          </div>
        )}
      </header>

      <main ref={mainRef} tabIndex={-1}>
        {screen === "home" && <Home onStart={() => reset(false)} />}
        {screen === "illusion" && (
          <IllusionPhase
            question={question}
            selected={answers[question]}
            onSelect={chooseAnswer}
            onNext={nextQuestion}
            onBack={() => (question > 0 ? setQuestion(question - 1) : setScreen("home"))}
          />
        )}
        {screen === "storm" && (
          <StormPhase
            discovered={discovered}
            onDiscover={(i) => setDiscovered((prev) => [...new Set([...prev, i])])}
            onNext={() => setScreen("workshop")}
          />
        )}
        {screen === "workshop" && (
          <WorkshopPhase
            assembled={assembled}
            activePiece={activePiece}
            lessons={lessons}
            customLesson={customLesson}
            onCustomLesson={setCustomLesson}
            onPiece={setActivePiece}
            onClose={() => setActivePiece(null)}
            onLesson={selectLesson}
            onFinish={() => setScreen("result")}
          />
        )}
        {screen === "result" && (
          <Result
            archetype={archetype}
            lesson={lessons.find(Boolean) || "Me elegí a mí"}
            onDownload={downloadCard}
            onReset={() => reset(false)}
          />
        )}
      </main>
      <footer className="site-footer">
        <Brand />
        <p>Un espacio para hablar del amor con honestidad.</p>
        <div>
          <a href={SOCIAL_LINKS.instagram} target="_blank" rel="noreferrer">
            <InstagramIcon size={17} /> {SOCIAL_HANDLE}
          </a>
          <button onClick={() => reset(false)}>Reiniciar dinámica</button>
        </div>
      </footer>
    </div>
  );
}

function Home({ onStart }: { onStart: () => void }) {
  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">
            <Sparkles size={14} /> Empatía · Catarsis · Realidad digital
          </p>
          <h1>
            AMOR
            <br />
            <em>EN VISTO</em>
          </h1>
          <p className="hero-lead">
            A veces una conversación se queda en visto. Aquí, cada historia merece ser escuchada, cada emoción tiene un lugar y ningún corazón tiene que fingir que está bien.
          </p>
          <div className="hero-actions">
            <button className="primary-btn" onClick={onStart}>
              Iniciar la experiencia <ArrowRight size={18} />
            </button>
            <a
              className="secondary-btn"
              href={SOCIAL_LINKS.instagram}
              target="_blank"
              rel="noreferrer"
            >
              <InstagramIcon size={18} /> Únete en redes
            </a>
          </div>
        </div>
        <div className="hero-visual">
          <span className="orbit-label label-a">ILUSIONARSE</span>
          <span className="orbit-label label-b">QUEDAR EN VISTO</span>
          <span className="orbit-label label-c">VOLVER A TI</span>
          <HeartArtwork stage={3} repaired />
          <div className="vertical-note">EMPATÍA · CATARSIS · REALIDAD DIGITAL</div>
        </div>
        <button
          className="scroll-hint"
          onClick={() =>
            document.getElementById("manifiesto")?.scrollIntoView({ behavior: "smooth" })
          }
        >
          Descubre el espacio <ArrowDown size={16} />
        </button>
      </section>

      <section className="manifesto" id="manifiesto">
        <p className="section-index">01 — MANIFIESTO</p>
        <div>
          <h2>
            Lo que duele
            <br />
            también se cuenta.
          </h2>
          <p>Aquí te escuchamos.</p>
        </div>
        <blockquote>
          “No todas las historias tienen respuesta, pero todas merecen ser escuchadas.”
        </blockquote>
      </section>

      <section className="dynamic-section" id="dinamica">
        <div className="section-heading">
          <p className="eyebrow">Un espacio para hablar sin filtros</p>
          <h2>
            Hablemos
            <br />
            <em>de amor</em>
          </h2>
        </div>
        <div className="steps-grid">
          {[
            [
              "01",
              "Explora tu historia",
              "Recorre tus expectativas, reconoce lo que dolió y encuentra palabras para contar tu historia.",
            ],
            [
              "02",
              "Pon tu historia en palabras",
              `Descarga tu reflexión, compártela y abre una conversación con #AmorEnVisto.`,
            ],
            [
              "03",
              "Conversa en comunidad",
              "Escucha otras experiencias y descubre que no estás a solas con lo que sientes.",
            ],
          ].map(([n, title, text], i) => (
            <article className="step-card" key={n}>
              <div className="step-top">
                <span>{n}</span>
                {i === 2 ? <InstagramIcon size={18} /> : <Sparkles size={18} />}
              </div>
              <h3>{title}</h3>
              <p>{text}</p>
              {i === 2 && (
                <a href={SOCIAL_LINKS.instagram} target="_blank" rel="noreferrer">
                  Visitar el perfil <ArrowRight size={15} />
                </a>
              )}
            </article>
          ))}
        </div>
      </section>
      <section className="home-cta">
        <Heart size={28} />
        <h2>
          ¿Qué se quedó
          <br />
          sin decir?
        </h2>
        <button className="primary-btn" onClick={onStart}>
          Contar mi historia <ArrowRight size={18} />
        </button>
      </section>
    </>
  );
}

function Progress({ phase, label }: { phase: number; label: string }) {
  return (
    <div className="phase-progress">
      <span>FASE 0{phase} / 03</span>
      <div>
        <i style={{ width: `${phase * 33.333}%` }} />
      </div>
      <span>{label}</span>
    </div>
  );
}

function IllusionPhase({
  question,
  selected,
  onSelect,
  onNext,
  onBack,
}: {
  question: number;
  selected?: number;
  onSelect: (i: number) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const item = ILLUSION_QUESTIONS[question];
  return (
    <section className="experience phase-illusion">
      <Progress phase={1} label="LO QUE IMAGINAMOS" />
      <button className="back-btn" onClick={onBack}>
        <ArrowLeft size={16} /> Atrás
      </button>
      <div className="phase-grid">
        <div className="phase-visual">
          <p className="floating-copy">
            Todo comienza
            <br />
            con lo que esperamos.
          </p>
          <HeartArtwork stage={question + (selected !== undefined ? 1 : 0)} />
          <span className="visual-count">0{question + 1}</span>
        </div>
        <div className="question-panel" key={question}>
          <p className="eyebrow">
            {item.eyebrow} · Pregunta {question + 1} de 3
          </p>
          <h2>{item.question}</h2>
          <div className="options">
            {item.options.map((option, i) => (
              <button
                key={option}
                className={selected === i ? "selected" : ""}
                onClick={() => onSelect(i)}
              >
                <span>{String.fromCharCode(65 + i)}</span>
                {option}
                {selected === i && <Check size={18} />}
              </button>
            ))}
          </div>
          <button className="primary-btn" disabled={selected === undefined} onClick={onNext}>
            {question === 2 ? "Avanzar hacia la realidad" : "Continuar"} <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </section>
  );
}

function StormPhase({
  discovered,
  onDiscover,
  onNext,
}: {
  discovered: number[];
  onDiscover: (i: number) => void;
  onNext: () => void;
}) {
  return (
    <section className="experience phase-storm">
      <Progress phase={2} label="LO QUE QUEDÓ EN VISTO" />
      <div className="storm-heading">
        <p className="eyebrow">Cuando la imagen se encuentra con lo real</p>
        <h2>
          Y entonces,
          <br />
          <em>algo se rompió.</em>
        </h2>
        <p>Toca cada fragmento. Atrévete a mirar lo que dejó.</p>
      </div>
      <div className="fragments-stage">
        <div className="rain" aria-hidden="true" />
        {FRACTURES.map((fragment, i) => (
          <button
            key={fragment.title}
            className={`fragment fragment-${i} ${discovered.includes(i) ? "revealed" : ""}`}
            style={{
              left: fragment.x,
              top: fragment.y,
              transform: `rotate(${fragment.rotate}deg)`,
            }}
            onClick={() => onDiscover(i)}
            onMouseEnter={() => onDiscover(i)}
            aria-label={`Descubrir fragmento: ${fragment.title}`}
          >
            <span className="fragment-shape">
              {discovered.includes(i) ? <Check /> : <span>{i + 1}</span>}
            </span>
            <span className="fragment-text">
              <strong>{fragment.title}</strong>
              <small>{fragment.note}</small>
            </span>
          </button>
        ))}
        <div className="storm-center">
          <span>{discovered.length}</span>/ 5<br />
          <small>
            FRAGMENTOS
            <br />
            REVELADOS
          </small>
        </div>
      </div>
      <div className="phase-bottom">
        <p>
          {discovered.length < 5
            ? `Aún quedan ${5 - discovered.length} historias por descubrir.`
            : "Ya escuchaste todas las historias. Es momento de reconocer lo que te dejaron."}
        </p>
        <button className="primary-btn" disabled={discovered.length < 5} onClick={onNext}>
          Recoger los fragmentos <ArrowRight size={18} />
        </button>
      </div>
    </section>
  );
}

function WorkshopPhase(props: {
  assembled: number[];
  activePiece: number | null;
  lessons: string[];
  customLesson: string;
  onCustomLesson: (v: string) => void;
  onPiece: (i: number) => void;
  onClose: () => void;
  onLesson: (v: string) => void;
  onFinish: () => void;
}) {
  const complete = props.assembled.length === 5;
  return (
    <section className="experience phase-workshop">
      <Progress phase={3} label="LO QUE NOS DEJA LA HISTORIA" />
      <div className="workshop-heading">
        <p className="eyebrow">Reconstruir no es volver atrás</p>
        <h2>
          Elige con qué
          <br />
          <em>vas a unir tus partes.</em>
        </h2>
        <p>Toca cada fragmento y entrégale un aprendizaje.</p>
      </div>
      <div className={`assembly ${complete ? "complete" : ""}`}>
        <HeartArtwork stage={3} repaired={complete} />
        {FRACTURES.map(
          (_, i) =>
            !props.assembled.includes(i) && (
              <button
                key={i}
                className={`loose-piece loose-${i}`}
                onClick={() => props.onPiece(i)}
                aria-label={`Reparar fragmento ${i + 1}`}
              >
                <span>{i + 1}</span>
                <Sparkles size={16} />
              </button>
            ),
        )}
        {props.assembled.map((i) => (
          <span key={i} className={`placed-dot dot-${i}`}>
            <Check size={12} />
          </span>
        ))}
        {complete && (
          <div className="sealed-message">
            <Sparkles size={16} /> Cada historia deja algo en nosotros
          </div>
        )}
      </div>
      <div className="assembly-status">
        <strong>{props.assembled.length} / 5</strong>
        <span>
          APRENDIZAJES
          <br />
          INTEGRADOS
        </span>
      </div>
      {complete && (
        <button className="primary-btn finish-btn" onClick={props.onFinish}>
          Revelar mi corazón <ArrowRight size={18} />
        </button>
      )}
      {props.activePiece !== null && (
        <div
          className="lesson-overlay"
          role="dialog"
          aria-modal="true"
          aria-label="Elige un aprendizaje"
        >
          <div className="lesson-modal">
            <button className="modal-close" onClick={props.onClose} aria-label="Cerrar">
              <X />
            </button>
            <span className="modal-number">0{props.activePiece + 1}</span>
            <p className="eyebrow">Lo que aprendiste también importa</p>
            <h3>¿Qué te gustaría llevarte de esta experiencia?</h3>
            <div className="lesson-options">
              {LESSON_SUGGESTIONS.slice(0, 3).map((item) => (
                <button key={item} onClick={() => props.onLesson(item)}>
                  {item}
                  <ArrowRight size={15} />
                </button>
              ))}
            </div>
            <label>O escríbelo con tus palabras</label>
            <div className="custom-input">
              <input
                maxLength={65}
                value={props.customLesson}
                onChange={(e) => props.onCustomLesson(e.target.value)}
                placeholder="Hoy sé que…"
                autoFocus
              />
              <button
                disabled={!props.customLesson.trim()}
                onClick={() => props.onLesson(props.customLesson)}
                aria-label="Guardar aprendizaje"
              >
                <Check />
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

function Result({
  archetype,
  lesson,
  onDownload,
  onReset,
}: {
  archetype: string;
  lesson: string;
  onDownload: () => void;
  onReset: () => void;
}) {
  return (
    <section className="result-section">
      <div className="result-intro">
        <p className="eyebrow">
          <Sparkles size={14} /> Tu historia merece ser escuchada
        </p>
        <h2>
          No tienes que
          <br />
          tener todas las respuestas.
        </h2>
        <p>Lo que sentiste es válido. Gracias por darte el espacio de reconocerlo y ponerlo en palabras.</p>
      </div>
      <div className="share-card">
        <span className="card-brand">AMOR EN VISTO</span>
        <div className="card-title">
          Mi historia
          <br />
          <em>también merece ser escuchada</em>
        </div>
        <HeartArtwork stage={3} repaired />
        <div className="archetype">
          <span>LO QUE ME LLEVO</span>
          <strong>{archetype}</strong>
        </div>
        <blockquote>“{lesson}”</blockquote>
        <div className="card-social">
          {SOCIAL_HANDLE}
          <br />
          <span>#AmorEnVisto</span>
        </div>
      </div>
      <div className="result-actions">
        <button className="primary-btn" onClick={onDownload}>
          <Download size={18} /> Descargar tarjeta
        </button>
        <a className="social-btn" href={SOCIAL_LINKS.instagram} target="_blank" rel="noreferrer">
          <InstagramIcon size={18} /> Ir a {SOCIAL_HANDLE} <ExternalLink size={15} />
        </a>
        <button className="text-btn" onClick={onReset}>
          <RefreshCcw size={15} /> Volver a empezar
        </button>
        <p>Comparte tu reflexión y abre espacio para conversaciones más honestas sobre el amor.</p>
      </div>
    </section>
  );
}

function drawCanvasHeart(ctx: CanvasRenderingContext2D, cx: number, cy: number, scale: number) {
  ctx.save();
  ctx.translate(cx - 210 * scale, cy - 195 * scale);
  ctx.scale(scale, scale);
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.lineWidth = 23;
  const pink = ctx.createLinearGradient(70, 40, 220, 330);
  pink.addColorStop(0, "#FF007F");
  pink.addColorStop(1, "#D90069");
  const soft = ctx.createLinearGradient(220, 45, 350, 310);
  soft.addColorStop(0, "#FFD0E5");
  soft.addColorStop(1, "#FFB5D8");
  ctx.strokeStyle = soft;
  ctx.beginPath();
  ctx.moveTo(238, 65);
  ctx.bezierCurveTo(286, 28, 350, 65, 350, 123);
  ctx.bezierCurveTo(350, 178, 291, 235, 213, 310);
  ctx.stroke();
  ctx.strokeStyle = pink;
  ctx.beginPath();
  ctx.moveTo(207, 310);
  ctx.bezierCurveTo(135, 252, 70, 192, 70, 126);
  ctx.bezierCurveTo(70, 68, 132, 34, 183, 68);
  ctx.quadraticCurveTo(207, 84, 216, 106);
  ctx.stroke();
  ctx.strokeStyle = soft;
  ctx.lineWidth = 18;
  ctx.beginPath();
  ctx.moveTo(216, 106);
  ctx.quadraticCurveTo(239, 62, 278, 57);
  ctx.stroke();
  ctx.fillStyle = "#FF007F";
  ctx.beginPath();
  ctx.arc(291, 57, 5, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
) {
  const words = text.split(" ");
  let line = "";
  const lines: string[] = [];
  words.forEach((word) => {
    const test = `${line}${word} `;
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line);
      line = `${word} `;
    } else line = test;
  });
  lines.push(line);
  lines.forEach((l, i) => ctx.fillText(l, x, y + i * lineHeight));
}

export default App;
