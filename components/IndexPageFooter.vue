<template>
    <div class="foot-wrap">
        <div class="recommended">
            <div class="line">
                <span>推荐浏览器：</span>
                <span @click="to360" class="middle-center">
                    <img src="../assets/360.png" alt="" class="browser-icon">
                    <span>360浏览器</span>
                </span>
                <span class="cut-line">|</span>
                <span @click="toGoogle" class="middle-center">
                    <img src="../assets/google.png" alt="" class="browser-icon">
                    <span>谷歌浏览器</span>
                </span>
            </div>
            <div class="rea clearfix">
                <span>
                    <a href="http://www.huabaotech.com">关于我们</a>
                    <span class="cut-line">

                    </span>
                    <span class="agreement" @click="dialogVisible = true">用户协议</span>
                </span>
                <span class="hover" @mouseenter="hover=true" @mouseleave="hover=false">
                    <img src="../assets/qr_icon.png" width="25" alt="">微信公众号
                </span>
                <div v-show="hover" class="qr-wraper">
                    <img src="../assets/qrcode.jpg" at="" width="75">
                    <span>扫码关注</span>
                </div>
            </div>
        </div>
        <div class="consulting clearfix">
            <div>Copyright &copy; {{year}} 华保科技保留所有权利
                <span class="cut-line">|</span>浙ICP备17010660号-3</div>
            <div>
                <span class="phone-num">客服电话: 021-34216186（周一至周五 10:00-17:00）</span>
                客服邮箱:
                <a style="color: #999" href="mailto:support@huabaotech.com">support@huabaotech.com</a>
            </div>
        </div>
        <el-dialog 
            :visible.sync="dialogVisible" 
            width="50%"
            :lock-scroll="false"
        >
            <div class="article">
                <div>
                    <div v-for="(section,index) in dialogText" class="Part" :key="index">
                        <h2>{{section.title}}</h2>
                        <div class="abstract">
                            <h3 >{{section.abstract.title}}</h3>
                            <p v-for="(line, index) in section.abstract.con" :key="index">{{line}}</p>
                        </div>
                        <ul class="terms-list">
                            <li v-for="(chapter,y) in section.terms" :key="y">
                                <h4>{{chapter.title}}</h4>
                                <p v-for="(paragraph, index) in  chapter.con" :key="index">{{paragraph}}</p>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <span slot="footer" class="dialog-footer">
                <!-- <el-button type="primary" @click="dialogVisible = false">确 定</el-button> -->
            </span>
        </el-dialog>
    </div>

</template>
<script>
import { DIALOGTEXT } from "../plugins/text.js";
export default {
    data() {
        return {
            dialogVisible: false,
            hover: false,
            dialogText: DIALOGTEXT,
            year: null
        };
    },
    created() {
        let now = new Date();
        this.year = now.getFullYear();
    },
    methods: {
        to360() {
            window.open("https://browser.360.cn/ee/");
        },
        toGoogle() {
            window.open("https://www.google.cn/chrome/");
        }
    }
};
</script>
<style scoped lang="scss">
ul,
li {
    list-style-type: none;
    margin: 0;
    padding: 0;
}

.foot-wrap {
    background: #272a33;
    width: 100%;
    padding: 8px 80px 0 80px;
    font-size: 12px;
}

.consulting {
    color: #6e7486;
    line-height: 37px;
    max-width: 1200px;
    margin: auto;
}

.recommended {
    color: #fff;
    display: flex;
    justify-content: space-between;
    align-items: center;
    max-width: 1200px;
    margin: auto;
}

.line {
    display: flex;
    align-items: center;
}
.cut-line {
    margin: 0 8px;
    position: relative;
    top: -1px;
}
.foot-wrap .qr-wraper {
    width: 83px;
    height: 99px;
    background: #fff;
    color: #000;
    border-radius: 4px;
    display: inline-block;
    margin-top: -10px;
    position: absolute;
    left: 145px;
    top: -97px;
    z-index: 100;
    overflow: hidden;
    text-align: center;
    font-size: 12px;
    span {
        height: 18px;
    }
    img {
        position: relative;
        top: 4px;
    }
}

.rea {
    width: 230px;
    display: flex;
    position: relative;
    justify-content: space-between;
    align-items: center;
}
.hover,
.middle-center {
    display: flex;
    align-items: center;
    cursor: pointer;
}
.agreement {
    cursor: pointer;
}
.browser-icon {
    position: relative;
    top: -2px;
    margin-right: 4px;
}
.phone-num {
    margin-right: 20px;
}
.consulting {
    display: flex;
    justify-content: space-between;
}
a {
    text-decoration: none;
}
a:link {
    color: #fff;
}

a:visited {
    color: #fff;
}

a:active {
    color: #fff;
}

a:hover {
    color: #fff;
}

.clearfix {
    clear: both;
}

.article {
    height: 100%;
    width: 100%;
    overflow-x: hidden;
    h2 {
        text-align: center;
    }
    .abstract {
        margin-top: 10px;
        margin-bottom: 10px;
    }
}
.terms-list li {
    margin-top: 15px;
}
p {
    text-indent: 2em;
}
.Part {
    margin-bottom: 30px;
    font-size: 12px;
    color: #000;
}
.closebtn {
    position: absolute;
    top: 20px;
    right: 20px;
    padding: 0;
    background: 0 0;
    border: none;
    outline: 0;
    cursor: pointer;
    font-size: 16px;
}
.el-dialog__close {
    font-family: element-icons !important;
    speak: none;
    font-style: normal;
    font-weight: 400;
    -webkit-font-feature-settings: normal;
    font-feature-settings: normal;
    font-variant: normal;
    text-transform: none;
    line-height: 1;
    vertical-align: baseline;
    display: inline-block;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}
</style>
<style scoped>
.foot-wrap >>> .el-dialog {
    height: 60%;
}
.foot-wrap >>> .el-dialog__body {
    height: 90%;
}
</style>


