<template>
    <div class="page">
        <vehicle-bar />
        <no-ssr>
            <component 
                :is="activeComponent"
            />
        </no-ssr>
        <vehicle-map />
    </div>   
</template>
<script>
import VehicleMap from "@/components/VehicleMap";
import VehicleBar from "@/components/VehicleBar";
import { mapState, mapMutations } from "vuex";
import { type } from "@/store/module/vehicle";

export default {
    name: "Vehicle",
    components: {
        VehicleMap,
        VehicleBar,
        VehicleList: () => import("@/components/VehicleList"),
        VehicleForm: () => import("@/components/VehicleForm"),
        QueryTip: () => import("@/components/VehicleQueryTip"),
        MutiplieQuery: () => import("@/components/VehicleMutiplieQuery"),
        HistoryList: () => import("@/components/VehicleHistoryList")
    },
    computed: {
        ...mapState({
            activeComponent: state => state.Vehicle.activeComponent
        })
    },
    methods: {
        ...mapMutations({
            setActiveComponent: type.SET_ACTIVECOMPONENT,
            setPolyLine: type.SET_POLYLINE,
            setActiveCar: type.SET_ACTIVECAR
        })
    },
    beforeRouteEnter(to, from, next) {
        next(vm => {
            if (!vm.$store.state.User.userInfo) {
                vm.$router.push("/login");
            }
        });
    },
    beforeRouteLeave(to, from, next) {
        this.setActiveComponent("");
        this.setPolyLine({
            data: [],
            id: "",
        });
        this.setActiveCar({});
        next();
    }
};
</script>
<style lang="scss" scoped>
.page {
    height: 100%;
    width: 100%;
    position: relative;
}
.fade-enter-active,
.fade-leave-active {
    transition: opacity 4s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
}
</style>
