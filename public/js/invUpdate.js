const form = document.querySelector("#updateForm")
    form.addEventListener("change", function () {
      const updateBtn = document.querySelector(".login-btn")
      updateBtn.removeAttribute("disabled")
    })