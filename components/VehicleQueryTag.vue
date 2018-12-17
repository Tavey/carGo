<template>
        <ul class="query-tip-container">
            <li 
                class="query-tip-item" 
                v-for="(plateNum, i) in queryTags"
                :key="i"
                @click="$emit('handle-click', plateNum)"
            >
                {{plateNum | formatVehicleNum}}
            </li>
        </ul>
</template>
<script>
export default {
    created() {
        this.getQueryHistoryTag();
    },
    data() {
        return {
            queryTags: {}
        };
    },
    filters: {
        formatVehicleNum(str) {
            return str.slice(0, 2) + " " + str.slice(2);
        }
    },
    methods: {
        getQueryHistoryTag() {
            let vm = this;
            vm.$Api
                .getQueryHistoryTag()
                .then(res => {
                    if (res.data.status) {
                        vm.queryTags = res.data.data.list;
                    }
                })
                .catch(err => {
                    console.log(err);
                });
        },
        handleClick(p) {
            console.log(123);
        }
    }
};
</script>
<style scoped>
.query-tip-container {
    padding: 0;
    overflow: hidden;
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
}
.query-tip-item {
    list-style: none;
    cursor: pointer;
    padding: 3px 0px;
    text-align: center;
    margin: 5px 2px;
    border-radius: 4px;
    font-size: 12px;
    background-color: #eee;
    transition: all 0.3s;
    width: 31%;
}
.query-tip-item:hover {
    /* background-image: linear-gradient(to right, #2760ec, #388df5); */
    background-color: #4c84ff;
    color: #fff;
}
</style>
