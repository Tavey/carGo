const AUTH_LIST = ["/vehicle"];

export default ({ store }) => {
    let Route = store.$router;
    Route.beforeEach((to, from, next) => {
        if (AUTH_LIST.findIndex(a => a === to.path) !== -1) {
            if (store.state.User.userInfo) {
                next();
            } else {
                next("/login");
            }
        } else {
            next();
        }
    });
};
