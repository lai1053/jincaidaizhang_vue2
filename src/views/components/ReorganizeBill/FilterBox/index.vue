<style lang="scss" scope>
  .filter-box{
    ul,li{
      list-style: none;
      padding: 0;
      margin: 0;
    }
    li {
      line-height: 30px;
    }
    .result-box{
      margin-top: 5px;
      height: 210px;
      width: 200px;
      border:1px solid #f3f3f8;
      overflow-y: auto;
    }
  }
</style>
<template>
  <div class="filter-box">
    <el-popover
      :visible-arrow="false"
      placement="top"
      popper-class="filter-box"
      v-model="visible">
      <div>
        <ul>
          <li>升序</li>
          <li>降序</li>
        </ul>
        <el-input size="small" placeholder="请输入内容" suffix-icon="el-icon-search"></el-input>
        <div class="result-box">
          <ul>
            <li v-for="item in searchList" :key="item">{{item}}</li>
          </ul>
        </div>
        <!--<el-button type="primary" @click="sureFilter">主要按钮</el-button>-->
        <!--<el-button type="success" @click="visible = false">成功按钮</el-button>-->
      </div>
      <i class="el-icon-caret-bottom" slot="reference" @click="clickFilter"></i>
    </el-popover>
  </div>
</template>

<script>
    export default {
      props: {
        searchList: Array
      },
      data() {
        return {
          visible: false
        }
      },
      methods: {
        clickFilter () {
        },
        sureFilter () {}
      }
    }
</script>

<style scoped>

</style>
