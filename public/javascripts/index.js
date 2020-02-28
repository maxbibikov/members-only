const snackbarEl = document.querySelector('.mdc-snackbar');

if (snackbarEl) {
  const snackbar = new mdc.snackbar.MDCSnackbar(snackbarEl);
  snackbar.open();
}
