const membershipInputEl = document.querySelector('#secret_string');
if (membershipInputEl) {
  const membershipInput = new mdc.textField.MDCTextField(membershipInputEl);

  const setSecretBtn = document.querySelector('#set_secret_btn');
  if (setSecretBtn) {
    new mdc.ripple.MDCRipple(setSecretBtn);

    setSecretBtn.addEventListener('click', () => {
      membershipInput.value = 'secret string';
    });
  }
}
