
var log = function() {
    console.log.apply(console, arguments)
}

var getElement = function(selector) {
    return document.querySelector(selector)
}

var getElements = function(selector) {
    return document.querySelectorAll(selector)
}

var bindEvent = function(element, eventName, callback) {
    element.addEventListener(eventName, callback, true)
}

var bindEventAll = function(selector, eventName, callback) {
    var elements = document.querySelectorAll(selector)
    for (var i = 0; i < elements.length; i++) {
        elements[i].addEventListener(eventName, callback, true)
    }
}

var toggleClass = function(element, className) {
    if (element.classList.contains(className)) {
        element.classList.remove(className)
    } else {
        element.classList.add(className)
    }

var ckXian = function() {
    var body = document.querySelector('body')
    var style = '<style id="xm" media="screen"> * {outline: 1px red dashed!important}</style>'
    var i = false
    body.addEventListener('keydown', function(event) {
        if(event.keyCode == 77 && event.ctrlKey) {
            if(i) {
                var styletog = document.querySelector('#xm')
                styletog.remove()
                i = false
            } else {
                body.insertAdjacentHTML('afterbegin', style)
                i = true
            }
      }
  })
}() // 加载代码 使用 ctrl + M 显示参考线
}
