<style lang='scss'>
  .import-form-edit-box {
    width: 320px;
    .el-input-group__append{
      padding: 0;
      .up-load-btn{
        width: 66px;
        height: 34px;
        display: inline-block;
        text-align: center;
        line-height: 34px;
      }
    }
  }

  .a-download {
    display: inline-block;
    height: 36px;
    line-height: 36px;
  }





  .import-tip {
    .el-form-item__label {
      color: #FFA854;
      line-height: 28px;
    }
    .el-form-item__content {
      line-height: 30px;
    }
    p {
      margin: 0;
    }
  }
  .fund-import {
    .el-input-group__append {
      cursor: pointer;
    }
  }

</style>
<template>
  <div class='fund-import'>
    <el-form label-position="right" label-width="108px" :model="formModal">
      <el-form-item label="银行账号：">
        <el-select
          v-model="formModal.bankCode"
          popper-class="auto-complete"
          class="import-form-edit-box"
          placeholder=""
          clearable
          filterable
          size="small"
          no-match-text="">
          <el-option
            v-for="(item, idx) in formModal.bankList"
            :key="item.id"
            :label="item.bank_name_num"
            :value="item.bank_num">
          </el-option>
          <div class="auto-complete-btn" @click="addBankCode">
            <i class="el-icon-circle-plus-outline" style="color: #999999;"></i>
            <span>新增</span>
          </div>
        </el-select>
      </el-form-item>
      <el-form-item label="选择对账单：">
        <!--accept=".xlsx, .xls"-->
        <input ref="excelUploadInput" type="file"  style="display: none" accept=".xlsx, .xls"
               @change="handkeFileChange">
        <el-input placeholder="" v-model="formModal.fileInfo.name" size="small" class="import-form-edit-box" readonly>
          <template slot="append">
            <span @click="handleUpload" class="up-load-btn">浏览</span>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item label="温馨提示：" class="import-tip">
        <p>1、可直接导入银行对账单，支持的文件格式为：xls、xlsx</p>
        <p>2、如导入不成功，可<a class="vue-a a-download" :href="iframeSrc" download>下载通用模板</a>，填写后导入</p>
        <p>3、请将对账单放在文件的第一个工作表</p>
        <p>4、仅支持人民币账户的对账单导入，外币账户暂不支持</p>
      </el-form-item>
    </el-form>
    <!--内层嵌套新增银行账号弹窗-->
    <el-dialog
      width="480px"
      top="0"
      title="新增银行账号"
      :visible.sync="bankModal"
      class="vertical-center-modal"
      append-to-body>
      <div style="padding: 16px 40px 0">
        <span>银行名称：</span>
        <el-input
          v-model="newBankName"
          size="small"
          style="width: 246px"
        ></el-input>
      </div>
      <div style="padding: 16px 40px 0">
        <span>银行账号：</span>
        <el-input
          v-model="newBankCode"
          size="small"
          style="width: 246px"
        ></el-input>
      </div>
      <div style="padding: 16px 40px 30px; position: relative;">
        <span>核算科目：</span>
        <el-select
          v-model="accountSub"
          popper-class="auto-complete"
          size="small"
          placeholder=""
          clearable
          filterable
          @change="changeSelect"
          style="width: 246px;">
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
          <div class="auto-complete-btn" @click="addSub">
            <i class="el-icon-circle-plus-outline" style="color: #999999;"></i>
            <span>新增</span>
          </div>
        </el-select>
        <span
          v-if="isAssist(accountSub)"
          class="fuzhu"
          :class="accountSubCiName?'fuzhu-selected-color':''"
          style="top: 24px; right:36px;"
          @click="showAssist">辅</span>
      </div>
      <div slot="footer">
        <el-button size="medium" @click="closedBankModal">取消</el-button>
        <el-button size="medium" style="margin-left: 15px" type='primary' @click="saveBankCode">确定</el-button>
      </div>
    </el-dialog>
    <import-error
      v-if="errorModal.modal"
      :modalData="errorModal"
    ></import-error>
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
  import ImportError from '@/views/components/ImportError/index'
  import AddSubject from '@/views/components/AddAcct/index'
  import {bankType} from '@/views/fund/component/ImportForm/data'
  import {getLastStageCode} from '@/utils/eval'
  import {Message} from 'element-ui'
  import {subData, duration} from '@/views/components/data/common'
  import {deepCopy} from '@/utils/assist'
  import {getCurrencyCode} from '@/views/components/AddAcct/eval'

  // 辅助核算
  import AssistAccounting from '@/views/components/assistAccounting/index'
  import {showFuzhu, isAssist} from '@/views/components/assistAccounting/eval'
  import {assistData} from '@/views/components/assistAccounting/data'

  export default {
    name: 'FundImport',
    data() {
      return {
        bankType: bankType, // 银行名称列表
        bankList: [],
        iframeSrc: `${process.env.BASE_API}/common/downloadModule.do?fileName=yhdzdModule.xls`, // 下载通用模板链接
        bankModal: false, // 新增银行账号弹窗
        newBankName: '', // 新增的银行名称
        newBankCode: '', // 新增的银行账号
        accountSub: '', // 核算科目
        accountSubCiName: '', // 辅助核算内容
        accountingData: assistData, // 辅助核算所需字段
        subjectData: deepCopy(subData), // 科目新增
        currencyCode: getCurrencyCode('fund')
      }
    },
    props: {
      formModal: Object,
      errorModal: Object
    },
    components: {
      ImportError,
      AddSubject,
      AssistAccounting
    },
    created() {
    },
    watch: {},
    methods: {
      isAssist(acct) {
        return isAssist(acct)
      },
      handleUpload() {
        this.$refs.excelUploadInput.click()
      },
      handkeFileChange(e) {
        if (e.target.files.length === 0) return
        const files = e.target.files
        this.formModal.fileInfo = files[0] // only use files[0]
      },
      // 点击银行账号 新增
      addBankCode() {
        this.newBankName = ''
        this.newBankCode = ''
        this.accountSub = ''
        this.bankModal = true
      },
      saveBankCode() {
        const {newBankName, newBankCode, accountSub} = this
        const {bankList} = this.formModal
        if (!newBankName) {
          return Message({
            message: '银行名称不能为空！',
            type: 'warning',
            duration: duration
          })
        }
        if (!newBankCode) {
          return Message({
            message: '银行账号不能为空！',
            type: 'warning',
            duration: duration
          })
        }
        if (!accountSub) {
          return Message({
            message: '核算科目不能为空！',
            type: 'warning',
            duration: duration
          })
        }
        let hasCode = false
        for (const item of bankList) {
          if (item.bank_num === newBankCode) {
            hasCode = true
            break
          }
        }
        if (hasCode) {
          return Message({
            message: '该银行账号已存在！',
            type: 'warning',
            duration: duration
          })
        }
        const indexData = this.$store.getters.indexData
        let bank_acct_code = accountSub
        const subArray = accountSub.split(' ')
        if (subArray.length) {
          bank_acct_code = `${subArray[0]} ${subArray[1]}`
        }
        const param = [{
          ent_id: indexData.entAcctVO.id,
          id: 0,
          operateType: '1',
          bank_acct_ci_name: this.accountSubCiName,
          bank_name: newBankName,
          bank_num: newBankCode,
          ccy_name: '人民币',
          bank_acct_code: bank_acct_code,
          bank_state: '1'
        }]
        this.$emit('on-save-bank', param)
      },
      closedBankModal() {
        this.bankModal = false
      },
      addSub() {
        this.subjectData = deepCopy(subData)
        this.subjectData.superiorSub.code = ['1002']
        this.subjectData.accounting.code = this.currencyCode
        this.subjectData.accounting.type =  'all'
        this.subjectData.newSubVal = `${this.newBankName}${this.newBankCode}`
        this.subjectData.subModal = true
        this.subjectData.removeCurrency = true
      },
      onAddSubAfter(code) {
        const {newSubVal, moneyCheck, moneyType} = this.subjectData
        if (!moneyCheck && !moneyType) {
          this.accountSub = `${code} ${newSubVal}`
        }
      },
      changeSelect() {
        this.accountSubCiName = ''
      },
      showAssist() {
        const curValArray = this.accountSub.split(' ')
        this.accountingData.title = `${curValArray[0]} ${curValArray[1]}`
        this.accountingData.tips = ''
        this.accountingData.acctCiName = this.accountSubCiName
        this.getAssist()
      },
      getAssist() {
        showFuzhu(this.accountingData)
      },
      addAssistData(value) {
        this.accountSubCiName = value
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
