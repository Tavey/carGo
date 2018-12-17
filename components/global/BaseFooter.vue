<template>
  <div class="footer">
      <ul class="footer-nav">
          <li>Copyright &copy; 2018 华保科技.保留所有权利.|浙ICP备17010660号-3</li>
          <li>|</li>
          <li>客服电话: 021-34216186  (周一至周五 10:00-17:00)</li>
          <li>|</li>
          <li>客服邮箱: <a  style="color: #999" href="mailto:support@huabaotech.com">support@huabaotech.com</a></li>
      </ul>
  </div>
</template>
<script>
export default {};
</script>
<style scoped>
.footer {
    height: 28px;
    z-index: 1000;
}
.footer-nav {
    margin: 0;
    font-size: 11px;
    color: #999;
    background-color: #f9f9f9;
    position: fixed;
    bottom: 0;
    width: 100%;
    line-height: 28px;
}
.footer-nav {
    width: 100%;
    padding: 0 15%;
    list-style: none;
    display: flex;
    align-items: center;
    justify-content: space-around;
}
</style>
