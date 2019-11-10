const [clicks] = (() => {

// URL PARAMETERS
// censored-name - activate Jennifer Li mode
// bedtime       - bedtime at 12 AM because you need 8 hours of sleep
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
if (params['jennifer-li']) params['censored-name'] = true;

const SCORES_COOKIE_NAME = '[gunn-student-sim] scores';
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
  continueResolve: null,
  self: false,
  selfLength: 1,
  scolded: false,
  totalSAT: 0,
  absences: 0,
  warned: false,
  retakeTests: 0,
  avgSleepLength: null,
  reported: false
};

const stringifyScore = ((billy, bob, joe, died, hmmm) => { // Don't worry about me!
  for (let i = 0; i < joe.length; i += 2) {
    billy[joe[i + 1]] = joe[i];
    bob[joe[i]] = joe[i + 1];
  }
  joe = t => {
    const end = Math[died[6]](Math[died[5]]() * 6 + 2);
    for (let i = end; i--;) {
      const l = String.fromCharCode(Math[died[6]](Math[died[5]]() * 94 + 33));
      if (!bob[l]) t += l;
    }
    return t;
  };
  return ziggles => ziggles[died[4]]()[died[1]](died[2])[died[0]](olam => billy[olam] + joe(died[2]))[died[3]](died[2]);
})({}, {}, atob('QTE2MnozLjQsNUA2Xzc4OEc5ZzA' + String.fromCharCode(61)), JSON.parse(atob('WyJtYXAiLCJzcGxpdCIsIiIsImpvaW4iLCJ0b1N0cmluZyIsInJhbmRvbSIsImZsb29yIl0' + String.fromCharCode(61))), Math);

function updateHomework() {
  renderer.hwCount.textContent = gameState.homeworks;
  if (renderer.tests) {
    renderer.tests.textContent = gameState.tests;
    renderer.testReadiness.textContent = Math.round(gameState.testReadiness * 100) / 100;
    if (gameState.tests) enableBtn(renderer.studyBtn);
    else disableBtn(renderer.studyBtn, 'You don\'t have a test tomorrow!');
  }
  if (gameState.tests && gameState.testReadiness < 50) {
    disableBtn(renderer.studySATBtn, 'You should at least be 50% prepared for your test!');
  } else {
    enableBtn(renderer.studySATBtn);
  }
  if (gameState.homeworks === 0) {
    disableBtn(renderer.doHWBtn, 'No more homework!');
  } else {
    enableBtn(renderer.doHWBtn);
  }
  if (gameState.scolded) {
    disableBtn(renderer.studySATBtn, 'You cannot concentrate because your parents are scolding you.');
    disableBtn(renderer.studyBtn, 'You cannot concentrate because your parents are scolding you.');
  }
}
function addHours(hours, atHome) {
  gameState.time += hours;
  gameState.day = Math.floor(gameState.time / 24) % 5;
  renderer.time.textContent = humanTime(gameState.time % 24);
  renderer.day.textContent = dayNames[gameState.day];
  if (atHome) {
    if (Math.floor((gameState.time - 8) / 24) > gameState.accumulativeDay) {
      gameState.sleeplessNights++;
      if (gameState.accumulativeDay === 0) {
        gameState.avgSleepLength = 0;
      } else {
        gameState.avgSleepLength = gameState.avgSleepLength * gameState.accumulativeDay / (gameState.accumulativeDay + 1);
      }
      beginSchool();
    } else if (params['bedtime'] && Math.floor(gameState.time / 24) > gameState.accumulativeDay) {
      clicks.sleep();
    }
  }
}

// modified regex from  https://stackoverflow.com/questions/161738/what-is-the-best-regular-expression-to-check-if-a-string-is-a-valid-url#comment19948615_163684
const urlRegex = /^(https?):\/\/[\-A-Za-z0-9+&@#\/%?=~_|!:,.;]*[\-A-Za-z0-9+&@#\/%=~_|]$/;
function calculateScore(manner) {
  const score = gameState.grade + gameState.friends * 20 + gameState.studySAT * 2 + gameState.accumulativeDay * 50;
  let scores = localStorage.getItem(SCORES_COOKIE_NAME);
  if (scores) scores = JSON.parse(scores);
  else scores = [];
  scores.push([Math.round(score), new Date().toISOString(), manner]);
  localStorage.setItem(SCORES_COOKIE_NAME, JSON.stringify(scores));
  let urlInput, submitBtn, error;
  return [
    span('', `Score: ${Math.round(score)}; survived ${gameState.accumulativeDay} day(s)`),
    '\n\n',
    'You can submit your score to the global leaderboard; just identify yourself using a URL to your website or social media/Schoology profile. Make sure the URL contains the protocol (eg http or https). Your public IP address will be stored but won\'t be publicized.\n\nURL: ',
    urlInput = input('', 'https://'),
    ' ',
    submitBtn = span('button', '[submit]', () => {
      if (urlRegex.test(urlInput.value)) {
        submitBtn.classList.add('disabled');
        fetch('https://test-9d9aa.firebaseapp.com/newScore', {
          headers: { 'Content-Type': 'application/json; charset=utf-8' },
          method: 'POST',
          body: JSON.stringify({
            score: stringifyScore(Math.round(score)),
            friends: stringifyScore(Math.round(gameState.friends)),
            accumulativeDay: stringifyScore(Math.round(gameState.accumulativeDay)),
            time: new Date().toISOString(),
            url: urlInput.value,
            manner: manner
          })
        }).then(res => {
          if (res.status === 200) {
            window.location = './leaderboard.html';
          } else {
            return Promise.reject();
          }
        }).catch(() => {
          error.textContent = '\n\nThere was a problem submitting the score. You might have to try again.';
          submitBtn.classList.remove('disabled');
        });
      } else {
        error.textContent = '\n\nYour URL doesn\'t seem valid.';
      }
    }),
    error = span('error')
  ];
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
  let testsToRetake = 0;
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
  } else if (gameState.absences === 3 && !gameState.warned) {
    renderer.schoolContent.appendChild(createFragment([
      span('', 'The school pulled you out of class to warn you about your absence during SELF and how you can work on improving your attendance. They make it clear that five unexcused absences will lead to suspension.' + (gameState.tests ? ' You end up missing your test(s) from the talks and you\'ll have to take them tomorrow.' : '')),
      '\n'
    ]));
    testsToRetake = gameState.tests;
    gameState.warned = true;
    await schoolContinue();
  } else if (gameState.absences >= 5) {
    renderer.schoolContent.appendChild(createFragment([
      '\n',
      span('', 'You now have five unexcused absences. The school must follow the district policy.'),
      '\n\n',
      span('end-msg', 'You have been suspended.'),
      '\n\n',
      span('the-end', 'GAME OVER'),
      '\n\n',
      ...calculateScore('suspended'),
      '\n\n',
      span('button', '[try again]', clicks.reload)
    ]));
    renderer.schoolContBtn.classList.add('hidden');
    renderer.studySATBtn.dataset.title = 'You aren\'t in school anymore!';
    renderer.doHWBtn.dataset.title = 'You aren\'t in school anymore!';
    renderer.studyBtn.dataset.title = 'You aren\'t in school anymore!';
    renderer.sleepBtn.dataset.title = 'You aren\'t in school anymore!';
    return;
  } else if (!gameState.reported && gameState.avgSleepLength < 3 && Math.random() < 0.2) {
    renderer.schoolContent.appendChild(createFragment([
      span('', 'The school pulled you out of class to interrogate you because apparently one student reported you simply for looking depressed; perhaps you should\'ve slept more. The school says that they will periodically pull you out of class to check on you in the future.' + (gameState.tests ? ' You end up missing your test(s) from the talks and you\'ll have to take them tomorrow.' : '')),
      '\n'
    ]));
    testsToRetake = gameState.tests;
    gameState.reported = true;
    await schoolContinue();
  } else if (gameState.reported && Math.random() < 0.2) {
    renderer.schoolContent.appendChild(createFragment([
      span('', 'The school pulled you out of class to check in with your "depression."' + (gameState.tests ? ' You end up missing your test(s) from the talks and you\'ll have to take them tomorrow.' : '')),
      '\n'
    ]));
    testsToRetake = gameState.tests;
    await schoolContinue();
  } else {
    for (let i = 0; i < gameState.tests - gameState.retakeTests; i++) {
      const threshold = Math.random() * 50 + 25;
      const score = Math.min(100, gameState.testReadiness + 100 - threshold);
      gameState.grade = (gameState.grade * gameState.testsTaken + score) / (gameState.testsTaken + 1);
      renderer.grade.textContent = Math.round(gameState.grade * 100) / 100;
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
      '% ready for ',
      renderer.tests = span('upcoming-tests', '0'),
      ' test(s) tomorrow.'
    ]), renderer.testStudyMarker);
  } else if (gameState.accumulativeDay === 2) {
    await assembly([
      '--: ██████████ and ██████ wave to the audience.',
      'cc: ██████████: Good morning! We are hard at work on a new fun extension to SELF for you guys to help you reduce stress.',
      'tf: ██████: We plan to introduce this program tomorrow, so stay tuned!',
      'cc: ██████████: However, today we will give you a brief preview of what is to come!',
      'tf: ██████: Friendships are extremely important, even more important that your schoolwork.',
      'cc: ██████████: That is why today, we are giving you guys a challenge: maintain at least THREE friendships! Most of you already have three friends, so this should not be hard.',
      'tf: ██████: Do note that friendships require MAINTENANCE. However, we will be concerned if you do not satisfy this minimum.'
    ]);
    document.body.insertBefore(createFragment([
      ' ',
      span('friend-heading', 'FRIENDS'),
      ' ',
      renderer.friends = span('friends', '3', null, 'You need a minimum of 3 friends.')
    ]), renderer.gradeMarker);
  } else if (gameState.accumulativeDay === 3) {
    await assembly([
      '--: ██████████ and ██████ wave to the audience.',
      'cc: ██████████: Good morning! Yesterday, we hinted at our destressing program that we have been working on for the last few months.',
      'tf: ██████: Today is the day! We are proud to announce to you... after-school SELF!',
      '--: The students do not react positively to this.',
      'cc: ██████████: Come on! You will enjoy this program for sure! This program is currently mandatory for sophomores only, but other grades are free to join in as well!',
      'tf: ██████: This SELF session is only an hour long, and then you are free to leave!'
    ]);
    gameState.self = true;
  } else if (gameState.day === 4) {
    gameState.selfLength++;
    if (Math.random() < 0.5) {
      await assembly([
        '--: ██████████ and ██████ wave to the audience.',
        `cc: ██████████: Good morning! Since we\'ve noticed how much you guys loved the after-school SELF program, we\'re now making it ${gameState.selfLength} hours long!`
      ]);
    } else {
      gameState.friendExpectation++;
      await assembly([
        '--: ██████████ and ██████ wave to the audience.',
        `tf: ██████: Good morning! With your newfound skills in relationship maintenance and friendship building, we\'re now raising our expectations! We now expect each of you to have at least ${gameState.friendExpectation} friends.`
      ]);
      renderer.friends.dataset.title = `You need a minimum of ${gameState.friendExpectation} friends.`;
    }
  }
  gameState.hwRate += 0.7;
  gameState.homeworks += Math.floor(gameState.hwRate);
  renderer.hwCount.textContent = gameState.homeworks;
  gameState.tests = Math.floor(Math.random() * gameState.hwRate) + testsToRetake;
  renderer.tests.textContent = gameState.tests;
  let tempReadiness = gameState.testReadiness;
  gameState.testReadiness = 0;
  renderer.testReadiness.textContent = gameState.testReadiness;
  renderer.schoolContent.appendChild(createFragment([
    span('', `You leave school with ${Math.floor(gameState.hwRate)} more homework assignment(s) and ${gameState.tests} test(s) to prepare for tomorrow.`),
    '\n\n'
  ]));
  await schoolContinue();
  addHours(8);
  let hoursLeft = Math.ceil((gameState.time - 8) / 24) * 24 + 8 - gameState.time;
  if (gameState.self) {
    let resolve, promise = new Promise(res => resolve = res), opt1, opt2;
    renderer.schoolContBtn.classList.add('disabled');
    renderer.schoolContent.appendChild(createFragment([
      span('', `Go to after-school SELF?`),
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
      hoursLeft -= gameState.selfLength;
      addHours(gameState.selfLength);
    } else {
      if (gameState.absences === 0) {
        document.body.insertBefore(createFragment([
          ' ',
          span('absences-heading', 'ABSENCES', null, 'SELF teaches the most important and practical skills you need for life, so don\'t dare you miss it!'),
          ' ',
          renderer.absences = span('absences', '0', null, 'Warning at 3 absences, suspension at 5.')
        ]), renderer.gradeMarker);
      }
      gameState.absences++;
      renderer.absences.textContent = gameState.absences;
    }
  }
  if (gameState.friends < gameState.friendExpectation && Math.random() < 0.5) {
    renderer.schoolContent.appendChild(createFragment([
      span('', 'The school is worried about your social life and is requiring you stay for another hour to learn more about forming and maintaining friendships.'),
      '\n\n'
    ]));
    addHours(1);
    hoursLeft--;
  }
  if (gameState.retakeTests) {
    if (gameState.retakeTests > hoursLeft) { // not enough time for retakes :O
      testsToRetake += gameState.retakeTests - hoursLeft;
      gameState.tests += gameState.retakeTests - hoursLeft;
      renderer.tests.textContent = gameState.tests;
      gameState.retakeTests = hoursLeft;
    }
    renderer.schoolContent.appendChild(createFragment([
      span('', `You spend ${gameState.retakeTests} hour(s) after school to retake tests.`),
      '\n'
    ]));
    addHours(gameState.retakeTests);
    hoursLeft -= gameState.retakeTests;
    for (let i = 0; i < gameState.retakeTests; i++) {
      const threshold = Math.random() * 50 + 25;
      const score = Math.min(100, tempReadiness + 100 - threshold);
      gameState.grade = (gameState.grade * gameState.testsTaken + score) / (gameState.testsTaken + 1);
      renderer.grade.textContent = Math.round(gameState.grade * 100) / 100;
      gameState.testsTaken++;
      renderer.schoolContent.appendChild(createFragment([
        span('', `You receive ${Math.round(score * 100) / 100}% on a test.`),
        '\n'
      ]));
      await schoolContinue();
    }
  }
  gameState.retakeTests = testsToRetake;
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
      if (gameState.friends > hoursLeft) {
        const lostFriends = gameState.friends - hoursLeft;
        gameState.friends = hoursLeft;
        renderer.friends.textContent = gameState.friends;
        renderer.schoolContent.appendChild(createFragment([
          span('', `${lostFriends} friend(s) leave you because you don't have enough time for them.`),
          '\n'
        ]));
      }
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
        ...calculateScore('disowned'),
        '\n\n',
        span('button', '[try again]', clicks.reload)
      ]));
      renderer.schoolContBtn.classList.add('hidden');
      renderer.studySATBtn.dataset.title = 'Find a family first!';
      renderer.doHWBtn.dataset.title = 'Find a family first!';
      renderer.studyBtn.dataset.title = 'Find a family first!';
      renderer.sleepBtn.dataset.title = 'Find a family first!';
      return;
    } else if (hoursLeft >= 3) {
      renderer.schoolContent.appendChild(createFragment([
        '\n',
        span('', 'Your parents enter your room, visibly disappointed and angry. They scold you for the entire night, and you are unable to study. They make it clear that there will be worse consequences if your grades continue to drop.'),
        '\n'
      ]));
      gameState.scolded = true;
      addHours(3);
      hoursLeft -= 3;
      await schoolContinue();
    }
  }
  if (params['censored-name'] && hoursLeft > 0) {
    const hours = Math.min(Math.floor(Math.random() * 6 + 1), hoursLeft);
    renderer.schoolContent.appendChild(createFragment([
      span('jennifer-li', `You spend ${hours} hour(s) watching dog videos on Instagram. You regret doing so.`),
      '\n'
    ]));
    addHours(hours);
    hoursLeft -= hours;
    await schoolContinue();
  }
  if (hoursLeft <= 0) {
    renderer.schoolContent.appendChild(createFragment([
      span('', 'Alas, you have spent the rest of the day and night outside, and you must attend school again.'),
      '\n'
    ]));
    await schoolContinue();
  }
  updateHomework();
  enableBtn(renderer.sleepBtn);
  renderer.school.classList.add('hidden');
  disableBtn(renderer.schoolContBtn);
  renderer.schoolContent.innerHTML = '';
  if (hoursLeft <= 0) addHours(0, true);
}

const clicks = {
  studySAT() {
    gameState.studySAT++;
    gameState.totalSAT++;
    if (gameState.studySAT >= 50) {
      while (document.body.children.length) {
        if (document.body.lastChild !== this.floatingBar)
          document.body.removeChild(document.body.lastChild);
        else break;
      }
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
          ...calculateScore('graduated'),
          '\n\n',
          span('button', '[play again]', clicks.reload)
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
    addHours(1, true);
  },
  doHW() {
    gameState.homeworks--;
    updateHomework();
    addHours(1, true);
  },
  sleep() {
    const sleepLength = Math.ceil((gameState.time - 8) / 24) * 24 + 8 - gameState.time;
    addHours(sleepLength);
    gameState.sleeplessNights = 0;
    if (gameState.accumulativeDay === 0) {
      gameState.avgSleepLength = sleepLength;
    } else {
      gameState.avgSleepLength = (gameState.avgSleepLength * gameState.accumulativeDay + sleepLength) / (gameState.accumulativeDay + 1);
    }
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
    addHours(1, true);
  },
  reload() {
    window.location.reload();
  },
  closeDialog() {
    renderer.closeBtn.classList.add('disabled');
    renderer.dialog.classList.add('hidden');
    renderer.dialogContent.innerHTML = '';
  },
  showScores() {
    renderer.dialogHeading.textContent = 'SCORES';
    let scores = localStorage.getItem(SCORES_COOKIE_NAME);
    if (scores) scores = JSON.parse(scores);
    if (scores && scores.length) {
      renderer.dialogContent.appendChild(createFragment([
        span('score-heading', 'SCORE'),
        span('divider', ' | '),
        span('score-heading', 'TIME'),
        span('divider', '                     | '),
        span('score-heading', 'MANNER'),
        '\n',
        ...scores.sort((a, b) => b[0] - a[0]).map(([score, time, manner]) => span('', [
          score.toString().padStart(5),
          span('divider', ' | '),
          time,
          span('divider', ' | '),
          manner,
          '\n'
        ])),
        '\n',
        span('button', '[global leaderboard]', './leaderboard.html')
      ]));
    } else {
      renderer.dialogContent.appendChild(createFragment([
        'No failures to show.\n\n',
        span('button', '[global leaderboard]', './leaderboard.html')
      ]));
    }
  },
  showInfo() {
    renderer.dialogHeading.textContent = 'INFO';
    renderer.dialogContent.appendChild(createFragment([
      'This game accurately portrays the life of a Gunn student. Students at Gunn must balance their social lives, academics, careers, and commitment to SELF, but to balance one would unbalance another.\n\n',
      'To win, you need to be able to take the SAT/ACT early so that you can graduate early. However, you can only do that in your free time since homework and test studying takes priority.\n\n',
      'Anyone may (and should) make own version of this game, though please consider crediting the creator or link to this game somewhere.\n\n',
      span('button', '[more info]', './info.html')
    ]));
  },
  showModes() {
    renderer.dialogHeading.textContent = 'GAME MODES';
    renderer.dialogContent.appendChild(createFragment([
      'There are a few game modes that make small changes to the game mechanics that make the game even harder. These were suggested by experienced Gunn students.\n',
      span('button', '[default mode]', './'),
      ' - Play the game as the creator intended it to be played.\n',
      span('button', '[████████ ██ mode]', './?censored-name'),
      ' - Experience firsthand the detrimental effects of technological distractions by losing 1-6 hours every day to dog videos on Instagram, like fellow Gunn student ████████ ██.\n',
      span('button', '[bedtime mode]', './?bedtime'),
      ' - It is recommended to sleep at least eight hours a night; your parents care about your mental health, so they force you to sleep at 12 AM.\n',
      '\nI probably won\'t add any more modes.'
    ]));
  },
  showUpdates() {
    renderer.dialogHeading.textContent = 'UPDATES';
    renderer.dialogContent.appendChild(createFragment([
      'Update 1: initial release',
      '\n\nUpdate 2: Number of days survived is shown with score, game is better at dealing with 15 friends',
      '\n\nUpdate 3: There\'s now a chance that a student will report you to the Administration for looking "depressed" if you don\'t sleep enough.',
      '\n\nUpdate 4: Added a score leaderboard (not global)',
      '\n\nUpdate 5: Added a global leaderboard; you will be given the opportunity to submit your score when the game ends.',
      '\n\nUpdate 6: Global leaderboard now shows friend count and days (because these statistics were also sent).',
      '\n\nUpdate 7: Law compliance.',
      '\n\nUpdate 8: Renamed a game mode.',
      '\n\nUpdate 9: Added a background to the footer windows and fixed a typo.'
    ]));
  }
};

return [clicks];

})();
