/** The small spatial instruments: progress rail, counter, scroll cue. */
export class SceneIndicator {
  constructor(root, scenes, onJump) {
    this.rail = root.querySelector('#rail');
    this.now = root.querySelector('#counterNow');
    this.all = root.querySelector('#counterAll');
    this.label = root.querySelector('#counterLabel');
    this.cue = root.querySelector('#cue');
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
  }

  update(index, progress) {
    this.rail.style.setProperty('--progress', progress.toFixed(4));
    if (index === this.index) return;
    this.index = index;
    this.now.textContent = String(index + 1).padStart(2, '0');
    this.label.textContent = this.scenes[index].label;
    this.ticks.forEach((t, i) => t.classList.toggle('is-on', i === index));
    this.cue.classList.toggle('is-end', index === this.scenes.length - 1);
    this.cue.firstChild.nextSibling.textContent =
      index === this.scenes.length - 1 ? 'Back to the top' : 'Scroll to explore';
  }
}
