<style lang='scss' scoped>
</style>
<style lang='scss'>
  .el-table::before {
    height: 0;
  }

  .el-table.vue-vice-file {
    border: 1px solid #e7ebf5;
    .el-input__inner {
      height: 30px;
      line-height: 30px;
      border: none;
      padding: 0 8px;
      border-radius: 0;
      background-color: rgba(225, 225, 225, 0);
    }
    .el-input__inner:hover {
      border: 1px solid #63bf5c;
    }
    .el-input__suffix {
      display: none;
    }
    .el-table__body-wrapper {
      overflow-x: auto;
    }
  }

  .add-card {
    span {
      color: #FFFFFF;
      background-color: #1ab394;
      width: 16px;
      height: 16px;
      line-height: 16px;
      border-radius: 2px;
      display: block;
      [class*=" el-icon-"], [class^=el-icon-] {
        font-weight: 600;
      }
    }
  }
</style>

<template>
  <div>
    <el-table
      stripe
      :data="tableData"
      v-loading="loading"
      height="250"
      class="vue-table vue-vice-file">
      <!-- 商品或服务名称 -->
      <el-table-column
        label="商品或服务名称"
        show-overflow-tooltip
        >
        <template slot-scope="scope">
          {{scope.row.goods_name}}
        </template>
      </el-table-column>

      <el-table-column
        label="规格型号">
        <template slot-scope="scope">
          {{scope.row.specification}}
        </template>
      </el-table-column>
      <el-table-column
        label="单位">
        <template slot-scope="scope">
          {{scope.row.unit_name}}
        </template>
      </el-table-column>
      <el-table-column
        label="数量">
        <template slot-scope="scope">
          {{scope.row.qty}}
        </template>
      </el-table-column>
      <el-table-column
        label="单价">
        <template slot-scope="scope">
          {{scope.row.unit_price}}
        </template>
      </el-table-column>
      <el-table-column
        label="金额">
        <template slot-scope="scope">
          {{scope.row.amount}}
        </template>
      </el-table-column>

      <el-table-column
        label="税率">
        <template slot-scope="scope">
          {{scope.row.tax_rate *100}}%
        </template>
      </el-table-column>
      <el-table-column
        label="增值税税额">
        <template slot-scope="scope">
          {{scope.row.tax_amount}}
        </template>
      </el-table-column>
      <el-table-column
        label="价税合计">
        <template slot-scope="scope">
          {{(scope.row.jshj)}}
        </template>
      </el-table-column>

    </el-table>
  </div>
</template>

<script>
  import { Loading } from 'element-ui'

  export default {
    name: 'viceTable',
    props: {
      tableData: Array,    //表格数据
      btnObj: Object,      //按钮组控制
      //viceData: Array,    // 从档数据
      // subState: String,   // 导航
      // access: String      // 入口= 编辑-> edit 新增->create  已生成凭证 ->voucher
    },
    data () {
      return {
        // columns: Columns,
        // viceList: [],
        loading: false,
        // taxList: [],         // 税率
        // expenseType: [],     // 费用类型
        // deductionType: [],   // 抵扣类型
        // accountList: [],     // 借方科目
        // readState: false,     // 只读状态
        // mustList: mustList
      }
    },
    created () {
      // let vm = this;
      // setTimeout(function(){
      //   vm.amountList.total = vm.tableData.length;
      //   console.log('=====',vm.tableData)
      // },500)

    },
    mounted() {


    },
    computed: {

    },
    methods: {
    },
    watch: {
    },
    components: {
    }
  }
</script>
