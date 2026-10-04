import { PAGES } from '../config/scenes.js';

/** Full-screen menu: the site's pages on the left, this experience on the right. */
export class Navigation {
  constructor(root, scenes, onJump) {
    this.btn = root.querySelector('#menuBtn');
    this.panel = root.querySelector('#menu');
    this.open = false;

    const pages = root.querySelector('#menuPages');
    PAGES.forEach((page) => {
      const li = document.createElement('li');
      if (page.scene) {
        const b = document.createElement('button');
        b.type = 'button';
        b.textContent = page.label;
        b.addEventListener('click', () => {
          onJump(scenes.findIndex((s) => s.id === page.scene));
          this.close();
        });
        li.appendChild(b);
      } else {
        const a = document.createElement('a');
        a.href = page.href;
        a.target = '_blank';
        a.rel = 'noopener';
        a.innerHTML = `${page.label}<span class="menu__ext">&#8599;</span>`;
        li.appendChild(a);
      }
      pages.appendChild(li);
    });

    const list = root.querySelector('#menuScenes');
    this.buttons = scenes.map((s, i) => {
      const li = document.createElement('li');
      const b = document.createElement('button');
      b.type = 'button';
      b.innerHTML = `<span class="menu__num">${String(i + 1).padStart(2, '0')}</span>${s.label}`;
      b.addEventListener('click', () => { onJump(i); this.close(); });
      li.appendChild(b);
      list.appendChild(li);
      return b;
    });

    this.btn.addEventListener('click', () => (this.open ? this.close() : this.show()));
    // clicking the field closes it; clicking the content does not
    this.panel.addEventListener('click', (e) => { if (e.target === this.panel) this.close(); });
    addEventListener('keydown', (e) => { if (e.key === 'Escape' && this.open) this.close(); });
    root.querySelector('#homeLink').addEventListener('click', (e) => { e.preventDefault(); onJump(0); });
  }

  show() {
    this.panel.hidden = false;
    requestAnimationFrame(() => {
      this.panel.classList.add('is-open');
      document.body.classList.add('menu-open');
    });
    this.btn.setAttribute('aria-expanded', 'true');
    this.btn.setAttribute('aria-label', 'Close menu');
    this.open = true;
  }

  close() {
    this.panel.classList.remove('is-open');
    document.body.classList.remove('menu-open');
    this.btn.setAttribute('aria-expanded', 'false');
    this.btn.setAttribute('aria-label', 'Open menu');
    this.open = false;
    setTimeout(() => { if (!this.open) this.panel.hidden = true; }, 600);
  }

  mark(index) {
    this.buttons.forEach((b, i) => b.classList.toggle('is-on', i === index));
  }
}
