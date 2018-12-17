export default {
    state: {
        userInfo: null,
        isLogin: false
    },
    getters: {
        userInfo: state => state.userInfo
    },
    mutations: {
        SET_USERINFO(state, userInfo) {
            state.userInfo = userInfo;
        },
        SET_LOGIN_STATUS(state, isLogin) {
            state.isLogin = isLogin;
        }
    },
    actions: {
        LoginAndSetUserInfo({ commit }, userInfo) {
            commit("SET_USERINFO", userInfo);
            commit("SET_LOGIN_STATUS", true);
        },
        LoginOut({ commit }) {
            commit("SET_USERINFO", null);
            commit("SET_LOGIN_STATUS", false);
            localStorage.clear();
        }
    }
};
