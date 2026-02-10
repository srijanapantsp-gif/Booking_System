document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("booking-form");
  if (!form) return;

  const successEl = document.getElementById("booking-success");

  function setFieldError(id, message) {
    const el = document.querySelector(`.field-error[data-error-for="${id}"]`);
    if (el) {
      el.textContent = message || "";
    }
  }

  function clearErrors() {
    const allErrors = document.querySelectorAll(".field-error");
    allErrors.forEach((el) => {
      el.textContent = "";
    });
  }

  function validate(formData) {
    let isValid = true;

    function require(id, label) {
      const value = (formData.get(id) || "").toString().trim();
      if (!value) {
        setFieldError(id, `${label} is required.`);
        isValid = false;
      }
      return value;
    }

    const email = require("email", "Email");
    const firstName = require("firstName", "First name");
    const lastName = require("lastName", "Last name");
    
    // Check itinerary selection if dropdown exists
    const itinerarySelect = formData.get("itinerarySelect");
    if (itinerarySelect !== null && !itinerarySelect) {
      setFieldError("itinerary-select", "Please select an itinerary.");
      isValid = false;
    }

    if (email && !/^\S+@\S+\.\S+$/.test(email)) {
      setFieldError("email", "Please enter a valid email address.");
      isValid = false;
    }

    if (!firstName) {
      isValid = false;
    }
    if (!lastName) {
      isValid = false;
    }

    return isValid;
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    clearErrors();

    const formData = new FormData(form);

    const ok = validate(formData);
    if (!ok) {
      return;
    }

    const payload = {
      tripName: formData.get("tripName"),
      firstName: formData.get("firstName"),
      lastName: formData.get("lastName"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      notes: formData.get("notes"),
      submittedAt: new Date().toISOString(),
    };

    // Get itinerary ID if available
    const itinerarySelect = document.getElementById("itinerary-select");
    const itineraryId = itinerarySelect ? itinerarySelect.value : "";

    try {
      const existingRaw = window.localStorage.getItem("bookingin_enquiries");
      const existing = existingRaw ? JSON.parse(existingRaw) : [];
      existing.push(payload);
      window.localStorage.setItem(
        "bookingin_enquiries",
        JSON.stringify(existing)
      );
    } catch (err) {
      console.warn("Unable to persist booking enquiry locally:", err);
    }

    // Redirect to payment page with booking data
    const params = new URLSearchParams({
      itinerary: payload.tripName,
      firstName: payload.firstName,
      lastName: payload.lastName,
      email: payload.email,
      phone: payload.phone || "",
      itineraryId: itineraryId
    });
    
    window.location.href = `payment.html?${params.toString()}`;
  });
});


