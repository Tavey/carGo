<template>
    <div class="history-wrap">
        <div class="title">使用历史</div>
        <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="查询历史" name="first"></el-tab-pane>
            <el-tab-pane label="货迹历史" name="second"></el-tab-pane>
        </el-tabs>
        <div class="scrollw">
            <el-table :data="queryData" style="width: 100%" v-show="activeName =='first' ">
                <el-table-column class-name="pad" label="车牌" prop="car.plate_num">
                </el-table-column>
                <el-table-column label="时间" prop="updated_at">
                </el-table-column>
                <el-table-column label="位置信息" prop="address">
                </el-table-column>
                <el-table-column label="操作" width="120">
                    <template slot-scope="scope">
                        <el-button @click.native.prevent="deleteRow(scope.row)" type="text" size="small">
                            删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-table :data="trackingData"  style="width: 100%" v-show="activeName == 'second'" align="center">
                <el-table-column class-name="pad" label="运单号" prop="order_id" min-width="80">
                </el-table-column>
                <el-table-column label="创建日期" prop="created_at" width="160">
                </el-table-column>
                <el-table-column label="车牌号" prop="plate_num" width="90">
                </el-table-column>
                <el-table-column label="最后位置" prop="address" min-width="230">
                </el-table-column>
                <el-table-column label="关闭日期" prop="will_active_at" width="160">
                </el-table-column>
                <el-table-column label="状态" prop="showStatus" width="80">
                </el-table-column>
                <el-table-column type="expand">
                    <template slot-scope="props">
                        <el-form label-position="left" inline class="demo-table-expand">
                            <el-row>
                                <el-col :span="6">
                                    <div>
                                        <img src="../../../assets/startpoint.png" width="10" alt="" class="mar10"> 
                                        <span v-title:11="props.row.origin">
                                        </span>
                                    </div>
                                    <div class="point"></div>
                                    <div class="point"></div>
                                    <div>
                                        <img src="../../../assets/endpoint.png" width="10" alt="" class="mar10">
                                        <span v-title:11="props.row.destination"></span>
                                    </div>
                                </el-col>
                                <el-col :span="18">
                                    <div v-for="(info, i) in props.row.milestone" :key="i" class="letter">{{info.created_at}} {{info.type==1?'短信通知':'其他' }} {{`进入终点${info.content/1000}KM范围`}}</div>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-button
                                    size="mini"
                                    type="primary"
                                    @click="traceId = props.row.id"
                                >
                                    轨迹
                                </el-button>
                            </el-row>
                        </el-form>
                    </template>
                </el-table-column>
            </el-table>
            <!-- <div class="paging">
                 <el-pagination
                    v-if="!noPagination"
                    layout="total, prev, pager, next"
                    :total="page.total"
                    :page-size="page.pageSize"
                    :current-page.sync="page.page"
                    @current-change="handlePageChange"
                    @sort-change="handleSortChange"
                >
                </el-pagination>
            </div> -->
            <dialog-map 
                :traceId="traceId"
                @close="traceId = ''"
            />
        </div>
    </div>
</template>

<script>
import DialogMap from "@/components/HistoryListDialogMap";
const showStr = {
    "10": "创建",
    "20": "已激活",
    "25": "即将到达 ",
    "30": "已结束",
    "0": "异常",
    "1": "创建中",
    "31": "过期"
};
export default {
    name: "index",
    components: {
        DialogMap
    },
    data() {
        return {
            activeName: "first",
            queryData: null,
            trackingData: null,
            page:{
                page:1,
                total:0,
                pageSize:0
            },
            traceId: ""
        };
    },
    created() {
        this.getHistoryList();
    },
    mounted() {},
    methods: {
        getHistoryList(page) {
            let vm = this;
            vm.$Api
                .getSingleTraceList()
                .then(response => {
                    if (response.data.status) {
                        vm.filterHistoryList(response.data.data.list);
                        // vm.page.total = response.data.data.total;
                        // vm.page.pageSize = Math.ceil(response.data.data.list.length/vm.page.total);
                    }
                })
                .catch(error => {});
        },
        filterHistoryList(arr) {
            this.queryData = arr.map(a => ({
                ...a,
                car: a.entities[0]
            }));
            this.queryData.forEach((val, k) =>
                this.geoCode(val, k, this.queryData)
            );
        },
        async geoCode(params, key, obj) {
            let vm = this;
            let car;
            if (params.latest_process) {
                car = params.latest_process;
            } else {
                car = params.entities[0];
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

                    vm.$set(obj, key, {
                        ...params,
                        province,
                        district,
                        street,
                        address
                    });
                } else {
                    let { province, district, street, address } = res;
                    vm.$set(obj, key, {
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
        filterTrackingList(arr) {
            this.trackingData = arr.map(a => ({
                ...a,
                showStatus: showStr[a.status]
            }));
            this.trackingData.forEach((val, k) =>
                this.geoCode(val, k, this.trackingData)
            );
        },
        trackingList() {
            let vm = this;
            vm.$Api.historyShipping(1, 20).then(response => {
                if (response.data.status) {
                    vm.filterTrackingList(response.data.data.list);
                }
            });
        },
        lastAddress() {
            return "暂无地址";
        },

        handleClick(tab, event) {
            let vm = this;
            if (tab.index == 1) {
                vm.trackingList();
            }
        },
        deleteRow(row) {
            this.$Api.deleteSingleTrace(row.id).then(res => {
                if (res.data == "success") {
                    this.$notify({
                        title: "删除成功",
                        type: "success"
                    });
                }
                if (res.data.status) {
                    this.$notify({
                        title: "删除成功",
                        type: "success"
                    });
                }
                this.getHistoryList();
            });
        }
    }
};
</script>

<style scoped>
.history-wrap {
    height: 100%;
}
.history-wrap >>> .pad {
    padding-left: 17px;
}
.history-wrap >>> .el-table th.is-leaf {
    border-bottom: #ebeef5 1px solid;
}
.title {
    line-height: 54px;
    font-size: 16px;
    position: relative;
    padding-left: 25px;
    border:1px solid #dcdfe6;
    border-bottom: none;
}
.title::before {
    height: 16px;
    width: 4px;
    background: #4c84ff;
    position: absolute;
    top: 19px;
    left: 17px;
    color: #4c84ff;
    content: "";
}
.history-wrap >>> .el-tabs{
    border:1px solid #dcdfe6;
    border-top: none;
    border-bottom: none;
}
.history-wrap >>> .el-tabs__nav-scroll {
    padding-left: 25px;
}
.history-wrap >>> .el-tabs__nav-wrap::after {
    content: none;
}
.history-wrap >>> .el-tabs__nav-wrap {
    border-bottom: 1px solid #dcdfe6;
}
.history-wrap >>> .el-table td {
    border-bottom: 1px #dcdfe6 dashed;
}
/* .history-wrap>>>.el-table__row{
    border-bottom: 1px #dcdfe6 dashed;
} */
.point {
    height: 4px;
    width: 4px;
    border-radius: 9999px;
    background: #cfd6e6;
    display: block;
    margin-left: 3px;
    margin-top: 2px;
}
/* .el-table >>>.cell{
    padding: 0;
} */
.mar10 {
    margin-right: 10px;
}
.letter {
    border-left: 1px #ccc solid;
    box-sizing: border-box;
    /* text-align: center; */
    display: inline-block;
    height: 45px;
    line-height: 45px;
    padding: 0 20px;
}
.scrollw {
    height: calc(100%-140px);
    min-height: 200px;
}
.history-wrap >>> .el-table {
    border:1px solid #dcdfe6;
    border-top: none;
    height: 100%;
    /* height: calc(100%-32px); */
    max-height: 1000px;
}
.history-wrap >>> .el-table__body-wrapper {
    height: calc(100%-76px);
    overflow-y: scroll;
}
.el-pagination {
    padding-top: 10px;
    height: 50px;
    text-align: center;
    border:1px solid #dcdfe6;
    border-top: none;
}
</style>
