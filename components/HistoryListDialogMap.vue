<template>
    <el-dialog
        :visible.sync="polyLine.length > 0"
        title="历史轨迹"
        @close="closeDialog"
    >   
        <hb-map
            mapId="history-list-dialog"
            height="600px"
            ref="map"
        >
            <hb-map-polyline 
                :position="polyLine"
            />
        </hb-map>
    </el-dialog>
</template>
<script>
export default {
    name: "HistoryListDialogMap",
    props: {
        traceId: {
            type: Number | String,
        }
    },
    data() {
        return {
            polyLine: []
        }
    },
    watch: {
        "traceId"(val) {
            if (!val) return;
            this.getHistoryTrace();
        },
    },
    methods: {
        async getHistoryTrace() {
            let vm = this;
            let cache = await vm.$DB.Get(vm.traceId, 'historyTrace');
            if (cache) {
                vm.polyLine = cache.polyline;
                vm.fitView();
                return;
            }

            vm.$Api
                .getTraceRecord(vm.traceId)
                .then(res => {
                    if (res.data.data.length > 0) {
                        window.requestAnimationFrame(() => {
                           vm.polyLine = res.data.data.map(a => [a.latitude, a.longitude]);
                           vm.$DB.Add({
                               id: vm.traceId,
                               polyline: vm.polyLine
                           }, 'historyTrace');
                           vm.fitView();
                        })
                    } else {
                        vm.$notify({
                            title: "抱歉，暂无数据 请稍后再试",
                            type: "warning",
                        });
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
        fitView() {
            let vm = this;
            vm.$nextTick(() => {
                let mapInstance = vm.$refs.map.getInstance();
                mapInstance.fitBounds([
                    vm.polyLine
                ]);
            })
        },
        closeDialog() {
            let vm = this;
            vm.polyLine = [];
            vm.$emit("close");
        }
    }
}
</script>
<style lang="scss" scoped>
</style>
