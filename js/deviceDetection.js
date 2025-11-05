// 设备检测脚本
(function() {
    // 获取屏幕分辨率
    function getScreenResolution() {
        return {
            width: screen.width,
            height: screen.height
        };
    }
    
    // 根据分辨率判断设备类型
    function detectDeviceType() {
        const resolution = getScreenResolution();
        const width = resolution.width;
        const height = resolution.height;
        
        // 平板设备的分辨率范围（宽度在768px到1200px之间）
        if (width >= 768 && width <= 1200) {
            // 进一步检查高度，以区分平板和桌面
            if (height <= 1024) {
                return 'tablet';
            }
        }
        
        // 桌面设备（宽度大于1200px）
        if (width > 1200) {
            return 'desktop';
        }
        
        // 手机设备（宽度小于768px）
        if (width < 768) {
            return 'mobile';
        }
        
        // 默认返回桌面设备
        return 'desktop';
    }
    
    // 根据设备类型应用相应的样式类
    function applyDeviceStyles() {
        const deviceType = detectDeviceType();
        const body = document.body;
        
        // 移除所有可能的设备类型类
        body.classList.remove('device-mobile', 'device-tablet', 'device-desktop');
        
        // 添加当前设备类型类
        body.classList.add(`device-${deviceType}`);
        
        // 输出设备信息到控制台（仅用于调试）
        console.log(`检测到设备类型: ${deviceType} (分辨率: ${screen.width}x${screen.height})`);
    }
    
    // 页面加载完成后执行设备检测
    document.addEventListener('DOMContentLoaded', function() {
        applyDeviceStyles();
    });
    
    // 窗口大小改变时重新检测设备类型
    window.addEventListener('resize', function() {
        applyDeviceStyles();
    });
})();