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
  const sharkCanvas = document.getElementById("sharkCanvas");
  const gameField = document.getElementById("gameField");
  const gameOverlay = document.getElementById("gameOverlay");
  const gameDistanceElement = document.getElementById("gameDistance");
  const gameFishElement = document.getElementById("gameFish");
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

  if (sharkCanvas && gameField) {
    const ctx = sharkCanvas.getContext("2d");
    const dpr = Math.max(1, window.devicePixelRatio || 1);
    const bestScore = Number(window.localStorage.getItem("sharkRushBest") || "0");

    let rafId = 0;
    let running = false;
    let distance = 0;
    let fishScore = 0;
    let score = 0;
    let speed = 3.6;
    let frame = 0;
    let obstacles = [];
    let fishes = [];
    let shark = { x: 90, y: 100, vy: 0, size: 18 };

    function resizeCanvas() {
      const width = gameField.clientWidth;
      const height = gameField.clientHeight;
      sharkCanvas.width = Math.floor(width * dpr);
      sharkCanvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      shark.y = Math.min(height - 30, Math.max(30, shark.y || height / 2));
    }

    function updateGameText() {
      if (gameDistanceElement) gameDistanceElement.textContent = String(Math.floor(distance));
      if (gameFishElement) gameFishElement.textContent = String(fishScore);
      if (gameScoreElement) gameScoreElement.textContent = String(score);
    }

    function drawShark() {
      ctx.save();
      ctx.translate(shark.x, shark.y);
      ctx.fillStyle = "#9fefff";
      ctx.beginPath();
      ctx.ellipse(0, 0, 24, 13, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(-20, 0);
      ctx.lineTo(-34, -9);
      ctx.lineTo(-34, 9);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = "#0a1724";
      ctx.beginPath();
      ctx.arc(11, -3, 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    function drawSeaweed(x, y, h) {
      ctx.fillStyle = "#1da96d";
      ctx.fillRect(x, y, 24, h);
      ctx.fillStyle = "#2fd58c";
      ctx.fillRect(x + 10, y, 7, h);
    }

    function spawnObstacle() {
      const h = gameField.clientHeight;
      const gap = 80;
      const gapTop = 26 + Math.random() * (h - gap - 52);
      obstacles.push({ x: gameField.clientWidth + 20, gapTop: gapTop, gapBottom: gapTop + gap, width: 24, passed: false });
      if (Math.random() > 0.25) {
        fishes.push({
          x: gameField.clientWidth + 90,
          y: gapTop + 12 + Math.random() * (gap - 24),
          size: 8,
          taken: false
        });
      }
    }

    function isCollidingRect(rect) {
      const closestX = Math.max(rect.x, Math.min(shark.x, rect.x + rect.w));
      const closestY = Math.max(rect.y, Math.min(shark.y, rect.y + rect.h));
      const dx = shark.x - closestX;
      const dy = shark.y - closestY;
      return dx * dx + dy * dy < shark.size * shark.size;
    }

    function endGame() {
      running = false;
      if (gameOverlay) {
        gameOverlay.textContent = "Crashed into seaweed. Score: " + score;
        gameOverlay.style.display = "block";
      }
      const currentBest = Number(window.localStorage.getItem("sharkRushBest") || "0");
      if (score > currentBest) {
        window.localStorage.setItem("sharkRushBest", String(score));
        if (gameBestElement) gameBestElement.textContent = String(score);
        showToast("New best shark score: " + score);
      }
    }

    function flap() {
      if (!running) return;
      shark.vy = -4.8;
    }

    function resetGame() {
      running = true;
      distance = 0;
      fishScore = 0;
      score = 0;
      speed = 3.6;
      frame = 0;
      obstacles = [];
      fishes = [];
      shark.vy = 0;
      shark.y = gameField.clientHeight / 2;
      if (gameOverlay) gameOverlay.style.display = "none";
      updateGameText();
      spawnObstacle();
    }

    function drawBackground() {
      const w = gameField.clientWidth;
      const h = gameField.clientHeight;
      const g = ctx.createLinearGradient(0, 0, 0, h);
      g.addColorStop(0, "#0b2d45");
      g.addColorStop(1, "#07192a");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);
      ctx.strokeStyle = "rgba(120, 240, 255, 0.22)";
      ctx.lineWidth = 1;
      for (let i = 0; i < 4; i += 1) {
        const y = 32 + i * 46;
        ctx.beginPath();
        ctx.moveTo(0, y + Math.sin((frame + i * 20) * 0.04) * 2);
        ctx.lineTo(w, y + Math.cos((frame + i * 12) * 0.04) * 2);
        ctx.stroke();
      }
    }

    function gameLoop() {
      if (!ctx) return;
      const h = gameField.clientHeight;

      if (running) {
        frame += 1;
        shark.vy += 0.24;
        shark.vy = Math.min(shark.vy, 6);
        shark.y += shark.vy;
        distance += speed * 0.08;
        score = Math.floor(distance + fishScore * 25);
        speed = Math.min(6.8, speed + 0.0008);

        if (frame % 95 === 0) {
          spawnObstacle();
        }

        obstacles.forEach(function (obstacle) {
          obstacle.x -= speed;
        });
        fishes.forEach(function (fish) {
          fish.x -= speed;
        });

        obstacles = obstacles.filter(function (obstacle) {
          return obstacle.x + obstacle.width > -30;
        });
        fishes = fishes.filter(function (fish) {
          return fish.x + fish.size > -20 && !fish.taken;
        });

        for (let i = 0; i < obstacles.length; i += 1) {
          const obstacle = obstacles[i];
          const topRect = { x: obstacle.x, y: 0, w: obstacle.width, h: obstacle.gapTop };
          const bottomRect = {
            x: obstacle.x,
            y: obstacle.gapBottom,
            w: obstacle.width,
            h: h - obstacle.gapBottom
          };

          if (isCollidingRect(topRect) || isCollidingRect(bottomRect)) {
            endGame();
          }
        }

        for (let j = 0; j < fishes.length; j += 1) {
          const fish = fishes[j];
          const dx = shark.x - fish.x;
          const dy = shark.y - fish.y;
          if (dx * dx + dy * dy < (shark.size + fish.size) * (shark.size + fish.size)) {
            fish.taken = true;
            fishScore += 1;
            score = Math.floor(distance + fishScore * 25);
            showToast("Chomp +1 fish");
          }
        }

        if (shark.y - shark.size < 0 || shark.y + shark.size > h) {
          endGame();
        }
      }

      drawBackground();

      obstacles.forEach(function (obstacle) {
        drawSeaweed(obstacle.x, 0, obstacle.gapTop);
        drawSeaweed(obstacle.x, obstacle.gapBottom, h - obstacle.gapBottom);
      });

      fishes.forEach(function (fish) {
        ctx.fillStyle = "#ffc857";
        ctx.beginPath();
        ctx.arc(fish.x, fish.y, fish.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(fish.x - fish.size, fish.y);
        ctx.lineTo(fish.x - fish.size - 7, fish.y - 5);
        ctx.lineTo(fish.x - fish.size - 7, fish.y + 5);
        ctx.closePath();
        ctx.fill();
      });

      drawShark();
      updateGameText();
      rafId = window.requestAnimationFrame(gameLoop);
    }

    if (gameBestElement) {
      gameBestElement.textContent = String(bestScore);
    }
    resizeCanvas();
    gameLoop();
    window.addEventListener("resize", resizeCanvas);

    if (startGameBtn) {
      startGameBtn.addEventListener("click", function () {
        resetGame();
        showToast("Shark run started.");
      });
    }

    if (gameField) {
      gameField.addEventListener("pointerdown", function () {
        if (!running) return;
        flap();
      });
    }

    window.addEventListener("keydown", function (event) {
      if (event.code === "Space" || event.code === "ArrowUp") {
        if (running) {
          event.preventDefault();
          flap();
        }
      }
    });

    window.addEventListener("beforeunload", function () {
      if (rafId) {
        window.cancelAnimationFrame(rafId);
      }
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
