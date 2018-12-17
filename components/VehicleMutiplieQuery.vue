<template>
    <div class="mutiplie-query-box">
        <p class="title-row">
            多车查询
            <span class="trigger-btn" @click="handleClose('')">  
                <i class="el-icon-close"></i>
            </span>
        </p>
        <div class="mutiplie-query-main">
            <div class="mutiplie-query-input">
                <input
                    type="text"
                    placeholder="请输入车牌添加"
                    v-model="plateNum"
                    @keyup.enter="addMulti(plateNum)"
                >
                <span
                    style="cursor:pointer"
                    @click="addMulti(plateNum)"
                >
                    <i class="el-icon-plus"></i>
                </span>
            </div>
            <div class="query-tip">
                <p>搜索记录</p>
                <vehicle-query-tag
                    ref="tag"
                    @handle-click="addMulti"
                />
            </div>
            <div class="query-tag">
                <p>已添加车辆</p>
                <ul class="query-tag-container">
                    <li
                        class="query-tag-item"
                        v-for="(vehicle) in multiVehicle"
                        :key="vehicle.id"
                    >
                        {{vehicle.plate_num | formatVehicleNum}}
                        <span
                            class="query-tag-close"
                            @click="decreMulti(vehicle.plate_num)"
                        >
                            <i class="el-icon-close"></i>
                        </span>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>
<script>
import { mapState, mapMutations, mapActions } from "vuex";
import VehicleQueryTag from "./VehicleQueryTag";
import { type } from "@/store/module/vehicle";
export default {
    data() {
        return {
            multiVehicle: [],
            plateNum: null,
            timeOut: null
        };
    },
    beforeMount() {
        this.freshLoop();
    },
    computed: {
        ...mapState({
            queryTags: state => state.Vehicle.queryTags,
            activeComponent: state => state.Vehicle.activeComponent
        })
    },
    components: {
        VehicleQueryTag
    },
    watch: {
        multiVehicle(val) {
            this.activeMulti();
        }
    },
    filters: {
        formatVehicleNum(str) {
            return str.slice(0, 2) + " " + str.slice(2);
        }
    },
    methods: {
        ...mapMutations({
            handleClose: type.SET_ACTIVECOMPONENT,
            setVehicleList: type.SET_VEHICLELIST,
            $setMapBounds: type.SET_MAPBOUNDS
        }),
        ...mapActions(["mapFitView"]),
        getMultiplieTrace() {
            let vm = this;
            vm.$Api.getMultiTrace().then(res => {
                if (res.data.status && res.data.data) {
                    vm.multiVehicle = res.data.data.entities;
                }
            });
        },
        freshLoop() {
            let vm = this;
            vm.timeFunc = () => {
                if (vm.activeComponent === "MutiplieQuery") {
                    vm.getMultiplieTrace();
                    vm.timeOut = setTimeout(() => {
                        vm.timeFunc();
                    }, 10000);
                } else {
                    clearTimeout(vm.timeOut);
                    vm.timeFunc = null;
                    vm.timeOut = null;
                }
            };
            vm.timeFunc();
        },
        addMulti(plateNum) {
            let vm = this;
            let reg = /^([\u4e00-\u9fa5][a-zA-Z](([DF](?![a-zA-Z0-9]*[IO])[0-9]{4,5})|([0-9]{5}[DF])))|([冀豫云辽黑湘皖鲁苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼渝京津沪新京军空海北沈兰济南广成使领A-Z]{1}[a-zA-Z0-9]{5,6}[a-zA-Z0-9挂学警港澳]{1})$/;
            let _plateNum = plateNum || vm.plateNum;
            if (!reg.test(_plateNum)) {
                vm.$message({
                    message: "请输入正确的车牌号",
                    type: "warning"
                });
                return;
            }
            let plateNumArray = vm.multiVehicle.reduce(
                (a, b) => {
                    a.push(b.plate_num);
                    return a;
                },
                [_plateNum]
            );

            vm.createMulti(plateNumArray);
        },
        decreMulti(plateNum) {
            let vm = this;
            let plateNumArray = vm.multiVehicle.reduce((a, b) => {
                b.plate_num !== plateNum && a.push(b.plate_num);
                return a;
            }, []);
            vm.createMulti(plateNumArray);
        },
        createMulti(plateNumArray) {
            let vm = this;
            vm.$Api
                .createMultiTrace(plateNumArray)
                .then(res => {
                    if (res.data.status) {
                        vm.multiVehicle = vm.checkTrace(res.data.data.entities);
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
        },
        checkTrace(data) {
            let vm = this;
            if (!vm.plateNum) {
                return data;
            }

            let newVehicle = data.find(a => a.plate_num === vm.plateNum);
            if (newVehicle && newVehicle.latitude && newVehicle.longitude) {
                vm.plateNum = "";
                return data;
            } else {
                let plateNum = vm.plateNum;
                vm.$notify({
                    title: vm.plateNum,
                    message: `暂无位置信息`,
                    type: "warning"
                });
                vm.plateNum = "";
                return data.filter(a => a.plate_num !== plateNum);
            }
        },
        activeMulti() {
            this.setVehicleList(this.multiVehicle);
            this.$setMapBounds("vehicleList");
        }
    }
};
</script>
<style lang="scss" scoped>
.mutiplie-query-box {
    position: absolute;
    top: 30px;
    left: 20px;
    z-index: 1000;
    font-size: 14px;
    width: 255px;
    min-height: 500px;
    border-radius: 4px;
    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
    background-image: linear-gradient(
        to bottom,
        #f4f3f3 43px,
        #fff 8%,
        #fff 100%
    );
}
.title-row {
    line-height: 43px;
    height: 43px;
    text-align: center;
    font-size: 14px;
    margin-bottom: 10px;
    position: relative;
    color: #333333;
}
.trigger-btn {
    position: absolute;
    right: 10px;
    top: 1px;
    font-size: 21px;
    cursor: pointer;
}
.mutiplie-query-main {
    margin: 30px 0 10px 0;
    padding: 0 10px;
}
.mutiplie-query-input {
    display: flex;
    & > input {
        background-color: #eee;
        border: none;
        outline: none;
        height: 40px;
        line-height: 40px;
        padding-left: 8px;
        width: calc(100% - 30px);
        &::placeholder {
            color: #999;
        }
    }
    & > span {
        width: 40px;
        height: 40px;
        display: inline-block;
        line-height: 40px;
        text-align: center;
        background-color: #e2e2e2;
    }
}
.query-tip,
.query-tag {
    padding: 15px 0px;
    border-bottom: 1px solid #eee;
}
.query-tag {
    border: none;
}
.query-tip-container,
.query-tag-container {
    padding: 0;
    overflow: hidden;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
}
.query-tag-container {
    & > li.query-tag-item {
        list-style: none;
        padding: 3px 0px;
        margin: 5px 2px;
        border-radius: 4px;
        font-size: 12px;
        color: #fff;
        background-color: #4c84ff;
        width: 111px;
        position: relative;
        text-indent: 6px;
    }
    .query-tag-close:before {
        content: "";
        display: inline-block;
        height: 10px;
        position: absolute;
        left: 0px;
        top: 1px;
        background-color: #fff;
        width: 1px;
    }
    .query-tag-close {
        cursor: pointer;
        position: absolute;
        right: 7px;
        top: 7px;
        display: flex;
        align-content: center;
    }
}
.query-tip-item {
    list-style: none;
    padding: 3px 5px;
    margin: 5px 2px;
    border-radius: 4px;
    font-size: 12px;
    cursor: pointer;
    background-color: #eee;
    transition: all 0.3s;
}
</style>
