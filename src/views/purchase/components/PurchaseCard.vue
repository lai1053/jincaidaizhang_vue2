<style lang='scss' scoped>
  .vue-card-title {
    font-size: 16px;
    font-weight: bold;
    padding-left: 30px;
  }
  .vue-main-card {
    margin: 10px 0;
    .vue-row-col {
      height: 31px;
      line-height: 30px;
      padding: 0 4px;
      margin-bottom: 4px;
    }

    .vue-row-col-bg {
      text-align: right;
    }

    .vue-must {
      color: red;
      margin-left: 3px;
    }
  }
</style>
<style lang='scss'>
  .vue-main-card {
    .el-input__inner {
      height: 30px;
      line-height: 30px;
      border-radius: 0;
    }
    .el-input__icon {
      line-height: 25px;
    }
  }
</style>

<template>
  <div>
    <div v-for="(cardItem, cardIdx) in card">
      <div class="vue-card-title">{{cardIdx==='basis'?'基本信息':'折旧信息'}}</div>
      <el-row class="vue-main-card">
        <div v-for="(item, index) in cardItem" v-if="item.type!=='none'">
          <el-col :span="5" class="vue-row-col vue-row-col-bg">
            {{item.name}}：<span class="vue-must">{{item.isMust? '*' : ' '}}</span></el-col>
          <el-col :span="7" class="vue-row-col" style="position: relative;">
            <el-input
              v-if="type==='check'||(item.type!=='select'&&item.type!=='datePicker')"
              v-model="item.value"
              :disabled="item.type==='disabled'"
              :readonly="type==='check'||item.type==='readonly'"
              @change="changeCardVal(index)"
            ></el-input>
            <el-select
              v-if="type!=='check'&&item.type==='select'"
              v-model="item.value"
              filterable
              class="vue-edit-select-box"
              @change="changeCardVal(index)"
              placeholder="">
              <el-option
                v-for="(itemC, idx) in cardEdit[item.options]"
                :key="itemC.item_id"
                :label="itemC.item_name"
                :value="itemC.item_name">
              </el-option>
            </el-select>
            <el-date-picker
              v-if="type!=='check'&&item.type==='datePicker'"
              v-model="item.value"
              align="right"
              type="date"
              placeholder="选择日期"
              :picker-options="pickerOptions"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              style="width: 100%"></el-date-picker>
            <span v-if="index==='salvage_value_rate'" style="position: absolute;top: 0;right: -10px;">%</span>
          </el-col>
        </div>
      </el-row>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'card',
    data () {
      return {
        pickerOptions: {
          shortcuts: [{
            text: '今天',
            onClick (picker) {
              picker.$emit('pick', new Date())
            }
          }, {
            text: '昨天',
            onClick (picker) {
              const date = new Date()
              date.setTime(date.getTime() - 3600 * 1000 * 24)
              picker.$emit('pick', date)
            }
          }, {
            text: '一周前',
            onClick (picker) {
              const date = new Date()
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', date)
            }
          }]
        }
      }
    },
    props: {
      type: String,
      cardOrgVal: String,
      card: Object, // basis 基本信息 depreciation 折旧信息
      cardEdit: Object // deprMethod: Array, dept: Array
    },
    components: {},
    methods: {
      changeCardVal (index) {
        if (index === 'deprMethod') {
          const {deprMethod, workload, wl_unit} = this.card.depreciation
          if (deprMethod.value === '工作总量法折旧') {
            workload.isMust = true
            wl_unit.type = 'input'
            workload.type = 'input'
          } else {
            workload.isMust = false
            wl_unit.type = 'none'
            wl_unit.value = ''
            workload.type = 'none'
            workload.value = ''
          }
        } else if (index === 'salvage_value_rate') {
          const {org_value, salvage_value_rate, salvage_value} = this.card.depreciation
          salvage_value.value = parseFloat(org_value.value * salvage_value_rate.value / 100).toFixed(2)
        } else if (index === 'salvage_value') {
          const {org_value, salvage_value_rate, salvage_value} = this.card.depreciation
          salvage_value_rate.value = parseFloat(salvage_value.value * 100 / org_value.value).toFixed(2)
        } else if (index === 'tax_deed' || index === 'tax_veh_pur') {
          const curVal = this.card.basis[index].value
          const {org_value, salvage_value_rate, salvage_value} = this.card.depreciation
          org_value.value = curVal ? (parseFloat(this.cardOrgVal) + parseFloat(curVal)).toFixed(2) : this.cardOrgVal
          if (Number(salvage_value_rate.value) > 0) {
            salvage_value.value = parseFloat(org_value.value * salvage_value_rate.value / 100).toFixed(2)
          }
        }
      }
    },
    computed: {},
    mounted() {
    }
  }
</script>
