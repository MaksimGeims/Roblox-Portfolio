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
  const ageDetailsElement = document.getElementById("ageDetails");
  if (ageElement) {
    ageElement.textContent = String(age);
  }

  if (ageDetailsElement) {
    const nextBirthdayYear = hasBirthdayPassed ? now.getFullYear() + 1 : now.getFullYear();
    const nextBirthday = new Date(nextBirthdayYear, birthDate.getMonth(), birthDate.getDate());
    const oneDay = 24 * 60 * 60 * 1000;
    const daysLeft = Math.ceil((nextBirthday - now) / oneDay);
    ageDetailsElement.textContent =
      daysLeft === 0 ? "Birthday is today. Level up!" : "Next birthday in " + daysLeft + " days";
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

  const sharkFacts = [
    "Sharks existed before dinosaurs.",
    "Some sharks can sense tiny electric signals from prey.",
    "A group of sharks can be called a shiver.",
    "Not all sharks are huge. Some are small enough to fit in your hand.",
    "Many sharks need to keep swimming to breathe efficiently."
  ];

  const sharkFactElement = document.getElementById("sharkFact");
  const sharkMemeLineElement = document.getElementById("sharkMemeLine");
  const newFactBtn = document.getElementById("newFactBtn");
  const memeBtn = document.getElementById("memeBtn");
  const seaModeBtn = document.getElementById("seaModeBtn");
  const startGameBtn = document.getElementById("startGameBtn");
  const fishBtn = document.getElementById("fishBtn");
  const gameField = document.getElementById("gameField");
  const gameOverlay = document.getElementById("gameOverlay");
  const gameTimeElement = document.getElementById("gameTime");
  const gameScoreElement = document.getElementById("gameScore");
  const gameBestElement = document.getElementById("gameBest");
  const easterEgg = document.getElementById("easterEgg");

  function randomFact() {
    return sharkFacts[Math.floor(Math.random() * sharkFacts.length)];
  }

  function showToast(message) {
    if (!easterEgg) return;
    easterEgg.textContent = message;
    easterEgg.classList.add("show");
    window.setTimeout(function () {
      easterEgg.classList.remove("show");
    }, 1800);
  }

  if (sharkFactElement) {
    sharkFactElement.textContent = randomFact();
  }

  if (newFactBtn && sharkFactElement) {
    newFactBtn.addEventListener("click", function () {
      sharkFactElement.textContent = randomFact();
      showToast("Fresh shark fact loaded.");
    });
  }

  const sharkMemes = [
    "Shark mode: ON. Bugs: OFF (hopefully).",
    "Code review approved by the Council of Sharks.",
    "If it compiles, the shark smiles.",
    "Coffee + shark playlist = +20 coding speed.",
    "Deploy first, panic never."
  ];

  if (sharkMemeLineElement) {
    sharkMemeLineElement.textContent = sharkMemes[0];
  }

  if (memeBtn && sharkMemeLineElement) {
    memeBtn.addEventListener("click", function () {
      const randomIndex = Math.floor(Math.random() * sharkMemes.length);
      sharkMemeLineElement.textContent = sharkMemes[randomIndex];
      showToast("New meme line delivered.");
    });
  }

  const storedSeaMode = window.localStorage.getItem("deepSeaMode") === "1";
  if (storedSeaMode) {
    document.body.classList.add("deep-mode");
  }

  if (seaModeBtn) {
    seaModeBtn.addEventListener("click", function () {
      const enabled = document.body.classList.toggle("deep-mode");
      window.localStorage.setItem("deepSeaMode", enabled ? "1" : "0");
      showToast(enabled ? "Deep Sea Mode enabled." : "Deep Sea Mode disabled.");
    });
  }

  let gameTimer = null;
  let gameLeft = 15;
  let gameScore = 0;
  let gameRunning = false;
  const bestScore = Number(window.localStorage.getItem("sharkRushBest") || "0");

  if (gameBestElement) {
    gameBestElement.textContent = String(bestScore);
  }

  function setGameText() {
    if (gameTimeElement) gameTimeElement.textContent = String(gameLeft);
    if (gameScoreElement) gameScoreElement.textContent = String(gameScore);
  }

  function moveFish() {
    if (!fishBtn || !gameField) return;
    const fishSize = fishBtn.offsetWidth || 56;
    const maxX = gameField.clientWidth - fishSize;
    const maxY = gameField.clientHeight - fishSize;
    const x = Math.max(0, Math.floor(Math.random() * maxX));
    const y = Math.max(0, Math.floor(Math.random() * maxY));
    fishBtn.style.left = x + fishSize / 2 + "px";
    fishBtn.style.top = y + fishSize / 2 + "px";
  }

  function stopGame() {
    gameRunning = false;
    if (fishBtn) fishBtn.disabled = true;
    if (gameTimer) {
      window.clearInterval(gameTimer);
      gameTimer = null;
    }
    if (gameOverlay) {
      gameOverlay.textContent = "Finished. Score: " + gameScore;
      gameOverlay.style.display = "block";
    }
    const oldBest = Number(window.localStorage.getItem("sharkRushBest") || "0");
    if (gameScore > oldBest) {
      window.localStorage.setItem("sharkRushBest", String(gameScore));
      if (gameBestElement) gameBestElement.textContent = String(gameScore);
      showToast("New high score: " + gameScore);
    }
  }

  function startGame() {
    gameLeft = 15;
    gameScore = 0;
    gameRunning = true;
    setGameText();
    if (fishBtn) fishBtn.disabled = false;
    if (gameOverlay) gameOverlay.style.display = "none";
    moveFish();

    if (gameTimer) {
      window.clearInterval(gameTimer);
    }
    gameTimer = window.setInterval(function () {
      gameLeft -= 1;
      setGameText();
      if (gameLeft <= 0) {
        stopGame();
      }
    }, 1000);
  }

  setGameText();

  if (fishBtn) {
    fishBtn.disabled = true;
    fishBtn.addEventListener("click", function () {
      if (!gameRunning) return;
      gameScore += 1;
      setGameText();
      moveFish();
    });
  }

  if (startGameBtn) {
    startGameBtn.addEventListener("click", function () {
      startGame();
      showToast("Shark Rush started.");
    });
  }

  let keyBuffer = "";
  window.addEventListener("keydown", function (event) {
    keyBuffer = (keyBuffer + event.key.toLowerCase()).slice(-5);
    if (keyBuffer === "shark") {
      showToast("Shark combo unlocked.");
    }
  });
})();
