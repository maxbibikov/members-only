const snackbarEl = document.querySelector('.mdc-snackbar');

if (snackbarEl) {
  const snackbar = new mdc.snackbar.MDCSnackbar(snackbarEl);
  snackbar.open();
}

const deleteDialog = new mdc.dialog.MDCDialog(
  document.querySelector('#delete_dialog')
);

const deleteMesageBtnEl = document.querySelectorAll('#delete_message_btn');

if (deleteMesageBtnEl) {
  deleteMesageBtnEl.forEach((element) => {
    element.addEventListener('click', (event) => {
      deleteDialog.open();

      deleteDialog.listen('MDCDialog:closing', function(closingEvent) {
        if (closingEvent.detail.action === 'accept') {
          return fetch(element.dataset.value, { method: 'get' })
            .then((response) => {
              if (!response.ok) {
                alert('Something went wrong');
              }
              return location.reload();
            })
            .catch((err) => {
              alert(err);
            });
        }
      });
    });
  });
}
