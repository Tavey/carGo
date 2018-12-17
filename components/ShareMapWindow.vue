<template>
    <div class="window-info">
        <div class="title">
                    <img src="../assets/where.png" width="95" alt="" class="where">
                </div>
        <span class="el-icon-close close-button" @click="$emit('close')">
        </span>
        <el-row>
            <el-col :span="16" class="pad pad1">
                <el-row>
                    <el-col>
                        <span class="bold">{{windowInfo.plate_num}}</span>
                    </el-col>
                    <el-col>
                        <p
                            class="bold formatted-address"
                            v-title:26="windowInfo.order_id"
                        ></p>
                    </el-col>
                </el-row>
            </el-col>
            <el-col :span="8" class="pad pad1 border-left">

                <el-row >
                    <el-col>
                        <span class="gray-font">预计所剩里程和时间</span>
                    </el-col>
                    <el-col>
                        {{windowInfo.latest_process.remaining_distance/1000}}公里  {{windowInfo.latest_process.remaining_time | formatSec}}
                    </el-col>
                </el-row>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="16"  class="border-bottom  pad">
                <el-row >
                    <el-col>
                        {{windowInfo.latest_process.sampled_at}}
                    </el-col>
                    <el-col>
                        <!-- <p  :title="windowInfo.formatted_address && windowInfo.formatted_address.length > 23 ? windowInfo.formatted_address : ''" class="formatted-address">{{windowInfo.formatted_address | defaultStr('暂无')}}</p> -->
                        <p
                            class="formatted-address"
                            v-title:23="windowInfo.formatted_address"
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
                        <span> {{windowInfo.latest_process.remaining_time | expectDate}}</span>
                    </el-col>
                </el-row>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="16" class="pad">
                <el-row  class="spacing">
                    <el-col>
                    <img class="imgIcon" src="../assets/startpoint.png" width="10" alt="">{{windowInfo.origin}}
                    </el-col>
                </el-row>
                <el-row class="spacing">
                    <el-col>
                    <img  class="imgIcon" src="../assets/endpoint.png" width="10" alt="">{{windowInfo.destination}}
                    </el-col>
                </el-row>
            </el-col>
            <el-col :span="8" class="pad">
                <el-row class="spacing">
                    <el-col>
                    <span class="gray-font">计划时间</span>
                    </el-col>
                </el-row>
                <el-row class="spacing">
                    <el-col>
                        <span >
                           {{windowInfo.plan.end_at}}
                        </span>
                    </el-col>
                </el-row>
            </el-col>
        </el-row>
        <el-row>
            <el-col class="pad" style="padding-top: 0;padding-left:11px;">
                备注:
                <span 
                    class="gray-font" 
                    v-title:30="windowInfo.remark"
                >
                </span>
            </el-col>
        </el-row> 
        <div  class="trangle"></div>
    </div>    
</template>
<script>
export default {
    name: "windowInfo",
    props: {
        windowInfo: Object
    },
    mounted() {
        // console.log(this.windowInfo)
    },
    filters: {
        defaultStr(val, str) {
            return val ? val : str;
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
    }
};
</script>
<style scoped>
.window-info >>> .close-button {
    display: none;
}
.title {
    border-bottom: 1px solid #f0f0f0;
    height: 49px;
    background: #f9f9f9;
    line-height: 63px;
    padding-left: 15px;
}
.window-info {
    font-size: 12px;
    width: 455px;
    background-color: #fff;
    color: #333333;
    line-height: 28px;
    border-radius: 4px;
    position: relative;
}

.window-info >>> .el-row {
    font-size: 12px;
    padding: 0;
}

.window-info >>> .el-col {
    line-height: 20px;
    padding-left: 6px;
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
    left: 48%;
    display: block;
    width: 0px;
    height: 0px;
    border-left: 10px solid transparent;
    border-right: 10px solid transparent;
    position: absolute;
    z-index: 100;
}
</style>
