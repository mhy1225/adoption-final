// ============================================
//  特殊兒童收養互動新聞 — script.js
// ============================================

const familyCases = [
    { 
        id: 1, 
        title: "收養家庭檔案 (1/3)", 
        content: "<strong>【高社經菁英家庭】</strong><br><strong>背景：</strong>先生（45歲）為科技業副總，太太（42歲）為外商銀行高管。年收破千萬，居住於市中心豪宅，並已預先聘請全職保母。<br><strong>收養動機：</strong>經歷多年不孕，認為自身擁有頂級資源，能給予孩子最好的醫療與教育。<br><strong>社工評估筆記：</strong>夫妻雙方皆處於極高壓、長工時的環境，且表示無法配合請育嬰假。面對特殊兒密集的早療需求，他們傾向「花錢請專業保母與看護解決」，將醫療視為「修復缺陷的工具」，期待孩子能盡快跟上一般人的發展標準。孩子恐將面臨極大的「成就期盼」壓力。" 
    },
    { 
        id: 2, 
        title: "收養家庭檔案 (2/3)", 
        content: "<strong>【雙薪彈性辦公家庭】</strong><br><strong>背景：</strong>先生（41歲）為遠距工作的接案工程師，太太（39歲）為兼職會計。兩人收入中等但財務規劃穩健，居住於有電梯的社區大樓。<br><strong>收養動機：</strong>結婚 8 年未生育，兩年前開始接觸特殊兒早療志工服務，深刻理解「進步不是直線的」，願意以孩子的步調為中心。<br><strong>社工評估筆記：</strong>家庭展現出極高的<strong>「包容度」與「工作彈性」</strong>。先生的遠端工作型態能隨時機動配合每週數次的醫院復健與早療課程；太太已計畫在收養初期的前兩年轉為全職，專心與孩子建立安全依附關係。他們在會談中表示，不期待孩子變得「正常」，而是準備好陪孩子面對真實的人生。" 
    },
    { 
        id: 3, 
        title: "收養家庭檔案 (3/3)", 
        content: "<strong>【傳統大家族企業】</strong><br><strong>背景：</strong>先生（38歲）為中南部傳統傳產接班人，與父母及親戚同住透天別墅。太太（36歲）為全職家庭主婦。<br><strong>收養動機：</strong>結婚 7 年無子，面臨家族長輩龐大的傳宗接代壓力，妥協轉而尋求收養。<br><strong>社工評估筆記：</strong>主要照顧者（太太）承受極大家族壓力，收養動機參雜了「穩固家庭地位」的考量。此外，同住的長輩對「特殊身心狀況」仍帶有傳統偏見，認為是「業障」或「有失顏面」。在這種環境下，特殊兒童極易成為家族矛盾的導火線，缺乏被無條件接納的空間。" 
    }
];

// ---------- 遊戲狀態 ----------
let gameState = {
  childAgeMonths: 12,     
  ageTimerInterval: null,
  currentCardIndex: 0,
  acceptedFamilies: 0,
  rejectedFamilies: 0,
  gameFailed: false
};

// ---------- 工具函式 ----------
function showScreen(id) {
  document.querySelectorAll('.screen-section').forEach(s => {
      s.classList.remove('active');
      s.classList.add('hidden');
  });
  const el = document.getElementById(id);
  if (el) {
      el.classList.remove('hidden');
      el.classList.add('active');
  }
}

function showGameScreen(id) {
  document.querySelectorAll('.game-screen').forEach(s => {
      s.classList.remove('active');
      s.classList.add('hidden');
  });
  const el = document.getElementById(id);
  if (el) {
      el.classList.remove('hidden');
      el.classList.add('active');
  }
}

function updateAgeDisplay() {
  const years = Math.floor(gameState.childAgeMonths / 12);
  const months = gameState.childAgeMonths % 12;
  const el = document.getElementById('child-age');
  if (el) el.textContent = `${years}歲 ${months}個月`;

  const warning = document.getElementById('age-warning');
  if (warning) {
    if (gameState.childAgeMonths >= 36) {
      warning.classList.remove('hidden');
    } else {
      warning.classList.add('hidden');
    }
  }

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
  }, 3000); 
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

  if (gameState.currentCardIndex >= familyCases.length) {
    container.innerHTML = '';
    document.getElementById('g4-hint').classList.add('hidden');
    document.getElementById('g4-action-btns').classList.add('hidden');
    document.getElementById('g4-complete-area').classList.remove('hidden');
    return;
  }

  const family = familyCases[gameState.currentCardIndex];

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

  document.getElementById('btn-to-stage-2')?.addEventListener('click', () => {
    showScreen('stage-2');
    showGameScreen('game-main');
  });

  document.querySelectorAll('.btn-to-stage-3').forEach(btn => {
    btn.addEventListener('click', () => {
      showScreen('stage-3');
      window.scrollTo(0, 0);
    });
  });

  document.getElementById('btn-start-task')?.addEventListener('click', () => {
    showGameScreen('game-g1');
    startAgeTimer();
  });

  document.getElementById('btn-g1-next')?.addEventListener('click', () => {
    showGameScreen('game-g3');
  });

  document.getElementById('btn-g3-action-1')?.addEventListener('click', () => {
    document.getElementById('g3-event-1').classList.add('hidden');
    document.getElementById('g3-event-2').classList.remove('hidden');
  });

  document.getElementById('btn-g3-action-2')?.addEventListener('click', () => {
    document.getElementById('g3-event-2').classList.add('hidden');
    document.getElementById('btn-g3-to-g4').classList.remove('hidden');
  });

  document.getElementById('btn-g3-to-g4')?.addEventListener('click', () => {
    showGameScreen('game-g4');
    gameState.currentCardIndex = 0;
    gameState.acceptedFamilies = 0;
    gameState.rejectedFamilies = 0;
    renderCurrentCard();
  });

  document.getElementById('btn-g4-accept')?.addEventListener('click', () => {
    swipeCard('left');
  });

  document.getElementById('btn-g4-reject')?.addEventListener('click', () => {
    swipeCard('right');
  });

  document.getElementById('btn-g4-to-g5')?.addEventListener('click', () => {
    showGameScreen('game-g5');
    const nEl = document.getElementById('g5-n-value');
    if (nEl) nEl.textContent = gameState.acceptedFamilies;
    
    // 如果讀者把不適合的也按了適合，審查時間就會變長，這很符合現實！
    gameState.childAgeMonths += gameState.acceptedFamilies * 3;
    updateAgeDisplay();
  });

  document.getElementById('btn-g5-to-g6')?.addEventListener('click', () => {
    if (gameState.gameFailed) return;
    stopAgeTimer();
    showGameScreen('game-g6');
  });

  document.getElementById('btn-g6-to-r')?.addEventListener('click', () => {
    if (gameState.acceptedFamilies > 0) {
      showGameScreen('game-r2');
    } else {
      showGameScreen('game-r1');
    }
  });

});