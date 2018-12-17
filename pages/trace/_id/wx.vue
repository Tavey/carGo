<template>
    <div class="page" v-loading="isLoading">
            <wx-map
                :carList="carList"
                @active="handleActive"
                :activeIndex="activeIndex"
            />
        <swiper-list
            v-if="!isLoading"
            :carList="carList"
            @active="handleActive"
            :activeIndex="activeIndex"
        />
        <!-- <div class="qr-wrapper">
            <ul class="info-row">
                <li>
                    <img 
                        src="../../../assets/slogan.png"
                        alt=""
                        width="70"
                    >
                </li>
                <li>
                    <img 
                        src="../../../assets/qrcode.jpg" 
                        width="60"
                    />
                </li>
                <li>
                    <p>点击右上角分享</p>    
                    <p>长按或扫码关注</p>    
                </li>    
            </ul>                
        </div> -->
    </div>
</template>

<script>
import WxMap from "@/components/WxMap";
import SwiperList from "~/components/WxSwiper";
import WxUtil from "~/plugins/wx/util";
import { $API } from "~/plugins/API/index";

export default {
    name: "trace-wx",
    components: {
        WxMap,
        SwiperList
    },
    data() {
        return {
            carList: [],
            wxConfig: {},
            activeIndex: 0,
            isLoading: true
        };
    },
    created() {
        this.getTrace(this.$route.params.id);
    },
    asyncData({ req }) {
        let url = "http://" + req.headers.host + req.url;
        return $API.getWXSignature(url).then(res => {
            if (res.data) {
                return {
                    wxConfig: res.data
                };
            }
        });
    },
    watch: {
        activeIndex(val) {
            if (val != "") this.setWindowContent(val);
        }
    },
    methods: {
        getTrace(trace_id) {
            let vm = this;
            vm.$Api
                .getTrace(trace_id)
                .then(async response => {
                    if (response.data.status) {
                        let data = response.data.data;
                        let gpsAll = data.entities.filter(a => {
                            if (a.vehicle_id && !a.latitude) {
                                return 1;
                            }
                        });
                        if (gpsAll.length > 0) {
                            setTimeout(() => {
                                vm.getVehicle_id();
                            }, 5000);
                        } else {
                            vm.isLoading = false;
                            vm.carList = data.entities;
                            await vm.setWindowContent(0);
                            vm.initWxShare();
                        }
                    }
                })
                .catch(error => {
                    if (error.response) {
                        if (error.response.status == 410) {
                            vm.$router.push("/trace/timeout");
                        } else {
                            vm.message(error.response.data.msg);
                        }
                    }
                });
        },
        getVehicle_id() {
            let vm = this;
            vm.getTrace(vm.$route.params.id);
        },
        message(str) {
            this.$notify({
                title: "提示",
                message: str,
                type: "warning"
            });
        },
        initWxShare() {
            if (!this.carList.length) return;
            WxUtil.initWXConfig(this.wxConfig);
            let { plate_num, address } = this.carList[0];
            let len = this.carList.length;
            let title =
                len > 1
                    ? `${plate_num}等${len}辆车的当前位置`
                    : `${plate_num}位于${address.formatted_address}`;
            let link = window.location.href;
            let imgUrl = "http://cha.test.huabao.io/cover.png";

            setTimeout(() => {
                wx.ready(() => {
                    WxUtil.shareWXMsg(title, "", link, imgUrl);
                });
            }, 100);
        },
        handleActive(index) {
            this.activeIndex = index;
        },
        async setWindowContent(indexNum) {
            let vm = this;
            let info = vm.carList[indexNum];
            if (!info || info.address) {
                return;
            }
            if (!info.vehicle_id) {
                vm.carList[indexNum].noGps = true;
                vm.$set(vm.carList[indexNum], "address", {
                    province: "",
                    district: "",
                    city: "",
                    neighborhood: "",
                    street: "",
                    streetNumber: "",
                    formatted_address: "暂无地址"
                });
                return;
            }
            return new Promise((resolve, reject) => {
                // var infos ={
                //     longitude:120.758658,
                //     latitude:30.745826
                // }
                vm.$Api
                    .geoCode(info.longitude, info.latitude)
                    // .geoCode(infos.longitude, infos.latitude)
                    .then(res => {
                        if (res.status === 200 && res.data.status === "1") {
                            let addressComponent =
                                res.data.regeocode.addressComponent;
                            vm.$set(vm.carList[indexNum], "address", {
                                province: addressComponent.province,
                                district: addressComponent.district,
                                city: addressComponent.city,
                                neighborhood: addressComponent.neighborhood,
                                street: addressComponent.street,
                                streetNumber: addressComponent.streetNumber,
                                formatted_address: vm.replaceAdress(
                                    res.data.regeocode
                                )
                            });
                            resolve();
                        }
                    })
                    .catch(err => {
                        reject(err);
                    });
            });
        },
        replaceAdress(data) {
            // if (data.addressComponent.city.length > 0) {
            //     let address = data.formatted_address.replace(
            //         data.addressComponent.province,
            //         ""
            //     );
            //     address = address.replace(data.addressComponent.city, "");
            //     return address;
            // } else {
            //     let address = data.formatted_address.replace(
            //         data.addressComponent.province,
            //         ""
            //     );
            //     address = address.replace(data.addressComponent.district, "");
            //     return address.split('(')[0];
            // }
            // return data.formatted_address.split(
            //     data.addressComponent.township
            // )[2];
            return data.formatted_address.split(
                data.addressComponent.township
            )[1];
        }
    }
};
</script>
<style scoped>
.page {
    height: 100%;
}
.swiper-container {
    height: 100px;
    border: 1px solid #000;
}
.qr-wrapper {
    background-image: linear-gradient(to top right, #388df5, #2760ec);
    color: #fff;
    min-height: 80px;
    display: flex;
    align-items: center;
}
.info-row {
    display: flex;
    list-style: none;
    font-size: 12px;
    font-weight: 700;
    align-items: center;
    justify-content: space-between;
    width: 70%;
    min-width: 250px;
    margin: auto;
    padding: 0;
}
.info-row p {
    line-height: 22px;
}
</style>

