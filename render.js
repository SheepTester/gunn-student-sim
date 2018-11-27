function init() {
  document.body.appendChild(createFragment([
    this.floatingBar = span('floating', [
      renderer.dialog = span('dialog hidden', [
        renderer.dialogHeading = span('dialog-heading', ''),
        renderer.closeBtn = span('button close-button disabled', '[close]', clicks.closeDialog),
        '\n',
        renderer.dialogContent = span()
      ]),
      '\n',
      span('button info-button', '[scores]', openDialog(clicks.showScores)),
      ' ',
      span('button info-button', '[info]', openDialog(clicks.showInfo)),
      ' ',
      span('button info-button', '[modes]', openDialog(clicks.showModes)),
      ' ',
      span('button info-button', '[updates]', openDialog(clicks.showUpdates)),
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
