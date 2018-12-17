<template>
    <div id="globalLayout">
        <no-ssr>
           <base-header></base-header>
        </no-ssr>
        <el-container id="globalContainer">
            <nuxt-child></nuxt-child>
        </el-container>    
    </div>   
</template>
<script>
import BaseHeader from "~/components/BaseHeader";
export default {
    components: {
        BaseHeader
    }
};
</script>
<style  scoped>
#globalLayout {
    height: 100%;
}
#globalContainer {
     height: calc(100% - 92px);
}
</style>
