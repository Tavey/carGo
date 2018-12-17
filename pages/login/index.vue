<template>
    <div class="page">
        <div id="submit">
            <div :style="{'text-align':'center'}"> <img src="../../assets/wherelogo.png" width="10" alt="" class="where"></div>
            <div class="titileHello">用好数据 做好生意</div>
            <el-form :model="dataForm" status-icon ref="dataForm" class="demo-loginForm" @submit.native.prevent="submitForm">
                <el-form-item 
                    prop="mobile"
                    :rules="filterRules({required: true, type: 'mobile'})"
                >
                    <el-input label-width="100%" v-model="dataForm.mobile" placeholder="手机号"   
                     ></el-input>
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
                                maxlength="4"
                                @blur="codeValidate"
                            ></el-input>
                        </el-col>
                        <el-col  class="mar5" :span="9" :offset="1"> 
                            <el-button label-width="100%" :type="disabled ? 'info' : 'primary'" @click="verification" :disabled="disabled">{{ countdown |defaultStr('获取验证码') }}</el-button>
                        </el-col>
                    </el-row>
                </el-form-item>
                <el-form-item>
                    <el-button class="register" type="primary" plain @click="goToRegister">去注册</el-button>
                    <el-button class="login" type="primary" native-type="submit">登录</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
import axios from "axios";
import submitMixin from "~/mixins/submit";
export default {
    components: {},
    mixins: [submitMixin],
    data() {
        return {
            verifyType: 20
        };
    },
    methods: {
        fromApi(dataForm) {
            return this.$Api.accountLogin(
                dataForm.mobile,
                dataForm.verification
            );
        },
        goToRegister() {
            this.$router.push("/register");
        }
    }
};
</script>

<style scoped>
@import "@/assets/log.css";

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
    background: #fff;
}
.login {
    margin-top: 20px;
    float: right;
}
</style>
