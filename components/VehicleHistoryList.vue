<template>
    <div class="history-list">
        <h3 class="history-list-title">
            定位记录
        </h3>
        <div class="history-input">
            <input 
                type="text" 
                placeholder="请输入车牌查询"
                v-model="VehicleInput"
            >
        </div>
        <!-- <div class="history-list-body"> 
            <div class="date-tag">
                <span>今天</span>
            </div> -->
            <!-- <div 
                class="history-item" 
                v-for="(car, i) in historyList.today"
                :style="`border-bottom:${i === (historyList.today.length - 1) ? 'none' : '1px solid #cbcbcb'}`"
                :key="i"
            >
                <p class="history-item-vehicle">
                    <span >
                        {{car.entities[0].plate_num}}
                    </span>
                    <span>
                        <i class="el-icon-close"></i>
                    </span>
                </p>
                <dd>
                    <dl>
                        {{car.entities[0].created_at}}
                    </dl>
                    <dl>
                        {{car.province}}-{{car.district}}
                    </dl>
                    <dl class="gray-color">
                        {{car.street}}
                    </dl>
                </dd>
                <div 
                    class="locate-btn"
                    @click="locateLatLng(car.entities[0])"
                >
                    <img src="../assets/locate.png" alt="">
                    定位
                </div>
            </div>
        </div>       
        <div class="history-list-body"> 
            <div class="date-tag">
                <span>昨天</span>
            </div>
            <div 
                class="history-item" 
                :style="`border-bottom:${i === (historyList.yesterday.length - 1) ? 'none' : '1px solid #cbcbcb'}`"
                v-for="(car, i) in historyList.yesterday"
                :key="i"
            >
                <p class="history-item-vehicle">
                    <span >
                        {{car.entities[0].plate_num}}
                    </span>
                    <span>
                        <i class="el-icon-close"></i>
                    </span>
                </p>
                <dd>
                    <dl>
                        {{car.entities[0].created_at}}
                    </dl>
                    <dl>
                        {{car.province}}-{{car.district}}
                    </dl>
                    <dl class="gray-color">
                        {{car.street}}
                    </dl>
                </dd>
                <div 
                    class="locate-btn"
                    @click="locateLatLng(car.entities[0])"
                >
                    <img src="../assets/locate.png" alt="">
                    定位
                </div>
            </div> -->
            <div class="history-list-main">
                <div 
                    class="history-list-body"
                    v-for="(carList, date) in HistoryList"
                    :key="date"
                > 
                <div  v-if="carList.length > 0" class="date-tag">
                    <span>{{date}}</span>
                </div> 
                <div 
                    class="history-item" 
                    v-for="(car, i) in carList"
                    :key="i"
                >
                    <p class="history-item-vehicle">
                        <span >
                            {{car.entities[0].plate_num}}
                        </span>
                        <span @click="deleteQueryRecord(date, i, car)">
                            <i class="el-icon-close"></i>
                        </span>
                    </p>
                    <dd>
                        <dl style="marginBottom:4px;">
                            {{car.entities[0].updated_at}}
                        </dl>
                        <dl>
                            {{car.province}}-{{car.district}}
                        </dl>
                        <dl 
                            class="gray-color"
                            v-title:12="car.street"
                        >
                        </dl>
                    </dd>
                    <div 
                        class="locate-btn"
                        :class="`${activeIndex === date+i ? 'active' : ''}`"
                        @click="locateLatLng(car.entities[0], i, date)"
                        v-if="car.entities[0].latitude && car.entities[0].longitude"
                    >
                        <img src="../assets/locate.png" alt="">
                        定位
                    </div>
                    <div
                        class="no-locate-btn"
                        v-else
                    >
                        暂无信息
                    </div>
                </div>
            </div>
        </div>       
    </div>
</template>
<script>
import { mapMutations } from "vuex";
import { type } from "@/store/module/vehicle";
import moment from "moment";
export default {
    data() {
        return {
            historyList: {},
            activeIndex: null,
            VehicleInput: "",
            filterHandler: null
        };
    },
    created() {
        this.showHistoryList();
    },
    watch: {
        VehicleInput(val) {
            this.denfineFilter(val);
        }
    },
    computed: {
        HistoryList() {
            if (this.filterHandler) {
                return this.filterHandler(this.historyList);
            }
            return this.historyList;
        }
    },
    methods: {
        ...mapMutations({
            setQuerySingle: type.SET_SINGLEQUERY,
            $setActivecar: type.SET_ACTIVECAR,
            $setMapBounds: type.SET_MAPBOUNDS,
            setQueryVehicleList: type.SET_VEHICLELIST
        }),
        denfineFilter(val) {
            let vm = this;
            if (val === "") {
                vm.filterHandler = null;
                return;
            }
            vm.filterHandler = list => {
                let obj = Object.create(null);
                for (let k in list) {
                    obj[k] = list[k].filter(a => {
                        return a.entities[0].plate_num.includes(
                            val.toUpperCase()
                        );
                    });
                }
                return obj;
            };
        },
        showHistoryList() {
            let vm = this;
            vm.$Api.getSingleTraceList().then(res => {
                if (res.data.status) {
                    vm.filterHistoryList(res.data.data.list);
                }
            });
        },
        filterHistoryList(arr) {
            let datelist = {};
            arr.forEach(a => {
                let updated_at = moment(a.updated_at).format("YYYY-MM-DD");
                if (!datelist[updated_at]) {
                    datelist[updated_at] = [];
                }
                datelist[updated_at].push(a);
            });

            this.historyList = datelist;
            for (let k in this.historyList) {
                this.historyList[k].forEach((val, i) =>
                    this.geoCode(val, i, k)
                );
            }
        },
        async geoCode(params, i, key) {
            let vm = this;
            let car = params.entities[0];
            if (!car.latitude || !car.longitude) {
                vm.$set(vm.historyList[key], i, {
                    ...params,
                    province: "暂无",
                    district: "暂无",
                    street: "暂无",
                    address: "暂无"
                });
                return;
            }
            try {
                let res = await vm.$DB.Get(`${car.latitude}, ${car.longitude}`);
                if (!res) {
                    let { data } = await vm.$Api.geoCode(
                        car.longitude,
                        car.latitude
                    );
                    let {
                        province,
                        district
                    } = data.regeocode.addressComponent;
                    let street = data.regeocode.formatted_address.split(
                        district
                    )[1];

                    let address = data.regeocode.formatted_address;

                    vm.$DB.Add({
                        latlng: `${car.latitude}, ${car.longitude}`,
                        province,
                        district,
                        street,
                        address
                    });

                    vm.$set(vm.historyList[key], i, {
                        ...params,
                        province,
                        district,
                        street,
                        address
                    });
                } else {
                    let { province, district, street, address } = res;
                    vm.$set(vm.historyList[key], i, {
                        ...params,
                        province,
                        district,
                        street,
                        address
                    });
                }
            } catch (err) {
                console.log(err);
            }
        },
        locateLatLng(item, index, key) {
            let vm = this;
            vm.$Api.updateSingleTrace(item.sub_trace_id).then(res => {
                if (res.data.status) {
                    let data = res.data.data;
                    if (
                        data.entities[0].latitude &&
                        data.entities[0].longitude
                    ) {
                        vm.setQueryVehicleList([data.entities[0]]);
                        vm.setActivecar(data.entities[0]);
                        vm.activeIndex = key + index;
                    }else{
                        vm.$notify({
                            message: '暂无坐标',
                            type: "warning"
                        });
                    }
                }
            });
        },
        setActivecar(data) {
            let vm = this;
            vm.$setActivecar(data);
            vm.$setMapBounds("activeCar");
        },
        deleteQueryRecord(key, index, item) {
            let vm = this;
            vm.$Api
                .deleteSingleTrace(item.id)
                .then(res => {
                    if (res.data === "success") {
                        if (vm.historyList[key].length === 1) {
                            vm.$delete(vm.historyList, key);
                        } else {
                            vm.$delete(vm.historyList[key], index);
                        }
                        vm.stillActive(key + index);
                    }
                })
                .catch(err => {
                    if (err.response && err.response.data.msg) {
                        vm.$notify({
                            message: err.response.data.msg,
                            type: "warning"
                        });
                    }
                });
        },
        stillActive(index) {
            let vm = this;
            if (vm.activeIndex === index) {
                vm.setQueryVehicleList([]);
                vm.setActivecar();
            }
        }
    }
};
</script>
<style lang="scss" scoped>
.history-list {
    position: absolute;
    top: 86px;
    left: 20px;
    z-index: 1000;
    width: 255px;
    background-color: #fff;
    padding: 10px;
    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
    border-radius: 4px;
    height: calc(100% - 200px);
}
.history-list-title {
    font-weight: 500;
    font-size: 14px;
    margin-bottom: 15px;
}
.history-input {
    & > input {
        border: none;
        outline: none;
        background-color: #eee;
        height: 40px;
        line-height: 40px;
        width: 100%;
        padding-left: 10px;
        &::placeholder {
            color: #999;
        }
    }
}
.history-list-main {
    height: calc(100% - 100px);
    overflow-y: scroll;
    margin-top: 20px;
    padding-right: 10px;
    & > div.history-list-body:first-of-type {
        margin-top: 0px;
    }
}
.history-list-main::-webkit-scrollbar { 
    width: 5px;
}
.history-list-main::-webkit-scrollbar-track {
    background: #e6e6e6;
}
.history-list-main::-webkit-scrollbar-thumb {
    border-radius: 8px;
    background-color: #999;
}
.history-list-body {
    margin-top: 20px;
    font-size: 12px;
    .date-tag {
        height: 18px;
        line-height: 18px;
        & > span {
            background-color: #eee;
            position: relative;
            left: -10px;
            color: #999;
            font-size: 11px;
            padding: 4px 10px;
            line-height: 18px;
            border-radius: 0 10px 10px 0px;
        }
    }
    & > div.history-item:not(:last-child) {
        border-bottom: 1px solid #efefef;
    }
}
.history-item {
    position: relative;
    padding-bottom: 10px;
    margin-top: 10px;
    & > p.history-item-vehicle {
        display: flex;
        justify-content: space-between;
        font-size: 13px;
        font-weight: 700;
        margin-bottom: 4px;
        & > span:nth-child(2) {
            cursor: pointer;
        }
    }
}
.gray-color {
    color: #999;
}
.locate-btn {
    position: absolute;
    bottom: 10px;
    right: 0px;
    padding: 3px 7px;
    display: flex;
    align-items: center;
    color: #fff;
    background-color: #cbcbcb;
    border-radius: 12px;
    cursor: pointer;
    transition: background 0.8s;
}
.no-locate-btn {
    position: absolute;
    bottom: 10px;
    right: 0px;
    padding: 3px 7px;
    display: flex;
    align-items: center;
    color: #999;
    cursor: pointer;
    transition: background 0.8s;
}
.history-item .active {
    background-image: linear-gradient(to right, #2760ec, #388df5);
}
</style>
