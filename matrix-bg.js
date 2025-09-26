// マトリックス背景アニメーション
class MatrixBackground {
    constructor() {
        this.canvas = document.getElementById('matrix-bg');
        this.ctx = this.canvas.getContext('2d');
        this.characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%^&*()_+-=[]{}|;:,.<>?アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
        this.fontSize = 16;
        this.columns = 0;
        this.drops = [];
        
        this.init();
        this.animate();
        window.addEventListener('resize', () => this.init());
    }
    
    init() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        
        this.columns = Math.floor(this.canvas.width / this.fontSize);
        this.drops = Array(this.columns).fill(1);
    }
    
    draw() {
        // 半透明の黒でフェード効果
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.04)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.ctx.fillStyle = '#0F0';
        this.ctx.font = `${this.fontSize}px Courier Prime, monospace`;
        
        for (let i = 0; i < this.drops.length; i++) {
            const text = this.characters[Math.floor(Math.random() * this.characters.length)];
            const x = i * this.fontSize;
            const y = this.drops[i] * this.fontSize;
            
            // グラデーション効果
            const gradient = this.ctx.createLinearGradient(x, y - 100, x, y);
            gradient.addColorStop(0, 'rgba(0, 255, 0, 0.1)');
            gradient.addColorStop(0.5, 'rgba(0, 255, 0, 0.8)');
            gradient.addColorStop(1, 'rgba(0, 255, 0, 1)');
            
            this.ctx.fillStyle = gradient;
            this.ctx.fillText(text, x, y);
            
            // リセット条件
            if (y > this.canvas.height && Math.random() > 0.975) {
                this.drops[i] = 0;
            }
            
            this.drops[i]++;
        }
    }
    
    animate() {
        this.draw();
        requestAnimationFrame(() => this.animate());
    }
}

// 初期化
document.addEventListener('DOMContentLoaded', () => {
    new MatrixBackground();
});