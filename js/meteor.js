// 流星特效实现
class MeteorShower {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.meteors = [];
        this.particles = [];
        this.init();
    }

    init() {
        // 创建canvas元素
        this.canvas = document.createElement('canvas');
        this.canvas.id = 'meteor-canvas';
        this.canvas.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 0;
        `;
        
        // 插入到.hero元素中
        const heroSection = document.querySelector('.hero');
        if (heroSection) {
            heroSection.insertBefore(this.canvas, heroSection.firstChild);
            this.setupCanvas();
            this.startAnimation();
        }
    }

    setupCanvas() {
        const rect = this.canvas.parentElement.getBoundingClientRect();
        this.canvas.width = rect.width;
        this.canvas.height = rect.height;
        this.ctx = this.canvas.getContext('2d');
        
        // 监听窗口大小变化
        window.addEventListener('resize', () => {
            const newRect = this.canvas.parentElement.getBoundingClientRect();
            this.canvas.width = newRect.width;
            this.canvas.height = newRect.height;
        });
    }

    createMeteor() {
        const meteor = {
            x: Math.random() * this.canvas.width * 0.8,
            y: -20,
            length: Math.random() * 100 + 50,
            speed: (Math.random() * 3 + 2) * 0.5, // 下落速度为原先的0.5倍
            angle: Math.random() * Math.PI / 4 - Math.PI / 8, // -22.5° to 22.5°
            brightness: Math.random() * 0.5 + 0.5,
            color: `hsl(${Math.random() * 60 + 180}, 100%, ${Math.random() * 30 + 70}%)`, // 蓝白色调
            trail: []
        };
        return meteor;
    }

    createParticle(x, y, color) {
        return {
            x: x,
            y: y,
            size: Math.random() * 2 + 1,
            speedX: Math.random() * 4 - 2,
            speedY: Math.random() * 4 - 2,
            color: color,
            life: Math.random() * 20 + 10
        };
    }

    updateMeteors() {
        // 随机生成新流星（增加2倍）
        if (Math.random() < 0.06) {
            this.meteors.push(this.createMeteor());
        }

        // 更新流星位置
        for (let i = this.meteors.length - 1; i >= 0; i--) {
            const meteor = this.meteors[i];
            
            // 记录轨迹点
            meteor.trail.push({x: meteor.x, y: meteor.y});
            if (meteor.trail.length > 5) {
                meteor.trail.shift();
            }
            
            // 更新位置
            meteor.x += Math.sin(meteor.angle) * meteor.speed;
            meteor.y += Math.cos(meteor.angle) * meteor.speed;
            
            // 生成粒子（增加2倍）
            if (Math.random() < 0.6) {
                for (let j = 0; j < 4; j++) {
                    this.particles.push(this.createParticle(
                        meteor.x - Math.sin(meteor.angle) * meteor.length * 0.7,
                        meteor.y - Math.cos(meteor.angle) * meteor.length * 0.7,
                        meteor.color
                    ));
                }
            }
            
            // 移除超出屏幕的流星
            if (meteor.y > this.canvas.height + 50 || meteor.x > this.canvas.width + 50) {
                this.meteors.splice(i, 1);
            }
        }
    }

    updateParticles() {
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

    drawMeteors() {
        // 清空画布
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 绘制流星轨迹
        this.meteors.forEach(meteor => {
            // 绘制轨迹光晕
            const gradient = this.ctx.createRadialGradient(
                meteor.x, meteor.y, 0,
                meteor.x, meteor.y, meteor.length * 2
            );
            gradient.addColorStop(0, meteor.color.replace(')', ', 0.3)').replace('hsl', 'hsla'));
            gradient.addColorStop(1, meteor.color.replace(')', ', 0)').replace('hsl', 'hsla'));
            
            this.ctx.save();
            this.ctx.translate(meteor.x, meteor.y);
            this.ctx.rotate(meteor.angle);
            this.ctx.fillStyle = gradient;
            this.ctx.fillRect(-meteor.length * 2, -2, meteor.length * 4, 4);
            this.ctx.restore();
            
            // 绘制流星主体
            const headGradient = this.ctx.createLinearGradient(
                meteor.x - Math.sin(meteor.angle) * meteor.length,
                meteor.y - Math.cos(meteor.angle) * meteor.length,
                meteor.x,
                meteor.y
            );
            headGradient.addColorStop(0, meteor.color.replace(')', ', 0)').replace('hsl', 'hsla'));
            headGradient.addColorStop(0.5, meteor.color);
            headGradient.addColorStop(1, '#ffffff');
            
            this.ctx.save();
            this.ctx.translate(meteor.x, meteor.y);
            this.ctx.rotate(meteor.angle);
            this.ctx.beginPath();
            this.ctx.moveTo(0, 0);
            this.ctx.lineTo(-meteor.length, 0);
            this.ctx.strokeStyle = headGradient;
            this.ctx.lineWidth = 2;
            this.ctx.stroke();
            this.ctx.restore();
        });
        
        // 绘制粒子
        this.particles.forEach(particle => {
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fillStyle = particle.color.replace(')', `, ${particle.life / 30})`).replace('hsl', 'hsla');
            this.ctx.fill();
        });
    }

    animate() {
        this.updateMeteors();
        this.updateParticles();
        this.drawMeteors();
        requestAnimationFrame(() => this.animate());
    }

    startAnimation() {
        requestAnimationFrame(() => this.animate());
    }
}

// 初始化流星雨特效
document.addEventListener('DOMContentLoaded', () => {
    new MeteorShower();
});