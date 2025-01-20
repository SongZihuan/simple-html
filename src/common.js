// 清理状态
import "normalize.css"

import Logo from "./assets/image/logo.png"
import WangAn from "./assets/image/wangan.png"

document.addEventListener('DOMContentLoaded', function() {
    // 动态设置favicon
    let link = document.createElement('link');
    link.rel = 'shortcut icon';
    link.href = Logo; // 或者 favicon.png 对于PNG格式
    document.head.appendChild(link);
});

window.Logo = Logo
window.WangAn = WangAn