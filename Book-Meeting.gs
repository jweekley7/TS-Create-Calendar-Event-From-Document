//Gets document info for attaching to event
function getCurrentDocumentID() {
  const docID = DocumentApp.getActiveDocument().getId();
  const docURL = DocumentApp.getActiveDocument().getUrl();
  const docTitle = DocumentApp.getActiveDocument().getName();

  return {
    'docID': docID,
    'docURL': docURL,
    'docTitle': docTitle
  }
}

//Adds a google meet link if google meet is selected
function googleMeetLink(form_data) {
  let conferenceData;
  
  if (form_data.location == 'google_meet') {
    conferenceData = {createRequest: {conferenceSolutionKey: {type: 'hangoutsMeet'}, requestId: Utilities.getUuid()}};
  } else if (form_data.location == 'on_location') {
  };
  return conferenceData;
}

//Adds address if address is selected
function locationAddress(form_data) {
  let location;
  
  if (form_data.location == 'google_meet') {
  } else if (form_data.location == 'on_location') {
    location = form_data.address;
  };
  return location;
}

//Formats the date of the next meeting. To be used as title of next meeting minutes doc
function formatNextMeetingDocTitle(form_data) {
  const formattedDate = Utilities.formatDate(new Date(form_data.date), 'GMT-0500', 'yyyy_MM_dd');
  return formattedDate.toString();
}

//Copies current minutes and sets next meeting date as name of doc
async function copyCurrentMinutes(form_data) {
  console.log('copyCurrentMinutes() running');
  await DriveApp.getFileById(getCurrentDocumentID().docID).makeCopy().setName(formatNextMeetingDocTitle(form_data));
  console.log('copyCurrentMinutes() finished');
}

//Gets ID of next meeting minutes doc
function nextMeetingMinutesID(form_data) {
  console.log('nextMeetingMinutesID() running');
  const nextMeetingDocID = DriveApp.getFilesByName(formatNextMeetingDocTitle(form_data)).next().getId();
  console.log('nextMeetingMinutesID() finished');
  return nextMeetingDocID;
}

//Moves next meeting minutes into appropriate folder
function organizeDrive(form_data) {
  console.log('organizeDrive() running');
  DriveApp.getFileById(nextMeetingMinutesID(form_data)).moveTo(DriveApp.getFolderById('1-uBpW2xv0aXA0KhmbOplmH51vORE2oAH'));
  console.log('organizeDrive() finished');
}

//Formats date from sidebar form into Date value
function formatStartDate(form_data) {
  const startDateTime = new Date(form_data.date + ' '+ form_data.time);
  return startDateTime;
}

//Booking function
async function bookNextMeeting(form_data) {

  showLoadingSidebar();
  await copyCurrentMinutes(form_data);
  await organizeDrive(form_data);
  
  const eventStartDateTime = formatStartDate(form_data);
  const eventEndDateTime = new Date(eventStartDateTime.getTime() + (1000 * 60 * 60));

  const eventDescription = (form_data.description == undefined) ? '' : form_data.description;
  
  const payload = {
    start: {
      dateTime: Utilities.formatDate(new Date(eventStartDateTime.getTime() + (1000 * 60 * 60 * 5)), 'GMT-0500', 'yyyy-MM-dd\'T\'HH:mm:ss.SSS\'Z\''),
      timeZone: 'GMT-0500'
    },
    end: {
      dateTime: Utilities.formatDate(new Date(eventEndDateTime.getTime() + (1000 * 60 * 60 * 5)), 'GMT-0500', 'yyyy-MM-dd\'T\'HH:mm:ss.SSS\'Z\''),
      timeZone: 'GMT-0500'
    },
    summary: form_data.title,
    description: eventDescription,
    attachments: [
      {
        fileUrl: getCurrentDocumentID().docURL,
        title: 'Previous meeting: ' + getCurrentDocumentID().docTitle
      },
      {
        fileUrl: await DriveApp.getFileById(nextMeetingMinutesID(form_data)).getUrl(),
        title: `Next meeting: ${formatNextMeetingDocTitle(form_data)}`
      }
    ],
    conferenceData: googleMeetLink(form_data),
    location: locationAddress(form_data)
  }
  
  await Calendar.Events.insert(
    payload, 
    'r8pk160hkn7apn1mlkcib06sp8@group.calendar.google.com', 
    {
      conferenceDataVersion: 1,
      supportsAttachments: true
    }
  );
  closeSidebar();
  showSuccessAlert();
};
