<template>
  <!-- 票据查看 -->
  <el-dialog title="票据查看" :visible.sync="dynatic.visible" :close-on-click-modal="false" width="1100px" class="pending-modal">
    <!-- 主档 -->
    <main-table
      :mainData="mainData"
    ></main-table>
    <!-- 从档 -->
    <vice-table
      :tableData="tableData"
      :btnObj="btnObj"
    ></vice-table>
    <div slot="footer" style="height: 32px;">
      <amount-count style="width:80%;display: inline-block;"
                    :total="mainData.pendingDetailVOList.length"
                    :sum="mainData.ex_tax_amount"
                    :tax="mainData.tax_amount"
                    :amount="mainData.amount"
      ></amount-count>
      <el-dropdown @command="handleCommand" placement="top-end" style="float: right;">
        <el-button size="small" type="primary" icon="el-icon-more">
          <!-- 操作 -->分配<i class="el-icon-arrow-down el-icon--right"></i>
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="moveToPurchase"><i class="fas fa-sign-out-alt"></i> 采购</el-dropdown-item>
          <el-dropdown-item command="batchDelete"><i class="fas fa-trash-alt"></i> 清空</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </el-dialog>
</template>

<script>
  import mainTable from './DynaticTable/mainTable'
  import viceTable from './DynaticTable/viceTable'
  import amountCount from '@/views/components/AmountCount.vue'

  // api
  import {
    batchUpdateState, //状态更改
    pendingDistribute,  //分配至
    batchDelete,        //清空回收站

  } from '@/api/pending'
  import {Message, MessageBox} from 'element-ui'
  export default {
    name: 'dataDetail', // 查看数据
    data () {
      return {
      }
    },
    props: {
      dynatic: {
        Type: Object,
        default: {}
      },
      mainData: {
        Type: Object,
        default: {}
      },
      tableData: {
        Type: Array,
        default: []
      }
    },
    created () {
    },
    computed: {
    },
    methods: {
      // 更多
      handleCommand (command) {
        if (command === 'batchDelete') {
          return MessageBox.alert('确定要删除数据?删除后无法恢复', '操作确认', {
            confirmButtonText: '确定',
            type: 'warning',
            callback: action => {
              if (action === 'confirm') {
                this.$emit('on-clear-data', this.mainData.id)
              }
            }
          })
        } else {
          this.$emit('on-move-to-purchase', this.mainData.id)
        }
      }

    },
    watch: {
    },
    components: {
      mainTable,
      viceTable,
      amountCount
    }
  }
</script>

<style lang="scss" scoped>

</style>
