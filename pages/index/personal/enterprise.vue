<template>
    <div class="enterprise-wrap">
        <div class="title">企业资料</div>
        <ul v-if="info">
            <li>
                <span class="noun">企业名称</span>
                <span class="annotation">{{info.company.name}}</span>
            </li>
            <li>
                <div class="biz-text">
                    <span class="noun">营业执照</span>
                </div>
                <div class="biz-img">
                     <img :src="info.company.biz_license" alt="" width="280">
                </div>
               
            </li>
            <li>
                <span class="noun">审核状态</span>
                <span class="annotation">
                    <span v-if="info.is_enterprise"><i class="el-icon-circle-check-outline true"></i> 通过</span>
                    <span v-else-if="info.company.biz_license&&!info.is_enterprise">审核中</span>
                </span>
            </li>
            <li>
                <span class="noun">审核通过时间</span>
                <span class="annotation">{{info.company.certified_at||'无'}}</span>
            </li>
        </ul>
    </div>
</template>

<script>
import { mapMutations, mapState, mapActions } from "vuex";
export default {
    components: {},
    data() {
        return {
            info:null
        };
    },
    computed: {
        ...mapState({
            userInfo: state => state.User.userInfo
        })
    },
    mounted() {
        this.info = this.userInfo
        console.log(this.userInfo.company )
    },
    methods: {
        
    }
};
</script>

<style scoped>
.enterprise-wrap {
    /* padding-left: 25px; */
    font-size: 12px;
}
ul {
    list-style-type: none;
    padding: 0;
    margin: 0;
    border:1px solid #dcdfe6;
    border-top: none;
}
li {
    border-bottom: 1px #dcdfe6 solid;
    line-height: 53px;
    overflow: hidden;
    padding-left: 25px;
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
.noun {
    color: #939499;
    width: 122px;
    display: inline-block;
}
.annotation {
    color: #000;
}
i{
    font-size:16px;
}
.true{
    color:#5087ff ;
}
.false{
    color: #da284a;
}
li:last-child{
    border: none;
}
.biz-img{
    padding: 5px;
    display: inline-block;
    position: relative;
    float: left;
    margin-top: 19px;
    margin-bottom: 18px;
    border: 1px #dcdfe6 dashed;
}
.biz-text{
    float: left;
}
</style>
