import { useEffect } from 'react';
import catSprite from '../assets/characters/cat.png';
import robotSprite from '../assets/characters/robot.png';
import spaceSprite from '../assets/characters/space.png';
import tinyPykMark from '../assets/tinypyk-mark.svg';
import wizardSprite from '../assets/characters/wizard.png';
import type { Lesson, ProjectPath } from '../types/lesson';

type HomePageProps = {
  completedLessonIds: string[];
  lessons: Lesson[];
  projectPaths: ProjectPath[];
  onStartLearning: () => void;
  onOpenProject: (lessonId: string) => void;
  onJoin: () => void;
};

const projectCards = [
  {
    title: 'Talking Pet',
    copy: 'Use Python print() blocks to make a character speak on the stage.',
    level: 'Beginner',
    blocks: 'print(), text',
    image: catSprite,
    lessonId: 'lesson-1',
  },
  {
    title: 'Turtle Shape Maker',
    copy: 'After the foundation levels, draw squares, stars, roads, and patterns with Python turtle commands.',
    level: 'Later level',
    blocks: 'move, turn',
    image: robotSprite,
    lessonId: 'lesson-17',
  },
  {
    title: 'Secret Password Door',
    copy: 'Ask a question, check an answer, and make a tiny Python game.',
    level: 'Beginner',
    blocks: 'ask, if',
    image: wizardSprite,
    lessonId: 'lesson-5',
  },
  {
    title: 'Space Adventure',
    copy: 'Combine characters, colour, movement, and messages in one story.',
    level: 'Beginner',
    blocks: 'story, play',
    image: spaceSprite,
    lessonId: 'lesson-4',
  },
  {
    title: 'Quiz Friend',
    copy: 'Build a friendly question-and-answer game with simple Python choices.',
    level: 'Next step',
    blocks: 'input, compare',
    image: catSprite,
    lessonId: 'lesson-2',
  },
  {
    title: 'Star Spinner',
    copy: 'Repeat turns and lines to draw a spinning star with turtle Python.',
    level: 'Next step',
    blocks: 'repeat, turtle',
    image: wizardSprite,
    lessonId: 'lesson-7',
  },
];

const newsItems = [
  {
    slug: 'open-source-roadmap',
    title: 'Open-source roadmap',
    copy: 'We are preparing contribution guides for lessons, translations, and new blocks.',
    details: [
      'TinyPyk is being shaped as a child-safe open-source project with clear contribution paths for educators, developers, translators, and families.',
      'The roadmap includes lesson templates, Blockly block review notes, accessibility checks, classroom testing guidance, and maintainer review steps for anything children may use.',
      'Before public contribution workflows grow, TinyPyk will keep child safety, licensing, privacy, and moderation rules visible so contributors know what good help looks like.',
    ],
    cta: 'Open roadmap update',
  },
  {
    slug: 'blockly-v13-beta-workspace',
    title: 'Blockly v13 beta workspace',
    copy: 'The learning space uses Blockly v13 beta blocks to help children move toward Python.',
    details: [
      'The editor uses Blockly v13 beta-style blocks to create a Scratch-like coding surface while generating real Python text beside the workspace.',
      'The block categories stay familiar for younger learners: Events, Motion, Looks, Sound, Control, Sensing, Operators, Variables, My Blocks, Extensions, and Advanced.',
      'TinyPyk thanks the Blockly team and community for the tools that make friendly block-based Python learning possible.',
    ],
    cta: 'Open Blockly update',
  },
  {
    slug: 'more-python-levels',
    title: 'More Python levels',
    copy: 'New print, input, story, data, turtle, and classroom projects are planned as the project grows.',
    details: [
      'The learning path now follows a Hedy-inspired progression: one small Python concept at a time, starting with print() before input(), variables, conditions, loops, lists, functions, and data stories.',
      'Each level can hold multiple quests so children can practise the same idea through stories, games, music, debugging, and classroom-friendly challenges.',
      'Future project updates will add more printable teacher notes, beginner projects, and safe creative prompts for ages 5 to 7.',
    ],
    cta: 'Open levels update',
  },
];

const codeCards = [
  {
    title: 'Open the editor',
    copy: 'Start in the block workspace and play your first Python program.',
  },
  {
    title: 'Follow a level',
    copy: 'Move step by step through print(), input(), variables, choices, loops, and data.',
  },
  {
    title: 'See the Python',
    copy: 'Watch real Python appear beside the blocks as children build.',
  },
];

const chooseProjectCards = [
  {
    title: 'Python',
    copy: 'Start with print(), input(), variables, conditions, loops, and beginner-friendly Python blocks.',
    cta: 'Explore Python projects',
    image: catSprite,
  },
  {
    title: 'Creative coding',
    copy: 'Use characters, sound, movement, drawing, and simple rules to make projects children can explain proudly.',
    cta: 'See creative projects',
    image: wizardSprite,
  },
  {
    title: 'Data Science',
    copy: 'Start with questions and answers, then grow into patterns, predictions, and small data stories.',
    cta: 'Explore data projects',
    image: robotSprite,
  },
];

const joinWays = [
  'Share classroom feedback',
  'Suggest Python projects',
  'Improve accessibility',
  'Translate learning text',
  'Create new blocks',
  'Test with young learners',
];

export function HomePage({
  completedLessonIds,
  lessons,
  projectPaths,
  onStartLearning,
  onOpenProject,
  onJoin,
}: HomePageProps) {
  const progress = Math.round((completedLessonIds.length / lessons.length) * 100);

  useEffect(() => {
    const scrollToHash = () => {
      const id = window.location.hash.replace('#', '');

      if (!id || id === 'home') {
        window.scrollTo({ top: 0 });
        return;
      }

      window.requestAnimationFrame(() => {
        document.getElementById(id)?.scrollIntoView({ block: 'start' });
      });
    };

    const timeout = window.setTimeout(scrollToHash, 0);
    window.addEventListener('hashchange', scrollToHash);

    return () => {
      window.clearTimeout(timeout);
      window.removeEventListener('hashchange', scrollToHash);
    };
  }, []);

  return (
    <div className="home-shell">
      <header className="home-header">
        <a className="home-brand" href="#home" aria-label="TinyPyk home">
          <img src={tinyPykMark} alt="" />
          <strong>TinyPyk</strong>
        </a>
        <nav className="home-nav" aria-label="Homepage navigation">
          <a href="#get-started">Get started</a>
          <a href="#projects">Projects</a>
          <a href="#teach">Teach</a>
          <a href="#lets-code">Let's code</a>
          <a href="#about">About us</a>
          <button type="button" className="home-nav-link" onClick={onJoin}>Membership</button>
          <a href="#buy">Buy</a>
          <a href="#news">News</a>
          <a href="#policies">Policies</a>
          <button type="button" onClick={onStartLearning}>Start Creating</button>
        </nav>
      </header>

      <main>
        <section className="home-hero" aria-label="TinyPyk">
          <div className="hero-scene" aria-hidden="true">
            <img className="hero-character cat" src={catSprite} alt="" />
            <img className="hero-character robot" src={robotSprite} alt="" />
            <img className="hero-character wizard" src={wizardSprite} alt="" />
            <img className="hero-character space" src={spaceSprite} alt="" />
            <div className="hero-stage-line" />
          </div>

          <div className="hero-copy">
            <p>Creative Python for young learners</p>
            <h1>TinyPyk</h1>
            <span>
              Create stories, games, drawings, and animations with friendly Python blocks.
              Share ideas as the open-source project grows.
            </span>
            <div className="hero-actions">
              <button type="button" onClick={onStartLearning}>Start Creating</button>
              <a
                href="#membership"
                onClick={(event) => {
                  event.preventDefault();
                  onJoin();
                }}
              >
                Join
              </a>
            </div>
          </div>
        </section>

        <section className="home-section get-started" id="get-started">
          <div className="section-heading">
            <p>Get started</p>
            <h2>From blocks to Python in three friendly steps</h2>
          </div>
          <div className="starter-grid">
            <article>
              <span>1</span>
              <h3>Pick a friend</h3>
              <p>Choose a character and make it speak with print().</p>
            </article>
            <article>
              <span>2</span>
              <h3>Snap blocks</h3>
              <p>Drag blocks together to build a program safely.</p>
            </article>
            <article>
              <span>3</span>
              <h3>Play Python</h3>
              <p>Press Play to see real Python output from the first level.</p>
            </article>
          </div>
        </section>

        <section className="home-section learning-preview">
          <div className="section-heading">
            <p>Learn to code</p>
            <h2>Start with a project path</h2>
            <span>
              Choose Foundation, Intermediate, or Data Science. Each path opens one
              level at a time so children learn real Python concepts in a gentle order.
            </span>
          </div>
          <div className="home-progress">
            <strong>{progress}% complete</strong>
            <span>{completedLessonIds.length} of {lessons.length} levels played</span>
            <div><span style={{ width: `${progress}%` }} /></div>
          </div>
          <div className="project-path-grid">
            {projectPaths.map((path) => (
              <article key={path.id} style={{ backgroundColor: path.accent }}>
                <span>{path.label}</span>
                <h3>{path.title}</h3>
                <p>{path.focus}</p>
                <button type="button" onClick={onStartLearning}>
                  Explore {path.title}
                </button>
              </article>
            ))}
          </div>
        </section>

        <section className="code-band" id="lets-code">
          <div>
            <p>Let's code</p>
            <h2>Create stories, games, and animations with Python</h2>
            <span>
              Start with friendly blocks, watch the Python appear, then play your program
              on the character stage.
            </span>
          </div>
          <div className="code-card-grid" aria-label="Ways to start coding">
            {codeCards.map((card) => (
              <article key={card.title}>
                <h3>{card.title}</h3>
                <p>{card.copy}</p>
              </article>
            ))}
          </div>
          <div className="code-actions">
            <button type="button" onClick={onStartLearning}>Start Creating</button>
            <a href="#projects">See Python projects</a>
          </div>
        </section>

        <section className="home-section projects" id="projects">
          <div className="section-heading">
            <p>Choose a project</p>
            <h2>Projects for creative Python learners</h2>
            <span>
              TinyPyk has projects for children who want to make characters talk,
              draw with turtle graphics, build little games, explore patterns, or
              begin thinking like data detectives after learning Python foundations.
            </span>
          </div>
          <div className="choose-project-grid">
            {chooseProjectCards.map((card) => (
              <article key={card.title}>
                <img src={card.image} alt="" />
                <h3>{card.title}</h3>
                <p>{card.copy}</p>
                <button type="button" onClick={onStartLearning}>{card.cta}</button>
              </article>
            ))}
          </div>
          <div className="see-all-projects">
            <button type="button" onClick={onStartLearning}>See all projects</button>
          </div>

          <div className="section-heading project-examples-heading">
            <p>Starter examples</p>
            <h2>Beginner projects ready for the editor</h2>
          </div>
          <div className="project-grid">
            {projectCards.map((project) => (
              <article key={project.title}>
                <img src={project.image} alt="" />
                <div className="project-meta">
                  <span>{project.level}</span>
                  <span>{project.blocks}</span>
                </div>
                <h3>{project.title}</h3>
                <p>{project.copy}</p>
                <button
                  type="button"
                  className="project-open-button"
                  onClick={() => onOpenProject(project.lessonId)}
                >
                  Open project
                </button>
              </article>
            ))}
          </div>
        </section>

        <section className="teacher-band" id="teach">
          <div>
            <p>Teach</p>
            <h2>Simple enough for first coding lessons</h2>
            <span>
              Learners stay in a visual coding space while the Python appears beside
              their blocks. The 17-level path starts with print() and grows toward
              conditions, loops, data stories, and creative problem solving.
            </span>
          </div>
          <button type="button" onClick={onStartLearning}>Open learning space</button>
        </section>

        <section className="open-source-section" id="about">
          <div className="section-heading">
            <p>About us</p>
            <h2>An open-source project for young Python learners</h2>
          </div>
          <div className="open-source-grid">
            <article>
              <h3>Open to contributors</h3>
              <p>
                TinyPyk is designed as an open-source learning project.
                Teachers, developers, parents, and young makers can help improve lessons,
                blocks, translations, and classroom ideas.
              </p>
            </article>
            <article>
              <h3>Thank you, Blockly team</h3>
              <p>
                This project is built with Blockly. We are grateful to the Blockly team
                and community for providing the tools that make block-based coding possible
                for children learning Python.
              </p>
            </article>
          </div>
        </section>

        <section className="join-band" id="join">
          <div>
            <p>Join</p>
            <h2>Help children learn Python more easily</h2>
            <span>
              Contribute ideas, report issues, write lessons, or help build new child-friendly
              Python blocks.
            </span>
            <div className="join-list" aria-label="Ways to contribute">
              {joinWays.map((way) => (
                <span key={way}>{way}</span>
              ))}
            </div>
          </div>
          <div className="join-actions">
            <button type="button" onClick={onJoin}>Create membership</button>
            <button type="button" className="join-secondary" onClick={onStartLearning}>Start Creating</button>
          </div>
        </section>

        <section className="home-section placeholder-section" id="buy">
          <div className="section-heading">
            <p>Buy</p>
            <h2>Placeholder for future resources</h2>
          </div>
          <p>
            The learning app is free and open source. This area is only reserved for
            optional future classroom materials, printed cards, or supporter resources.
          </p>
        </section>

        <section className="home-section policies-link-section" aria-label="TinyPyk policies">
          <div className="section-heading">
            <p>Policies</p>
            <h2>Safety, privacy, and contribution rules</h2>
            <span>
              TinyPyk keeps the detailed policy documents on a separate page so the
              homepage stays focused on learning and creating.
            </span>
          </div>
          <a className="policy-page-link" href="#policies">Open all policies</a>
        </section>

        <section className="home-section news-section" id="news">
          <div className="section-heading">
            <p>News</p>
            <h2>Project updates</h2>
          </div>
          <div className="news-grid">
            {newsItems.map((item) => (
              <article key={item.title}>
                <h3>{item.title}</h3>
                <p>{item.copy}</p>
                <a className="news-link" href={`#update-${item.slug}`}>
                  {item.cta}
                </a>
              </article>
            ))}
          </div>

          <div className="news-detail-list" aria-label="Project update details">
            {newsItems.map((item) => (
              <article className="news-detail-card" id={`update-${item.slug}`} key={item.slug}>
                <div className="policy-detail-header">
                  <div>
                    <p className="eyebrow">Project update</p>
                    <h3>{item.title}</h3>
                  </div>
                  <a href="#news">Back to updates</a>
                </div>
                <p className="policy-summary">{item.copy}</p>
                <div className="news-detail-copy">
                  {item.details.map((detail) => (
                    <p key={detail}>{detail}</p>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>

      <footer className="home-footer">
        <div>
          <strong>TinyPyk</strong>
          <span>Open-source block coding for children learning Python.</span>
        </div>
        <nav aria-label="Footer links">
          <a href="#get-started">Get started</a>
          <a href="#projects">Projects</a>
          <a href="#lets-code">Start coding</a>
          <a
            href="#membership"
            onClick={(event) => {
              event.preventDefault();
              onJoin();
            }}
          >
            Membership
          </a>
          <a href="#policies">Policies</a>
        </nav>
      </footer>
    </div>
  );
}
