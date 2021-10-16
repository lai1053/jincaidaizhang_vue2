<style lang='scss'>
</style>
<template>
  <div class="subject-confirm">
    <div class="subject-confirm-head">
      <el-input v-model="inputVal" @input="inpFilter" placeholder="请输入对方户名" size="small">
        <i slot="prefix" class="el-input__icon el-icon-search"></i>
      </el-input>
      <div class="head_radio-group">
        <el-radio-group v-model="subModal.radio" @change="changeRadioType">
          <el-radio label="no">未确认({{subModal.noNum}})</el-radio>
          <el-radio label="all">全部({{subModal.allNum}})</el-radio>
        </el-radio-group>
      </div>
      <!--帮助-->
      <help-modal main-menu="fund"></help-modal>
    </div>
    <el-table
      :data="subModal.list.slice(pageSize * (currentPage-1), pageSize*currentPage)"
      header-align="center"
      height="320"
      stripe
      highlight-current-row
      ref="tableScroll"
      @cell-mouse-enter="mouseEnter"
      @cell-mouse-leave="mouseLeave"
      @cell-click="clickCell"
      style="width: 100%">
      <el-table-column
        type="index"
        label="行号"
        cess-style="hideRowName"
        width="70">
      </el-table-column>
      <el-table-column
        prop="counterparty"
        show-overflow-tooltip
        label="对方户名"
        width="240"
        label-class-name="main-type-class"
        align="left">
      </el-table-column>
      <el-table-column
        prop="collectionTotal"
        label="收款流水"
        width="100"
        align="left"
      ></el-table-column>
      <el-table-column
        prop="paymentTotal"
        label="付款流水"
        width="100"
        align="left"
      ></el-table-column>
      <!-- 本账套科目 -->
      <el-table-column
        prop="acct"
        label="会计科目"
        class-name="edit-row-box"
        align="left">
        <template slot-scope="scope">
          <template v-if="scope.row.isEdit">
            <el-select
              v-model="scope.row.acct"
              auto-complete
              filterable
              width="106px"
              size="small"
              class="vue-edit-box"
              popper-class="auto-complete"
              clearable
              placeholder=""
              remote
              v-loadmore="loadMore"
              :remote-method="remoteMethod"
              @visible-change="selectVisibleChange($event, scope.row.acct)"
              @change="handleChange(scope.row)">
              <el-option
                v-for="(item, i) in accountList"
                :key="item.account"
                :label="item.account"
                :value="item.account"
                :disabled="item.edit">
                <span>{{item.account}}</span>
                <el-tooltip class="item" effect="dark" :content="item.tip" placement="top-start">
                  <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                </el-tooltip>
              </el-option>
              <!-- 默认状态下 -->
              <div class="auto-complete-btn" @click="addSub(scope.row)">
                <i class="el-icon-circle-plus-outline"></i>
                <span>新增</span>
              </div>
            </el-select>
            <!--<span-->
              <!--v-if="isAssist(scope.row.acct)"-->
              <!--class="fuzhu"-->
              <!--:class="scope.row.acct_ci_name?'fuzhu-selected-color':''"-->
              <!--@click="showAssist(scope.row)">辅</span>-->
          </template>
          <template v-else>
            {{scope.row.acct}}
            <i v-if="scope.row.showIcon"
               class="el-icon-edit edit-tip" style="right: 20px;"></i>
            <!--<span-->
              <!--v-if="isAssist(scope.row.acct)"-->
              <!--class="fuzhu"-->
              <!--:class="scope.row.acct_ci_name?'fuzhu-selected-color':''"-->
              <!--@click="showAssist(scope.row)">辅</span>-->
          </template>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-box">
      <footer-pagination
        @size-change="handlePage($event, 'pageSize')"
        @current-change="handlePage($event, 'currentPage')"
        :current-page.sync="currentPage"
        :page-sizes="[50,100, 300]"
        :page-size="pageSize"
        :total="subModal.list.length"
        :total-page="subModal.list.length?Math.ceil(subModal.list.length/pageSize):1"
      ></footer-pagination>
    </div>
    <!--新增科目-->
    <add-subject
      :subject-data="subjectData"
      @on-add-after="onAddSubAfter"
      main-menu="reorganize"
    ></add-subject>
    <!-- 辅助核算 -->
    <assist-accounting
      :accountingData="accountingData"
      @refreshList="getAssist"
      @addAssissData="addAssistData"
    ></assist-accounting>
    <!--批量新增科目-->
    <batch-add-acct
      :batch-add-acct-modal="batchAddAcctModal"
      @on-batch-add-after="onBatchAddAfter"
    ></batch-add-acct>
  </div>
</template>
<script>
  import AddSubject from '@/views/components/AddAcct/index'
  import BatchAddAcct from '@/views/fund/component/BatchAddAcct/index'
  import {getLastStageCode, isFuzhuSub} from '@/utils/eval'
  import FooterPagination from '@/views/components/FooterPagination/index.vue'
  import HelpModal from '@/views/components/Help/index.vue'
  import {getCurrencyCode} from '@/views/components/AddAcct/eval'

  import {subData} from '@/views/components/data/common'
  import {deepCopy} from '@/utils/assist'

  // 辅助核算
  import AssistAccounting from '@/views/components/assistAccounting/index'
  import {showFuzhu, isAssist} from '@/views/components/assistAccounting/eval'
  import {assistData} from '@/views/components/assistAccounting/data'

  // 下拉框懒加载
  import {remoteMethod, selectVisibleChange, loadMore} from '@/utils/optimizeList'
  import {options} from '@/views/components/data/common'


  import {
    getFundContactList,
    getFundAccountList
  } from '@/api/fund.js'

  export default {
    name: 'SubjectConfirm',
    data() {
      return {
        inputVal: '',
        currentPage: 1,
        pageSize: 50,
        subjectData: deepCopy(subData), // 科目新增
        accountingData: assistData, // 辅助核算所需字段
        upRow: {},
        rowData: {},
        currencyCode: getCurrencyCode('fund'),
        accountList: [],
        options: deepCopy(options),
        codeList: []
      }
    },
    props: {
      subModal: Object,
      batchAddAcctModal: Object
    },
    components: {
      AddSubject,
      AssistAccounting,
      FooterPagination,
      HelpModal,
      BatchAddAcct
    },
    created() {
      this.codeList = this.subModal.contactCode

    },
    watch: {
    },
    methods: {
      mouseEnter (row) {
        if (row.isEdit) {
          return
        }
        row.showIcon = true
      },
      mouseLeave (row) {
        if (row.isEdit) {
          return
        }
        row.showIcon = false
      },
      clickCell(e, f) {
        if (e.isEdit || f.property !== 'acct') return
        const upRow = this.upRow
        if (upRow.isEdit) {
          upRow.isEdit = false
          const acctArray = upRow.acct.split(' ')
          if (acctArray.length > 1) {
            // upRow.acct = `${acctArray[0]} ${acctArray[1]}`
          }
        }
        e.isEdit = true
        e.showIcon = false
        e.acct = isFuzhuSub(e.acct)
        this.upRow = e
      },
      handlePage (val, type) {
        if (type === 'pageSize') {
          this.pageSize = val
          this.currentPage = 1
        } else {
          this.currentPage = val
        }
      },
      // 输入框查询的时候的过滤规则
      inpFilter () {
        const upRow = this.upRow
        if (upRow.isEdit) {
          upRow.isEdit = false
          const acctArray = upRow.acct.split(' ')
          if (acctArray.length > 1) {
            // upRow.acct = `${acctArray[0]} ${acctArray[1]}`
          }
        }
        this.currentPage = 1
        const valStr = this.inputVal.replace(/^\s+|\s+$/g, '')
        const result = []
        const data = this.subModal.radio === 'all' ? this.subModal.allList : this.subModal.noList
        data.forEach(function (item) {
          const itemName = item.counterparty
          itemName.replace(/^\s+|\s+$/g, '').indexOf(valStr) > -1 ? result.push(item) : ''  // 过滤数据
        })
        this.subModal.list = result
        if (this.subModal.radio === 'all') {
          this.subModal.allNum = result.length
        } else {
          this.subModal.noNum = result.length
        }
      },
      changeRadioType (val) {
        const upRow = this.upRow
        if (upRow.isEdit) {
          upRow.isEdit = false
          const acctArray = upRow.acct.split(' ')
          if (acctArray.length > 1) {
            // upRow.acct = `${acctArray[0]} ${acctArray[1]}`
          }
        }
        this.currentPage = 1
        if (val === 'no') {
          this.subModal.list = this.subModal.noList
          this.subModal.noNum = this.subModal.noList.length
        } else if (val === 'all') {
          this.subModal.list = this.subModal.allList
          this.subModal.allNum = this.subModal.allList.length
        }
        if (this.inputVal.toString()) {
          this.inpFilter()
        }
      },
      selectVisibleChange (val, model) {
        if (val) {
          this.accountList = selectVisibleChange(model, this.codeList, this.options)
        }
      },
      loadMore () {
        if (this.options.isLoadMore) {
          this.accountList = loadMore(this.accountList, this.codeList, this.options)
        }
      },
      remoteMethod (val) {
        this.accountList = remoteMethod(val, this.codeList, this.options)
      },
      handleChange(row) {
        row.acct_ci_name = ''
        const {subModal: {contactCode}} = this
        this.codeList = contactCode
        const {codeList} = this
        const idx = codeList.findIndex(item => item.account === row.acct)
        if (idx === -1) return
        row.acct_ci_name = codeList[idx].acct_ci_name
        this.saveEditData(row)
      },
      addSub(row) {
        this.subjectData = deepCopy(subData)
        this.subjectData.complex = true
        // this.subjectData.superiorSub.code = []
        this.getFundAcct().then(resp => {
          this.subjectData.superiorSub.options = resp
          this.subjectData.subModal = true
        })
        this.subjectData.accounting.code = this.currencyCode
        this.subjectData.accounting.type =  'all'
        this.subjectData.newSubVal = row.counterparty
        // this.subjectData.subModal = true
        this.rowData = row
      },
      getFundAcct () {
        return new Promise((resolve, reject) => {
          getFundContactList().then(resp => {
            const {data} = resp
            const list = []
            for (const item of data) {
              list.push({
                account: item._Code + ' ' + item._Name,
                disabled: item._Edit,
                stock: item._Stock,
                assistCode: item._AssistCode
              })
            }
            return resolve(list)
          }, err => {
            reject(err)
          })
        })
      },
      onAddSubAfter(code, name) {
        // const {newSubVal} = this.subjectData
        const codeName = `${code} ${name}`
        this.getFundLastAcct().then(resp => {
          this.rowData.acct = codeName
          this.handleChange(this.rowData)
        })
        // this.rowData.acct = `${code} ${newSubVal}`
        // this.handleChange(this.rowData)
      },
      getFundLastAcct () {
        return new Promise((resolve, reject) => {
          getFundAccountList().then(resp => {
            const {subModal} = this
            const {contactCode} = resp.data
            subModal.contactCode = this.dealWithCodeList(contactCode)
            return resolve(subModal.contactCode)
          }, err => {
            return reject(err)
          })
        })
      },
      dealWithCodeList (list) {
        const codeList = []
        for (const item of list) {
          codeList.push({
            account: item._Code + ' ' + item._Name,
            tip: item._Code + ' ' + item._ParentName,
            edit: item._Edit,
            acct_ci_name: item._AssistId && item._AssistCode ? JSON.stringify({[item._AssistId]: item._AssistCode}) : ''
          })
        }
        return codeList
      },
      isAssist(acct) {
        return isAssist(acct)
      },
      showAssist(row) {
        this.rowData = row
        const curValArray = row.acct.split(' ')
        this.accountingData.title = `${curValArray[0]} ${curValArray[1]}`
        this.accountingData.tips = row.counterparty
        this.accountingData.acctCiName = row.acct_ci_name
        this.getAssist()
      },
      getAssist() {
        showFuzhu(this.accountingData)
      },
      addAssistData(value) {
        this.rowData.acct_ci_name = value
        this.saveEditData(this.rowData)
      },
      saveEditData(row) {
        const {editList, allList} = this.subModal
        // const acctArray = row.acct.split(' ')
        // const acctCodeNameStr = acctArray.length > 2 ? `${acctArray[0]} ${acctArray[1]}` : row.acct
        const acctCodeNameStr =  row.acct
        const idx = allList.findIndex(v => v.counterparty === row.counterparty)
        if (idx > -1) {
          allList[idx].acctCodeNameStr = acctCodeNameStr
          allList[idx].acct = row.acct
          allList[idx].acct_ci_name = row.acct_ci_name
        }
        if (editList.length) {
          const idxEdit = editList.findIndex(v => v.counterparty === row.counterparty)
          if (idxEdit > -1) {
            editList[idxEdit].acctCodeNameStr = acctCodeNameStr
            editList[idxEdit].acct_ci_name = row.acct_ci_name
            return
          }
        }
        editList.push({
          counterparty: row.counterparty,
          acctCodeNameStr: acctCodeNameStr,
          acct_ci_name: row.acct_ci_name
        })
      },
      onBatchAddAfter (codeList) {
        const {echoList} = this.batchAddAcctModal
        const {noList} = this.subModal
        this.getFundLastAcct().then(resp => {
          echoList.forEach((item, index) => {
            const acct = `${codeList[index]._Code} ${codeList[index]._Name}`
            const idx = noList.findIndex(cItem => item.key === cItem.key)
            if (idx !== -1) {
              noList[idx].acct = acct
              this.handleChange(noList[idx])
            }
          })
        })

      }
    },
    computed: {
      // codeList() {
      //   return getLastStageCode([])
      // }
    },
    mounted() {
    }
  }
</script>
