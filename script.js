(() => {
  const body = document.body;
  body.classList.add('motion-ready');

  const progress = document.querySelector('.reading-progress');
  const updateProgress = () => {
    const scrollable = document.documentElement.scrollHeight - innerHeight;
    const amount = scrollable > 0 ? (scrollY / scrollable) * 100 : 0;
    progress.style.width = `${Math.min(100, Math.max(0, amount))}%`;
  };
  addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();

  const revealTargets = document.querySelectorAll('.case-chapter, .film');
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -8% 0px' });
    revealTargets.forEach((item) => revealObserver.observe(item));
  } else {
    revealTargets.forEach((item) => item.classList.add('is-revealed'));
  }

  const layouts = [
    {
      src: 'assets/layout-shuki-uv.webp',
      alt: 'Isolated storyboard layout of Shuki restraining UV on the ferry',
      caption: 'Shuki + UV — keep the central physical interaction together.',
      insight: 'I kept Shuki and UV together because their poses depend on each other. The other figures could be resolved with a simpler reference.'
    },
    {
      src: 'assets/layout-sunil.webp',
      alt: 'Isolated storyboard layout showing Sunil positioned beside UV on the ferry',
      caption: 'Sunil — isolate his placement and restraining posture.',
      insight: 'Sunil’s isolated layout clarifies how he leans into the centre without forcing the model to solve every other figure at the same time.'
    },
    {
      src: 'assets/layout-nishi.webp',
      alt: 'Isolated storyboard layout showing Nishi in the ferry foreground',
      caption: 'Nishi — preserve foreground scale and posture.',
      insight: 'Nishi sits closest to camera, so her scale matters. The isolated layout preserves the foreground relationship and leaves the environment untouched.'
    },
    {
      src: 'assets/layout-badri.webp',
      alt: 'Isolated storyboard layout showing Badri at the rear of the ferry group',
      caption: 'Badri — establish the rear position that supports his later reaction.',
      insight: 'Badri’s position is more than blocking: it prepares the eyeline change when he notices the mist. The simplified frame makes that placement explicit.'
    }
  ];
  const layoutImage = document.querySelector('#layout-image');
  const layoutCount = document.querySelector('#layout-count');
  const layoutInsight = document.querySelector('#layout-insight');
  const enlargeLayout = document.querySelector('#enlarge-layout');
  document.querySelectorAll('.layout-option').forEach((button) => {
    button.addEventListener('click', () => {
      const index = Number(button.dataset.layout);
      const selected = layouts[index];
      document.querySelectorAll('.layout-option').forEach((item) => {
        const active = item === button;
        item.classList.toggle('is-active', active);
        item.setAttribute('aria-pressed', String(active));
      });
      layoutImage.src = selected.src;
      layoutImage.alt = selected.alt;
      layoutCount.textContent = `${String(index + 1).padStart(2, '0')} / 04`;
      layoutInsight.textContent = selected.insight;
      enlargeLayout.dataset.image = selected.src;
      enlargeLayout.dataset.caption = selected.caption;
    });
  });

  const comparison = document.querySelector('.comparison');
  const slider = document.querySelector('#compare-slider');
  slider?.addEventListener('input', () => {
    const value = Number(slider.value);
    comparison.style.setProperty('--split', `${value}%`);
    slider.setAttribute('aria-valuetext', `${value} percent blocking sketch, ${100 - value} percent master image`);
  });

  const player = document.querySelector('#sequence-player');
  const beats = [...document.querySelectorAll('.beat')];
  const markBeat = (activeButton) => {
    beats.forEach((beat) => {
      const active = beat === activeButton;
      beat.classList.toggle('is-active', active);
      beat.setAttribute('aria-pressed', String(active));
    });
  };
  beats.forEach((beat) => {
    beat.addEventListener('click', async () => {
      player.currentTime = Number(beat.dataset.time);
      markBeat(beat);
      try { await player.play(); } catch (_) { /* Browser may require another gesture. */ }
    });
  });
  player?.addEventListener('timeupdate', () => {
    let current = beats[0];
    beats.forEach((beat) => {
      if (player.currentTime >= Number(beat.dataset.time)) current = beat;
    });
    markBeat(current);
  });

  const reelLaunch = document.querySelector('#reel-launch');
  reelLaunch?.addEventListener('click', () => {
    const iframe = document.createElement('iframe');
    iframe.src = 'https://www.youtube-nocookie.com/embed/fptIcaWz5j4?autoplay=1&rel=0';
    iframe.title = 'JaduQuest 3 Winner Reveal';
    iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
    iframe.allowFullscreen = true;
    reelLaunch.replaceWith(iframe);
  });

  const dialog = document.querySelector('#image-dialog');
  const dialogImage = document.querySelector('#dialog-image');
  const dialogCaption = document.querySelector('#image-dialog-caption');
  const closeDialog = document.querySelector('#close-image');
  const openDialog = (trigger) => {
    dialogImage.src = trigger.dataset.image;
    dialogImage.alt = trigger.dataset.caption || '';
    dialogCaption.textContent = trigger.dataset.caption || '';
    dialog.showModal();
  };
  document.addEventListener('click', (event) => {
    const trigger = event.target.closest('[data-image]');
    if (trigger) openDialog(trigger);
  });
  closeDialog?.addEventListener('click', () => dialog.close());
  dialog?.addEventListener('click', (event) => {
    if (event.target === dialog) dialog.close();
  });

  const copyEmail = document.querySelector('#copy-email');
  const copyStatus = document.querySelector('#copy-status');
  copyEmail?.addEventListener('click', async () => {
    const email = 'stephenjacobvarghese@gmail.com';
    try {
      await navigator.clipboard.writeText(email);
      copyEmail.textContent = 'Copied';
      copyStatus.textContent = 'Email address copied';
      setTimeout(() => { copyEmail.textContent = 'Copy email'; }, 1600);
    } catch (_) {
      location.href = `mailto:${email}`;
    }
  });

  const chapterLinks = [...document.querySelectorAll('.chapter-nav a')];
  const chapters = chapterLinks.map((link) => document.querySelector(link.getAttribute('href'))).filter(Boolean);
  if ('IntersectionObserver' in window) {
    const chapterObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const target = chapterLinks.find((link) => link.getAttribute('href') === `#${entry.target.id}`);
        chapterLinks.forEach((link) => link.classList.toggle('is-active', link === target));
      });
    }, { rootMargin: '-36% 0px -55% 0px', threshold: 0 });
    chapters.forEach((chapter) => chapterObserver.observe(chapter));
  }
})();
