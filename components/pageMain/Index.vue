<template>
 <div class="mainpage">
     <swiper/>
     <query/>
     <Footer/>
 </div>
</template>

<script>
import Swiper from "./Swiper.vue";
import Footer from "./Footer.vue";
import Query from "./Query.vue";
export default {
    components: {
        Swiper,
        Footer,
        Query
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
