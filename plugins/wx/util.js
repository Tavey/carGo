export default {
    // 微信初始化
    initWXConfig(config) {
        wx.config({
            ...config,
            debug: false,
            jsApiList: ["onMenuShareAppMessage"]
        });
    },

    // 微信自定义分享给朋友 消息模板
    shareWXMsg(title, desc, link, imgUrl) {
        wx.onMenuShareAppMessage({
            title,
            desc,
            link,
            imgUrl
        });
    }
};
