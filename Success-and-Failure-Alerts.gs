function showFailureAlert(error) {
   console.log('showFailureAlert. running')
   console.log(error);
   
   const ui = DocumentApp.getUi();

   ui.alert(
     "That didn't work. Please try again. Error message: " + error.message);
}

function showSuccessAlert() {
   const ui = DocumentApp.getUi();
   ui.alert('Meeting is booked!');
}
