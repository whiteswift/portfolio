
// Update side markers with the current section’s data-project
(function () {
  const sections = Array.from(document.querySelectorAll('[data-project]'));
  // const left = document.querySelector('.project-marker--left');
  const right = document.querySelector('.project-marker--right');

  if (!sections.length || !right) return;  // || !left

  let currentId = null;

  const io = new IntersectionObserver((entries) => {
    // choose the entry with largest intersection ratio that is actually intersecting
    const visible = entries
      .filter(e => e.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

    if (!visible) return;

    const name = visible.target.getAttribute('data-project');
    if (name && name !== currentId) {
      currentId = name;
      right.textContent = name;
      // left.textContent = name;
    }
  }, {
    root: null,
    threshold: [0.25, 0.5, 0.75], // update as the center chunk of a section is in view
    rootMargin: '0px 0px -20% 0px'
  });

  sections.forEach(section => io.observe(section));

  // Initialize markers to the first section on load
  const first = sections[0]?.getAttribute('data-project');
  if (first) {
    // left.textContent = first;
    right.textContent = first;
  }
})();
