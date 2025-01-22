// 清理状态
import 'normalize.css'
import jQuery from 'jquery';

import Logo from './assets/image/logo.png'
import WangAn from './assets/image/wangan.png'
import SongZihuan from './assets/image/songzihuan.jpg'
import LogoBin from './assets/image/logo_big.png'

document.addEventListener('DOMContentLoaded', function () {
  // 动态设置favicon
  const link = document.createElement('link')
  link.rel = 'shortcut icon'
  link.href = Logo // 或者 favicon.png 对于PNG格式
  document.head.appendChild(link)
})

window.Logo = Logo
window.WangAn = WangAn
window.SongZihuan = SongZihuan
window.LogoBig = LogoBin

window.jQuery = jQuery;
window.$ = jQuery;
