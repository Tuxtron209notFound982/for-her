const messages = [
  'Te amo', 'I love you', 'Je t’aime', 'Ti amo', 'Eu te amo', 'Ich liebe dich',
  '愛してる', '사랑해', '我爱你', 'Я тебя люблю', 'أحبك', 'Te iubesc'
];
const petals = document.querySelector('#petals');
const stamens = document.querySelector('#stamens');
const garden = document.querySelector('#garden');
const flower = document.querySelector('.flower');
const button = document.querySelector('#bloomButton');
const hint = document.querySelector('#hint');
const finalMessage = document.querySelector('#finalMessage');
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const rings = [
  { name: 'outer', count: 12, length: 166, width: 43, offset: 0, depth: 7, labelFraction: .56, labelLength: 72 },
  { name: 'middle', count: 12, length: 137, width: 37, offset: 45, depth: 3, labelFraction: .55, labelLength: 62 },
  { name: 'inner', count: 12, length: 105, width: 29, offset: 15, depth: 0, labelFraction: .53, labelLength: 48 }
];

rings.forEach((ring, ringIndex) => {
  for (let i = 0; i < ring.count; i += 1) {
    const angle = ring.offset + (360 / ring.count) * i;
    const tipY = 278 - ring.length;
    const wide = ring.width;
    const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    group.classList.add('petal', `petal-${ring.name}`);
    group.dataset.ring = ring.name;
    group.style.setProperty('--angle', `${angle}deg`);
    group.style.setProperty('--depth', `${ring.depth + (i % 3) * 2}px`);
    group.style.setProperty('--tilt', `${i % 2 === 0 ? 5 : -5}deg`);
    group.style.setProperty('--hue', `${ringIndex * 8 - 5}deg`);

    const shape = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    shape.classList.add('petal-shape');
    shape.setAttribute('d', `M250 278 C${250 - wide * 1.35} ${278 - ring.length * .25}, ${250 - wide * .95} ${278 - ring.length * .78}, 250 ${tipY} C${250 + wide * .95} ${278 - ring.length * .78}, ${250 + wide * 1.35} ${278 - ring.length * .25}, 250 278Z`);
    group.appendChild(shape);

    const vein = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    vein.classList.add('petal-vein');
    vein.setAttribute('d', `M250 272 Q250 ${278 - ring.length * .48} 250 ${tipY + 15} M250 ${278 - ring.length * .3} Q${250 - wide * .42} ${278 - ring.length * .48} ${250 - wide * .5} ${278 - ring.length * .63} M250 ${278 - ring.length * .3} Q${250 + wide * .42} ${278 - ring.length * .48} ${250 + wide * .5} ${278 - ring.length * .63}`);
    group.appendChild(vein);

    {
      const message = messages[i % messages.length];
      const labelY = 278 - ring.length * ring.labelFraction;
      group.setAttribute('aria-label', message);
      const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      label.classList.add('petal-label');
      label.setAttribute('x', '250');
      label.setAttribute('y', String(labelY));
      label.setAttribute('transform', `rotate(${angle >= 180 ? 90 : -90} 250 ${labelY})`);
      label.setAttribute('textLength', String(ring.labelLength));
      label.setAttribute('lengthAdjust', 'spacingAndGlyphs');
      label.textContent = message;
      group.appendChild(label);
    }
    petals.appendChild(group);
  }
});

for (let i = 0; i < 24; i += 1) {
  const angle = (Math.PI * 2 * i) / 24;
  const dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  dot.classList.add('stamen');
  dot.setAttribute('cx', String(250 + Math.cos(angle) * (12 + (i % 2) * 5)));
  dot.setAttribute('cy', String(278 + Math.sin(angle) * (12 + (i % 2) * 5)));
  dot.setAttribute('r', i % 3 === 0 ? '2.8' : '2');
  dot.style.setProperty('--stamen-delay', `${i * 18}ms`);
  stamens.appendChild(dot);
}

garden.addEventListener('pointermove', (event) => {
  if (event.pointerType !== 'mouse') return;
  const bounds = garden.getBoundingClientRect();
  const x = (event.clientX - bounds.left) / bounds.width - 0.5;
  const y = (event.clientY - bounds.top) / bounds.height - 0.5;
  flower.style.setProperty('--view-y', `${x * 8}deg`);
  flower.style.setProperty('--view-x', `${-y * 7}deg`);
});
garden.addEventListener('pointerleave', () => {
  flower.style.setProperty('--view-x', '0deg');
  flower.style.setProperty('--view-y', '0deg');
});

button.addEventListener('click', async () => {
  if (button.disabled) return;
  button.disabled = true;
  hint.textContent = 'Una gota despierta la semilla…';
  garden.classList.add('blooming');
  await wait(850);
  hint.textContent = 'El tallo crece y el capullo empieza a abrirse…';
  garden.classList.add('unfolding');
  for (const ringName of ['outer', 'middle', 'inner']) {
    const ringPetals = [...petals.querySelectorAll(`[data-ring="${ringName}"]`)];
    for (const petal of ringPetals) {
      petal.classList.add('is-open');
      await wait(ringName === 'inner' ? 80 : 100);
    }
    await wait(120);
  }
  stamens.classList.add('visible');
  await wait(450);
  finalMessage.classList.add('visible');
  hint.textContent = 'Doce formas de decirlo, y todas significan lo mismo: te amo 💛';
  button.textContent = 'Flor florecida para ti ✿';
});
