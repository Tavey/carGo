<template>
    <div class="swiper-container">
        <div class="swiper-wrapper">
            <div v-for="(list,index) in swiperData" :style="{backgroundImage: 'url(' + list.bgUrl + ')' }" swiper-animate-duration="0.5s" class="ani swiper-slide" :key="index">
                <div class="con-wrap">
                    <img :src="list.imgUrl" alt="" width="100%">
                    <div class="title">
                        {{list.text}}
                    </div>
                    <div class="instructions">{{list.instructions}}</div>
                    <el-button v-if="list.link" type="primary" @click="toVehicle">查看更多</el-button>
                </div>
            </div>
        </div>
        <div class="swiper-pagination"></div>
        <div class="qr-wrap">
            <img src="../assets/qrcode.jpg" width="110" alt="">
            <div class="qr-text">
                <div class="coarse">扫一扫</div>
                <div>微信查询</div>
            </div>

        </div>
    </div>

</template>
<script>
import { mapMutations, mapState, mapActions } from "vuex";
import Swiper from "swiper";
export default {
    data() {
        return {
            mySwiper: null,
            swiperData: [
                {
                    bgUrl: require("../assets/bg1.jpg"),
                    imgUrl: require("../assets/wheret.png"),
                    text: "用好数据 做好生意",
                    instructions: "让顾客更放心/让员工更省心/让老板更安心"
                },
                {
                    bgUrl: require("../assets/bg2.jpg"),
                    imgUrl: require("../assets/tracking.png"),
                    text: "无成本解决企业陆运跟踪缺失问题",
                    instructions: "精确定位/全程监控/信息准确/订阅提醒",
                    link: "立即查看"
                },
                {
                    bgUrl: require("../assets/bg3.jpg"),
                    imgUrl: require("../assets/Cargo.png"),
                    text: "让你足不出户随时掌握货源动态",
                    instructions: "随时随地了解细致货源信息变化/掌上货源咨询"
                }
            ],
            show: false
        };
    },
    computed: {
        ...mapState({
            userInfo: state => state.User.userInfo
        })
    },
    mounted() {
        this.createSwiper();
    },
    methods: {
        createSwiper() {
            let vm = this;
            vm.show = true;
            vm.mySwiper = new Swiper(".swiper-container", {
                // autoplay:true,
                effect: "fade",
                loop: true,
                autoplay: {
                    delay: 5000 //1秒切换一次
                },
                resistanceRatio: 0,
                pagination: {
                    el: ".swiper-pagination"
                }
            });
        },
        toVehicle() {
            if(this.userInfo){
                this.$router.push("/vehicle");
            }else{
                this.$router.push("/login");
            }
            
        }
    }
};
</script>
<style  lang="scss">
.swiper-container {
    height: calc(100%+22px);
    min-height:710px;
}
.swiper-slide {
    background: #000;
    background-repeat: no-repeat;
    background-size: cover;
}
.con-wrap {
    margin: auto;
    position: absolute;
    top: -190px;
    right: 0;
    bottom: 0;
    left: 0;
    height: 284px;
    width: 506px;
    color: #fff;
    line-height: 40px;
    font-size: 18px;
    text-align: center
}
.swiper-slide .title {
    padding-top: 10px;
}
.instructions {
    padding-bottom: 15px;
}
.swiper-pagination-bullet {
    border: 1px solid #fff;
    height: 12px;
    width: 12px;
}
.swiper-pagination-bullet-active {
    background: #fff;
}
.qr-wrap {
    margin: auto;
    height: 110px;
    width: 190px;
    z-index: 100;
    position: absolute;
    top: 438px;
    right: 0;
    bottom: 0;
    left: 0;
    font-size: 12px;
    .qr-text {
        height: 100%;
        width: 69px;
        float: right;
        text-align: right;
        padding: 20px 0;
        color: #fff;
        div {
            line-height: 27px;
        }
        .coarse {
            font-weight: 800;
            font-size: 18px;
        }
    }
}
</style>

