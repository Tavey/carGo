export default ({store}) => {
    let localStore = JSON.parse(localStorage.getItem("Store"));
    if (localStore && (localStore.sessionId === store.state.sessionId)) {
        store.replaceState(localStore);
    } else {
        // store.dispatch("LoginOut");
        delete window.__NUXT__.state;
    }
    store.subscribe((mutation, state) => {
        localStorage.setItem("Store", JSON.stringify(state));
    });
};
