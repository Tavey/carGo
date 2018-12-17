<template>
  <el-header
    height="42px"
    class="header"
  >
      <el-row
          type="flex"
          justify="space-between"
          align="middle"
      >
          <el-col :span="5">
              <div class="nav-bar">
               <img src="../../assets/where.png" width="10" alt="" class="where">
                <el-menu
                    mode="horizontal"
                    router
                    :default-active="$route.path"
                >
                    <el-menu-item index="/">货单跟踪</el-menu-item>
                    <el-menu-item index="/history">历史记录</el-menu-item>
                </el-menu>
              </div>
          </el-col>
          <div class="user-login-out">
              <span
                class="user"
              >
                  <span
                    v-title:5="userInfo ? userInfo.name : null"
                  ></span>
                  <span class="line"></span>
                  <p
                    class="company"
                    v-title:12="userInfo ? userInfo.company.name : null"
                  ></p>
              </span>
              <i @click="loginOut"><img  src="../../assets/loginout.png" /></i>
              <!-- <img  class="img" src="../../assets/good.png" alt=""> -->
          </div>

      </el-row>
  </el-header>
</template>
<script>
import { mapGetters } from "vuex";
export default {
    props: {
        user: {
            type: String,
            default: ""
        }
    },
    computed: {
        ...mapGetters(["userInfo"])
    },
    methods: {
        loginOut() {
            this.$Api.accountLoginout().then((res) => {
                // if (res.data.status) {
                    this.$store.dispatch("LoginOut");
                    this.$router.push("/login");
                // }
            });
        }
    }
};
</script>
<style scoped>
.el-header {
    padding-left: 20px;
    padding-right: 9px;
}
.header {
    font-size: 12px;
    border-bottom: 1px solid #eee;
}
.nav-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.header >>> .el-row {
    height: 100%;
}
.header >>> .el-menu-item {
    font-size: 12px;
    color: #000;
    height: 26px;
    width: 76px;
    line-height: 26px;
    text-align: center;
    padding: 0;
    border-bottom-right-radius: 999px;
    border-bottom-left-radius: 999px;
    border-top-left-radius: 999px;
    border-top-right-radius: 999px;
    margin: 0 10px;
}
.header >>> .el-menu--horizontal {
    border: 0;
}
.header >>> .el-menu--horizontal > .el-menu-item.is-active {
    color: #fff;
    background-color: #409dff;
}
.user-login-out {
    display: flex;
    justify-content: flex-end;
    align-items: end;
    cursor: pointer;
    min-width: 255px;
}
.user-login-out .user {
    margin-right: 20px;
    display: flex;
    align-items: center;
}
.where {
    height: 22px;
    width: 88px;
}
.el-menu {
    position: fixed;
    left: 135px;
}
.img {
    margin-left: 34px;
}
.company {
    display: inline-block;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    padding: 0;
    margin: 0;
}
.line {
    width: 10px;
    height: 1px;
    display: inline-block;
    background-color: #000;
    margin: 0 2px;
}
</style>
