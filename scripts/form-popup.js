const buttonBanner = document.querySelector(".banner__button");

const formPopup = document.querySelector(".popup-form");
const formPopupBlock = document.querySelector(".popup-form-block");
const closeButtonFormPopup = document.querySelector(".popup__form-button-close");


buttonBanner.addEventListener("click", () => {
  formPopup.classList.add("popup-active");
})

function closePopupForm() {
  formPopup.classList.remove("popup-active");
}

closeButtonFormPopup.addEventListener("click", closePopupForm);

formPopup.addEventListener("click", (e) => {
  if (!formPopupBlock.contains(e.target)) {
    closePopupForm();
  }
});



