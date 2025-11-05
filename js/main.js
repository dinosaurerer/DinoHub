// 开源网站主脚本文件

// 鼠标点击动画
document.addEventListener('DOMContentLoaded', function() {
    const clickContainer = document.getElementById('click-animation-container');
    
    document.addEventListener('click', function(e) {
        // 创建动画元素
        const animation = document.createElement('div');
        animation.className = 'click-animation';
        animation.style.left = (e.pageX - 10) + 'px';
        animation.style.top = (e.pageY - 10) + 'px';
        
        // 添加到容器
        clickContainer.appendChild(animation);
        
        // 动画结束后移除元素
        animation.addEventListener('animationend', function() {
            animation.remove();
        });
    });
});

// 鼠标移动特效
document.addEventListener('DOMContentLoaded', function() {
    const body = document.body;
    const trailContainer = document.createElement('div');
    trailContainer.id = 'cursor-trail-container';
    trailContainer.style.position = 'fixed';
    trailContainer.style.top = '0';
    trailContainer.style.left = '0';
    trailContainer.style.pointerEvents = 'none';
    trailContainer.style.zIndex = '9998';
    trailContainer.style.overflow = 'hidden';
    document.body.appendChild(trailContainer);
    
    let trailElements = [];
    const maxTrailElements = 20;
    const trailDelay = 30; // 毫秒
    
    // 彩虹颜色数组
    const rainbowColors = [
        '#FF0000', '#FF7F00', '#FFFF00', '#00FF00', 
        '#0000FF', '#4B0082', '#9400D3'
    ];
    let colorIndex = 0;
    
    document.addEventListener('mousemove', function(e) {
        // 创建新的拖尾元素
        const trailElement = document.createElement('div');
        trailElement.className = 'cursor-trail';
        trailElement.style.left = (e.pageX - 6) + 'px';
        trailElement.style.top = (e.pageY - 6) + 'px';
        trailContainer.appendChild(trailElement);
        
        // 添加到数组
        trailElements.push(trailElement);
        
        // 如果超过最大数量，移除最早的元素
        if (trailElements.length > maxTrailElements) {
            const oldElement = trailElements.shift();
            oldElement.remove();
        }
        
        // 添加彩虹特效
        // 每隔一段时间创建一个彩虹拖尾
        if (Math.random() < 0.3) {
            const rainbowElement = document.createElement('div');
            rainbowElement.className = 'rainbow-trail';
            rainbowElement.style.left = (e.pageX - 5) + 'px';
            rainbowElement.style.top = (e.pageY - 5) + 'px';
            rainbowElement.style.color = rainbowColors[colorIndex % rainbowColors.length];
            colorIndex++;
            trailContainer.appendChild(rainbowElement);
            
            // 动画结束后移除元素
            setTimeout(() => {
                rainbowElement.remove();
            }, 1000);
        }
    });
});

// 项目运行时间计算和显示
document.addEventListener('DOMContentLoaded', function() {
    // 设置服务器启动时间为固定时间（例如：2025年1月1日 00:00:00）
    // 在实际应用中，这个时间应该从服务器获取
    let projectStartTime = new Date('2025-01-01T00:00:00');
    
    function updateUptime() {
        const now = new Date();
        const elapsed = now - serverStartTime;
        
        // 每72小时重置一次（72小时 = 259200000毫秒）
        if (elapsed >= 259200000) {
            serverStartTime = new Date(); // 重置为当前时间
        }
        
        const uptime = new Date(now - serverStartTime);
        
        // 计算天数、小时数、分钟数和秒数
        const days = Math.floor((now - serverStartTime) / (1000 * 60 * 60 * 24));
        const hours = uptime.getUTCHours();
        const minutes = uptime.getUTCMinutes();
        const seconds = uptime.getUTCSeconds();
        
        // 格式化显示
        const uptimeString = `${days.toString().padStart(2, '0')}:${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        // 更新页面上的显示
        const uptimeElement = document.getElementById('uptime');
        if (uptimeElement) {
            uptimeElement.textContent = uptimeString;
        }
    }
    
    // 初始更新
    updateUptime();
    
    // 每秒更新一次
    setInterval(updateUptime, 1000);
});

// 导航栏滚动效果
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// 菜单自动隐藏/显示功能
document.addEventListener('DOMContentLoaded', function() {
    let lastScrollTop = 0;
    let lastScrollTime = 0;
    const header = document.querySelector('.header');
    let ticking = false;
    let idleTimer = null;
    
    // 重置空闲计时器
    function resetIdleTimer() {
        // 清除之前的计时器
        if (idleTimer) {
            clearTimeout(idleTimer);
        }
        
        // 设置新的3秒计时器
        idleTimer = setTimeout(() => {
            // 如果不在顶部，则隐藏菜单
            if (window.pageYOffset > 0) {
                header.classList.add('hidden');
            }
        }, 3000);
    }
    
    function updateHeader() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const currentTime = Date.now();
        const timeDiff = currentTime - lastScrollTime;
        const scrollDiff = scrollTop - lastScrollTop;
        const scrollSpeed = Math.abs(scrollDiff / timeDiff) || 0; // 滚动速度(px/ms)
        
        // 如果在顶部，始终显示菜单
        if (scrollTop <= 0) {
            header.classList.remove('hidden');
        }
        // 如果向下滚动且速度足够快，则隐藏菜单
        else if (scrollDiff > 0 && scrollSpeed > 0.3) {
            header.classList.add('hidden');
            resetIdleTimer(); // 重置空闲计时器
        }
        // 如果向上滚动且速度足够快，则显示菜单
        else if (scrollDiff < 0 && scrollSpeed > 0.2) {
            header.classList.remove('hidden');
            resetIdleTimer(); // 重置空闲计时器
        }
        // 特殊情况：如果滚动到顶部附近，确保菜单显示
        else if (scrollTop < 20) {
            header.classList.remove('hidden');
        }
        
        lastScrollTop = scrollTop;
        lastScrollTime = currentTime;
        ticking = false;
    }
    
    // 使用requestAnimationFrame优化滚动性能
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateHeader);
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', function() {
        requestTick();
        resetIdleTimer(); // 每次滚动都重置空闲计时器
    });
    
    // 页面加载完成后显示菜单
    setTimeout(() => {
        header.classList.remove('hidden');
        resetIdleTimer(); // 页面加载完成后开始计时
    }, 300);
    
    // 监听页面跳转事件
    window.addEventListener('beforeunload', function() {
        header.classList.add('hidden');
    });
    
    // 监听鼠标移动事件
    document.addEventListener('mousemove', function() {
        resetIdleTimer();
    });
    
    // 监听键盘事件
    document.addEventListener('keydown', function() {
        resetIdleTimer();
    });
    
    // 鼠标悬停时显示菜单
    header.addEventListener('mouseenter', function() {
        header.classList.remove('hidden');
        
        // 清除空闲计时器，因为用户正在与菜单交互
        if (idleTimer) {
            clearTimeout(idleTimer);
        }
    });
    
    // 鼠标离开菜单区域时恢复空闲计时器
    header.addEventListener('mouseleave', function() {
        // 重新启动空闲计时器
        resetIdleTimer();
    });
    
    // 移动端菜单功能
    // 使用类选择器而不是ID选择器，以支持多个页面元素
    const mobileMenuBtns = document.querySelectorAll('.mobile-menu-btn');
    const mobileMenus = document.querySelectorAll('.mobile-menu');
    
    const mobileMenuLinks = document.querySelectorAll('.mobile-menu a'); // 获取移动端菜单中的所有链接
    
    mobileMenuBtns.forEach((btn, index) => {
        const menu = mobileMenus[index];
        
        if (btn && menu) {
            // 移动端菜单按钮点击事件
            btn.addEventListener('click', function(e) {
                e.stopPropagation(); // 阻止事件冒泡
                menu.classList.toggle('show');
                
                // 如果菜单显示，重置空闲计时器
                if (menu.classList.contains('show')) {
                    if (idleTimer) {
                        clearTimeout(idleTimer);
                    }
                } else {
                    // 如果菜单隐藏，重新启动空闲计时器
                    resetIdleTimer();
                }
            });
            
            // 点击其他区域隐藏移动端菜单
            document.addEventListener('click', function(e) {
                if (!menu.contains(e.target) && !btn.contains(e.target)) {
                    menu.classList.remove('show');
                }
            });
        }
    });
    
    // 为移动端菜单中的链接添加点击事件，点击后关闭菜单
    mobileMenuLinks.forEach(link => {
        link.addEventListener('click', function() {
            // 查找并关闭所有移动端菜单
            mobileMenus.forEach(menu => {
                menu.classList.remove('show');
            });
        });
    });
    
    
});

// 音乐播放器功能
document.addEventListener('DOMContentLoaded', function() {
    const musicPlayer = document.getElementById('background-music');
    const musicToggle = document.getElementById('music-toggle');
    
    // 从 sessionStorage 获取音乐播放状态
    let isPlaying = sessionStorage.getItem('musicPlaying') === 'true';
    let currentTime = parseFloat(sessionStorage.getItem('musicCurrentTime')) || 0;
    
    // 设置音乐播放位置
    if (currentTime > 0) {
        musicPlayer.currentTime = currentTime;
    }
    
    // 如果之前是播放状态，则尝试自动播放
    if (isPlaying) {
        musicPlayer.play().then(() => {
            musicToggle.classList.add('playing');
        }).catch(error => {
            console.log('自动播放失败:', error);
            isPlaying = false;
            sessionStorage.setItem('musicPlaying', 'false');
        });
    }
    
    // 音乐切换按钮
    musicToggle.addEventListener('click', function() {
        if (isPlaying) {
            musicPlayer.pause();
            musicToggle.classList.remove('playing');
        } else {
            musicPlayer.play().then(() => {
                musicToggle.classList.add('playing');
            }).catch(error => {
                console.log('播放失败:', error);
            });
        }
        isPlaying = !isPlaying;
        sessionStorage.setItem('musicPlaying', isPlaying.toString());
    });
    
    // 监听音乐播放进度，保存到 sessionStorage
    musicPlayer.addEventListener('timeupdate', function() {
        sessionStorage.setItem('musicCurrentTime', musicPlayer.currentTime.toString());
    });
    
    // 监听页面卸载，保存当前状态
    window.addEventListener('beforeunload', function() {
        sessionStorage.setItem('musicCurrentTime', musicPlayer.currentTime.toString());
    });
});

// 服务器状态模拟
document.addEventListener('DOMContentLoaded', function() {
    // 模拟服务器状态检查
    const serverStatus = document.getElementById('serverStatus');
    if (serverStatus) {
        // 模拟在线状态（实际项目中这里会是真实的API调用）
        setTimeout(() => {
            serverStatus.innerHTML = '<span class="server-status online"></span>在线';
        }, 1000);
    }
    
    // 平滑滚动效果
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            // 跳转页面时隐藏菜单
            const header = document.querySelector('.header');
            header.classList.add('hidden');
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 70,
                    behavior: 'smooth'
                });
                
                // 跳转完成后显示菜单
                setTimeout(() => {
                    header.classList.remove('hidden');
                }, 1000);
            }
        });
    });
    
    // 监听滚动结束事件，当用户停止滚动时检查是否在顶部
    let scrollTimer = null;
    window.addEventListener('scroll', function() {
        // 如果在顶部，确保菜单显示
        if (window.pageYOffset <= 0) {
            const header = document.querySelector('.header');
            header.classList.remove('hidden');
        }
        
        // 清除之前的定时器
        if (scrollTimer !== null) {
            clearTimeout(scrollTimer);
        }
        
        // 设置新的定时器
        scrollTimer = setTimeout(function() {
            // 滚动停止后检查是否在顶部
            if (window.pageYOffset <= 0) {
                const header = document.querySelector('.header');
                header.classList.remove('hidden');
            }
        }, 150);
    });
});

// 简单的动画效果
document.addEventListener('DOMContentLoaded', function() {
    // 为卡片添加悬停效果
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
            this.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.1)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = 'none';
        });
    });
});

// 服务器运行时间计算和显示
document.addEventListener('DOMContentLoaded', function() {
    // 设置服务器启动时间为固定时间（例如：2025年1月1日 00:00:00）
    // 在实际应用中，这个时间应该从服务器获取
    let serverStartTime = new Date('2025-01-01T00:00:00');
    
    function updateUptime() {
        const now = new Date();
        const elapsed = now - serverStartTime;
        
        // 每72小时重置一次（72小时 = 259200000毫秒）
        if (elapsed >= 259200000) {
            serverStartTime = new Date(); // 重置为当前时间
        }
        
        const uptime = new Date(now - serverStartTime);
        
        // 计算天数、小时数、分钟数和秒数
        const days = Math.floor((now - serverStartTime) / (1000 * 60 * 60 * 24));
        const hours = uptime.getUTCHours();
        const minutes = uptime.getUTCMinutes();
        const seconds = uptime.getUTCSeconds();
        
        // 格式化显示
        const uptimeString = `${days.toString().padStart(2, '0')}:${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        // 更新页面上的显示
        const uptimeElement = document.getElementById('uptime');
        if (uptimeElement) {
            uptimeElement.textContent = uptimeString;
        }
    }
    
    // 初始更新
    updateUptime();
    
    // 每秒更新一次
    setInterval(updateUptime, 1000);
});