function init() {
  document.body.appendChild(createFragment([
    renderer.dialogHeading = span('dialog-heading', 'MORE INFO'),
    renderer.closeBtn = span('button close-button', '[back]', './'),
    '\n\n',
    'The after-school SELF program is a reference to the real SELF program, a brilliantly designed session meant to teach important life skills - more important than what is taught in academics classes - such as methods of reducing stress, career preparation, and the necessary reminders that sex and drugs are bad. Specific examples of what they taught include the stimulation of the rumoured "Vagus nerve" through specific breathing procedures to calm the mind, a detailed lesson on handshakes, and a captivating assembly about consent.\n\n',
    'Groups of students are predefined and assigned to a teacher; these assignments will last the students\' throughout all their four years in high school. Their reasoning for this is simply revolutionary: the hope is that the school will be able to force the students to make friends within their groups.\n\n',
    'Of course, because the content taught in this program is extremely valuable, students are not able to catch up on homework or study for a test that takes place the period after SELF to really reduce stress; this varies per teacher, which means the one teacher a student is assigned to for their four years in high school will greatly determine their academic success compared to luckier students assigned to nicer teachers. This supposed setback is actually an extremely innovative strategy to accomplish one of the many plans, goals, and desires set by the creators of SELF. What plans could these be? We can only wonder, for the intellectual capability of the creators are too high for us to comprehend.\n\n',
    span('graduation-heading', 'HOMEWORK\n'),
    'You can study for the SAT/ACT to graduate from Gunn early. However, you also have homework assignments and tests that are assigned every day. Each homework assignment takes an hour to complete. You can study for your tests; each hour of studying randomly increases your readiness (the increase is smaller if you have more tests to study for). Tests are defined such that those with readiness levels above a set standard (randomly selected between 25% to 75%) will get 100%.\n\n',
    'You can also sleep; it\'s a good idea to get the recommended amount of 8 hours of sleep per night, but a single hour of sleep will do to keep you from falling asleep during a test. You will also look sleepy, and someone might report you for looking depressed.\n\n',
    span('time-heading', 'TIME\n'),
    'School starts at 8:00 AM and ends at 14:00 AM. SELF starts off an hour long, but its length increases over time. The friendship remediation sessions are only an hour long. Each retake takes an hour. The more friends you have, the more time you spend with them.\n\n',
    'The game does not include the weekends because presumably you procrastinate and don\'t accomplish anything academically significant.\n\n',
    span('time-heading', 'GRADES\n'),
    'Grades are largely determined by your test scores, which are averaged throughout the game. Each incomplete homework assignment drops your grade by a percent. If you fall asleep during a test, you get a zero, which significantly impacts your grade.\n\n',
    'Your parents would like you to have at least 90%; should your grade drop to the B range, your parents will become disappointed. They will disown you if your grade continues to drop below 80%. When your parents scold you about your grades, you will be unable to study.\n\n',
    span('friend-heading', 'FRIENDS\n'),
    'You start with three friends. If you hang out with them, they might introduce you to more friends. If you don\'t, you easily lose them because you aren\'t very close friends with anyone; you\'re too concerned with academics to really care.\n\n',
    'The school believes relationships are more important than academics, so they set realistic friend minimums to ensure everyone has a social life. Try to maintain the specified number of friends, or the school will make you attend an hour-long remediation session about how you can make new friends and maintain those positive relationships.\n\n',
    span('absences-heading', 'ATTENDANCE\n'),
    'The "district attendance policy" in the game is a more strict parody of ',
    span('button', '[Gunn\'s attendance policy for tardies]', 'https://gunn.pausd.org/our-school/attendance'),
    ' (whose importance was emphasized by a Spanish teacher). A warning is given when you have 3 unexcused absences, and you are suspended at 5 unexcused absences. As an academic student, you never miss academic classes, but because you think after-school SELF is a joke, you often wonder if you should even bother going or not. Of course, as it is mandatory, you will get disciplined for cutting SELF.\n\n',
    'When the warning is given, they pull you out of class, so you miss whatever tests you have that day. You\'ll have to make them up after school on the next day.\n\n',
    'Similarly, when someone reports you for looking depressed, they will pull you out of class to interrogate you about your "depression." They will also periodically pull you out of class to check in on you. This is for your benefit.\n\n',
    span('assembly-heading', 'ASSEMBLY\n'),
    'The teachers and conversations referenced in the game are purely fictional and are not meant to resemble nor represent anyone or anything from real life. Any resemblance to any real life entity is purely coincidental.\n\n',
    span('parents-heading', 'SCORES\n'),
    'When the game ends, you will be given a score. The equation used for it is as follows:\n',
    '   g + 20f + 2s + 50d where g = your grade, f = number of friends, s = SAT/ACT readiness, and d = days survived\n',
    'The equation was made with little thought, so it should not be taken too seriously.\n\n',
    span('the-end', 'Down with SELF.')
  ]));
}
