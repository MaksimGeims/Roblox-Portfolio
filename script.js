(function () {
  const birthDate = new Date(2009, 3, 25);
  const now = new Date();

  let age = now.getFullYear() - birthDate.getFullYear();
  const hasBirthdayPassed =
    now.getMonth() > birthDate.getMonth() ||
    (now.getMonth() === birthDate.getMonth() && now.getDate() >= birthDate.getDate());

  if (!hasBirthdayPassed) {
    age -= 1;
  }

  const ageElement = document.getElementById("currentAge");
  if (ageElement) {
    ageElement.textContent = String(age);
  }

  const yearElement = document.getElementById("year");
  if (yearElement) {
    yearElement.textContent = String(now.getFullYear());
  }

  const avatarImage = document.getElementById("avatarImage");
  const avatarFallback = document.getElementById("avatarFallback");

  function showFallback() {
    if (avatarImage) avatarImage.style.display = "none";
    if (avatarFallback) avatarFallback.style.display = "grid";
  }

  function showImage() {
    if (avatarImage) avatarImage.style.display = "block";
    if (avatarFallback) avatarFallback.style.display = "none";
  }

  if (avatarImage) {
    avatarImage.addEventListener("error", showFallback);
    avatarImage.addEventListener("load", showImage);

    if (!avatarImage.complete || avatarImage.naturalWidth === 0) {
      showFallback();
    } else {
      showImage();
    }
  }

  const menuToggle = document.getElementById("menuToggle");
  const navLinks = document.getElementById("navLinks");

  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", function () {
      const isOpen = navLinks.classList.toggle("open");
      menuToggle.setAttribute("aria-expanded", String(isOpen));
    });

    navLinks.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        navLinks.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  const revealElements = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    revealElements.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    revealElements.forEach(function (el) {
      el.classList.add("visible");
    });
  }
})();
