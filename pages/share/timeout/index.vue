<template>
    <div class="page">
        <div class="lost-wrap">
            <img src="../../../assets/lost.png" width="206" alt="">
            <div class="sorry">抱歉！您的链接已失效</div>
        </div>
        <global-footer />
    </div>
</template>

<script>
import GlobalFooter from "~/components/global/BaseFooter";
export default {
    components: {
        GlobalFooter
    },
    data() {
        return {};
    },
    methods: {}
};
</script>

<style scoped>
.page,
.entrance {
    height: 100%;
    width: 100%;
    background: #f9f9f9;
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
