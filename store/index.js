import Vuex from "vuex";
import User from "./module/user";
import Vehicle from "./module/vehicle";

const state = {
    sessionId: ""
};

const mutations = {
    SET_SESSION(state, seesion) {
        state.sessionId = seesion;
    }
};

const actions = {
    nuxtServerInit({commit}, {req}) {
        commit("SET_SESSION", req.sessionID);
    }
};

export default () => {
    return new Vuex.Store({
        // strict: true,
        state,
        mutations,
        actions,
        modules: {
            User,
            Vehicle
        }
    });
};
