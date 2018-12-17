<template>
    <div class="window-info">
        <!-- <span class="el-icon-close close-button" @click="$emit('close')">
        </span> -->
        <el-row>
            <el-col class="border-bottom plate-num">
                <span class="bold">{{car.plate_num}}</span>
                <span
                    class="bold formatted-address order-id"
                    v-title:26="car.order_id"
                ></span>
            </el-col>
        </el-row>
        <!-- <el-row>
            <el-col :span="16"  class="border-bottom  pad">
                <el-row >
                    <el-col>
                        {{car.latest_process.sampled_at}}
                    </el-col>
                    <el-col>
                        <p
                            class="formatted-address"
                            v-title:23="address"
                        ></p>
                    </el-col>
                </el-row>
            </el-col>
            <el-col :span="8" class="border-bottom pad border-left">
                <el-row>
                    <el-col>
                        <span class="gray-font">预计到达时间</span>
                    </el-col>
                    <el-col>
                        <span> {{car.latest_process.remaining_time | expectDate}}</span>
                    </el-col>
                </el-row>
            </el-col>
        </el-row> -->
        <el-row>
            <el-col :span="14" class="pad border-bottom">
                <el-row  class="spacing">
                    <el-col>
                    <img class="imgIcon" src="../assets/startpoint.png" width="10" alt="">
                    <span v-title:10="car.origin"></span>
                    </el-col>
                </el-row>
                <el-row class="spacing">
                    <el-col>
                    <img  class="imgIcon" src="../assets/endpoint.png" width="10" alt="">
                    <span v-title:10="car.destination"></span>
                    </el-col>
                </el-row>
            </el-col>
            <el-col :span="10" class="pad border-bottom border-left">
                <el-row class="spacing">
                    <el-col>
                    <span class="gray-font">计划时间</span>
                    </el-col>
                </el-row>
                <el-row class="spacing">
                    <el-col>
                        <span >
                           {{car.plan.end_at}}
                        </span>
                    </el-col>
                </el-row>
            </el-col>
        </el-row>
        <el-row>
            <el-col class="span-margin">
                <p
                    class="formatted-address"
                    v-title:23="address"
                ></p>
            </el-col>
            <el-col class="span-margin">
                <el-progress 
                    :percentage="car.status.progress" 
                    :show-text="false"    
                    style="height: 10px"
                />
            </el-col>
            <el-col class="span-margin ">
                <div class="remain-status">
                    <span>
                        预计到达: {{car.latest_process.remaining_time | expectDate}}
                    </span>
                    <span>
                        剩余: {{car.latest_process.remaining_distance | meterToKM}}公里
                    </span>
                </div>
            </el-col>
        </el-row>
        <el-row >
            <el-col class="pad mark-row" style="padding-top: 0;">
                备注:
                <span 
                    class="gray-font" 
                    v-title:30="car.remark"
                >
                </span>
            </el-col>
        </el-row> 
        <div  class="trangle"></div>
    </div>    
</template>
<script>
import moment from "moment";
export default {
    name: "windowInfo",
    data() {
        return {
            address: "暂无"
        };
    },
    props: {
        car: {
            type: Object
        }
    },
    watch: {
        car: {
            handler(val) {
                if (
                    val.latest_process.latitude &&
                    val.latest_process.longitude
                ) {
                    this.handleWindowInfo(val.latest_process);
                }
            },
            immediate: true
        }
    },
    filters: {
        defaultStr(val, str) {
            return val ? val : str;
        },
        meterToKM(val) {
            return (val / 1000).toFixed(2);
        },
        formatSec: function(s) {
            var t;
            if (s > -1) {
                var hour = Math.floor(s / 3600);
                var min = Math.floor(s / 60) % 60;
                var sec = s % 60;
                if (hour < 10) {
                    t = "0" + hour + ":";
                } else {
                    t = hour + ":";
                }

                if (min < 10) {
                    t += "0";
                }
                t += min + ":";
                if (sec < 10) {
                    t += "0";
                }
                t += sec.toFixed(0);
            }
            return t;
        },
        expectDate: function(s) {
            var myDate = new Date();
            var formatTimeS = myDate.getTime() + s * 1000;
            var time = new Date(formatTimeS);

            var seperator1 = "-";
            var seperator2 = ":";
            var month = time.getMonth() + 1;
            var strDate = time.getDate();
            if (month >= 1 && month <= 9) {
                month = "0" + month;
            }
            if (strDate >= 0 && strDate <= 9) {
                strDate = "0" + strDate;
            }
            var currentdate =
                time.getFullYear() +
                seperator1 +
                month +
                seperator1 +
                strDate +
                " " +
                (time.getHours() > 10
                    ? time.getHours()
                    : "0" + time.getHours()) +
                seperator2 +
                (time.getMinutes() > 10
                    ? time.getMinutes()
                    : "0" + time.getMinutes()) +
                seperator2 +
                (time.getSeconds() > 10
                    ? time.getSeconds()
                    : "0" + time.getSeconds());
            return currentdate;
        }
    },
    computed: {
        // progress() {
            // let activeTime = moment(this.car.will_active_at);
            // let totalTime = moment()
            //     .add(this.car.latest_process.remaining_time, "seconds")
            //     .diff(activeTime);
            
            // let sampledTime = moment(this.car.latest_process.sampled_at).diff(
            //     activeTime
            // );
            // let propor = sampledTime / totalTime;
            // return propor > 0 ? propor : 0;
        // }
    },
    methods: {
        async handleWindowInfo(car) {
            let vm = this;
            try {
                let res = await vm.$DB.Get(`${car.latitude}, ${car.longitude}`);
                if (!res) {
                    let { data } = await vm.$Api.geoCode(
                        car.longitude,
                        car.latitude
                    );
                    let address = data.regeocode.formatted_address;

                    vm.$DB.Add({
                        latlng: `${car.latitude}, ${car.longitude}`,
                        address
                    });

                    vm.address = address;
                } else {
                    vm.address = res.address;
                }
            } catch (err) {
                console.log(err);
            }
        }
    }
};
</script>
<style scoped>
.window-info {
    font-size: 12px;
    width: 365px;
    background-color: #fff;
    color: #333333;
    line-height: 28px;
    border-radius: 4px;
    position: relative;
    padding: 0 8px;
    padding-top: 10px;
}
.window-info >>> .el-row {
    font-size: 12px;
    padding: 0px 5px;
}
.window-info >>> .el-col {
    line-height: 20px;
}
.border-left {
    border-left: 1px solid #eee;
}
.border-bottom {
    border-bottom: 1px solid #eee;
}
.gray-font {
    color: #999;
}
.formatted-address {
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    padding: 0;
    margin: 0;
}
.close-button {
    position: absolute;
    right: 10px;
    top: 5px;
    font-size: 15px;
    cursor: pointer;
    z-index: 8999;
}
.imgIcon {
    margin-right: 8px;
}
.spacing {
    line-height: 8px;
}
p.gray-font {
    margin: 0;
    padding: 0;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    line-height: 16px;
}
.pad {
    padding: 10px 0;
}
.pad1 {
    padding-bottom: 0;
}
.bold {
    font-weight: 600;
    font-size: 14px;
}
.trangle {
    border-top: 10px solid #fff;
    left: 47%;
    display: block;
    width: 0px;
    height: 0px;
    border-left: 10px solid transparent;
    border-right: 10px solid transparent;
    position: absolute;
    z-index: 100;
}
.span-margin {
    margin-top: 10px;
}
.span-margin >>> .el-progress-bar__outer {
    height: 10px !important;
}
.remain-status {
    display: flex;
    justify-content: space-between;
    font-weight: 700;
}
.mark-row {
    color: #999;
    margin-top: 10px;
}
.order-id {
    margin-left: 20px;
}
.plate-num {
    padding-bottom: 8px;
}
</style>
