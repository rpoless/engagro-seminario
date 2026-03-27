const initMobileNav = () => {
  const toggle = document.querySelector('[data-nav-toggle]');
  const menu = document.querySelector('[data-nav-menu]');
  if (!toggle || !menu) return;

  toggle.addEventListener('click', () => {
    const isOpen = menu.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(isOpen));
  });

  menu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      menu.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
};

const setActivePageLink = () => {
  const current = document.body.dataset.page;
  if (!current) return;
  document.querySelectorAll('[data-page-target]').forEach((link) => {
    if (link.dataset.pageTarget === current) {
      link.classList.add('is-active');
    }
  });
};

const initScrollSpy = () => {
  const links = Array.from(document.querySelectorAll('[data-section-link]'));
  const sections = links
    .map((link) => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);

  if (!sections.length) return;

  const activate = (id) => {
    links.forEach((link) => {
      link.classList.toggle('is-active', link.getAttribute('href') === `#${id}`);
    });
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          activate(entry.target.id);
        }
      });
    },
    {
      rootMargin: '-40% 0px -50% 0px',
      threshold: 0.1,
    }
  );

  sections.forEach((section) => observer.observe(section));
};

const initReveal = () => {
  const items = document.querySelectorAll('.reveal');
  if (!items.length) return;

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  items.forEach((item) => observer.observe(item));
};

const initFooterAccordion = () => {
  const toggles = Array.from(document.querySelectorAll('[data-footer-toggle]'));
  if (!toggles.length) return;

  const panels = toggles
    .map((toggle) => document.getElementById(toggle.getAttribute('aria-controls')))
    .filter(Boolean);

  panels.forEach((panel) => {
    panel.setAttribute('aria-hidden', 'true');
    panel.style.maxHeight = '0px';
  });

  toggles.forEach((toggle) => {
    const panel = document.getElementById(toggle.getAttribute('aria-controls'));
    if (!panel) return;

    toggle.addEventListener('click', () => {
      const isOpen = panel.classList.toggle('is-open');
      toggle.classList.toggle('is-open', isOpen);
      toggle.setAttribute('aria-expanded', String(isOpen));
      panel.setAttribute('aria-hidden', String(!isOpen));
      panel.style.maxHeight = isOpen ? `${panel.scrollHeight}px` : '0px';
    });
  });

  window.addEventListener('resize', () => {
    panels.forEach((panel) => {
      if (panel.classList.contains('is-open')) {
        panel.style.maxHeight = `${panel.scrollHeight}px`;
      }
    });
  });
};

const initAgronomistChallenge = () => {
  const card = document.querySelector('[data-quiz-card]');
  if (!card) return;

  const progressEl = document.querySelector('[data-quiz-progress]');
  const scoreEl = document.querySelector('[data-quiz-score]');
  const titleEl = document.querySelector('[data-quiz-title]');
  const contextEl = document.querySelector('[data-quiz-context]');
  const questionEl = document.querySelector('[data-quiz-question]');
  const optionsEl = document.querySelector('[data-quiz-options]');
  const feedbackEl = document.querySelector('[data-quiz-feedback]');
  const statusEl = document.querySelector('[data-quiz-status]');
  const explanationEl = document.querySelector('[data-quiz-explanation]');
  const nextBtn = document.querySelector('[data-quiz-next]');
  const resultEl = document.querySelector('[data-quiz-result]');
  const resultScoreEl = document.querySelector('[data-quiz-result-score]');
  const restartBtn = document.querySelector('[data-quiz-restart]');

  if (!progressEl || !scoreEl || !titleEl || !contextEl || !questionEl || !optionsEl || !feedbackEl || !statusEl || !explanationEl || !nextBtn || !resultEl || !resultScoreEl || !restartBtn) {
    return;
  }

  const scenarios = [
    {
      title: 'Cenário 1 — Solo ácido',
      situation: 'Uma plantação apresenta baixo crescimento. A análise do solo mostra pH 5,0.',
      question: 'Qual é a melhor decisão para corrigir esse problema?',
      options: ['A. Aplicar calcário', 'B. Aumentar a irrigação', 'C. Aplicar defensivo agrícola'],
      correctIndex: 0,
      correctFeedback: 'Correto! O calcário ajuda a reduzir a acidez do solo e melhora a disponibilidade de nutrientes para as plantas.',
      incorrectFeedback: 'Não é a melhor escolha. O principal problema é a acidez do solo, indicada pelo pH 5,0.',
    },
    {
      title: 'Cenário 2 — Deficiência nutricional',
      situation: 'As folhas da plantação estão amareladas e o crescimento está lento.',
      question: 'Qual é a causa mais provável?',
      options: ['A. Excesso de irrigação', 'B. Deficiência de nutrientes essenciais', 'C. Falta de defensivos'],
      correctIndex: 1,
      correctFeedback: 'Correto! A deficiência de nutrientes, especialmente nitrogênio, pode causar amarelecimento e baixo crescimento.',
      incorrectFeedback: 'Essa não é a causa mais provável. Os sintomas apresentados indicam deficiência nutricional.',
    },
    {
      title: 'Cenário 3 — Água contaminada',
      situation: 'Um lago próximo à área de cultivo apresenta excesso de algas verdes.',
      question: 'O que pode ter causado esse problema?',
      options: ['A. Falta de chuva', 'B. Baixa presença de nutrientes', 'C. Excesso de fertilizantes levados pela água'],
      correctIndex: 2,
      correctFeedback: 'Correto! O excesso de nutrientes, como nitrogênio e fósforo, pode causar eutrofização.',
      incorrectFeedback: 'Não é a melhor explicação. O crescimento excessivo de algas está relacionado ao excesso de nutrientes na água.',
    },
    {
      title: 'Cenário 4 — Pragas na lavoura',
      situation: 'Uma praga está atacando a plantação e comprometendo a produção.',
      question: 'Qual é a melhor ação?',
      options: ['A. Ignorar o problema', 'B. Aplicar defensivo de forma controlada e consciente', 'C. Aumentar a irrigação'],
      correctIndex: 1,
      correctFeedback: 'Correto! O uso responsável de defensivos pode controlar a praga sem gerar impactos desnecessários.',
      incorrectFeedback: 'Essa não é a melhor decisão. O problema exige controle adequado da praga.',
    },
  ];

  let currentIndex = 0;
  let score = 0;
  let answered = false;

  const updateScore = () => {
    scoreEl.textContent = `Pontuação: ${score}/${scenarios.length}`;
  };

  const setFeedback = (isCorrect, text) => {
    feedbackEl.classList.add('is-visible');
    feedbackEl.classList.toggle('quiz-feedback--correct', isCorrect);
    feedbackEl.classList.toggle('quiz-feedback--incorrect', !isCorrect);
    statusEl.textContent = isCorrect ? 'Correto!' : 'Atenção!';
    explanationEl.textContent = text;
  };

  const renderScenario = (index) => {
    const scenario = scenarios[index];
    answered = false;
    nextBtn.disabled = true;
    feedbackEl.classList.remove('is-visible', 'quiz-feedback--correct', 'quiz-feedback--incorrect');
    statusEl.textContent = '';
    explanationEl.textContent = '';

    card.classList.add('is-fading');
    setTimeout(() => {
      resultEl.hidden = true;
      card.hidden = false;
      progressEl.textContent = `Cenário ${index + 1} de ${scenarios.length}`;
      titleEl.textContent = scenario.title;
      contextEl.textContent = scenario.situation;
      questionEl.textContent = scenario.question;
      optionsEl.innerHTML = '';

      scenario.options.forEach((option, optionIndex) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'quiz-option';
        button.textContent = option;
        button.addEventListener('click', () => handleAnswer(optionIndex));
        optionsEl.appendChild(button);
      });

      updateScore();
      nextBtn.textContent = index === scenarios.length - 1 ? 'Ver resultados' : 'Próximo cenário';
      card.classList.remove('is-fading');
    }, 150);
  };

  const handleAnswer = (selectedIndex) => {
    if (answered) return;
    answered = true;

    const scenario = scenarios[currentIndex];
    const buttons = Array.from(optionsEl.querySelectorAll('button'));
    const isCorrect = selectedIndex === scenario.correctIndex;

    if (isCorrect) {
      score += 1;
    }

    buttons.forEach((button, index) => {
      button.disabled = true;
      if (index === scenario.correctIndex) {
        button.classList.add('is-correct');
      } else if (index === selectedIndex) {
        button.classList.add('is-incorrect');
      }
    });

    setFeedback(isCorrect, isCorrect ? scenario.correctFeedback : scenario.incorrectFeedback);
    updateScore();
    nextBtn.disabled = false;
    if (currentIndex === scenarios.length - 1) {
      nextBtn.textContent = 'Ver resultados';
    }
  };

  const showResult = () => {
    card.hidden = true;
    resultEl.hidden = false;
    resultScoreEl.textContent = `Você acertou ${score} de ${scenarios.length} decisões.`;
  };

  const restart = () => {
    score = 0;
    currentIndex = 0;
    card.hidden = false;
    resultEl.hidden = true;
    renderScenario(currentIndex);
  };

  nextBtn.addEventListener('click', () => {
    if (!answered) return;
    if (currentIndex === scenarios.length - 1) {
      showResult();
      return;
    }
    currentIndex += 1;
    renderScenario(currentIndex);
  });

  restartBtn.addEventListener('click', restart);

  resultEl.hidden = true;
  card.hidden = false;
  renderScenario(currentIndex);
};

document.addEventListener('DOMContentLoaded', () => {
  document.body.classList.add('js-enabled');
  initMobileNav();
  setActivePageLink();
  initScrollSpy();
  initReveal();
  initFooterAccordion();
  initAgronomistChallenge();
});
