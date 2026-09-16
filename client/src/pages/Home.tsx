import { useMemo, useState } from "react";
import {
  ArrowRight,
  BookOpen,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleHelp,
  ClipboardCheck,
  Code2,
  Compass,
  Copy,
  FileCode2,
  GitBranch,
  GraduationCap,
  Layers3,
  Lightbulb,
  ListChecks,
  Menu,
  Network,
  Play,
  RotateCcw,
  Terminal,
  X,
  XCircle,
  Zap,
} from "lucide-react";

type ChapterId = "cmake" | "cross" | "git" | "uml";
type QuizFilter = "all" | ChapterId | "linux";
type Answer = string | number;
type MatchMap = Record<string, string>;

type QuizQuestion = {
  id: string;
  chapter: QuizFilter;
  kind: "qcm" | "blank" | "purpose" | "match" | "order";
  label: string;
  question: string;
  options?: string[];
  answer?: number;
  accepted?: string[];
  explanation: string;
  code?: string;
  items?: { command: string; description: string }[];
  order?: string[];
};

const chapters: { id: ChapterId; label: string; short: string; icon: typeof Code2; accent: string }[] = [
  { id: "cmake", label: "CMake", short: "Configuration & build", icon: Code2, accent: "cyan" },
  { id: "cross", label: "Cross-compilation", short: "Architectures & ISA", icon: Network, accent: "violet" },
  { id: "git", label: "Git", short: "Commandes de base", icon: GitBranch, accent: "orange" },
  { id: "uml", label: "UML & POO", short: "Modéliser en C++", icon: Layers3, accent: "lime" },
];

const quizQuestions: QuizQuestion[] = [
  {
    id: "cmake-role", chapter: "cmake", kind: "qcm", label: "QCM · CMake",
    question: "Quel est le rôle principal de CMake ?",
    options: ["Écrire le code source à la place du développeur", "Automatiser la configuration de construction d’un projet", "Remplacer le système d’exploitation", "Créer uniquement des diagrammes UML"], answer: 1,
    explanation: "CMake automatise la configuration de construction et facilite la gestion multiplateforme.",
  },
  {
    id: "cmake-min", chapter: "cmake", kind: "purpose", label: "À quoi sert cette commande ?",
    question: "À quoi sert cette ligne dans CMakeLists.txt ?", code: "cmake_minimum_required(VERSION 3.20)",
    options: ["À choisir le nom de l’exécutable", "À indiquer la version minimale de CMake requise", "À compiler le fichier C++", "À récupérer un dépôt distant"], answer: 1,
    explanation: "Elle indique la version minimale de CMake nécessaire pour configurer le projet.",
  },
  {
    id: "cmake-blank", chapter: "cmake", kind: "blank", label: "Question à trou · CMake",
    question: "Complète la commande qui génère un exécutable à partir de main.cpp.", code: "__________(app main.cpp)", accepted: ["add_executable"],
    explanation: "add_executable(nom fichier.cpp) génère l’exécutable du projet.",
  },
  {
    id: "cmake-dotdot", chapter: "cmake", kind: "purpose", label: "À quoi sert cette commande ?",
    question: "Que fait cette commande depuis le dossier build ?", code: "cmake ..",
    options: ["Elle supprime le dossier parent", "Elle configure le projet en indiquant que CMakeLists.txt est dans le dossier parent", "Elle compile automatiquement le programme", "Elle affiche le répertoire courant"], answer: 1,
    explanation: "Le .. désigne le dossier parent : CMake lit donc le CMakeLists.txt situé à la racine du projet.",
  },
  {
    id: "cmake-order", chapter: "cmake", kind: "order", label: "Mini-exercice · ordre des commandes",
    question: "Remets dans l’ordre les commandes pour compiler puis lancer un projet CMake.",
    order: ["mkdir build", "cd build", "cmake ..", "make", "./nom_executable"],
    explanation: "On crée puis on rejoint un dossier de construction, on configure avec le CMakeLists.txt parent, on compile et on lance l’exécutable.",
  },
  {
    id: "cross-definition", chapter: "cross", kind: "qcm", label: "QCM · Cross-compilation",
    question: "Que signifie cross-compiler ?",
    options: ["Compiler deux fois le même fichier", "Compiler sur une machine pour exécuter sur une autre", "Compiler uniquement en ligne", "Compiler sans code source"], answer: 1,
    explanation: "La cross-compilation produit un programme pour une machine cible différente de la machine qui compile.",
  },
  {
    id: "cross-isa", chapter: "cross", kind: "purpose", label: "Notion clé · ISA",
    question: "Que désigne l’ISA d’un processeur ?",
    options: ["Son système de fichiers", "Instruction Set Architecture : l’architecture du jeu d’instructions", "Son câble réseau", "Son langage de documentation"], answer: 1,
    explanation: "L’ISA (Instruction Set Architecture) décrit le jeu d’instructions compris par le processeur.",
  },
  {
    id: "cross-example", chapter: "cross", kind: "qcm", label: "Exemple · Linux → Windows",
    question: "Quel outil peut compiler depuis Linux vers Windows ?",
    options: ["g++-mingw-w64", "Doxygen", "git fetch", "cmake_minimum_required"], answer: 0,
    explanation: "g++-mingw-w64 est utilisé pour produire un programme Windows depuis Linux. Une liaison statique peut inclure libgcc et libstdc++.",
  },
  {
    id: "git-clone", chapter: "git", kind: "purpose", label: "À quoi sert cette commande ?",
    question: "Que fait git clone URL ?", code: "git clone URL",
    options: ["Récupérer un dépôt en local", "Envoyer des modifications", "Afficher les permissions", "Fusionner deux classes"], answer: 0,
    explanation: "git clone récupère un dépôt distant et crée une copie locale.",
  },
  {
    id: "git-fetch-pull", chapter: "git", kind: "qcm", label: "Comparer deux commandes",
    question: "Quelle affirmation distingue correctement git fetch et git pull ?",
    options: ["fetch fusionne, pull ne récupère rien", "fetch récupère sans fusionner, pull récupère et fusionne", "fetch supprime le dépôt, pull le crée", "Ils sont strictement identiques"], answer: 1,
    explanation: "git fetch récupère les modifications distantes sans les fusionner ; git pull les récupère et les fusionne avec la branche.",
  },
  {
    id: "git-match", chapter: "git", kind: "match", label: "Association · Git",
    question: "Relie chaque commande à sa description.",
    items: [
      { command: "git push", description: "Envoyer ses modifications vers le dépôt distant" },
      { command: "git fetch", description: "Récupérer les modifications distantes sans fusionner" },
      { command: "git pull", description: "Récupérer les modifications distantes et fusionner" },
    ],
    explanation: "Un push envoie, fetch récupère sans fusion, pull récupère et fusionne. Un commit est une validation locale des modifications.",
  },
  {
    id: "uml-class", chapter: "uml", kind: "qcm", label: "QCM · UML",
    question: "Que représente principalement un diagramme de classe UML ?",
    options: ["La structure de classes avec attributs, méthodes et relations", "La vitesse du processeur", "La liste des commandes Linux", "Le contenu d’un dépôt distant"], answer: 0,
    explanation: "Le diagramme de classe UML décrit la structure d’un modèle : classes, attributs, méthodes et relations.",
  },
  {
    id: "uml-relations", chapter: "uml", kind: "qcm", label: "Relations UML",
    question: "Quelle relation indique qu’un objet est une partie forte d’un autre et dépend de son cycle de vie ?",
    options: ["Agrégation", "Composition", "Héritage", "Commit"], answer: 1,
    explanation: "La composition est une relation forte : la partie dépend du cycle de vie du tout. L’agrégation est plus faible et l’héritage exprime une spécialisation.",
  },
  {
    id: "uml-code", chapter: "uml", kind: "blank", label: "UML → C++",
    question: "En C++, quel mot-clé rend un attribut ou une méthode accessible depuis l’extérieur de la classe ?",
    code: "__________:\n    void afficher();", accepted: ["public"],
    explanation: "Le symbole + d’UML correspond généralement à public en C++, tandis que − correspond à private.",
  },
  {
    id: "linux-pwd", chapter: "linux", kind: "purpose", label: "Linux · commande 01",
    question: "Que fait pwd ?", code: "pwd",
    options: ["Affiche le répertoire courant", "Crée un fichier vide", "Copie un fichier", "Modifie les permissions"], answer: 0,
    explanation: "pwd affiche le chemin du répertoire courant.",
  },
  {
    id: "linux-ls", chapter: "linux", kind: "qcm", label: "Linux · commande 02",
    question: "Quelle proposition décrit correctement ls -la ?",
    options: ["Supprimer récursivement", "Lister le contenu avec détails et fichiers cachés", "Changer de répertoire", "Créer un dossier"], answer: 1,
    explanation: "ls liste le contenu ; -l affiche les détails et -a inclut les éléments cachés.",
  },
  {
    id: "linux-cd", chapter: "linux", kind: "purpose", label: "Linux · commande 03",
    question: "Que fait cd .. ?", code: "cd ..",
    options: ["Va dans le dossier parent", "Va dans le dossier personnel", "Affiche un fichier", "Renomme un dossier"], answer: 0,
    explanation: "cd déplace dans l’arborescence ; cd .. va au dossier parent, cd ~ au dossier personnel et cd /chemin vers le chemin indiqué.",
  },
  {
    id: "linux-mkdir", chapter: "linux", kind: "purpose", label: "Linux · commande 04",
    question: "À quoi sert mkdir cours ?", code: "mkdir cours",
    options: ["Créer le répertoire cours", "Afficher cours", "Déplacer cours", "Donner les droits administrateur"], answer: 0,
    explanation: "mkdir crée un répertoire.",
  },
  {
    id: "linux-cat", chapter: "linux", kind: "purpose", label: "Linux · commande 05",
    question: "Que fait cat fichier.txt ?", code: "cat fichier.txt",
    options: ["Affiche le contenu du fichier", "Crée une classe", "Compile le fichier", "Supprime le fichier"], answer: 0,
    explanation: "cat affiche le contenu d’un fichier dans le terminal.",
  },
  {
    id: "linux-sudo", chapter: "linux", kind: "qcm", label: "Linux · commande 06",
    question: "Quel est le rôle de sudo ?",
    options: ["Exécuter une commande avec les droits administrateur", "Copier un dépôt", "Lister les fichiers cachés", "Changer le répertoire"], answer: 0,
    explanation: "sudo permet d’exécuter une commande avec les droits administrateur.",
  },
  {
    id: "linux-rm", chapter: "linux", kind: "qcm", label: "Linux · commande 07",
    question: "Quelle commande supprime récursivement un dossier ?",
    options: ["rm -r dossier", "cp dossier", "touch dossier", "pwd dossier"], answer: 0,
    explanation: "rm supprime un fichier ; rm -r supprime un dossier et son contenu récursivement.",
  },
  {
    id: "linux-files", chapter: "linux", kind: "match", label: "Association · Linux",
    question: "Relie chaque commande à sa description.",
    items: [
      { command: "cp source destination", description: "Copier un fichier" },
      { command: "mv ancien nouveau", description: "Déplacer ou renommer" },
      { command: "chmod", description: "Modifier les permissions" },
      { command: "touch", description: "Créer un fichier vide" },
    ],
    explanation: "cp copie, mv déplace ou renomme, chmod modifie les permissions et touch crée un fichier vide.",
  },
];

const linuxCommands = [
  ["pwd", "afficher le répertoire courant"], ["ls", "lister le contenu (-l, -a)"], ["cd", "se déplacer dans l’arborescence"],
  ["mkdir", "créer un répertoire"], ["cat", "afficher le contenu d’un fichier"], ["sudo", "exécuter avec les droits administrateur"],
  ["rm / rm -r", "supprimer un fichier ou dossier"], ["cp", "copier un fichier"], ["mv", "déplacer ou renommer"],
  ["chmod", "modifier les permissions"], ["touch", "créer un fichier vide"],
];

function CodeBlock({ children, accent = "cyan" }: { children: string; accent?: string }) {
  return (
    <div className={`code-block code-${accent}`}>
      <div className="code-top"><span className="code-dots"><i /><i /><i /></span><span>exemple</span><button aria-label="Copier le code" title="Copier" onClick={() => navigator.clipboard?.writeText(children)}><Copy size={14} /></button></div>
      <pre><code>{children}</code></pre>
    </div>
  );
}

function Badge({ children, tone = "cyan" }: { children: React.ReactNode; tone?: string }) {
  return <span className={`badge badge-${tone}`}>{children}</span>;
}

function CoursePanel({ chapter }: { chapter: ChapterId }) {
  if (chapter === "cmake") return <section className="course-panel" aria-labelledby="course-title">
    <div className="eyebrow">01 / cours</div>
    <h2 id="course-title">CMake, du projet à l’exécutable.</h2>
    <p className="lead">CMake est un outil open-source d’automatisation de la configuration de construction des projets. Il facilite une gestion multiplateforme.</p>
    <div className="lesson-grid">
      <article className="lesson-card wide"><div className="lesson-index">01</div><div><h3>Le fichier CMakeLists.txt</h3><p>Il décrit la configuration du projet : ses dépendances, ses options de compilation et ses paramètres. CMake s’appuie sur ce fichier pour préparer la construction.</p></div><FileCode2 className="lesson-icon" /></article>
      <article className="lesson-card"><div className="lesson-index">02</div><h3>Les commandes de base</h3><CodeBlock accent="cyan">{"cmake_minimum_required(VERSION 3.20)\nproject(MonProjet)\nset(CMAKE_CXX_STANDARD 11)\nset(CMAKE_CXX_STANDARD_REQUIRED True)\nadd_executable(app main.cpp)"}</CodeBlock></article>
      <article className="lesson-card accent-card"><div className="lesson-index">03</div><h3>À retenir</h3><ul className="clean-list"><li><code>cmake_minimum_required</code><span>version minimale requise</span></li><li><code>project</code><span>nom du projet</span></li><li><code>set</code><span>version du C++ utilisée</span></li><li><code>add_executable</code><span>génère l’exécutable</span></li></ul></article>
    </div>
    <div className="build-path"><div className="path-heading"><span className="path-number">04</span><div><h3>Les étapes de compilation</h3><p>Travaille dans un dossier <strong>build</strong> séparé du code source.</p></div></div><div className="steps-list">
      {[['mkdir build','Créer le dossier de construction.'],['cd build','Entrer dans ce dossier.'],['cmake ..','Configurer le projet ; .. indique le dossier parent, où se trouve CMakeLists.txt.'],['make','Compiler selon la configuration générée.'],['./nom_executable','Lancer l’exécutable produit.']].map(([cmd, desc], i) => <div className="step-row" key={cmd}><span>{String(i + 1).padStart(2, '0')}</span><code>{cmd}</code><p>{desc}</p></div>)}
    </div></div>
  </section>;

  if (chapter === "cross") return <section className="course-panel" aria-labelledby="course-title">
    <div className="eyebrow violet-text">02 / cours</div><h2 id="course-title">Cross-compiler, changer de cible.</h2>
    <p className="lead">La cross-compilation consiste à compiler un programme sur une machine pour l’exécuter sur une autre, avec une architecture ou un système d’exploitation différent.</p>
    <div className="signal-card"><div className="signal-node host"><Terminal size={21} /><b>Machine hôte</b><span>compile</span></div><ArrowRight className="signal-arrow" /><div className="signal-node target"><Zap size={21} /><b>Machine cible</b><span>exécute</span></div></div>
    <div className="lesson-grid two">
      <article className="lesson-card"><div className="lesson-index">01</div><h3>CISC vs RISC</h3><div className="compare"><div><Badge tone="violet">CISC</Badge><p>Jeu d’instructions complexe, avec des instructions pouvant être riches.</p></div><div><Badge tone="cyan">RISC</Badge><p>Jeu d’instructions réduit, privilégiant des instructions simples.</p></div></div></article>
      <article className="lesson-card"><div className="lesson-index">02</div><h3>ISA</h3><p>L’<strong>Instruction Set Architecture</strong> est l’architecture du jeu d’instructions : elle définit les instructions comprises par le processeur.</p><div className="mini-note"><Lightbulb size={16} /> L’ISA fait le lien entre le programme compilé et le processeur.</div></article>
      <article className="lesson-card wide"><div className="lesson-index">03</div><h3>Pourquoi cross-compiler ?</h3><p>La machine cible peut être trop lente, ne pas disposer d’une chaîne de compilation, ou ne pas avoir d’écran ni de clavier. On compile alors ailleurs, puis on déploie le programme produit sur la cible.</p></article>
    </div>
    <div className="example-strip"><div><Badge tone="violet">Exemple</Badge><h3>Linux → Windows</h3><p>Avec <code>g++-mingw-w64</code>, on peut compiler depuis Linux vers Windows. Une liaison statique des bibliothèques <code>libgcc</code> et <code>libstdc++</code> permet d’intégrer ces bibliothèques au programme.</p></div><CodeBlock accent="violet">{"g++-mingw-w64 main.cpp -o app.exe"}</CodeBlock></div>
  </section>;

  if (chapter === "git") return <section className="course-panel" aria-labelledby="course-title">
    <div className="eyebrow orange-text">03 / cours</div><h2 id="course-title">Git, garder le fil du projet.</h2>
    <p className="lead">Git permet de travailler avec un dépôt local et un dépôt distant. Les commandes vues ici servent à récupérer et envoyer le travail.</p>
    <div className="git-flow"><div className="git-repo"><span>LOCAL</span><strong>votre projet</strong></div><div className="git-actions"><span>fetch / pull</span><GitBranch /><span>push</span></div><div className="git-repo remote"><span>DISTANT</span><strong>dépôt partagé</strong></div></div>
    <div className="command-table">{[['git clone URL','Récupérer un dépôt en local.'],['git push','Envoyer ses modifications vers le dépôt distant.'],['git fetch','Récupérer les modifications distantes sans fusionner.'],['git pull','Récupérer les modifications distantes et fusionner avec sa branche.']].map(([cmd, desc]) => <div className="command-row" key={cmd}><code>{cmd}</code><span>{desc}</span></div>)}</div>
    <div className="commit-card"><div className="commit-icon"><Check size={20} /></div><div><Badge tone="orange">Commit</Badge><h3>Une étape enregistrée</h3><p>Un commit enregistre une version des modifications. Bonnes pratiques : faire des commits réguliers et écrire des messages clairs.</p></div></div>
  </section>;

  return <section className="course-panel" aria-labelledby="course-title">
    <div className="eyebrow lime-text">04 / cours</div><h2 id="course-title">UML & POO, passer du modèle au C++.</h2>
    <p className="lead">Un diagramme de classe UML décrit des classes, leurs attributs, leurs méthodes et leurs relations. Il sert de plan avant l’écriture du code.</p>
    <div className="uml-board"><div className="uml-class"><div className="uml-title">Capteur</div><div className="uml-line">− valeur : int</div><div className="uml-line">+ lire() : int</div></div><div className="uml-relation"><span>agrégation</span><div className="uml-link" /></div><div className="uml-class lime-border"><div className="uml-title">Système</div><div className="uml-line">− capteur : Capteur</div><div className="uml-line">+ afficher()</div></div></div>
    <div className="relations-grid"><article><Badge tone="violet">Agrégation</Badge><p>Relation « a un » plus faible : l’objet peut exister indépendamment. Exemple : un système regroupe des capteurs.</p></article><article><Badge tone="lime">Composition</Badge><p>Relation « partie de » forte : la partie dépend du cycle de vie du tout. Exemple : une classe contient des objets qu’elle gère.</p></article><article><Badge tone="orange">Héritage</Badge><p>Relation de spécialisation : une classe dérivée reprend les éléments d’une classe de base.</p></article></div>
    <div className="cpp-card"><div><h3>Du diagramme au code C++</h3><p>Les attributs et méthodes deviennent les membres de la classe. La visibilité − devient <code>private</code> et + devient <code>public</code>.</p></div><CodeBlock accent="lime">{"class Capteur {\nprivate:\n    int valeur;\npublic:\n    int lire();\n};"}</CodeBlock></div>
    <div className="uml-footer"><div><h3>Deux réflexes à garder</h3><p><strong>Fuites mémoire :</strong> gérer correctement les destructeurs pour libérer les ressources.</p><p><strong>Doxygen :</strong> outil de documentation du code.</p></div><ClipboardCheck size={34} /></div>
  </section>;
}

function QuizCard({ question, answer, onAnswer, onMatch, onOrder }: { question: QuizQuestion; answer?: Answer; onAnswer: (value: Answer) => void; onMatch: (value: MatchMap) => void; onOrder: (value: string) => void }) {
  const [blank, setBlank] = useState(typeof answer === "string" && question.kind === "blank" ? answer : "");
  const [order, setOrder] = useState<string[]>(answer && question.kind === "order" ? JSON.parse(String(answer)) : question.order ?? []);
  const [matches, setMatches] = useState<MatchMap>(answer && question.kind === "match" ? JSON.parse(String(answer)) : {});
  const answered = answer !== undefined;
  const correct = answered && (question.kind === "blank" ? question.accepted?.some(v => v.toLowerCase() === String(answer).trim().toLowerCase()) : question.kind === "order" ? JSON.stringify(order) === JSON.stringify(question.order) : question.kind === "match" ? question.items?.every(item => matches[item.command] === item.description) : answer === question.answer);
  const submitBlank = () => { if (blank.trim()) onAnswer(blank); };
  const moveItem = (index: number, direction: -1 | 1) => { const next = [...order]; const target = index + direction; if (target < 0 || target >= next.length) return; [next[index], next[target]] = [next[target], next[index]]; setOrder(next); };
  const updateMatch = (command: string, description: string) => { const next = { ...matches, [command]: description }; setMatches(next); };
  return <article className={`quiz-card ${answered ? (correct ? "is-correct" : "is-wrong") : ""}`}>
    <div className="quiz-card-top"><Badge tone={question.chapter === "linux" ? "slate" : question.chapter}>{question.label}</Badge><span className="question-state">{answered ? (correct ? <CheckCircle2 size={17} /> : <XCircle size={17} />) : <CircleHelp size={17} />}</span></div>
    <h3>{question.question}</h3>{question.code && <CodeBlock accent={question.chapter === "uml" ? "lime" : question.chapter === "cross" ? "violet" : "cyan"}>{question.code}</CodeBlock>}
    {question.options && <div className="options">{question.options.map((option, index) => <button key={option} className={`option ${answered && index === question.answer ? "correct-option" : ""} ${answered && answer === index && index !== question.answer ? "wrong-option" : ""}`} onClick={() => !answered && onAnswer(index)} disabled={answered}><span>{String.fromCharCode(65 + index)}</span>{option}{answered && index === question.answer && <Check size={16} />}{answered && answer === index && index !== question.answer && <X size={16} />}</button>)}</div>}
    {question.kind === "blank" && <div className="blank-answer"><input value={blank} onChange={e => setBlank(e.target.value)} placeholder="Votre réponse…" disabled={answered} onKeyDown={e => e.key === "Enter" && submitBlank()} /><button className="primary-btn small" onClick={submitBlank} disabled={answered || !blank.trim()}>Valider</button></div>}
    {question.kind === "order" && <div className="order-list">{order.map((item, index) => <div className="order-item" key={item}><span>{index + 1}</span><code>{item}</code><div><button onClick={() => moveItem(index, -1)} disabled={answered || index === 0} aria-label="Monter"><ChevronLeft size={15} className="rotate-90" /></button><button onClick={() => moveItem(index, 1)} disabled={answered || index === order.length - 1} aria-label="Descendre"><ChevronRight size={15} className="rotate-90" /></button></div></div>)}{!answered && <button className="primary-btn small order-submit" onClick={() => onOrder(JSON.stringify(order))}>Valider l’ordre</button>}</div>}
    {question.kind === "match" && <div className="match-list">{question.items?.map(item => <div className="match-row" key={item.command}><code>{item.command}</code><span>→</span><select value={matches[item.command] ?? ""} disabled={answered} onChange={e => updateMatch(item.command, e.target.value)}><option value="">Choisir…</option>{question.items?.map(option => <option key={option.description} value={option.description}>{option.description}</option>)}</select></div>)}{!answered && <button className="primary-btn small order-submit" disabled={Object.keys(matches).length !== question.items?.length} onClick={() => onMatch(matches)}>Valider les associations</button>}</div>}
    {answered && <div className={`feedback ${correct ? "feedback-good" : "feedback-bad"}`}><span>{correct ? "Bonne réponse" : "À revoir"}</span><p>{question.explanation}</p></div>}
  </article>;
}

export default function Home() {
  const [activeView, setActiveView] = useState<"home" | "course" | "quiz">("home");
  const [chapter, setChapter] = useState<ChapterId>("cmake");
  const [quizFilter, setQuizFilter] = useState<QuizFilter>("all");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, Answer>>({});
  const [matches, setMatches] = useState<Record<string, string>>({});
  const [menuOpen, setMenuOpen] = useState(false);
  const filteredQuestions = useMemo(() => quizQuestions.filter(q => quizFilter === "all" || q.chapter === quizFilter), [quizFilter]);
  const currentQuestion = filteredQuestions[questionIndex];
  const answeredCount = filteredQuestions.filter(q => answers[q.id] !== undefined).length;
  const score = filteredQuestions.filter(q => {
    const a = answers[q.id]; if (a === undefined) return false;
    if (q.kind === "blank") return q.accepted?.some(v => v.toLowerCase() === String(a).trim().toLowerCase());
    if (q.kind === "order") return JSON.stringify(JSON.parse(String(a))) === JSON.stringify(q.order);
    if (q.kind === "match") { const m = JSON.parse(String(a)) as MatchMap; return q.items?.every(item => m[item.command] === item.description); }
    return a === q.answer;
  }).length;
  const setQuestionAnswer = (id: string, value: Answer) => setAnswers(prev => ({ ...prev, [id]: value }));
  const setQuestionMatch = (id: string, value: MatchMap) => { setMatches(prev => ({ ...prev, [id]: JSON.stringify(value) })); setAnswers(prev => ({ ...prev, [id]: JSON.stringify(value) })); };
  const resetQuiz = () => { setAnswers({}); setMatches({}); setQuestionIndex(0); };
  const openCourse = (id: ChapterId) => { setChapter(id); setActiveView("course"); setMenuOpen(false); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const openQuiz = (filter: QuizFilter = "all") => { setQuizFilter(filter); setActiveView("quiz"); setQuestionIndex(0); setMenuOpen(false); window.scrollTo({ top: 0, behavior: "smooth" }); };

  return <div className="app-shell">
    <aside className={`sidebar ${menuOpen ? "open" : ""}`}>
      <div className="brand"><div className="brand-mark"><span>&gt;_</span></div><div><strong>CIEL<span>.</span></strong><small>révision interactive</small></div><button className="mobile-close" onClick={() => setMenuOpen(false)}><X size={18} /></button></div>
      <div className="side-section"><span className="side-label">Navigation</span><button className={activeView === "home" ? "side-link active" : "side-link"} onClick={() => { setActiveView("home"); setMenuOpen(false); }}><Compass size={18} />Vue d’ensemble</button><button className={activeView === "course" ? "side-link active" : "side-link"} onClick={() => openCourse(chapter)}><BookOpen size={18} />Cours <span className="side-count">4</span></button><button className={activeView === "quiz" ? "side-link active" : "side-link"} onClick={() => openQuiz()}><ClipboardCheck size={18} />Quiz <span className="side-count">24</span></button></div>
      <div className="side-section chapter-nav"><span className="side-label">Chapitres</span>{chapters.map(({ id, label, icon: Icon, accent }) => <button className={`side-link chapter-${accent} ${chapter === id && activeView === "course" ? "active" : ""}`} key={id} onClick={() => openCourse(id)}><Icon size={17} />{label}</button>)}<button className="side-link chapter-slate" onClick={() => openQuiz("linux")}><Terminal size={17} />Commandes Linux <span className="quiz-dot" /></button></div>
      <div className="side-bottom"><div className="progress-ring"><span>0%</span></div><div><strong>Prêt à réviser ?</strong><small>Commence par le cours.</small></div></div>
    </aside>
    <main className="main-area">
      <header className="topbar"><button className="mobile-menu" onClick={() => setMenuOpen(true)} aria-label="Ouvrir le menu"><Menu size={21} /></button><div className="breadcrumbs"><span>CIEL / IR</span><ChevronRight size={14} /><strong>{activeView === "home" ? "Tableau de bord" : activeView === "course" ? "Cours" : "Quiz"}</strong></div><div className="top-actions"><span className="offline"><i />Mode local</span><div className="avatar">IR</div></div></header>
      {activeView === "home" && <>
        <section className="hero"><div className="hero-copy"><Badge tone="cyan"><span className="pulse-dot" /> Parcours BTS CIEL · IR</Badge><h1>Comprendre.<br /><em>Construire.</em><br />Progresser.</h1><p>Ton espace de révision pour maîtriser les bases de CMake, de la cross-compilation, de Git et de l’UML en C++.</p><div className="hero-actions"><button className="primary-btn" onClick={() => openCourse("cmake")}>Commencer le cours <ArrowRight size={17} /></button><button className="text-btn" onClick={() => openQuiz()}>Tester mes connaissances <Play size={15} /></button></div></div><div className="hero-visual"><div className="orbit orbit-one" /><div className="orbit orbit-two" /><div className="hero-terminal"><div className="terminal-head"><span><i /><i /><i /></span><small>~/projet-cmake</small><span>⌘</span></div><div className="terminal-line"><b>$</b> mkdir build</div><div className="terminal-line"><b>$</b> cd build</div><div className="terminal-line active"><b>$</b> cmake ..<span className="cursor" /></div><div className="terminal-output">-- Configuring done<br />-- Build files generated</div><div className="terminal-line"><b>$</b> make</div></div><div className="floating-tag tag-top"><Code2 size={15} /><span>CMakeLists.txt</span></div><div className="floating-tag tag-bottom"><CheckCircle2 size={15} /><span>build réussi</span></div></div></section>
        <section className="section-wrap"><div className="section-heading"><div><span className="eyebrow">Parcours de révision</span><h2>Les fondamentaux, au même endroit.</h2></div><button className="link-btn" onClick={() => openCourse("cmake")}>Voir le cours <ArrowRight size={15} /></button></div><div className="chapter-grid">{chapters.map(({ id, label, short, icon: Icon, accent }, index) => <button className={`chapter-card card-${accent}`} key={id} onClick={() => openCourse(id)}><span className="card-number">0{index + 1}</span><span className="chapter-icon"><Icon size={21} /></span><div><h3>{label}</h3><p>{short}</p></div><ArrowRight className="card-arrow" size={18} /></button>)}</div></section>
        <section className="dashboard-lower"><div className="quick-card"><div className="section-heading compact"><div><span className="eyebrow">Révision active</span><h2>Prêt pour le test ?</h2></div><span className="question-total">24 questions</span></div><div className="quiz-preview"><div className="preview-icon"><ListChecks size={23} /></div><div><strong>Quiz complet</strong><p>QCM, questions à trous, associations et exercice d’ordre.</p></div><button className="circle-btn" onClick={() => openQuiz()} aria-label="Démarrer le quiz"><ArrowRight size={18} /></button></div></div><div className="tip-card"><div className="tip-ornament">//</div><div><span className="eyebrow">Astuce</span><h3>Le rôle de <code>..</code></h3><p>Dans <code>cmake ..</code>, les deux points indiquent le dossier parent.</p></div><Lightbulb size={22} /></div></section>
      </>}
      {activeView === "course" && <><div className="page-intro"><div><span className="eyebrow">Cours · 4 chapitres</span><h1>Le parcours essentiel.</h1><p>Lis les notions, puis passe au quiz pour vérifier tes acquis.</p></div><button className="primary-btn" onClick={() => openQuiz(chapter)}>Quiz de ce chapitre <ArrowRight size={17} /></button></div><div className="course-tabs">{chapters.map(({ id, label, icon: Icon, accent }) => <button key={id} className={chapter === id ? `course-tab selected ${accent}` : "course-tab"} onClick={() => setChapter(id)}><Icon size={16} />{label}</button>)}</div><CoursePanel chapter={chapter} /></>}
      {activeView === "quiz" && <><div className="page-intro quiz-intro"><div><span className="eyebrow">Auto-évaluation</span><h1>Teste tes connaissances.</h1><p>Réponds, reçois un feedback immédiat et consolide tes bases.</p></div><div className="score-pill"><span>Score</span><strong>{score}<small>/{filteredQuestions.length}</small></strong></div></div><div className="quiz-filters"><span>Filtrer :</span>{([["all", "Tout le quiz"], ...chapters.map(c => [c.id, c.label] as const), ["linux", "Linux · quiz"]] as [QuizFilter, string][]).map(([id, label]) => <button key={id} className={quizFilter === id ? "filter-btn selected" : "filter-btn"} onClick={() => { setQuizFilter(id); setQuestionIndex(0); }}>{label}</button>)}<button className="reset-btn" onClick={resetQuiz}><RotateCcw size={15} /> Réinitialiser</button></div><div className="quiz-progress"><div><span>{answeredCount} / {filteredQuestions.length} répondues</span><strong>{Math.round((answeredCount / filteredQuestions.length) * 100)}%</strong></div><div className="progress-track"><i style={{ width: `${(answeredCount / filteredQuestions.length) * 100}%` }} /></div></div><div className="quiz-layout"><div className="quiz-main">{currentQuestion && <QuizCard question={currentQuestion} answer={answers[currentQuestion.id]} onAnswer={value => setQuestionAnswer(currentQuestion.id, value)} onMatch={value => setQuestionMatch(currentQuestion.id, value)} onOrder={value => setQuestionAnswer(currentQuestion.id, value)} />}<div className="quiz-nav"><button className="secondary-btn" onClick={() => setQuestionIndex(Math.max(0, questionIndex - 1))} disabled={questionIndex === 0}><ChevronLeft size={17} />Précédente</button><span>{questionIndex + 1} <i>/</i> {filteredQuestions.length}</span><button className="primary-btn small" onClick={() => setQuestionIndex(Math.min(filteredQuestions.length - 1, questionIndex + 1))} disabled={questionIndex === filteredQuestions.length - 1}>Suivante <ChevronRight size={17} /></button></div></div><aside className="quiz-aside"><div className="aside-card"><span className="eyebrow">Ta progression</span><div className="big-score">{score}<span>/ {filteredQuestions.length}</span></div><p>{answeredCount === 0 ? "Lance-toi, chaque réponse compte." : score === answeredCount ? "Excellent, continue comme ça." : "Relis le feedback pour progresser."}</p><div className="mini-progress"><i style={{ width: `${filteredQuestions.length ? (score / filteredQuestions.length) * 100 : 0}%` }} /></div></div><div className="aside-card chapters-aside"><span className="eyebrow">Dans ce filtre</span>{filteredQuestions.slice(0, 8).map((q, i) => <button key={q.id} onClick={() => setQuestionIndex(i)} className={i === questionIndex ? "current" : ""}><span>{String(i + 1).padStart(2, "0")}</span>{q.label.replace(/ ·.*/, "")}{answers[q.id] !== undefined && (q.kind === "blank" ? <CheckCircle2 size={15} /> : <span className="answered-mark" />)}</button>)}</div></aside></div></>}
    </main>
  </div>;
}
