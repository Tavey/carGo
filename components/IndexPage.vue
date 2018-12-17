<template>
 <div class="mainpage">
     <swiper/>
     <Footer/>
 </div>
</template>

<script>
import Swiper from "./IndexPageSwiper.vue";
import Footer from "./IndexPageFooter.vue";
export default {
    components: {
        Swiper,
        Footer
    },
    data() {
        return {};
    },
    mounted() {}
};
</script>

<style scoped>
.mainpage {
    width: 100%;
    height: 100%;
}
</style>
