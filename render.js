document.addEventListener('DOMContentLoaded', init, {once: true});

const dayNames = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'];
function humanTime(hours) {
  return `${(hours + 11) % 12 + 1}:00 ${hours < 12 ? 'A' : 'P'}M`;
}

const renderer = {};
function init() {
  const wrapper = document.getElementById('game');
  const hoverText = span('hover-text hidden', '');
  document.addEventListener('mousemove', e => {
    if (e.target.dataset.title) {
      hoverText.textContent = e.target.dataset.title;
      hoverText.classList.remove('hidden');
      hoverText.style.left = e.clientX + 'px';
      hoverText.style.top = e.clientY + 'px';
    } else {
      hoverText.classList.add('hidden');
    }
  });
  document.body.textContent = '';
  document.body.appendChild(createFragment([
    hoverText,
    span('floating', [
      renderer.dialog = span('dialog hidden', [
        renderer.dialogHeading = span('dialog-heading', ''),
        renderer.closeBtn = span('button close-button disabled', '[close]', clicks.closeDialog),
        '\n',
        renderer.dialogContent = span()
      ]),
      '\n',
      span('button info-button', '[info]', openDialog(clicks.showInfo)),
      ' ',
      span('button info-button', '[source]', 'https://github.com/SheepTester/gunn-student-sim/')
    ]),
    renderer.timeWrapper = span('hidden', [
      span('time-heading', 'TIME'),
      ' ',
      renderer.time = span('time', '4:00 PM'),
      ' ',
      renderer.day = span('day', 'MONDAY')
    ]),
    renderer.gradeMarker = span('hidden'),
    '\n',
    renderer.studySATBtn = span('button', '[study for SAT/ACT]', clicks.studySAT)
  ]));
}

function createFragment(elems) {
  const frag = document.createDocumentFragment();
  elems.forEach(e => frag.appendChild(typeof e === 'string' ? document.createTextNode(e) : e));
  return frag;
}
function span(classes = '', content = '', onclick = null, hoverText = '') {
  const span = document.createElement(typeof onclick === 'string' ? 'a' : 'span');
  if (Array.isArray(content)) {
    span.appendChild(createFragment(content));
  } else {
    span.textContent = content;
  }
  span.className = classes;
  if (hoverText) span.dataset.title = hoverText;
  if (typeof onclick === 'string') {
    span.href = onclick;
  } else if (onclick) {
    span.addEventListener('click', e => {
      if (!span.classList.contains('disabled')) {
        onclick();
      }
    });
    span.tabIndex = 0;
  }
  return span;
}
function disableBtn(btn, why) {
  btn.classList.add('disabled');
  btn.tabIndex = -1;
  if (why) btn.dataset.title = why;
}
function enableBtn(btn) {
  btn.classList.remove('disabled');
  btn.tabIndex = 0;
  btn.dataset.title = '';
}
function openDialog(listener) {
  return () => {
    renderer.closeBtn.classList.remove('disabled');
    renderer.dialog.classList.remove('hidden');
    listener();
  };
}
