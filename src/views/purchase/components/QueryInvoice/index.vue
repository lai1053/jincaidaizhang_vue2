<style lang="scss">
  .query-invoice-box {
    .purchase-query-box{
      height: 48px;
      div {
        float: left;
      }
      .button-box{
        float: right;
      }
    }
    .purchase-query-col{
      height: 34px;
      line-height: 34px;
    }
    .purchase-query-edit {
      margin-right: 16px;
    }

    .el-date-editor{
      width: 230px !important;
    }
    .el-input{
      width: 230px;
    }
    .query-bill-date-input{
      width: 230px
    }
  }
</style>
<template>
    <div class="query-invoice-box">
      <div class="purchase-query-box">
        <template v-for="(item, index) in mainTitle">
          <div  class="purchase-query-col">{{item.name}}：</div>
          <div  class="purchase-query-edit">
            <template v-if="item.isDate">
              <el-date-picker
                popper-class="query-bill-date-input"
                v-model="queryParams.date"
                :picker-options="pickerOptions"
                size="small"
                type="month"
                ref="datePicker"
                value-format="yyyyMM"
                placeholder="选择月">
              </el-date-picker>
            </template>
            <template v-else>
              <el-input
                :ref="item.key"
                size="small"
                clearable
                v-model="queryParams[item.key]"
                :placeholder="item.placeholder"
                :maxlength="item.maxLength"
              ></el-input>
            </template>
          </div>
        </template>
        <div class="button-box">
          <el-button
            class="button-com button-right"
            size="small"
            @click="resetQueryData"
          >重置</el-button>
          <el-button
            class="button-right"
            type="primary"
            size="small"
            @click="queryInvoice"
            style="margin-left: 15px"
          >查询</el-button>
        </div>

      </div>
      <!--查询列表-->
      <div class="query-content">
        <query-content
          :main-detail="queryInvoiceDetail"
          :columns="columns"
          ref="queryTable"
        ></query-content>
      </div>
    </div>
</template>

<script>
  import {mainTitle, columns} from './data/com'
  import store from '@/store/index'
  import {deepCopy} from '@/utils/assist'

  import QueryContent from './QueryContent'
  import {Message, Loading} from 'element-ui'
  import {localParams, duration} from '@/views/components/data/common'
  import {crtTimeFtt} from '@/utils/dateFormat'
  import {queryJxHistoryInvoice} from '@/api/purchase'
  import {toMoney} from '@/utils/utils'

  export default {
    name: 'index',
    data () {
      return {
        columns: deepCopy(columns),
        mainTitle: mainTitle,
        queryParams: {
          date: '',
          inv_no: '',
          inv_code: ''
        },
        defaultParams: {
          date: '',
          inv_no: '',
          inv_code: ''
        },
        pickerOptions: {
          disabledDate (time) {
            const date = new Date()
            const year = date.getFullYear()
            const month = date.getMonth() + 1
            const lastDay = (new Date(year, month - 1, 0)).getTime()
            // const firstDay = (new Date(year - 1, month, 0))
            return time.getTime() > lastDay
          }
        }
      }
    },
    props: {
      queryInvoiceDetail: Object
    },
    created () {
      this.init()
    },
    methods: {
      init () {
        // const currentTime = store.getters.urlInfo.ssyf
        // const date = new Date(parseInt(currentTime.substr(0, 4)), parseInt(currentTime.substr(4)) - 1, 0)
        // this.queryParams.date = deepCopy(date)
        // this.defaultParams.date = deepCopy(date)
      },
      queryInvoice () {
        Loading.service(localParams)
        let {inv_no} = this.queryParams
        const {date} = this.queryParams
        this.$refs.queryTable.$refs.table.clearSort()
        this.queryInvoiceDetail.list = []
        inv_no = this.queryParams.inv_no.replace(/\s+/g, '')
        let isEmpty
        if (!inv_no && !date) {
          isEmpty = '请至少选择一种查询方式进行查找！'
        }
        if (inv_no && inv_no.length < 8) {
          isEmpty = '发票号码至少录入8位才可查找。'
        }
        if (isEmpty) {
          Loading.service().close()
          return Message({
            message: isEmpty,
            type: 'warning',
            duration: duration
          })
        }
        queryJxHistoryInvoice({
          inv_no: inv_no,
          kpyf: date || ''
        }).then(resp => {
          const {data} = resp
          if (data.length) {
            for (const item of data) {
              item.jshjStr = toMoney(item.jshj)
              if (item.vt_num_list) {
                item.vm_state = item.tax_period + ' ' + item.vt_num_list
                item.vmState = item.tax_period
              } else {
                item.vm_state = ''
                item.vmState = 10000000
              }
            }
          } else {
            Message({
              message: resp.message,
              type: 'warning',
              duration: duration
            })
          }
          this.queryInvoiceDetail.oldList = deepCopy(data)
          this.queryInvoiceDetail.list = data
          Loading.service().close()
        }, err => {
          Loading.service().close()
        })
      },
      keyDownEvent () {
        const self = this
        self.invNoInput.addEventListener('keypress', function (evt) {
          if (evt.keyCode === 13) {
            self.queryInvoice()
          }
        })
        self.datePickerInput.addEventListener('keypress', function (evt) {
          if (evt.keyCode === 13) {
            self.queryInvoice()
          }
        })
      },
      resetQueryData () {
        this.queryParams = deepCopy(this.defaultParams)
      }
    },
    computed: {
      invNoInput () {
        return this.$refs.inv_no[0].$refs.input
      },
      datePickerInput () {
        return this.$refs.datePicker[0].$refs.reference.$refs.input
      }
    },
    mounted() {
      this.keyDownEvent()
    },
    components: {
      QueryContent
    }
  }
</script>

<style scoped>

</style>
