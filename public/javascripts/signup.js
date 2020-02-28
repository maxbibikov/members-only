new mdc.textField.MDCTextField(document.querySelector('#username'));
new mdc.textField.MDCTextField(document.querySelector('#password'));
new mdc.textField.MDCTextField(document.querySelector('#password_confirm'));
new mdc.textField.MDCTextField(document.querySelector('#fullname'));
const checkbox = new mdc.checkbox.MDCCheckbox(
  document.querySelector('.mdc-checkbox')
);
const formField = new mdc.formField.MDCFormField(
  document.querySelector('.mdc-form-field')
);
formField.input = checkbox;

const buttonEl = document.querySelector('.mdc-button');
new mdc.ripple.MDCRipple(buttonEl);
