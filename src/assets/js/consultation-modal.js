(function () {
  var modal = document.getElementById("consult-modal");
  if (!modal) return;

  var stepChoose = document.getElementById("consult-step-choose");
  var stepForm = document.getElementById("consult-step-form");
  var stepSuccess = document.getElementById("consult-step-success");
  var confirmBtn = document.getElementById("consult-confirm");
  var form = document.getElementById("consult-form");
  var radios = modal.querySelectorAll('input[name="consult-type"]');
  var openers = document.querySelectorAll("[data-open-consult]");

  var calendlyUrl =
    modal.getAttribute("data-calendly-url") ||
    "https://calendly.com/andon-go6ev/30min";
  var phone = modal.getAttribute("data-phone") || "+359892907007";

  var lastFocus = null;

  function showStep(step) {
    stepChoose.hidden = step !== "choose";
    stepForm.hidden = step !== "form";
    stepSuccess.hidden = step !== "success";
  }

  function resetModal() {
    radios.forEach(function (r) {
      r.checked = false;
    });
    if (confirmBtn) confirmBtn.disabled = true;
    if (form) form.reset();
    showStep("choose");
  }

  function onOptionSelected() {
    if (confirmBtn) confirmBtn.disabled = false;
  }

  function openModal() {
    lastFocus = document.activeElement;
    resetModal();
    modal.hidden = false;
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("consult-modal-open");
    if (lastFocus && typeof lastFocus.blur === "function") {
      lastFocus.blur();
    }
  }

  function closeModal() {
    modal.hidden = true;
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("consult-modal-open");
    resetModal();
    if (lastFocus && typeof lastFocus.focus === "function") {
      lastFocus.focus();
    }
  }

  function openCalendly() {
    if (typeof Calendly !== "undefined" && Calendly.initPopupWidget) {
      Calendly.initPopupWidget({ url: calendlyUrl });
      return;
    }
    window.open(calendlyUrl, "_blank", "noopener,noreferrer");
  }

  radios.forEach(function (radio) {
    radio.addEventListener("change", onOptionSelected);
  });

  if (confirmBtn) {
    confirmBtn.addEventListener("click", function () {
      var selected = modal.querySelector('input[name="consult-type"]:checked');
      if (!selected) return;

      var value = selected.value;
      if (value === "meeting") {
        closeModal();
        openCalendly();
        return;
      }
      if (value === "call") {
        closeModal();
        window.location.href = "tel:" + phone.replace(/\s/g, "");
        return;
      }
      if (value === "message") {
        showStep("form");
      }
    });
  }

  modal.querySelectorAll("[data-consult-back]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      showStep("choose");
    });
  });

  modal.querySelectorAll("[data-consult-close]").forEach(function (el) {
    el.addEventListener("click", closeModal);
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && !modal.hidden) closeModal();
  });

  openers.forEach(function (btn) {
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      openModal();
    });
  });

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      var submitBtn = form.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = "Изпращане…";
      }

      fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" },
      })
        .then(function (res) {
          return res.json();
        })
        .then(function (data) {
          if (data.success) {
            showStep("success");
          } else {
            throw new Error(data.message || "submit failed");
          }
        })
        .catch(function () {
          alert(
            "Възникна проблем при изпращането. Моля, опитайте отново или се обадете на " +
              phone
          );
        })
        .finally(function () {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = "Изпрати";
          }
        });
    });
  }
})();
