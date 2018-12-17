<template>
    <div class="map" >
         <no-ssr>
            <hb-map 
                mapId="main" 
                ref="map" 
                height="100%"
                :zoom="12"
                >
                <hb-map-popup
                    v-if="windowInfo.carInfo.latest_process ? true : false"
                    :position='windowInfo.position'
                    :options="{
                        maxWidth: 'auto',
                        offset: [0, -25],
                        closeButton: false,
                        closeOnClick: false,
                    }"
                >
                    <window-info 
                        :windowInfo="windowInfo.carInfo"
                    />
                </hb-map-popup>
                <hb-map-marker 
                    v-if="windowInfo.carInfo.latest_process ? true : false"
                    :position="[windowInfo.carInfo.latest_process.latitude, windowInfo.carInfo.latest_process.longitude]"
                    :options="{
                        icon: createMarkerIcon(windowInfo.carInfo),
                        angle: windowInfo.carInfo.latest_process.direction,
                        angleOrigin: '50% 50%'
                    }"
                />
            </hb-map>
        </no-ssr>
        <global-footer />
    </div>
</template>

<script>
import WindowInfo from "@/components/ShareMapWindow";
import GlobalFooter from "~/components/global/BaseFooter";
import shareMixin from "~/mixins/share";
export default {
    components: {
        WindowInfo,
        GlobalFooter
    },
    mixins: [shareMixin],
    data() {
        return {
            windowInfo: {
                position: [],
                carInfo: {},
                visible: false
            },
            timeOut: null
        };
    },
    props: {},
    created() {
        if (this.$route.query.password) {
            this.getShare(this.$route.params.id, this.$route.query.password);
            this.password = this.$route.query.password;
            this.shareId = this.$route.params.id;
            this.timeOut = setInterval(() => {
                this.getShare(this.shareId, this.password);
            }, 10000);
        }
    },
    beforeDestroy() {
        clearInterval(this.timeOut);
    },
    computed: {
        clientHeight() {
            if (process.browser) {
                // return document.body.clientHeight-28 + "px";
                return "100%";
            }
        }
    },
    filters: {
        defaultStr(val, str) {
            return val ? val : str;
        }
    },
    methods: {
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
        getShare(share_id, password) {
            let vm = this;
            vm.$Api
                .getShare(share_id, password)
                .then(response => {
                    if (response.data.status) {
                        let data = response.data.data;
                        let gps = [
                            data.latest_process.latitude,
                            data.latest_process.longitude
                        ];
                        vm.$set(vm.windowInfo, "position", gps);
                        vm.$set(vm.windowInfo, "carInfo", response.data.data);
                        vm.$set(vm.windowInfo, "visible", true);
                        vm.setWindowContent(vm.windowInfo.carInfo);
                        vm.$refs.map.getInstance().fitBounds([gps]);
                    }
                })
                .catch(error => {
                    if (error.response) {
                        if (error.response.status == 410) {
                            clearInterval(this.timeOut);
                            vm.$router.push("/share/timeout");
                        } else if (error.response.status == 403) {
                            clearInterval(this.timeOut);
                            vm.message(error.response.data.msg, "warning");
                            vm.$router.push(`/share/${this.shareId}`);
                        } else {
                            clearInterval(this.timeOut);
                            vm.message(error.response.data.msg, "warning");
                        }
                    }
                });
        }
    }
};
</script>
<style scoped>
.map {
    height: calc(100% - 28px);
}
.el-main {
    padding: 0;
}
.map >>> .leaflet-div-icon {
    border: none;
    background: none;
}
.map >>> .leaflet-popup-content-wrapper {
    padding: 0;
    overflow: hidden;
}
.map >>> .leaflet-popup-content {
    margin: 0;
}
</style>

