
// 点击跳转

const hhOpen = {
  bind: function (el, binding) {
    const url = binding.value
    console.log(url)
    el.onclick = function () {
      if (window._hmt) {
        window._hmt.push(['_trackEvent', '打开新网址', url])
      }
      window.open(url)
    }
  }

}

export default hhOpen
