//每次都需要先查看用户之前有没有设置过开启/关闭划词翻译功能.使用chrome的storage接口，查看能不能获取到 'switch' 这一项
chrome.storage.sync.get(['switch'], function (result) {
    console.log('之前用户选择的是' + result.switch + '划词翻译功能')

    //如果之前有把用户的选择存储到chrome的storage中
    if (result.switch) {
        //把弹出层里选择框的值设置成之前已存储好的值 on / off (这样就不会在每次刷新页面后选择框的选项都被重置)
        selectNode.value = result.switch
    }
});

//监听这个选择框，当值发生变化时触发
selectNode.onchange = function () {
    //划词翻译功能,利用chrome的storageAPI存储开启/关闭状态：把用户选择的选项存储在chrome的 storage 接口中,存到 'switch'中，下次取出来的时候通过 'switch' 取
    chrome.storage.sync.set({switch: this.value})

    //通知 content-script.js 用户选择的是开启还是关闭
    //由于chrome浏览器上可能开启了多个窗口&标签页，所以需要先找到currentWindow，和当前活动的网页 active
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        //给当前标签页发送信息（筛选出来的该标签的第一个的id）
        chrome.tabs.sendMessage(tabs[0].id, {switch: this.value})
    })
}