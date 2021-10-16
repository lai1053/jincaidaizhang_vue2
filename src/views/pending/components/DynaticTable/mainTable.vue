<style lang='scss' scoped>
  .vue-main {
    margin-bottom: 15px;
    border-top: 1px solid #e3e8ee;
    border-left: 1px solid #e3e8ee;
    .vue-row-col {
      height: 31px;
      line-height: 30px;
      border-right: 1px solid #e3e8ee;
      border-bottom: 1px solid #e3e8ee;
      -webkit-box-sizing: border-box;
      -moz-box-sizing: border-box;
      box-sizing: border-box;
    }

    .vue-row-col-bg {
      padding: 0 6px;
      text-align: right;
      background-color: #fafafa;
    }

    .vue-must {
      color: red;
      margin-left: 3px;
    }
    .vue-edit-box {
      width: 100%;
    }
  }
</style>
<style lang='scss'>
  .txt_r{
    padding-left: 10px;
  }
  .vue-main-create {
    .el-input__inner {
      height: 30px;
      line-height: 30px;
      border: none;
      border-radius: 0;
    }
  }

  .auto-complete-t {
    display: none !important;
  }

  .auto-complete, .auto-complete-t {
    .el-scrollbar {
      padding-bottom: 34px;
    }
    .el-scrollbar {
      display: block !important;
    }
    .el-select-dropdown__wrap {
      max-height: 218px;
    }
    ul {
      position: static !important;
      .auto-complete-btn {
        width: 100%;
        height: 34px;
        line-height: 34px;
        border-top: 1px solid #d7dde4;
        text-align: center;
        position: absolute;
        bottom: 0;
        border-bottom-right-radius: 4px;
        border-bottom-left-radius: 4px;
        background-color: #F5F6F7;
      }
    }
  }
</style>
<template>
  <div class="mainTable">
    <el-row class="vue-main vue-main-create">
      <!-- {{mainData}} -->
      <!-- 发票性质 -->
      <el-col :span="8">
        <el-col :span="8" class="vue-row-col vue-row-col-bg">
          <span>发票类型</span>
          <!-- <span class="vue-must">*</span> -->
        </el-col>
        <el-col :span="16" class="vue-row-col">
          <span class="txt_r">{{mainData.inv_type_name}}</span>
        </el-col>
      </el-col>

      <el-col :span="8">
        <el-col :span="8" class="vue-row-col vue-row-col-bg">
          <span>开票日期</span>
          <!-- <span class="vue-must">*</span> -->
        </el-col>
        <el-col :span="16" class="vue-row-col">
          <span class="txt_r">{{mainData.kprq}}</span>
        </el-col>
      </el-col>
      <el-col :span="8">
        <el-col :span="8" class="vue-row-col vue-row-col-bg">
          <span>供应商</span>
          <!-- <span class="vue-must">*</span> -->
        </el-col>
        <el-col :span="16" class="vue-row-col text_ellipsis">
          <span class="txt_r" :title="mainData.fkfmc">{{mainData.fkfmc}}</span>
        </el-col>
      </el-col>
      <el-col :span="8">
        <el-col :span="8" class="vue-row-col vue-row-col-bg">
          <span>发票号码</span>
          <!-- <span class="vue-must">*</span> -->
        </el-col>
        <el-col :span="16" class="vue-row-col">
          <span class="txt_r">{{mainData.inv_no}}</span>
        </el-col>
      </el-col>
      <el-col :span="8">
        <el-col :span="8" class="vue-row-col vue-row-col-bg">
          <span>发票代码</span>
          <!-- <span class="vue-must">*</span> -->
        </el-col>
        <el-col :span="16" class="vue-row-col">
          <span class="txt_r">{{mainData.inv_code}}</span>
        </el-col>
      </el-col>
      <el-col :span="8">
        <el-col :span="8" class="vue-row-col vue-row-col-bg">
          <span>&nbsp;</span>
          <!-- <span class="vue-must">*</span> -->
        </el-col>
        <el-col :span="16" class="vue-row-col">
          <span class="txt_r">&nbsp;</span>
        </el-col>
      </el-col>

      <!-- 业务说明 -->
      <!-- <el-col :span="24" v-if="access !== 'multiple'">
        <el-col :span="3" class="vue-row-col vue-row-col-bg">
          <span>业务说明</span>
        </el-col>
        <el-col :span="21" class="vue-row-col">
          <el-input v-model="data.trans_desc" :readonly="readState"></el-input>
        </el-col>
      </el-col> -->
    </el-row>

  </div>
</template>

<script>


  export default {
    name: 'mainTable',
    props: {
      mainData: Object,     // 主档数据
      // access: String,       // 入口 编辑-> edit; 新增->create; 批量设置->multiple; 查看（已生成凭证）->voucher
      // batchBill: Array      // 批量设置 -> 传入需要设置的清单
    },
    data () {
      return {

      }
    },
    created () {
      //this.initData()
    },
    computed: {

    },
    methods: {

    },
    watch: {

    }
  }
</script>
