<template>
    <div class="static-bar">
        <div class="static-bar-input">
            <span 
                class="static-bar-btn history-btn" 
                @click="toggleComponent('HistoryList')"
                :style="`background: ${activeComponent === 'HistoryList' ? '#3d93fb' : ''}`"
            >
                <img v-show="activeComponent !== 'HistoryList'" src="../assets/historylist.png" />
                <img v-show="activeComponent === 'HistoryList'" src="../assets/historylist_active.png" />
            </span> 
            <input 
                type="text" 
                placeholder="请输入货车车牌号" 
                v-model="plateNum"
                class="vehicle-input"
                maxlength="8"
                @focus="toggleComponent('QueryTip')"
                @blur="handleInputBlur"
                @keyup.enter="generateSingleTrace"
            >
            <i 
                v-if="plateNum.length" 
                class="el-icon-error vehicle-input-close"
                @click="handleInputClear"
            ></i>
            <span class="static-bar-btn search-btn" @click="generateSingleTrace">
                <img class="query" src="../assets/query.png" alt="">
                <img  class="query-active" src="../assets/query_active.png" alt="">
            </span>
        </div>
        <nav class="static-bar-tab">
            <li class="static-bar-tab-item" 
                :class="activeComponent === 'VehicleForm' ? 'active' : ''"
                @click="permissions('VehicleForm')">
                <img v-show="activeComponent !== 'VehicleForm'" src="../assets/add.png" />
                <img v-show="activeComponent === 'VehicleForm'" src="../assets/add_active.png" />
                <span>添加</span>
            </li>
            <li class="split-line"></li>
            <li class="static-bar-tab-item" 
                :class="activeComponent === 'VehicleList' ? 'active' : ''"
                @click="permissions('VehicleList')">
                <img v-show="activeComponent !== 'VehicleList'" src="../assets/mytrace.png" alt="">
                <img v-show="activeComponent === 'VehicleList'" src="../assets/mytrace_active.png" alt="">
                <span>我的货迹</span>
            </li>
            <li class="split-line"></li>
            <li 
                class="static-bar-tab-item"
                :class="activeComponent === 'MutiplieQuery' ? 'active' : ''"
                @click="toggleComponent('MutiplieQuery')"
            >
            <img  v-show="activeComponent !== 'MutiplieQuery'" src="../assets/mutilquery.png" alt="">
            <img  v-show="activeComponent === 'MutiplieQuery'" src="../assets/mutilquery_active.png" alt="">
                <span>多车查询</span>
            </li>
        </nav>
        <el-dialog
            title="提示"
            :visible.sync="dialogVisible"
            width="35%">
            <span class="text">我的货迹及添加功能目前只对企业用户开放。如需查询，请认证企业。</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="goToCertification">去认证</el-button>
            </span>
        </el-dialog>
    </div>   
</template>
<script>
import { mapMutations, mapState, mapActions } from "vuex";
import { type } from "@/store/module/vehicle";
export default {
    data() {
        return {
            plateNum: "",
            dialogVisible:false
        };
    },
    computed: {
        ...mapState({
            activeComponent: state => state.Vehicle.activeComponent,
            singleQuery: state => state.Vehicle.singleQuery,
            userInfo: state => state.User.userInfo
        })
    },
    watch: {
        singleQuery: {
            handler(val) {
                if (val) {
                    this.plateNum = val.plate_num;
                } else {
                    this.plateNum = "";
                }
            }
            // immediate: true
        },
        activeComponent(val, oldVal) {
            if (val === "" && oldVal === "QueryTip") return;
            this.setVehicleList([]);
            this.setActiveCar(null);
            this.setPolyLine({
                data: [],
                id: ""
            });
            this.setSingleQuery(null);
        }
    },
    methods: {
        ...mapMutations({
            setVehicleList: type.SET_VEHICLELIST,
            toggleComponent: type.SET_ACTIVECOMPONENT,
            setPolyLine: type.SET_POLYLINE,
            setActiveCar: type.SET_ACTIVECAR,
            setSingleQuery: type.SET_SINGLEQUERY
        }),
        generateSingleTrace() {
            let vm = this;
            let reg = /^([\u4e00-\u9fa5][a-zA-Z](([DF](?![a-zA-Z0-9]*[IO])[0-9]{4,5})|([0-9]{5}[DF])))|([冀豫云辽黑湘皖鲁苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼渝京津沪新京军空海北沈兰济南广成使领A-Z]{1}[a-zA-Z0-9]{5,6}[a-zA-Z0-9挂学警港澳]{1})$/;

            if (!reg.test(vm.plateNum)) {
                vm.$message({
                    message: "请输入正确的车牌号",
                    type: "warning"
                });
                return;
            }
            vm.$Api
                .generateSingleTrace(vm.plateNum)
                .then(res => {
                    if (res.data.status) {
                        if (
                            res.data.data.entities[0].latitude &&
                            res.data.data.entities[0].longitude
                        ) {
                            vm.setSingleQuery(res.data.data.entities[0]);
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
        },
        handleInputBlur() {
            setTimeout(() => {
                if (this.activeComponent === "QueryTip") {
                    this.toggleComponent("");
                }
            }, 300);
        },
        handleInputClear() {
            this.plateNum = "";
            this.setSingleQuery(null);
        },
        permissions(str){
            if(this.userInfo.is_enterprise){
                this.toggleComponent(str);
            }else{
                this.dialogVisible=true;
            }
            
        },
        goToCertification(){
            this.$router.push("/certificat");
        }
    }
};
</script>
<style lang="scss" scoped>
.static-bar {
    position: absolute;
    top: 30px;
    left: 20px;
    z-index: 1000;
}
.static-bar-input {
    background-color: #fff;
    border-radius: 4px;
    box-shadow: 0 5px 4px rgba(0, 0, 0, 0.2);
    width: 255px;
    height: 44px;
    display: flex;
    overflow: hidden;
    input {
        border: none;
        outline: none;
        height: 44px;
        font-size: 14px;
        width: 155px;
        line-height: 44px;
        padding-left: 15px;
        margin-right: 10px;
        &::placeholder {
            color: #ccc;
        }
    }
}
.history-btn {
    background-color: #f3f3f3;
}
.static-bar-btn {
    display: inline-block;
    cursor: pointer;
    width: 44px;
    height: 44px;
    font-size: 20px;
    line-height: 45px;
    text-align: center;
    img {
        position: relative;
        top: 3px;
    }
}
.static-bar-tab {
    position: absolute;
    top: 0;
    left: 272px;
    width: 296px;
    padding: 12px 10px;
    border-radius: 4px;
    box-shadow: 0 5px 4px rgba(0, 0, 0, 0.2);
    list-style: none;
    display: flex;
    justify-content: space-between;
    font-size: 14px;
    background-color: #fff;
    .split-line {
        width: 1px;
        height: 20px;
        margin: 0px 10px;
        background-color: #999;
    }
    li.active {
        color: #4c84ff;
    }
}
.static-bar-tab-item {
    cursor: pointer;
    display: flex;
    align-items: center;
    span {
        margin-left: 6px;
        position: relative;
        top: -1px;
    }
}
.query-active {
    display: none;
}
.search-btn {
    position: relative;

    .query,
    .query-active {
        position: absolute;
        top: 12px;
        left: 10px;
    }
}
.search-btn:hover {
    .query {
        display: none;
    }
    .query-active {
        display: block;
    }
}
.vehicle-input-close {
    position: absolute;
    top: 17px;
    right: 46px;
    font-size: 10px;
    color: #ccc;
    cursor: pointer;
}
.text{
    font-size: 12px;
}
</style>

