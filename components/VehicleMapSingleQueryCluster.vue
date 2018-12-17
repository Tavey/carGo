<template>
    <div>
        <hb-map-marker 
            :position="[car.latitude, car.longitude]"
            :options="{
                icon: createMarkerIcon(car)
            }"
        />
        <hb-map-popup 
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
import { mapState } from "vuex";
export default {
    components: {
        VehicleMapQueryWindow
    },
    computed: {
        ...mapState({
            car: state => state.Vehicle.singleQuery
        })
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
    }
};
</script>
