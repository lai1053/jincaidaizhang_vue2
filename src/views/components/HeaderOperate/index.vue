<style lang='scss'>
  .header-operate {
    padding: 13px 10px;
    height: 60px;
    .input-box {
      width: 206px;
      background-color: #ffffff;
      .el-input__inner {
        border-radius: 3px;
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
      }
      float: left;
    }
    .reference {
      display: block;
      width: 34px;
      height: 34px;
      line-height: 34px;
      text-align: center;
      border: 1px solid #dcdfe6;
      border-left: none;
      background-color: #ffffff;
      color: #dcdfe6;
      float: left;
      border-radius: 3px;
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
    }
    .select-box {
      margin-left: 12px;
      float: left;
      width: 220px;
      span {
        color: #666666;
        font-size: 12px;
      }
      .el-select {
        width: 220px;
      }
    }
    .vm-select-box {
      margin-left: 12px;
      float: left;
      width: 166px;
      span {
        color: #666666;
        font-size: 12px;
      }
      .el-select {
        width: 100px;
      }
    }
    .more-box, .float-right-btn {
      float: right;
      margin-left: 10px;
    }
    .float-right-btns {
      background-color: #1ab394;
      float: right;
      margin-left: 10px;
      color: black;
      font-size: 16px;
      font-weight:bold
    }
    .float-left-btns{
      background-color: #1ab394;
      margin-left: 10px;
      color: black;
      font-size: 16px;
      font-weight:bold
    }
    .expenseAll{
      color: black;
      font-size: 16px;
      font-weight:bold
    }
    .button-group-icon{
      padding: 0 10px;
      line-height: 30px;
      font-size: 15px;
    }
    .icon-shezhi{
      font-size: 14px;
    }
    .icon-daohangshaixuan{
      font-size: 18px;
      color: #909399;
    }
    .batch-set-account{
      .el-dropdown__caret-button{
        height: 33px;
        width: 36.83px;
        &::before {
          top: 0;
          bottom: 0;
        }
      }
    }
  }
  .header-filter-box{
    padding: 12px 0 0 0;
    .el-popover__title{
      padding-left: 12px;
    }
    .filter-box{
      padding: 0 20px;
    }
    .filter-box-bottom{
      padding: 10px 20px;
      background-color: #F5F6F7;
    }
  }
  .el-dropdown-menu--small{
    .el-dropdown-menu__item{
      list-style: none;
      line-height: 36px;
      padding: 0 20px;
      margin: 0;
      font-size: 14px;
      color: #606266;
      cursor: pointer;
      outline: 0;
    }
    .popper__arrow{
      display: none;
    }
  }
</style>
<template>
  <div class="header-operate">
    <slot name="radioItem"></slot>
    <!--输入框-->
    <el-input
      v-model="inputVal"
      @input="handleInput($event)"
      ref="onKeyDown"
      prefix-icon="el-icon-search"
      class="input-box"
      size="small"
      :placeholder="inputTip"></el-input>
    <!--筛选按钮-->
    <el-popover
      title="筛选条件"
      placement="top"
      width="446"
      trigger="click"
      v-model="visible"
      popper-class="header-filter-box">
      <el-form label-position="right" label-width="112px" class="filter-box" :model="formContent">
        <slot name="filterItem"></slot>
      </el-form>
      <div style="text-align: right; margin: 0" class="filter-box-bottom">
        <el-button size="mini" class="button-com" @click="resetForm">重置</el-button>
        <el-button type="primary" size="mini" @click="filterList">查询</el-button>
      </div>
      <span slot="reference" class="reference"><i class="iconfont icon-daohangshaixuan"></i></span>
    </el-popover>
    <!--银行账号筛选-->
    <div v-if="filerBank" class="select-box">
      <!--<span>银行账号：</span>-->
      <el-select
        v-model="filerBank.bankCode"
        @change="changeFilerBankCode"
        size="small"
        filterable
        allow-create>
        <el-option
          v-for="(item, idx) in filerBank.bankList"
          :key="item.id"
          :label="item.bank_name_num"
          :value="item.bank_num">
        </el-option>
      </el-select>
    </div>
    <!--凭证状态筛选-->
    <div v-if="mainMenu!=='pending'" class="vm-select-box">
      <!--<span>凭证状态：</span>-->
      <el-select
        v-model="vmState"
        @change="changeVmState"
        size="small"
        filterable
        allow-create>
        <el-option
          v-for="(name, idx) in screen"
          :key="idx"
          :label="name"
          :value="idx"></el-option>
      </el-select>
    </div>
    <!--帮助-->
    <help-modal :main-menu="mainMenu"></help-modal>
    <!--更多-->
    <el-dropdown v-if="more" @command="judgeIsChoseBill" class="more-box">
      <el-button size="small" class="button-com">
        更多<i class="el-icon-arrow-down el-icon--right"></i>
      </el-button>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item
          v-for="item2 in more"
          :command="item2.itemType"
          :key="item2.itemType"
        >{{item2.itemName}}</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <!--凭证-->
    <el-button-group v-if="mainMenu!=='pending' && !changeTaxType" class="float-right-btn">
      <el-button size="small" type='primary'  @click="judgeIsChoseBill('createVoucher')">生成凭证</el-button>
      <el-button size="small" type="primary" @click="settingVoucher" class="button-group-icon"><i class="icon-shezhi iconfont"></i></el-button>
    </el-button-group>
    <!--批量设置-->
    <el-dropdown
      v-if="false"
      size="small"
      split-button
      type="primary"
      trigger="click"
      @click="batchSetupAccount"
      @command="judgeIsChoseBill"
      class="float-right-btn batch-set-account">
      批设科目
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item command="batchSetup">全量批设</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <!--清空按钮-->
    <el-button
      v-if="clear&&!changeTaxType"
      size="small"
      class="float-right-btn button-com"
      @click="judgeIsChoseBill('clearData')"
    >彻底删除</el-button>
    <!--其他按钮-->
    <el-button
      v-for="item in btnType"
      :key="item.key"
      @click="judgeIsChoseBill(item.key)"
      size="small"
      type='primary'
      class="float-right-btn">
      {{item.name}}
    </el-button>
    <!--全部保存按钮-->
    <el-button
      v-if="editContent && !changeTaxType"
      :type="editContent.allSaveBtn?'primary':'info'"
      size="small"
      class="float-right-btn"
      @click="saveAll"
      :disabled="!editContent.allSaveBtn">全部保存</el-button>
    <!-- 备注 -->
    <add-remark
      v-if='dialogVisible'
      :dialogVisible='dialogVisible'
      :remarks_contents='remarks_contents'
      :text_length='text_length'
      @on-save-all='on_save_all'
      @on-handleClose='on_handleClose'>
    </add-remark>
  </div>
</template>
<script>
  import {Message, MessageBox} from 'element-ui'
  import {duration} from '@/views/components/data/common'
  import {checkNum} from '@/utils/utils'
  import HelpModal from '@/views/components/Help/index.vue'
  import AddRemark from '@/views/components/AddRemark/index.vue'

  const screen = {
    '0': '全部',
    '2': '已记账',
    '4': '未记账'
  }

  export default {
    data () {
      return {
        text_length: 0,
        remarks_contents: '',
        dialogVisible: false,
        visible: false,
        inputVal: '',
        vmState: '0',
        screen: screen
      }
    },
    props: {
      proofState: Boolean,
      mainMenu: String,
      inputTip: String,
      formContent: Object,
      filterFormOld: Object,
      filterForm: Object,
      filerBank: Object,
      more: Array,
      btnType: Array,
      editContent: Object,
      multipleSelection: Array,
      isFilterNumber: {
        type: Boolean,
        default: false
      },
      clear: {
        type: Boolean,
        default: false
      },
      changeTaxType: Boolean
    },
    watch: {
      'visible': function (newVal) {
        if (newVal) {
          Object.assign(this.formContent, this.filterForm)
        }
      }
    },
    created () {
    },
    methods: {
      // 备注保存
      on_save_all (arg) {
        const _ids = this.multipleSelection
        const idArray = []
        for (const item of _ids) {
          idArray.push(item.id)
        }
        this.dialogVisible = false
        const mes = {
          id: idArray,
          arg: arg
        }
        this.$emit('on-save-Remark', mes)
      },
      // 关闭
      on_handleClose (arg) {
        this.dialogVisible = arg
      },
      handleInput (evt) {
        const self = this

        if (this.isFilterNumber && !checkNum(evt)) {
          evt = evt.replace(/[^\d|.]/g, '')

          setTimeout(function () {
            self.inputVal = evt
          }, 10)
        }
      },
      filterList () {
        this.visible = false
        Object.assign(this.filterForm, this.formContent)
        // this.inputVal = ''
        this.$emit('on-filter',  this.inputVal, this.vmState)
      },
      resetForm () {
        Object.assign(this.formContent, this.filterFormOld)
      },
      // 生成凭证
      createVoucher () {
        /* const isVoucher = this.multipleSelection.filter(v => v.vm_state === 2)
        if (isVoucher && isVoucher.length) {
          return Message({
            message: '不能重复生成凭证！',
            type: 'warning',
            duration: duration
          })
        } */
        const idArray = []
        for (const item of this.multipleSelection) {
          if (item.vm_state !== 2) {
            if (this.mainMenu === 'expense') {
              if (item.resetAmount !== '' && String(item.resetAmount) !== '0') {
                idArray.push(item.id)
              }
            } else {
              idArray.push(item.id)
            }
          }
        }
        if (!idArray.length) {
          return Message({
            message: '没有可生成凭证的清单！',
            type: 'warning',
            duration: duration
          })
        }
        this.$emit('on-create-voucher', idArray)
      },
      // 导入
      importForm (val) {
        this.$emit('on-import', val)
      },
      // 批量设置
      batchSetup () {
        this.$emit('batch-setup')
      },
      // 删除对账单
      deleteBill () {
        const isVoucher = this.multipleSelection.filter(v => v.vm_state === 2)
        if (isVoucher && isVoucher.length) {
          return MessageBox.alert('对账单已经生成了凭证。如果需要删除，请先删除凭证', '删除银行对账单', {
            confirmButtonText: '确定',
            type: 'warning',
            callback: action => {
            }
          })
        }
        const type = 'all'
        const {bankCode, bankList} = this.filerBank
        let desc = '确定要删除本期全部的银行对账单？'
        if (bankCode) {
          const idx = bankList.findIndex(v => v.bank_num === bankCode)
          desc = `确定要删除${bankList[idx].bank_name}${bankCode}账号的对账单的全部流水？`
        }
        return MessageBox.alert(`${desc}`, '删除银行对账单', {
          confirmButtonText: '确定',
          type: 'warning',
          callback: action => {
            if (action === 'confirm') {
              this.$emit('on-delete', type)
            }
          }
        })
      },
      // 删除发票
      deleteInvoice () {
        const idArray = []
        for (const item of this.multipleSelection) {
          if (String(item.vm_state) !== '2') {
            idArray.push(item.id)
          }
        }
        // ids = ids.slice(0, ids.length - 1)
        this.$emit('on-delete', idArray)
      },
      // 删除凭证
      deleteVoucher () {
        const vchIdArray = []
        for (const item of this.multipleSelection) {
          if (item.vt_num_list !== null && item.vt_num_list !== '') {
            const vchId = item.vch_id_list.split(',')
            for (const itemI of vchId) {
              if (itemI && vchIdArray.indexOf(itemI) === -1) {
                vchIdArray.push(itemI)
              }
            }
          }
        }
        this.$emit('on-delete-voucher', vchIdArray)
      },
      // 银行账号设置
      setBankBill () {
        this.$emit('set-bank-bill')
      },
      // 待认证转进项按钮
      unCertifiedTransform () {
        this.$emit('on-transform')
      },
      judgeIsChoseBill (type) {
        const editContent = this.editContent
        if (editContent && editContent.allSaveBtn && type !== 'deleteBill') {
          return MessageBox.alert('数据已经修改，是否保存？', '全部保存', {
            confirmButtonText: '是',
            type: 'warning',
            callback: action => {
              if (action === 'confirm') {
                this.saveAll()
              }
            }
          })
        }
        const needWarning = [
          'createVoucher',
          'deleteVoucher',
          'moveToPurchase',
          'clearData',
          'deleteInvoice',
          'remarks',
          'deleteRemarks',
          'deleteInventory'
        ]
        const selected = this.multipleSelection
        if (needWarning.indexOf(type) > -1 && (!selected || !selected.length)) {
          const msg = this.mainMenu === 'expense' ? '费用行！' : this.mainMenu === 'psb' ? '需要生成凭证的报销单' : '需要生成凭证的清单'
          const describe = {
            createVoucher: msg,
            deleteVoucher: '需要删除凭证的清单',
            deleteInvoice: '需要删除的清单',
            moveToPurchase: '需要移动的清单',
            clearData: '需要删除的清单',
            remarks: '需要编辑备注的清单',
            deleteRemarks: '需要删除备注的清单',
            deleteInventory: '需要删除的存货单据清单'
          }
          return Message({
            message: `请先选择${describe[type]}`,
            type: 'warning',
            duration: duration
          })
        }
        const needTip = ['deleteVoucher', 'deleteInvoice', 'clearData', 'remarks', 'deleteRemarks', 'deleteInventory']
        const tips = {
          deleteInvoice: '确定要删除勾选的清单吗？删除后可通过再次理票恢复！',
          deleteVoucher: '确认要删除凭证？删除后数据无法恢复',
          clearData: '确定要删除数据吗?删除后无法恢复',
          remarks: '本次备注信息将会替换原清单的备注，是否确认！',
          deleteRemarks: '确定要删除数据的备注信息吗?删除后无法恢复！',
          deleteInventory: '确认要删除存货单据？删除后数据无法恢复！'
        }
        const tipTitle = {
          deleteInvoice: '删除清单',
          deleteVoucher: '删除凭证',
          clearData: '删除清单',
          remarks: '请确认',
          deleteRemarks: '删除备注',
          deleteInventory: '删除存货单据'
        }
        if (needTip.indexOf(type) > -1) {
          if (type === 'deleteInvoice') {
            const isVoucher = this.multipleSelection.filter(v => String(v.vm_state) === '2')
            if (isVoucher && isVoucher.length === selected.length) {
              return Message({
                message: '已生成凭证的清单不能删除！',
                type: 'warning',
                duration: duration
              })
            }
          } else if (type === 'clearData') {
            const isVoucher = this.multipleSelection.filter(v => String(v.vm_state) === '2')
            if (isVoucher && isVoucher.length === selected.length) {
              return Message({
                message: '已生成凭证的清单不能删除！',
                type: 'warning',
                duration: duration
              })
            }
          } else if (type === 'remarks') {
            if (this.multipleSelection[0].remark === null) {
              const num = 0
              this.text_length = 200 - num
              this.remarks_contents = ''
            } else {
              const num = this.multipleSelection[0].remark.length
              this.text_length = 200 - num
              this.remarks_contents = this.multipleSelection[0].remark
            }
            this.dialogVisible = true
            return
          } else if (type === 'deleteRemarks') {
            if (this.multipleSelection.length === 1 &&
              this.multipleSelection[0].remark === '' ||
              this.multipleSelection[0].remark === null) {
              return Message({
                message: '没有可删除的备注信息',
                type: 'warning',
                duration: duration
              })
            }
          } else if (type === 'deleteInventory') {
            const isInventory = this.multipleSelection.filter(v => String(v.inve_state) === '2')
            if (isInventory.length === 0) {
              return Message({
                message: '未生成存货单据的清单不能删除存货单据！',
                type: 'warning',
                duration: duration
              })
            }
          } else {
            const isVoucher = this.multipleSelection.filter(v => v.vt_num_list === null || v.vt_num_list === '')
            if (isVoucher && isVoucher.length === selected.length) {
              return Message({
                message: '未生成凭证的清单不能删除凭证！',
                type: 'warning',
                duration: duration
              })
            }
          }
          return MessageBox.alert(`${tips[type]}`, `${tipTitle[type]}`, {
            confirmButtonText: '确定',
            type: 'warning',
            callback: action => {
              if (action === 'confirm') {
                this[type]()
              }
            }
          })
        }
        return this[type]()
      },
      // 删除备注信息
      deleteRemarks () {
        const _ids = this.multipleSelection
        const idArray = []
        for (const item of _ids) {
          idArray.push(item.id)
        }
        this.$emit('on-delete-remarks', idArray)
      },
      saveAll () {
        this.$emit('on-save-all', this.editContent)
      },
      changeFilerBankCode () {
        this.$emit('on-filter', this.inputVal, this.vmState)
      },
      changeVmState () {
        this.$emit('on-filter', this.inputVal, this.vmState)
      },
      keyDownEvent () {
        const self = this
        self.keyDown.addEventListener('keypress', function (evt) {
          if (evt.keyCode === 13) {
            // Object.assign(self.filterForm, self.filterFormOld)
            self.$emit('on-filter', self.inputVal, self.vmState)
          }
        })
      },
      clearData () {
        const isDelete = this.multipleSelection
        const idArray = []
        for (const item of isDelete) {
          if (String(item.vm_state) !== '2') {
            idArray.push(item.id)
          }
        }
        this.$emit('on-clear-data', idArray)
      },
      moveToPurchase () {
        const list = this.multipleSelection
        const idArray = []
        for (const item of list) {
          idArray.push(item.id)
        }
        this.$emit('on-move-to-purchase', idArray)
      },
      queryInvoice () {
        this.$emit('query-invoice')
      },
      settingVoucher () {
        this.$emit('on-setting-voucher')
      },
      deleteInventory () {
        const idArray = []
        for (const item of this.multipleSelection) {
          if (String(item.inve_state) === '2') {
            idArray.push({
              billID: item.id,
              ccode: item.ccode,
              inve_billtitle_id: item.inve_billtitle_id
            })
          }
        }
        // ids = ids.slice(0, ids.length - 1)
        this.$emit('on-delete-inventory', idArray)
      },
      importPsbData () {
        this.$emit('on-import-data')
      },
      batchSetupAccount () {
        const isVoucher = this.multipleSelection.filter(v => v.vm_state !== 2)
        if (isVoucher.length === 0) {
          return Message({
            message: '请先选择交易流水',
            type: 'warning',
            duration: duration
          })
        }
        this.$emit('batch-setup-acct')
      }
    },
    computed: {
      keyDown () {
        return this.$refs.onKeyDown.$refs.input
      },
      changeType () {
        return this.changeTaxType
      }
    },
    mounted () {
      this.keyDownEvent()
    },
    components: {HelpModal, AddRemark}
  }
</script>
