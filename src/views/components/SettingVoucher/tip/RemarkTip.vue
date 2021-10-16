<style lang="scss" scoped>
  .description{
    padding: 0;
    margin: 5px 0 20px 0;
    list-style: none;
    li{
      line-height: 22px;
    }
  }
</style>
<template>
  <el-popover placement="top-start" trigger="hover">
    <div style="font-size: 12px">
      <strong>案列</strong>
      <ul class="description">
        <li  v-for="item in tipContent">
          {{item}}
        </li>
      </ul>
      <p>凭证摘要将根据所勾选的发票要素组合生成</p>
    </div>
    <i style="color: #acaeb3" slot="reference" class="el-icon-question"></i>
  </el-popover>
</template>

<script>
  export default {
    props: {
      tipContent: Array
    }
  }
</script>

<style scoped>

</style>
