<template>
    <div 
        class="test"
        v-if="needUpdate"
    >
        <hb-map-marker 
            v-for="car in CarList"
            :key="car.id+100"
            :position="[car.latitude, car.longitude]"
            :options="{
                icon: createMarkerIcon(car)
            }"
        />
        <hb-map-popup 
            v-for="car in CarList"
            :key="car.id"
            ref="popup"
            :position="[car.latitude, car.longitude]"
            :options="{
                autoClose: false,
                offset: [0, -20],
                closeOnClick:false,
                autoPan: false,
                closeButton: false,
            }"
        >
            <vehicle-map-query-window 
                :car="car"           
            />
        </hb-map-popup>
    </div>   
</template>
<script>
import VehicleMapQueryWindow from "./VehicleMapQueryWindow";
import { mapGetters } from "vuex";
export default {
    data() {
        return {
            needUpdate: true
        };
    },
    components: {
        VehicleMapQueryWindow
    },
    computed: {
        ...mapGetters({
            carList: "getVehicleList"
        }),
        CarList() {
            return this.carList
                ? this.carList.filter(a => a.latitude && a.longitude)
                : [];
        }
    },
    watch: {
        "carList.length"() {
            this.needUpdate = false;
            this.$nextTick(() => {
                this.needUpdate = true;
            });
        }
    },
    methods: {
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
                              src="${require("~/assets/car2.png")}" 
                              style="box-shadow: ${boxShadow}"
                          />`,
                    iconSize: [20, 40]
                });
            }
        }
        // return { ...car, address };
    }
};
</script>
<style lang="scss" scoped>
</style>
