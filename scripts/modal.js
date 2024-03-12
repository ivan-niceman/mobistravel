document.addEventListener("DOMContentLoaded", function () {
  const openModalButtons = document.querySelectorAll(".documents-item");
  const closeModalButtons = document.querySelectorAll(".close-button");
  const overlays = document.querySelectorAll(".modal-overlay");

  function toggleModal(modalId, action = "toggle") {
    const modal = document.getElementById(modalId);
    if (action === "open") modal.classList.add("modal-document-active");
    else if (action === "close")
      modal.classList.remove("modal-document-active");
    else modal.classList.toggle("modal-document-active");
  }

  openModalButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const modalId = button.getAttribute("data-modal-target");
      toggleModal(modalId, "open");
    });
  });

  closeModalButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      const modal = button.closest(".modal-overlay");
      modal.classList.remove("modal-document-active");
      event.stopPropagation();
    });
	});

  overlays.forEach((overlay) => {
    overlay.addEventListener("click", (event) => {
      if (event.target === overlay) {
        overlay.classList.remove("modal-document-active");
      }
    });
  });
});
