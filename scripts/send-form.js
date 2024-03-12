document.addEventListener("DOMContentLoaded", () => {
  const sendForm = document.getElementById("form-footer");

  sendForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    try {
      const response = await fetch("send-form.php", {
        method: "POST",
        body: new FormData(sendForm),
      });

      if (response.ok) {
        const messageElement = document.querySelector(".popup-block");
        messageElement.classList.add("active-message");
        sendForm.reset();
      } else {
        console.error("Ошибка отправки формы:", response.statusText);
      }
    } catch (error) {
      console.error("Ошибка:", error);
    }
  });
});