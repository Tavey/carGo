<template>
    <div class="query-wrap">
        <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
            <el-menu-item index="1">车辆跟踪</el-menu-item>
            <el-menu-item index="2">速查工具</el-menu-item>
        </el-menu>
        <div class="semicircle">
            <span></span>
            <span></span>
        </div>
        <div class="submit-wrap">
            <el-form status-icon ref="form" label-width="100px" class="demo-ruleForm">
                <el-input placeholder="车牌号，仅限浙江地区" prefix-icon="el-icon-document" :rules="filterRules({type: 'plateNum', required: true})" v-model="plate">
                </el-input>
                <div class="scanning">
                    <img src="../assets/qrcode.jpg" alt="" width="68">
                    <div class="inb">
                        <div>扫一扫</div>
                        <div>微信查询</div>
                    </div>

                </div>
                <el-button type="primary" @click="submitForm()">搜索</el-button>
            </el-form>
        </div>
    </div>
</template>

<script>
export default {
    components: {},
    data() {
        return {
            activeIndex: "1",
            plate: ""
        };
    },
    computed: {
        //...mapState(['s'])
    },
    mounted() {},
    methods: {
        handleSelect(key, keyPath) {
            console.log(key, keyPath);
        },
        submitForm() {
            this.$refs.form.validate(valid => {
                if (valid) {
                    let vm = this;
                    vm.getTrace(vm.plate);
                } else {
                    console.log("error submit!!");
                    return false;
                }
            });
        },
        getTrace(plate_num) {
            let vm = this;
            vm.$Api
                .generateSingleTrace(plate_num)
                .then(response => {
                    if (response.data.status) {
                        vm.$router.push(`/vehicle/${plate_num}`);
                    }
                })
                .catch(error => {
                    if (error.response) {
                        vm.$message.error(error.response.data.msg);
                    }
                });
        }
    }
};
</script>

<style scoped>
.query-wrap {
    height: 346px;
    width: 287px;
    background: #fff;
    position: absolute;
    top: 30%;
    left: 20%;
    z-index: 100;
    border-radius: 5px;
    text-align: center;
    overflow: hidden;
}
.el-menu {
    padding: 0 47px;
}
.semicircle span {
    height: 12px;
    width: 12px;
    background: #717173;
    display: inline-block;
    border-radius: 50%;
    position: absolute;
    top: 55px;
}
.semicircle span:nth-child(1) {
    left: -6px;
}
.semicircle span:nth-child(2) {
    right: -6px;
}

.el-menu >>> .is-active {
    color: #1a66ff;
}

.submit-wrap {
    padding: 30px 24px 0 24px;
}
.el-select .el-input {
    width: 130px;
}

.scanning {
    height: 134px;
    padding: 37px 0 0 41px;
    text-align: left;
}
.inb {
    height: 66px;
    display: inline-block;
    float: right;
    line-height: 26px;
    padding-top: 10px;
    margin-right: 46px;
}
.el-button--primary {
    width: 100%;
    height: 48px;
    background-image: linear-gradient(to right, #2760ec 50%, #388df5 100%);
}
</style>
