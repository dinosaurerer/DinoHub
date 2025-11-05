// 鼠标拖尾特效实现
class CursorTrail {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.particles = [];
        this.mouseX = 0;
        this.mouseY = 0;
        this.lastX = 0;
        this.lastY = 0;
        this.init();
    }

    init() {
        // 创建canvas元素
        this.canvas = document.createElement('canvas');
        this.canvas.id = 'cursor-trail-canvas';
        this.canvas.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 9999;
        `;
        
        // 插入到body中
        document.body.appendChild(this.canvas);
        this.setupCanvas();
        this.setupEventListeners();
        this.startAnimation();
    }

    setupCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.ctx = this.canvas.getContext('2d');
        
        // 监听窗口大小变化
        window.addEventListener('resize', () => {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
        });
    }

    setupEventListeners() {
        // 监听鼠标移动
        document.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
        });
    }

    createParticle(x, y) {
        return {
            x: x,
            y: y,
            size: Math.random() * 3 + 1,
            speedX: Math.random() * 2 - 1,
            speedY: Math.random() * 2 - 1,
            color: `hsl(${Math.random() * 60 + 180}, 100%, ${Math.random() * 30 + 70}%)`,
            life: Math.random() * 20 + 10
        };
    }

    updateParticles() {
        // 创建新粒子
        const dx = this.mouseX - this.lastX;
        const dy = this.mouseY - this.lastY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // 根据鼠标移动速度和距离创建粒子
        if (distance > 2) {
            const particlesToAdd = Math.min(Math.floor(distance / 5), 5);
            for (let i = 0; i < particlesToAdd; i++) {
                const ratio = i / particlesToAdd;
                const x = this.lastX + dx * ratio;
                const y = this.lastY + dy * ratio;
                this.particles.push(this.createParticle(x, y));
            }
        }
        
        this.lastX = this.mouseX;
        this.lastY = this.mouseY;
        
        // 更新粒子
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const particle = this.particles[i];
            
            particle.x += particle.speedX;
            particle.y += particle.speedY;
            particle.life--;
            
            if (particle.life <= 0) {
                this.particles.splice(i, 1);
            }
        }
    }

    drawParticles() {
        // 清空画布
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 绘制粒子
        this.particles.forEach(particle => {
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fillStyle = particle.color.replace(')', `, ${particle.life / 30})`).replace('hsl', 'hsla');
            this.ctx.fill();
        });
    }

    animate() {
        this.updateParticles();
        this.drawParticles();
        requestAnimationFrame(() => this.animate());
    }

    startAnimation() {
        requestAnimationFrame(() => this.animate());
    }
}

// 初始化鼠标拖尾特效
document.addEventListener('DOMContentLoaded', () => {
    new CursorTrail();
});