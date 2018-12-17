<template>
    <div class="map">
        <no-ssr>
            <hb-map mapId="main" ref="map" height="100%" zoomControlPosition="topRight">
                <hb-map-marker v-if="mark.latitude && mark.longitude" v-for="(mark, index) in carList" :key="index" :position="[mark.latitude, mark.longitude]" :options="{
                        icon: createMarkerIcon(mark),
                        angle: mark.direction,
                        angleOrigin: '50% 50%',
                    }" @click="handleClick(index)" />
                <hb-map-popup v-for="(mark, index) in carList"  
                        v-if="mark.latitude" 
                        :key="mark.created_at + index" 
                        :position="[mark.latitude, mark.longitude]" 
                        :options="{
                        closeButton: false,
                        closeOnClick: false,
                        autoClose: false,
                        autoPan: false,
                        offset: [mark.direction % 180 === 0 ? 65 : 70, 28],
                        className: 'car'
                    }" 
                    :class="[index === activeIndex ?  activeClass : normalClass]"
                    >
                    <div class="car-brief" @click="handleClick(index)">
                        <ul>
                            <li>{{mark.plate_num | splitPlateNum}}</li>
                        </ul>
                    </div>
                </hb-map-popup>
                <img src="../assets/reset.png" width="54" class="reset-btn" @click="fitView" />
                <img v-show="!showQr" src="../assets/qr.png" width="54" class="qr-btn" @click="showQr=true" />
                <img v-show="showQr" src="../assets/X.png" width="54" class="close" @click="showQr=false">
                <div class="qr—wrap" v-show="showQr">
                    <img src="../assets/qrcode.jpg" width="60">
                    <div class="justify">
                        <div>长按关注</div>
                        <div>右上分享</div>
                    </div>
                    <div class="triangle"></div>
                </div>
                <!-- <div class="close-wrap" v-show="showQr">
                    
                </div> -->
            </hb-map>
        </no-ssr>
    </div>
</template>
<script>
import { $API } from "~/plugins/API/index";
export default {
    data() {
        return {
            activeClass: "active-car",
            normalClass: "normal-car",
            showQr: true,
            visible: true
        };
    },
    props: {
        carList: {
            type: Array
        },
        activeIndex: {
            type: [Number, String]
        }
    },
    watch: {
        activeIndex(val) {
            if (val !== "") {
                this.activeCar();
            }
        },
        carList(val, oldval) {
            if (val.length !== oldval.length) {
                this.fitView();
            }
        }
    },
    filters: {
        splitPlateNum(val) {
            return val ? val.slice(0, 2) + " " + val.slice(2) : "暂无";
        }
    },
    methods: {
        fitView() {
            let mapInstance = this.$refs.map.getInstance();
            let bounds = this.carList.reduce((a, b) => {
                if (b.longitude && b.latitude) {
                    a.push([b.latitude, b.longitude]);
                }
                return a;
            }, []);
            if (bounds.length) {
                mapInstance.fitBounds([bounds], {
                    maxZoom: 12
                });
            }
        },
        createMarkerIcon(mark) {
            if (process.browser) {
                let directionNum = mark.direction / 90;
                let boxShadow = `${
                    directionNum <= 2 && directionNum > 0 ? "" : "-"
                }2px ${
                    directionNum > 1 && directionNum < 3 ? "-" : ""
                }3px 4px rgba(0, 0, 0, .2)`;

                return L.divIcon({
                    html: `<img 
                              src="/car2.png" 
                              src="/car2.png"
                              style="box-shadow: ${boxShadow};cursor:pointer"
                          />`,
                    iconSize: [20, 40]
                });
            }
        },
        activeCar() {
            let mapInstance = this.$refs.map.getInstance();
            let { longitude, latitude } = this.carList[this.activeIndex];
            if (!longitude && !latitude) {
                return;
            }
            mapInstance.fitBounds([[latitude - 0.0005, longitude]]);
        },
        handleClick(i) {
            let vm = this;
            if (i === vm.activeIndex) {
                this.activeCar(i);
            } else {
                this.$emit("active", i);
            }
        }
    }
};
</script>
<style scoped>
.map {
    height: 100%;
}
.map >>> .leaflet-popup-content {
    margin: 0;
}
.map >>> .leaflet-popup-content-wrapper {
    border-radius: 2px;
    padding: 0;
    background: transparent;
    box-shadow: 0px 5px 18px rgba(0, 0, 0, 0.1);
}
.map >>> .window-info-popup {
    z-index: 9999;
}
.map >>> .leaflet-popup-tip {
    width: 0;
    height: 0;
    border-bottom: 9px solid #fff;
    border-left: 9px solid transparent;
    border-right: 5px solid transparent;
    background: transparent;
    background-color: #fff;
    box-shadow: inherit;
}
.map >>> .leaflet-popup-tip-container {
    display: none;
}
.car-brief {
    display: flex;
    justify-content: center;
    font-size: 14px;
    border-radius: 4px;
    /* width: 91px; */
    font-weight: 700;
}
.car-brief ul {
    padding: 5px 10px;
    margin: 0;
    color: #fff;
    position: relative;
    list-style: none;
}
.car-brief li {
    line-height: 20px;
}
.car-brief li.trangle {
    border-top: 15px solid #fff;
    top: 90%;
    left: 38%;
    display: block;
    width: 0px;
    height: 0px;
    border-left: 10px solid transparent;
    border-right: 10px solid transparent;
    position: absolute;
    z-index: 100;
}
.formatted-address {
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    padding: 0;
    margin: 0;
    width: 60px;
}
.map >>> .leaflet-div-icon {
    border: none;
}
.map >>> .car {
    border-radius: 4px;
    overflow: hidden;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
}
.map >>> .active-car {
    background-image: linear-gradient(to right, #388df5 25%, #2760ec 100%);
}
.map >>> .normal-car {
    background-image: linear-gradient(to right, #c2c6d3, #aab0c2);
}
.reset-btn {
    position: absolute;
    z-index: 999;
    bottom: 150px;
    left: 10px;
    background: #fff;
    border-radius: 999px;
    box-shadow: 0 0 6px rgba(0, 0, 0, 0.4);
}
.qr-btn {
    position: absolute;
    z-index: 999;
    top: 20px;
    right: 20px;
    background: #fff;
    border-radius: 999px;
    box-shadow: 0 0 6px rgba(0, 0, 0, 0.4);
}
.close {
    position: absolute;
    z-index: 999;
    top: 20px;
    right: 20px;
    background: #fff;
    border-radius: 999px;
    box-shadow: 0 0 6px rgba(0, 0, 0, 0.4);
}
.qr—wrap {
    position: absolute;
    z-index: 1000;
    top: 86px;
    right: 12px;
    background: #fff;
    padding: 5px;
    color: #939499;
    font-size: 10px;
    border-radius: 4px;
    box-shadow: 0 0px 6px rgba(0, 0, 0, 0.3);
}
.justify {
    margin-top: -6px;
    text-align: center;
    padding: 0 2px;
    letter-spacing: 2px;
}
.justify div {
    margin-top: -4px;
}
.triangle {
    position: absolute;
    top: -22%;
    left: 30%;
    width: 0;
    height: 0;
    border-width: 13px;
    border-style: solid;
    border-color: transparent transparent #fff transparent;
}
</style>


