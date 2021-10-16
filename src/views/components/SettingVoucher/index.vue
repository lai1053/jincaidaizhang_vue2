<style lang="scss">
  .setting-voucher{
    .setting-label-box{
      margin-left: 0 !important;
      height: 26px;
      line-height: 26px!important;
      position: relative;
      font-size: 13px !important;
    }
    .setting-item{
      margin-bottom: 10px;
    }
    .edit-check-box{
      margin-left: 0;
    }
    .el-icon-edit{
      padding-left: 5px;
      line-height: 26px;
      cursor: pointer;
    }
    .el-icon-check{
      width: 36px;
      line-height: 26px;
      padding-left: 5px;
      font-size: 15px;
      font-weight: bold;
      cursor:pointer;
    }
    .edit-input-box{
      width: 350px;
      display: inline-block;
      .el-input{
        width: 310px;
      }
    }
    .el-radio__input.is-checked + .el-radio__label{
      color:#606266;
    }
    .el-checkbox__input.is-checked + .el-checkbox__label{
      color:#606266;
    }
    .check-label-tool-tip{
      .el-icon-question{
        display: none;
      }
    }

    .el-checkbox-group {
      .el-checkbox{
        font-size: 13px;
      }
    }

  }
  .sale-create-box{
    width: 240px;
  }
  .summary-box:not(:last-child):not(:first-child){
    width: 150px;
  }
  .summary-box:first-child{
    width: 350px;
  }
  .first-summary-box:not(:last-child):not(:first-child){
    width: 150px;
  }
  .first-summary-box:first-child{
    width: 240px;
  }
  .summary-custom:not(:last-child):not(:first-child){
    width: 130px;
  }
  .summary-custom:first-child{
    min-width: 154px;
  }
  .expense-create-box:not(:last-child){
    width: 270px;
  }
  .expense-date-box:not(:last-child){
    width: 270px;
  }
  .fund-create-box:not(:last-child) {
    width: 270px;
  }
  .edit-input-box {
    .el-input--mini .el-input__inner {
      height: 26px;
      line-height: 26px;
      font-size: 13px;
    }
  }

</style>
<style lang="scss" scoped>
  .check-group{
    padding-left: 20px;
    margin-bottom: 10px;
    position: relative;
  }
  .date-check-group{
    padding-left: 20px;
    margin-bottom: 5px;
    position: relative;
  }
  .check-group-title{
    font-size: 13px;
    margin-bottom: 8px;
    font-weight: 700;
  }
  .check-box-group{
    padding-left: 20px;
  }
  .hide-ele{
    display: none;
  }
  .taxFinance{
    height: 451px;
    color: black;
  }
  .financeSettingClass{
    display: block;
    padding: 0 20px;
    margin-left: 0 !important;

  }
  .financeSettingClass:nth-of-type(1){
    padding-top: 5px;
  }
  .financeSettingClass:nth-of-type(2){
    padding-top: 0;
  }
  .financeSettingSpan{
    display: block;
    margin-left: 23px;
    line-height: 24px;
  }
  .summary-custom-box:first-child{
    margin-bottom: 10px;
  }
  .summary-custom-item:not(:last-child){
    padding-top: 10px;
  }
  .summary-type{
    display: inline-block;
    padding-left: 24px;
    margin: 0 40px 10px 0;
  }
  .summary-content{
    display: inline-block;
    margin-bottom: 10px;
  }
</style>
<template>
  <div class="setting-voucher">
    <!--凭证生成方式-->
    <div v-if="taxFinance === true">
      <!--生成凭证方式-->
      <div>
        <!--生成方式-->
        <div class="setting-item">{{settingData.createType.title}}</div>
        <div class="check-group" v-for="(item,index) in settingData.createType.subItem" :key="index">
          <div v-if="item.title" class="check-group-title">
            {{item.title}}
          </div>
          <el-radio-group v-model="item.type">
            <el-radio
              v-for="subItem in item.options"
              :label="subItem.val"
              :key="subItem.name"
              @change="changeRadio(subItem, item.options)"
              :class="settingData.createType.className"
            >
            <span
              @mouseenter="subItem.showTip = true"
              @mouseleave="onMouseLeave(item.type, subItem)"
              style="padding-right: 20px;"
            >{{subItem.name}}
              <voucher-tip
                v-if="subItem.tip"
                :tip-content="subItem.tipContent"
                :show-tool-tip="subItem.showTip"
              ></voucher-tip>
            </span>
            </el-radio>
          </el-radio-group>
        </div>
        <!--凭证科目合并-->
        <div class="check-group" v-for="(item, idx) in settingData.createType.subject" :key="idx">
          <div v-if="item.title" class="check-group-title">
            {{item.title}}
          </div>
          <el-checkbox-group v-model="item.type" >
            <el-checkbox
              v-for="subItem in item.options"
              :label="subItem.val"
              :key="subItem.name"
              :class="settingData.createType.className"
            >
              <span>{{subItem.name}}</span>
            </el-checkbox>
          </el-checkbox-group>
        </div>
      </div>
      <!--凭证摘要-->
      <div v-if="settingData.summary">
        <div class="setting-item">{{settingData.summary.title}}</div>
        <!--科目摘要-->
        <div class="check-group" v-for="item in settingData.summary.subItem" :key="item.title">
          <div class="check-group-title">
            {{item.title}}
            <remark-tip
              v-if="item.tip"
              :tip-content="item.tipContent"
            ></remark-tip>
          </div>
          <el-checkbox-group v-model="item.summaryType" >
            <el-checkbox
              v-for="cItem in item.options"
              v-show="cItem.show"
              :key="cItem.name"
              :label="cItem.value"
              :disabled="cItem.disabled"
              :class="cItem.isEdit ? '' : cItem.name.length < 13 ? 'first-summary-box setting-label-box' : settingData.summary.className"
              @change="changeCheckBox(item,cItem, $event)"
            >
              <template v-if="cItem.isEdit">
                <div class="edit-input-box">
                  <el-input
                    v-model="cItem.defaultName"
                    size="mini"
                    maxlength="20"
                    clearable
                  ></el-input><!--
                --><i  class="el-icon-check text-color" @click="saveEditName(cItem)"></i>
                </div>
              </template>
              <template v-else>
                <span>{{cItem.name}}</span><!--
                --><i v-if="cItem.showIcon" @click="clickEdit(cItem)" class="el-icon-edit text-color"></i>
              </template>
            </el-checkbox>
          </el-checkbox-group>
        </div>
        <!--凭证摘要自定义-->
        <div class="check-group">
          <div v-for="item in settingData.summary.createSummaryType" class="summary-custom-box" :key="item.name">
            <el-radio
              v-model="settingData.summary.summaryType"
              :label="item.value"
              class="setting-label-box"
              @change="handleChangeSummaryType">
              {{item.name}}
              <el-popover
                placement="top-start"
                trigger="hover"
                v-if="item.tip"
              >
                <p style="font-size: 12px">{{item.tip}}</p>
                <i style="color: #acaeb3" slot="reference" class="el-icon-question"></i>
              </el-popover>
            </el-radio>
            <div v-if="item.settingSummaryType && settingData.summary.summaryType === '1'">
              <div
                v-for="(subItem,idx) in item.settingSummaryType"
                :key="idx"
                class="summary-custom-item">
                <span class="summary-type">{{subItem.name}}</span>
                <div class="summary-content">
                  <el-checkbox-group v-model="subItem.type" >
                    <el-checkbox
                      v-for="cItem in subItem.options"
                      :label="cItem.value"
                      :key="cItem.name"
                      :disabled="cItem.disabled"
                      :class="cItem.isEdit ? '' : cItem.name.length < 13 ? 'setting-label-box summary-custom' : settingData.summary.className"
                    >
                      <template v-if="cItem.isEdit">
                        <div class="edit-input-box">
                          <el-input
                            v-model="cItem.defaultName"
                            size="mini"
                            maxlength="20"
                            clearable
                          ></el-input><!--
                --><i  class="el-icon-check text-color" @click="saveEditName(cItem)"></i>
                        </div>
                      </template>
                      <template v-else>
                        <span>{{cItem.name}}</span><!--
                --><i v-if="cItem.showIcon" @click="clickEdit(cItem)" class="el-icon-edit text-color"></i>
                      </template>
                    </el-checkbox>
                  </el-checkbox-group>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
      <!--凭证日期-->
      <div>
        <div class="setting-item">{{settingData.createDate.title}}</div>
        <div class="date-check-group">
          <el-radio-group v-model="settingData.createDate.voucherDateRule">
            <el-radio
              :class="settingData.createDate.className"
              v-for="item in settingData.createDate.subItem"
              :label="item.val"
              :key="item.val"
            >
            <span @mouseenter="actualDateTip = true" @mouseleave="actualDateTip = false" style="padding-right: 20px;">
              {{item.name}}
              <el-popover
                v-if="item.tip"
                placement="top"
                trigger="hover"
                @show="actualDateTipShowing=true"
                @hide="actualDateTipShowing=false">
                <div style="font-size:12px;line-height: 20px">{{item.tip}}</div>
                <div style="font-size:12px;line-height: 20px" v-if="mainMenu === 'fund'">凭证日期采用交易流水日期</div>
                <i style="color: #acaeb3" slot="reference" :class="settingData.createDate.voucherDateRule === '1' || actualDateTip|| actualDateTipShowing?'el-icon-question': 'el-icon-question hide-ele'"></i>
              </el-popover>
            </span>
            </el-radio>
          </el-radio-group>
        </div>
      </div>
      <div v-if="mainMenu==='fund'&&settingData.summary.summaryType === '0'" style="height: 82px"></div>
    </div>
    <!--财务生成方式-->
    <div v-if="taxFinance === false" class="taxFinance">
      <div class="setting-item">{{settingData.financeSetting.title}}</div>
      <div>
        <el-radio-group v-model="settingData.financeSetting.inputVatProcessType" >
          <el-radio
            class="financeSettingClass"
            v-for="item in settingData.financeSetting.subItem"
            :label="item.value"
            :key="item.name"
          >
            <strong style="font-size: 12px; line-height: 30px">{{item.name}}</strong>
            <span  style="font-size: 12px" class="financeSettingSpan">
              {{item.content}}
            </span>
            <span style="font-size: 12px" class="financeSettingSpan">
              {{item.content2}}
            </span>
          </el-radio>
        </el-radio-group>
      </div>
    </div>
  </div>

</template>

<script>
    import RemarkTip from './tip/RemarkTip'
    import VoucherTip from './tip/VoucherTip'
    export default {
      props: {
        settingData: Object,
        taxFinance: Boolean,
        mainMenu: String
      },
      data () {
        return {
          upRow: {},
          actualDateTip: false,
          actualDateTipShowing: false,
          lastDateTip: false,
          lastDateTipShowing: false
        }
      },
      methods: {
        clickEdit (row) {
          row.defaultName = row.name
          row.isEdit = true
        },
        saveEditName (row) {
          row.name = row.defaultName ? row.defaultName : row.origin
          row.isEdit = false
        },
        onMouseLeave (checkVal, row) {
          if (checkVal === row.val) return
          row.showTip = false
        },
        changeRadio (row, list) {
          for (const item of list) {
            item.showTip = false
          }
          row.showTip = true
        },
        changeCheckBox(list, row, checked) {
          const {options} = list
          if (row.value === 'goodServiceName' && checked) {
            list.summaryType = []
            options.forEach(item => {
              item.show = true
              list.summaryType.push(item.value)
            })
          } else if (row.value === 'goodServiceName' && !checked) {
            options.forEach(item => {
              item.show = item.value === 'purchase' || item.value === 'goodServiceName' || item.value === 'sale' || item.value === 'expense'
            })
            list.summaryType = []
            list.summaryType.push(options[0].value)
          }
        },
        handleChangeSummaryType (val) {
          // if (val === '1') {
          //   const {summary: {createSummaryType}} = this.settingData
          //   createSummaryType[1].settingSummaryType[0].type = ['transType', 'summary']
          //   createSummaryType[1].settingSummaryType[1].type = ['transType', 'summary']
          // }
        }
      },
      components: {
        RemarkTip,
        VoucherTip
      }
    }
</script>

<style scoped>

</style>
