<template>
    <div class="wrap" v-loading="loading">
        <div class="scwrap">
            <div style="margin: 0 auto;" class="certificat-wrap" align-center>
                <div class="steps_text_wrap">
                    <img src="../../assets/rz.png" alt="">
                    <div class="text-wrap">
                        <div class="tx1">企业认证</div>
                        <div class="tx2">完善资料</div>
                    </div>
                </div>
                <el-steps :active="isActive" align-center :space="350" finish-status="success">
                    <el-step class="bef" title="提交认证"></el-step>
                    <el-step class="aft" :title="steps.step"></el-step>
                </el-steps>
                <!-- <div class="step-wrap">
                <el-steps :active="isActive" :space="300" finish-status="success">
                    <el-step  class="bef" title="提交认证"></el-step>
                    <el-step class="aft" title="认证中"></el-step>
                </el-steps>
            </div> -->

                <div class="form-wrap" v-if="isActive==0">
                    <el-form :model="upLoadData" status-icon ref="upLoadData" label-width="86px" label-position="left" class="demo-ruleForm">
                        <el-form-item label="企业名称" prop="company_name">
                            <el-input v-model="upLoadData.company_name"></el-input>
                            <span class="red">注：名称需与企业营业执照保持一致</span>
                        </el-form-item>
                        <el-form-item label="营业执照">
                            <span class="support">支持jpg、jepg、png、gif等图片格式,小于1.2M</span>
                            <el-upload class="upload-demo" ref="upload" :multiple="false" name="biz_license" :show-file-list="false" :action="action" :headers="headers" :on-success="handleAvatarSuccess" :on-error="handleAvatarError" :on-change="changeImg" :data="upLoadData" :auto-upload="false">
                                <div v-if="!bgUrl" class="btnbg"> 点击添加图片 </div>
                                <img v-if="bgUrl" :src="bgUrl" alt="" width="300">
                                <!-- <el-button slot="trigger" size="small"  :style="{backgroundImage: 'url(' + bgUrl + ')' }" class="btnbg" type="primary"></el-button> -->
                                <!-- <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button> -->
                            </el-upload>
                            <span class="red">注：复印件请加盖红章，否则无法通过审核</span>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="submitUpload">下一步</el-button>
                        </el-form-item>
                    </el-form>
                </div>
                <div v-else class="checkin-wrap">
                    <div>
                        <img :src="steps.img" alt="">
                    </div>
                    <span>{{steps.text}}</span>
                    <span v-if="steps.change" class="modify" @click="toModify">去修改</span>
                </div>
            </div>
        </div>

        <Footer/>
    </div>
</template>

<script>
import { mapMutations, mapState, mapActions } from "vuex";
import Footer from "../../components/IndexPageFooter.vue";
export default {
    components: {
        Footer
    },
    data() {
        return {
            isActive: 0,
            imageUrl: "",
            action: "",
            headers: null,
            bgUrl: null,
            upLoadData: {
                company_name: ""
            },
            submit: false,
            loading: true,
            steps: {
                step: "认证中",
                text: "正在认证....",
                img: require("../../assets/qy.png"),
                change: true
            }
        };
    },
    computed: {
        ...mapState({
            sessionId: state => state.sessionId,
            userInfo: state => state.User.userInfo
        })
    },
    created() {
    },
    mounted() {
        this.getAccount();
        if (!this.userInfo) {
            this.$store.dispatch("LoginOut");
            this.$router.push("/login");
            return;
        }
    },
    methods: {
        submitUpload() {
            if (this.upLoadData.company_name == "") {
                this.$message.error("公司名称不能为空!");
                return;
            }
            if (!this.submit) {
                if (this.bgUrl) {
                    this.$message.error("请勿上传重复图片!");
                    return;
                }
                this.$message.error("请上传图片!");
                return;
            }

            this.loading = true;
            this.$refs.upload.submit();
        },
        changeImg(file, fileList) {
            this.submit = true;
            const isJPG = file.raw.type.indexOf("image") >= 0;
            const isLt2M = file.size / 1024 / 1024 <= 1.2;
            if (!isJPG) {
                this.$message.error("文件格式不正确!");
                this.$refs.upload.clearFiles();
                return;
            }
            if (!isLt2M) {
                this.$message.error("上传图片大小不能超过1.2MB!");
                this.$refs.upload.clearFiles();
                return;
            }
            if (fileList.length > 1) {
                // this.$refs.upload.clearFiles()
                fileList = [];
                fileList.push(file);
                console.log(fileList);
            }
            this.bgUrl = file.url;
        },
        handleAvatarSuccess(res, file) {
            console.log(res, file);
            this.loading = false;
            this.$refs.upload.clearFiles();
            this.isActive = 1;
        },
        handleAvatarError() {
            console.log(res, file);
            this.loading = false;
        },
        toModify() {
            this.isActive = 0;
        },
        getAccount() {
            let vm = this;
            vm.$Api.getAccount().then(res => {
                vm.loading = false;
                if (res.data && res.data.status) {
                    vm.$store.dispatch("LoginAndSetUserInfo", res.data.data);
                    vm.company_id();
                }
            });
        },
        company_id() {
            let company_id = this.userInfo.company_id;
            this.upLoadData.company_name = this.userInfo.company.name;
            this.bgUrl = this.userInfo.company.biz_license;
            if (
                this.userInfo.company.biz_license &&
                !this.userInfo.company.certified_at
            ) {
                this.isActive = 1;
            } else if (
                this.userInfo.company.biz_license &&
                this.userInfo.company.certified_at
            ) {
                this.isActive = 2;
                this.steps = {
                    step: "认证完成",
                    text: "认证完成",
                    img: require("../../assets/finish.png"),
                    change: false
                };
            }
            if (company_id) {
                this.action =
                    process.env.baseURL +
                    `/companies/${company_id}/certification`;
                this.headers = { "x-session-id": this.sessionId };
            }
        }
    }
};
</script>

<style scoped lang="scss">
.complete {
    text-align: center;
    margin-top: 50px;
    span {
        line-height: 50px;
    }
}
.wrap {
    width: 100%;
    background: #fbfbfb;
}
.red {
    color: #f14e4e;
    font-size: 12px;
}
.scwrap{
   height: calc(100%-69px);
   overflow-y: scroll;
}
.certificat-wrap {
    height: 100%;
    width: 370px;
    margin: 0 auto;
    padding-left: 69px;
}
.form-wrap {
    margin-left: -86px;
    padding-bottom: 20px;
}
.el-button {
    width: 100%;
    height: 50px;
}

.support {
    color: #999;
    font-size: 12px;
}

.el-icon-plus:before {
    content: "";
}

.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    border: none;
}
.avatar-uploader .el-upload:hover {
    border-color: #409eff;
}

.avatar {
    width: 100%;
    height: 310px;
    display: block;
}
.checkin-wrap {
    height: 244px;
    text-align: center;
    margin-left: -60px;
    padding-left: 36px;
    img {
        margin-top: 50px;
    }
    span {
        line-height: 84px;
    }
}
.steps_text_wrap {
    height: 150px;
    padding: 54px 0 54px 133px;
    position: relative;
    img {
        width: 50px;
        position: absolute;
        left: 80px;
        top: 62px;
    }
    .text-wrap {
        display: inline-block;
    }
    .tx1 {
        font-weight: 800;
        font-size: 16px;
        line-height: 38px;
    }
    .tx2 {
        font-size: 12px;
        line-height: 2px;
    }
}

.btnbg {
    text-align: center;
    line-height: 310px;
    font-size: 14px;
    color: #a09d9d;
    width: 300px;
    min-height: 310px;
    text-align: center;
    background: #e5e5e5;
}
.el-button--primary {
    border: none;
}
.modify {
    color: #4c84ff;
    border-bottom: 1px solid #4c84ff;
}
</style>
<style scoped>
.el-steps {
    margin-bottom: 30px;
}
.el-steps >>> .el-step__icon {
    width: 30px;
    height: 30px;
}
.el-steps >>> .el-step__line {
    top: 15px;
}
.bef >>> .is-text {
    color: #fff;
    background: #4c84ff;
    border: #4c84ff;
}
.aft >>> .is-finish .is-text {
    color: #fff;
    background: #4c84ff;
    border: #4c84ff;
}
.el-steps >>> .el-step__title {
    color: #000;
    font-size: 14px;
    padding-left: 10px;
}
.el-steps >>> .is-success .is-text {
    color: #fff;
    background: #4c84ff;
    border: #4c84ff;
}
.el-steps >>> .is-success {
    color: #4c84ff;
    border-color: #4c84ff;
}
.avatar-uploader >>> .el-upload {
    width: 100%;
    background: #dfe2e9;
    border-radius: 2px;
}
.certificat-wrap >>> .el-step__main {
    margin-left: -14px;
}
.certificat-wrap >>> .el-input__inner {
    background: #e5e5e5;
}
.el-form >>> .el-form-item {
    margin: 0;
}
</style>