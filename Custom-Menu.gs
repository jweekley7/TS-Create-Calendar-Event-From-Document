function onOpen() {
  const ui = DocumentApp.getUi();

  ui.createMenu('Third Short Menu')
      .addItem('Book Next Meeting', 'showMeetingSidebar')
      .addToUi();
}

function showMeetingSidebar() {
  const html = HtmlService.createHtmlOutputFromFile('Meeting Sidebar')
      .setTitle('Book Next Company Meeting');
  DocumentApp.getUi()
      .showSidebar(html);
}
