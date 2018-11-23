const config = {
  MAX_SAT_STUDY: 50
};

const gameState = {
  accumulativeDay: 0,
  day: 0,
  time: 16,
  studySAT: 0,
  homeworks: 0,
  hwRate: 3,
  sleeplessNights: 0,
  tests: 0,
  grade: 100,
  friends: 3,
  testReadiness: 0,
  testsTaken: 1,
  friendExpectation: 3,
  missedSELF: false,
  continueResolve: null,
  self: false,
  selfLength: 1,
  scolded: false,
  totalSAT: 0
};

function updateHomework() {
  renderer.hwCount.textContent = gameState.homeworks;
  if (renderer.tests) {
    renderer.tests.textContent = gameState.tests;
    renderer.testReadiness.textContent = Math.round(gameState.testReadiness * 100) / 100;
    if (gameState.tests) enableBtn(renderer.studyBtn);
    else disableBtn(renderer.studyBtn, 'You don\'t have a test tomorrow!');
  }
  if (gameState.homeworks === 0) {
    disableBtn(renderer.doHWBtn, 'No more homework!');
    if (gameState.tests && gameState.testReadiness < 50) {
      disableBtn(renderer.studySATBtn, 'You should at least be 50% prepared for your test!');
    } else {
      enableBtn(renderer.studySATBtn);
    }
  } else {
    enableBtn(renderer.doHWBtn);
    disableBtn(renderer.studySATBtn, 'Finish your homework first!');
  }
  if (gameState.scolded) {
    disableBtn(renderer.studySATBtn, 'You cannot concentrate because your parents are scolding you.');
    disableBtn(renderer.studyBtn, 'You cannot concentrate because your parents are scolding you.');
  }
}
function addHours(hours) {
  const days = Math.floor((gameState.time + hours) / 24);
  gameState.time = (gameState.time + hours) % 24;
  gameState.day = (gameState.day + days) % 5;
  renderer.time.textContent = humanTime(gameState.time);
  renderer.day.textContent = dayNames[gameState.day];
}

function calculateScore(win) {
  const score = gameState.grade + gameState.friends * 20 + gameState.studySAT * 2 + gameState.accumulativeDay * 50;
  return Math.round(score);
}

function schoolContinue() {
  return new Promise(res => gameState.continueResolve = res);
}
async function assembly(lines, customHeading = 'ASSEMBLY') {
  let skip = false, skipBtn;
  renderer.schoolContent.appendChild(createFragment([
    '\n',
    span(customHeading.toLowerCase() + '-heading', customHeading),
    ' ',
    skipBtn = span('button', '[skip]', () => {
      skip = true;
      if (gameState.continueResolve) gameState.continueResolve();
    }),
    '\n',
    '\n'
  ]));
  for (let i = 0; i < lines.length; i++) {
    renderer.schoolContent.appendChild(createFragment([
      span('assembly-line-' + lines[i].slice(0, 2), lines[i].slice(4)),
      '\n',
      '\n'
    ]));
    if (!skip) await schoolContinue();
  }
  skipBtn.classList.add('disabled');
}
async function beginSchool() {
  disableBtn(renderer.studySATBtn, 'You\'re at school!');
  disableBtn(renderer.doHWBtn, 'You\'re at school!');
  disableBtn(renderer.sleepBtn, 'You\'re at school!');
  if (renderer.studyBtn) disableBtn(renderer.studyBtn, 'You\'re at school!');
  if (gameState.scolded) gameState.scolded = false;
  gameState.accumulativeDay++;
  if (gameState.accumulativeDay === 1) {
    document.body.insertBefore(createFragment([
      ' ',
      span('grade-heading', 'GRADE'),
      ' ',
      renderer.grade = span('grade', '100', null, 'Must be at least 90%'),
      '%'
    ]), renderer.gradeMarker);
    document.body.appendChild(createFragment([
      '\n\n',
      renderer.school = span('', [
        span('school-heading', 'GUNN'),
        '\n',
        renderer.schoolContent = span(),
        renderer.schoolContBtn = span('button', '[ok]', clicks.schoolContinue)
      ])
    ]));
  } else {
    renderer.school.classList.remove('hidden');
    enableBtn(renderer.schoolContBtn);
  }
  if (gameState.sleeplessNights > 2 && gameState.tests) {
    renderer.schoolContent.appendChild(createFragment([
      span('', 'You didn\'t sleep enough and ended up sleeping during the test(s).'),
      '\n'
    ]));
    for (let i = 0; i < gameState.tests; i++) {
      gameState.grade = (gameState.grade * gameState.testsTaken) / (gameState.testsTaken + 1);
      gameState.testsTaken++;
    }
    renderer.grade.textContent = Math.round(gameState.grade * 100) / 100;
    await schoolContinue();
  } else if (gameState.missedSELF) {
    renderer.schoolContent.appendChild(createFragment([
      span('', 'The school pulled you out of class to interrogate you about your absence during SELF' + (gameState.tests ? ', and you missed your test.' : '.')),
      '\n'
    ]));
    for (let i = 0; i < gameState.tests; i++) {
      gameState.grade = (gameState.grade * gameState.testsTaken) / (gameState.testsTaken + 1);
      gameState.testsTaken++;
    }
    renderer.grade.textContent = Math.round(gameState.grade * 100) / 100;
    gameState.missedSELF = false;
    await schoolContinue();
  } else {
    for (let i = 0; i < gameState.tests; i++) {
      const threshold = Math.random() * 50 + 25;
      const score = Math.min(100, gameState.testReadiness + 100 - threshold);
      gameState.grade = (gameState.grade * gameState.testsTaken + score) / (gameState.testsTaken + 1);
      gameState.testsTaken++;
      renderer.schoolContent.appendChild(createFragment([
        span('', `You receive ${Math.round(score * 100) / 100}% on a test.`),
        '\n'
      ]));
      await schoolContinue();
    }
  }
  gameState.grade -= gameState.homeworks;
  renderer.grade.textContent = Math.round(gameState.grade * 100) / 100;
  if (gameState.accumulativeDay === 1) {
    document.body.insertBefore(createFragment([
      '\n',
      renderer.studyBtn = span('button disabled', '[study for tests]', clicks.studyTest, 'You\'re at school!'),
      ' You are ',
      renderer.testReadiness = span('test-readiness', '0'),
      '% ready for the test(s) tomorrow, and you have ',
      renderer.tests = span('upcoming-tests', '0'),
      ' test(s) tomorrow.'
    ]), renderer.testStudyMarker);
  } else if (gameState.accumulativeDay === 2) {
    await assembly([
      '--: Carlomagno and Firenzi wave to the audience.',
      'cc: Carlomagno: Good morning! We are hard at work on a new fun extension to SELF for you guys to help you reduce stress.',
      'tf: Firenzi: We plan to introduce this program tomorrow, so stay tuned!',
      'cc: Carlomagno: However, today we will give you a brief preview of what is to come!',
      'tf: Firenzi: Friendships are extremely important, even more important that your schoolwork.',
      'cc: Carlomagno: That is why today, we are giving you guys a challenge: maintain at least THREE friendships! Most of you already have three friends, so this should not be hard.',
      'tf: Firenzi: Do note that friendships require MAINTENANCE. However, we will be concerned if you do not satisfy this minimum.'
    ]);
    document.body.insertBefore(createFragment([
      ' ',
      span('friend-heading', 'FRIENDS'),
      ' ',
      renderer.friends = span('friends', '3', null, 'You need a minimum of 3 friends.')
    ]), renderer.gradeMarker);
  } else if (gameState.accumulativeDay === 3) {
    await assembly([
      '--: Carlomagno and Firenzi wave to the audience.',
      'cc: Carlomagno: Good morning! Yesterday, we hinted at our destressing program that we have been working on for the last few months.',
      'tf: Firenzi: Today is the day! We are proud to announce to you... afterschool SELF!',
      '--: The students do not react positively to this.',
      'cc: Carlomagno: Come on! You will enjoy this program for sure! This program is currently mandatory for sophomores only, but other grades are free to join in as well!',
      'tf: Firenzi: This SELF session is only an hour long, and then you are free to leave!'
    ]);
    gameState.self = true;
  }
  gameState.hwRate += 0.7;
  gameState.homeworks += Math.floor(gameState.hwRate);
  renderer.hwCount.textContent = gameState.homeworks;
  gameState.tests = Math.floor(Math.random() * gameState.hwRate);
  renderer.tests.textContent = gameState.tests;
  gameState.testReadiness = 0;
  renderer.testReadiness.textContent = gameState.testReadiness;
  renderer.schoolContent.appendChild(createFragment([
    span('', `You leave school with ${Math.floor(gameState.hwRate)} more homework assignment(s) and ${gameState.tests} test(s) to prepare for tomorrow.`),
    '\n\n'
  ]));
  await schoolContinue();
  addHours(8);
  if (gameState.self) {
    let resolve, promise = new Promise(res => resolve = res), opt1, opt2;
    renderer.schoolContBtn.classList.add('disabled');
    renderer.schoolContent.appendChild(createFragment([
      span('', `Go to afterschool SELF?`),
      '\n',
      opt1 = span('button', '[ok]', () => resolve(true)),
      ' ',
      opt2 = span('button', '[no]', () => resolve(false)),
      '\n\n'
    ]));
    const answer = await promise;
    renderer.schoolContBtn.classList.remove('disabled');
    opt1.classList.add('disabled');
    opt2.classList.add('disabled');
    if (answer) {
      addHours(gameState.selfLength);
    } else {
      gameState.missedSELF = true;
    }
  }
  if (gameState.friends < gameState.friendExpectation) {
    renderer.schoolContent.appendChild(createFragment([
      span('', 'The school is worried about your social life and is requiring you stay for another hour to learn more about forming and maintaining friendships.'),
      '\n\n'
    ]));
    addHours(1);
  }
  if (renderer.friends && gameState.friends) {
    let resolve, promise = new Promise(res => resolve = res), opt1, opt2;
    renderer.schoolContBtn.classList.add('disabled');
    renderer.schoolContent.appendChild(createFragment([
      span('friend-request', `Your friends want you to hang out with them for ${gameState.friends} hour(s).`),
      '\n',
      opt1 = span('button', '[ok]', () => resolve(true)),
      ' ',
      opt2 = span('button', '[no]', () => resolve(false)),
      '\n\n'
    ]));
    const answer = await promise;
    renderer.schoolContBtn.classList.remove('disabled');
    opt1.classList.add('disabled');
    opt2.classList.add('disabled');
    if (answer) {
      addHours(gameState.friends);
      const makeFriend = gameState.friends < gameState.friendExpectation || Math.random() < gameState.friends / 10;
      renderer.schoolContent.appendChild(createFragment([
        span('', 'You have fun with your friends, but you feel you spent too much time with them.' + (makeFriend ? ' At least you made a new friend!' : '')),
        '\n'
      ]));
      if (makeFriend) {
        gameState.friends++;
        renderer.friends.textContent = gameState.friends;
      }
      await schoolContinue();
    } else {
      gameState.friends--;
      renderer.friends.textContent = gameState.friends;
      renderer.schoolContent.appendChild(createFragment([
        span('', 'One of your friends left you because you seemed to have stopped hanging out with them.'),
        '\n'
      ]));
      await schoolContinue();
    }
  }
  if (gameState.grade < 90) {
    renderer.schoolContent.appendChild(createFragment([
      '\n',
      span('parents-heading', 'HOME'),
      '\n'
    ]));
    if (gameState.grade < 80) {
      renderer.schoolContent.appendChild(createFragment([
        '\n',
        span('', 'Your parents stand at the door, visibly disappointed and angry. Your dad shakes his head and points away.'),
        '\n\n',
        span('end-msg', 'You have been disowned.'),
        '\n\n',
        span('the-end', 'GAME OVER'),
        '\n\n',
        span('', 'Score: ' + calculateScore(false))
      ]));
      renderer.schoolContBtn.classList.add('hidden');
      renderer.studySATBtn.dataset.title = 'Find a family first!';
      renderer.doHWBtn.dataset.title = 'Find a family first!';
      renderer.studyBtn.dataset.title = 'Find a family first!';
      renderer.sleepBtn.dataset.title = 'Find a family first!';
      return;
    } else {
      renderer.schoolContent.appendChild(createFragment([
        '\n',
        span('', 'Your parents enter your room, visibly disappointed and angry. They scold you for the entire night, and you are unable to study. They make it clear that there will be worse consequences if your grades continue to drop.'),
        '\n'
      ]));
      gameState.scolded = true;
      addHours(3);
      await schoolContinue();
    }
  }
  updateHomework();
  enableBtn(renderer.sleepBtn);
  renderer.school.classList.add('hidden');
  disableBtn(renderer.schoolContBtn);
  renderer.schoolContent.innerHTML = '';
}

const clicks = {
  studySAT() {
    gameState.studySAT++;
    gameState.totalSAT++;
    if (gameState.studySAT >= 50) {
      document.body.innerHTML = '';
      document.body.appendChild(createFragment([
        renderer.schoolContent = span(),
        renderer.schoolContBtn = span('button', '[ok]', clicks.schoolContinue)
      ]));
      assembly([
        '--: Your parents are proud of you. You have completed all the SAT/ACT preparation books, and now you can take the SAT/ACT.',
        '--: You do pretty well (average for a Gunn student).',
        '--: You can now leave Gunn behind.'
      ], 'GRADUATION').then(() => {
        document.body.removeChild(renderer.schoolContBtn);
        document.body.appendChild(createFragment([
          span('the-end', 'YOU WIN!'),
          '\n\n',
          span('', 'Score: ' + calculateScore(true))
        ]));
      });
      return;
    }
    switch (gameState.totalSAT) {
      case 1:
        document.body.appendChild(createFragment([
          ' You are now ',
          renderer.satPercent = span('sat-percentage', '2', null, 'If you\'re 100% ready, you can graduate high school early!'),
          '% ready for the SAT/ACT.'
        ]));
        break;
      case 4:
        document.body.appendChild(createFragment([
          '\n',
          renderer.doHWBtn = span('button', '[do homework]', clicks.doHW),
          ' You have ',
          renderer.hwCount = span('homework-count', ''),
          ' homework assignment(s) due.',
          renderer.testStudyMarker = span('hidden'),
          '\n',
          renderer.sleepBtn = span('button', '[sleep]', clicks.sleep),
          ' Don\'t forget to sleep so you do well on tests!'
        ]));
        gameState.homeworks += 3;
        updateHomework();
        gameState.time = 15;
        renderer.timeWrapper.classList.remove('hidden');
        break;
    }
    renderer.satPercent.textContent = 100 * gameState.studySAT / config.MAX_SAT_STUDY;
    addHours(1);
    if (gameState.time === 8) {
      beginSchool();
      gameState.sleeplessNights++;
    }
  },
  doHW() {
    gameState.homeworks--;
    updateHomework();
    addHours(1);
    if (gameState.time === 8) {
      beginSchool();
      gameState.sleeplessNights++;
    }
  },
  sleep() {
    if (gameState.time < 8) addHours(8 - gameState.time);
    else addHours(24 - gameState.time + 8);
    gameState.sleeplessNights = 0;
    beginSchool();
  },
  schoolContinue() {
    if (gameState.continueResolve) {
      gameState.continueResolve();
      gameState.continueResolve = null;
    }
  },
  studyTest() {
    gameState.testReadiness += (Math.random() * 25 + 25) / gameState.tests;
    if (gameState.studySAT > 0) {
      gameState.studySAT--;
      renderer.satPercent.textContent = 100 * gameState.studySAT / config.MAX_SAT_STUDY;
    }
    updateHomework();
    addHours(1);
    if (gameState.time === 8) {
      beginSchool();
      gameState.sleeplessNights++;
    }
  }
};
