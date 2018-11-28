// URL PARAMETERS
// sort - sort mode
const params = {};
if (window.location.search) {
  window.location.search.slice(1).split('&').forEach(entry => {
    const equalSignLoc = entry.indexOf('=');
    if (~equalSignLoc) {
      params[entry.slice(0, equalSignLoc)] = entry.slice(equalSignLoc + 1);
    } else {
      params[entry] = true;
    }
  });
}

async function init() {
  document.body.appendChild(createFragment([
    renderer.dialogHeading = span('dialog-heading', 'LEADERBOARD'),
    renderer.closeBtn = span('button close-button', '[back]', './'),
    '\n\n',
    renderer.content = span('', 'Fetching leaderboard...')
  ]));
  const sort = params.sort || 'normal';
  const leaderboard = Object.values(await fetch('https://test-9d9aa.firebaseapp.com/getLeaderboard').then(r => r.json()));
  if (leaderboard.length === 0) {
    renderer.content.innerHTML = 'Nothing here...?';
    return;
  }
  switch (sort) {
    case 'normal':
      leaderboard.sort((a, b) => b.score - a.score);
      break;
    case 'chrono':
      leaderboard.sort((a, b) => Date.parse(b.time) - Date.parse(a.time));
      break;
    case 'type':
      const typeValues = {disowned: 2, suspended: 1, graduated: 0}
      leaderboard.sort((a, b) => a.manner === b.manner ? b.score - a.score : typeValues[a.manner] - typeValues[b.manner]);
      break;
  }
  let maxScoreWidth = 5;
  leaderboard.forEach(({score}) => {
    const len = score.toString().length;
    if (len > maxScoreWidth) maxScoreWidth = len;
  });
  renderer.content.innerHTML = '';
  renderer.content.appendChild(createFragment([
    span('score-heading', 'SCORE'.padStart(maxScoreWidth, ' '), '?sort=normal', 'Sort by score'),
    span('divider', ' | '),
    span('score-heading', 'TIME                    ', '?sort=chrono', 'Sort chronologically'),
    span('divider', ' | '),
    span('score-heading', 'MANNER', '?sort=type', 'Group by endings'),
    ...leaderboard.map(({url, time, score, manner}) => span('', [
      '\n',
      score.toString().padStart(maxScoreWidth, ' '),
      span('divider', ' | '),
      span('button', time, url, url),
      span('divider', ' | '),
      manner
    ]))
  ]));
}
