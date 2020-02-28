const appBarEl = document.querySelector('.app-bar');
const mainContentEl = document.getElementById('main_content');
const topAppBar = mdc.topAppBar.MDCTopAppBar.attachTo(appBarEl);

// Drawer
const drawer = mdc.drawer.MDCDrawer.attachTo(
  document.querySelector('.mdc-drawer')
);

// Drawer nav list
const mainNavListEl = mdc.list.MDCList.attachTo(
  document.querySelector('#main_nav_list')
);
mainNavListEl.wrapFocus = true;

const listItemRipples = mainNavListEl.listElements.map(
  (listItemEl) => new mdc.ripple.MDCRipple(listItemEl)
);

topAppBar.setScrollTarget(mainContentEl);
topAppBar.listen('MDCTopAppBar:nav', () => {
  drawer.open = !drawer.open;
});

// User drop menu. When user logged in.
const menuEl = document.querySelector('.mdc-menu');
if (menuEl) {
  const menu = new mdc.menu.MDCMenu(menuEl);

  const accountBtnEl = document.querySelector('#account_btn');
  accountBtnEl.addEventListener('click', () => {
    menu.open = true;
  });
}

const loginBtnEl = document.querySelector('#login_btn');
const registerBtnEl = document.querySelector('#register_btn');

if (loginBtnEl) {
  const loginBtnRipple = new mdc.ripple.MDCRipple(loginBtnEl);
}

if (registerBtnEl) {
  new mdc.ripple.MDCRipple(registerBtnEl);
}

// nav selector
function selectCurrentRoute() {
  const currentRoute = location.pathname;
  if (currentRoute.includes('/membership')) {
    return document
      .getElementById('main_nav_membership')
      .classList.add('mdc-list-item--activated');
  }
  if (currentRoute.includes('/log-out')) {
    return document
      .getElementById('main_nav_logout')
      .classList.add('mdc-list-item--activated');
  }
  if (currentRoute.includes('/log-in')) {
    return document
      .getElementById('main_nav_login')
      .classList.add('mdc-list-item--activated');
  }
  if (currentRoute.includes('/sign-up')) {
    return document
      .getElementById('main_nav_register')
      .classList.add('mdc-list-item--activated');
  }

  return document
    .getElementById('main_nav_home')
    .classList.add('mdc-list-item--activated');
}
selectCurrentRoute();

// New message dialog
const dialog = new mdc.dialog.MDCDialog(document.querySelector('.mdc-dialog'));

const messageBtnEl = document.querySelector('#message_btn');
if (messageBtnEl) {
    new mdc.ripple.MDCRipple(document.querySelector('.mdc-button'));
  messageBtnEl.addEventListener('click', () => {
    dialog.open();
  });
}

new mdc.textField.MDCTextField(document.querySelector('#message_title'));
new mdc.textField.MDCTextField(document.querySelector('#message_text'));
