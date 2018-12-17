<template>
    <div class="add-page"
    >
        <div 
            class="add-btn" 
            @click="$emit('change')"
         > 
            创建跟踪
            <span class="trigger-btn" @click="handleClose('')">  
                <i class="el-icon-close"></i>
            </span> 
         </div>
        <div class="add-car-box" v-if="visible">
            <el-form 
                label-position="top"
                :model="carOrderInfo"
                ref="form"
            >   
                <el-form-item 
                    class="no-required"
                    prop="order_id"
                >
                    <span slot="label">
                        <img src="../assets/orderNum.png" width="20" style="marginBottom: -5px;"/>&nbsp;提运单号
                    </span>
                    <el-input 
                        size="mini"
                        v-model="carOrderInfo.order_id"
                    ></el-input>
                </el-form-item>  
                <el-form-item 
                    label="" 
                    prop="plate_num"
                    :rules="filterRules({type: 'plateNum', required: true})"
                >
                    <span slot="label">
                        <img src="../assets/plateNum.png" width="20" style="marginBottom: -5px;"/>&nbsp;承运车牌号
                    </span>
                    <el-input 
                        size="mini"
                        v-model="carOrderInfo.plate_num"
                    >
                    </el-input>
                </el-form-item>  
                <el-form-item 
                    :error="startAtError"
                    :rules="filterRules({required: true})"
                    prop="origin"
                >
                    <span slot="label">
                        <img src="../assets/address.png" width="20" style="marginBottom: -5px;"/>&nbsp;地址
                    </span>
                    <vehicle-form-input-tip
                        type="origin"
                        placeholder="起运点"
                        ref='mapSearch1'
                        @set-address="setAddress"
                        @clear="clear"
                    />
                </el-form-item>
                <el-form-item 
                    :error="endAtError"
                    :rules="filterRules({required: true})"
                    prop="destination"
                >
                    <vehicle-form-input-tip
                        type="destination"
                        placeholder="交货点"
                        ref='mapSearch2'
                        @set-address="setAddress"
                        @clear="clear"
                    />
                </el-form-item>
                <el-form-item 
                    prop="plan_arrived_at"
                    :rules="filterRules({required: true, type: 'timethannow'})"
                >
                    <span slot="label">
                        <img src="../assets/plantime.png" width="20" style="marginBottom: -5px;"/>&nbsp;计划到达时间
                    </span>
                    <el-date-picker 
                        type="datetime"
                        placeholder="选择日期时间"
                        size="mini"
                        v-model="carOrderInfo.plan_arrived_at"
                        :picker-options="pickerOptions"
                    />
                </el-form-item>
                <!-- <el-switch
                    class="switch-change"
                    v-model="carOrderInfo.is_subscribed"
                    active-text="订阅短信通知">
                </el-switch> -->
                <el-checkbox
                    class="switch-change"
                    v-model="carOrderInfo.is_subscribed"
                >
                    是否订阅短信通知
                </el-checkbox>
                <el-form-item
                    prop="remark"
                >
                    <el-input 
                        type="textarea"
                        :autosize="{minRows: 1, maxRows:4}"
                        maxlength="180"
                        placeholder="备注（180字）"
                        v-model="carOrderInfo.remark"
                    />
                </el-form-item>
                <el-form-item>
                    <el-button class="btn" @click="submitForm" type="primary" size="mini">创建</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
    
</template>
<script>
import VehicleFormInputTip from "./VehicleFormInputTip";
import { mapMutations } from "vuex";
import { type } from "@/store/module/vehicle";
import moment from "moment";
export default {
    data() {
        return {
            pickerOptions: {
                disabledDate(time) {
                    return time.getTime() < Date.now() - 8.64e7;
                }
            },
            carOrderInfo: {
                is_subscribed: true
            },
            startAtError: "",
            endAtError: ""
        };
    },
    props: {
        visible: {
            type: Boolean,
            default: true
        }
    },
    components: {
        VehicleFormInputTip
    },
    methods: {
        ...mapMutations({
            handleClose: type.SET_ACTIVECOMPONENT
        }),
        setAddress(key, val) {
            if (key === "origin") {
                this.carOrderInfo.origin = `${val.district}${val.name}`;
                this.carOrderInfo.origin_gps = val.location;
            } else {
                this.carOrderInfo.destination = `${val.district}${val.name}`;
                this.carOrderInfo.destination_gps = val.location;
            }
        },
        submitForm() {
            if (this.submitting) return;
            let plan_arrived_at = moment(
                this.carOrderInfo.plan_arrived_at
            ).format("YYYY:MM:DD HH:mm:ss");
            this.$refs.form
                .validate()
                .then(res => {
                    if (this.carOrderInfo.order_id) {
                        this.carOrderInfo.order_id = this.carOrderInfo.order_id.toLocaleUpperCase();
                    }
                    this.submitting = true;
                    this.$Api
                        .addCarOrder({ ...this.carOrderInfo, plan_arrived_at })
                        .then(res => {
                            if (res.data.status) {
                                this.$notify({
                                    title: "成功",
                                    message: "创建运单成功",
                                    type: "success"
                                });
                                this.$emit("change");
                                this.$emit("add");
                                this.resetForm();
                            }
                            this.submitting = false;
                        })
                        .catch(err => {
                            this.submitting = false;
                            if (err && err.response) {
                                this.$notify({
                                    title: "创建运单失败",
                                    message: `${err.response.data.msg}`,
                                    type: "warning"
                                });
                            }
                        });
                })
                .catch(err => {
                    console.log(err);
                });
        },
        resetForm() {
            this.$refs.form.resetFields();
            this.$refs.mapSearch1.clear();
            this.$refs.mapSearch2.clear();
        },
        clear() {
            this.$refs.form.clearValidate();
        }
    }
};
</script>
<style scoped>
.add-page {
    position: absolute;
    z-index: 1000;
    min-height: 635px;
    top: 30px;
    left: 20px;
    border-radius: 4px;
    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
}
.add-btn {
    height: 43px;
    line-height: 43px;
    min-width: 255px;
    text-align: center;
    background-color: #5796ff;
    color: #fff;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    border: none;
    position: relative;
    border-radius: 4px 4px 0 0;
}
.withRadius {
    border-radius: 0 20px 20px 0;
}
.add-car-box {
    background-image: linear-gradient(
        to bottom,
        #4c84ff 420px,
        #fff 50%,
        #fff 81%
    );
    padding: 10px 20px;
    font-size: 13px;
    min-width: 255px;
    height: 100%;
    border-radius: 0 0 4px 4px;
}
.title {
    line-height: 25px;
    color: #469df9;
    font-weight: normal;
    text-align: center;
    font-size: 16px;
    margin-bottom: 20px;
}
.leaflet-control-container >>> .leaflet-left {
    right: 10px;
}
.add-car-box >>> .el-checkbox__label {
    color: #000;
}
.add-car-box >>> .el-form-item__label {
    padding: 0;
    line-height: 30px;
    font-size: 12px;
    color: #fff;
    font-weight: 700;
}
.add-car-box >>> .el-form-item__content {
    font-size: 12px;
}
.add-car-box >>> .el-form-item {
    margin-bottom: 16px;
}
.add-car-box >>> .el-input__inner {
    border-radius: 2px;
    height: 40px;
    line-height: 32px;
    background-color: #3b76f5;
    border: none;
    color: #efefef;
}
.add-car-box >>> .el-input__inner::placeholder {
    color: #81baff;
}
.add-car-box >>> .el-icon-time {
    color: #81baff;
}
.add-car-box >>> .el-textarea__inner {
    border-radius: 2px;
    background: #f0f2f5;
}
.el-form >>> .el-button {
    height: 40px;
    width: 100%;
}
.return {
    position: absolute;
    right: 13px;
    top: 15px;
}
.return >>> .el-button {
    padding: 2px;
}
.add-car-box >>> .el-select {
    width: 100%;
}
.add-car-box >>> .el-date-editor.el-input {
    width: 100%;
}

.add-car-box >>> .el-form-item__error {
    padding-top: 0;
    top: 45px;
    color: #efefef;
}
.customer-service {
    margin-top: 40px;
}
.customer-service dl {
    display: flex;
    font-size: 10px;
}
.customer-service dd {
    color: #999;
    margin-right: 5px;
}
.switch-change {
    margin: 25px 0 16px 0;
}
.trigger-btn {
    position: absolute;
    right: 10px;
    top: 1px;
    font-size: 21px;
    cursor: pointer;
}
.el-form >>> .el-form-item__label::before {
    display: none;
}
.el-form >>> .el-form-item.is-required > .el-form-item__label::after {
    content: "（必填）";
    color: #eee;
    margin-left: 0px;
    font-size: 10px;
}
.el-form .no-required >>> .el-form-item__label::after {
    display: none;
}
.el-form >>> .btn {
    background-color: #4c84ff;
}
.el-form >>> .el-textarea__inner {
    resize: none;
}
.el-form >>> .el-checkbox__inner {
    background-color: #4c84ff;
    border-color: #4c84ff;
}
</style>
