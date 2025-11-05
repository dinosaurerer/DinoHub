// 雪花特效脚本
document.addEventListener('DOMContentLoaded', function() {
    const snowContainer = document.getElementById('snow-container');
    
    // 创建雪花
    function createSnowflake() {
        const snowflake = document.createElement('div');
        snowflake.classList.add('snowflake');
        
        // 随机大小 (2px - 6px)
        const size = Math.random() * 4 + 2;
        snowflake.style.width = `${size}px`;
        snowflake.style.height = `${size}px`;
        
        // 随机位置
        snowflake.style.left = `${Math.random() * 100}vw`;
        
        // 随机透明度
        snowflake.style.opacity = Math.random() * 0.5 + 0.5;
        
        // 随机动画时长 (5s - 15s)
        const duration = Math.random() * 10 + 5;
        snowflake.style.animationDuration = `${duration}s`;
        
        // 随机水平偏移
        const horizontalOffset = Math.random() * 100 - 50;
        snowflake.style.setProperty('--horizontal-offset', `${horizontalOffset}px`);
        
        snowContainer.appendChild(snowflake);
        
        // 动画结束后移除雪花
        setTimeout(() => {
            snowflake.remove();
        }, duration * 1000);
    }
    
    // 定期创建雪花
    setInterval(createSnowflake, 200);
    
    // 初始创建一些雪花
    for (let i = 0; i < 50; i++) {
        setTimeout(createSnowflake, i * 100);
    }
});