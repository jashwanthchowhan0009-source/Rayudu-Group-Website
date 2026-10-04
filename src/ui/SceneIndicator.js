/** The small instruments: progress rail, counter, and the scene switcher. */
export class SceneIndicator {
  constructor(root, scenes, onJump) {
    this.rail = root.querySelector('#rail');
    this.now = root.querySelector('#counterNow');
    this.all = root.querySelector('#counterAll');
    this.label = root.querySelector('#counterLabel');
    this.pill = root.querySelector('#switchPill');
    this.scenes = scenes;
    this.index = -1;

    this.all.textContent = String(scenes.length).padStart(2, '0');
    this.ticks = scenes.map((s, i) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'rail__tick';
      b.setAttribute('aria-label', s.label);
      b.addEventListener('click', () => onJump(i));
      this.rail.appendChild(b);
      return b;
    });

    root.querySelector('#prevBtn').addEventListener('click', () => onJump(Math.max(0, this.index - 1)));
    root.querySelector('#nextBtn').addEventListener('click', () => onJump(Math.min(scenes.length - 1, this.index + 1)));
    this.prev = root.querySelector('#prevBtn');
    this.next = root.querySelector('#nextBtn');
  }

  update(index, progress) {
    this.rail.style.setProperty('--progress', progress.toFixed(4));
    if (index === this.index) return;
    this.index = index;
    const scene = this.scenes[index];
    this.now.textContent = String(index + 1).padStart(2, '0');
    this.label.textContent = scene.eyebrow;
    this.pill.textContent = scene.label;
    this.ticks.forEach((t, i) => t.classList.toggle('is-on', i === index));
    this.prev.disabled = index === 0;
    this.next.disabled = index === this.scenes.length - 1;
  }
}
