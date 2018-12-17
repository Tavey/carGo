<template>
    <el-header 
        class="header"
        height="auto"    
        :class="$route.path === '/' ? 'opacity-header' : ''"
    >
        <div class="header-top">
            <div   class="test">
                <!-- <span   class="login-slogan">欢迎访问平台, 
                    <router-link to="/register">注册</router-link>/
                    <router-link to="/login">登录</router-link>
                </span> -->
           <img src="../assets/where.png" alt="" class="logo" width="80">
            </div> 
            <div>
                <ul class="header-nav">
                    <li>
                        <a href="http://www.huabaotech.com">关于我们</a>
                    </li>
                    <li class="cut-line">|</li>
                    <li  class="certificat" @click="toCertificat">
                        企业认证
                    </li>
                    <!-- <li class="cut-line">|</li> -->
                    <!-- <li>
                        会员商城
                    </li> -->
                    <li class="cut-line"></li>
                    <li v-if="!userInfo">
                        <nuxt-link 
                            to="/login"
                        >
                            登录
                        </nuxt-link>

                    </li>
                    <li v-else>
                        <el-dropdown  >
                          <span class="el-dropdown-link">
                            <span
                              v-title:5="userInfo ? userInfo.name : null"
                            ></span>
                            <i class="el-icon-arrow-down el-icon--right" ></i>
                          </span>
                          <el-dropdown-menu slot="dropdown" >
                            <el-dropdown-item @click.native="toPersonal">个人中心</el-dropdown-item>
                            <el-dropdown-item @click.native="toCertificat">快速认证</el-dropdown-item>
                            <el-dropdown-item @click.native="loginOut">退出</el-dropdown-item>
                          </el-dropdown-menu>
                        </el-dropdown>
                    </li>
                </ul>
            </div>
        </div>
        <div class="row-line"></div>
        <div
            class="header-tab"
        >
           <ul>
                <li>
                    <router-link  exact to="/" tag="span">首页</router-link>
                </li>
                <li>
                    <router-link  to="/vehicle" tag="span">车辆跟踪</router-link>
                </li>
                <!-- <li>
                    <span>速查工具</span>
                </li> -->
            </ul>
        </div>
    </el-header>
</template>
<script>
import { mapState } from "vuex";
export default {
    computed: {
        ...mapState({
            userInfo: state => state.User.userInfo
        })
    },
    methods: {
        loginOut() {
            this.$Api.accountLoginout().then(res => {
                if (res.data.status) {
                    this.$store.dispatch("LoginOut");
                    this.$router.push("/login");
                }
            });
        },
        toPersonal() {
            this.$router.push("/personal");
        },
        toCertificat() {
            this.$router.push("/certificat");
        }
    }
};
</script>
<style lang="scss" scoped>
.header {
    font-size: 12px;
    background-color: #2b3039;
    color: #fff;
    padding: 0 80px;
    width: 100%;
    a {
        text-decoration: none;
        color: #fff;
    }
}
.row-line {
    width: 100%;
    height: 1px;
    background-color: rgba(255, 255, 255, 0.1);
    position: absolute;
    left: 0;
}
.header-top {
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    max-width: 1200px;
    margin: auto;
}
.header-nav {
    list-style: none;
    li {
        display: inline-block;
    }
    li.cut-line {
        margin: 0 10px;
        position: relative;
        top: -1px;
    }
    .el-dropdown-link {
        color: #fff;
        font-size: 12px;
    }
}
.header-tab {
    list-style: none;
    height: 60px;
    line-height: 60px;
    display: flex;
    justify-content: center;
    li {
        display: inline-block;
        margin: 0 25px;
        span {
            padding: 6px 20px;
            cursor: pointer;
            font-size: 14px;
        }
    }
}
.opacity-header {
    background-color: rgba(43, 48, 57, 0.3);
    position: absolute;
    z-index: 101;
}
.opacity-header:hover {
    background-color: rgba(43, 48, 57, 1);
}
.certificat {
    cursor: pointer;
}
</style>
<style scoped>
.header >>> .nuxt-link-active {
    background-image: linear-gradient(to right, #2760ec, #388df5);
    border-radius: 22px;
}
.header >>> .el-dropdown-menu__item:focus,
.el-dropdown-menu__item:not(.is-disabled):hover {
    background-color: #ecf5ff;
    color: #4c84ff;
}
</style>
