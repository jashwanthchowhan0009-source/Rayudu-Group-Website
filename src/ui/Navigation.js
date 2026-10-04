/** The index: every scene, plus the things people actually need. */
export class Navigation {
  constructor(root, scenes, onJump) {
    this.btn = root.querySelector('#indexBtn');
    this.panel = root.querySelector('#indexPanel');
    this.list = root.querySelector('#indexList');
    this.open = false;

    scenes.forEach((s, i) => {
      const li = document.createElement('li');
      const b = document.createElement('button');
      b.type = 'button';
      b.innerHTML = `<span class="index__num">${String(i + 1).padStart(2, '0')}</span>${s.label}`;
      b.addEventListener('click', () => { onJump(i); this.close(); });
      li.appendChild(b);
      this.list.appendChild(li);
      s._navButton = b;
    });
    this.buttons = scenes.map((s) => s._navButton);

    this.btn.addEventListener('click', () => (this.open ? this.close() : this.show()));
    addEventListener('keydown', (e) => { if (e.key === 'Escape' && this.open) this.close(); });
    root.querySelector('#homeLink').addEventListener('click', (e) => { e.preventDefault(); onJump(0); });
  }

  show() {
    this.panel.hidden = false;
    requestAnimationFrame(() => this.panel.classList.add('is-open'));
    this.btn.setAttribute('aria-expanded', 'true');
    this.open = true;
  }

  close() {
    this.panel.classList.remove('is-open');
    this.btn.setAttribute('aria-expanded', 'false');
    this.open = false;
    setTimeout(() => { if (!this.open) this.panel.hidden = true; }, 420);
  }

  mark(index) {
    this.buttons.forEach((b, i) => b.classList.toggle('is-on', i === index));
  }
}
