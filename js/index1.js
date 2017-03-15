/*
** 播放器事件绑定
  I.  主要功能性控制事件
      1(done)、播放 & 暂停事件绑定
      2、点击列表播放相应歌曲并切换相应图片，获取并显示相应时间
      3(done)、点击或拖动进度条跳转到相应歌曲时间不停止播放
  II. 效果性事件
      1(done)、点击 播放 时，播放按钮切换为 暂停，页面切换到 播放页面
               点击 暂停 时，暂停按钮切换为播放，页面切换到 列表页面
      2(done)、播放时，播放页面的图片转动
      3(done)、鼠标漂浮到 播放按钮、上下一曲按钮、列表，进度条按钮 上时效果变化
      4(done)、添加动画
*/

var isPlayed = false

var playMusic = function() {
    isPlayed = true
    var musicPlayer = getElement('#id-audio-player')
    musicPlayer.load()
    setTimeout(function(){
        musicPlayer.play()
    } ,500)
}

var stopMusic = function() {
    isPlayed = false
    var musicPlayer = getElement('#id-audio-player')
    setTimeout(function(){
        musicPlayer.pause()
    } ,500)
}

// 得到播放器元素
// var musicPlayer = getElement('#id-audio-player')
// 得到播放按钮
var playButton = getElement('#id-button-play')

// 1、播放 & 暂停事件绑定
var playSwitch = function() {
    // 绑定播放按钮事件
    bindEvent(playButton, 'click', function(){
        if(!isPlayed) {
            playMusic()
            log('playing')
            // 切换暂停图标
            changeIcon(true, playButton)
            // 添加过渡动画
            addTransition(true, playButton)

            updateTime()
// (bug) 播放和暂停功能与列表播放的事件有冲突
        } else {
            stopMusic()
            log('paused')
            // 切换播放图标
            changeIcon(false, playButton)
            // 添加过渡动画
            addTransition(false, playButton)

        }

    })

}

// 切换播放图标函数
var changeIcon = function(state, button) {
    //
    if(state) {
        // 状态为 true, 说明此时需要切换为暂停按钮
        button.src = 'res/icons/pause.png'
    } else {
        // 切换为播放按钮
        button.src = 'res/icons/play.png'
    }
}

// 添加过渡动画
var transition = function(selector, transitionClass) {
    var elements = getElements(selector)
    for (var i = 0; i < elements.length; i++) {
        toggleClass(elements[i], transitionClass)
    }
}

var addTransition = function(flag, button) {
    var img = getElement('.e3-mp3-img')
    if(flag) {
        setTimeout(function(){
            toggleClass(img, 'img-rotate_play')
            transition(".circle", 'circle_play')
        }, 1000)
    } else {
        toggleClass(img, 'img-rotate_play')
        transition(".circle", 'circle_play')
    }
    transition(".e3-mp3-list", 'e3-mp3-list_play')
    transition(".e3-mp3-img", 'e3-mp3-img_play')
    transition("#e3-mp3-progress", 'e3-mp3-progress_play')
    transition("#id-div-currentSong", 'div-currentSong_play')
    transition("#id-span-currentTime", 'span-currentTime_play')
    transition("#id-span-duration", 'span-duration_play')
    transition("#id-input-progress", 'hide')
    transition("#progressbar", 'progressbar_play')
    transition("#progressCircle", 'progressCircle_play')
    toggleClass(button, 'button-play_play')
    transition("#id-button-circlePlay", 'button-circlePlay_play')
    transition("#id-button-randomPlay", 'button-randomPlay_play')
    transition("#id-button-faster", 'button-faster_play')
    transition("#id-button-slower", 'button-slower_play')
    transition("#id-button-pre", 'button-pre_play')
    transition("#id-button-next", 'button-next_play')
}

// 进度条显示及事件绑定
var bindProgress = function() {
    var musicPlayer = getElement('#id-audio-player')
    var duration = parseInt(musicPlayer.duration)
    var range = getElement('#id-input-progress')
    bindEvent(range, 'mouseenter', function(){
        var p = val(range)
        bindEvent(range, 'click', function(){
            p = val(range)
            bg(p)
            // 拖动或点击进度条改变歌曲播放进度
            var result = duration * p / 100
            musicPlayer.currentTime = result
        })
        bindEvent(range, 'mousemove', function(){
            p = val(range)
            bg(p)
        })
    })

    var val = function(e) {
        return Math.floor(e.value / e.max * 100)
    }

    var bg = function(n) {
        range.style.background =  '-webkit-linear-gradient(left ,#FD4848 0%,#FD4848 '+n+'%,#C4C4C4 '+n+'%, #C4C4C4 100%)'
    }
}
// 播放界面圆形进度条的绘制
var drawCircleProgress = function() {
    var range = getElement('#id-input-progress')
    // var range = getElement('#range')
    var rangeValue  // 滑动条获得的是度数值

    var circle = getElement('#progressCircle')
    var circleWidth = circle.width
    var circleHeight = circle.height
    var circleContext = circle.getContext("2d")

    var circleValue = {
        x: 148,
        y: 142,
        r: 234/2 - 1,
        beginAngle: - Math.PI / 4,
        endAngle: Math.PI
    }

    // 样式
    circleContext.lineWidth = 3
    circleContext.strokeStyle = "#FD4848"

    // 描绘进度圆环
    function drawCircle() {
        circleContext.restore()
        // 清空当前路径
        circleContext.clearRect(0,0, circleWidth, circleHeight)
        // 把range的度数值换成Math.PI值
        rangeValue = Number(270 * range.value / range.max)
        // log('rangeValue: ', rangeValue)
        // rangeValue = Number(270)
        // 滑动条获得的是度数值
        circleValue.endAngle = circleValue.beginAngle + (rangeValue / 360) * 2 * Math.PI
        circleContext.beginPath()
        // 绘制圆弧
        circleContext.arc(circleValue.x, circleValue.y, circleValue.r, circleValue.beginAngle, circleValue.endAngle, false)
        circleContext.stroke()
        circleContext.save()
    }
    // 滚动条滑动动画
    // range.oninput = drawCircle
    drawCircle()
}



// 显示歌曲的 当前时间 和 总时间
var showTime = function() {
    var musicPlayer = getElement('#id-audio-player')
    var spanDura = getElement('#id-span-duration')
    var spanCurr = getElement('#id-span-currentTime')
    // 获取当前歌曲的总时间并将其写入 duration
    // (利用 oncanplay 已解决)这句语句存在 bug， 当 mp3 文件没有被加载时无法获取到 duration 属性
    var duration = parseInt(musicPlayer.duration)
    setTime(duration, spanDura)
    // 获取歌曲的当前时间并将其写入 currentTime
    var currTime = parseInt(musicPlayer.currentTime)
    setTime(currTime, spanCurr)

}

var updateTime = function() {
    var musicPlayer = getElement('#id-audio-player')
    var spanCurr = getElement('#id-span-currentTime')
    var spanDura = getElement('#id-span-duration')
    var progress = getElement('#id-input-progress')
    var duration = parseInt(musicPlayer.duration)
    // 进度条与时间同步
    var a = setInterval(function(){
        var currTime = parseInt(musicPlayer.currentTime)
        var value = currTime / duration
        // log('value: ', Math.floor(value*100) + '%')
        var n = Math.floor(value*100)
        progress.value = n
        progress.style.background =  '-webkit-linear-gradient(left ,#FD4848 0%,#FD4848 '+n+'%,#C4C4C4 '+n+'%, #C4C4C4 100%)'
        drawCircleProgress()
        setTime(currTime, spanCurr)
    }, 1000)
    setTimeout(function(){
        clearInterval(a)
    }, duration * 1000)
}
var setTime = function(time, container) {
    var Min = parseInt(time / 60)
    var Sec = time % 60
    Min  = rjust(String(Min), 2, '0')
    Sec  = rjust(String(Sec), 2, '0')
    container.innerHTML = `${Min}:${Sec}`
}

// 补全不足的 0 的函数
var rjust = function(s, width, fillchar=' ') {
    var result = ''
    // 比较 s 与 width 的长度
    if(s.length >= width) {
        result = s
    } else {
        for (var i = 0; i < (width - s.length); i++) {
            result = result + fillchar
        }
        result = result + s
    }
    return result
}

// 随机 循环 模式切换
var changePlayMode = function() {
    var musicPlayer = getElement('#id-audio-player')
    var circlePlay = getElement('#id-button-circlePlay')
    var randomPlay = getElement('#id-button-randomPlay')
    var slowerPlay = getElement('#id-button-slower')
    var fasterPlay = getElement('#id-button-faster')

    bindEvent(circlePlay, 'click', function(){
        // 图标切换
        circlePlay.src = 'res/icons/circle_active.png'
        randomPlay.src = 'res/icons/random.png'
        // ...
    })
    bindEvent(randomPlay, 'click', function(){
        // 图标切换
        circlePlay.src = 'res/icons/circle.png'
        randomPlay.src = 'res/icons/random_active.png'
        // ...
    })

    bindEvent(slowerPlay, 'click', function(){
        musicPlayer.playbackRate -= 0.1
    })
    bindEvent(fasterPlay, 'click', function(){
        musicPlayer.playbackRate += 0.1
    })


}

var playList = function() {
    var musicPlayer = getElement('#id-audio-player')
    var selector = '.mp3-list'
    var songImg = getElement(".e3-mp3-img")
    bindEventAll(selector, 'click', function(event){
        var self = event.target
        var pathNum = self.dataset.path
        var path = `res/mp3/${pathNum}.mp3`
        var imgPath = `res/imgs/${pathNum}.jpg`
        var name = self.querySelector('.mp3-list-name').innerHTML
        musicPlayer.firstElementChild.src = path
        songImg.src = imgPath
        changeSongTitle(name)
        // musicPlayer.canplay = updateTime()
        playMusic()
        log('playing')
        // 切换暂停图标
        changeIcon(true, playButton)
        // 添加过渡动画
        addTransition(true, playButton)

        updateTime()
    })
}

// 替换歌名函数
var changeSongTitle = function(name) {
    var title = getElement('#id-div-currentSong')
    title.innerHTML = name
}

// 列表循环时存在 bug
// 改变资源的函数
var changeRes = function(element, triggerEvent) {
    var musicPlayer = getElement('#id-audio-player')
    // 得到列表中所有音乐(包括音乐文件和图片)的路径并存入数组
    var list = document.querySelectorAll('.mp3-list')
    var paths = [],
        imgPaths = [],
        names = []
    for (var i = 0; i < list.length; i++) {
        var pathNum = list[i].dataset.path
        var path = `res/mp3/${pathNum}.mp3`
        var imgPath = `res/imgs/${pathNum}.jpg`
        var name = list[i].querySelector('span').innerHTML
        paths.push(path)
        imgPaths.push(imgPath)
        names.push(name)
    }
    //
    bindEvent(element, triggerEvent, function(){
        var songImg = getElement(".e3-mp3-img")
        var currSrc = musicPlayer.firstElementChild.src
        var currNum = parseInt(currSrc.slice(currSrc.length - 5, currSrc.length - 4))
        if(element.id == 'id-button-pre') {
            var nextNum = (currNum + 1) % list.length
        } else if(element.id == 'id-button-next'){
            var nextNum = currNum % list.length
        }

        changeSongTitle(names[nextNum])
        songImg.src = imgPaths[nextNum]
        setTimeout(function(){
            musicPlayer.firstElementChild.src = paths[nextNum]
            updateTime()
            playMusic()
        }, 100)

    })
}

// 绑定 上一曲 和 下一曲 按钮事件
var bindPreNext = function() {
    var preBtn = getElement('#id-button-pre')
    var nextBtn = getElement('#id-button-next')
    changeRes(nextBtn, 'click')
    changeRes(preBtn, 'click')
    // changeRes(musicPlayer, 'end')

    // var songImg = getElement(".e3-mp3-img")
    // var currSrc = musicPlayer.src
    // var currNum = parseInt(currSrc.slice(currSrc.length - 5, currSrc.length - 4))
    // bindEvent(preBtn, 'click', function(){
    //     currNum -= 1
    //     musicPlayer.src = paths[currNum % list.length]
    //     songImg.src = imgPaths[currNum % list.length]
    //     musicPlayer.play()
    // })
    // bindEvent(nextBtn, 'click', function(){
    //     currNum += 1
    //     musicPlayer.src = paths[currNum % list.length]
    //     songImg.src = imgPaths[currNum % list.length]
    //     musicPlayer.play()
    // })
}
















var __e3 = function() {
    playSwitch()
    showTime()
    playList()
    bindPreNext()
    bindProgress()
    changePlayMode()
}
// __e3()
