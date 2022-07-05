function showLoadingSidebar() {
  const html = HtmlService.createHtmlOutputFromFile('Loader')
      .setTitle('Working on it...');
  DocumentApp.getUi()
      .showSidebar(html);
}

function closeSidebar() {
  const html = HtmlService.createHtmlOutputFromFile('Close')
      .setTitle('');
  DocumentApp.getUi()
      .showSidebar(html);
}
