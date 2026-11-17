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
const SOCIAL_HANDLE = "@despertandocorazones";
const SOCIAL_LINKS = {
  instagram: "https://instagram.com/despertandocorazones",
  tiktok: "https://instagram.com/despertandocorazones",
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
    note: "Las preguntas también dejaron cicatriz.",
    x: "61%",
    y: "10%",
    rotate: 13,
  },
  {
    title: "Promesas a medias",
    note: "Hubo futuros que sólo vivieron en palabras.",
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
        <Heart size={15} strokeWidth={1.7} />
      </span>
      <span>
        Despertando
        <br />
        Corazones
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
    <svg
      className={`heart-art ${repaired ? "is-repaired" : ""} ${className}`}
      viewBox="0 0 420 390"
      role="img"
      aria-label={repaired ? "Corazón reparado con vetas de oro" : "Corazón de cristal creciendo"}
    >
      <defs>
        <radialGradient id="heartFill" cx="45%" cy="25%" r="75%">
          <stop offset="0%" stopColor="#ffe9d5" />
          <stop offset="45%" stopColor="#e4a8a3" />
          <stop offset="100%" stopColor="#893f4b" />
        </radialGradient>
        <linearGradient id="gold" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#fff2a8" />
          <stop offset=".45" stopColor="#d4af37" />
          <stop offset="1" stopColor="#fb8f24" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="8" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      {stage > 0 && (
        <path
          className="heart-halo"
          d="M210 345C117 280 56 225 60 142 64 62 158 34 210 105 262 34 356 62 360 142 364 225 303 280 210 345Z"
        />
      )}
      <path
        className="heart-main"
        d="M210 345C117 280 56 225 60 142 64 62 158 34 210 105 262 34 356 62 360 142 364 225 303 280 210 345Z"
        fill="url(#heartFill)"
      />
      {stage > 1 && (
        <path
          className="heart-layer layer-one"
          d="M210 311C139 260 92 215 94 153 97 100 157 79 210 137 263 79 323 100 326 153 328 215 281 260 210 311Z"
        />
      )}
      {stage > 2 && (
        <path
          className="heart-layer layer-two"
          d="M210 273C165 239 137 207 139 166 141 134 176 120 210 160 244 120 279 134 281 166 283 207 255 239 210 273Z"
        />
      )}
      <path className="shine" d="M112 119C131 80 174 84 191 111" />
      {repaired && (
        <g
          className="gold-seams"
          fill="none"
          stroke="url(#gold)"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#glow)"
        >
          <path d="M207 103L197 145 218 177 195 213 218 246 204 288 211 340" />
          <path d="M198 145L155 158 126 147 91 161 63 146" />
          <path d="M218 177L258 159 284 126 337 118" />
          <path d="M195 213L159 229 126 263" />
          <path d="M218 246L259 260 290 289" />
        </g>
      )}
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
    bg.addColorStop(0, "#211818");
    bg.addColorStop(1, "#0e0d0d");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, 1080, 1920);
    ctx.strokeStyle = "#6b5630";
    ctx.lineWidth = 2;
    ctx.strokeRect(54, 54, 972, 1812);
    ctx.textAlign = "center";
    ctx.fillStyle = "#d4af37";
    ctx.font = "500 26px Arial";
    ctx.fillText("DESPERTANDO CORAZONES", 540, 145);
    ctx.fillStyle = "#f6eee3";
    ctx.font = "italic 66px Georgia";
    ctx.fillText("Mi cicatriz", 540, 275);
    ctx.fillText("también cuenta mi historia", 540, 350);
    drawCanvasHeart(ctx, 540, 820, 1.75);
    ctx.fillStyle = "#bba37d";
    ctx.font = "500 23px Arial";
    ctx.fillText("MI ARQUETIPO", 540, 1320);
    ctx.fillStyle = "#f6eee3";
    ctx.font = "italic 58px Georgia";
    ctx.fillText(archetype, 540, 1390);
    ctx.strokeStyle = "#7e6335";
    ctx.beginPath();
    ctx.moveTo(410, 1450);
    ctx.lineTo(670, 1450);
    ctx.stroke();
    const lesson = lessons.find(Boolean) || "De cada grieta también nace luz.";
    ctx.font = "italic 36px Georgia";
    wrapText(ctx, `“${lesson}”`, 540, 1535, 780, 50);
    ctx.fillStyle = "#d4af37";
    ctx.font = "500 27px Arial";
    ctx.fillText(SOCIAL_HANDLE, 540, 1765);
    ctx.fillStyle = "#a99d8c";
    ctx.font = "22px Arial";
    ctx.fillText("#DespertandoCorazones", 540, 1810);
    const link = document.createElement("a");
    link.download = "mi-corazon-kintsugi.png";
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
        <p>Una experiencia para sentir, nombrar y transformar.</p>
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
            <Sparkles size={14} /> Una experiencia interactiva
          </p>
          <h1>
            Despertando
            <br />
            <em>Corazones</em>
          </h1>
          <p className="hero-lead">
            Entre el amor que imaginamos y el que realmente vivimos, hay una grieta. Tal vez por ahí
            también pueda entrar la luz.
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
          <span className="orbit-label label-a">IDEALIZAR</span>
          <span className="orbit-label label-b">ROMPER</span>
          <span className="orbit-label label-c">RECONSTRUIR</span>
          <HeartArtwork stage={3} repaired />
          <div className="vertical-note">KINTSUGI EMOCIONAL · 2025</div>
        </div>
        <button
          className="scroll-hint"
          onClick={() =>
            document.getElementById("manifiesto")?.scrollIntoView({ behavior: "smooth" })
          }
        >
          Descubre el movimiento <ArrowDown size={16} />
        </button>
      </section>

      <section className="manifesto" id="manifiesto">
        <p className="section-index">01 — MANIFIESTO</p>
        <div>
          <h2>
            No escondemos
            <br />
            las grietas.
          </h2>
          <p>Las iluminamos.</p>
        </div>
        <blockquote>
          “El corazón no vuelve a ser el mismo. Se vuelve más consciente, más honesto, más suyo.”
        </blockquote>
      </section>

      <section className="dynamic-section" id="dinamica">
        <div className="section-heading">
          <p className="eyebrow">Del mundo interior a la conversación colectiva</p>
          <h2>
            La dinámica
            <br />
            <em>en redes</em>
          </h2>
        </div>
        <div className="steps-grid">
          {[
            [
              "01",
              "Explora tu historia",
              "Vive el recorrido interactivo y construye, rompe y repara tu propio corazón Kintsugi.",
            ],
            [
              "02",
              "Comparte tu cicatriz de oro",
              `Descarga tu tarjeta, súbela a tus historias y etiqueta a ${SOCIAL_HANDLE} con #DespertandoCorazones.`,
            ],
            [
              "03",
              "Conversa en comunidad",
              "Lee historias anónimas, confesiones y reflexiones que compartimos cada semana.",
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
          ¿Qué harás con
          <br />
          tus grietas?
        </h2>
        <button className="primary-btn" onClick={onStart}>
          Comenzar mi viaje <ArrowRight size={18} />
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
      <Progress phase={1} label="EL JARDÍN DE LAS ILUSIONES" />
      <button className="back-btn" onClick={onBack}>
        <ArrowLeft size={16} /> Atrás
      </button>
      <div className="phase-grid">
        <div className="phase-visual">
          <p className="floating-copy">
            Cada expectativa
            <br />
            hace crecer la ilusión.
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
      <Progress phase={2} label="LA TORMENTA Y EL QUIEBRE" />
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
            ? `Aún quedan ${5 - discovered.length} verdades por mirar.`
            : "Ya miraste todas las grietas. Es hora de recogerlas."}
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
      <Progress phase={3} label="EL TALLER DE KINTSUGI" />
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
            <Sparkles size={16} /> Las grietas ahora cuentan tu fuerza
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
            <p className="eyebrow">Dale oro a esta grieta</p>
            <h3>¿Qué aprendiste de esta parte de tu historia?</h3>
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
          <Sparkles size={14} /> Tu corazón ha despertado
        </p>
        <h2>
          No volviste a ser
          <br />
          quien eras.
        </h2>
        <p>Te convertiste en alguien que conoce sus grietas y aun así elige brillar.</p>
      </div>
      <div className="share-card">
        <span className="card-brand">DESPERTANDO CORAZONES</span>
        <div className="card-title">
          Mi cicatriz
          <br />
          <em>también cuenta mi historia</em>
        </div>
        <HeartArtwork stage={3} repaired />
        <div className="archetype">
          <span>MI ARQUETIPO</span>
          <strong>{archetype}</strong>
        </div>
        <blockquote>“{lesson}”</blockquote>
        <div className="card-social">
          {SOCIAL_HANDLE}
          <br />
          <span>#DespertandoCorazones</span>
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
        <p>Comparte tu resultado en historias y etiquétanos para ser parte del movimiento.</p>
      </div>
    </section>
  );
}

function drawCanvasHeart(ctx: CanvasRenderingContext2D, cx: number, cy: number, scale: number) {
  ctx.save();
  ctx.translate(cx - 210 * scale, cy - 195 * scale);
  ctx.scale(scale, scale);
  const path = new Path2D(
    "M210 345C117 280 56 225 60 142 64 62 158 34 210 105 262 34 356 62 360 142 364 225 303 280 210 345Z",
  );
  const fill = ctx.createRadialGradient(170, 100, 10, 210, 200, 180);
  fill.addColorStop(0, "#ffe9d5");
  fill.addColorStop(0.45, "#d3938f");
  fill.addColorStop(1, "#713541");
  ctx.fillStyle = fill;
  ctx.fill(path);
  ctx.lineWidth = 5;
  ctx.strokeStyle = "#e5bd48";
  const cracks = [
    [
      [207, 103],
      [197, 145],
      [218, 177],
      [195, 213],
      [218, 246],
      [204, 288],
      [211, 340],
    ],
    [
      [198, 145],
      [155, 158],
      [126, 147],
      [91, 161],
      [63, 146],
    ],
    [
      [218, 177],
      [258, 159],
      [284, 126],
      [337, 118],
    ],
    [
      [195, 213],
      [159, 229],
      [126, 263],
    ],
    [
      [218, 246],
      [259, 260],
      [290, 289],
    ],
  ];
  cracks.forEach((line) => {
    ctx.beginPath();
    line.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
    ctx.stroke();
  });
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
