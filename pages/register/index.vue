<template>
    <div class="page">
        <div id="submit">
            <div :style="{'text-align':'center'}"> <img src="../../assets/wherelogo.png" width="10" alt="" class="where"></div>
            <div class="titileHello">用好数据 做好生意</div>
            <el-form :model="dataForm" status-icon  ref="dataForm" class="demo-loginForm" @submit.native.prevent="submitForm">
                <el-form-item 
                    prop="mobile"
                    :rules="filterRules({type: 'mobile', required: true})">
                    <el-input label-width="100%" v-model="dataForm.mobile" placeholder="手机号"></el-input>
                </el-form-item>
                <el-form-item 
                    prop="name"
                    :rules="filterRules({required: true})">
                    <el-input label-width="100%" v-model="dataForm.name" placeholder="姓名"></el-input>
                </el-form-item>
                <el-form-item 
                    prop="company"
                    :rules="filterRules({minLength:4,required: true})">
                    <el-input label-width="100%" v-model="dataForm.company" placeholder="公司名"></el-input>
                </el-form-item>
                <el-form-item 
                    prop="verification"
                    :error="codeError"
                >
                    <el-row>
                        <el-col :span="13">
                            <el-input 
                                label-width="100%" 
                                v-model="dataForm.verification" 
                                placeholder="验证码"
                                @blur="codeValidate"
                            ></el-input>
                        </el-col>
                        <el-col  class="mar5" :span="9" :offset="1">
                            <el-button label-width="100%" :type="disabled ? 'info' : 'primary'" @click="verification" :disabled="disabled">{{ countdown |defaultStr('获取验证码') }}</el-button>
                        </el-col>
                    </el-row>
                </el-form-item>
                <!-- <el-row class="checkWrap">
                    <el-checkbox v-model="checked" class="checked">
                        我已阅读并接受
                    </el-checkbox>
                    <span @click="openDialog()" class="popup">《版权声明》</span>和
                    <span class="popup">《隐私保护》</span>
                </el-row> -->
                <el-form-item>
                    <el-button class="register" type="primary" native-type="submit" >注册</el-button>
                    <el-button class="login" type="primary" plain  @click="goToLogin">去登录</el-button>
                </el-form-item>
            </el-form>
            <!-- <div class="toOther">
                已有账号？
                <nuxt-link to="/login">去登录</nuxt-link>
            </div> -->
        </div>
        <el-dialog title="提示" :visible.sync="dialogVisible" width="30%">
            <span>这是一段信息</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
            </span>
        </el-dialog>
    </div>

</template>

<script>
import axios from "axios";
import submitMixin from "~/mixins/submit";
export default {
    // components: {
    //     GlobalFooter
    // },
    mixins: [submitMixin],
    data() {
        return {
            dialogVisible: false,
            checked: true,
            verifyType: 10
        };
    },
    mounted() {},
    methods: {
        openDialog(type) {
            let vm = this;
            vm.dialogVisible = true;
        },
        fromApi(dataForm) {
            let vm = this;
            return vm.$Api.accountRegister(
                dataForm.name,
                dataForm.mobile,
                dataForm.company,
                dataForm.verification
            );
        },
        goToLogin() {
            this.$router.push("/");
        }
    }
};
</script>

<style scoped>
@import "@/assets/log.css";
.checkWrap {
    color: #c3c5ca;
    font-size: 12px;
    white-space: nowrap;
}
.checkWrap >>> .el-checkbox__label {
    font-size: 12px;
    color: #c3c5ca;
}
.popup {
    color: #409eff;
    font-size: 12px;
    cursor: pointer;
    line-height: 19px;
    padding: 0;
    margin: 0;
}
.checked {
    line-height: 77px;
}

#submit >>> .el-input__inner {
    height: 40px;
}
#submit >>> .el-button {
    height: 40px;
    width: 118px;
    font-size: 14px;
}
.register {
    margin-top: 20px;
}
.login {
    margin-top: 20px;
    background: #fff;
    float: right;
}
</style>
