const burgerButton = document.querySelector(".burger-button");
const mobileNav = document.querySelector(".mobile-nav");
const closeMobileButton = document.querySelector(".mobile-close-button");

const closeButtonPopup = document.querySelectorAll(".popup__button-close");
const blockPopup = document.querySelector(".popup-block");
const contentPopup = document.querySelector(".popup-content");

function closeMobileNav() {
  mobileNav.classList.remove("mobile-nav-active");
}

burgerButton.addEventListener("click", () => {
  mobileNav.classList.add("mobile-nav-active");
});

closeMobileButton.addEventListener("click", closeMobileNav);

document.addEventListener("click", (e) => {
  if (!mobileNav.contains(e.target) && !burgerButton.contains(e.target)) {
    closeMobileNav();
  }
});

///

function closePopupMessage() {
  blockPopup.classList.remove("active-message");
}

closeButtonPopup.forEach(elem => {
  elem.addEventListener("click", closePopupMessage);
})

document.addEventListener("click", (e) => {
  if (!contentPopup.contains(e.target)) {
    closePopupMessage();
  }
});
