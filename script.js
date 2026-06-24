// ============================================
//  特殊兒童收養互動新聞 — script.js
//  從 index.html 拆出，並修正 G4 卡片背景
// ============================================

// ---------- 家庭資料 ----------
const familyData = [
  {
    id: 1,
    title: "收養家庭檔案 (1/8)",
    content: `
      <p><strong>先生（41歲）：</strong>高職電子科畢業，現任汽車維修廠廠長，收入穩定。</p>
      <p><strong>太太（39歲）：</strong>大學幼保系畢業，現任私立幼兒園老師。</p>
      <p><strong>婚姻與生育：</strong>結婚 8 年，經歷 3 次試管嬰兒失敗，兩年前決定終止不孕治療。</p>
    `
  },
  {
    id: 2,
    title: "收養家庭檔案 (2/8)",
    content: `
      <p><strong>先生（38歲）：</strong>大學護理系畢業，現任醫院護理師。</p>
      <p><strong>太太（36歲）：</strong>高中畢業，現任超商店員，工時不穩定。</p>
      <p><strong>婚姻與生育：</strong>結婚 5 年，育有一名 4 歲健康兒童，希望再添一個孩子。</p>
    `
  },
  {
    id: 3,
    title: "收養家庭檔案 (3/8)",
    content: `
      <p><strong>先生（45歲）：</strong>碩士學歷，現任國中教師，工作穩定。</p>
      <p><strong>太太（43歲）：</strong>大學社工系畢業，現任社會局社工員，有特殊兒童服務經驗。</p>
      <p><strong>婚姻與生育：</strong>結婚 15 年，無法生育，曾擔任寄養家庭 3 年。</p>
    `
  },
  {
    id: 4,
    title: "收養家庭檔案 (4/8)",
    content: `
      <p><strong>先生（33歲）：</strong>大學資工系畢業，現任軟體工程師，收入高但工時長。</p>
      <p><strong>太太（31歲）：</strong>大學設計系畢業，目前全職在家。</p>
      <p><strong>婚姻與生育：</strong>結婚 2 年，剛開始考慮收養，無照顧特殊需求兒童經驗。</p>
    `
  },
  {
    id: 5,
    title: "收養家庭檔案 (5/8)",
    content: `
      <p><strong>先生（50歲）：</strong>碩士學歷，現任大學教授，收入穩定。</p>
      <p><strong>太太（48歲）：</strong>碩士學歷，現任國小校長，行政工作繁忙。</p>
      <p><strong>婚姻與生育：</strong>結婚 22 年，育有兩名成年子女，希望透過收養回饋社會。</p>
    `
  },
  {
    id: 6,
    title: "收養家庭檔案 (6/8)",
    content: `
      <p><strong>先生（29歲）：</strong>高中畢業，現任工廠作業員，收入較低。</p>
      <p><strong>太太（27歲）：</strong>高中畢業，現任美容師，兼職工作。</p>
      <p><strong>婚姻與生育：</strong>結婚 1 年，收入合計約 4 萬，居住空間為 20 坪租屋。</p>
    `
  },
  {
    id: 7,
    title: "收養家庭檔案 (7/8)",
    content: `
      <p><strong>先生（42歲）：</strong>大學心理系畢業，現任心理師，有兒童心理衡鑑專業。</p>
      <p><strong>太太（40歲）：</strong>大學特教系畢業，現任特教學校教師。</p>
      <p><strong>婚姻與生育：</strong>結婚 12 年，不孕症，長期擔任特殊兒童課後支援志工。</p>
    `
  },
  {
    id: 8,
    title: "收養家庭檔案 (8/8)",
    content: `
      <p><strong>先生（55歲）：</strong>大學畢業，現任公司董事長，財力雄厚。</p>
      <p><strong>太太（52歲）：</strong>大學畢業，全職家庭主婦，無工作壓力。</p>
      <p><strong>婚姻與生育：</strong>結婚 28 年，子女均已成年，年紀較大但資源豐富。</p>
    `
  }
];

// ---------- 遊戲狀態 ----------
let gameState = {
  childAgeMonths: 12,     // 初始年齡：1歲 0個月
  ageTimerInterval: null,
  currentCardIndex: 0,
  acceptedFamilies: 0,
  rejectedFamilies: 0,
  gameFailed: false
};

// ---------- 工具函式 ----------
function showScreen(id) {
  document.querySelectorAll('.screen-section').forEach(s => s.classList.remove('active'));
  const el = document.getElementById(id);
  if (el) el.classList.add('active');
}

function showGameScreen(id) {
  document.querySelectorAll('.game-screen').forEach(s => s.classList.remove('active'));
  const el = document.getElementById(id);
  if (el) el.classList.add('active');
}

function updateAgeDisplay() {
  const years = Math.floor(gameState.childAgeMonths / 12);
  const months = gameState.childAgeMonths % 12;
  const el = document.getElementById('child-age');
  if (el) el.textContent = `${years}歲 ${months}個月`;

  // 3 歲警告
  const warning = document.getElementById('age-warning');
  if (warning) {
    if (gameState.childAgeMonths >= 36) {
      warning.classList.remove('hidden');
    } else {
      warning.classList.add('hidden');
    }
  }

  // 6 歲失敗判定
  if (gameState.childAgeMonths >= 72 && !gameState.gameFailed) {
    gameState.gameFailed = true;
    stopAgeTimer();
    showGameScreen('game-r1');
  }
}

function startAgeTimer() {
  stopAgeTimer();
  gameState.ageTimerInterval = setInterval(() => {
    gameState.childAgeMonths++;
    updateAgeDisplay();
  }, 3000); // 每 3 秒增加 1 個月
}

function stopAgeTimer() {
  if (gameState.ageTimerInterval) {
    clearInterval(gameState.ageTimerInterval);
    gameState.ageTimerInterval = null;
  }
}

// ---------- G4 卡片渲染 ----------
function renderCurrentCard() {
  const container = document.getElementById('family-cards-container');
  if (!container) return;

  if (gameState.currentCardIndex >= familyData.length) {
    // 所有卡片看完
    container.innerHTML = '';
    document.getElementById('g4-hint').classList.add('hidden');
    document.getElementById('g4-action-btns').classList.add('hidden');
    document.getElementById('g4-complete-area').classList.remove('hidden');
    return;
  }

  const family = familyData[gameState.currentCardIndex];

  // ✅ 修正：inline style 全部明寫，不依賴任何外部 CSS，確保純白不透明
  container.innerHTML = `
    <div class="family-card" style="
      background-color: #ffffff !important;
      background: #ffffff !important;
      backdrop-filter: none !important;
      -webkit-backdrop-filter: none !important;
      opacity: 1 !important;
      border: 2px solid #333333;
      border-radius: 8px;
      padding: 20px;
      margin: 10px 0;
      box-shadow: 0 2px 8px rgba(0,0,0,0.2);
      color: #222222;
      transition: transform 0.3s ease, opacity 0.3s ease;
      position: relative;
      z-index: 10;
    ">
      <div style="
        color: #b45309 !important;
        font-weight: bold;
        margin-bottom: 12px;
        font-size: 0.95em;
      ">
        ${family.title}
      </div>
      <div style="
        color: #222222 !important;
        line-height: 1.7;
        font-size: 0.95em;
      ">
        ${family.content}
      </div>
    </div>
  `;

  // 強制覆蓋卡片內所有子元素的文字顏色
  setTimeout(() => {
    const card = container.querySelector('.family-card');
    if (card) {
      card.querySelectorAll('p, span, div, strong, em').forEach(el => {
        el.style.setProperty('color', '#222222', 'important');
        el.style.setProperty('opacity', '1', 'important');
      });
      card.querySelectorAll('strong').forEach(el => {
        el.style.setProperty('color', '#b45309', 'important');
      });
    }
  }, 0);

  // 給卡片加入滑動動畫 class
  const card = container.querySelector('.family-card');
  if (card) {
    card.classList.add('card-enter');
  }
}

function swipeCard(direction) {
  const container = document.getElementById('family-cards-container');
  const card = container ? container.querySelector('.family-card') : null;

  if (card) {
    card.style.transform = direction === 'left'
      ? 'translateX(-120%) rotate(-10deg)'
      : 'translateX(120%) rotate(10deg)';
    card.style.opacity = '0';
  }

  setTimeout(() => {
    if (direction === 'left') {
      gameState.acceptedFamilies++;
    } else {
      gameState.rejectedFamilies++;
    }
    gameState.currentCardIndex++;
    renderCurrentCard();
  }, 300);
}

// ---------- 事件綁定 ----------
document.addEventListener('DOMContentLoaded', () => {

  // === Stage 1：滑桿猜測 ===
  const slider = document.getElementById('guess-slider');
  const sliderDisplay = document.getElementById('slider-display');

  if (slider && sliderDisplay) {
    slider.addEventListener('input', () => {
      sliderDisplay.textContent = slider.value;
    });
  }

  document.getElementById('btn-submit-guess')?.addEventListener('click', () => {
    showScreen('stage-1-result');
  });

  // === Stage 1 結果 → Stage 2 ===
  document.getElementById('btn-to-stage-2')?.addEventListener('click', () => {
    showScreen('stage-2');
    showGameScreen('game-main');
  });

  // === Stage 3（報導）===
  document.querySelectorAll('.btn-to-stage-3').forEach(btn => {
    btn.addEventListener('click', () => showScreen('stage-3'));
  });

  // === 遊戲開場 ===
  document.getElementById('btn-start-task')?.addEventListener('click', () => {
    showGameScreen('game-g1');
    startAgeTimer();
  });

  // === G1 → G3 ===
  document.getElementById('btn-g1-next')?.addEventListener('click', () => {
    showGameScreen('game-g3');
  });

  // === G3 事件 1 ===
  document.getElementById('btn-g3-action-1')?.addEventListener('click', () => {
    document.getElementById('g3-event-1').classList.add('hidden');
    document.getElementById('g3-event-2').classList.remove('hidden');
  });

  // === G3 事件 2 ===
  document.getElementById('btn-g3-action-2')?.addEventListener('click', () => {
    document.getElementById('g3-event-2').classList.add('hidden');
    document.getElementById('btn-g3-to-g4').classList.remove('hidden');
  });

  // === G3 → G4 ===
  document.getElementById('btn-g3-to-g4')?.addEventListener('click', () => {
    showGameScreen('game-g4');
    gameState.currentCardIndex = 0;
    gameState.acceptedFamilies = 0;
    gameState.rejectedFamilies = 0;
    renderCurrentCard();
  });

  // === G4：適合（往左翻）===
  document.getElementById('btn-g4-accept')?.addEventListener('click', () => {
    swipeCard('left');
  });

  // === G4：不適合（往右翻）===
  document.getElementById('btn-g4-reject')?.addEventListener('click', () => {
    swipeCard('right');
  });

  // === G4 完成 → G5 ===
  document.getElementById('btn-g4-to-g5')?.addEventListener('click', () => {
    showGameScreen('game-g5');
    const nEl = document.getElementById('g5-n-value');
    if (nEl) nEl.textContent = gameState.acceptedFamilies;
    // 每個接受家庭花 3 個月審查
    gameState.childAgeMonths += gameState.acceptedFamilies * 3;
    updateAgeDisplay();
  });

  // === G5 → G6 ===
  document.getElementById('btn-g5-to-g6')?.addEventListener('click', () => {
    if (gameState.gameFailed) return;
    stopAgeTimer();
    showGameScreen('game-g6');
  });

  // === G6 → R2（成功）===
  document.getElementById('btn-g6-to-r')?.addEventListener('click', () => {
    if (gameState.acceptedFamilies > 0) {
      showGameScreen('game-r2');
    } else {
      showGameScreen('game-r1');
    }
  });

});
