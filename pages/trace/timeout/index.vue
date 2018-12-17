<template>
    <div class="page">
        <div class="lost-wrap">
            <img src="../../../assets/lost.png" width="150" alt="" class="img">
            <div class="sorry">抱歉！您的链接已失效</div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            
        };
    },
    methods: {
       
    }
};
</script>

<style scoped>
.page,.entrance{
    height: 100%;
    width: 100%;
    background: #f9f9f9;
}
img{
    margin-right: -15px;
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
    line-height: 64px;
}
</style>
