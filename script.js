document.addEventListener("DOMContentLoaded", () => {
    
    // ==========================================
    // UI 切換工具函數
    // ==========================================
    function switchSection(hideId, showId) {
        document.getElementById(hideId).classList.remove('active');
        document.getElementById(hideId).classList.add('hidden');
        document.getElementById(showId).classList.remove('hidden');
        document.getElementById(showId).classList.add('active');
    }

    // ==========================================
    // Stage 1: 拉霸與預測
    // ==========================================
    const slider = document.getElementById('guess-slider');
    const display = document.getElementById('slider-display');
    
    slider.addEventListener('input', (e) => {
        display.innerText = e.target.value;
    });

    document.getElementById('btn-submit-guess').addEventListener('click', () => {
        switchSection('stage-1', 'stage-1-result');
    });

    document.getElementById('btn-to-stage-2').addEventListener('click', () => {
        switchSection('stage-1-result', 'stage-2');
    });

    // 多個按鈕皆可跳轉至閱讀報導
    document.querySelectorAll('.btn-to-stage-3').forEach(btn => {
        btn.addEventListener('click', () => {
            // 隱藏前面所有可能開啟的 section
            document.querySelectorAll('.screen-section').forEach(sec => {
                sec.classList.remove('active');
                sec.classList.add('hidden');
            });
            document.getElementById('stage-3').classList.remove('hidden');
            document.getElementById('stage-3').classList.add('active');
            window.scrollTo(0,0);
        });
    });

    // ==========================================
    // Stage 2: 遊戲流程控制
    // ==========================================
    document.getElementById('btn-start-task').addEventListener('click', () => {
        switchSection('game-main', 'game-g1');
    });

    document.getElementById('btn-g1-next').addEventListener('click', () => {
        switchSection('game-g1', 'game-g3');
    });

    // G3 事件處理
    document.getElementById('btn-g3-action-1').addEventListener('click', () => {
        document.getElementById('g3-event-1').classList.add('hidden');
        document.getElementById('g3-event-2').classList.remove('hidden');
    });
    
    document.getElementById('btn-g3-action-2').addEventListener('click', () => {
        document.getElementById('g3-event-2').classList.add('hidden');
        document.getElementById('btn-g3-to-g4').classList.remove('hidden');
    });

    document.getElementById('btn-g3-to-g4').addEventListener('click', () => {
        switchSection('game-g3', 'game-g4');
        initG4Cards(); // 初始化 G4 卡片
    });

    // ==========================================
    // G4: 3D 收養家庭個案翻頁系統
    // ==========================================
    const familyCases = [
        {
            id: 1,
            title: "收養家庭檔案 (1/8)",
            content: "<strong>先生（41歲）：</strong>高職電子科畢業，現任汽車維修廠廠長，收入穩定。<br><strong>太太（39歲）：</strong>大學幼保系畢業，現任私立幼兒園老師。<br><strong>婚姻與生育：</strong>結婚 8 年，經歷 3 次試管嬰兒失敗，兩年前決定終止不孕治療。",
        },
        {
            id: 2,
            title: "收養家庭檔案 (2/8)",
            content: "<strong>先生（42歲）：</strong>知名外商科技公司資深專案經理（PM），高薪、高壓。<br><strong>太太（40歲）：</strong>公立高中教師，教學認真。<br><strong>婚姻與生育：</strong>結婚 10 年，不孕原因不明。",
        },
        {
            id: 3,
            title: "收養家庭檔案 (3/8)",
            content: "<strong>家庭背景：</strong>夫妻皆為連鎖餐廳跨國高階主管，年收數百萬，居住在高級社區。<br><strong>社工評估隱憂：</strong>試圖以金錢購買照顧，缺乏親自陪伴與情感承接的意願。",
        },
        {
            id: 4,
            title: "收養家庭檔案 (4/8)",
            content: "<strong>婚姻與生育：</strong>結婚 5 年，一年前他們兩歲的親生兒子因罕見疾病不幸夭折。<br><strong>社工評估隱憂：</strong>恐將特殊兒視為逝去孩子的「替代品」，未處理完自身悲傷。",
        },
        {
            id: 5,
            title: "收養家庭檔案 (5/8)",
            content: "<strong>家庭背景：</strong>先生為南部傳統大家族的長子兼獨子，與父母及親戚同住，經商。<br><strong>社工評估隱憂：</strong>無法抵禦傳統宗族對「缺陷」的歧視，特殊兒易承受龐大家族壓力。",
        },
        {
            id: 6,
            title: "收養家庭檔案 (6/8)",
            content: "<strong>家庭背景：</strong>夫妻為虔誠的宗教信徒，長期在社福機構擔任志工，形象良好。<br><strong>社工評估隱憂：</strong>帶有崇高的拯救者情結，將辛苦的育兒現實「神聖化」，缺乏危機處理的彈性。",
        },
        {
            id: 7,
            title: "收養家庭檔案 (7/8)",
            content: "<strong>婚姻狀態：</strong>結婚 15 年，夫妻感情疏離、曾協議離婚，目前處於緊繃狀態。<br><strong>社工評估隱憂：</strong>想利用特殊孩子當作維繫婚姻的「黏著劑」。",
        },
        {
            id: 8,
            title: "收養家庭檔案 (8/8)",
            content: "<strong>家庭背景：</strong>先生全職工作，太太為家庭主婦，但同時需要照顧同住、重度中風臥床的公公。<br><strong>社工評估隱憂：</strong>自身健康狀況與照顧負擔已達飽和。",
        }
    ];

    let currentCaseIndex = 0;
    let suitableCount = 0;

    function initG4Cards() {
        const container = document.getElementById('family-cards-container');
        container.innerHTML = '';
        currentCaseIndex = 0;
        suitableCount = 0;
        
        // 反向生成，確保第一張的 z-index 在最上層
        for (let i = familyCases.length - 1; i >= 0; i--) {
            const c = familyCases[i];
            const card = document.createElement('div');
            card.className = `family-card ${i === 0 ? 'active' : ''}`;
            card.id = `family-card-${i}`;
            
            // 視覺疊加誤差
            if (i !== 0) {
                card.style.transform = `translateY(${i * 3}px) translateX(${i * 3}px)`;
            }

            card.innerHTML = `
                <h3>${c.title}</h3>
                <p>${c.content}</p>
            `;
            container.appendChild(card);
        }
    }

    function handleFamilyChoice(isAccepted) {
        if (currentCaseIndex >= familyCases.length) return;

        const currentCard = document.getElementById(`family-card-${currentCaseIndex}`);
        
        if (isAccepted) {
            suitableCount++;
            currentCard.classList.add('turn-page-left'); 
        } else {
            currentCard.classList.add('turn-page-right');
        }

        currentCaseIndex++;

        if (currentCaseIndex < familyCases.length) {
            const nextCard = document.getElementById(`family-card-${currentCaseIndex}`);
            nextCard.classList.add('active');
            nextCard.style.transform = 'translateY(0) translateX(0)';
        } else {
            // 所有卡片評估完畢
            setTimeout(() => {
                document.getElementById('g4-action-btns').classList.add('hidden');
                document.getElementById('g4-hint').classList.add('hidden');
                document.getElementById('g4-complete-area').classList.remove('hidden');
                
                // 將過關的家庭數量傳給 G5 顯示
                document.getElementById('g5-n-value').innerText = suitableCount; 
            }, 500); 
        }
    }

    document.getElementById('btn-g4-accept').addEventListener('click', () => handleFamilyChoice(true));
    document.getElementById('btn-g4-reject').addEventListener('click', () => handleFamilyChoice(false));

    // ==========================================
    // 結尾流程：G4 -> G5 -> G6 -> R2/R1
    // ==========================================
    document.getElementById('btn-g4-to-g5').addEventListener('click', () => {
        switchSection('game-g4', 'game-g5');
    });

    document.getElementById('btn-g5-to-g6').addEventListener('click', () => {
        switchSection('game-g5', 'game-g6');
    });

    document.getElementById('btn-g6-to-r').addEventListener('click', () => {
        // 如果沒有任何家庭通過初審，直接導向失敗結局；否則進入成功結局。
        document.getElementById('game-g6').classList.add('hidden');
        if (suitableCount === 0) {
            document.getElementById('game-r1').classList.remove('hidden');
            document.getElementById('game-r1').classList.add('active');
        } else {
            document.getElementById('game-r2').classList.remove('hidden');
            document.getElementById('game-r2').classList.add('active');
        }
    });
});