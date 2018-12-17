export default {
    data() {
        return {
            countdown: null,
            disabled: true,
            delayOut: null,
            warningOut: null,
            dataForm: {
                mobile: "",
                name: "",
                company: "",
                verification: ""
            },
            codeError: "",
            limit: false,
        };
    },
    filters: {
        defaultStr(val, str) {
            if (!val) return str;
            return val;
        }
    },
    watch: {
        "dataForm.mobile"(val) {
            var reg = /^1[0-9]{10}$/;
            if (reg.test(val)) {
                this.disabled = false;
            } else {
                this.disabled = true;
            }
        }
    },
    methods: {
        //提交
        submitForm() {
            let vm = this;
            vm.$refs["dataForm"].validate((valid) => {
                if (valid) {
                    vm
                        .fromApi(vm.dataForm)
                        .then((response) => {
                            if (response.data.status) {
                                vm.$store.dispatch(
                                    "LoginAndSetUserInfo",
                                    response.data.data
                                );
                                vm.$router.push("/");
                            }
                        })
                        .catch((error) => {
                            vm.limit = false;
                            if (error.response) {
                                vm.openMessage(
                                    error.response.data.msg,
                                    "warning"
                                );
                            } else {
                                vm.openMessage("登录失败", "warning");
                            }
                        });
                } else {
                    console.log("error submit!!");
                    return false;
                }
            });
        },
        //消息提示
        openMessage(str, type) {
            let vm = this;
            if (vm.warningOut != null) {
                return;
            }
            this.$message({
                message: str,
                type: type
            });
            vm.warningOut = setTimeout(() => {
                clearTimeout(vm.warningOut);
                vm.warningOut = null;
            }, 2000);
        },
        //验证
        verification() {
            let vm = this;
            vm.$refs["dataForm"].clearValidate();
            vm.$refs["dataForm"].validateField("mobile", function(
                errorMessage
            ) {
                if (errorMessage == "") {
                    if (vm.limit) return;
                    vm.limit = true;
                    vm
                        .accountVerification(vm.dataForm, vm.verifyType)
                        .then((response) => {
                            if (response.data.status) {
                                if (vm.delayOut != null) {
                                    clearInterval(vm.delayOut);
                                }
                                vm.openMessage("发送成功", "success");
                                vm.countdown = "重发(60s)";
                                vm.disabled = true;
                                vm.delay();
                                vm.limit = false;
                            }
                        })
                        .catch((error) => {
                            vm.limit = false;
                            vm.openMessage(error.response.data.msg, "warning");
                        });
                } else {
                }
            });
        },
        //倒计时
        delay() {
            let vm = this;
            let seconds = 59;
            vm.delayOut = setInterval(() => {
                if (seconds == 0) {
                    vm.countdown = null;
                    vm.disabled = false;
                    clearInterval(vm.delayOut);
                    vm.delayOut = null;
                    return;
                }
                vm.countdown = `重发(${seconds}s)`;
                seconds--;
            }, 1000);
        },
        accountVerification(dataForm, type) {
            return this.$Api.accountVerification(dataForm.mobile, type);
        },
        codeValidate() {
            this.codeError =
                this.dataForm.verification === "" ? "请输入验证码" : "";
        }
    }
};
