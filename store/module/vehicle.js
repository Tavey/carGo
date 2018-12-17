import { $API } from "@/plugins/API/index";
import Vue from "vue";
import GPS from "@/plugins/gps";

export const type = {
    SET_VEHICLELIST: "SET_VEHICLELIST",
    SET_ACTIVECAR: "SET_ACTIVECAR",
    SET_ACTIVECOMPONENT: "SET_ACTIVECOMPONENT",
    SET_POLYLINE: "SET_POLYLINE",
    SET_SINGLEQUERY: "SET_SINGLEQUERY",
    SET_MAPBOUNDS: "SET_MAPBOUNDS",
};

export default {
    state: {
        vehicleList: [],
        polyline: {
            data: [],
            id: "",
        },
        singleQuery: null,
        activeCar: null,
        activeComponent: "",
        mapBounds: {
            data: [],
            needFit: false
        }
    },
    getters: {
        getVehicleList(state) {
            return state.vehicleList.filter(car => {
                if (!car.latitude || !car.longitude) {
                    return false;
                }
                return !new GPS(car.longitude, car.latitude).isIllegal()
            })
        }
    },
    mutations: {
        [type.SET_VEHICLELIST](state, vehicleList) {
            state.vehicleList = vehicleList;
        },
        [type.SET_ACTIVECAR](state, activeCar) {
            state.activeCar = activeCar;
            state.activeCar &&
                Vue.set(state.activeCar, "Active", !state.activeCar.Active);
        },
        [type.SET_ACTIVECOMPONENT](state, activeComponent) {
            state.activeComponent = activeComponent;
        },
        [type.SET_SINGLEQUERY](state, singleQuery) {
            state.singleQuery = singleQuery;
        },
        [type.SET_POLYLINE](state, polyline) {
            state.polyline = polyline;
        },
        [type.SET_MAPBOUNDS](state, boundKey) {
            state.mapBounds.data = state[boundKey].data ? state[boundKey].data : state[boundKey];
            state.mapBounds.needFit = !state.mapBounds.needFit;
        }
    }
};
