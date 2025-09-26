// インタラクティブエフェクト管理
class InteractiveEffects {
    constructor() {
        this.mouseTrail = document.getElementById('mouse-trail');
        this.particles = document.getElementById('particles');
        this.mouseHistory = [];
        this.maxTrailLength = 20;
        
        this.init();
    }
    
    init() {
        this.createMouseTrail();
        this.addMouseListeners();
        this.createParticleSystem();
        this.animate();
    }
    
    // マウストレイル作成
    createMouseTrail() {
        for (let i = 0; i < this.maxTrailLength; i++) {
            const dot = document.createElement('div');
            dot.className = 'trail-dot';
            dot.style.cssText = `
                position: fixed;
                width: ${8 - i * 0.3}px;
                height: ${8 - i * 0.3}px;
                background: #00ff00;
                border-radius: 50%;
                pointer-events: none;
                z-index: 9999;
                opacity: ${1 - i * 0.05};
                box-shadow: 0 0 ${10 - i}px #00ff00;
                transform: translate(-50%, -50%);
                transition: all 0.1s ease;
            `;
            this.mouseTrail.appendChild(dot);
        }
    }
    
    // マウスイベントリスナー
    addMouseListeners() {
        let mouseX = 0;
        let mouseY = 0;
        
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            
            // マウス履歴更新
            this.mouseHistory.unshift({ x: mouseX, y: mouseY });
            if (this.mouseHistory.length > this.maxTrailLength) {
                this.mouseHistory.pop();
            }
            
            // トレイル更新
            this.updateTrail();
            
            // パーティクル生成
            if (Math.random() < 0.1) {
                this.createParticle(mouseX, mouseY);
            }
        });
        
        // クリック時のエフェクト
        document.addEventListener('click', (e) => {
            this.createClickEffect(e.clientX, e.clientY);
        });
    }
    
    // トレイル位置更新
    updateTrail() {
        const dots = this.mouseTrail.children;
        for (let i = 0; i < dots.length && i < this.mouseHistory.length; i++) {
            const dot = dots[i];
            const pos = this.mouseHistory[i];
            dot.style.left = pos.x + 'px';
            dot.style.top = pos.y + 'px';
        }
    }
    
    // パーティクルシステム
    createParticleSystem() {
        setInterval(() => {
            if (Math.random() < 0.3) {
                this.createRandomParticle();
            }
        }, 200);
    }
    
    // ランダムパーティクル生成
    createRandomParticle() {
        const x = Math.random() * window.innerWidth;
        const y = Math.random() * window.innerHeight;
        this.createParticle(x, y);
    }
    
    // パーティクル生成
    createParticle(x, y) {
        const particle = document.createElement('div');
        const size = Math.random() * 4 + 2;
        
        particle.style.cssText = `
            position: fixed;
            left: ${x}px;
            top: ${y}px;
            width: ${size}px;
            height: ${size}px;
            background: #00ff00;
            border-radius: 50%;
            pointer-events: none;
            z-index: 1000;
            box-shadow: 0 0 ${size * 2}px #00ff00;
            animation: particleFloat 3s ease-out forwards;
        `;
        
        this.particles.appendChild(particle);
        
        // 自動削除
        setTimeout(() => {
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
            }
        }, 3000);
    }
    
    // クリックエフェクト
    createClickEffect(x, y) {
        const ripple = document.createElement('div');
        ripple.style.cssText = `
            position: fixed;
            left: ${x}px;
            top: ${y}px;
            width: 0;
            height: 0;
            border: 2px solid #00ff00;
            border-radius: 50%;
            pointer-events: none;
            z-index: 9998;
            transform: translate(-50%, -50%);
            animation: rippleEffect 0.6s ease-out forwards;
        `;
        
        document.body.appendChild(ripple);
        
        // パーティクル爆発
        for (let i = 0; i < 8; i++) {
            setTimeout(() => {
                const angle = (i / 8) * Math.PI * 2;
                const distance = 50;
                const particleX = x + Math.cos(angle) * distance;
                const particleY = y + Math.sin(angle) * distance;
                this.createParticle(particleX, particleY);
            }, i * 50);
        }
        
        setTimeout(() => {
            if (ripple.parentNode) {
                ripple.parentNode.removeChild(ripple);
            }
        }, 600);
    }
    
    animate() {
        // アニメーションループ（必要に応じて追加処理）
        requestAnimationFrame(() => this.animate());
    }
}

// タイピングアニメーション
class TypingEffect {
    constructor() {
        this.init();
    }
    
    init() {
        const typingElements = document.querySelectorAll('.typing-animation');
        typingElements.forEach((element, index) => {
            this.typeText(element, element.textContent, index * 1000);
        });
    }
    
    typeText(element, text, delay) {
        element.textContent = '';
        setTimeout(() => {
            let i = 0;
            const timer = setInterval(() => {
                element.textContent += text[i];
                i++;
                if (i >= text.length) {
                    clearInterval(timer);
                }
            }, 50);
        }, delay);
    }
}

// 初期化
document.addEventListener('DOMContentLoaded', () => {
    new InteractiveEffects();
    new TypingEffect();
});