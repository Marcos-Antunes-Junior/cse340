const form = document.querySelector("#updateAccount")
    form.addEventListener("change", function () {
      const updateBtn = document.querySelector(".login-btn")
      updateBtn.removeAttribute("disabled")
    })