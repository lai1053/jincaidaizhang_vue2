<template>
  <div>
    <el-table
      :height="fullHeight"
      :data="tableData"
      border
      ref="multipleTable"
      v-loading="loading"
      class="vue-table-main vue-table date-table"
      @selection-change="handleSelectionChange"
      @cell-mouse-enter="mouseEnter"
      @cell-mouse-leave="mouseLeave"
      @sort-change="sortChange"
      @cell-click="clickCell"
      stripe
    >
      <el-table-column
        type="selection"
        width="36px"
        align="center"
        cell-style="hideRowName"
      >
      </el-table-column>
      <el-table-column
        v-for="(item, i) in columns"
        v-if="!item.hide"
        :prop="item.prop"
        :label="item.label"
        :align="item.align"
        :width="item.width"
        :min-width="item.min_width"
        :class-name="item.className"
        :key="item.key"
        :sortable="item.sortable"
        :show-overflow-tooltip="item.tip?true:false"
      >
        <template slot-scope="scope">
          <!--v-if="scope.row.showIcon"-->
          <div v-if="scope.row.showIcon"  style="max-width: 20px">
            <div class="add-icon" v-if="item.addIcon">
              <el-button class="vue-operation-btn" type="text">
                <i class="el-icon-circle-plus-outline text-color" @click="addRow(scope.row, scope.$index)"></i>
              </el-button>
            </div>
            <div class="edit-icon text-color" v-if="item.editIcon&&String(scope.row.vm_state)!=='2'&& !scope.row.isEdit">
              <el-button class="vue-operation-btn" type="text">
                <i class="el-icon-edit text-color"></i>
              </el-button>
            </div>
          </div>
          <div v-if="item.warningIcon && scope.row.showWarningIcon" class="warning-icon">
            <el-tooltip
              effect="dark"
              :content="hint_input"
              placement="top">
              <el-button class="vue-operation-btn" style="color:#FFA854;"  type="text">
                <i class="el-icon-warning"></i>
              </el-button>
            </el-tooltip>
          </div>
          <div v-if="scope.row.isEdit">
            <div v-if="item.type === 'datePicker'" class="block date-picker">
              <el-date-picker
                ref="datePickers"
                popper-class="date-box"
                v-model="scope.row.defaultDate"
                :picker-options="pickerOptions"
                @change="changeVal(scope.row, 'date')"
                :clearable="clear"
                type="date"
                placeholder="选择日期"
              >
              </el-date-picker>
            </div>
            <div v-else-if="item.type === 'selectInput'">
              <el-select
                v-model="scope.row.code_name"
                filterable
                clearable
                @change="changeVal(scope.row, 'select')"
                popper-class="auto-complete"
                class="vue-edit-box"
              >
                <el-option
                  v-for="(val, i) in exacctList"
                  :key="val._id"
                  :label="val.exacct"
                  :value="val.exacct"
                  :disabled="val._IsEnd === 'false'"
                ></el-option>
                <div @click="addSubject(scope.row)" class="auto-complete-btn" >
                  <i class="el-icon-circle-plus-outline text-color"></i>
                  <span>新增</span>
                </div>
              </el-select>
              <span
                class="fuzhu"
                :class="scope.row.acct_10_ci_name?'fuzhu-selected-color':''"
                v-if="scope.row.isEdit&&item.prop==='code_name'&&isAssist(scope.row.code_name)"
                @click="showAssist(scope.row)">辅</span>
            </div>
            <div v-else-if="item.prop==='resetAmount'">
              <el-popover
                width="300"
                popper-class="popoverss"
                placement="top"
                trigger="manual"
                v-model="item.prop=='resetAmount' &&  visible">
                <span >{{scope.row[item.transform]}}</span></br>
                <span style="color: #C0C0C0" >{{result_s2}}</span>
                <el-input
                  ref="input_1"
                  slot="reference"
                  class="minInput"
                  v-model="scope.row[item.transform]"
                  @input="handleInput(item.prop,item.transform, $event,scope.row)"
                  @clear="clearData(item.prop,scope.row)"
                  @change="changeVal(scope.row)"
                  @blur="result_input(item.prop,scope.row)"
                  @keyup.8.native="backspaceInput(item.prop,scope.row)"
                  @focus="inputFocus($event,scope.$index, i)"
                  clearable>
                </el-input>
              </el-popover>
            </div>
            <div v-else-if="item.prop==='resetTaxAmount'">
              <el-popover
                placement="top"
                popper-class="popoverss"
                width="200"
                trigger="manual"
                v-model="item.prop=='resetTaxAmount' &&  visible1">
                <span>{{scope.row[item.transform]}}</span></br>
                <span style="color: #C0C0C0">{{result_s3}}</span>
                <el-input
                  slot="reference"
                  ref="input_2"
                  v-model="scope.row[item.transform]"
                  @input="handleInput(item.prop,item.transform, $event,scope.row)"
                  @clear="clearData(item.prop,scope.row)"
                  @change="changeVal(scope.row)"
                  @blur="result_input(item.prop,scope.row)"
                  @keyup.8.native="backspaceInput(item.prop,scope.row)"
                  @focus="inputFocus($event,scope.$index, i)"
                  clearable>
                </el-input>
              </el-popover>
            </div>
            <div v-else-if="item.prop==='summary'">
              <el-input
                slot="reference"
                v-model="scope.row[item.transform]"
                @input="handleInput(item.prop,item.transform, $event,scope.row)"
                @change="changeVal(scope.row)"
                @clear="clearData(item.prop,scope.row)"
                @focus="inputFocus($event,scope.$index, i)"
                clearable>
              </el-input>
            </div>
            <div v-else-if="item.prop==='att_num'">
              <el-input
                slot="reference"
                v-model="scope.row[item.transform]"
                @change="changeVal(scope.row)"
                @focus="inputFocus($event,scope.$index, i)"
                @input="attachmentInput($event,scope.row)"
                maxlength="6"
                clearable>
              </el-input>
            </div>
          </div>
          <div v-if="item.prop === 'operation' && !changeTaxType" class="operation-box">
            <operation
              :scope="scope"
              :editContent="editContent"
              :bookkeeping="bookkeeping"
              main-menu="expense"
              @save-all="saveAll"
            >
              <template slot="deleteBtn">
                <span v-if="indexData.checkoutFlag!=='Y'&&String(scope.row.vm_state)!=='2'">|</span>
                <el-button v-if="String(scope.row.vm_state)!=='2'" type="text" size="small" class="text-color" @click="deleteRow(scope.row, scope.$index)">删除
                </el-button>
              </template>
            </operation>

          </div>
          <div v-if="item.remarks && scope.row.remark!==null && scope.row.remark!==''" class="remarks" style="margin-left:-50px">
            <el-tooltip class="item" effect="dark" :content="scope.row.remark" placement="top-end"  popper-class="item">
              <el-button type="text"  @click="showRemark(scope.row)">
                <i class="iconfont icon-xiaoxi"></i>
              </el-button>
            </el-tooltip>
          </div>
          <voucher-mark
            v-if="item.prop === 'vm_state'"
            :scope="scope"
            :item="item"
            :change-tax-type="changeTaxType"
            main-menu="expense"
            @delete-voucher="deleteVoucher(scope.row)"
            @check-voucher="checkVoucher"
          ></voucher-mark>
          <div v-if="!scope.row.isEdit && item.prop !== 'vm_state' && item.prop!== 'operation'" class="text_ellipsis">{{scope.row[item.prop]}}</div>
        </template>

      </el-table-column>
    </el-table>
    <!-- 辅助核算 -->
    <assist-accounting
      :accountingData="accountingData"
      @refreshList="getAssist"
      @addAssissData="addAssistData"
    ></assist-accounting>
    <!--备注模块-->
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
    import VoucherMark from '@/views/components/ColumnItem/VoucherMark'
    import AddRemark from '@/views/components/AddRemark'

    import {deepCopy} from '@/utils/assist'
    import {checkNum, toMoney} from '@/utils/utils'
    import {Message} from 'element-ui'
    import Operation from '@/views/components/ColumnItem/Operation'
    import {showFuzhu, isAssist} from '@/views/components/assistAccounting/eval'
    import {assistData} from '@/views/components/assistAccounting/data'
    import AssistAccounting from '@/views/components/assistAccounting/index'
    import {isFuzhuSub, isDisabledSub} from '@/utils/eval'
    import {duration} from '@/views/components/data/common'
    import {crtTimeFtt} from '@/utils/dateFormat'
    import store from '@/store/index'
    import {subtraction, addition, multiplication, division_method, rmoney, parse, getFloat} from '../data/count'// 加减乘除
    export default {
      name: 'MainTable',
      data () {
        return {
          visible: false,
          visible1: false,
          hint_input: '', // 价税合计录入错误提示语
          result_s2: '',
          result_s3: '',
          fullHeight: document.documentElement.clientHeight - 112,
          isEdit: true,
          clear: false,
          sortParams: '',
          indexData: this.$store.getters.indexData,
          urlInfo: this.$store.getters.urlInfo,
          accountingData: assistData, // 辅助核算所需字段
          rowData: {},
          upRow: {},
          pickerOptions: {
            disabledDate (time) {
              const yearPeriod = store.getters.urlInfo.ssyf
              const year = parseInt(yearPeriod.substring(0, 4))
              const month = parseInt(yearPeriod.substring(4))
              const firstDay = (new Date(year, month - 1, 1)).getTime()
              const lastDay = (new Date(year, month, 0)).getTime()
              return time.getTime() < firstDay || time.getTime() > lastDay
            }
          },
          originRow: '',
          multipleSelection: [],
          isShift: false,
          dialogVisible: false,
          remarks_contents: '',
          text_length: 0,
          remarkId: 0
        }
      },
      props: {
        tableData: Array,
        exacctList: Array,
        columns: Array,
        loading: Boolean,
        list: Array,
        bookkeeping: Object,
        editContent: Object,
        changeTaxType: Boolean
      },
      computed: {
      },
      mounted () {
      },
      methods: {
        showRemark (row) {
          const num = row.remark.length
          this.text_length = 200 - num
          this.dialogVisible = true
          this.remarkId = row.id
          this.remarks_contents = row.remark
        },
        // 保存
        on_save_all (arg) {
          const idArray = []
          idArray.push(this.remarkId)
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
        // 输入框退格
        backspaceInput (prop, row) {
          const q1 = row.tax_amount
          const q2 = row.amount
          if (prop === 'resetAmount') {
            // 当前输入框 最后一位字符
            const q2_end = q2.charAt(q2.length - 1)
            const jia = q2.lastIndexOf('+')
            const jian = q2.lastIndexOf('-')
            const cheng = q2.lastIndexOf('*')
            const chu = q2.lastIndexOf('/')
            if (jia  > -1 ||
                    jian > -1 ||
                    cheng > -1 ||
                    chu  > -1) {
              if (q2_end !== '+' &&
                        q2_end !== '-' &&
                        q2_end !== '*' &&
                        q2_end !== '/') {
                this.result_s3 = parse(q2)
              } else {
                if (q2_end === '+') {
                  this.result_s3 = parse(q2.substring(0, jia))
                } else if (q2_end === '-') {
                  this.result_s3 = parse(q2.substring(0, jian))
                } else if (q2_end === '*') {
                  this.result_s3 = parse(q2.substring(0, cheng))
                } else if (q2_end === '/') {
                  this.result_s3 = parse(q2.substring(0, chu))
                }
              }
            } else {
              this.visible = false
            }
          } else if (prop === 'resetTaxAmount') {
            // 当前输入框 最后一位字符
            const q1_end = q1.charAt(q1.length - 1)
            const jia = q1.lastIndexOf('+')
            const jian = q1.lastIndexOf('-')
            const cheng = q1.lastIndexOf('*')
            const chu = q1.lastIndexOf('/')
            if (jia  > -1 ||
                    jian > -1 ||
                    cheng > -1 ||
                    chu  > -1) {
              if (q1_end !== '+' &&
                        q1_end !== '-' &&
                        q1_end !== '*' &&
                        q1_end !== '/') {
                this.result_s2 = parse(q1)
              } else {
                if (q1_end === '+') {
                  this.result_s2 = parse(q1.substring(0, jia))
                } else if (q1_end === '-') {
                  this.result_s2 = parse(q1.substring(0, jian))
                } else if (q1_end === '*') {
                  this.result_s2 = parse(q1.substring(0, cheng))
                } else if (q1_end === '/') {
                  this.result_s2 = parse(q1.substring(0, chu))
                }
              }
            } else {
              this.visible1 = false
            }
          }
        },
        /* //输入框回车事件
        input_enter(prop,evt,row){
          this.result_input(prop,row)
        },
        //输入框失去焦点事件
        input_blur(prop,row){
          this.result_input(prop,row)
        },*/
        // 输入框计算
        result_input (prop, row) {
          if (prop === 'resetAmount') {
            // 用户输入的值
            const nums = '' + row.amount
            const jia = nums.lastIndexOf('+')
            const jian = nums.lastIndexOf('-')
            const cheng = nums.lastIndexOf('*')
            const chu = nums.lastIndexOf('/')
            this.visible = false
            // 最后一位字符
            const nums_ent = nums.substring(nums.length - 1, nums.length)
            if (nums_ent !== '+' &&
                    nums_ent !== '-' &&
                    nums_ent !== '*' &&
                    nums_ent !== '/') {
              const result_o1 = parse(nums)
              row.resetAmount = toMoney(parseFloat(result_o1))
              row.amount = parseFloat(result_o1)
            } else {
              const result_o1 = parse(nums.substring(0, nums.length - 1))
              row.resetAmount = toMoney(parseFloat(result_o1))
              row.amount = parseFloat(result_o1)
            }
            this.$emit('change-val', row)
          } else if (prop === 'resetTaxAmount') {
            // 用户输入的值
            const nums = '' + row.tax_amount
            const jia = nums.lastIndexOf('+')
            const jian = nums.lastIndexOf('-')
            const cheng = nums.lastIndexOf('*')
            const chu = nums.lastIndexOf('/')
            this.visible1 = false
            // 最后一位字符
            const nums_ent = nums.substring(nums.length - 1, nums.length)
            if (nums_ent !== '+' &&
                    nums_ent !== '-' &&
                    nums_ent !== '*' &&
                    nums_ent !== '/') {
              const result_o1 = parse(nums)
              row.resetTaxAmount = toMoney(parseFloat(result_o1))
              row.tax_amount = parseFloat(result_o1)
            } else {
              const result_o1 = parse(nums.substring(0, nums.length - 1))
              row.resetTaxAmount = toMoney(parseFloat(result_o1))
              row.tax_amount = parseFloat(result_o1)
            }
            this.$emit('change-val', row)
          }
        },
        select (selection, row) {
          this.originRow = this.multipleSelection.length === 1 ? this.multipleSelection[0].index : this.originRow
          const hasOriginRow = this.multipleSelection.filter(item => {
            return item.index === this.originRow
          })
          if (hasOriginRow.length === 0) {
            this.originRow = ''
            return
          }
          const currentIndex = row.index
          const list = this.tableData
          if (this.isShift && this.multipleSelection.length > 1) {
            let selectArray = []
            if (currentIndex > this.originRow) {
              selectArray = list.slice(this.originRow, currentIndex + 1)
            } else {
              selectArray = list.slice(currentIndex, this.originRow + 1)
            }
            if (selectArray) {
              this.$refs.multipleTable.clearSelection()
              selectArray.forEach(item => {
                this.$refs.multipleTable.toggleRowSelection(item)
              })
            }
          }
        },
        deleteVoucher (rowData) {
          const ids = rowData.vch_id_list
          this.$emit('on-delete-voucher', ids, rowData)
        },
        checkVoucher (voucherId) {
          this.$emit('check-voucher', voucherId)
        },
        addRow (row, index) {
          const item = deepCopy(this.tableData[index])
          const defaultDate = new Date(+String(item.year_period).substring(0, 4), +String(item.year_period).substring(4), 0)
          item.formatDate = crtTimeFtt('yyyy-MM-dd', defaultDate)
          item.defaultDate = defaultDate
          item.id = 0
          item.vm_state = 1
          item.isEdit = true
          item.resetAmount = ''
          item.resetTaxAmount = ''
          item.amount = ''
          item.tax_amount = ''
          item.code_name = ''
          item.acct_10_ci_name = ''
          item.summary = ''
          item.att_num = ''
          item.remark = null
          item.index = this.tableData.length
          // this.tableData.push(item)
          this.tableData.splice(index + 1, 0, item)
          const upRow = this.upRow
          if (upRow.isEdit) {
            upRow.isEdit = false
            const acctArray = upRow.code_name.split(' ')
            if (acctArray.length > 1) {
              upRow.code_name = `${acctArray[0]} ${acctArray[1]}`
            }
          }
          this.upRow = this.tableData[this.tableData.length - 1]
          this.editContent.allSaveBtn = true
          // this.$emit('add-row', row, index)
        },
        deleteRow (row, index) {
          this.$emit('delete-row', row, index)
        },
        mouseEnter (row) {
          if (this.changeTaxType) return
          row.showIcon = true
        },
        mouseLeave (row) {
          row.showIcon = false
        },
        handleSelectionChange (val) {
          const curSelect = val
          this.multipleSelection = val
          this.$emit('on-selection-change', curSelect)
        },
        clearData (prop, row) {
          if (prop === 'resetAmount' || prop === 'resetTaxAmount') {
            const amount = row.amount ? parseInt(row.amount) : 0
            const taxAmount = row.tax_amount ? parseInt(row.tax_amount) : 0
            row.resetAmount = toMoney(row.amount)
            row.resetTaxAmount = toMoney(row.tax_amount)
            if (Math.abs(taxAmount) >= Math.abs(amount)) {
              this.hint_input = '进项税额应小于价税合计金额'
              row.showWarningIcon = true
              if (taxAmount === 0 && amount === 0) {
                row.showWarningIcon = false
              }
            } else {
              row.showWarningIcon = false
            }
          }
        },
        // 输入框值发生变化时
        changeVal (row, type) {
          if (type === 'date') {
            if (!row.defaultDate) {
              const defaultDate = new Date(+String(row.year_period).substring(0, 4), +String(row.year_period).substring(4), 0)
              row.formatDate = crtTimeFtt('yyyy-MM-dd', defaultDate)
              row.defaultDate = defaultDate
            } else {
              row.formatDate = crtTimeFtt('yyyy-MM-dd', row.defaultDate)
            }
          } else if (type === 'select') {
            row.acct_10_ci_name = ''
          }
          this.$emit('change-val', row)
        },
        // 控制输入框只能输入数字
        handleInput  (prop, type, evt, row) {
          const vm = this
          if (prop === 'resetAmount' || prop === 'resetTaxAmount') {
            if (!checkNum(evt)) {
              evt = evt.replace(/[^-\d*+=/|.]/g, '')
              setTimeout(function () {
                row[type] = evt
                row.resetAmount = toMoney(row.amount)
                row.resetTaxAmount = toMoney(row.tax_amount)
              }, 10)
            }
            const amount = row.amount ? parseInt(row.amount) : 0
            const taxAmount = row.tax_amount ? parseInt(row.tax_amount) : 0
            row.resetAmount = toMoney(row.amount)
            row.resetTaxAmount = toMoney(row.tax_amount)
            // 用户输入 实时计算
            if (prop === 'resetTaxAmount') {
              vm.$refs.input_2[0].$refs.input.addEventListener('keypress', function (evt) {
                if (evt.keyCode === 13) {
                  vm.result_input(prop, row)
                }
              })
              // 用户输入的值
              let nums = row.tax_amount
              // 最后一次输入的内容
              const num_end = nums.charAt(nums.length - 1)
              // 是否包含'数字'和'运算符'以外的字符--
              const other = /[^-\d*+=/|.]/g
              const or = other.test(nums.charAt(nums.length - 1))
              if (or) {
                nums = nums.substring(0, nums.length - 1)
              }
              // 加法
              const jia = nums.lastIndexOf('+')
              // 减法
              const jian = nums.lastIndexOf('-')
              // 乘法
              const cheng = nums.lastIndexOf('*')
              // 除法
              const chu = nums.lastIndexOf('/')
              // 等于
              const deng = nums.lastIndexOf('=')
              // 当最后一次输入的不是运算符
              if (num_end !== '+' &&
                    num_end !== '-' &&
                    num_end !== '*' &&
                    num_end !== '/' &&
                    num_end !== '=') {
                vm.result_s3 = parse(nums)
              } else {
                if (num_end === '+') {
                  vm.visible1 = true
                  const nums_jia = nums.substring(jia - 1, jia)
                  if (nums_jia !== '+' &&
                            nums_jia !== '-' &&
                            nums_jia !== '*' &&
                            nums_jia !== '/') {
                    const jia_results = nums.substring(0, jia)
                    vm.result_s3 = parse(jia_results)
                  } else {
                    nums = nums.substring(0, jia - 1) + '+'
                    evt = nums
                  }
                } else if (num_end === '-') {
                  const jian_qian = nums.substring(0, jian)
                  if (jian_qian !== '') {
                    vm.visible1 = true
                    const nums_jian = nums.substring(jian - 1, jian)
                    if (nums_jian !== '+' &&
                                nums_jian !== '-' &&
                                nums_jian !== '*' &&
                                nums_jian !== '/') {
                      const jian_results = nums.substring(0, jian)
                      vm.result_s3 = parse(jian_results)
                    } else {
                      nums = nums.substring(0, jian - 1) + '-'
                      evt = nums
                    }
                  }
                } else if (num_end === '*') {
                  vm.visible1 = true
                  const nums_cheng = nums.substring(cheng - 1, cheng)
                  if (nums_cheng !== '+' &&
                            nums_cheng !== '-' &&
                            nums_cheng !== '*' &&
                            nums_cheng !== '/') {
                    const cheng_results = nums.substring(0, cheng)
                    vm.result_s3 = parse(cheng_results)
                  } else {
                    nums = nums.substring(0, cheng - 1) + '*'
                    evt = nums
                  }
                } else if (num_end === '/') {
                  vm.visible1 = true
                  const nums_chu = nums.substring(chu - 1, chu)
                  if (nums_chu !== '+' &&
                            nums_chu !== '-' &&
                            nums_chu !== '*' &&
                            nums_chu !== '/') {
                    const chu_results = nums.substring(0, chu)
                    vm.result_s3 = parse(chu_results)
                  } else {
                    nums = nums.substring(0, chu - 1) + '/'
                    evt = nums
                  }
                } else if (num_end === '=') {
                  vm.visible1 = false
                  const nums_deng = nums.substring(deng - 1, deng)
                  if (nums_deng !== '+' &&
                            nums_deng !== '-' &&
                            nums_deng !== '*' &&
                            nums_deng !== '/') {
                    const deng_results_1 = nums.substring(0, deng)
                    evt = parse(deng_results_1)
                    row.tax_amount = parse(deng_results_1)
                  } else {
                    const deng_results_2 = nums.substring(0, deng - 1)
                    evt = parse(deng_results_2)
                    row.tax_amount = parse(deng_results_2)
                  }
                }
              }
              this.$emit('change-val', row)
            } else if (prop === 'resetAmount') {
              vm.$refs.input_1[0].$refs.input.addEventListener('keypress', function (evt) {
                if (evt.keyCode === 13) {
                  vm.result_input(prop, row)
                }
              })

              // 用户输入的值
              let nums = row.amount
              // 最后一次输入的内容
              const num_end = nums.charAt(nums.length - 1)
              // 是否包含'数字'和'运算符'以外的字符
              const other = /[^-\d*+=/|.]/g
              const or = other.test(nums.charAt(nums.length - 1))
              if (or) {
                nums = nums.substring(0, nums.length - 1)
              }
              // 加法
              const jia = nums.lastIndexOf('+')
              // 减法
              const jian = nums.lastIndexOf('-')
              // 乘法
              const cheng = nums.lastIndexOf('*')
              // 除法
              const chu = nums.lastIndexOf('/')
              // 等于
              const deng = nums.lastIndexOf('=')
              // 当最后一次输入的不是运算符
              if (num_end !== '+' &&
                    num_end !== '-' &&
                    num_end !== '*' &&
                    num_end !== '/' &&
                    num_end !== '=') {
                vm.result_s2 = parse(nums)
              } else {
                if (num_end === '+') {
                  vm.visible = true
                  const nums_jia = nums.substring(jia - 1, jia)
                  if (nums_jia !== '+' &&
                            nums_jia !== '-' &&
                            nums_jia !== '*' &&
                            nums_jia !== '/') {
                    const jia_results = nums.substring(0, jia)
                    vm.result_s2 = parse(jia_results)
                  } else {
                    nums = nums.substring(0, jia - 1) + '+'
                    evt = nums
                  }
                } else if (num_end === '-') {
                  const jian_qian = nums.substring(0, jian)
                  if (jian_qian !== '') {
                    vm.visible = true
                    const nums_jian = nums.substring(jian - 1, jian)
                    if (nums_jian !== '+' &&
                                nums_jian !== '-' &&
                                nums_jian !== '*' &&
                                nums_jian !== '/') {
                      const jian_results = nums.substring(0, jian)
                      vm.result_s2 = parse(jian_results)
                    } else {
                      nums = nums.substring(0, jian - 1) + '-'
                      evt = nums
                    }
                  }
                } else if (num_end === '*') {
                  vm.visible = true
                  const nums_cheng = nums.substring(cheng - 1, cheng)
                  if (nums_cheng !== '+' &&
                            nums_cheng !== '-' &&
                            nums_cheng !== '*' &&
                            nums_cheng !== '/') {
                    const cheng_results = nums.substring(0, cheng)
                    vm.result_s2 = parse(cheng_results)
                  } else {
                    nums = nums.substring(0, cheng - 1) + '*'
                    evt = nums
                  }
                } else if (num_end === '/') {
                  vm.visible = true
                  const nums_chu = nums.substring(chu - 1, chu)
                  if (nums_chu !== '+' &&
                            nums_chu !== '-' &&
                            nums_chu !== '*' &&
                            nums_chu !== '/') {
                    const chu_results = nums.substring(0, chu)
                    vm.result_s2 = parse(chu_results)
                  } else {
                    nums = nums.substring(0, chu - 1) + '/'
                    evt = nums
                  }
                } else if (num_end === '=') {
                  vm.visible = false
                  const nums_deng = nums.substring(deng - 1, deng)
                  if (nums_deng !== '+' &&
                            nums_deng !== '-' &&
                            nums_deng !== '*' &&
                            nums_deng !== '/') {
                    const deng_results_1 = nums.substring(0, deng)
                    evt = parse(deng_results_1)
                    row.amount = parse(deng_results_1)
                    row.resetAmount = toMoney(parseFloat(parse(deng_results_1)))
                  } else {
                    const deng_results_2 = nums.substring(0, deng - 1)
                    evt = parse(deng_results_2)
                    row.amount = parse(deng_results_1)
                    row.resetAmount = toMoney(parseFloat(parse(deng_results_1)))
                  }
                }
              }
              this.$emit('change-val', row)
            }
            if (parse('' + row.tax_amount) < 0 && parse('' + row.amount) > 0) {
              vm.hint_input = '录入数据不合理，请检查'
              row.showWarningIcon = true
            } else if (parse('' + row.tax_amount) > 0 && parse('' + row.amount) < 0) {
              vm.hint_input = '录入数据不合理，请检查'
              row.showWarningIcon = true
            } else {
              if (Math.abs(parse('' + row.tax_amount)) >= Math.abs(parse('' + row.amount))) {
                row.showWarningIcon = true
                vm.hint_input = '进项税额应小于价税合计金额'
                if (parse('' + row.tax_amount) === 0 && parse('' + row.amount) === 0) {
                  row.showWarningIcon = false
                }
              } else {
                row.showWarningIcon = false
              }
            }
            vm.$emit('on-hint', this.hint_input)
          }
        },
        addSubject (row) {
          this.$emit('on-add-sub', row)
        },
        // 排序
        sortChange (e) {
          this.sortParams = e
          const tableData = deepCopy(this.list)
          this.$emit('sort-change', tableData, e)
        },
        // 操作>图片
        toImg (row) {
          this.$emit('on-click-img', row)
        },
        saveAll () {
          this.$emit('save-all')
        },
        isAssist (acct) {
          return isAssist(acct)
        },
        showAssist (row) {
          const disableSub = isDisabledSub(row.code_name)
          if (disableSub) {
            return Message({
              message: '该科目已被禁用，请到科目期初进行查看',
              type: 'warning',
              duration: duration
            })
          }
          this.rowData = row
          const curValArray = row.code_name.split(' ')
          this.accountingData.title = `${curValArray[0]} ${curValArray[1]}`
          this.accountingData.tips = ''
          this.accountingData.acctCiName = row.acct_10_ci_name
          this.getAssist()
        },
        getAssist () {
          showFuzhu(this.accountingData)
        },
        addAssistData (value) {
          this.rowData.acct_10_ci_name = value
          this.changeVal(this.rowData)
        },
        clickCell (row, f) {
          if (this.changeTaxType || f.property === 'operation' || f.property === 'vm_state' || String(row.vm_state) === '2' || row.isEdit) {
            return
          }
          row.isEdit = true
          row.showIcon = false
          row.code_name = isFuzhuSub(row.code_name)
          const upRow = this.upRow
          if (upRow.isEdit) {
            upRow.isEdit = false
            if (!upRow.defaultDate) {
              const defaultDate = new Date(+String(upRow.year_period).substring(0, 4), +String(upRow.year_period).substring(4), 0)
              upRow.formatDate = crtTimeFtt('yyyy-MM-dd', defaultDate)
              upRow.defaultDate = defaultDate
            }
            const acctArray = upRow.code_name.split(' ')
            if (acctArray.length > 1) {
              upRow.code_name = `${acctArray[0]} ${acctArray[1]}`
            }
          }
          this.upRow = row
          // this.$emit('edit-data', row)
        },
        keyDownEvent (evt) {
          const self = this
          if (evt.shiftKey) {
            self.isShift = true
          }
        },
        keyUpEvent (evt) {
          const self = this
          self.isShift = false
        },
        inputFocus (e, row, col) {
          const ele = e.target
          const self = this
          this.$nextTick(() => {
            ele.select()
          })

          ele.addEventListener('keydown', function (evt) {
            const parent = self.$refs.multipleTable.$refs.bodyWrapper
            const nextTr = parent.getElementsByTagName('tr')
            // 下
            if (evt.keyCode === 40) {
              event.preventDefault()
              if (nextTr.length - 1 === row) return
              self.changeRow(nextTr, row, col, 1)
              // 上
            } else if (evt.keyCode === 38) {
              event.preventDefault()
              if (row === 0) return
              self.changeRow(nextTr, row, col, -1)
              // 右
            } else if (evt.keyCode === 13) {
              if (self.visible || self.visible1) return
              event.preventDefault()
              const inputs = parent.getElementsByTagName('tr')[row].getElementsByTagName('input')
              if (col === inputs.length - 2) {
                if (nextTr.length - 1 === row) return
                self.changeRow(nextTr, row, 2, 1)
              } else {
                inputs[col + 2].focus()
              }
            }
          })
        },
        changeRow (nextTr, row, col, direction) {
          // direction 1向下 -1向上
          nextTr[row + direction].childNodes[col + 1].click()
          this.$nextTick(() => {
            const parent1 = this.$refs.multipleTable.$refs.bodyWrapper
            const jumpEle = parent1.getElementsByTagName('tr')[row + direction].childNodes[col + 1]
            jumpEle.getElementsByTagName('input')[0].focus()
          })
        },
        attachmentInput (evt, row) {
          const reg = /^([1-9]\d*|[0])$/
          const flag = reg.test(evt)
          if (!flag) {
            if (evt.startsWith('0')) {
              evt = 0
            } else {
              evt = evt.replace(/[^\d]/g, '')
            }
            setTimeout(function () {
              row.att_num = evt
            }, 10)
          }
        }
      },
      components: {
        VoucherMark,
        Operation,
        AssistAccounting,
        AddRemark
      }
    }
</script>

<style>
  .item{
    line-height: 180%;
    word-wrap : break-word;
    text-align: left;
    max-width:400px;
  }
  .popoverss {
    line-height: 180%;
    word-wrap : break-word;
    text-align: right;
  }
  .el-popover__title{
    text-align: left;
  }
</style>
<style lang="scss">
  .minInput{
    min-width:100px
  }
  .date-table.vue-table.el-table{
    .date-picker .el-input__inner{
      width: 100%;
    }

  }
  .date-table{
    .el-input__inner{
      width: 100%;
      height: 30px;
      line-height: 30px;
      border-radius: 3px;
    }
    .el-date-editor.el-input, .el-date-editor.el-input__inner{
      padding-right: 15px;
      width: 100%;

    }
    .add-icon{
      position: absolute;
      top:3px;
      right: 5px;
      button{
        overflow: hidden;
        padding:8px 0;
      }
    }
    .remarks{
      position: absolute;
      top:0px;
      right: 35px;
      button{
        overflow: hidden;
        padding:8px 0;
        color: #CCCCCC;
      }
    }
    .edit-icon{
      position: absolute;
      top:0;
      left: -22px;
      color: #1ab394;
      button{
        overflow: hidden;
        padding:10px;
      }
    }
    .warning-icon{
      position: absolute;
      z-index: 999;
      top:0;
      right: 10px;
      button{
        overflow: hidden;
        padding:10px;
        border:none;
      }
    }
    .el-icon-circle-plus-outline{

    }
    .el-select {
      width: calc(100% - 22px);
    }
    .fuzhu {
      right: 11px;
    }
    .el-input-group__append {
      background-color: #ffffff ;
      border: #2ab599;
      color: #C0C0C0;
    }
  }


</style>
