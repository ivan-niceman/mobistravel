document.addEventListener("DOMContentLoaded", () => {
  const sendFormPopup = document.getElementById("popup-form");
  const formPopup = document.querySelector(".popup-form");

  sendFormPopup.addEventListener("submit", async (event) => {
    event.preventDefault();

    try {
      const response = await fetch("send-form.php", {
        method: "POST",
        body: new FormData(sendFormPopup),
      });

      if (response.ok) {
        const messageElement = document.querySelector(".popup-block");
        messageElement.classList.add("active-message");
        formPopup.classList.remove("popup-active");
        sendFormPopup.reset();
      } else {
        console.error("Ошибка отправки формы:", response.statusText);
      }
    } catch (error) {
      console.error("Ошибка:", error);
    }
  });
});