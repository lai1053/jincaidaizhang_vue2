<style lang='scss'>
  .subject-confirm-com {
    .el-table::before {
      height: 0;
      .el-table .cell {
        padding-left: 12px;
        padding-right: 12px;
      }
    }
  }
  .filter-box{
    ul,li{
      list-style: none;
      padding: 0;
      margin: 0;
    }
    li {
      line-height: 30px;
      cursor: pointer;
    }
    .result-box{
      margin-top: 5px;
      height: 210px;
      width: 200px;
      border:1px solid #f3f3f8;
      overflow-y: auto;
    }
  }
</style>
<style lang="scss" scoped>
  .batchSetup{
    float: right;
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
  .btn-box{
    float: right;
  }
</style>
<template>
  <div class="subject-confirm-com" tabindex="1" @keydown="keyDownEvent($event)" @keyup="keyUpEvent($event)">
    <div class="subject-confirm-head">
      <el-input  v-if="mainMenu==='purchase'&&step==='zero'" v-model="batchSelect[service.step].inputVal" @input="inpFilter" size="small" placeholder="请输入发票号码或往来单位" >
        <i slot="prefix" class="el-input__icon el-icon-search"></i>
      </el-input>
      <el-input v-else v-model="service.inputVal" @input="inpFilter" size="small" placeholder="请输入往来单位" >
        <i slot="prefix" class="el-input__icon el-icon-search"></i>
      </el-input>
      <!--筛选按钮-->
      <el-popover
        v-if="(mainMenu==='purchase'&&step==='zero') || (mainMenu==='purchase'&&step==='one') "
        title="筛选条件"
        placement="bottom"
        width="446"
        trigger="click"
        v-model="visible"
        popper-class="header-filter-box">
        <el-form label-position="right" label-width="112px" class="filter-box" :model="batchSelect[service.step].formContent">
          <slot name="filterItem"></slot>
          <el-form-item label="发票类型" >
            <el-select
              v-model="batchSelect[service.step].formContent.billTypeId"
              size="small"
              filterable>
              <el-option
                v-for="(item, idx) in screen"
                :key="idx"
                :label="item"
                :value="item"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            v-if="mainMenu==='purchase'&&step==='zero'"
            label="开票日期">
            <el-col :span="11">
              <el-date-picker
                v-model="batchSelect[service.step].formContent.startDate"
                type="date"
                size="small"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                @change="getDateBefore('startDate')"
                placeholder="选择日期">
              </el-date-picker>
            </el-col>
            <el-col class="line" :span="2">至</el-col>
            <el-col :span="11">
              <el-date-picker
                v-model="batchSelect[service.step].formContent.endDate"
                type="date"
                size="small"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                @change="getDateBefore('endDate')"
                placeholder="选择日期">
              </el-date-picker>
            </el-col>
          </el-form-item>
        </el-form>
        <div style="text-align: right; margin: 0" class="filter-box-bottom">
          <el-button size="mini" class="button-com" @click="resetForm">重置</el-button>
          <el-button type="primary" size="mini" @click="filterList">查询</el-button>
        </div>
        <span slot="reference" class="reference"><i class="iconfont icon-daohangshaixuan"></i></span>
      </el-popover>
      <div v-if="mainMenu==='purchase'&&step==='zero'" class="head_radio-group">
        <el-radio-group v-model="service.step" @change="changeRadio">
          <el-radio label="account">已选票（{{service.oldAccountList.length}}）</el-radio>
          <el-radio label="unAccount">待选票（{{service.oldNotAccountList.length}}）张</el-radio>
        </el-radio-group>
      </div>
      <div class="btn-box">
         <span style="margin-left: 10px;">
        <el-button
          v-for="(lable, key) in service.settleMethod"
          type="primary"
          size="small" :key="key" @click="editSettleMethod(key, 'sm_id')">{{lable}}</el-button>
           <el-button
             v-if="mainMenu==='purchase'&&step==='zero'&&service.step==='account'"
             size="small"
             type="primary"
             @click="handleInvoice('delete')"
             >暂不入账</el-button>
           <el-button
             v-if="mainMenu==='purchase'&&step==='zero'&&service.step==='unAccount'"
             size="small"
             type="primary"
             @click="handleInvoice('add')">入账</el-button>
      </span>
      </div>
      <el-popover
        v-if="mainMenu==='purchase'&&step==='one'&&entAcctVO&&ShowPopover==='2'"
        placement="bottom"
        width="300"
        trigger="hover"
        style="float: right;"
        content="已认证前期票已在以前期间完成了业务和科目的确认，本期不再参与理票，请在理票完成后，直接进行‘待认证转进项’的处理">
        <el-button slot="reference" class="vue-operation-btn" style="color:#FFA854; font-size: 17px;"  type="text">
          <i class="el-icon-question"></i>
        </el-button>
      </el-popover>
    </div>
    <el-table
      :data="service.list "
      ref="multipleTable"
      header-align="center"
      height="356"
      stripe
      highlight-current-row
      @select="select"
      @cell-click="clickCell"
      @sort-change="sortChange"
      @selection-change="handleSelectionChange"
      style="width: 100%">
      <el-table-column
        width="50px"
        align="center"
        cell-style="hideRowName"
        type="selection">
      </el-table-column>

      <el-table-column
        v-for="(item, i) in serviceColumns"
        :prop="item.prop"
        :label="item.label"
        :align="item.align"
        :width="item.width"
        :min-width="item.minWidth"
        :class-name="item.className"
        :key="item.key"
        :sortable="item.sortable"
        :show-overflow-tooltip="item.tip?true:false">
        <template slot-scope="scope">
          {{item.prop==='sm_name'? service.settleMethod[scope.row.sm_id]:
          item.prop==='isPurchase'? service.isPurchase[scope.row.isPurchase]:
          item.prop === 'isAccount'? service.isAccount[scope.row.isAccount]: scope.row[item.prop]}}
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
  import {sortChange, toMoney} from '@/utils/utils'
  import {deepCopy} from '@/utils/assist'
  import {Message, MessageBox} from 'element-ui'
  import {duration} from '@/views/components/data/common'

  export default {
    name: 'StepsOne',
    data() {
      return {
        entAcctVO: this.$store.getters.indexData.businessConfigVO,
        selection: [],
        oldList: [],
        batchSelect: {
          account: {
            inputVal: '',
            selection: [],
            formContent: {
              billTypeId: '全部',
              startDate: '',
              endDate: ''
            },
            filterForm: {
              billTypeId: '全部',
              startDate: '',
              endDate: ''
            }
          },
          unAccount: {
            inputVal: '',
            selection: [],
            formContent: {
              billTypeId: '全部',
              startDate: '',
              endDate: ''
            },
            filterForm: {
              billTypeId: '全部',
              startDate: '',
              endDate: ''
            }
          }
        },
        filterFormOld: {
          billTypeId: '全部',
          startDate: '',
          endDate: ''
        },
        sortData: {
          prop: '',
          order: ''
        },
        screen: [],
        isShift: false,
        originRow: '',
        isCtrl: false,
        multipleSelection: [],
        billTypes: {

        },
        visible: false,
      }
    },
    props: {
      mainMenu: String,
      service: Object,
      serviceColumns: Array,
      step: {
        default: 'one',
        type: String
      }
    },

    created() {
      if (this.$store.getters.urlInfo.taxType === '1') {
        this.screen = ['全部',  '普票', '专票', '代开专票', '机动车', '海关', '统一收购', '农产品',  '通行费']
      } else {
        this.screen = ['全部',  '普票', '专票（已认证）', '专票（未认证）', '代开专票（已认证）',
          '代开专票（未认证）', '机动车（已认证）', '机动车（未认证）', '海关（已认证）',
          '统一收购（已认证）', '农产品（已认证）', '通行费（已认证）', '通行费（未认证）']
      }
      this.inpFilter()
    },
    watch: {
      'visible': function (newVal) {
        if (newVal) {
          const {step} = this.service
          Object.assign(this.batchSelect[step].formContent, this.batchSelect[step].filterForm)
        }
      }
    },
    methods: {
      // 切换
      changeRadio(val){
        if (this.batchSelect[val].inputVal) {
          this.inpFilter()
        } else {
          this.filterList()
        }
      },
      // 底部计算
      summation(list){
        let hjje = 0 // 金额
        let negativeSum = 0
        let hjse = 0 // 正税
        let hgseB = 0 // 负税
        for(const item of  list){
          if (item.hjje < 0) {
            negativeSum = parseFloat((+negativeSum) + item.hjje).toFixed(2)
          } else {
            hjje = parseFloat((+hjje) + item.hjje).toFixed(2)
          }
          if(item.hjse < 0){
            hgseB = parseFloat((+hgseB) + item.hjse).toFixed(2)
          }else {
            hjse = parseFloat((+hjse) + item.hjse).toFixed(2)
          }
        }
        this.service.hjje = toMoney(hjje)
        this.service.negativeSum = toMoney(negativeSum)
        this.service.hjse = toMoney(hjse)
        this.service.hgseB = toMoney(hgseB)
        this.service.listNum = list.length

      },
      filterList () {
        const {oldAccountList, step, oldNotAccountList} = this.service
        let searchList = step === 'account' ? deepCopy(oldAccountList) : deepCopy(oldNotAccountList)
        const {billTypeId, startDate, endDate} = this.batchSelect[step].formContent
        if (billTypeId !== '全部') {
          searchList = searchList.filter((item) => item.inv_type_name === billTypeId)
        }
        const start = startDate ? parseInt(startDate.replace(/-/g, '')) : ''
        const end = endDate ? parseInt(endDate.replace(/-/g, '')) : ''
        if (start && end) {
          searchList = searchList.filter((item) => start <= item.createDate && item.createDate <= end)
        } else if (start && !end) {
          searchList = searchList.filter((item) => start <= item.createDate)
        } else if (!start && end) {
          searchList = searchList.filter((item) => item.createDate <= end)
        }
        Object.assign(this.batchSelect[step].filterForm, this.batchSelect[step].formContent)
        this.service.list = searchList
        if (this.sortData.prop) {
          if (this.sortData.prop === 'inv_no') {
            this.dealWithCustomSort(this.sortData)
          } else {
            sortChange(this.service.list, this.sortData)
          }
        }
        this.visible = false
        this.batchSelect[step].inputVal = ''
        this.service.inputVal = ''
        this.summation(this.service.list)
      },




      resetForm(){
        const {step} = this.service
        Object.assign(this.batchSelect[step].formContent, this.filterFormOld)
      },
      getDateBefore (type) {
        const {step} = this.service
        const {startDate, endDate} = this.batchSelect[step].formContent
        if (startDate && endDate && parseInt(endDate.replace(/-/g, '')) < parseInt(startDate.replace(/-/g, ''))) {
          this.batchSelect[step].formContent[type] = ''
          return Message({
            message: '所选开票日期的开始日期不能大于所选开票日期截至时间！',
            type: 'warning',
            duration: duration
          })
        }
      },
      select (selection, row) {
        const {service} = this
        if (this.multipleSelection.length === 1) {
          this.originRow = service.list.indexOf(this.multipleSelection[0])
        }
        if (this.originRow !== '' && this.originRow > -1) {
          const hasOriginRow = this.multipleSelection.filter(item => {
            return item.key === service.list[this.originRow].key
          })
          if (hasOriginRow.length === 0) {
            this.originRow = ''
            return
          }
          const currentkey =  service.list.indexOf(row)
          const list = this.service.list
          if (this.isShift && this.multipleSelection.length > 1) {
            let selectArray = []
            if (currentkey > this.originRow) {
              selectArray = list.slice(this.originRow, currentkey + 1)
            } else {
              selectArray = list.slice(currentkey, this.originRow + 1)
            }
            if (selectArray) {
              this.$refs.multipleTable.clearSelection()
              selectArray.forEach(item => {
                this.$refs.multipleTable.toggleRowSelection(item)
              })
            }
          }
        }
      },
      clickCell (row) {
        // if (this.isCtrl) {
        //   this.$refs.multipleTable.toggleRowSelection(row)
        // }
      },
      sortChange(e) {
        this.sortData.prop = e.prop
        this.sortData.order = e.order
        if (e.prop) {
          if (e.prop === 'inv_no') {
            this.dealWithCustomSort(this.sortData)
          } else {
            sortChange(this.service.list, e)
          }
        } else {
          this.getFilter()
        }
      },
      dealWithCustomSort (e) {
        const {list} = this.service
        const customsList = []
        const commonList = []
        for (const item of list) {
          if (item.inv_no.indexOf('L') > -1) {
            customsList.push(item)
          } else {
            commonList.push(item)
          }
        }
        sortChange(commonList, e)
        if (e.order === 'ascending') {
          this.service.list = commonList.concat(customsList)
          return
        }
        this.service.list = customsList.concat(commonList)
      },
      // 输入框查询的时候的过滤规则
      inpFilter () {
        const service = this.service
        this.getFilter()
        if (this.sortData.prop) {
          if (this.sortData.prop === 'inv_no') {
            this.dealWithCustomSort(this.sortData)
          } else {
            sortChange(service.list, this.sortData)
          }
        }
      },
      getFilter() {
        const self = this
        const {allList, oldAccountList, oldNotAccountList, step, inputVal } = self.service
        const valStr = self.mainMenu === 'purchase' && self.step === 'zero' ? this.batchSelect[step].inputVal.replace(/^\s+|\s+$/g, '') : inputVal.replace(/^\s+|\s+$/g, '')
        let data = []
        if (self.mainMenu === 'purchase' && self.step === 'zero' || self.mainMenu === 'purchase' && self.step === 'one') {
          data = step === 'account' ? deepCopy(oldAccountList) : deepCopy(oldNotAccountList)
          Object.assign(this.batchSelect[step].filterForm, this.filterFormOld)
        } else {
          data = deepCopy(allList)
        }
        if (valStr) {
          const result = []
          data.forEach(function (item) {
            const itemName = self.mainMenu === 'purchase' && self.step === 'zero' ? item.fkfmc : item.cust_name
            itemName.replace(/^\s+|\s+$/g, '').indexOf(valStr) > -1 ? result.push(item) : ''  // 过滤数据
            if (self.mainMenu === 'purchase' && self.step === 'zero') {
              const filterName = item.inv_no
              filterName.replace(/^\s+|\s+$/g, '').indexOf(valStr) > -1 ? result.push(item) : ''
            }
          })
          this.service.list = Array.from(new Set(result))
        } else {
          this.service.list = data
        }
        this.summation(this.service.list)
      },
      handleSelectionChange(list) {
        this.selection = list
        this.multipleSelection = list
        let all = this.service.list
        if (list && list.length) {
          all = list
        }
        if(this.step === 'zero'){
          let hjje = 0 // 金额
          let negativeSum = 0
          let hjse = 0 // 正税
          let hgseB = 0 // 负税
          for(const item of  all){
            if (item.hjje < 0) {
              negativeSum = parseFloat((+negativeSum) + item.hjje).toFixed(2)
            } else {
              hjje = parseFloat((+hjje) + item.hjje).toFixed(2)
            }
            if(item.hjse < 0){
              hgseB = parseFloat((+hgseB) + item.hjse).toFixed(2)
            }else {
              hjse = parseFloat((+hjse) + item.hjse).toFixed(2)
            }
          }
          this.service.hjje = toMoney(hjje)
          this.service.negativeSum = toMoney(negativeSum)
          this.service.hjse = toMoney(hjse)
          this.service.hgseB = toMoney(hgseB)
          this.service.listNum = all.length
        }else {
          let amount = 0
          let negativeAmount = 0
          let purchaseNumber = 0
          let accountNumber = 0
          for (const item of all) {
            if (item.amount < 0) {
              negativeAmount = parseFloat((+negativeAmount) + item.amount)
            } else {
              amount = parseFloat((+amount) + item.amount)
            }
            if (this.step === 'zero') {
              if (Number(item.isPurchase)) {
                purchaseNumber++
              }
              if (Number(item.isAccount)) {
                accountNumber++
              }
            }
          }
          this.service.purchaseNumber = purchaseNumber
          this.service.accountNumber = accountNumber
          this.service.listNum = all.length
          this.service.amount = toMoney(amount.toFixed(2))
          this.service.negativeAmount = negativeAmount ? toMoney(negativeAmount.toFixed(2)) : 0
        }
      },
      editSettleMethod(id, name) {
        const {service, selection} = this
        for (const item of selection) {
          const idx2 = service.allList.findIndex(v => v.key === item.key)
          if (idx2 > -1) {
            service.allList[idx2][name] = Number(id)
          }
          item[name] = Number(id)
        }
        if (this.step === 'zero') {
          const accountIndex = service.allList.findIndex(item => Number(item.isAccount) === 1)
          if (accountIndex === -1) {
            this.$emit('on-change-account', true)
          } else {
            this.$emit('on-change-account', false)
          }
        }
        this.$refs.multipleTable.clearSelection()
      },
      batchSetupAccount () {
        this.$emit('batch-setup-account')
      },
      handleInvoice(type) {
        const {service, selection} = this
        if (!selection.length) {
          const msg = type === 'delete' ? '请选择暂不入账的发票！' :  '请选择入账的发票！'
          return Message({
            message: msg,
            type: 'warning',
            duration: duration
          })
        }
        for (const item of selection) {
          if (type === 'delete') {
            service.oldNotAccountList.push(item)
            const idx3 = service.oldAccountList.findIndex(v => v.key === item.key)
            if (idx3 > -1) {
              service.oldAccountList.splice(idx3, 1)
            }
          } else {
            service.oldAccountList.push(item)
            const idx3 = service.oldNotAccountList.findIndex(v => v.key === item.key)
            if (idx3 > -1) {
              service.oldNotAccountList.splice(idx3, 1)
            }
          }
          const idx1 = service.list.indexOf(item)
          if (idx1 > -1) {
            service.list.splice(idx1, 1)
          }
        }
        this.$refs.multipleTable.clearSelection()
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
      }
    },
    computed: {
      ShowPopover () {
        return this.$store.getters.indexData.businessConfigVO.incomeInvRule
      }
    }
  }
</script>
