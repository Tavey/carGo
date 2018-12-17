<template>
    <div class="swiper">
        <div class="swiper-container">
            <div class="swiper-wrapper">
                <div v-for="(slide,index) in carList" :key="index"  :class="{ selected: activeIndex ==  index,noGps:slide.noGps }"  class="swiper-slide">
                    <el-row  class="area" :gutter="10" type="flex" align="center">
                        <el-col :span="15">
                            <div  v-if="slide.address" class="province">
                                <div v-if="slide.noGps">
                                    <span >{{slide.plate_num}}</span>
                                </div>
                                <div v-else>
                                    <span v-if="slide.address.city.length>0"> {{slide.address.province}}-{{slide.address.city}}</span>
                                    <span v-else> {{slide.address.province}}-{{slide.address.district}}</span>
                                </div>
                                
                            </div>
                        </el-col>
                        <el-col :span="3" :offset="5">
                            <div class="updown">
                                <span>{{activeIndex !== '' ? activeIndex + 1 : 1}}/{{carList.length}}</span>
                            </div>
                        </el-col>
                    </el-row>
                    <el-row class="wrap_location" :gutter="10">
                         <el-col :span="23">
                             <div class="location" v-if="slide.address">
                                <!-- <div class="street" v-if="slide.address.streetNumber.street.length>0">
                                    <span v-if="slide.address.city.length">
                                       {{slide.address.district}}{{slide.address.streetNumber.street}}{{slide.address.streetNumber.number}}
                                    </span>
                                    <span v-else>
                                        {{slide.address.streetNumber.street}}{{slide.address.streetNumber.number}}
                                    </span>
                                </div> -->
                                <div class="street" >
                                    {{slide.address.formatted_address}}
                                </div>
                            </div>
                         </el-col>
                    </el-row>
                     <el-row :gutter="10">
                          <el-col :span="20">
                              <div class="time">{{slide.sampled_at}}</div>
                          </el-col>
                     </el-row>
                </div>
                <!-- <div class="swiper-slide">11</div>
                <div class="swiper-slide">22</div>
                <div class="swiper-slide">33</div> -->
            </div>
        </div>
    </div>
</template>
<script>
import Swiper from "swiper";
export default {
    data() {
        return {
            mySwiper: null,
            up: false,
            down: true,
            log: []
        };
    },
    props: {
        carList: {
            type: Array
        },
        activeIndex: {
            type: [Number, String],
            default: 0
        }
    },
    filters: {
        splitPlateNum(val) {
            return val ? val.slice(0, 2) + " " + val.slice(2) : "暂无";
        }
    },
    watch: {
        activeIndex(val) {
            if (/[0-9]/.test(val)) {
                this.mySwiper.slideToLoop(val, 1000, false); //val
            }
        }
    },
    mounted() {
        this.createSwiper();
    },
    methods: {
        createSwiper() {
            let vm = this;
            vm.mySwiper = new Swiper(".swiper-container", {
                // loop: true,
                // autoplay:true,
                // direction: "vertical",
                resistanceRatio: 0,
                spaceBetween: 15,
                on: {
                    slideChangeTransitionStart: function() {
                        if (vm.carList.length == 0) {
                            vm.up = false;
                            vm.down = false;
                            return;
                        }
                        if (this.realIndex == 0) {
                            vm.up = false;
                            vm.down = true;
                        } else if (this.realIndex == vm.carList.length - 1) {
                            vm.down = false;
                            vm.up = true;
                        } else {
                            vm.down = true;
                            vm.up = true;
                        }
                        vm.$emit("active", this.realIndex);
                    }
                }
            });
        }
    }
};
</script>
<style scoped>
.swiper {
    height: 100px;
    width: 100%;
    color: #000;
    /* box-shadow: 0 -3px 10px rgba(0, 0, 0, 0.1); */
    position: absolute;
    bottom: 25px;
    z-index: 1999;
    overflow-x: scroll;
}
.swiper-container {
    width: 80%;
    height: 100%;
    overflow: initial;
}
.swiper-slide {
    height: 100%;
    background: #fff;
    box-sizing: border-box;
    padding: 4% 0 4% 5%;
    font-size: 0.82rem;
    overflow: hidden;
    border-radius: 6px;
    box-shadow: 0 0px 6px rgba(0, 0, 0, 0.3);
}
.selected {
    color: #fff;
    background-image: linear-gradient(to right, #388df5 50%, #2760ec 100%);
}
.noGps{
    background:#ccc;
}
.area {
    position: relative;
    font-size: 17px;
}
.province {
    font-weight: 800;
}
.updown {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    font-size: 12px;
    width: 100%;
}
.wrap_location {
    font-size: 16px;
    /* font-weight: 700; */
}
.location {
    margin-top: 2px;
}
.time {
    margin-top: 10px;
    font-size: 12px;
}
</style>

