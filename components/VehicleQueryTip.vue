<template>
    <div class="query-tip">
        <p class="title">搜索记录</p>
        <vehicle-query-tag 
            @handle-click="generateSingleTrace"
        />
    </div>
</template>
<script>
import { mapState, mapMutations } from "vuex";
import { type } from "@/store/module/vehicle";
import VehicleQueryTag from "./VehicleQueryTag";
export default {
    components: {
        VehicleQueryTag
    },
    computed: {
        ...mapState({
            querySingle: state => state.Vehicle.querySingle
        })
    },
    methods: {
        ...mapMutations({
            setQuerySingle: type.SET_SINGLEQUERY,
            setVehicleList: type.SET_VEHICLELIST
        }),
        generateSingleTrace(plateNum) {
            let vm = this;
            let reg = /^([\u4e00-\u9fa5][a-zA-Z](([DF](?![a-zA-Z0-9]*[IO])[0-9]{4,5})|([0-9]{5}[DF])))|([冀豫云辽黑湘皖鲁苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼渝京津沪新京军空海北沈兰济南广成使领A-Z]{1}[a-zA-Z0-9]{5,6}[a-zA-Z0-9挂学警港澳]{1})$/;

            if (!reg.test(plateNum)) {
                vm.$message({
                    message: "请输入正确的车牌号",
                    type: "warning"
                });
                return;
            }
            vm.$Api
                .generateSingleTrace(plateNum)
                .then(res => {
                    if (res.data.status) {
                        if (
                            res.data.data.entities[0].latitude &&
                            res.data.data.entities[0].longitude
                        ) {
                            vm.setQuerySingle(res.data.data.entities[0]);
                            vm.setVehicleList(res.data.data.entities);
                        } else {
                            vm.$notify({
                                message: "抱歉, 暂无该车的位置信息",
                                type: "warning"
                            });
                        }
                    }
                })
                .catch(err => {
                    if (err.response) {
                        vm.$notify({
                            message: err.response.data.msg,
                            type: "warning"
                        });
                    }
                });
        }
    }
};
</script>
<style lang="scss" scoped>
.query-tip {
    position: absolute;
    top: 73px;
    left: 20px;
    z-index: 999;
    width: 255px;
    background-color: #fff;
    padding: 20px 10px;
    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
    border-radius: 4px;
}
.title {
    font-size: 14px;
    position: relative;
    top: -10px;
}
</style>
