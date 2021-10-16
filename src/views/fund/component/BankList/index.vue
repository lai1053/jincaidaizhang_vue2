<style lang='scss'>
  .bank-list.el-table::before {
    height: 0;
  }
  .bank-list.el-table .cell {
    padding-left: 20px;
    padding-right: 20px;
  }
  .bank-list {
    input.el-input__inner {
      border-color: #e0efef;
      height: 30px;
      line-height: 30px;
    }
    .operation-add-icon {
      .cell {
        position: relative;
      }
      .add-icon {
        position: absolute;
        top: 50%;
        right: 6px;
        margin-top: -19px;
        .el-icon-circle-plus-outline {
          color: #1ab394;
        }
      }
    }
    .bank_acct_code_box {
      .cell {
        padding-right: 6px;
      }
      .el-select {
        width: calc(100% - 26px);
      }
      .fuzhu {
        top: 9px;
        right: 10px;
      }
    }
  }
</style>
<template>
  <div>
    <el-table
      :data="editBank.list"
      header-align="center"
      height="360"
      stripe
      highlight-current-row
      @cell-mouse-enter="mouseEnter"
      @cell-mouse-leave="mouseLeave"
      @sort-change="sortChange"
      ref="tableScroll"
      class="bank-list"
      style="width: 100%;">
      <el-table-column
        v-for="(item, i) in editBank.columns"
        v-if="!item.hide"
        :prop="item.prop"
        :label="item.label"
        :align="item.align"
        :width="item.width"
        :class-name="item.className"
        :key="item.key"
        :sortable="item.sortable"
        :show-overflow-tooltip="item.tip?true:false">
        <template slot-scope="scope">
          <template v-if="item.prop==='bank_acct_code'">
            <el-select
              v-model="scope.row[item.prop]"
              popper-class="auto-complete"
              class="vue-edit-box"
              placeholder=""
              clearable
              filterable
              @change="changeSelect(scope.row)"
              no-match-text="">
              <el-option
                v-for="(item, i) in bankCodeList"
                :key="i"
                :label="item.account"
                :value="item.account">
                <span>{{item.account}}</span>
                <el-tooltip class="item" effect="dark" :content="item.tip" placement="top-start">
                  <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                </el-tooltip>
              </el-option>
              <div class="auto-complete-btn" @click="addSub(scope.row)">
                <i class="el-icon-circle-plus-outline" style="color: #999999;"></i>
                <span>新增</span>
              </div>
            </el-select>
            <span
              v-if="isAssist(scope.row.bank_acct_code)"
              class="fuzhu"
              :class="scope.row.bank_acct_ci_name?'fuzhu-selected-color':''"
              @click="showAssist(scope.row)">辅</span>
          </template>
          <template v-else-if="item.prop==='bank_state'">
            <el-select
              v-model="scope.row[item.prop]"
              class="vue-edit-box"
              placeholder=""
              filterable
              no-match-text="">
              <el-option label="启用" value="1"></el-option>
              <el-option label="停用" value="4"></el-option>
            </el-select>
          </template>
          <template v-else-if="item.prop==='operation'">
            <el-button @click="deleteDetail(scope.$index, scope.row)" type="text" size="small" style="color: #1ab394;">删除</el-button>
            <el-button v-if="scope.row.showIcon" @click="addRow(scope.$index, scope.row)" type="text" size="small" class="add-icon">
              <i class="el-icon-circle-plus-outline" ></i>
            </el-button>
          </template>
          <template v-else-if="item.prop==='ccy_name'">
            {{scope.row[item.prop]}}
          </template>
          <template v-else>
            <span v-if="scope.row.id!==0">{{scope.row[item.prop]}}</span>
            <el-input
              v-else
              v-model="scope.row[item.prop]"
            ></el-input>
          </template>
        </template>
      </el-table-column>
    </el-table>
    <!--新增科目-->
    <add-subject
      :subject-data="subjectData"
      @on-add-after="onAddSubAfter"
    ></add-subject>
    <!-- 辅助核算 -->
    <assist-accounting
      :accountingData="accountingData"
      @refreshList="getAssist"
      @addAssissData="addAssistData"
    ></assist-accounting>
  </div>
</template>
<script>
  import AddSubject from '@/views/components/AddAcct/index'
  import {getLastStageCode} from '@/utils/eval'

  import {subData} from '@/views/components/data/common'
  import {deepCopy} from '@/utils/assist'
  import {sortChange} from '@/utils/utils'
  import {MessageBox} from 'element-ui'

  // 辅助核算
  import AssistAccounting from '@/views/components/assistAccounting/index'
  import {showFuzhu, isAssist} from '@/views/components/assistAccounting/eval'
  import {assistData} from '@/views/components/assistAccounting/data'
  import {getCurrencyCode} from '@/views/components/AddAcct/eval'

  export default {
    name: 'BankList',
    data() {
      return {
        subjectData: deepCopy(subData), // 科目新增
        accountingData: assistData, // 辅助核算所需字段
        rowData: {},
        currencyCode: getCurrencyCode('fund')
      }
    },
    props: {
      editBank: Object
    },
    components: {
      AddSubject,
      AssistAccounting
    },
    created() {
    },
    watch: {
    },
    methods: {
      mouseEnter (row) {
        row.showIcon = true
      },
      mouseLeave (row) {
        row.showIcon = false
      },
      sortChange(e) {
        if (!e.prop) return
        sortChange(this.editBank.list, e)
      },
      deleteDetail(rowIdx, row) {
        if (row.id) {
          if (String(row.bill_state) === '1') {
            return MessageBox.alert('该账号已导入对账单！ 如确需删除，请先删除对账单。', '删除失败', {
              confirmButtonText: '确定',
              type: 'warning',
              callback: action => {}
            })
          }
          this.editBank.delList.push({
            ent_id: row.ent_id,
            id: row.id,
            operateType: '3',
            bank_name: row.bank_name,
            bank_num: row.bank_num,
            bank_acct_code: row.bank_acct_code,
            ccy_name: row.ccy_name,
            bank_state: row.bank_state
          })
        }
        this.editBank.list.splice(rowIdx, 1)
      },
      addRow() {
        this.editBank.list.push({
          id: 0,
          bank_name: '',
          bank_num: '',
          ccy_name: '人民币',
          bank_acct_code: '',
          bank_acct_ci_name: '',
          bank_state: '1'
        })
      },
      addSub(row) {
        this.subjectData = deepCopy(subData)
        this.subjectData.superiorSub.code = ['1002']
        this.subjectData.accounting.code = this.currencyCode
        this.subjectData.accounting.type =  'all'
        this.subjectData.subModal = true
        this.subjectData.removeCurrency = true
        this.rowData = row
      },
      onAddSubAfter(code) {
        const {newSubVal, moneyCheck, moneyType} = this.subjectData
        if (!moneyCheck && !moneyType) {
          this.rowData.bank_acct_code = `${code} ${newSubVal}`
        }
      },
      showAssist(row) {
        this.rowData = row
        const curValArray = row.bank_acct_code.split(' ')
        this.accountingData.title = `${curValArray[0]} ${curValArray[1]}`
        this.accountingData.tips = ''
        this.accountingData.acctCiName = row.bank_acct_ci_name
        this.getAssist()
      },
      isAssist(acct) {
        return isAssist(acct)
      },
      getAssist() {
        showFuzhu(this.accountingData)
      },
      addAssistData(value) {
        this.rowData.bank_acct_ci_name = value
      },
      changeSelect(row) {
        row.bank_acct_ci_name = ''
      }
    },
    computed: {
      bankCodeList() {
        return getLastStageCode(['1002'], true)
      }
    },
    mounted() {
    }
  }
</script>
