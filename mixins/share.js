export default {
    data() {
        return {
        };
    },
    methods: {
        setWindowContent(info) {
            let vm = this;
            vm.$Api.geoCode(
                info.latest_process.longitude,
                info.latest_process.latitude
            )
                .then((res) => {
                    if (res.status === 200 && res.data.status === "1") {
                        vm.$set(vm.windowInfo.carInfo, "formatted_address", res.data.regeocode.formatted_address);
                    }
                })
                .catch((err) => {

                });
        },
        message(str) {
            this.$notify({
                title: "提示",
                message: str,
                type: "warning"
            });
        }
    }
};
