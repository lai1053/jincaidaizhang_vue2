
<style lang='scss' scoped>
  .setup-box{
    display: block;
    padding: 0 10px;
    height: 34px;
    line-height: 34px;
    text-align: center;
    float: right;
    background-color: #1ab394;
    border-radius: 2px;
    color: #ffffff;
    margin-left: 5px;
  }
  .sub-title{
    font-size: 14px;
    line-height: 30px;
    padding: 0;
    margin: 0;
  }
</style>
<style lang="scss">
  .setup-sub-modal{
    .el-dialog{
      position: absolute;
      left: 50%;
      top: 50%;
      margin-top: -93px!important;
      margin-left: -200px;
    }
    .el-radio__input.is-checked + .el-radio__label{
      color: #606266;
    }
  }
</style>
<template>
  <div class="subject-confirm reorganize-bill" tabindex="1" @keydown="keyDownEvent($event)" @keyup="keyUpEvent($event)">
    <div class="subject-confirm-head">
      <el-input v-model="batchSelect[subModal.tabStep].inputVal" @input="inpFilter" :placeholder="subModal.tabStep==='one' && mainMenu==='sales' || subModal.tabStep==='two' && mainMenu==='purchase'?'请输入往来单位':'请输入商品或服务名称'" size="small">
        <i slot="prefix" class="el-input__icon el-icon-search"></i>
      </el-input>
      <div class="head_radio-group">
        <el-radio-group v-model="subModal[subModal.tabStep].radio" @change="changeRadioType">
          <el-radio v-if="type==='batchSetupAccount'" label="no">采购相关({{subModal[subModal.tabStep].noNum}})</el-radio>
          <el-radio v-if="type!=='batchSetupAccount'" label="noMatch">未匹配({{subModal[subModal.tabStep].noMatchNum}})</el-radio>
          <el-radio v-if="type!=='batchSetupAccount'" label="no">未确认({{subModal[subModal.tabStep].noNum}})</el-radio>
          <el-radio label="all">全部({{subModal[subModal.tabStep].allNum}})</el-radio>
        </el-radio-group>
      </div>
      <div class="setup-box"
           v-if="subModal.tabStep === 'one' && mainMenu === 'purchase' || subModal.tabStep === 'two' && mainMenu === 'sales'"
           @click="handleSetupClick"><i class="icon-shezhi iconfont"></i></div>
      <div class="batch-select-box" >
        <span class="batch-select-desc">批量设置</span>
        <el-select
          v-model="batchSelect[subModal.tabStep].acct"
          auto-complete
          filterable
          class="vue-select-box"
          popper-class="auto-complete"
          clearable
          size="small"
          remote
          @visible-change="selectVisibleChange($event, batchSelect[subModal.tabStep].acct)"
          v-loadmore="loadMore"
          :remote-method="remoteMethod"
          @change="handleChange(batchSelect[subModal.tabStep])"
          placeholder="">
          <el-option
            v-for="(item, i) in accountList"
            :key="i"
            :label="item.account"
            :value="item.account"
            :disabled="item.edit">
            <span>{{item.account}}</span>
            <el-tooltip class="item" effect="dark" :content="item.tip" placement="top-start">
              <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
            </el-tooltip>
          </el-option>
          <div class="auto-complete-btn" @click="batchAddSub()">
            <i class="el-icon-circle-plus-outline"></i>
            <span>新增</span>
          </div>
        </el-select>
        <span
          v-if="isAssist(batchSelect[subModal.tabStep].acct)"
          class="fuzhu"
          :class="batchSelect[subModal.tabStep].acct_ci_name?'fuzhu-selected-color':''"
          style="right: 68px;"
          @click="showAssist()">辅</span>
        <span class="batch-select-save-btn" @click="saveSelect()">确认</span>
      </div>
      <div v-if="type==='batchSetupAccount'" class="account-box">
        <el-button type="primary" size="small" @click="changePurchaseType(1)">采购相关</el-button>
        <el-button type="primary" size="small" @click="changePurchaseType(0)">非采购</el-button>
      </div>
    </div>
    <el-tabs class="subModal-tabs" tab-position="left" v-model="subModal.tabStep"  @tab-click="handleTabsClick">
      <el-tab-pane
        v-for="(item,idx) in tabPane"
        :label="item.label"
        :key="item.key"
        :name="item.key">
        <el-table
          :data="getList"
          header-align="center"
          height="320"
          stripe
          highlight-current-row
          :ref="item.key"
          @select="select"
          @cell-mouse-enter="mouseEnter"
          @cell-mouse-leave="mouseLeave"
          @cell-click="clickCell"
          @selection-change="handleSelectionChange"
          style="width: 100%">
          <el-table-column
            width="50px"
            align="center"
            cell-style="hideRowName"
            type="selection">
          </el-table-column>
          <el-table-column
            v-for="(cItem, cIdx) in item.columns"
            :prop="cItem.prop"
            :label="cItem.label"
            :width="cItem.width"
            :align="cItem.align"
            :class-name="cItem.className"
            :key="cItem.prop"
            show-overflow-tooltip>
            <template slot-scope="scope">
              <template v-if="scope.row.isEdit&&cItem.prop==='acct'">
                <el-select
                  v-model="scope.row.acct"
                  auto-complete
                  filterable
                  class="vue-edit-box"
                  popper-class="auto-complete"
                  clearable
                  placeholder=""
                  remote
                  @visible-change="selectVisibleChange($event, scope.row.acct)"
                  v-loadmore="loadMore"
                  :remote-method="remoteMethod"
                  @change="handleChange(scope.row)">
                  <el-option
                    v-for="(item, i) in accountList"
                    :key="i"
                    :label="item.account"
                    :value="item.account "
                    :disabled="item.edit">
                    <span>{{item.account}}</span>
                    <el-tooltip class="item" effect="dark" :content="item.tip" placement="top-start">
                      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                    </el-tooltip>
                  </el-option>
                  <div class="auto-complete-btn" @click="addSub(scope.row)">
                    <i class="el-icon-circle-plus-outline"></i>
                    <span>新增</span>
                  </div>
                </el-select>
                <!--<span-->
                  <!--v-if="isAssist(scope.row.acct)"-->
                  <!--class="fuzhu"-->
                  <!--:class="scope.row.acct_ci_name?'fuzhu-selected-color':''"-->
                  <!--style="right: 22px;"-->
                  <!--@click="showAssist(scope.row)">辅</span>-->
              </template>
              <template v-else-if="cItem.prop==='isPurchase'">
                {{Number(scope.row.isPurchase) === 0 ? '非采购' : '采购'}}
              </template>
              <template v-else>
                {{scope.row[cItem.prop]}}
                <!--<span-->
                  <!--v-if="isAssist(scope.row.acct)&&cItem.prop==='acct'"-->
                  <!--class="fuzhu"-->
                  <!--:class="scope.row.acct_ci_name?'fuzhu-selected-color':''"-->
                  <!--style="right: 22px;"-->
                  <!--@click="showAssist(scope.row)">辅</span>-->
                <i v-if="scope.row.showIcon&&cItem.prop==='acct'"
                   class="el-icon-edit edit-tip" style="right: 20px;"></i>
              </template>
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination-box">
          <footer-pagination
            @size-change="handlePage($event, 'pageSize')"
            @current-change="handlePage($event, 'currentPage')"
            :current-page.sync="batchSelect[subModal.tabStep][subModal[subModal.tabStep].radio].currentPage"
            :page-sizes="[50, 100, 300]"
            :page-size="batchSelect[subModal.tabStep].pageSize"
            :total="subModal[subModal.tabStep].list.length"
            :total-page="Math.ceil(subModal[subModal.tabStep].list.length/batchSelect[subModal.tabStep].pageSize) "
          ></footer-pagination>
        </div>
      </el-tab-pane>
    </el-tabs>
    <!--新增科目-->
    <add-subject
      :subject-data="subjectData"
      @on-add-after="onAddSubAfter"
      main-menu="reorganize"
    ></add-subject>
    <!--批量新增科目-->
    <batch-add-subject
    :batch-subject-data="batchSubjectData"
    @on-batch-add-after="onBatchAddAfter"
    ></batch-add-subject>
    <!-- 辅助核算 -->
    <assist-accounting
      :accountingData="accountingData"
      @refreshList="getAssist"
      @addAssissData="addAssistData"
    ></assist-accounting>
    <!--科目匹配方式-->
    <el-dialog
    title="科目匹配方式"
    :visible.sync="setupModal.modal"
    :close-on-click-modal="false"
    width="400px"
    class="setup-sub-modal"
    append-to-body>
      <div style="height: 60px; overflow: hidden">
        <p class="sub-title"> <el-radio  v-model="accountSetupType" label="0">按商品或服务名称匹配科目</el-radio></p>
        <p class="sub-title"><el-radio  v-model="accountSetupType" label="1"> 按商品或服务名称+规格型号匹配科目</el-radio></p>
      </div>

      <div slot="footer" class="dialog-footer">
        <el-button size="small" type="primary" @click="saveSetupSub">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import AddSubject from '@/views/components/AddAcct/index'
  import batchAddSubject from '@/views/components/batchAddAcct'
  import {getSettleSub, getCode} from '@/utils/subCode'
  import FooterPagination from '@/views/components/FooterPagination/index.vue'
  import {Message, MessageBox} from 'element-ui'
  import {duration} from '@/views/components/data/common'

  import {subData, batchSubData} from '@/views/components/data/common'
  import {deepCopy} from '@/utils/assist'
  import {getCurrencyCode, settleCode} from '@/views/components/AddAcct/eval'

  // 辅助核算
  import AssistAccounting from '@/views/components/assistAccounting/index'
  import {showFuzhu, isAssist} from '@/views/components/assistAccounting/eval'
  import {assistData} from '@/views/components/assistAccounting/data'
  import {
    getPurchaseContactList,
    getPurchaseAccountList
  } from '@/api/purchase.js'
  import {
    getSaleContactList,
    getSaleAccountList
  } from '@/api/sales.js'
  import {queryVoucherRule} from '@/api/common'
  // 样式
  if (process.env.NODE_ENV === 'testing') {
    require('./styles/index-blue.scss')
  } else {
    require('./styles/index.scss')
  }
  // 下拉框懒加载
  import {remoteMethod, selectVisibleChange, loadMore} from '@/utils/optimizeList'
  import {Loading} from 'element-ui'
  import {options, localParams} from '@/views/components/data/common'
  import {batchSelect} from '../data'

  const mainMenu = {
    sales: 'sale',
    purchase: 'purchase'
  }

  export default {
    name: 'StepsTwo',
    data() {
      return {
        subjectData: deepCopy(subData), // 科目新增
        batchSubjectData: deepCopy(batchSubData), // 批量科目新增
        accountingData: assistData, // 辅助核算所需字段
        subCode: getCode(this.mainMenu),
        settleSub: getSettleSub('2'),
        currencyCode: getCurrencyCode(this.mainMenu),
        batchSelect: deepCopy(batchSelect),
        upRow: {},
        rowData: {},
        isShift: false,
        isCtrl: false,
        originRow: '',
        multipleSelection: [],
        accountList: [],
        options: deepCopy(options),
        codeList: [],
        accountSetupType: '',
        voucherRule: {}
      }
    },
    props: {
      mainMenu: String,
      subModal: Object,
      tabPane: Array,
      type: {
        default: 'common',
        type: String
      },
      setupModal: Object,
    },
    components: {
      AddSubject,
      AssistAccounting,
      FooterPagination,
      batchAddSubject
    },
    created() {
      // subModal[subModal.tabStep].radio
      const {subModal: {tabStep, contactCode, incomeCode}} = this
      this.codeList = tabStep === 'one' && this.mainMenu === 'sales' || tabStep === 'two' && this.mainMenu === 'purchase' ?  contactCode : incomeCode
    },
    methods: {
      select (selection, row) {
        this.originRow = this.multipleSelection.length === 1 ? this.multipleSelection[0].key : this.originRow
        const hasOriginRow = this.multipleSelection.filter(item => {
          return item.key === this.originRow
        })
        if (hasOriginRow.length === 0) {
          this.originRow = ''
          return
        }
        const currentkey = row.key
        const {tabStep} = this.subModal
        const list = this.getList
        if (this.isShift && this.multipleSelection.length > 1) {
          let selectArray = []
          if (currentkey > this.originRow) {
            selectArray = list.slice(this.originRow, currentkey + 1)
          } else {
            selectArray = list.slice(currentkey, this.originRow + 1)
          }
          if (selectArray) {
            this.$refs[tabStep][0].clearSelection()
            selectArray.forEach(item => {
              this.$refs[tabStep][0].toggleRowSelection(item)
            })
          }
        }
      },
      handlePage(val, type){
        const {tabStep} = this.subModal
        const {radio} =  this.subModal[tabStep]
        const curStep = this.batchSelect[tabStep]
        if (type === 'pageSize') {
          curStep.pageSize = val
          curStep[radio].currentPage = 1
        } else {
          curStep[radio].currentPage = val
        }
      },
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
          // const acctArray = upRow.acct.split(' ')
          // if (acctArray.length > 1) {
          //   upRow.acct = `${acctArray[0]} ${acctArray[1]}`
          // }
        }
        e.isEdit = true
        e.showIcon = false
        // e.acct = isFuzhuSub(e.acct)
        this.upRow = e
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
        const subModal = this.subModal
        const curStep = subModal[subModal.tabStep]
        const {radio} = curStep
        this.batchSelect[subModal.tabStep][radio].currentPage = 1
        const valStr = this.batchSelect[subModal.tabStep].inputVal.replace(/^\s+|\s+$/g, '')
        const result = []
        // const data = curStep.radio === 'all' ? curStep.allList : curStep.noList
        const data = curStep.radio === 'all' ? curStep.allList : curStep.radio === 'no' ? curStep.noList : curStep.noMatchList
        data.forEach(function (item) {
          const itemName = item.name
          itemName.replace(/^\s+|\s+$/g, '').indexOf(valStr) > -1 ? result.push(item) : ''  // 过滤数据
        })
        curStep.list = result
        if (curStep.radio === 'all') {
          curStep.allNum = result.length
        } else if (curStep.radio === 'no') {
          curStep.noNum = result.length
        } else {
          curStep.noMatchNum = result.length
        }
      },
      changePurchaseType (type) {
        const {tabStep, editCustName, editGoodsName} = this.subModal
        const {selection} = this.batchSelect[tabStep]
        for (const item of selection) {
          item.isPurchase = type
          if (item.type === 'cust_name') {
            const allListIdx = this.subModal.one.allList.findIndex(v => v.index === item.index)
            const noListIdx = this.subModal.one.noList.findIndex(v => v.index === item.index)
            this.subModal.one.allList[allListIdx] = item
            this.subModal.one.noList[noListIdx] = item
            const idx = editCustName.findIndex((v) => {
              return v.index === item.index
            })

            if (idx === -1) {
              editCustName.push(item)
            } else {
              editCustName[idx] = item
            }
          } else {
            const allListIdx = this.subModal.two.allList.findIndex(v => v.index === item.index)
            const noListIdx = this.subModal.two.noList.findIndex(v => v.index === item.index)
            this.subModal.two.allList[allListIdx] = item
            this.subModal.two.noList[noListIdx] = item
            const idx = editGoodsName.findIndex((v) => {
              return v.index === item.index
            })
            if (idx === -1) {
              editGoodsName.push(item)
            } else {
              editGoodsName[idx] = item
            }
          }
        }
        this.$refs[tabStep][0].clearSelection()
      },
      saveSelect() {
        const {tabStep} = this.subModal
        const {acct, acct_ci_name, selection} = this.batchSelect[tabStep]
        const msg = tabStep === 'one' && this.mainMenu === 'sales' || tabStep === 'two' && this.mainMenu === 'purchase' ? '请先选择往来单位！' : '请先选择商品或服务名称！'
        if (!selection.length) {
          return Message({
            type: 'warning',
            message: msg,
            duration: duration
          })
        }
        const acctArray = acct.split(' ')
        let acctCodeName = acct
        if (acctArray.length > 1) {
          // acctCodeName = `${acctArray[0]} ${acctArray[1]}`
        }
        for (const item of selection) {
          item.acct = acctCodeName
          item.acct_ci_name = acct_ci_name
        }
        this.$refs[tabStep][0].clearSelection()
        this.batchSelect[tabStep].acct = ''
        this.batchSelect[tabStep].acct_ci_name = ''
      },
      handleSelectionChange(list) {
        const {tabStep} = this.subModal
        this.batchSelect[tabStep].selection = list
        this.multipleSelection =  this.batchSelect[tabStep].selection
      },
      handleTabsClick() {
        const {subModal: {tabStep, contactCode, incomeCode}} = this
        this.codeList = tabStep === 'one' && this.mainMenu === 'sales' || tabStep === 'two' && this.mainMenu === 'purchase'?  contactCode : incomeCode
        if (tabStep === 'one') return
        const selection = this.batchSelect[tabStep].selection
        const curRefs = this.$refs[tabStep][0]
        if (selection && selection.length) {
          setTimeout(function () {
            selection.forEach(row => {
              curRefs.toggleRowSelection(row, true)
            })
          }, 10)
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
        const subModal = this.subModal
        const curStep = subModal[subModal.tabStep]
        curStep.currentPage = 1
        if (val === 'no') {
          curStep.list = curStep.noList
          curStep.noNum = curStep.noList.length
        } else if (val === 'all') {
          curStep.list = curStep.allList
          curStep.allNum = curStep.allList.length
        } else if (val === 'noMatch') {
          curStep.list = curStep.noMatchList
          curStep.noMatchNum = curStep.noMatchList.length
        }
        if (this.batchSelect[subModal.tabStep].inputVal) {
          this.inpFilter()
        }
      },
      handleChange(row) {
        row.acct_ci_name = ''
        const {codeList} = this
        const idx = codeList.findIndex(item => item.account === row.acct)
        if (idx === -1) return
        row.acct_ci_name = codeList[idx].acct_ci_name
      },
      addSub(row) {
        const {subModal: {tabStep}} = this
        this.subjectData = deepCopy(subData)
        this.subjectData.complex = true
        // this.subjectData.superiorSub.code = tabStep === 'one' ? settleSub : subCode
        const type = tabStep === 'one' && this.mainMenu === 'sales' || tabStep === 'two' && this.mainMenu === 'purchase' ? 'contact' : 'income'
        const urlInfo = this.$store.getters.urlInfo
        const params = {
          mark: type,
          qyid: urlInfo.qyid
        }
        if (this.mainMenu === 'purchase') {
          this.subjectData.module = 'purchase'
          this.getPurchaseAcct(params).then(resp => {
            this.subjectData.superiorSub.options = resp
            this.subjectData.subModal = true
          })
        } else {
          this.subjectData.module = 'sale'
          this.getSaleAcct(params).then(resp => {
            this.subjectData.superiorSub.options = resp
            this.subjectData.subModal = true
          })
        }
        if (tabStep === 'one' && this.mainMenu === 'sales' || (tabStep === 'two' && this.mainMenu === 'purchase')) {
          // this.subjectData.superiorSub.code = settleSub
          this.subjectData.accounting.code =  settleCode
          this.subjectData.accounting.type = 'settle'
          this.subjectData.newSubVal = row ? row.name : ''
        } else {
          this.subjectData.accounting.code = this.currencyCode
          this.subjectData.accounting.type =  'income'
          this.subjectData.newSubVal = row ? row.newSubVal : ''
        }

        this.rowData = row
      },
      getPurchaseAcct (params) {
        return new Promise((resolve, reject) => {
          getPurchaseContactList(params).then(resp => {
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
      getSaleAcct (params) {
        return new Promise((resolve, reject) => {
          getSaleContactList(params).then(resp => {
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
            return reject(err)
          })
        })
      },
      batchAddSub () {
        const {subModal: {tabStep}} = this
        const list = this.batchSelect[tabStep].selection
        const msg = tabStep === 'one' && this.mainMenu === 'sales' || tabStep === 'two' && this.mainMenu === 'purchase' ? '请先选择往来单位！' : '请先选择商品或服务名称！'
        if (!list.length) {
          return Message({
            type: 'warning',
            message: msg,
            duration: duration
          })
        }
        const urlInfo = this.$store.getters.urlInfo
        this.batchSubjectData = deepCopy(batchSubData)
        const type = tabStep === 'one' && this.mainMenu === 'sales' || tabStep === 'two' && this.mainMenu === 'purchase' ? 'contact' : 'income'
        const params = {
          mark: type,
          qyid: urlInfo.qyid
        }
        if (this.mainMenu === 'purchase') {
          this.batchSubjectData.module = 'purchase'
          this.getPurchaseAcct(params).then(resp => {
            this.batchSubjectData.superiorSub.options = resp
            this.batchSubjectData.subModal = true
          })
        } else {
          this.getSaleAcct(params).then(resp => {
            this.batchSubjectData.superiorSub.options = resp
            this.batchSubjectData.subModal = true
          })
        }
        // this.batchSubjectData.superiorSub.code = tabStep === 'one' ? settleSub : subCode

        for (const item of list) {
          item.initVal = item.newSubVal
          item.isEdit = false
        }
        this.batchSubjectData.list = list
        // this.batchSubjectData.subModal = true
      },
      onBatchAddAfter (codeList) {
        const {list, guige} = this.batchSubjectData
        // const list = this.batchSubjectData.list
        if (this.mainMenu === 'purchase') {
          this.getPurchaseLastAcct().then(resp => {
            const {subModal: {tabStep, contactCode, incomeCode}} = this
            this.codeList = tabStep === 'two' ?  contactCode : incomeCode
            list.forEach((item, index) => {
              item.acct = guige ? `${codeList[index]} ${item.initVal}(${guige})` : `${codeList[index]} ${item.initVal}`
              this.handleChange(item)
            })
            this.$refs[tabStep][0].clearSelection()
          })
        } else {
          this.getSaleLastAcct().then(resp => {
            const {subModal: {tabStep, contactCode, incomeCode}} = this
            this.codeList = tabStep === 'one' ?  contactCode : incomeCode
            list.forEach((item, index) => {
              item.acct = guige ? `${codeList[index]} ${item.initVal}(${guige})` : `${codeList[index]} ${item.initVal}`
              this.handleChange(item)
            })
            this.$refs[tabStep][0].clearSelection()
          })
        }
      },
      onAddSubAfter(code, name) {
        // const {newSubVal} = this.subjectData
        const codeName = `${code} ${name}`
        if (this.mainMenu === 'purchase') {
          this.getPurchaseLastAcct().then(resp => {
            this.rowData.acct = codeName
            const {subModal: {tabStep, contactCode, incomeCode}} = this
            this.codeList = tabStep === 'two' ?  contactCode : incomeCode
            this.handleChange(this.rowData)
          })
        } else {
          this.getSaleLastAcct().then(resp => {
            this.rowData.acct = codeName
            const {subModal: {tabStep, contactCode, incomeCode}} = this
            this.codeList = tabStep === 'one' ?  contactCode : incomeCode
            this.handleChange(this.rowData)
          })
        }
        // if (this.rowData) {
        //   this.rowData.acct = codeName
        //   this.handleChange(this.rowData)
        // } else {
        //   const {tabStep} = this.subModal
        //   this.batchSelect[tabStep].acct = codeName
        //   this.handleChange(this.this.batchSelect[tabStep])
        //   // this.batchSelect[tabStep].acct_ci_name = ''
        // }
      },
      getPurchaseLastAcct () {
        return new Promise((resolve, reject) => {
          getPurchaseAccountList().then(resp => {
            const {subModal} = this
            const {incomeCode, contactCode} = resp.data
            subModal.incomeCode = this.dealWithCodeList(incomeCode)
            subModal.contactCode = this.dealWithCodeList(contactCode)
            return resolve(subModal.incomeCode, subModal.contactCode)
          }, err => {
            return reject(err)
          })
        })
      },
      getSaleLastAcct () {
        return new Promise((resolve, reject) => {
          getSaleAccountList().then(resp => {
            const {subModal} = this
            const {incomeCode, contactCode} = resp.data
            subModal.incomeCode = this.dealWithCodeList(incomeCode, 'income')
            subModal.contactCode = this.dealWithCodeList(contactCode, 'cotact')
            return resolve(subModal.incomeCode, subModal.contactCode)
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
        const curObj = row || this.batchSelect[ this.subModal.tabStep]
        const curValArray = curObj.acct.split(' ')
        this.accountingData.title = `${curValArray[0]} ${curValArray[1]}`
        this.accountingData.tips = row ? row.name : ''
        this.accountingData.acctCiName = curObj.acct_ci_name
        this.getAssist()
      },
      getAssist() {
        showFuzhu(this.accountingData)
      },
      addAssistData(value) {
        if (this.rowData) {
          this.rowData.acct_ci_name = value
        } else {
          const {tabStep} = this.subModal
          this.batchSelect[tabStep].acct_ci_name = value
        }
      },
      keyDownEvent (evt) {
        const self = this
        if (evt.shiftKey) {
          self.isShift = true
        }
        if (evt.ctrlKey) {
          self.isCtrl = true
        }
      },
      keyUpEvent (evt) {
        const self = this
        self.isShift = false
        self.isCtrl = false
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
      handleSetupClick () {
        Loading.service(localParams)
        queryVoucherRule({module: mainMenu[this.mainMenu]}).then(resp => {
          Loading.service().close()
          const {firstMergeRule, voucherDateRule, ywSummaryRule,
            jsSummaryRule, firstMergeRuleForExpenseInJX,
            ywSummaryRuleForExpenseInJX, inputVatProcessType, accountSetupType} = resp.data
          this.accountSetupType = accountSetupType
          this.setupModal.modal = true
          this.voucherRule = {
            firstMergeRule,
            voucherDateRule,
            ywSummaryRule,
            jsSummaryRule,
            firstMergeRuleForExpenseInJX,
            ywSummaryRuleForExpenseInJX,
            inputVatProcessType
          }
        })
      },
      saveSetupSub () {
        return MessageBox.alert('请先保存当前已设置科目，修改匹配方式后将会清空当前借/贷方科目，请确定是否要继续进行修改？',  '提示', {
          confirmButtonText: '确定',
          dangerouslyUseHTMLString: true,
          type: 'warning',
          callback: action => {
            if (action === 'confirm') {
              this.voucherRule.accountSetupType = this.accountSetupType
              const params = {
                voucher_rule: JSON.stringify(this.voucherRule),
                module: mainMenu[this.mainMenu]
              }
              this.$emit('on-save-setup-sub', params)
            }
          }
        })
      }
    },
    computed: {
      getList() {
        const {tabStep} = this.subModal
        const {list, radio} = this.subModal[tabStep]
        const { pageSize} = this.batchSelect[tabStep]
        const {currentPage} = this.batchSelect[tabStep][radio]
        const listArray  = list.slice(pageSize * (currentPage - 1), pageSize * currentPage)
        listArray.forEach((item, index) => {
          item.key = index
        })
        return listArray
      }
      // codeList() {
      //   const {subModal: {tabStep, contactCode, incomeCode}, settleSub, subCode} = this
      //   // const code = tabStep === 'one' ? settleSub : subCode
      //   return tabStep === 'one' ?  contactCode : incomeCode
      // }
    },
    watch: {
      'subModal.isFresh': {
        immediate: true,
        handler (val) {
          this.batchSelect = deepCopy(batchSelect)
        }
      }
    },
    mounted() {
    }
  }
</script>
