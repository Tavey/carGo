<template>
    <div class="wrap" v-loading="loading">
        <div class="scwrap">
            <div class="personal-center">
                <div class="middle">
                    <div class="tag-wrap">
                        <div :class="{'is-active': isActive == 0}" @click="linkTo(0)">
                            <img v-if="isActive == 0" src="../../assets/info_b.png" alt="">
                            <img v-else src="../../assets/info_c.png" alt="">
                            <span class="tag">基本信息</span>
                            <i class="el-icon-arrow-right"></i>
                        </div>
                        <div :class="{'is-active': isActive == 1}" @click="linkTo(1)">
                            <img v-if="isActive == 1" src="../../assets/comp_b.png" alt="">
                            <img v-else src="../../assets/comp_c.png" alt="">
                            <span class="tag">企业资料</span>
                            <i class="el-icon-arrow-right"></i>
                        </div>
                        <div :class="{'is-active': isActive == 2}" @click="linkTo(2)">
                            <img v-if="isActive == 2" src="../../assets/his_b.png" alt="">
                            <img v-else src="../../assets/his_c.png" alt="">
                            <span class="tag">使用历史</span>
                            <i class="el-icon-arrow-right"></i>
                        </div>
                    </div>
                    <div class="area">
                        <nuxt-child></nuxt-child>
                    </div>
                </div>
            </div>
        </div>
        <Footer/>
    </div>

</template>

<script>
    import Footer from "../../components/IndexPageFooter.vue";

    export default {
        components: {
            Footer
        },
        data() {
            return {
                isActive: 0,
                link: ["/personal", "/personal/enterprise", "/personal/history"],
                loading: true
            };
        },
        created() {
            let path = this.$route.path;
            if (path.indexOf("enterprise") >= 0) {
                this.isActive = 1;
            } else if (path.indexOf("history") >= 0) {
                this.isActive = 2;
            } else {
                this.isActive = 0;
            }
        },
        mounted() {
              this.getAccount();
        },
        methods: {
            linkTo(num) {
                this.isActive = num;
                this.$router.push(this.link[num]);
            },
            getAccount() {
                this.$Api.getAccount().then(res => {
                    this.loading = false;
                    if (res.data && res.data.status) {
                        this.$store.dispatch("LoginAndSetUserInfo", res.data.data);
                    }
                });
            }
            //
        }
    };
</script>

<style scoped>
    .wrap {
        width: 100%;
    }

    .scwrap {
        height: calc(100% - 69px);
        overflow-y: scroll;
    }

    .personal-center {
        padding: 20px 0px 0 0px;
        overflow: hidden;
        width: 1200px;
        height: 100%;
        margin: 0 auto;
        box-sizing: border-box;
    }

    .tag-wrap {
        display: inline-block;
        height: 168px;
        width: 160px;
        text-align: center;
        cursor: pointer;
        float: left;
        font-size: 14px;
        border: 1px solid #dcdfe6;
        padding: 15px 16px 15px 19px;
        overflow: hidden;
        margin-right: 22px;
    }

    .tag-wrap > div {
        line-height: 26px;
        margin-bottom: 30px;
    }

    .tag-wrap img {
        position: relative;
        top: 4px;
        width: 20px;
    }

    .middle {
        height: 98%;
        margin: 0 auto;
    }

    .area {
        height: 100%;
        display: inline-block;
        width: calc(100% - 182px);
        background: #fff;
        overflow: hidden;
    }

    .tag {
        margin-left: 5px;
        margin-right: 15px;
    }

    .wrap >>> .is-active {
        color: #4c84ff;
    }

    .wrap >>> .el-tabs__active-bar {
        background-color: #4c84ff;
    }

    .wrap >>> .el-button--text {
        color: #4c84ff;
    }


</style>
