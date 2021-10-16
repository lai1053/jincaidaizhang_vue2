<style lang="scss" scoped>
  .footer-tip{
    display: inline-block;
    text-align: left;
    float: left;
    line-height: 32px;
    font-size: 12px;
    color: #666666;
    .amount-box{
      display: inline-block;
      text-align: left;
    }
    .tip-color{
      margin-left: 252px;
      span{
        color: #FFA854;
      }
    }
  }
</style>
<template>
  <div>
    <el-dialog
      class="vau-add-sub"
      :close-on-click-modal="false"
      :title="subjectData.subTitle"
      :visible.sync="subjectData.subModal"
      width="400px"
      append-to-body
    >
      <div>
        <div style="margin-bottom: 12px; position: relative">
          <span class="" >科目名称：</span>
          <el-select
            v-model="subjectData.curVal"
            size="small"
            style="width: 226px;"
            clearable
            remote
            @change=""
            @visible-change="selectVisibleChange($event, subjectData.curVal)"
            v-loadmore="loadMore"
            :remote-method="remoteMethod"
            placeholder="请选择"
            popper-class="auto-complete"
            class="vue-edit-box">
            <el-option
              v-for="(item, i) in subjectData.options"
              :key="item.account"
              :label="item.account"
              :value="item.account">
              <span>{{item.account}}</span>
              <el-tooltip class="item" effect="dark" :content="item.tip" placement="top-start">
                <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
              </el-tooltip>
            </el-option>
            <div class="auto-complete-btn" @click="addSub">
              <i class="el-icon-circle-plus-outline" style="color: #999999;"></i>
              <span>新增</span>
            </div>
          </el-select>
          <span
            v-if="isAssist(subjectData.curVal)"
            class="fuzhu"
            :class="subjectData.acctCiName ?'fuzhu-selected-color':''"
            @click="showAssist(subjectData.curVal)"
            style="top: 7px; right: 15px;">辅</span>
        </div>

      </div>
      <div slot="footer">
        <div class="footer-tip">
          新增科目数：<span class="text-color">0</span> 条
        </div>
        <el-button size="small" style="margin-left: 15px" type='primary' @click="">确定</el-button>
      </div>
    </el-dialog>
    <!--新增科目-->
    <add-subject
      :subject-data="subData"
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

  import {remoteMethod, selectVisibleChange, loadMore} from '@/utils/optimizeList'
  import {getLastStageCode, isFuzhuSub} from '@/utils/eval'
  import {getCurrencyCode} from '@/views/components/AddAcct/eval'
  import {deepCopy} from '@/utils/assist'
  import {options} from '@/views/components/data/common'
  import {subData} from '@/views/components/data/common'

  // 辅助核算
  import AssistAccounting from '@/views/components/assistAccounting/index'
  import {showFuzhu, isAssist} from '@/views/components/assistAccounting/eval'
  import {assistData} from '@/views/components/assistAccounting/data'
  export default {
    props: {
      subjectData: Object
    },
    data() {
      return {
        options: deepCopy(options),
        subData: deepCopy(subData), // 科目新增
        accountingData: deepCopy(assistData), // 辅助核算所需字段
      }
    },
    methods: {
      // 新增科目
      addSub() {
        this.subData = deepCopy(subData)
        this.subData.superiorSub.code = []
        this.subData.accounting.code = getCurrencyCode(this.subjectData.mainMenu)
        this.subData.accounting.type = 'all'
        this.subData.subModal = true
      },
      // 新增科目
      onAddSubAfter (code) {
        const {newSubVal} = this.subData
        this.subjectData.curVal = `${code} ${newSubVal}`
        // this.changeCurBill(this.rowData)
      },
      // 辅助核算
      showAssist() {
        const {subjectData} = this
        const curValArray = subjectData.curVal.split(' ')
        this.accountingData.title = `${curValArray[0]} ${curValArray[1]}`
        this.accountingData.acctCiName = subjectData.acctCiName
        this.getAssist()
      },
      isAssist (acct) {
        return isAssist(acct)
      },
      getAssist () {
        showFuzhu(this.accountingData)
      },
      addAssistData (value) {
        this.subjectData.acctCiName = value
      },
      selectVisibleChange (val, model) {
        if (val) {
          const {subjectData} = this
          subjectData.options = selectVisibleChange(model, this.codeList, this.options)
        }
      },
      loadMore() {
        if (this.options.isLoadMore) {
          const {subjectData} = this
          subjectData.options = loadMore(subjectData.options, this.codeList, this.options)
        }
      },
      remoteMethod(val) {
        const {subjectData} = this
        subjectData.options = remoteMethod(val, this.codeList, this.options)
      }
    },
    computed: {
      codeList() {
        return getLastStageCode(this.subjectData.code)
      }
    },
    components: {
      AddSubject,
      AssistAccounting
    }
  }
</script>

<style scoped>

</style>
