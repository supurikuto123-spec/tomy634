// メイン機能管理
class MainController {
    constructor() {
        this.init();
    }
    
    init() {
        this.setupCountdown();
        this.setupLoadingBar();
        this.setupCursor();
        this.setupScrollEffects();
    }
    
    // カウントダウン設定
    setupCountdown() {
        const countdownElement = document.getElementById('countdown');
        if (!countdownElement) return;
        
        // 仮の発売日（30日後）
        const launchDate = new Date();
        launchDate.setDate(launchDate.getDate() + 30);
        
        const updateCountdown = () => {
            const now = new Date().getTime();
            const timeLeft = launchDate.getTime() - now;
            
            if (timeLeft > 0) {
                const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
                const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
                
                countdownElement.innerHTML = `
                    <span class="time-unit">${days.toString().padStart(2, '0')}</span>:
                    <span class="time-unit">${hours.toString().padStart(2, '0')}</span>:
                    <span class="time-unit">${minutes.toString().padStart(2, '0')}</span>:
                    <span class="time-unit">${seconds.toString().padStart(2, '0')}</span>
                `;
            } else {
                countdownElement.innerHTML = '<span class="launch-ready">READY TO LAUNCH</span>';
            }
        };
        
        // 初回実行
        updateCountdown();
        
        // 1秒ごとに更新
        setInterval(updateCountdown, 1000);
    }
    
    // ローディングバー設定
    setupLoadingBar() {
        const loadingText = document.querySelector('.loading-text');
        const loadingTexts = [
            'INITIALIZING...',
            'LOADING MODULES...',
            'CONNECTING TO NETWORK...',
            'PREPARING LAUNCH...',
            'SYSTEM READY'
        ];
        
        let textIndex = 0;
        
        const updateLoadingText = () => {
            if (loadingText && textIndex < loadingTexts.length) {
                loadingText.textContent = loadingTexts[textIndex];
                textIndex++;
                
                if (textIndex >= loadingTexts.length) {
                    textIndex = 0;
                }
            }
        };
        
        // 3秒ごとにテキスト変更
        setInterval(updateLoadingText, 3000);
    }
    
    // カスタムカーソル
    setupCursor() {
        const cursor = document.createElement('div');
        cursor.className = 'custom-cursor';
        cursor.innerHTML = '<div class="cursor-dot"></div>';
        document.body.appendChild(cursor);
        
        // カーソルのCSS
        const style = document.createElement('style');
        style.textContent = `
            .custom-cursor {
                position: fixed;
                width: 20px;
                height: 20px;
                pointer-events: none;
                z-index: 10001;
                mix-blend-mode: difference;
                transition: transform 0.1s ease;
            }
            
            .cursor-dot {
                width: 100%;
                height: 100%;
                background: #00ff00;
                border-radius: 50%;
                box-shadow: 0 0 15px #00ff00;
                animation: cursorPulse 2s infinite;
            }
            
            @keyframes cursorPulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.2); }
            }
            
            .custom-cursor.hover {
                transform: scale(1.5);
            }
            
            .custom-cursor.click {
                transform: scale(0.8);
            }
        `;
        document.head.appendChild(style);
        
        // マウス位置追従
        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX - 10 + 'px';
            cursor.style.top = e.clientY - 10 + 'px';
        });
        
        // ホバー効果
        document.addEventListener('mouseenter', (e) => {
            if (e.target.matches('a, button, .neon-button')) {
                cursor.classList.add('hover');
            }
        });
        
        document.addEventListener('mouseleave', (e) => {
            if (e.target.matches('a, button, .neon-button')) {
                cursor.classList.remove('hover');
            }
        });
        
        // クリック効果
        document.addEventListener('mousedown', () => {
            cursor.classList.add('click');
        });
        
        document.addEventListener('mouseup', () => {
            cursor.classList.remove('click');
        });
    }
    
    // スクロール効果
    setupScrollEffects() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);
        
        // アニメーション要素を監視
        const animatedElements = document.querySelectorAll('.terminal, .cta-section, .countdown-container');
        animatedElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(50px)';
            el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
            observer.observe(el);
        });
    }
}

// パフォーマンス監視
class PerformanceMonitor {
    constructor() {
        this.fps = 0;
        this.lastTime = performance.now();
        this.frameCount = 0;
        this.init();
    }
    
    init() {
        this.createFPSDisplay();
        this.startMonitoring();
    }
    
    createFPSDisplay() {
        const fpsDisplay = document.createElement('div');
        fpsDisplay.id = 'fps-display';
        fpsDisplay.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            background: rgba(0, 0, 0, 0.8);
            color: #00ff00;
            padding: 5px 10px;
            border-radius: 4px;
            font-family: 'Courier Prime', monospace;
            font-size: 12px;
            z-index: 10000;
            border: 1px solid #00ff00;
            box-shadow: 0 0 10px rgba(0, 255, 0, 0.3);
            display: none;
        `;
        document.body.appendChild(fpsDisplay);
        
        // 開発環境でのみ表示（デバッグ用）
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            fpsDisplay.style.display = 'block';
        }
    }
    
    startMonitoring() {
        const updateFPS = () => {
            const currentTime = performance.now();
            this.frameCount++;
            
            if (currentTime >= this.lastTime + 1000) {
                this.fps = Math.round((this.frameCount * 1000) / (currentTime - this.lastTime));
                this.frameCount = 0;
                this.lastTime = currentTime;
                
                const fpsDisplay = document.getElementById('fps-display');
                if (fpsDisplay) {
                    fpsDisplay.textContent = `FPS: ${this.fps}`;
                }
            }
            
            requestAnimationFrame(updateFPS);
        };
        
        updateFPS();
    }
}

// Instagram ボタンの特殊エフェクト
class InstagramButtonEffects {
    constructor() {
        this.button = document.querySelector('.instagram-btn');
        if (this.button) {
            this.init();
        }
    }
    
    init() {
        this.addHoverSound();
        this.addClickAnalytics();
    }
    
    addHoverSound() {
        // 視覚的フィードバックのみ（音声なし）
        this.button.addEventListener('mouseenter', () => {
            this.button.style.animation = 'buttonHover 0.3s ease forwards';
        });
        
        this.button.addEventListener('mouseleave', () => {
            this.button.style.animation = 'buttonIdle 0.3s ease forwards';
        });
        
        // CSS アニメーション追加
        const style = document.createElement('style');
        style.textContent = `
            @keyframes buttonHover {
                0% { transform: translateY(0) scale(1); }
                100% { transform: translateY(-3px) scale(1.05); }
            }
            
            @keyframes buttonIdle {
                0% { transform: translateY(-3px) scale(1.05); }
                100% { transform: translateY(0) scale(1); }
            }
        `;
        document.head.appendChild(style);
    }
    
    addClickAnalytics() {
        this.button.addEventListener('click', () => {
            // 将来的な分析用のイベントトラッキング
            console.log('Instagram button clicked');
            
            // 視覚的フィードバック
            const originalText = this.button.querySelector('span').textContent;
            this.button.querySelector('span').textContent = 'Opening Instagram...';
            
            setTimeout(() => {
                this.button.querySelector('span').textContent = originalText;
            }, 1000);
        });
    }
}

// 初期化
document.addEventListener('DOMContentLoaded', () => {
    new MainController();
    new PerformanceMonitor();
    new InstagramButtonEffects();
    
    // ページロード完了アニメーション
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 500);
});