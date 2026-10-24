// ===== PENGATURAN MUDAH =====
// Ganti password di bawah ini sebelum membagikan website.
// Catatan: password di website statis hanya untuk kejutan sederhana, bukan keamanan sungguhan.
const CORRECT_PASSWORD = "mida imup pacar lumi";
const TOTAL_GAMES = 8;
const surprises = [
  "Kamu itu alasan sederhana kenapa hari biasa bisa terasa istimewa. 💙",
  "Semoga semua hal baik yang kamu doakan pelan-pelan menemukan jalan ke kamu. ✨",
  "Jangan lupa bangga sama diri sendiri. Kamu sudah melewati banyak hal sampai hari ini. 🫶",
  "Semoga tahun ini penuh tawa, teman baik, dan momen yang ingin kamu simpan selamanya. 🎈",
  "Kamu pantas menerima kasih sayang yang tulus, bukan cuma hari ini, tapi setiap hari. 💌",
  "Semoga keberanianmu lebih besar daripada rasa takutmu. Kamu pasti bisa! 🌟",
  "Hadiah terbaik bukan selalu barang, kadang juga waktu, perhatian, dan kenangan. 🎁",
  "Selamat ulang tahun! Semoga bab baru hidupmu penuh warna biru, damai, dan bahagia. 🎂",
];
const games = [
  {
    id: "quiz",
    title: "Kuis tentang kamu",
    emoji: "🧠",
    desc: "Pilih jawaban",
    render: renderQuiz,
  },
  {
    id: "memory",
    title: "Memory match",
    emoji: "🃏",
    desc: "Cari pasangan",
    render: renderMemory,
  },
  {
    id: "guess",
    title: "Tebak angka",
    emoji: "🔢",
    desc: "Tebak 1–10",
    render: renderGuess,
  },
  {
    id: "reaction",
    title: "Tes refleks",
    emoji: "⚡",
    desc: "Klik secepatnya",
    render: renderReaction,
  },
  {
    id: "scramble",
    title: "Susun kata",
    emoji: "🔤",
    desc: "Rapikan huruf",
    render: renderScramble,
  },
  {
    id: "gift",
    title: "Pilih hadiah",
    emoji: "🎁",
    desc: "Buka kejutan",
    render: renderGift,
  },
  {
    id: "compliment",
    title: "Mesin Surat Cinta",
    emoji: "💌",
    desc: "Ambil pesan",
    render: renderCompliment,
  },
  {
    id: "wish",
    title: "Harapan ulang tahun",
    emoji: "🕯️",
    desc: "Buat harapan",
    render: renderWish,
  },
];
const completed = new Set();
let activeGame = null;
let memoryState = { cards: [], open: [], matched: [], locked: false };
let reactionTimer = null;
let reactionStart = 0;
let reactionReady = false;
let guessSecret = Math.floor(Math.random() * 10) + 1;
let guessCount = 0;

const $ = (id) => document.getElementById(id);
$("togglePassword").addEventListener("click", () => {
  const input = $("password");
  input.type = input.type === "password" ? "text" : "password";
  $("togglePassword").textContent =
    input.type === "password" ? "Lihat" : "Sembunyikan";
});
$("loginForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const value = $("password").value;
  if (value === CORRECT_PASSWORD) {
    $("loginMessage").textContent = "Password benar! Selamat datang 💙";
    $("loginMessage").className = "message ok";
    $("loginScreen").classList.add("hidden");
    $("gameScreen").classList.remove("hidden");
    buildNav();
    openGame("quiz");
  } else {
    $("loginMessage").textContent =
      "yahahah paswordnya salah. Coba lagi ya sayang! 🔒";
    $("loginMessage").className = "message";
    $("password").select();
  }
});
$("logoutBtn").addEventListener("click", () => {
  $("gameScreen").classList.add("hidden");
  $("loginScreen").classList.remove("hidden");
  $("password").value = "";
  $("loginMessage").textContent = "";
  clearTimeout(reactionTimer);
});

function buildNav() {
  $("gameNav").innerHTML = "";
  games.forEach((g) => {
    const b = document.createElement("button");
    b.className = "game-card";
    b.id = "nav-" + g.id;
    b.innerHTML = `<span class="emoji">${g.emoji}</span><strong>${g.title}</strong><small>${completed.has(g.id) ? "✅ Selesai" : g.desc}</small>`;
    b.addEventListener("click", () => openGame(g.id));
    $("gameNav").appendChild(b);
  });
  updateProgress();
}
function updateProgress() {
  $("progressText").textContent = `${completed.size} / ${TOTAL_GAMES} selesai`;
  $("progressBar").style.width = `${(completed.size / TOTAL_GAMES) * 100}%`;
  games.forEach((g) => {
    const b = $("nav-" + g.id);
    if (!b) return;
    b.classList.toggle("active", activeGame === g.id);
    b.classList.toggle("done", completed.has(g.id));
    const small = b.querySelector("small");
    small.textContent = completed.has(g.id) ? "✅ Selesai" : g.desc;
  });
  $("surpriseText").textContent =
    completed.size === TOTAL_GAMES
      ? "Semua kejutan sudah terbuka! Kamu berhasil menamatkan Birthday Quest. Selamat ulang tahun! 💙🎉"
      : `Kamu sudah membuka ${completed.size} dari ${TOTAL_GAMES} kejutan. Selesaikan game lain untuk membuka pesan berikutnya.`;
}
function openGame(id) {
  clearTimeout(reactionTimer);
  activeGame = id;
  updateProgress();
  const g = games.find((x) => x.id === id);
  if (g) g.render();
}
function showGame(title, intro, content) {
  $("gameArea").innerHTML =
    `<h2>${title}</h2><p class="muted">${intro}</p><div id="gameContent">${content}</div>`;
}
function complete(id, message = "Berhasil! Kejutan baru terbuka. 🎉") {
  if (!completed.has(id)) completed.add(id);
  updateProgress();
  const old = $("gameFeedback");
  if (old) {
    old.className = "result win";
    old.textContent = message;
  } else
    $("gameContent").insertAdjacentHTML(
      "beforeend",
      `<div id="gameFeedback" class="result win">${message}</div>`,
    );
}
function feedback(message, type = "result") {
  let box = $("gameFeedback");
  if (!box) {
    $("gameContent").insertAdjacentHTML(
      "beforeend",
      '<div id="gameFeedback" class="result"></div>',
    );
    box = $("gameFeedback");
  }
  box.className = type;
  box.textContent = message;
}
function renderQuiz() {
  showGame(
    "🧠 Kuis tentang kamu",
    "Jawab pertanyaan ringan ini.",
    `
    <div class="big-question">Apa yang paling penting saat merayakan ulang tahun?</div>
    <div class="choice-row" id="quizChoices">
      <button class="choice" data-v="a">A. Hadiah yang mahal</button>
      <button class="choice" data-v="b">B. Kebahagiaan dan orang tersayang</button>
      <button class="choice" data-v="c">C. Nongkrong sama Temen</button>
    </div><div id="gameFeedback" class="result">Pilih jawabanmu.</div>`,
  );
  document.querySelectorAll("#quizChoices .choice").forEach(
    (b) =>
      (b.onclick = () => {
        if (b.dataset.v === "b") {
          complete(
            "quiz",
            "Benar! Momen bersama orang tersayang memang berharga. 💙",
          );
        } else
          feedback(
            "Coba pikirkan lagi. Ulang tahun paling seru kalau hati ikut bahagia! 😊",
            "result error",
          );
      }),
  );
}
function renderMemory() {
  const faces = ["🎂", "🎁", "💙", "⭐", "🎈", "💌"];
  const cards = [...faces, ...faces].sort(() => Math.random() - 0.5);
  memoryState = { cards, open: [], matched: [], locked: false };
  showGame(
    "🃏 Memory match",
    "Temukan semua pasangan emoji. Tekan dua kartu untuk membaliknya.",
    `<div class="memory-grid" id="memoryGrid"></div><p id="memoryCount" class="muted">Pasangan ditemukan: 0 / 6</p><div id="gameFeedback" class="result">Ayo cari pasangan yang sama!</div><button class="ghost" id="resetMemory">Acak ulang</button>`,
  );
  drawMemory();
  $("resetMemory").onclick = renderMemory;
}
function drawMemory() {
  const grid = $("memoryGrid");
  if (!grid) return;
  grid.innerHTML = "";
  memoryState.cards.forEach((face, i) => {
    const b = document.createElement("button");
    b.className = "memory-card";
    b.textContent =
      memoryState.matched.includes(i) || memoryState.open.includes(i)
        ? face
        : "❔";
    if (memoryState.matched.includes(i)) b.classList.add("matched");
    else if (memoryState.open.includes(i)) b.classList.add("open");
    b.disabled =
      memoryState.locked ||
      memoryState.matched.includes(i) ||
      memoryState.open.includes(i);
    b.onclick = () => flipMemory(i);
    grid.appendChild(b);
  });
  $("memoryCount").textContent =
    `Pasangan ditemukan: ${memoryState.matched.length / 2} / 6`;
}
function flipMemory(i) {
  memoryState.open.push(i);
  drawMemory();
  if (memoryState.open.length === 2) {
    const [a, b] = memoryState.open;
    if (memoryState.cards[a] === memoryState.cards[b]) {
      memoryState.matched.push(a, b);
      memoryState.open = [];
      drawMemory();
      if (memoryState.matched.length === 12)
        complete("memory", "Hebat! Semua pasangan berhasil ditemukan. 🃏💙");
    } else {
      memoryState.locked = true;
      setTimeout(() => {
        memoryState.open = [];
        memoryState.locked = false;
        drawMemory();
      }, 700);
    }
  }
}
function renderGuess() {
  guessSecret = Math.floor(Math.random() * 10) + 1;
  guessCount = 0;
  showGame(
    "🔢 Tebak angka",
    "Aku memilih angka rahasia dari 1 sampai 10. Kamu punya 4 kesempatan.",
    `<div class="choice-row"><input id="guessInput" type="number" min="1" max="10" placeholder="Angka 1–10"><button id="guessBtn" class="primary">Tebak!</button></div><div id="gameFeedback" class="result">Semoga beruntung 🍀</div><button id="newGuess" class="ghost">Mulai angka baru</button>`,
  );
  $("guessBtn").onclick = () => {
    const n = Number($("guessInput").value);
    if (!Number.isInteger(n) || n < 1 || n > 10) {
      feedback("Masukkan angka bulat 1 sampai 10.", "result error");
      return;
    }
    guessCount++;
    if (n === guessSecret) {
      complete(
        "guess",
        `Tepat! Angkanya ${guessSecret}. Kamu menebak dalam ${guessCount} kali. 🎯`,
      );
      $("guessBtn").disabled = true;
    } else if (guessCount >= 4) {
      feedback(
        `Kesempatan habis! Angka rahasianya ${guessSecret}. Klik angka baru untuk coba lagi.`,
        "result error",
      );
      $("guessBtn").disabled = true;
    } else
      feedback(
        n < guessSecret
          ? `Terlalu kecil! Sisa kesempatan: ${4 - guessCount}.`
          : `Terlalu besar! Sisa kesempatan: ${4 - guessCount}.`,
      );
  };
  $("newGuess").onclick = renderGuess;
}
function renderReaction() {
  showGame(
    "⚡ Tes refleks",
    "Klik tombol saat berubah menjadi hijau. Jangan klik sebelum waktunya!",
    `<div class="result" id="reactionBox">Tekan “Mulai”, lalu tunggu sampai tombol berubah hijau.</div><div class="choice-row"><button class="primary" id="reactionBtn">Mulai tes</button></div><div id="gameFeedback" class="result">Siapkan refleksmu!</div>`,
  );
  const btn = $("reactionBtn"),
    box = $("reactionBox");
  let phase = "idle";
  btn.onclick = () => {
    if (phase === "idle" || phase === "done") {
      phase = "wait";
      btn.textContent = "Tunggu...";
      btn.style.background = "#f59e0b";
      btn.disabled = true;
      box.textContent = "Jangan klik dulu…";
      reactionTimer = setTimeout(
        () => {
          phase = "go";
          reactionStart = performance.now();
          btn.disabled = false;
          btn.textContent = "KLIK SEKARANG!";
          btn.style.background = "#16a34a";
          box.textContent = "SEKARANG!";
        },
        1000 + Math.random() * 2500,
      );
    } else if (phase === "wait") {
      clearTimeout(reactionTimer);
      phase = "done";
      btn.disabled = false;
      btn.textContent = "Coba lagi";
      btn.style.background = "";
      feedback("Terlalu cepat! Refleks sabar juga penting 😆", "result error");
    } else if (phase === "go") {
      const ms = Math.round(performance.now() - reactionStart);
      phase = "done";
      btn.textContent = "Main lagi";
      btn.style.background = "";
      if (ms < 900)
        complete("reaction", `Wow! Waktu reaksimu ${ms} ms. Cepat sekali! ⚡`);
      else
        feedback(
          `Waktu reaksimu ${ms} ms. Game selesai! Coba lagi untuk mengalahkan 900 ms.`,
        );
    }
  };
}
function renderScramble() {
  const rounds = [
    {
      word: "mida cantik",
      hint: "Mungkin orang yang kamu sayang",
    },
    {
      word: "aku sayang kamu",
      hint: "Tiga kata yang ingin didengar sama pacar kamu",
    },
    {
      word: "kasih sayang",
      hint: "Semakin dibagi, aku justru semakin bertambah.",
    },
  ];

  let idx = 0;
  let score = 0;

  showGame(
    "🔤 Susun kata",
    "Susun huruf menjadi kata yang benar. Ada 3 ronde.",
    `
      <h3 id="scrambleRound">Ronde 1 / 3</h3>
      <p id="scrambleHint" class="muted"></p>
      <div class="big-question" id="scrambleLetters"></div>
      <input
        id="scrambleInput"
        type="text"
        placeholder="Ketik jawaban..."
        autocomplete="off"
      >
      <button class="primary" id="scrambleSubmit">Periksa</button>
      <div id="gameFeedback" class="result">
        Susun kata yang benar ya! 💗
      </div>
    `,
  );

  function load() {
    const word = rounds[idx].word;

    // Acak huruf tanpa mengubah spasi
    const words = word.split(" ");
    const mixedWords = words.map((w) => {
      let letters = w.split("");

      for (let i = letters.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [letters[i], letters[j]] = [letters[j], letters[i]];
      }

      // Pastikan susunan tidak sama dengan kata asli
      if (letters.join("") === w && letters.length > 1) {
        [letters[0], letters[1]] = [letters[1], letters[0]];
      }

      return letters.join("");
    });

    $("scrambleRound").textContent = `Ronde ${idx + 1} / 3`;
    $("scrambleHint").textContent = "Petunjuk: " + rounds[idx].hint;
    $("scrambleLetters").textContent = mixedWords.join("   ");
    $("scrambleInput").value = "";
    $("scrambleInput").disabled = false;
    $("scrambleSubmit").disabled = false;
    $("scrambleInput").focus();
  }

  function checkAnswer() {
    const answer = $("scrambleInput")
      .value.trim()
      .toLowerCase()
      .replace(/\s+/g, "");

    const correctAnswer = rounds[idx].word.toLowerCase().replace(/\s+/g, "");

    if (answer === correctAnswer) {
      score++;
      idx++;

      if (idx === rounds.length) {
        $("scrambleInput").disabled = true;
        $("scrambleSubmit").disabled = true;

        complete("scramble", `Sempurna! Skor kamu ${score}/3. 🔤💗`);
      } else {
        feedback("Benar! Lanjut ke ronde berikutnya 💗");
        load();
      }
    } else {
      feedback("Belum tepat, coba susun lagi ya 😜", "result error");
    }
  }

  load();

  $("scrambleSubmit").onclick = checkAnswer;

  $("scrambleInput").addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      checkAnswer();
    }
  });
}
function renderScramble() {
  const rounds = [
    {
      word: "mida cantik",
      hint: "Mungkin orang yang kamu sayang",
    },
    {
      word: "aku sayang kamu",
      hint: "Tiga kata yang ingin didengar sama pacar kamu",
    },
    {
      word: "kasih sayang",
      hint: "Semakin dibagi, aku justru semakin bertambah.",
    },
  ];

  let idx = 0;
  let score = 0;

  showGame(
    "🔤 Susun kata",
    "Susun huruf menjadi kata yang benar. Ada 3 ronde.",
    `
      <h3 id="scrambleRound">Ronde 1 / 3</h3>
      <p id="scrambleHint" class="muted"></p>
      <div class="big-question" id="scrambleLetters"></div>
      <input
        id="scrambleInput"
        type="text"
        placeholder="Ketik jawaban..."
        autocomplete="off"
      >
      <button class="primary" id="scrambleSubmit">Periksa</button>
      <div id="gameFeedback" class="result">
        Susun kata yang benar ya! 💗
      </div>
    `,
  );

  function load() {
    const word = rounds[idx].word;

    // Acak huruf tanpa mengubah spasi
    const words = word.split(" ");
    const mixedWords = words.map((w) => {
      let letters = w.split("");

      for (let i = letters.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [letters[i], letters[j]] = [letters[j], letters[i]];
      }

      // Pastikan susunan tidak sama dengan kata asli
      if (letters.join("") === w && letters.length > 1) {
        [letters[0], letters[1]] = [letters[1], letters[0]];
      }

      return letters.join("");
    });

    $("scrambleRound").textContent = `Ronde ${idx + 1} / 3`;
    $("scrambleHint").textContent = "Petunjuk: " + rounds[idx].hint;
    $("scrambleLetters").textContent = mixedWords.join("   ");
    $("scrambleInput").value = "";
    $("scrambleInput").disabled = false;
    $("scrambleSubmit").disabled = false;
    $("scrambleInput").focus();
  }

  function checkAnswer() {
    const answer = $("scrambleInput")
      .value.trim()
      .toLowerCase()
      .replace(/\s+/g, "");

    const correctAnswer = rounds[idx].word.toLowerCase().replace(/\s+/g, "");

    if (answer === correctAnswer) {
      score++;
      idx++;

      if (idx === rounds.length) {
        $("scrambleInput").disabled = true;
        $("scrambleSubmit").disabled = true;

        complete("scramble", `Sempurna! Skor kamu ${score}/3. 🔤💗`);
      } else {
        feedback("Benar! Lanjut ke ronde berikutnya 💗");
        load();
      }
    } else {
      feedback("Belum tepat, coba susun lagi ya 😜", "result error");
    }
  }

  load();

  $("scrambleSubmit").onclick = checkAnswer;

  $("scrambleInput").addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      checkAnswer();
    }
  });
}
function renderGift() {
  showGame(
    "🎁 Pilih hadiah rahasia",
    "Pilih satu kotak. Apa pun pilihanmu, ada pesan kecil di dalamnya.",
    `<div class="choice-row" id="giftChoices"><button class="choice" data-i="0">🎁 Kotak A</button><button class="choice" data-i="1">🎁 Kotak B</button><button class="choice" data-i="2">🎁 Kotak C</button></div><div id="gameFeedback" class="result">Pilih satu hadiah untuk dibuka.</div>`,
  );
  const gifts = [
    "Hadiahmu hari ini: Mida sayang lumi. 🛌",
    "Hadiahmu hari ini: Doa baik buat lumi dari mida 💗",
    "Hadiahmu hari ini: satu harapan baik yang dikirim dari hati. 💙",
  ];
  document.querySelectorAll("#giftChoices button").forEach(
    (b) =>
      (b.onclick = () => {
        document
          .querySelectorAll("#giftChoices button")
          .forEach((x) => (x.disabled = true));
        complete("gift", gifts[Number(b.dataset.i)]);
      }),
  );
}

function renderCompliment() {
  const lines = [
    `Hallo sayang! Happy birthday to you, cintakuu! Selamat bertambah usia yaa. Di umur yang ke-23 ini, aku berdoa semoga kamu selalu dalam lindungan Allah SWT, selalu sehat, selalu baik, dilancarkan rezekinya, dan menjadi seseorang yang selalu ingin tumbuh menjadi lebih baik. Jadi pribadi yang lebih baik buat diri sendiri dan orang lain yaa, sayang. 💙`,

    `Untuk segala hal yang aku ucapkan sekarang, hal terpenting dan yang utama adalah rasa terima kasih. Terima kasih sudah lahir ke dunia dan tumbuh menjadi pria yang baik hati. Aku bersyukur bisa mengenal kamu dan menjadi bagian dari perjalanan hidup kamu. Semoga semua hal baik selalu menyertai langkahmu. 🤍`,

    `Aku akan jadi seseorang yang selalu bangga sama kamu, sama perjalanan kamu, dan sama semua yang kamu lakuin. Aku akan selalu support keinginan kamu, hobi kamu, dan hal-hal lain yang sedang kamu tekunin. Aku akan selalu di sini nemenin kamu, percayalah sama itu. Kalau kamu butuh orang buat hal apa pun, kabarin aku, okay? Aku akan selalu ada buat kamu di mana pun dan kapan pun. I will always endeavour for that. 💙`,

    `Ada banyak hal baik yang masih menunggumu di depan sana. Jangan terlalu keras sama diri sendiri ketika sesuatu tidak berjalan sesuai keinginanmu. Kamu sudah berusaha sejauh ini, dan aku harap kamu selalu ingat bahwa setiap proses yang kamu jalani itu berarti. Semoga di umur yang baru ini kamu menemukan lebih banyak alasan untuk tersenyum dan merasa bangga sama diri sendiri. 🤍`,

    `i love you, always, every day, every hour, every minute, and every second. 🤍

my love for you keeps growing every day, and i will always love you, my love.

once again, happy birthday, dear. 🎂 i hope you find happiness in every little thing today and always. you deserve all the love and good things in this world.

i love u so much, cintakuu duniakuu. 🫶🏻💗`,
  ];

  showGame(
    "💌 Mesin Surat Cinta",
    "Ada beberapa pesan khusus buat kamu. Baca satu per satu, ya.",
    `
      <div class="letter" id="complimentText">
        Ada surat kecil yang menunggu untuk kamu baca. 💌
      </div>

      <button class="primary" id="complimentBtn">
        Buka Surat 💌
      </button>

      <div id="gameFeedback" class="result">
        Buka 3 pesan untuk menyelesaikan game.
      </div>
    `,
  );

  let count = 0;

  $("complimentBtn").onclick = () => {
    if (count < lines.length) {
      $("complimentText").textContent = lines[count];
      count++;
    } else {
      count = 0;
      $("complimentText").textContent = lines[count];
      count++;
    }

    if (count === 3) {
      complete(
        "compliment",
        "Tiga pesan sudah kamu baca. Semoga semua doa baik menyertai kamu. 💙",
      );
    } else {
      feedback(
        `Pesan ${count}/${lines.length} terbuka. ${
          count < lines.length
            ? "Klik untuk membaca surat berikutnya. 💌"
            : "Semua surat sudah kamu baca. 🤍"
        }`,
      );
    }

    $("complimentBtn").textContent =
      count < lines.length ? "Surat Berikutnya 💌" : "Baca Lagi dari Awal 💌";
  };
}
function renderWish() {
  showGame(
    "🕯️ Harapan ulang tahun",
    "Tuliskan harapanmu, lalu tiup lilin virtual dengan menekan tombol.",
    `<input id="wishInput" type="text" placeholder="Tulis satu harapanmu..." maxlength="120"><div class="big-icon" id="candle">🕯️</div><button class="primary" id="blowBtn">Tiup lilin! 🌬️</button><div id="gameFeedback" class="result">Harapanmu tidak harus dibagikan ke siapa pun.</div>`,
  );
  $("blowBtn").onclick = () => {
    const wish = $("wishInput").value.trim();
    if (!wish) {
      feedback(
        "Tulis satu harapan dulu sebelum meniup lilin ya.",
        "result error",
      );
      return;
    }
    $("candle").textContent = "✨🎂✨";
    complete(
      "wish",
      `Lilin sudah ditiup! Semoga harapanmu terkabul yaa sayangg, Happy Birthday Sayangkuu!!💙`,
    );
  };
}
