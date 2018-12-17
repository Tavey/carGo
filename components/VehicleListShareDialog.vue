<template>
        <el-dialog 
            :visible.sync="shareVisible"
            class="share-dialog"
            :close-on-click-modal="false"
            @close="$emit('close')"
            append-to-body
        >
            <div slot="title">
                <h3 class="share-title">分享货单跟踪</h3>
                <dl class="share-title-item">
                    <dd >运单号</dd>
                    <dt v-title:6="shareInfo ? shareInfo.orderId : ''"> 
                    </dt>
                </dl>
                <dl  class="share-title-item">
                    <dd>车牌号</dd>
                    <dt v-title:10="shareInfo ? shareInfo.plateNum : ''"></dt>
                </dl>      
            </div>
            <div class="share-link-box" v-if="stepOne">
                <dl>
                    <dd>链接</dd>
                    <dt>{{shareInfo ?  shareInfo.url : '暂无'}}</dt>
                </dl>
                <dl>
                    <dd>密码</dd>
                    <dt>
                        <input 
                            type="text" 
                            readonly
                            :value="newCode"
                        >
                        <span
                            class="replace-code-btn"
                            @click="generateCode"
                        >
                            换一个
                        </span>
                    </dt>
                </dl>
                <div class="btn-box">
                    <el-button 
                        type="primary"
                        @click="nextStep"
                    >
                        下一步
                    </el-button>
                    <el-button @click="$emit('close')">&nbsp;取消&nbsp;</el-button>
                </div>
            </div>
            <div class="shareto-box" v-else>
                <div class="shareto-addbtn-item">
                    <span>
                        <i class="el-icon-circle-check-outline shareto-icon" ></i>链接及密码已复制
                    </span>
                    <span 
                        class="add-contacts"
                        @click="addContact"
                    >
                        <i class="el-icon-circle-plus-outline shareto-icon"></i>增加联系人
                    </span>
                </div>
                <div class="shareto-input-item">
                    <el-form 
                        :model="contactArr"
                        ref="form"
                    >
                        <el-form-item 
                            v-for="(v, k) in contactArr"
                            :prop="`${k}`"
                            :key="k"
                            :rules="{
                                validator: validateParam,
                                trigger: 'blur'
                            }"
                        >
                            <el-input 
                                type="text"
                                placeholder="邮箱或者手机号码"           
                                v-model="contactArr[k]"
                            />
                        </el-form-item>
                    </el-form>
                </div>
                <div class="shareto-btn-item">
                    <el-button
                        type="primary"
                        @click="shareSubmit"
                    >
                        确认发送
                    </el-button>
                    <el-button
                        @click="$emit('close')"
                    >
                        <span  class="fill-word">填</span>取消<span class="fill-word">填</span>
                    </el-button>
                </div>
            </div>
            <input 
                type="text" 
                ref="copy"
                style="opacity: 0"
                :value="shareInfo ? `链接: ${shareInfo.url} 密码: ${newCode}` : ''"
            >
        </el-dialog>
</template>
<script>
export default {
    props: {
        shareVisible: {
            type: Boolean,
            default: false
        },
        shareInfo: {
            type: Object,
            default: null
        }
    },
    data() {
        return {
            stepOne: true,
            newCode: "",
            contactArr: {
                0: ""
            }
        };
    },
    watch: {
        shareInfo(val) {
            if (val && val.password) {
                this.newCode = val.password;
            }
            this.resetAll();
        }
    },
    methods: {
        resetAll() {
            this.stepOne = true;
            this.contactArr = {
                0: ""
            };
        },
        nextStep() {
            let vm = this;
            vm.$refs.copy.select();
            document.execCommand("copy");
            if (vm.newCode !== vm.shareInfo.password) {
                vm.replaceCode();
            }
            vm.stepOne = false;
        },
        validateParam(rule, val, cb) {
            let mobileReg = /^1[0-9]{10}$/;
            let emailReg = /^[a-z_0-9.-]{1,64}@([a-z0-9-]{1,200}.){1,5}[a-z]{1,6}$/i;

            console.log(val);
            if (mobileReg.test(val) || emailReg.test(val)) {
                cb();
            } else {
                cb(new Error("请输入正确的邮箱或者手机号"));
            }
        },
        addContact() {
            let vm = this;
            let len = Object.keys(vm.contactArr).length;

            len < 3
                ? vm.$set(vm.contactArr, len, "")
                : vm.$message({
                      message: "超出最大联系人添加数",
                      type: "warning"
                  });
        },
        generateCode() {
            /\.(.{4})/.exec(Math.random());
            this.newCode = RegExp.$1;
        },
        replaceCode() {
            let vm = this;
            vm.$Api
                .shareShippingPass(vm.shareInfo.id, vm.newCode)
                .then(res => {
                    console.log(res);
                })
                .catch(err => {
                    if (err.response) {
                        vm.$notify({
                            title: "更改密码失败",
                            type: "warning",
                            message: err.response.data.msg
                        });
                    }
                });
        },
        shareSubmit() {
            let vm = this;
            let targets = Object.values(vm.contactArr);

            vm.$refs.form.validate().then(_ => {
                vm.$Api
                    .shareShippingSend(vm.shareInfo.id, targets)
                    .then(res => {
                        if (res.data.status) {
                            vm.$notify({
                                title: "分享成功",
                                type: "success"
                            });
                            vm.$emit("close");
                        }
                    })
                    .catch(err => {
                        if (err.response) {
                            vm.$notify({
                                title: "分享失败",
                                type: "warning",
                                message: err.response.data.msg
                            });
                        }
                    });
            });
        }
    }
};
</script>
<style scoped>
.share-dialog >>> .el-dialog {
    width: 330px;
    min-height: 290px;
}
.share-dialog >>> .el-dialog__body {
    padding: 20px 20px 0px 20px;
}
.share-dialog >>> .el-dialog__header {
    background-color: #f9f9f9;
    box-shadow: 0 0 4px rgba(0, 0, 0, 0.1);
}
.share-dialog .share-title-item:first-of-type {
    margin-bottom: 10px;
}
.share-title {
    margin-bottom: 15px;
    color: #666;
}
.share-title-item dd {
    color: #9099a5;
    margin-right: 15px;
}
.share-title-item dt {
    font-size: 13px;
}
.share-title-item {
    display: flex;
    align-items: center;
}
.share-link-box dl {
    display: flex;
    align-items: center;
}
.share-link-box dl:first-of-type {
    margin-bottom: 20px;
}
.share-link-box dd {
    color: #9099a5;
    margin-right: 15px;
}
.share-link-box dt {
    font-size: 13px;
}
.share-link-box input {
    height: 38px;
    width: 53px;
    border: 1px solid #eee;
    border-radius: 4px;
    margin-right: 15px;
    text-align: center;
}
.replace-code-btn {
    color: #409eff;
    text-decoration: underline;
    padding: 0;
    cursor: pointer;
}
.btn-box {
    margin-top: 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;
}
.btn-box >>> .el-button {
    padding: 10px 30px;
}
.shareto-addbtn-item {
    display: flex;
    justify-content: space-between;
    font-size: 13px;
    align-items: center;
}
.shareto-addbtn-item span:nth-child(2) {
    color: #409eff;
}
.shareto-input-item {
    margin-top: 20px;
}
.shareto-input-item >>> .el-input__inner {
    line-height: 40px;
    height: 40px;
}
.shareto-input-item >>> .el-form-item {
    margin-bottom: 20px;
}
.shareto-btn-item >>> .el-button {
    padding: 10px 30px;
}
.shareto-btn-item {
    display: flex;
    justify-content: space-between;
}
.shareto-icon {
    color: #409eff;
    font-size: 18px;
    margin-right: 5px;
    position: relative;
    bottom: -2px;
}
.add-contacts {
    cursor: pointer;
}
.fill-word {
    opacity: 0;
}
</style>
