const toggleButton = document.getElementById('magicToggle');
const heartField = document.querySelector('.heart-field');
const noButton = document.querySelector('.no-btn');

if (toggleButton && heartField) {
  toggleButton.addEventListener('click', () => {
    const isActive = document.body.classList.toggle('celebrating');
    toggleButton.textContent = isActive ? 'Love AWNN :)' : 'Love OFF :(';

    if (isActive) {
      const fragment = document.createDocumentFragment();
      for (let i = 0; i < 24; i += 1) {
        const heart = document.createElement('span');
        heart.className = 'heart-particle';
        heart.textContent = i % 2 === 0 ? '❤' : '♥';
        heart.style.left = `${Math.random() * 100}%`;
        heart.style.setProperty('--drift', `${(Math.random() - 0.5) * 220}px`);
        heart.style.setProperty('--float-duration', `${8 + Math.random() * 6}s`);
        heart.style.animationDelay = `${Math.random() * 2}s`;
        fragment.appendChild(heart);
      }
      heartField.appendChild(fragment);

      setTimeout(() => {
        heartField.innerHTML = '';
      }, 8500);
    }
  });
}

if (noButton) {
  noButton.addEventListener('mouseenter', (event) => {
    const answers = document.querySelector('.question-answers');
    if (!answers) return;

    const answerButtons = Array.from(document.querySelectorAll('.answer-btn'));
    const buttonWidth = noButton.offsetWidth;
    const buttonHeight = noButton.offsetHeight;
    const edgeBuffer = 28;
    const minX = edgeBuffer;
    const minY = edgeBuffer;
    const maxX = Math.max(answers.clientWidth - buttonWidth - edgeBuffer, minX);
    const maxY = Math.max(answers.clientHeight - buttonHeight - edgeBuffer, minY);
    const containerRect = answers.getBoundingClientRect();
    const pointerX = event.clientX - containerRect.left;
    const pointerY = event.clientY - containerRect.top;

    const yesBoxes = answerButtons.map((button) => {
      const rect = button.getBoundingClientRect();
      return {
        left: rect.left - containerRect.left,
        top: rect.top - containerRect.top,
        right: rect.right - containerRect.left,
        bottom: rect.bottom - containerRect.top,
      };
    });

    let bestX = minX;
    let bestY = minY;
    let bestDistance = -Infinity;
    let placed = false;

    for (let i = 0; i < 500; i += 1) {
      const x = minX + Math.random() * (maxX - minX);
      const y = minY + Math.random() * (maxY - minY);

      const noRect = {
        left: x,
        top: y,
        right: x + buttonWidth,
        bottom: y + buttonHeight,
      };

      const overlapsYesButton = yesBoxes.some((box) =>
        noRect.left < box.right &&
        noRect.right > box.left &&
        noRect.top < box.bottom &&
        noRect.bottom > box.top
      );

      if (overlapsYesButton) {
        continue;
      }

      const distance = (x - pointerX) ** 2 + (y - pointerY) ** 2;
      if (distance > bestDistance) {
        bestDistance = distance;
        bestX = x;
        bestY = y;
        placed = true;
      }
    }

    if (!placed) {
      const isLeftSide = pointerX < answers.clientWidth / 2;
      const isTopSide = pointerY < answers.clientHeight / 2;
      bestX = isLeftSide ? maxX : minX;
      bestY = isTopSide ? maxY : minY;
    }

    noButton.style.position = 'absolute';
    noButton.style.left = `${bestX}px`;
    noButton.style.top = `${bestY}px`;
    noButton.style.transform = 'none';
  });
}
