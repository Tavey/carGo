<template>
    <div class="wrap">
        <div class="info-wrap">
            <div class="title">基础信息</div>
            <div class="info">
                <div class="table" v-if="info">
                    <el-row>
                        <el-col :span="24">
                            <span class="noun">姓名</span>
                            <span class="annotation">{{info.name}}</span>
                            <div class="certification-wrap" v-if="info.is_enterprise">
                                  <img  src="../../../assets/rz.png" alt="">
                                <span> {{info.company.name}}</span>
                            </div>
                            
                        </el-col>
                        <el-col :span="24">
                             <span class="noun">手机号</span>
                            <span class="annotation">{{encryptionPhone(info.mobile)}}</span>
                        </el-col>
                         <el-col :span="24">
                             <span class="noun">注册时间</span>
                            <span class="annotation">{{info.registered_at}}</span>
                         </el-col>
                    </el-row>
                </div>
            </div>
        </div>
        <div class="colleagues-wrap">
            <div class="titles">我的同事</div>
            <ul class="list">
                <li v-for="( colle,index ) in colleaguesList">
                    <span class="name">{{colle.name}}</span>
                    <span class="mobile">{{encryptionPhone(colle.mobile)}}</span>
                </li>
            </ul>
        </div>
    </div>
</template>

<script >
import { mapMutations, mapState, mapActions } from "vuex";
export default {
    components: {},
    data() {
        return {
            colleaguesList: [],
            info:null
        };
    },
    created() {
    },
    computed: {
        ...mapState({
            userInfo: state => state.User.userInfo
        })
    },
    mounted() {
        this.info = this.userInfo;
        if(!this.userInfo){
            this.$store.dispatch("LoginOut");
            this.$router.push("/login");
            return
        }
        this.getColleagues(this.userInfo.company_id);
    },
    methods: {
        getColleagues(company_id) {
            let vm = this;
            vm.$Api
                .getColleagues(company_id)
                .then(response => {
                    if (response.data.status) {
                        vm.colleaguesList = response.data.data;
                        // console.log(vm.colleaguesList )
                    }
                })
                .catch(error => {
                    if (error.response) {
                        vm.$message.error(error.response.data.msg);
                    }
                });
        },
        encryptionPhone(str){
            return str.replace(/(\d{3})(\d{4})(\d{4})/,"$1****$3")
        }
       
    }
};
</script>

<style scoped lang="scss">
.info-wrap {
    height: 153px;
    border-bottom: 1px solid #dcdfe6;
    padding-left: 25px;
}
.info img {
    height: 74px;
    width: 74px;
}
.table {
    display: block;
    overflow: hidden;
    .el-row {
        // margin-left: 14px;
        line-height: 26px;
        font-size: 12px;
    }
}
.wrap{
     border: 1px #dcdfe6 solid;
}
.noun {
    color: #939499;
    width: 75px;
    display: inline-block;
}
.annotation {
    color: #000;
}
.colleagues-wrap {
    width: 245px;
    padding-left: 25px;
}
ul {
    list-style-type: none;
    margin: 0;
    padding: 0;
    font-size: 12px;
}
li {
    border-bottom: 1px #dcdfe6 dashed;
    line-height: 53px;
}

.title {
    line-height: 54px;
    font-size: 16px;
    position: relative;
}
.titles{
    line-height: 45px;
    font-size: 14px;
    position: relative;
}
.title::before {
    height: 16px;
    width: 4px;
    background: #4c84ff;
    position: absolute;
    top: 19px;
    left: -7px;
    color: #4c84ff;
    content: "";
}
.name {
    font-weight: 800;
}
.mobile {
    float: right;
}
li:last-child {
    border: none;
}
.certification-wrap{
    border: 2px solid #bcd1ff;
    margin-left: 20px;
    padding:0px 12px;
    font-size: 12px;
    height: 25px;
    border-bottom-left-radius: 999px;
    border-top-left-radius:999px;
    border-bottom-right-radius: 999px;
    border-top-right-radius:999px;
    display: inline-block;
    img{
        width: 15px;
        height:auto;
        position: relative;
        bottom: 0px;
    }
    span{
        position: relative;
        bottom: 3px;
    }
}
</style>

