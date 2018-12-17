<template>
    <div class="trace-cluster" >
        <hb-map-popup
            :position="[activeCar.latest_process.latitude, activeCar.latest_process.longitude]"
            :options="{
                maxWidth: 'auto',
                offset: [0, -25],
                closeButton: false,
                autoClose: false,
                closeOnClick: false,
                autoPan: false,
                className: 'window-info-popup'
            }"
            v-if="activeCar"
        >
            <vehicle-map-trace-window
                :car="activeCar"
                @close="handleClose(null)"
            />
        </hb-map-popup>
        <hb-map-marker 
            v-if="mark.latest_process ? true : false"
            v-for="(mark, index) in carList"
            :key="index"
            :position="[mark.latest_process.latitude, mark.latest_process.longitude]"
            :options="{
                icon: createMarkerIcon(mark),
                angle: mark.latest_process.direction,
                angleOrigin: '50% 50%'
            }"
        />
        <hb-map-popup
            v-for="(mark) in carList"
            :key="mark.created_at"
            :position="[mark.latest_process.latitude, mark.latest_process.longitude]"
            v-if="mark.latest_process"
            :options="{
                closeButton: false,
                closeOnClick: false,
                autoClose: false,
                autoPan: false,
                offset: [0 , -25],
            }"
            :style="{background: mark.status.color}"
        >
            <div class="car-brief" >
                <ul >
                    <li>{{mark.plate_num}}</li>
                    <li >
                        <p  class="formatted-address" :title="mark.order_id && mark.order_id.length >7 ? mark.order_id : ''">
                            {{mark.order_id | defaultStr('暂无')}}
                        </p>
                        </li>
                    <li class="trangle"  :style="{borderTopColor: mark.status.color}"></li>
                </ul>
            </div>
        </hb-map-popup>
        <hb-map-marker
            :position="polyLinefiltered[0]"
            v-if="polyLinefiltered.length"
            :options="{
                icon: createPointIcon('start'),
            }"
        />
        <hb-map-polyline
            :position="polyLinefiltered"                  
            :visible="polyLinefiltered.length > 0"
            ref="polyline"
            :options="{
                color: '#409EFF',
                weight: 8
            }"
        />
    </div>
</template>
<script>
import VehicleMapTraceWindow from "./VehicleMapTraceWindow";
import { mapActions, mapState, mapGetters } from "vuex";
import GPS from '@/plugins/gps';
import Vue from "vue";
export default {
    components: {
        VehicleMapTraceWindow
    },
    filters: {
        defaultStr(val, str) {
            return val ? val : str;
        }
    },
    computed: {
        ...mapState({
            polyline: state => state.Vehicle.polyline.data,
            activeCar: state =>  state.Vehicle.activeCar,
            activeComponent: state => state.Vehicle.activeComponent
        }),
        ...mapGetters({
            carList: "getVehicleList",
        }),
        polyLinefiltered() {
            return this.polyline.length
                ? this.polyline.reduce((a, b) => {
                      if (b.latitude && b.longitude) {
                          let gps = new GPS(b.longitude, b.latitude).transform().toReArray();
                          a.push(gps);
                      }
                      return a;
                  }, [])
                : [];
        }
    },
    watch: {
        polyLinefiltered(val) {
            let polylineInstance = this.$refs.polyline.getInstance();
            polylineInstance.setLatLngs(val).redraw();
        }
    },
    methods: {
        ...mapActions({
            handleClose: "toggleActiveCar"
        }),
        createMarkerIcon(mark) {
            if (process.browser) {
                let directionNum = mark.latest_process.direction / 90;
                let boxShadow = `${
                    directionNum <= 2 && directionNum > 0 ? "" : "-"
                }2px ${
                    directionNum > 1 && directionNum < 3 ? "-" : ""
                }3px 4px rgba(0, 0, 0, .2)`;
                return L.divIcon({
                    html: `<img
                              src="${require("~/assets/car2.png")}"
                              style="box-shadow: ${boxShadow}"
                          />`,
                    iconSize: [20, 40]
                });
            }
        },
        createPointIcon(str) {
            let img;
            switch (str) {
                case "start":
                    img = require("@/assets/startpoint.png");
                    break;
                case "end":
                    img = require("@/assets/endpoint.png");
                    break;
            }
            return L.divIcon({
                html: `<img src="${img}"  width="100%"/>`,
                iconSize: [30, 30]
            });
        }
    }
};
</script>
<style lang="scss" scoped>
.car-brief {
    display: flex;
    justify-content: center;
    font-size: 14px;
    border-radius: 4px;
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
</style>
