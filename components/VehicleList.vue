<template>
    <div class="car-list-box">
        <h3 class="title-row">
            我的货迹
            <!-- <el-tooltip class="tip-icon" placement="bottom" effect="light" :offset="10" :visible-arrow="false" popper-class="tooltip-popper">
                <div slot="content">
                    <ul class="tip-box">
                        <li>
                            <span class="error-status"></span>异常</li>
                        <li>
                            <span class="not-start-status"></span>未开始</li>
                        <li>
                            <span class="processing-status"></span>进行中</li>
                        <li>
                            <span class="gona-finish-status"></span>即将到达</li>
                    </ul>
                </div>
                <img src="../assets/tip.png" width="20" />
            </el-tooltip> -->
            <span class="trigger-btn" @click="handleClose('')">  
                <i class="el-icon-close"></i>
            </span> 
        </h3>
        <div class="car-list-main">
            <el-row v-for="(item, index) in carList"
                :key="index"
                type="flex"
                justify="space-between"
                align="middle"
                @mouseover.native="activeIndex = index"
                @mouseout.native="activeIndex = null"
                @click.native="handleMouseClick(item)"
                :class="{active: activeIndex === index}"
                :style="`background:${ activeIndex === index ? item.status.color : ''}`"
            >
                <el-col :span="18" class="info-box">
                    <dl>
                        <dd>
                            <img v-if="activeIndex === index" src="../assets/plateNum.png" />
                            <img v-else src="../assets/plateNum_active.png" />
                        </dd>
                        <dt>{{item.plate_num}}</dt>
                    </dl>
                    <dl>
                        <dd>
                            <img v-if="activeIndex === index" src="../assets/orderNum.png" alt="">
                            <img v-else src="../assets/orderNum_active.png" alt="">
                        </dd>
                        <dt>
                            <p
                                v-title:7="item.order_id"
                            >
                            </p>
                        </dt>
                    </dl>
                </el-col>
                <div  
                    class="status" 
                    v-show="activeIndex !== index" 
                >
                    <span class="status-color-text">{{item.status.status}}</span>
                    <span class="status-color-ball" :style="`background: ${item.status.color}`"></span>
                </div>
                <span
                    :style="{visibility: activeIndex === index ? 'inherit' : 'hidden'} "
                    class="trace-btn"
                    @click="showTrace(item.id, $event)"
                    title="路线"
                >
                    <img src="../assets/trace.png" alt="">
                </span>
                <span
                    :style="{visibility: activeIndex === index ? 'inherit' : 'hidden'} "
                    @click="showShareBox(index, $event)"
                    class="share-btn"
                    title="分享"
                >
                    <img src="../assets/share.png" />
                </span>
                <span
                    :style="{visibility: activeIndex === index ? 'inherit' : 'hidden'} "
                    class="blue-color-btn"
                    @click="showDelBox(index, $event)"
                    title="删除"
                >
                    <img src="../assets/delete.png" />
                </span>
            </el-row>
            <div  class="nothing" v-if="carList.length<=0">无跟踪订单</div>
        </div>
        <el-dialog 
            title="是否删除此订单" 
            :visible.sync="visible" 
            width="20%" 
            append-to-body
        >
            <div v-if="delData" class="del-dialog">
                <el-row>
                    <el-col :span="12">
                        <span class="diakey">车牌号:</span>&nbsp;&nbsp;
                        <span class="diavlu">{{delData.plate_num}}</span>
                    </el-col>
                    <el-col :span="12">
                        <span class="diakey">运单号:</span>&nbsp;&nbsp;
                        <span class="diavlu" v-title:7="delData.order_id"></span>
                    </el-col>
                </el-row>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button class="dialog-btn"  @click="visible = false; delData = null;">否</el-button>
                <el-button type="primary" @click="delCar">是</el-button>
            </span>
        </el-dialog>
        <vehicle-list-share-dialog
            :shareVisible="shareVisible"
            :shareInfo="shareInfo"
            @close="shareVisible = false"
        />
    </div>
</template>
<script>
import VehicleListShareDialog from "./VehicleListShareDialog";
import { mapState, mapMutations, mapActions } from "vuex";
import { type } from "@/store/module/vehicle";

/* 
    10:创建
    20:已激活
    25:即将到达 
    30:已结束 
    0:异常,
    1: 创建中
    31: 过期
*/
const filterCarList = list => {
    let arr = list.reduce((a, b) => {
        if (b.status === 30) {
            return a;
        }
        a.push({
            ...b,
            status: handleStatusColor(b.status)
        });
        return a;
    }, []);

    return arr.sort((a, b) => {
        return a.status - b.status > 0 ? 1 : 0;
    });
};

const ORDER_STATUS = {
    10: {
        color: "#c2c2c2",
        status: "创建中",
        progress: 0,
    },
    20: {
        color: "#45d898",
        status: "进行中",
        progress: 40,
    },
    25: {
        color: "#eb9941",
        status: "即将到达",
        progress: 80,
    },
    0: {
        color: "#F56C6C",
        status: "故障"
    },
    1: {
        color: "#c2c2c2",
        status: "创建中",
        progress: 0,
    }
};

const handleStatusColor = code => {
    return ORDER_STATUS[code];
};

export default {
    name: "carList",
    components: {
        VehicleListShareDialog
    },
    data() {
        return {
            visible: false,
            delData: null,
            shareVisible: false,
            shareInfo: null,
            requestLoad: false,
            carList: [],
            timeOut: null,
            activeIndex: null,
        };
    },
    beforeMount() {
        this.freshLoop();
    },
    filters: {
        defaultStr(val, str) {
            if (!val) return str;
            return val;
        }
    },
    computed: {
        ...mapState({
            activeComponent: state => state.Vehicle.activeComponent,
            activeCar: state => state.Vehicle.activeCar,
            polylineId: state => state.Vehicle.polyline.id,
        })
    },
    watch: {
        carList: {
            handler(val) {
                if (this.activeComponent === "VehicleList") {
                    this.activeAllView();
                    this.freshActive();
                    this.freshPolyLine();
                }
            },
            immediate: true
        }
    },
    methods: {
        ...mapMutations({
            $setActiveCar: type.SET_ACTIVECAR,
            handleClose: type.SET_ACTIVECOMPONENT,
            setVehicleList: type.SET_VEHICLELIST,
            $setPolyline: type.SET_POLYLINE,
            $setMapBounds: type.SET_MAPBOUNDS,
        }),
        freshLoop() {
            let vm = this;
            vm.timeFunc = () => {
                if (vm.activeComponent === "VehicleList") {
                    vm.freshVehicleList();
                    vm.timeOut = setTimeout(() => {
                        vm.timeFunc();
                    }, 10000);
                } else {
                    clearTimeout(vm.timeOut);
                    vm.timeFunc = null;
                    vm.timeOut = null;
                }
            }
            vm.timeFunc();
        },
        showDelBox(index, e) {
            e.stopPropagation();
            this.visible = true;
            this.delData = {...this.carList[index], index};
        },
        delCar() {
            let { id, index } = this.delData;
            this.$Api.delShipping(id).then(res => {
                if (res.status === 200 && res.data.status) {
                    this.$notify({
                        title: "删除成功",
                        type: "success"
                    });
                    this.freshVehicleList();
                }
            });
            this.delData = null;
            this.visible = false;
        },
        showShareBox(index, e) {
            e.stopPropagation();
            if (this.requestLoad) return;
            this.requestLoad = true;

            let vm = this;
            let shipping = vm.carList[index];
            vm.$Api
                .shareShipping(shipping.id)
                .then(res => {
                    if (res.data.status) {
                        this.shareInfo = {
                            ...res.data.data,
                            orderId: shipping.order_id,
                            plateNum: shipping.plate_num
                        };
                        this.requestLoad = false;
                        this.shareVisible = true;
                    }
                })
                .catch(err => {
                    this.requestLoad = false;
                    if (err.response) {
                        this.$notify({
                            title: "分享失败",
                            type: "warning",
                            message: err.response.data.msg
                        });
                    }
                });
        },
        freshVehicleList() {
            let vm = this;
            vm.$Api.getShipping().then(res => {
                if (res.data.status) {
                    vm.carList = filterCarList(res.data.data);
                    this.freshActive();
                }
            });
        },
        activeAllView() {
            let vm = this;
            vm.setVehicleList(vm.carList.reduce((a, b) => {
                if (b.latest_process) {
                    a.push({
                        ...b,
                        latitude: b.latest_process.latitude,
                        longitude: b.latest_process.longitude,
                    });
                }
                return a;
            }, []));
        },
        handleMouseClick(item) {
            let vm = this;
            if (!item.latest_process){
                vm.$notify({
                    title: "暂无位置信息",
                    type: "warning",
                    message: '暂无信息'
                });
                return
            } ;
            if (item.latest_process.latitude && item.latest_process.longitude)
            {
                vm.setActiveCar(item);
            }
        },
        // 刷新 activeCar
        freshActive() {
            if (!this.activeCar) return;
            let { id }  = this.activeCar;
            let latestActiveCar = this.carList.filter(a => a.id === id);
            if (latestActiveCar.length) {
                this.$setActiveCar(latestActiveCar[0]);
            } else {
                this.$nextTick(() => {
                   this.$setActiveCar(null);
                })
            }
        },
        // 刷新轨迹
        freshPolyLine() {
            let vm = this;
            // if (vm.activeCar) {
            //     let { id } = vm.activeCar;
            //     if (vm.polylineId === id) {
            //         vm.setPolyline({
            //             data: [],
            //             id: ""
            //         })
            //     }
            //     return;
            // }
            if (!vm.polylineId) return;
            vm.$Api
                .getTraceRecord(vm.polylineId)
                .then(res => {
                    if (res.data.data.length > 0) {
                        vm.$setPolyline({
                            data: res.data.data,
                            id: vm.polylineId
                        });
                    }
                })
                .catch(err => console.log(err))
        },
        showTrace(id, e) {
            e.stopPropagation();
            let vm = this;
            if (vm.requestLoad) return;
            vm.requestLoad = true;
            vm.$Api
                .getTraceRecord(id)
                .then(res => {
                    if (res.data.data.length > 0) {
                        vm.setPolyline(res.data.data, id);
                    } else {
                        vm.$notify({
                            title: "抱歉，暂无数据 请稍后再试",
                            type: "warning",
                        });
                    }
                    vm.requestLoad = false;
                })
                .catch(err => {
                    vm.requestLoad = false;
                    if (err.response) {
                        vm.$notify({
                            title: "暂无位置信息",
                            type: "warning",
                            message: err.response.data.msg
                        });
                    }
                });
        },
        setPolyline(data, id) {
            let vm = this;
            vm.$setPolyline({
                data,
                id,
            });
            vm.$setMapBounds("polyline");
        },
        setActiveCar(data) {
            let vm = this;
            vm.$setActiveCar(data);
            vm.$setMapBounds("activeCar");
        }
    }
};
</script>
<style scoped>
.nothing {
    background: #eee;
    color: #abaeb3;
    text-align: center;
    min-height: 600px;
    font-size: 12px;
}
.title-row {
    line-height: 43px;
    height: 43px;
    font-size: 14px;
    font-weight: 500;
    text-align: center;
    position: relative;
    color: #333333;
}
.tracking {
    line-height: 56px;
}
.diakey {
    color: #999;
    margin-right: 5px;
    font-size: 11px;
}
.car-list-box {
    background-color: #fff;
    background-image: linear-gradient(
        to bottom,
        #f4f3f3 43px,
        #fff 6%,
        #fff 100%
    );
    border-radius: 4px;
    font-size: 12px;
    position: absolute;
    top: 30px;
    left: 20px;
    z-index: 1000;
    min-width: 255px;
    height: calc(100% - 150px);
    color: #333333;
    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
}
.car-list-main {
    height: calc(100% - 43px);
    overflow-y: scroll;
}
.car-list-main::-webkit-scrollbar { 
    width: 5px;
}
.car-list-main::-webkit-scrollbar-track {
    background: #e6e6e6;
}
.car-list-main::-webkit-scrollbar-thumb {
    border-radius: 8px;
    background-color: #999;
}
.blue-color {
    color: #409eff;
}
.blue-color-btn {
    color: #409eff;
    cursor: pointer;
    margin-right: 7px;
}
.circle-num {
    background-color: #409eff;
    display: inline-block;
    border-radius: 100%;
    color: #fff;
    padding: 5px;
    font-size: 15px;
}
.info-box {
    position: relative;
    left: 8px;
    bottom: -2px;
}
.info-box dl {
    font-weight: 700;
    color: #000;
    display: flex;
    align-items: center;
}
.info-box dl:nth-child(2) {
    margin-top: 7px;
    font-weight: normal;
}
.info-box dd {
    color: #999;
    margin-right: 16px;
}
.info-box dd:after {
    content: "";
    width: 1px;
    height: 14px;
    display: inline-block;
    background-color: #eee;
    position: relative;
    left: 8px;
    top: -3px;
}
.info-box dt {
    height: 21px;
    line-height: 21px;
}
.car-list-box >>> .el-row {
    padding: 0px 5px 0px 0px;
    border-bottom: 1px solid #eee;
    transition: background 0.8s;
    cursor: pointer;
    height: 70px;
}
.status-bar {
    padding: 0;
    height: 70px;
    background-color: #e6e6e6;
}
.tip-icon {
    position: absolute;
    right: 10px;
    top: 1px;
    height: 19px;
    width: 19px;
}
.tip-box {
    list-style: none;
    margin: 0;
    padding: 0;
    font-size: 11px;
}
.tip-box li {
    display: flex;
    align-items: center;
    margin: 10px 0;
}
.not-start-status,
.processing-status,
.gona-finish-status,
.creating-status,
.error-status {
    display: inline-block;
    width: 10px;
    height: 14px;
    margin-right: 10px;
    font-size: 12px;
    color: #333333;
}
.not-start-status {
    background-color: #c2c2c2;
}
.processing-status {
    background-color: #45d898;
}
.gona-finish-status {
    background-color: #eb9941;
}
.error-status {
    background-color: #f56c6c;
}
.creating-status {
    background-color: #b3ceee;
}
.tooltip-popper {
    border: none;
}
.del-dialog >>> .el-row {
    background-color: transparent;
    border: none;
    font-size: 11px;
}
.car-list-box > .active {
    background-color: #45d898;
}
.car-list-box > .active dl {
    color: #fff;
}
.active dd {
    color: #fff;
}
.dialog-footer {
    display: flex;
    justify-content: space-between;
    width: 200px;
    margin: 0 auto;
}
.diavlu {
    font-weight: 600;
}
.formatted-address {
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    padding: 0;
    margin: 0;
    width: 120px;
}
.share-btn {
    padding: 20px;
}
.trace-btn {
    padding: 20px 0px 20px 20px;
}
.trigger-btn {
    position: absolute;
    right: 10px;
    top: 1px;
    font-size: 21px;
    cursor: pointer;
}
.status-color-ball {
    display: inline-block;
    width: 8px;
    height: 8px;
    margin-left: 5px;
    border-radius: 100%;
}
.status-color-text {
    font-size: 12px;
    color: #999;
}
.status {
    position: absolute;
    right: 10px;
}
</style>

