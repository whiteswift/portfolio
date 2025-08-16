
(function () {
  document.querySelectorAll('[data-carousel]').forEach(setupCarousel);

  function setupCarousel(root) {
    const track = root.querySelector('[data-track]');
    const slides = Array.from(root.querySelectorAll('[data-slide]'));
    const prev = root.querySelector('[data-prev]');
    const next = root.querySelector('[data-next]');
    const dotsWrap = root.querySelector('[data-dots]');
    let index = 0;
    let startX = null, currentX = 0, isPointer = false;

    // Dots
    const dots = slides.map((_, i) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.addEventListener('click', () => go(i));
      dotsWrap.appendChild(b);
      return b;
    });

    function update() {
      track.style.transform = `translateX(${index * -100}%)`;
      prev.disabled = index === 0;
      next.disabled = index === slides.length - 1;
      dots.forEach((d, i) => d.setAttribute('aria-current', i === index ? 'true' : 'false'));
    }

    function pauseAll() {
      slides.forEach(slide => {
        const v = slide.querySelector('video');
        if (v && !v.paused) { try { v.pause(); } catch (e) { } }
      });
    }

    function go(i) {
      if (i < 0 || i >= slides.length) return;
      pauseAll();
      index = i;
      update();
    }

    prev.addEventListener('click', () => go(index - 1));
    next.addEventListener('click', () => go(index + 1));

    // Keyboard support when focused inside carousel
    root.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') { e.preventDefault(); go(index - 1); }
      if (e.key === 'ArrowRight') { e.preventDefault(); go(index + 1); }
    });

    // Basic swipe (pointer events)
    const viewport = root.querySelector('[data-viewport]');
    viewport.addEventListener('pointerdown', (e) => {
      isPointer = true;
      startX = e.clientX;
      viewport.setPointerCapture(e.pointerId);
    });
    viewport.addEventListener('pointermove', (e) => {
      if (!isPointer) return;
      currentX = e.clientX;
    });
    viewport.addEventListener('pointerup', (e) => {
      if (!isPointer) return;
      const dx = currentX - startX;
      if (Math.abs(dx) > 40) {
        if (dx < 0) go(index + 1);
        else go(index - 1);
      }
      isPointer = false; startX = 0; currentX = 0;
      viewport.releasePointerCapture(e.pointerId);
    });

    // Init
    update();
  }
})();
