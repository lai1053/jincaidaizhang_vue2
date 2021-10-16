<style lang='scss' scoped>
  .vue-main-edit {
    margin-bottom: 15px;
    border-top: 1px solid #e3e8ee;
    border-left: 1px solid #e3e8ee;
    .vue-row-col {
      height: 31px;
      line-height: 30px;
      border-right: 1px solid #e3e8ee;
      border-bottom: 1px solid #e3e8ee;
      white-space:nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      position: relative;
      .fuzhu {
        right: 4px;
      }
    }
    .vue-row-col-edit {
      padding: 0;
      .fuzhu {
        right: 26px;
      }
    }
    .vue-row-col-detail {
      padding: 0 8px;
      background: rgba(250, 250, 250, 0.5);
    }
    .vue-row-col-bg {
      padding: 0 8px;
      text-align: right;
      background-color: #fafafa;
    }
    .vue-must {
      color: red;
      margin-left: 3px;
    }
  }
</style>
<style lang="scss">
  .bill-edit-modal {
    position: relative;
    .vue-table-detail {
      .el-select.vue-edit-box input.el-input__inner {
        height: 30px;
        line-height: 30px;
      }
    }
  }
  .vue-main-edit {
    .el-input__inner {
      height: 30px !important;
      line-height: 30px;
      border: none;
      border-radius: 0;
      padding-left: 8px;
    }
  }
  .need-assist .cell {
    padding-right: 0;
    height: 32px;
    line-height: 32px;
    .el-select {
      width: calc(100% - 25px);
    }
    .span-need-width {
      display: inline-block;
      width: calc(100% - 25px);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
</style>
<template>
  <div class="bill-edit-modal">
    <!--主表-->
    <el-row class="vue-main-edit">
      <template v-for="(item, index) in mainTitle">
        <template v-if="item.empty">
          <el-col :span="item.width" class="vue-row-col"></el-col>
        </template>
        <template v-else>
          <el-col :span="3" class="vue-row-col vue-row-col-bg">{{item.name}}</el-col>
          <el-col :span="item.width" class="vue-row-col" :class="dialogModal.type==='edit'&&item.type?'vue-row-col-edit':'vue-row-col-detail'">
            <template v-if="dialogModal.type==='edit'&&item.type">
              <el-select
                v-if="item.type==='select'"
                v-model="mainDetail[index]"
                filterable
                clearable
                class="vue-edit-box"
                @change="changeMainFileVal(index, $event)"
                placeholder="">
                <el-option
                  v-for="(item, i) in settleMethod"
                  :key="item.id"
                  :label="item.item_name"
                  :value="item.item_name">
                </el-option>
              </el-select>
              <el-select
                v-else-if="item.type==='autoComplete'"
                v-model="mainDetail[index]"
                popper-class="auto-complete"
                filterable
                clearable
                class="vue-edit-box"
                remote
                @visible-change="mainSelectVisibleChange($event, mainDetail[index])"
                v-loadmore="mainLoadMore"
                :remote-method="mainRemoteMethod"
                @change="changeMainFileVal(index, $event)"
                placeholder=""
                no-match-text="">
                <el-option
                  v-for="(item, i) in settleAccount"
                  :key="i"
                  :label="item.account"
                  :value="item.account">
                    <span>{{item.account}}</span>
                    <el-tooltip class="item" effect="dark" :content="item.tip" placement="top-start">
                      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                    </el-tooltip>
                </el-option>
                <div class="auto-complete-btn" @click="addSub(mainDetail, 'main')">
                  <i class="el-icon-circle-plus-outline" style="color: #999999;"></i>
                  <span>新增</span>
                </div>
              </el-select>
            </template>
            <template v-else>
              {{mainDetail[index]}}
            </template>
            <span
              v-if="item.hasAssist&&isAssist(mainDetail[index])"
              class="fuzhu"
              :class="mainDetail.complete?'fuzhu-selected-color':''"
              @click="showAssist(mainDetail, 'main')">辅</span>
          </el-col>
        </template>
      </template>
    </el-row>
    <!--从表-->
    <el-table
      stripe
      :data="tableData.slice(pageSize*(currentPage-1), pageSize*currentPage)"
      height="300px"
      @cell-mouse-enter="mouseEnterAndLeave('enter', $event)"
      @cell-mouse-leave="mouseEnterAndLeave('leave', $event)"
      @cell-click="clickCell"
      class="vue-table vue-table-detail">
      <el-table-column
        v-for="item in columns"
        v-if="!item.hide"
        :prop="item.prop"
        :label="item.label"
        :align="item.align"
        :width="item.width"
        :key="item.prop"
        :class-name="item.needAssist?'edit-row-box need-assist':''"
        show-overflow-tooltip>
        <template slot-scope="scope">
          <template v-if="item.type==='autoComplete'">
            <template v-if="scope.row.isEdit">
              <el-select
                v-model="scope.row[item.prop]"
                @change="changeCurBill(scope.row)"
                popper-class="auto-complete"
                class="vue-edit-box"
                placeholder=""
                clearable
                filterable
                remote
                @visible-change="viceSelectVisibleChange($event,scope.row[item.prop])"
                v-loadmore="viceLoadMore"
                :remote-method="viceRemoteMethod"
                no-match-text="">
                <el-option
                  v-for="(item, i) in stockAccount"
                  :key="i"
                  :label="item.account"
                  :value="item.account">
                  <span>{{item.account}}</span>
                  <el-tooltip class="item" effect="dark" :content="item.tip" placement="top-start">
                    <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                  </el-tooltip>
                </el-option>
                <div class="auto-complete-btn" @click="addSub(scope.row, 'vice')">
                  <i class="el-icon-circle-plus-outline" style="color: #999999;"></i>
                  <span>新增</span>
                </div>
              </el-select>
              <span
                v-if="isAssist(scope.row[item.prop])"
                class="fuzhu"
                :class="scope.row.complete ?'fuzhu-selected-color':''"
                @click="showAssist(scope.row, 'vice')"
                style="top: 6px; right: 3px;">辅</span>
            </template>
            <template v-else>
              <template v-if="dialogModal.type==='edit'">
                <span class="span-need-width">{{scope.row[item.prop]}}</span>
                <span
                  v-if="isAssist(scope.row[item.prop])"
                  class="fuzhu"
                  :class="scope.row.complete?'fuzhu-selected-color':''"
                  @click="showAssist(scope.row, 'vice')"
                  style="top: 6px; right: 0;">辅</span>
                <i v-if="scope.row.showIcon&&item.type==='autoComplete'"
                   class="el-icon-edit edit-tip"></i>
              </template>
              <template v-else>
                <span class="span-need-width">{{scope.row[item.prop].replace(/辅/g, '')}}</span>
                <span
                  v-if="isAssist(scope.row[item.prop])"
                  class="fuzhu"
                  :class="scope.row.complete?'fuzhu-selected-color':''"
                  @click="showAssist(scope.row, 'vice')"
                  style="top: 6px; right: 0;">辅</span>
              </template>
            </template>
          </template>
          <template v-else>{{scope.row[item.prop]}}</template>
        </template>
      </el-table-column>
    </el-table>
    <!--分页-->
    <div class="pagination-box">
      <footer-pagination
        @size-change="handlePage($event, 'pageSize')"
        @current-change="handlePage($event, 'currentPage')"
        :current-page.sync="currentPage"
        :page-sizes="[10, 20, 30]"
        :page-size="pageSize"
        :total="tableData.length"
        :total-page="tableData.length?Math.ceil(tableData.length/pageSize):1"
      ></footer-pagination>
    </div>
    <!--上一页 下一页-->
    <up-next-page
      :modal-type="dialogModal.type"
      :list="list"
      :detail="mainDetail"
      @on-up-next="toUpOrNextPage">
    </up-next-page>
    <!--新增科目-->
    <add-subject
      :subject-data="subjectData"
      @on-add-after="onAddSubAfter"
    ></add-subject>
    <!-- 辅助核算 -->
    <assist-accounting
      :accountingData="accountingData"
      :isDisabled="dialogModal.type === 'detail'"
      @refreshList="getAssist"
      @addAssissData="addAssistData"
    ></assist-accounting>
  </div>
</template>
<script>
  import FooterPagination from '@/views/components/FooterPagination/index.vue'
  import UpNextPage from '@/views/components/UpNextPage'
  import {getLastStageCode, isFuzhuSub} from '@/utils/eval'
  import {getSettleSub, getCode} from '@/utils/subCode'
  import {getCurrencyCode, settleCode} from '@/views/components/AddAcct/eval'
  import {deepCopy} from '@/utils/assist'

  // 新赠科目
  import AddSubject from '@/views/components/AddAcct/index'
  import {subData} from '@/views/components/data/common'

  // 辅助核算
  import AssistAccounting from '@/views/components/assistAccounting/index'
  import {showFuzhu, isAssist} from '@/views/components/assistAccounting/eval'
  import {assistData} from '@/views/components/assistAccounting/data'
  import {isDisabledSub} from '@/utils/eval'
  import {Message} from 'element-ui'
  import {duration} from '@/views/components/data/common'

  // 下拉框懒加载
  import {remoteMethod, selectVisibleChange, loadMore} from '@/utils/optimizeList'
  import {options} from '@/views/components/data/common'

  export default {
    data() {
      return {
        editType: '', // main 主表 vice 从表
        currentPage: 1,
        pageSize: 10,
        editList: [],
        subCode: getCode(this.mainMenu),
        subjectData: deepCopy(subData), // 科目新增
        accountingData: assistData, // 辅助核算所需字段
        settleSub: [],
        upRow: {},
        curItem: {},
        currencyCode: getCurrencyCode(this.mainMenu),
        settleAccount: [],
        stockAccount: [],
        options: deepCopy(options),
      }
    },
    props: {
      mainMenu: String,
      dialogModal: Object,
      settleMethod: Array,
      mainDetail: Object,
      list: Array,
      mainTitle: Object,
      columns: Array,
      tableData: Array,
    },
    watch: {
      'mainDetail.id': {
        immediate: true,
        handler (val) {
          if (val) {
            this.init()
          }
        }
      },
      'mainDetail.updatePage': {
        immediate: true,
        handler (val) {
          if (val) {
            this.init()
          }
        }
      }
    },
    created() {
    },
    methods: {
      init() {
        this.editList = []
        const {mainDetail, settleMethod} = this
        const vtNumList = []
        if (this.dialogModal.type === 'detail') {
          if (typeof (mainDetail.vt_num_list) !== 'string') return
          const array = mainDetail.vt_num_list ? mainDetail.vt_num_list.split(',') : []
          for (const item of array) {
            if (item) {
              vtNumList.push(item)
            }
          }
        }
        mainDetail.vt_num_list = vtNumList
        if (mainDetail.acct) {
          mainDetail.acct = isFuzhuSub(mainDetail.acct)
        }
        this.getSettleSubBySmId()
        // 根据结算方式列表和结算给方式id 获取结算方式名称
        for (const item of settleMethod) {
          if (mainDetail.sm_id === item.item_id) {
            mainDetail.sm_name = item.item_name
          }
        }
      },
      mouseEnterAndLeave(evt, row) {
        const type = this.dialogModal.type
        if (type === 'detail' || row.isEdit) {
          return
        }
        row.showIcon = (evt === 'enter')
      },
      clickCell(e, f) {
        if (e.isEdit || !e.showIcon || f.property !== 'acct') return
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
      getSettleSubBySmId() {
        const code = getSettleSub(String(this.mainDetail.sm_id))
        this.settleSub = getLastStageCode(code)   // 根据编码获取末级核算科目
      },
      handlePage(val, type){
        if (type === 'pageSize') {
          this.pageSize = val
          this.currentPage = 1
        } else {
          this.currentPage = val
        }
      },
      changeMainFileVal(type, newVal) {
        const {mainDetail, settleMethod} = this
        mainDetail.complete = false
        if (type === 'sm_name') {
          for (const item of settleMethod) {
            if (newVal === item.item_name) {
              mainDetail.sm_id = item.item_id
            }
          }
          this.getSettleSubBySmId()
          if (mainDetail.acct) {
            if (mainDetail.acct === this.settleSub[0].account) return
            const idx = this.settleSub.findIndex(v => v.account === mainDetail.acct)
            if (idx > -1) return
            // if (this.settleSub.indexOf(mainDetail.acct) > -1) return
          }
          mainDetail.acct = this.settleSub[0].account
          mainDetail.acct_ci_name = ''
        } else if (type === 'acct') {
          mainDetail.acct_ci_name = ''
        }
      },
      changeCurBill(row) {
        row.complete = false
        row.acct_ci_name = ''
        row.complete = false
        this.saveEditData(row)
      },

      // 新增科目
      addSub(curItem, type) {
        this.editType = type
        this.subjectData = deepCopy(subData)
        if (type === 'main') {
          this.subjectData.superiorSub.code = getSettleSub(String(this.mainDetail.sm_id))
          this.subjectData.accounting.code =  settleCode
          this.subjectData.accounting.type = 'settle'
          this.subjectData.newSubVal = curItem.cust_name
        } else {
          this.subjectData.superiorSub.code = this.subCode
          this.subjectData.accounting.code = this.currencyCode
          this.subjectData.accounting.type =  'income'
          this.subjectData.newSubVal = curItem.newSubVal
        }
        this.subjectData.subModal = true
        this.curItem = curItem
      },
      onAddSubAfter(code) {
        const {newSubVal} = this.subjectData
        this.curItem.acct = `${code} ${newSubVal}`
        this.curItem.acct = isFuzhuSub(this.curItem.acct)
        this.curItem.acct_ci_name = ''
        if (this.editType === 'main') {
          // 刷新结算科目列表
          this.getSettleSubBySmId()
        } else {
          this.saveEditData(this.curItem)
        }
      },
      isAssist(acct) {
        return isAssist(acct)
      },
      // 辅助核算
      showAssist(curItem, type) {
        const disableSub = isDisabledSub(curItem.acct)
        if (disableSub) {
          return Message({
            message: '该科目已被禁用，请到科目期初进行查看',
            type: 'warning',
            duration: duration
          })
        }
        this.editType = type
        this.curItem = curItem
        const curValArray = curItem.acct.split(' ')
        const specification = curItem.specification ? `(${curItem.specification})` : ''
        this.accountingData.title = `${curValArray[0]} ${curValArray[1]}`
        this.accountingData.tips = type === 'main' ? curItem.cust_name : `${curItem.goods_name}${specification}`
        this.accountingData.acctCiName = curItem.acct_ci_name
        this.getAssist(curItem)
      },
      getAssist() {
        showFuzhu(this.accountingData)
      },
      addAssistData(value) {
        this.curItem.acct_ci_name = value
        this.curItem.complete = true
        if (this.editType === 'vice') {
          this.saveEditData(this.curItem)
        }
      },
      saveEditData(row) {
        const {editList} = this
        let acct_code = ''
        let acct_name = ''
        const acct = row.acct
        if (acct) {
          acct_code = acct.split(' ')[0]
          acct_name = acct.split(' ')[1]
        }
        if (editList.length) {
          const idxEdit = editList.findIndex(v => v.index_no === row.index_no)
          if (idxEdit > -1) {
            editList[idxEdit].acct_code = acct_code
            editList[idxEdit].acct_name = acct_name
            editList[idxEdit].acct_ci_name = row.acct_ci_name
            return
          }
        }
        editList.push({
          index_no: row.index_no,
          acct_code: acct_code,
          acct_name: acct_name,
          acct_ci_name: row.acct_ci_name
        })
      },
      toUpOrNextPage(resp) {
        this.$emit('on-up-next', resp)
      },
      mainSelectVisibleChange (val, model) {
        if (val) {
          this.settleAccount = selectVisibleChange(model, this.settleSub, this.options)
        }
      },
      mainLoadMore () {
        if (this.options.isLoadMore) {
          this.settleAccount = loadMore(this.settleAccount, this.settleSub, this.options)
        }
      },
      mainRemoteMethod (val) {
        this.settleAccount = remoteMethod(val, this.settleSub, this.options)
      },
      viceSelectVisibleChange (val, model) {
        if (val) {
          this.stockAccount = selectVisibleChange(model, this.codeList, this.options)
        }
      },
      viceLoadMore () {
        if (this.options.isLoadMore) {
          this.stockAccount = loadMore(this.stockAccount, this.codeList, this.options)
        }
      },
      viceRemoteMethod (val) {
        this.stockAccount = remoteMethod(val, this.codeList, this.options)
      }
    },
    computed: {
      codeList() {
        return  getLastStageCode(this.subCode)
      }
    },
    components: {
      FooterPagination,
      UpNextPage,
      AddSubject,
      AssistAccounting
    }
  }
</script>
