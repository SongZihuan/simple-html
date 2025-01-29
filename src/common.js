// 清理状态
import 'normalize.css'
import jQuery from 'jquery'

import Logo from './assets/image/logo.png'
import WangAn from './assets/image/wangan.png'

const metaViewport = document.createElement('meta')
metaViewport.setAttribute('name', 'viewport')
metaViewport.setAttribute('content', 'width=device-width, initial-scale=1')
document.head.appendChild(metaViewport)

const metaDescription = document.createElement('meta')
metaDescription.setAttribute('name', 'description')
metaDescription.setAttribute('content', 'MIT LICENSE 介绍网站')
document.head.appendChild(metaDescription)

const metaKeywords = document.createElement('meta')
metaKeywords.setAttribute('name', 'keywords')
metaKeywords.setAttribute('content', 'MIT, MIT LICENSE, LICENSE, Open Source, 开源, 贡献, 赞助, Github')
document.head.appendChild(metaKeywords)

const metaLang = document.createElement('meta')
metaLang.setAttribute('http-equiv', 'Content-Language')
metaLang.setAttribute('content', 'zh-CN') // 例如，设定为简体中文
document.head.appendChild(metaLang)

document.addEventListener('DOMContentLoaded', function () {
  // 动态设置favicon
  const link = document.createElement('link')
  link.rel = 'shortcut icon'
  link.href = Logo // 或者 favicon.png 对于PNG格式
  document.head.appendChild(link)
})

window.Logo = Logo
window.WangAn = WangAn

window.jQuery = jQuery
window.$ = jQuery
