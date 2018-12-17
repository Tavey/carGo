<template>
    <div class="map">
        <no-ssr>
            <hb-map 
                mapId="main"
                ref="map"
                height="100%"
                :position="[[30.391353, 118.927936]]"
                :zoom="7"
                :options="{
                    minZoom: 3
                }"
                zoomControlPosition="topRight"
            >
                <vehicle-map-trace-cluster 
                    v-if="activeComponent === 'VehicleList'"
                />
                <vehicle-map-query-cluster 
                    v-if="activeComponent === 'MutiplieQuery' ||  activeComponent === 'HistoryList'"
                />
                <vehicle-map-single-query-cluster 
                    v-if="singleQuery"
                />
                <div class="prompt">目前仅支持浙江地区大型（部分中型）货运车辆查询</div>
                <div  class="qr-wraper">
                    <img src="../assets/qrcode.jpg" at="" width="75">
                    <span>关注公众号</span>
                </div>
            </hb-map>
        </no-ssr>
    </div>
</template>
<script>
import VehicleMapTraceCluster from "./VehicleMapTraceCluster";
import VehicleMapQueryCluster from "./VehicleMapQueryCluster";
import VehicleMapSingleQueryCluster from "./VehicleMapSingleQueryCluster";
import { mapState, mapGetters, mapMutations } from "vuex";
import { $API } from "~/plugins/API/index";
import { type } from "~/store/module/vehicle";
import GPS from "@/plugins/gps";
export default {
    components: {
        VehicleMapTraceCluster,
        VehicleMapQueryCluster,
        VehicleMapSingleQueryCluster
    },
    computed: {
        ...mapGetters({
            vehicleList: "getVehicleList"
        }),
        ...mapState({
            activeComponent: state => state.Vehicle.activeComponent,
            singleQuery: state => state.Vehicle.singleQuery,
            mapBounds: state => state.Vehicle.mapBounds,
            activeCar: state => state.Vehicle.activeCar,
            polylineId: state => state.Vehicle.polyline.id
        })
    },
    watch: {
        activeComponent(val) {
            this.clearPolyline();
            if (val) {
                setTimeout(() => {
                    this.fitView(this.vehicleList);
                }, 300);
            }
        },
        "activeCar.id"(val) {
            let vm = this;
            if (val === vm.polylineId) return;
            this.$setPolyLine({
                data: [],
                id: ""
            });
        },
        "mapBounds.needFit": {
            handler(val) {
                let data = this.mapBounds.data;
                Array.isArray(data) ? this.fitView(data) : this.fitView([data]);
            }
        }
    },
    methods: {
        ...mapMutations({
            $setPolyLine: type.SET_POLYLINE
        }),
        fitView(arr) {
            let vm = this;
            let bounds = arr.reduce((a, b) => {
                if (b.latest_process !== null) {
                    let lat = b.latest_process
                        ? b.latest_process.latitude
                        : b.latitude;
                    let lng = b.latest_process
                        ? b.latest_process.longitude
                        : b.longitude;
                    if (lat && lng && !new GPS(lng, lat).isIllegal()) {
                        a.push([lat, lng]);
                    }
                }
                return a;
            }, []);
            let mapInstance = this.$refs.map.getInstance();
            if (!bounds.length) {
                return;
            }
            vm.$nextTick(() => {
                mapInstance.fitBounds(bounds, {
                    maxZoom: 15
                });
            });
        },
        clearPolyline() {
            let mapInstance = this.$refs.map.getInstance();
            mapInstance.eachLayer(function(layer) {
                if (layer._path) {
                    mapInstance.removeLayer(layer);
                }
            });
        }
    }
};
</script>
<style scoped>
.map {
    width: 100%;
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
.map >>> .leaflet-left {
    right: 10px;
    left: auto;
}
.map >>> .leaflet-div-icon {
    border: none;
    background: transparent;
}
</style>
<style lang="scss" scoped>
.prompt {
    position: absolute;
    z-index: 999;
    background: #fff;
    padding: 5px 10px;
    font-size: 12px;
    bottom: 40px;
    left: 20px;
    color: #5c5e66;
    border-radius: 4px;
}
.qr-wraper {
    width: 83px;
    height: 104px;
    background: #fff;
    color: #313133;
    border-radius: 4px;
    position: absolute;
    bottom: 40px;
    right: 20px;
    z-index: 1000;
    overflow: hidden;
    text-align: center;
    font-size: 12px;
    span {
        line-height: 12px;
        margin-bottom: 5px;
    }
    img {
        position: relative;
        top: 4px;
    }
}
</style>


