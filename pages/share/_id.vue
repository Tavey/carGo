<template>
    <div class="page">
        <div class="input-wrap" v-if="!lost">
            <div class="title">
                <img src="../../assets/where.png" width="95" alt="" class="where">
                <span></span>分享给您加密货单跟踪
            </div>
            <div class="input">
                <div class="prompt">请输入您的打开密码</div>
                <el-form :model="dataForm" status-icon ref="dataForm" class="demo-loginForm" @submit.native.prevent="submitForm">
                    <el-row>
                        <el-col :span="15">
                            <el-form-item prop="password" :error="codeError">
                                <el-input type="password"  @blur="codeValidate" v-model="dataForm.password" placeholder=""></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="4" :offset="1">
                            <el-button type="primary" native-type="submit">打开跟踪</el-button>
                        </el-col>
                    </el-row>
                </el-form>

            </div>
        </div>
        <div class="lost-wrap" v-else>
            <img src="../../assets/lost.png" width="206" alt="">
            <div class="sorry">抱歉！您的链接已失效</div>
        </div>
        <global-footer />
    </div>
</template>

<script>
import GlobalFooter from "~/components/global/BaseFooter";
import shareMixin from "~/mixins/share";
export default {
    components: {
        GlobalFooter
    },
    mixins: [shareMixin],
    data() {
        return {
            dataForm: {
                password: ""
            },
            codeError: "",
            lost: false
        };
    },
    created() {
        if (this.$route.query.password) {
            this.getShare(this.$route.params.id, this.$route.query.password);
        }
    },
    methods: {
        submitForm() {
            let vm = this;
            vm.$refs["dataForm"].validate(valid => {
                if (valid) {
                    if (this.dataForm.password.replace(/\s+/g, "") == "") {
                        return;
                    }
                    vm.getShare(vm.getParam(), vm.dataForm.password);
                } else {
                    console.log("error submit!!");
                    return false;
                }
            });
        },
        getShare(share_id, password) {
            let vm = this;
            vm.$Api
                .getShare(share_id, password)
                .then(response => {
                    if (response.data.status) {
                        vm.$router.push(
                            `/share/map/${share_id}?password=${password}`
                        );
                    }
                })
                .catch(error => {
                    if (error.response) {
                        if (error.response.status == 410) {
                            vm.$router.push("/share/timeout");
                        } else {
                            vm.message(error.response.data.msg, "warning");
                        }
                    }
                });
        },
        codeValidate() {
            this.codeError =
                this.dataForm.password.replace(/\s+/g, "") === ""
                    ? "请输入验证码"
                    : "";
        },
        getParam(name) {
            let search = window.location;
            let pathname = search.pathname.split("/");
            return pathname[2];
        }
    }
};
</script>

<style scoped>
.page,
.entrance {
    height: 100%;
    width: 100%;
    background: #f9f9f9;
}
.mapwrap {
    height: 100%;
}
.input-wrap {
    height: 180px;
    width: 404px;
    margin: auto;
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    box-shadow: 5px 5px 16px #9c9898;
    border-radius: 5px;
    background: #ffffff;
}
.title {
    border-bottom: 1px solid #f0f0f0;
    height: 49px;
    background: #f9f9f9;
    line-height: 49px;
}
.where {
    position: relative;
    top: 5px;
    left: 15px;
    margin-right: 30px;
}
.prompt {
    line-height: 54px;
}
.input {
    padding-left: 22px;
    padding-top: 8px;
}
.el-row >>> .el-input__inner {
    height: 41px;
}
.el-button {
    height: 41px;
}

.lost-wrap {
    text-align: center;
    width: 206px;
    height: 336px;
    margin: auto;
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
}
.sorry {
    line-height: 45px;
}
</style>
