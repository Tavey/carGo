import Vue from "vue";
import axios from "axios";
import { axiosInstance, initInstance } from "./axios";
const AMAP_KEY = "e8496e8ac4b0f01100b98da5bde96597";

export const $API = {
    // 高德地图 地址自动补全
    mapAutoComplete(keywords) {
        return axios.get(
            "http://restapi.amap.com/v3/assistant/inputtips?parameters",
            {
                params: {
                    key: AMAP_KEY,
                    keywords: keywords,
                    datatype: "poi"
                }
            }
        );
    },
    //登录
    accountLogin(mobile, code) {
        return axiosInstance.post("/account/login", {
            mobile: mobile,
            code: code
        });
    },
    // 登出
    accountLoginout() {
        return axiosInstance.get("/account/logout");
    },
    //验证
    accountVerification(mobile, type) {
        return axiosInstance.get("/account/verification", {
            params: {
                mobile: mobile,
                type: type
            }
        });
    },
    //注册
    accountRegister(username, mobile, company_name, code) {
        return axiosInstance.post("/account/register", {
            username: username,
            mobile: mobile,
            company_name: company_name,
            code: code
        });
    },
    // 创建运单
    addCarOrder(carInfo) {
        return axiosInstance.post("/subscriptions/shipping", carInfo);
    },
    //删除运单
    delShipping(shipping_id) {
        return axiosInstance.delete(`/subscriptions/shipping/${shipping_id}`);
    },
    //活跃运单列表
    getShipping() {
        return axiosInstance.get("/subscriptions/shipping");
    },
    historyShipping(page, page_size) {
        return axiosInstance.get("/subscriptions/shipping/history", {
            params: {
                page: page,
                page_size: page_size
            }
        });
    },
    // 地理位置逆编码
    geoCode(lng, lat) {
        return axios.get(
            "http://restapi.amap.com/v3/geocode/regeo?parameters",
            {
                params: {
                    key: AMAP_KEY,
                    location: `${lng},${lat}`
                }
            }
        );
    },
    // 分享运单
    shareShipping(shipping_id) {
        return axiosInstance.post(
            `/subscriptions/shipping/${shipping_id}/share`
        );
    },
    // 修改分享密码
    shareShippingPass(sharing_id, password) {
        return axiosInstance.put(
            `/subscriptions/sharing/${sharing_id}/password`,
            {
                password
            }
        );
    },
    // 发送分享
    shareShippingSend(sharing_id, targets) {
        return axiosInstance.post(`/subscriptions/sharing/${sharing_id}/send`, {
            targets
        });
    },
    //获取
    getShare(share_id, password) {
        return axiosInstance.get(`/guest/subscriptions/sharing/${share_id}`, {
            params: {
                password
            }
        });
    },
    //获取跟踪运单
    getTrace(trace_id) {
        return axiosInstance.get(`/guest/subscriptions/trace/${trace_id}`);
    },
    // 微信签名获取
    getWXSignature(url) {
        return axios.get("http://hbwx.ece2.top/wechat/jssdk", {
            params: {
                url
            }
        });
    },
    //获取同事列表
    getColleagues(company_id) {
        return axiosInstance.get(`/companies/${company_id}/colleagues`);
    },
    //账号信息
    getAccount() {
        return axiosInstance.get("/account");
    },
    // 获取历史标签
    getHistories(type) {
        return axiosInstance.get("/users/current/histories", {
            params: {
                type: type
            }
        });
    },
    // 获取历史标签
    getQueryHistoryTag() {
        return axiosInstance.get(`/users/current/histories`, {
            params: {
                type: "plate_num"
            }
        });
    },
    // 删除历史标签
    deleteQueryHistoryTag(tagId) {
        return axiosInstance.delete(`/users/current/histories/${tagId}`);
    },
    // 创建单车跟踪
    generateSingleTrace(plate_num) {
        return axiosInstance.post(`/subscriptions/trace/single`, {
            plate_num
        });
    },
    // 获取单车跟踪列表
    getSingleTraceList() {
        return axiosInstance.get(`/subscriptions/trace/single`);
    },
    // 获取并刷新单车跟踪信息
    updateSingleTrace(trace_id) {
        return axiosInstance.post(`/subscriptions/trace/single/${trace_id}`, {
            trace_id
        });
    },
    // 删除单车跟踪
    deleteSingleTrace(trace_id) {
        return axiosInstance.delete(`/subscriptions/trace/single/${trace_id}`, {
            trace_id
        });
    },
    // 获取多车跟踪
    getMultiTrace() {
        return axiosInstance.get(`/subscriptions/trace/multi`);
    },
    // 创建或更新多车跟踪
    createMultiTrace(plate_nums) {
        return axiosInstance.post(`/subscriptions/trace/multi`, {
            plate_nums
        });
    },
    // 获取行程轨迹
    getTraceRecord(shipping_id) {
        return axiosInstance.get(
            `/subscriptions/shipping/track_record/${shipping_id}`
        )
    },
};

const API_PLUGIN = {
    install(Vue, store) {
        Vue.prototype.$Api = $API;
    }
};

export default ({ store, redirect }) => {
    initInstance(store.state.sessionId, redirect);
    Vue.use(API_PLUGIN, store);
};
