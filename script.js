let questions = [
  {
    q: "Apa fungsi utama HTML dalam pengembangan web?",
    a: [
      "Membuat struktur halaman",
      "Mengatur warna website",
      "Mengelola server",
      "Menjalankan database"
    ],
    c: 0
  },
  {
    q: "CSS digunakan untuk ...",
    a: [
      "Logika program",
      "Styling tampilan",
      "Backend sistem",
      "Database"
    ],
    c: 1
  },
  {
    q: "JavaScript berfungsi untuk ...",
    a: [
      "Struktur halaman",
      "Interaksi pengguna",
      "Hardware control",
      "Design UI statis"
    ],
    c: 1
  },
  {
    q: "Komputasi pervasif adalah ...",
    a: [
      "Sistem offline",
      "Sistem yang sadar konteks pengguna",
      "Aplikasi desktop biasa",
      "Game engine"
    ],
    c: 1
  },
  {
    q: "Page Visibility API digunakan untuk ...",
    a: [
      "Deteksi tab aktif/tidak aktif",
      "Mengatur warna halaman",
      "Menyimpan database",
      "Menghitung skor"
    ],
    c: 0
  }
];

let current = 0;
let score = 0;
let timer = 60;

let tabCount = 0;
let afkCount = 0;
let idle = 0;

let interval;

/* START */
function startExam() {
  document.getElementById("loginScreen").classList.remove("show");
  document.getElementById("examScreen").classList.add("show");

  loadQuestion();
  startTimer();
  detectTab();
  detectAFK();
}

/* LOAD */
function loadQuestion() {
  let q = questions[current];

  document.getElementById("questionText").innerText = q.q;

  let html = "";
  q.a.forEach((item, i) => {
    html += `<label>
      <input type="radio" name="ans" value="${i}">
      ${item}
    </label>`;
  });

  document.getElementById("answerBox").innerHTML = html;

  document.getElementById("progressText").innerText =
    `Soal ${current + 1} / ${questions.length}`;
}

/* NEXT */
function nextQuestion() {
  let selected = document.querySelector("input[name='ans']:checked");

  if (selected && parseInt(selected.value) === questions[current].c) {
    score++;
  }

  current++;

  if (current < questions.length) loadQuestion();
  else finishExam();
}

/* PREV */
function prevQuestion() {
  if (current > 0) {
    current--;
    loadQuestion();
  }
}

/* TIMER */
function startTimer() {
  interval = setInterval(() => {
    timer--;
    document.getElementById("timer").innerText = timer;

    if (timer <= 0) finishExam();
  }, 1000);
}

/* TAB DETECT */
function detectTab() {
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      tabCount++;
      document.getElementById("tabCount").innerText = tabCount;

      document.getElementById("warningBox").innerText =
        "⚠ Tab switch detected";

      document.getElementById("status-tab").innerText = "Tab: WARNING";
    }
  });
}

/* AFK DETECT */
function detectAFK() {
  let reset = () => idle = 0;

  document.onmousemove = reset;
  document.onkeypress = reset;

  setInterval(() => {
    idle++;

    document.getElementById("status-afk").innerText =
      "AFK: " + idle + "s";

    if (idle > 10) {
      afkCount++;
      document.getElementById("afkCount").innerText = afkCount;

      document.getElementById("warningBox").innerText =
        "⏸ User inactive detected";
    }
  }, 1000);
}

/* FINISH */
function finishExam() {
  clearInterval(interval);

  document.getElementById("examScreen").classList.remove("show");
  document.getElementById("resultScreen").classList.add("show");

  document.getElementById("finalScore").innerText =
    `Skor: ${score} / ${questions.length}`;

  document.getElementById("activityLog").innerText =
    `Tab Switch: ${tabCount}\nAFK Event: ${afkCount}`;
}