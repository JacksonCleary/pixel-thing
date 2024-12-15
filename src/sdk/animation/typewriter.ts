const RANDOM_CHARS = [
  '!',
  '@',
  '#',
  '$',
  '%',
  '&',
  '*',
  ' ',
  '(',
  ')',
  '+',
  '-',
  '=',
  '[',
  ']',
  '{',
  '}',
  '|',
  ';',
  ':',
  ',',
  '.',
  '<',
  '>',
  '/',
  '?',
];

interface TypewriterConfig {
  element: HTMLElement;
  finalText: string;
  randomCharCount: number;
  initialDelay: number;
  typeDelay: number;
  randomDelay: number;
}

const COLOR_VARS = [
  '--color-green',
  '--color-orange',
  '--color-red',
  '--color-blue',
  '--color-yellow',
];

export const typewrite = async (config: TypewriterConfig): Promise<void> => {
  const { element, finalText, initialDelay, randomDelay } = config;

  if (!(element instanceof HTMLElement)) {
    throw new Error('Element must be an HTMLElement');
  }

  // Initial delay
  await new Promise((r) => setTimeout(r, initialDelay));

  const trimmedText = finalText.trim();
  const chars = trimmedText.split('');

  // Create array of character elements
  element.textContent = '';
  const spans = chars.map((char, i) => {
    const span = document.createElement('span');
    span.classList.add('typewriter-char'); // Add class instead of inline style
    span.textContent = char;
    element.appendChild(span);
    return span;
  });

  // Animate each character
  const animations = spans.map((span, i) => async () => {
    await new Promise((r) => setTimeout(r, i * 5)); // Stagger start times

    span.classList.add('visible');
    const transitionCount = Math.floor(Math.random() * 5) + 1;
    const originalColor = span.style.color;
    span.style.opacity = '1';

    // Random char transitions
    for (let j = 0; j < transitionCount; j++) {
      span.textContent =
        RANDOM_CHARS[Math.floor(Math.random() * RANDOM_CHARS.length)];
      const randomColor = `var(${
        COLOR_VARS[Math.floor(Math.random() * COLOR_VARS.length)]
      })`;
      span.style.color = randomColor;
      await new Promise((r) => setTimeout(r, randomDelay));
    }

    // Final character
    span.textContent = chars[i];
    span.style.color = originalColor;
  });

  // Run animations concurrently
  await Promise.all(animations.map((a) => a()));
};

export const typewriterInit = async (domElements: string | Element) => {
  let typeWriterItems: Element[] = [];
  if (typeof domElements === 'string') {
    typeWriterItems = Array.from(document.querySelectorAll(domElements));
  } else {
    typeWriterItems = [domElements];
  }

  // Create array of promises for all nav items
  const animations = typeWriterItems
    .map((item, index) => {
      if (item instanceof HTMLElement) {
        const finalText = item.textContent || '';
        item.textContent = '';

        return typewrite({
          element: item,
          finalText,
          randomCharCount: Math.floor(Math.random() * 3) + 1,
          initialDelay: index * 100, // Stagger start times
          typeDelay: 100,
          randomDelay: 50,
        });
      }
    })
    .filter((p): p is Promise<void> => p !== undefined);

  // Run all animations concurrently
  await Promise.all(animations);
};
