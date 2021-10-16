<style lang='scss' scoped>
  .vue-main {
    margin-bottom: 15px;
    border-top: 1px solid #e3e8ee;
    border-left: 1px solid #e3e8ee;
    .vue-row-col {
      height: 31px;
      line-height: 30px;
      border-right: 1px solid #e3e8ee;
      border-bottom: 1px solid #e3e8ee;
      -webkit-box-sizing: border-box;
      -moz-box-sizing: border-box;
      box-sizing: border-box;
      overflow: hidden;
    }

    .vue-row-col-bg {
      padding: 0 6px;
      text-align: right;
      background-color: #fafafa;
    }

    .vue-must {
      color: red;
      margin-left: 3px;
    }
  }

  .billdetail-foot {
    margin-top: 10px;
  }

  .total {
    margin-top: 16px;
    width: 100%;
    clear: both;
    div {
      display: inline-block;
      width: 22%;
      span {
        color: #1ab394;
      }
    }
  }
  .department{
    position:absolute;
    top:0;
    left:0;
    border:1px solid red;
    display: none;
  }
</style>
  <style lang='scss'>
  .vue-main {
    .el-input__inner {
      height: 30px;
      line-height: 30px;
      border: 1px solid transparent;
      border-radius: 0;
    }
    .el-select {
      width: 100%;
    }
  }

  /* 处理业务期间 icon移位的问题 */
  .vue-salary-vice-date {
    .el-input__icon {
      line-height: 0;
    }
  }

  .auto-complete-t {
    display: none !important;
  }

  .auto-complete, .auto-complete-t {
    .el-scrollbar {
      padding-bottom: 34px;
    }
    .el-scrollbar {
      display: block !important;
    }
    .el-select-dropdown__wrap {
      max-height: 218px;
    }
    ul {
      position: static !important;
      .auto-complete-btn {
        width: 100%;
        height: 34px;
        line-height: 34px;
        border-top: 1px solid #d7dde4;
        text-align: center;
        position: absolute;
        bottom: 0;
        border-bottom-right-radius: 4px;
        border-bottom-left-radius: 4px;
        /*background-color: #ffffff;*/
      }
    }
  }

  // table 样式 （操作）
  .el-table::before {
    height: 0;
  }

  .el-table.vue-salary-vice-file {

    .el-input__inner {
      height: 30px !important;
      line-height: 30px !important;
      border: none;
      padding: 0 8px;
      border-radius: 0;
      background-color: rgba(225, 225, 225, 0);
    }
    .el-input__inner:hover {
      border: 1px solid #63bf5c;
    }
    .el-input__suffix {
      display: none;
    }
    .el-table__body-wrapper {
      overflow-x: auto;
    }
    .el-input-number {
      width: auto;
    }
    .el-input-number__decrease, .el-input-number__increase {
      display: none;
    }

  }

  .el-table--border td, .el-table--border th, .el-table__body-wrapper .el-table--border.is-scrolling-left~.el-table__fixed {
    border: none;
  }

  .add-card {
    span {
      color: #FFFFFF;
      background-color: #1ab394;
      width: 16px;
      height: 16px;
      line-height: 16px;
      border-radius: 2px;
      display: block;
      [class*=" el-icon-"], [class^=el-icon-] {
        font-weight: 600;
      }
    }
  }
  /*展开明细列表输入框为只读状态的时候的状态设置*/
    .expandDetailList{
      .el-input__inner{height:32px;line-height: 32px !important;border-radius:2px;background: transparent;padding:0 5px;}
      .el-input__inner:focus{height:32px;border-color:rgb(26, 179, 148);background: #fff;}
      .el-input__inner[readonly]{border-color:transparent;background: transparent;}
      .el-input__inner[readonly]:focus{border-color:transparent;}
      table{
        tbody{
          td:nth-of-type(3),td:nth-of-type(5){
            .el-input__inner{
              text-align:center;
            }
          }
        }
      }
      td {
        /*border: 1px solid transparent;*/
      }
      /*下拉框*/
      .el-select{
        .el-input__inner{height:32px;line-height:32px;border:1px solid #dcdfe6;}
        .el-input.is-disabled{
          .el-input__inner{color:#666;border-color:transparent;background:transparent;}
          .el-input__inner:hover{border-color:transparent}
          .el-input__suffix{visibility: hidden;}
        }
      }
    }
  .vue-edit-box {
    width: 100%;
    .el-input{
      .el-input__inner{height:30px;line-height:30px;border:1px solid transparent;}
    }
    .el-input.is-disabled{
      .el-input__inner{
        color: #666;
        cursor: default;
      }
      .el-input__inner:hover{border-color:transparent}
    }
  }
    .el-icon-circle-close,.el-icon-circle-close-outline{font-size:18px!important;border-color:#F56C6C;color:#F56C6C;}
</style>

<template>
  <div>
    <el-row class="vue-main" v-if="access !== 'detail'">  <!--非明细的时候显示-->
      <!-- 工资合计 -->
      <el-col :span="8">
        <el-col :span="8" class="vue-row-col vue-row-col-bg">
          <span>工资合计</span>
          <span class="vue-must">*</span>
        </el-col>
        <el-col :span="16" class="vue-row-col">
          <el-input
            v-model="evalTakePay"
            readonly
          ></el-input>
        </el-col>
      </el-col>
      <!-- 工资处理 -->
      <el-col :span="8">
        <el-col :span="8" class="vue-row-col vue-row-col-bg">
          <span>工资处理</span>
          <span class="vue-must">*</span>
        </el-col>
        <el-col :span="16" class="vue-row-col" v-if="!main_readState">
          <el-input
            v-model="salaryHandle"
            readonly
          ></el-input>
          <!--<el-select v-model="mainData.pay_falg">-->
            <!--<el-option-->
              <!--v-for="item in methodsList"-->
              <!--:key="item.value"-->
              <!--:label="item.label"-->
              <!--:value="item.value">-->
            <!--</el-option>-->
          <!--</el-select>-->
        </el-col>
        <el-col :span="16" class="vue-row-col" v-if="main_readState">
          <span v-if="main_readState" v-text="mainData.pay_falg === 1 ? '计提' : '计提并发放'" style="margin-left: 18px"></span>
        </el-col>
      </el-col>
      <!-- 业务期间 -->
      <el-col :span="8">
        <el-col :span="8" class="vue-row-col vue-row-col-bg">
          <span>工资表所属期间</span>
          <span class="vue-must">*</span>
        </el-col>
        <el-col :span="16" class="vue-row-col vue-salary-vice-date">
          <el-date-picker
            v-model="mainData.trans_period"
            align="right"
            type="month"
            :clearable="false"
            format="yyyyMM"
            value-format="yyyyMM"
            :picker-options="pickerOptions">
          </el-date-picker>
          <el-input
            v-model="mainData.trans_period"
            :readonly="main_readState"
            v-if="main_readState"
          ></el-input>
        </el-col>
      </el-col>
      <div v-if="mainData.pay_falg === 2">
        <!-- 结算方式 -->
        <el-col :span="8">
          <el-col :span="8" class="vue-row-col vue-row-col-bg">
            <span>结算方式</span>
            <span class="vue-must">*</span>
          </el-col>
          <el-col :span="16" class="vue-row-col" v-if="!main_readState">
            <el-select
              v-model="mainData.sm_id"
              @change="changeSmId">
              <el-option
                v-for="item in settlementList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="16" class="vue-row-col" v-if="main_readState">
            <span v-if="main_readState" v-text="mainData.sm_id === 1 ? '现金发放' : '银行发放'" style="margin-left: 18px"></span>
          </el-col>
        </el-col>
        <!-- 银行账号 -->
        <el-col :span="8">
          <el-col :span="8" class="vue-row-col vue-row-col-bg">
            <span>银行账号</span>
            <span class="vue-must" v-if="mainData.sm_id === 2">*</span>
          </el-col>
          <el-col :span="16" class="vue-row-col">
            <!-- 编辑 -->
            <el-input
              v-model="mainData.bank_acct_code"
              :readonly="main_readState"
              v-if="main_readState"
              :disabled="mainData.sm_id !== 2"
            ></el-input>
            <!-- 关闭 -->
            <el-input
              v-if="mainData.sm_id !== 2"
              :disabled="mainData.sm_id !== 2"
            ></el-input>
            <!-- 开启 -->

            <el-select
              v-model="mainData.bank_acct_code"
              v-if="mainData.sm_id === 2"
              style="height: 30px;">
              <el-option
                v-for="(k, val) in bankList"
                :key="k"
                :label="k"
                :value="k">
              </el-option>
            </el-select>
          </el-col>
        </el-col>
        <!-- 业务说明 -->
        <el-col :span="8">
          <el-col :span="8" class="vue-row-col vue-row-col-bg">
            <span>业务说明</span>
          </el-col>
          <el-col :span="16" class="vue-row-col">
            <el-input
              v-model="mainData.trans_desc"
              :readonly="main_readState"
            ></el-input>
          </el-col>
        </el-col>
      </div>
    </el-row>

    <!-- 明细数据 -->
    <el-row style="margin-bottom: 10px">
      <div style="float: left">
        <span style="font-size: 18px">明细数据</span>
      </div>
      <div style="float: right">
        <!--弹框为新增的时候显示-->
        <el-button type='primary' size="small"  @click="handleImport" v-if="access === 'create' && !hasImportData">导入模板</el-button>
        <!--明细为复制上期而且是导入的，则显示保存按钮 (toggleState为true的时候代表已经展开了明细列表)-->
        <el-button type="primary" size="small" v-if="!!toggleState && (isCopy===1 && private_state>7) && access === 'detail'" @click="handleSave(0)">保存</el-button>
        <!--弹框为明细的时候显示-->
        <el-button type="primary" size="small" @click="toggleDetail" v-if="isShowToggle || (viceDetailData && viceDetailData.length)">{{toggleState ? '收起' : '展开明细'}}</el-button>
      </div>
    </el-row>

    <!--非明细列表 start-->
    <div class="salary-box-detail" >
      <el-table
        :data="viceData"
        height="280"
        stripe
        class="vue-table vue-salary-vice-file"
        v-if="!toggleState "
        :summary-method="getSummaries"
        border
        show-summary
        v-loading="loading && access !== 'create'">
        <!-- 部门 (access==='create' && hasImportData) || access !== 'detail'-->
        <el-table-column
          label="部门*"
          align="center"
          class-name="row-edit-box"
          width="120">
          <template slot-scope="scope">
            <div class="department">{{deptList[scope.row.dept_id]}}</div>
            <el-select
              v-model="scope.row.dept_id"
              filterable
              width="150"
              class="vue-edit-box"
              placeholder="请选择部门"
              :disabled="readState">
              <el-option
                v-for="item in dept_list"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </template>
        </el-table-column>
        <!-- 应发工资 -->
        <el-table-column
          label="应发工资*"
          width="130"
          align="center">
          <template slot-scope="scope">
            <el-input-number
              @change="handleChange(scope.row)"
              v-model="scope.row.i_pay_total"
              :readonly="readState"
              v-if="!readState"
            ></el-input-number>
            <span v-else v-text="toMoney(scope.row.i_pay_total)"></span>
          </template>
        </el-table-column>
        <!-- 社保费 -->
        <el-table-column label="社保费" align="center">
          <el-table-column
            label="个人"
            align="center"
            width="85">
            <template slot-scope="scope">
              <el-input-number
                v-model="scope.row.d_si_total"
                @change="handleChange(scope.row, scope.row.d_si_total)"
                :readonly="readState"
                v-if="!readState"
              ></el-input-number>
              <span v-else v-text="toMoney(scope.row.d_si_total)"></span>
            </template>
          </el-table-column>
          <el-table-column
            label="企业"
            align="center"
            width="85">
            <template slot-scope="scope">
              <el-input-number
                v-model="scope.row.d_si_total_ent"
                :readonly="readState"
                v-if="!readState"
              ></el-input-number>
              <span v-else v-text="toMoney(scope.row.d_si_total_ent)"></span>
            </template>
          </el-table-column>
        </el-table-column>
        <!-- 公积金 -->
        <el-table-column label="公积金" align="center">
          <el-table-column
            label="个人"
            align="center"
            width="85">
            <template slot-scope="scope">
              <el-input-number
                v-model="scope.row.d_hf"
                @change="handleChange(scope.row)"
                :readonly="readState"
                v-if="!readState"
              ></el-input-number>
              <span v-else v-text="toMoney(scope.row.d_hf)"></span>
            </template>
          </el-table-column>
          <el-table-column
            label="企业"
            align="center"
            width="85">
            <template slot-scope="scope">
              <el-input-number
                v-model="scope.row.d_hf_ent"
                :readonly="readState"
                v-if="!readState"
              ></el-input-number>
              <span v-else v-text="toMoney(scope.row.d_hf_ent)"></span>
            </template>
          </el-table-column>
        </el-table-column>
        <!-- 个人所得税 -->
        <el-table-column
          label="个税"
          width="130"
          align="center">
          <template slot-scope="scope">
            <el-input-number
              v-model="scope.row.d_pi_tax"
              @change="handleChange(scope.row)"
              :readonly="readState"
              v-if="!readState"
            ></el-input-number>
            <span v-else v-text="toMoney(scope.row.d_pi_tax)"></span>
          </template>
        </el-table-column>
        <!-- 其它扣项 -->
        <el-table-column
          label="其它扣项"
          width="130"
          align="center">
          <template slot-scope="scope">
            <el-input-number
              v-model="scope.row.d_deduct_other_total"
              @change="handleChange(scope.row)"
              :readonly="readState"
              v-if="!readState"
            ></el-input-number>
            <span v-else v-text="toMoney(scope.row.d_deduct_other_total)"></span>
          </template>
        </el-table-column>
        <!-- 实发工资 -->
        <el-table-column
          label="实发工资"
          width=""
          align="center">
          <template slot-scope="scope">
            <span v-text="toMoney(scope.row.take_home_pay)"></span>
          </template>
        </el-table-column>
        <!-- 操作 -->
        <el-table-column
          label="操作"
          align="center"
          width="60"
          v-if="!readState">
          <!--v-if="!readState||(isCopy===1 && simple_module===0 && readState)">-->
          <template slot-scope="scope" >
            <!--class="" v-if="scope.row.private_state<=7"-->
            <div>
              <el-button class="vue-operation-btn" type="text" size="small">
                <i class="el-icon-circle-plus-outline" @click="addRow(scope.row)"></i>
              </el-button>
              <el-button class="vue-operation-btn" type="text" size="small">
                <i class="el-icon-circle-close-outline" @click="deleteRow(scope.row,viceData)"></i>
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!--非明细列表 end-->

    <!--展开明细的明细列表 start-->
    <div style="width: 100%" class="expandDetailList">
      <el-table
        v-if="toggleState"
        :fit=true
        :data="viceDetailData"
        :loading="loading"
        height="280"
        @cell-mouse-enter="mouseHover"
        @cell-mouse-leave="mouseLeave"
        style="width: 100%">
        <el-table-column
          prop="index_no"
          label="序号"
          align="center"
          width="50">
          <template slot-scope="scope">
            <span v-text="scope.row.index_no"></span>
          </template>
        </el-table-column>
        <el-table-column
          prop="ent_id"
          label="部门"
          width="110"
          align="center">
          <template slot-scope="scope">
            <div class="department">{{deptList[scope.row.dept_id]}}</div>
            <el-select
              v-model="scope.row.dept_id"
              :disabled="isCopy===0 || private_state<=7 || vmState === 2"
              filterable>
              <el-option
                v-for="item in dept_list2"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column
          prop="ent_id"
          label="姓名"
          align="center"
          width="100">
          <template slot-scope="scope">
            <el-input
              :readonly="isCopy===0 || private_state<=7 || vmState === 2"
              v-model="scope.row.emp_name"
              placeholder="请输入姓名"></el-input>
          </template>
        </el-table-column>
        <el-table-column
          prop="ent_id"
          label="证件类型"
          align="center"
          width="200"
        >
          <template slot-scope="scope">
            <!--<div class="department">{{credentialsList[parseInt(scope.row.emp_id_type)]}}</div>-->
            <el-select
              v-model="scope.row.emp_id_type"
              :disabled="isCopy===0 || private_state<=7 || vmState === 2"
              filterable>
              <el-option
                v-for="item in credentialsListData"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column
          prop="ent_id"
          label="证件号码"
          align="center"
          width="220">
          <template slot-scope="scope">
            <!--如果为非复制上期并或者是手动新增的话，那么输入框不可编辑-->
            <el-input
              :readonly="isCopy===0 || private_state<=7 || vmState === 2"
              v-model="scope.row.emp_id_num"
              placeholder="请输入证件号码">
            </el-input>
          </template>
        </el-table-column>

        <el-table-column label="应付工资" align="center">
          <el-table-column
            prop="i_basic"
            label="基本工资"
            align="center">
            <template slot-scope="scope">
              <el-input
                :readonly="isCopy===0 || private_state<=7 || vmState === 2"
                v-model="scope.row.i_basic">
              </el-input>
            </template>
          </el-table-column>
          <el-table-column
            prop="i_allowance"
            label="补助"
            align="center">
            <template slot-scope="scope">
              <el-input
                :readonly="isCopy===0 || private_state<=7 || vmState === 2"
                v-model="scope.row.i_allowance">
              </el-input>
            </template>
          </el-table-column>
          <el-table-column
            prop="i_bonus"
            label="日常奖金"
            align="center">
            <template slot-scope="scope">
              <el-input
                :readonly="isCopy===0 || private_state<=7 || vmState === 2"
                v-model="scope.row.i_bonus">
              </el-input>
            </template>
          </el-table-column>
          <el-table-column
            prop="i_pay_other"
            label="其他"
            align="center">
            <template slot-scope="scope">
              <el-input
                :readonly="isCopy===0 || private_state<=7 || vmState === 2"
                v-model="scope.row.i_pay_other">
              </el-input>
            </template>
          </el-table-column>
          <el-table-column
            prop="i_annual_bonus"
            label="年终奖金"
            align="center">
            <template slot-scope="scope">
              <el-input
                :readonly="isCopy===0 || private_state<=7 || vmState === 2"
                v-model="scope.row.i_annual_bonus">
              </el-input>
            </template>
          </el-table-column>
          <el-table-column
            prop="i_pay_total"
            label="应付工资合计"
            align="center">
            <template slot-scope="scope">
              <el-input
                :readonly="isCopy===0 || private_state<=7 || vmState === 2"
                v-model="scope.row.i_pay_total" @change="handleChange2(scope.row,'i_pay_total')">
              </el-input>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="应扣款项" align="center">
          <el-table-column
            prop="d_si_total"
            label="基本养老"
            align="center"
            v-if="simple_module===1||simple_module==='1'">
            <template slot-scope="scope">
              <el-input
                :readonly="isCopy===0 || private_state<=7 || vmState === 2"
                v-model="scope.row.d_ri">
              </el-input>
            </template>
          </el-table-column>
          <el-table-column
            prop="d_si_total_ent"
            label="补充养老"
            align="center"
            v-if="simple_module===1||simple_module==='1'">
            <template slot-scope="scope">
              <el-input
                :readonly="isCopy===0 || private_state<=7 || vmState === 2"
                v-model="scope.row.d_soai">
              </el-input>
            </template>
          </el-table-column>
          <el-table-column
            prop="d_si_total_ent"
            label="基本医疗"
            align="center"
            v-if="simple_module===1||simple_module==='1'">
            <template slot-scope="scope">
              <el-input
                :readonly="isCopy===0 || private_state<=7 || vmState === 2"
                v-model="scope.row.d_mi">
              </el-input>
            </template>
          </el-table-column>
          <el-table-column
            prop="d_si_total_ent"
            label="补充医疗"
            align="center"
            v-if="simple_module===1||simple_module==='1'">
            <template slot-scope="scope">
              <el-input
                :readonly="isCopy===0 || private_state<=7 || vmState === 2"
                v-model="scope.row.d_smi">
              </el-input>
            </template>
          </el-table-column>
          <el-table-column
            prop="d_si_total_ent"
            label="失业金"
            align="center"
            v-if="simple_module===1||simple_module==='1'">
            <template slot-scope="scope">
              <el-input
                :readonly="isCopy===0 || private_state<=7 || vmState === 2"
                v-model="scope.row.d_ui">
              </el-input>
            </template>
          </el-table-column>
          <el-table-column
            prop="d_si_total_ent"
            label="个人社保小计"
            align="center">
            <template slot-scope="scope">
              <el-input
                :readonly="isCopy===0 || private_state<=7 || vmState === 2"
                v-model="scope.row.d_si_total">
              </el-input>
            </template>
          </el-table-column>
          <el-table-column
            prop="d_si_total_ent"
            label="住房公积金"
            align="center">
            <template slot-scope="scope">
              <el-input
                :readonly="isCopy===0 || private_state<=7 || vmState === 2"
                v-model="scope.row.d_hf">
              </el-input>
            </template>
          </el-table-column>
          <el-table-column
            prop="d_si_total_ent"
            label="事病假"
            align="center">
            <template slot-scope="scope">
              <el-input
                :readonly="isCopy===0 || private_state<=7 || vmState === 2"
                v-model="scope.row.d_absence">
              </el-input>
            </template>
          </el-table-column>
          <el-table-column
            prop="d_si_total_ent"
            label="其他"
            align="center">
            <template slot-scope="scope">
              <el-input
                :readonly="isCopy===0 || private_state<=7 || vmState === 2"
                v-model="scope.row.d_deduct_other">
              </el-input>
            </template>
          </el-table-column>
          <el-table-column
            prop="d_si_total_ent"
            label="应扣款项合计"
            align="center">
            <template slot-scope="scope">
              <el-input
                :readonly="isCopy===0 || private_state<=7 || vmState === 2"
                v-model="scope.row.d_deduct_total">
              </el-input>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column
          label="公司社保及公积金"
          align="center">
          <el-table-column
            prop="d_hf"
            label="基本养老"
            v-if="String(simple_module) ==='1'"
            align="center">
            <template slot-scope="scope">
              <el-input
                :readonly="isCopy===0 || private_state<=7 || vmState === 2"
                v-model="scope.row.d_ri_ent">
              </el-input>
            </template>
          </el-table-column>
          <el-table-column
            prop="d_hf_ent"
            label="补充养老"
            v-if="String(simple_module) ==='1'"
            align="center">
            <template slot-scope="scope">
              <el-input
                :readonly="isCopy===0 || private_state<=7 || vmState === 2"
                v-model="scope.row.d_soai_ent">
              </el-input>
            </template>
          </el-table-column>
          <el-table-column
            prop="d_hf"
            label="基本医疗"
            v-if="String(simple_module) ==='1'"
            align="center">
            <template slot-scope="scope">
              <el-input
                :readonly="isCopy===0 || private_state<=7 ||vmState === 2"
                v-model="scope.row.d_mi_ent">
                {{simple_module}}
              </el-input>
            </template>
          </el-table-column>
          <el-table-column
            prop="d_hf"
            label="补充医疗"
            v-if="String(simple_module) ==='1'"
            align="center">
            <template slot-scope="scope">
              <el-input
                :readonly="isCopy===0 || private_state<=7 || vmState === 2"
                v-model="scope.row.d_smi_ent">
              </el-input>
            </template>
          </el-table-column>
          <el-table-column
            prop="d_hf"
            label="失业金"
            v-if="String(simple_module) ==='1'"
            align="center">
            <template slot-scope="scope">
              <el-input
                :readonly="isCopy===0 || private_state<=7 ||vmState === 2"
                v-model="scope.row.d_ui_ent">
              </el-input>
            </template>
          </el-table-column>
          <el-table-column
            prop="d_hf"
            label="生育保险金"
            v-if="String(simple_module) ==='1'"
            align="center">
            <template slot-scope="scope">
              <el-input
                :readonly="isCopy===0 || private_state<=7 ||vmState === 2"
                v-model="scope.row.d_maternity_insu_ent">
              </el-input>
            </template>
          </el-table-column>
          <el-table-column
            prop="d_hf"
            label="工伤保险"
            v-if="String(simple_module) ==='1'"
            align="center">
            <template slot-scope="scope">
              <el-input
                :readonly="isCopy===0 || private_state<=7 ||vmState === 2"
                v-model="scope.row.d_eii_ent">
              </el-input>
            </template>
          </el-table-column>
          <el-table-column
            prop="d_hf"
            label="公司社保小计"
            align="center">
            <template slot-scope="scope">
              <el-input
                :readonly="isCopy===0 || private_state<=7 || vmState === 2"
                v-model="scope.row.d_si_total_ent">
              </el-input>
            </template>
          </el-table-column>
          <el-table-column
            prop="d_hf"
            label="住房公积金"
            align="center">
            <template slot-scope="scope">
              <el-input
                :readonly="isCopy===0 || private_state<=7 || vmState === 2"
                v-model="scope.row.d_hf_ent">
              </el-input>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column
          prop="pay_ent"
          label="公司人力成本"
          align="center"
          width="150">
          <template slot-scope="scope">
            <el-input
              :readonly="isCopy===0 || private_state<=7 ||vmState === 2"
              v-model="scope.row.pay_ent">
            </el-input>
          </template>
        </el-table-column>

        <el-table-column label="个税" align="center">
          <el-table-column
            label="正常薪金"
            align="center"
            width="85">
            <template slot-scope="scope">
              <el-input
                :readonly="isCopy===0 || private_state<=7 || vmState === 2"
                v-model="scope.row.d_co_pi_tax">
              </el-input>
            </template>
          </el-table-column>
          <el-table-column
            label="全年一次性奖金"
            align="center"
            width="85">
            <template slot-scope="scope">
              <el-input
                :readonly="isCopy===0 || private_state<=7 || vmState === 2"
                v-model="scope.row.d_ot_pi_tax">
              </el-input>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column
          prop="take_home_pay"
          label="实发工资"
          align="center"
          width="160">
          <template slot-scope="scope">
            <el-input
              :readonly="isCopy===0 || private_state<=7 || vmState === 2"
              v-model="scope.row.take_home_pay">
            </el-input>
          </template>
        </el-table-column>
        <el-table-column
          prop="sign"
          label="签名"
          align="center">
          <template slot-scope="scope">
            <el-input
              :readonly="isCopy===0 || private_state<=7 || vmState === 2"
              v-model="scope.row.sign">
            </el-input>
          </template>
        </el-table-column>
        <!-- 操作 -->
        <el-table-column
          fixed="right"
          label="操作"
          align="center"
          width="60"
          v-if="isCopy===1 && private_state>7 && vmState !== 2">
          <template slot-scope="scope" >
            <div class="detail">
              <el-button class="vue-operation-btn" type="text" size="small">
                <i class="el-icon-circle-plus-outline" @click="detailAddRow(scope.row,viceDetailData)"></i>
              </el-button>
              <el-button class="vue-operation-btn" type="text" size="small">
                <i class="el-icon-circle-close-outline" @click="deleteRow(scope.row,viceDetailData)"></i>
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!--展开明细的明细列表 end-->

    <el-row>
      <!-- 编辑 -->
      <div style="float: right;margin-top: 15px;" v-if="access === 'edit'">
        <el-button type="primary" size="small" :loading="btnsLoading.saveAndVoucher" @click="handleSave(1)">保存并生成凭证</el-button>
        <!--当工资表为复制上期或者导入的时候，没有保存提交的权限 -->
        <el-button type="primary" size="small" :loading="btnsLoading.save" @click="handleSave(0)">保存</el-button>
      </div>
      <!-- 新增 -->
      <div style="float: right;margin-top: 15px;" v-if="access === 'create'">
        <el-button type="primary" size="small" :loading="btnsLoading.saveAndVoucher" @click="handleCreate(1)">保存并生成凭证
        </el-button>
        <el-button type="primary" size="small" :loading="btnsLoading.save" @click="handleCreate(0)">保存</el-button>
      </div>
    </el-row>
    <!-- 导入 -->
    <import-form :formModal="formModal" :flag='formModal.flag' @on-import="salaryImport"></import-form>
  </div>
</template>

<script>
  import { bankList } from '@/utils/getBankList'
  import { createMain, createVice, createDetailList, credentialsListData, dept_list, isMust} from '../../data/common.js'
  import { filterAccount } from '@/utils/filterAccount'
  import store from '@/store'
  import { mapGetters } from 'vuex'
  import ImportForm from '../ImportForm/index'
  import { toMoney } from '@/utils/utils'

  // api
  import {
    updateSalaryDeptL,
    saveSalary
  } from '@/api/salary'
  import {deepCopy} from '@/utils/assist'

  export default {
    name: 'dynamicTable',
    props: {
      /*
      * 入口
      * value: 新增->create  编辑->edit  已生成凭证->voucher  查看详情->detail
      * */
      access: {
        type: String,
        default: 'create'
      },
      tableDataOrigin: Object,           // 整个页面的数据来源，包含明细列表和总列表
      isCopy: [Number, String],          // 是否是复制上一期：0为非，1为手动复制上一期
      simple_module: [Number, String],   // 0：手动新增，1：标准版导入，2：精简版导入
      private_state: [Number, String],   // 是否是导入的：>7为导入，<=7为手动新增
      visible: Boolean,                  // 该弹出框是否可见
      vmState: Number // 判断清单是否已经生成凭证：1为未生成，2为已生成
    },
    data () {
      return {
        list: null,
        mainData: {},  // 主档数据
        viceData: [],  // 从档数据
        viceDetailData: [],
        tableData: this.tableDataOrigin,
        row: null,
        loading: true,
        initShow: true,
        methodsList: [{value: 1, label: '计提'}, {value: 2, label: '计提并发放'}],         // 工资处理
        settlementList: [{value: 1, label: '现金发放'}, {value: 2, label: '银行发放'}],    // 结算方式
        readState: false,                     // 可读状态（控制表格的输入框为可编辑还是只读）
        main_readState: false,
        dept_list: deepCopy(dept_list),       // 部门
        dept_list2: deepCopy(dept_list),      // 部门下拉数据
        isMust: deepCopy(isMust),         // 校验的字段
        hasImportData: false,    // 新增的界面是否有导入的数据
        import_simple_module: '',
        import_isCopy: '',
        btnsLoading: {
          save: false,
          saveAndVoucher: false
        },
        toggleState: false,    // 为true时展开明细列表，为false时展开总表
        isShowToggle: false,   // 是否显示“展开明细”和“收起”这个按钮组，true为显示，false为隐藏
        totalList: {
          i_pay_total: 0,
          d_si_total: 0,
          d_si_total_ent: 0,
          d_hf: 0,
          d_hf_ent: 0,
          d_pi_tax: 0,
          d_deduct_other_total: 0,
          take_home_pay: 0
        },
        bankList: {},
        pickerOptions: {     // 业务期间 配置项
          disabledDate (time) {
            return time.getTime() > Date.now()
          },
          shortcuts: [{
            text: '当月',
            onClick (picker) {
              picker.$emit('pick', new Date())
            }
          }]
        },
        formModal: {            // 导入
          modal: false,         // 弹出框控制
          flag: 'add_import'    // 标识导入页面是由哪个按钮点击弹出的“导入模板”还是“导入”
        },
        deptList: ['', '管理部门', '销售部门', '制造部门', '生产部门', '研发部门', '加工修理部门'],
        credentialsListData: deepCopy(credentialsListData),
        credentialsList: deepCopy(credentialsListData),
        hasBorder: false,
        salaryHandle: '计提'
      }
    },
    computed: {
      ...mapGetters([
        'salaryBillData'
      ]),
      salaryBillData () {
        return this.$store.getters.salaryBillData
      },
      evalTakePay () {
        let total = 0
        this.viceData.map(v => {
          total += v.take_home_pay

        })
        this.mainData.take_home_pay = total
        return toMoney(total)
      }
    },
    created () {
      this.loading = true
      this.init()
    },
    methods: {
      // 初始化
      init () {
        this.loading = true
        this.evalData(this.access)
      },
      mouseHover () {
        this.hasBorder = true
      },
      mouseLeave () {
        this.hasBorder = false
      },
      // 合计工资 联动计算
      handleChange (row, val) {
        this.row = row
        row.take_home_pay = Number(row.i_pay_total) - Number(row.d_si_total) - Number(row.d_hf) - Number(row.d_pi_tax) - Number(row.d_deduct_other_total)
      },
      // 展开明细的校验
      handleChange2 (obj, index) {
        const value = String(obj[index]).replace(/(^\s*)|(\s*$)/g, '')
        if (value !== '0' || value !== '') {
          this.isMust.i_pay_total.isMust = false
        } else {
          this.isMust.i_pay_total.isMust = true
        }
      },
      toMoney(num) {
        return toMoney(num)
      },
      /**
       * 添加 行
       */
      addRow (row, data, cb) {
        const tableData = this.viceData
        tableData.push(createVice({bill_id: this.mainData.bill_id}))
      },
      // 展开明细添加行
      detailAddRow (row) {
        const detailTableData = this.viceDetailData
        const length = detailTableData.length + 1
        detailTableData.push(createDetailList({index_no: length}))
      },
      toggleDetail () {
        this.toggleState = !this.toggleState
      },
      /**
       * 删除 行
       * @param row {Object}
       */
      deleteRow (row, data) {
        const tableData = data
        const index = tableData.indexOf(row)
        if (tableData && tableData.length > 1) {
          tableData.splice(index, 1)
        } else {
          this.$message({
            message: '已经只剩一行了不能再删除了！',
            type: 'warning'
          })
        }
      },
      // 底部合计
      getSummaries () {
        const viceData = this.viceData
        const sums = ['合计金额']   // 首位
        const totalList = {
          i_pay_total: 0,
          d_si_total: 0,
          d_si_total_ent: 0,
          d_hf: 0,
          d_hf_ent: 0,
          d_pi_tax: 0,
          d_deduct_other_total: 0,
          take_home_pay: 0
        }

        viceData.map(v => {
          totalList.i_pay_total += Number(v.i_pay_total)
          totalList.d_si_total += Number(v.d_si_total)
          totalList.d_si_total_ent += Number(v.d_si_total_ent)
          totalList.d_hf += Number(v.d_hf)
          totalList.d_hf_ent += Number(v.d_hf_ent)
          totalList.d_pi_tax += Number(v.d_pi_tax)
          totalList.d_deduct_other_total += Number(v.d_deduct_other_total)
          totalList.take_home_pay += Number(v.take_home_pay)
        })

        this.totalList = totalList

        // 保留两位小数
        const arr = Array.from([...Object.values(totalList)], (n) => toMoney(n.toFixed(2)))

        sums.push(...arr)
        return sums
      },
      // 结算方式与银行账号联动
      changeSmId (smId) {
        this.isMust.bank_acct_code.isMust = smId === 2
        this.bankList = bankList()
      },
      // 验证
      validateDynatic () {
        const isMust = this.isMust
        const mainData = this.mainData
        const viceData = this.viceData
        let tips = ''

        // 验证主档数据
        for (const [k, v] of Object.entries(isMust)) {
          if (isMust[k].type === 1) {
            if (isMust[k].isMust && !mainData[k]) {
              tips = isMust[k].tips
              this.$message({
                message: tips,
                type: 'warning',
                duration: 2000
              })
            }
            if (mainData.sm_id === 2 && !mainData.bank_acct_code) {
              tips = '银行账号不能为空'
              this.$message({
                message: tips,
                type: 'warning',
                duration: 2000
              })
            }
          }
        }

        // 验证从档数据
        for (const [k, v] of Object.entries(isMust)) {
          if (isMust[k].type === 2) {
            viceData.map(val => {
              if (isMust[k].isMust && !val[k]) {
                tips = isMust[k].tips
                this.$message({
                  message: tips,
                  type: 'warning',
                  duration: 2000
                })
              }
              if (val.take_home_pay < 0) {
                tips = '实发工资不能为负数'
                this.$message({
                  message: tips,
                  type: 'warning',
                  duration: 2000
                })
              }
            })
          }
        }
        return tips
      },

      // 过滤数据
      evalData (access) {
        this.loading = true
        this.mainData = {}
        this.viceData = []
        this.viceDetailData = [] // 工资表个人信息数组（只有导入的时候有值）

        if (access === 'create') {  // 新增
          this.mainData = createMain({})  // 主档字段
          this.viceData.push(createVice({}))  // 从档字段
          this.readState = false
          this.main_readState = false
          this.isMust.bank_acct_code.isMust = false  // 是否校验银行主档字段为空
          this.hasImportData = false
          this.isShowToggle = false

        } else if (this.tableData) {
          switch (access) {
            case 'edit':   // 编辑
              this.main_readState = false
              this.readState = (parseFloat(this.simple_module) === 0  && this.isCopy !== 1) || (parseFloat(this.simple_module) === 0 && this.isCopy === 1) ? false : true
              break
            case 'voucher':  // || 'detail':  // 已生成凭证 或 查看详情
              this.readState = true
              this.main_readState = true
              break
            case this.formModal.flag:  // 解析“新增”导入模板的数据
              this.readState = true
              this.main_readState = false
              break
          }

          this.viceDetailData = this.tableData.salaryEmpList  // 明细表的字段
          const list = this.tableData.salaryDeptList || [] // 工资表部门信息
          // 展开明细数据的按钮，如果有明细数据的话，展开明细数据的按钮出现，否则隐藏
          this.isShowToggle = this.viceDetailData && this.viceDetailData.length ? true : false
          if (list.length > 0) {
            list.map(v => {
              this.viceData.push(createVice(v))   // 从档字段
            })
            this.mainData = createMain(list[0])  // 主档字段
          }
        }

        this.loading = false
      },
      // 过滤部门
      evalDept (dept_id) {
        const deptList = deepCopy(this.deptList)
        return deptList[dept_id]
      },

      // 保存
      handleSave (type) {  // 单号1：保存并生成凭证，0：保存
        const urlInfo = this.$store.getters.urlInfo
        const indexData = this.$store.getters.indexData
        const viceData = this.viceData[0]
        const mainData = this.mainData
        const accounts = store.getters.accountList.accounts
        const bankCode = filterAccount(accounts, ['1002']).toString()
        const validateMust = this.validateDynatic()

        if (validateMust) return false  // 校验

        // 如果是复制上期且上期的数据为导入的时候才需要提交这些字段
        let empList = []
        if (String(this.isCopy) === '1' && this.private_state > 7) {
          const salaryEmpList = this.tableData.salaryEmpList
          salaryEmpList.map(salaryEmpList => {   // 遍历获得修改的展开明细的数据
            const normalTax = parseFloat(salaryEmpList.d_co_pi_tax) || 0
            const disposableTax = parseFloat(salaryEmpList.d_ot_pi_tax) || 0
            this.tableData.bill_id = parseInt(this.tableData.bill_id || 0)
            var item = {
              ent_id: parseInt(this.tableData.ent_id || 0),
              bill_id: this.tableData.bill_id,
              index_no: parseInt(salaryEmpList.index_no || 0),
              dept_id: parseInt(salaryEmpList.dept_id > 7 ? salaryEmpList.dept_id % 7 : salaryEmpList.dept_id || 0),
              dept_name: String(salaryEmpList.dept_name || ''),
              emp_name: String(salaryEmpList.emp_name || ''),
              emp_id_num: String(salaryEmpList.emp_id_num || ''),
              i_basic: parseFloat(salaryEmpList.i_basic || 0),
              i_allowance: parseFloat(salaryEmpList.i_allowance || 0),
              i_bonus: parseFloat(salaryEmpList.i_bonus || 0),
              i_pay_other: parseFloat(salaryEmpList.i_pay_other || 0),
              i_annual_bonus: parseFloat(salaryEmpList.i_annual_bonus || 0),
              i_pay_total: parseFloat(salaryEmpList.i_pay_total || 0),
              d_ri: parseFloat(salaryEmpList.d_ri || 0),
              d_soai: parseFloat(salaryEmpList.d_soai || 0),
              d_mi: parseFloat(salaryEmpList.d_mi || 0),
              d_smi: parseFloat(salaryEmpList.d_smi || 0),
              d_ui: parseFloat(salaryEmpList.d_ui || 0),
              d_si_total: parseFloat(salaryEmpList.d_si_total || 0),
              d_hf: parseFloat(salaryEmpList.d_hf || 0),
              d_absence: parseFloat(salaryEmpList.d_absence || 0),
              d_deduct_other: parseFloat(salaryEmpList.d_deduct_other || 0),
              d_deduct_other_total: parseFloat(salaryEmpList.d_deduct_other_total || 0),
              d_deduct_total: parseFloat(salaryEmpList.d_deduct_total || 0),
              d_ri_ent: parseFloat(salaryEmpList.d_ri_ent || 0),
              d_soai_ent: parseFloat(salaryEmpList.d_soai_ent || 0),
              d_mi_ent: parseFloat(salaryEmpList.d_mi_ent || 0),
              d_smi_ent: parseFloat(salaryEmpList.d_smi_ent || 0),
              d_ui_ent: parseFloat(salaryEmpList.d_ui_ent || 0),
              d_maternity_insu_ent: parseFloat(salaryEmpList.d_maternity_insu_ent || 0),
              d_eii_ent: parseFloat(salaryEmpList.d_eii_ent || 0),
              d_si_total_ent: parseFloat(salaryEmpList.d_si_total_ent || 0),
              d_hf_ent: parseFloat(salaryEmpList.d_hf_ent || 0),
              pay_ent: parseFloat(salaryEmpList.pay_ent || 0),
              d_chi: parseFloat(salaryEmpList.d_chi || 0),
              d_pw_donation: parseFloat(salaryEmpList.d_pw_donation || 0),
              d_btax_total: parseFloat(salaryEmpList.d_btax_total || 0),
              d_pi_tax: normalTax + disposableTax,
              take_home_pay: parseFloat(salaryEmpList.take_home_pay || 0),
              emp_id_type: parseInt(salaryEmpList.emp_id_type > 6 ? salaryEmpList.emp_id_type % 6 : salaryEmpList.emp_id_type || 0),
              sign: String(salaryEmpList.sign || ''),
              d_co_pi_tax: normalTax,
              d_ot_pi_tax: disposableTax
            }
            empList.push(item)
          })

          // 展开明细的数据如果有修改需要同步到明细
          for (let i = 0; i < salaryEmpList.length; i++) {
            if (!this.viceData[i]) {
              this.viceData[i] = createVice({})
            }
            for (const v in this.viceData[i]) {
              this.viceData[i][v] = salaryEmpList[i][v]
            }
          }
        }

        const summary = [{
          entId: indexData.entAcctVO.id, // 企业id
          qyid: urlInfo.qyid,
          ssyf: urlInfo.ssyf,
          salaryId: viceData.bill_id,
          bank_acctList: bankCode || '',
          totalSalary: viceData.take_home_pay,
          accountSelect: mainData.pay_falg,
          period: mainData.trans_period,
          cashSelect: mainData.sm_id,
          bankAccount: mainData.bank_acct_code,
          illustrate: mainData.trans_desc
        }]

        const trans_desc = []
        this.viceData.map(v => {
          const tmp = {
            department: isNaN(v.dept_id) ? this.evalDept(v.dept_id) : v.dept_id,
            ShouldWages: v.i_pay_total,
            personalFee: v.d_si_total,
            companyFee: v.d_si_total_ent,
            personalFund: v.d_hf,
            companyFund: v.d_hf_ent,
            personalTax: v.d_pi_tax,
            Other: v.d_deduct_other_total,
            actualWages: v.take_home_pay
          }
          trans_desc.push(tmp)
        })

        const params = {
          ent_id: this.tableData.ent_id,
          isCopy: this.isCopy,
          simple_module: this.simple_module,
          bill_no: type,
          private_state: mainData.private_state,
          summary: JSON.stringify(summary),
          trans_desc: JSON.stringify(trans_desc),
          empList: empList
        }

        updateSalaryDeptL(params).then(res => {

          if (res.success) {
            this.$message({
              title: '成功',
              message: res.message,
              type: 'success',
              duration: 2000
            })
            empList = []
            this.$emit('on-save')
          } else {
            this.$message({
              title: '失败',
              message: res.message,
              type: 'error',
              duration: 2000
            })
          }
          this.isMust.i_pay_total.isMust = true // 重置银行账号不能为空的校验
        }, error => {
          this.$emit('on-save')
          this.isMust.i_pay_total.isMust = true
          console.log(error)
        })
      },

      // 保存并生成凭证
      handleCreate (type) {
        const urlInfo = this.$store.getters.urlInfo
        const indexData = this.$store.getters.indexData
        const viceData = this.viceData[0]
        const mainData = this.mainData
        const validateMust = this.validateDynatic()
        const accounts = store.getters.accountList.accounts
        const bankCode = filterAccount(accounts, ['1002']).toString()

        // 验证
        if (validateMust) return false

        const summary = [{
          entId: indexData.entAcctVO.id, // 企业id
          qyid: urlInfo.qyid,
          ssyf: urlInfo.ssyf,
          salaryId: viceData.bill_id,
          bank_acctList: bankCode || '',
          totalSalary: viceData.take_home_pay,
          accountSelect: mainData.pay_falg,
          period: mainData.trans_period,
          cashSelect: mainData.sm_id,
          bankAccount: mainData.bank_acct_code,
          illustrate: mainData.trans_desc
        }]
        const trans_desc = []
        this.viceData.map(v => {
          const tmp = {
            department:  isNaN(v.dept_id) ? this.evalDept(v.dept_id ) : v.dept_id ,
            ShouldWages: v.i_pay_total,
            personalFee: v.d_si_total,
            companyFee: v.d_si_total_ent,
            personalFund: v.d_hf,
            companyFund: v.d_hf_ent,
            personalTax: v.d_pi_tax,
            Other: v.d_deduct_other_total,
            actualWages: v.take_home_pay
          }
          trans_desc.push(tmp)
        })

        // 如果数据为导入的时候
        const empList = []
        if ((this.private_state > 7 || this.hasImportData) && this.tableData && this.tableData.salaryEmpList) {
          const salaryEmpList = this.tableData.salaryEmpList
          salaryEmpList.map(salaryEmpList => {    // 遍历获得修改的展开明细的数据
            this.tableData.bill_id = parseInt(this.tableData.bill_id || 0)
            const normalTax = parseFloat(salaryEmpList.d_co_pi_tax) || 0
            const disposableTax = parseFloat(salaryEmpList.d_ot_pi_tax) || 0
            var item = {
              ent_id: parseInt(salaryEmpList.ent_id || 0),
              bill_id: parseInt(salaryEmpList.bill_id || 0),
              index_no: parseInt(salaryEmpList.index_no || 0),
              dept_id: parseInt(salaryEmpList.dept_id > 7 ? salaryEmpList.dept_id % 7 : salaryEmpList.dept_id || 0),
              dept_name: String(salaryEmpList.dept_name || ''),
              emp_name: String(salaryEmpList.emp_name || ''),
              emp_id_num: String(salaryEmpList.emp_id_num || ''),
              i_basic: parseFloat(salaryEmpList.i_basic || 0),
              i_allowance: parseFloat(salaryEmpList.i_allowance || 0),
              i_bonus: parseFloat(salaryEmpList.i_bonus || 0),
              i_pay_other: parseFloat(salaryEmpList.i_pay_other || 0),
              i_annual_bonus: parseFloat(salaryEmpList.i_annual_bonus || 0),
              i_pay_total: parseFloat(salaryEmpList.i_pay_total || 0),
              d_ri: parseFloat(salaryEmpList.d_ri || 0),
              d_soai: parseFloat(salaryEmpList.d_soai || 0),
              d_mi: parseFloat(salaryEmpList.d_mi || 0),
              d_smi: parseFloat(salaryEmpList.d_smi || 0),
              d_ui: parseFloat(salaryEmpList.d_ui || 0),
              d_si_total: parseFloat(salaryEmpList.d_si_total || 0),
              d_hf: parseFloat(salaryEmpList.d_hf || 0),
              d_absence: parseFloat(salaryEmpList.d_absence || 0),
              d_deduct_other: parseFloat(salaryEmpList.d_deduct_other || 0),
              d_deduct_other_total: parseFloat(salaryEmpList.d_deduct_other_total || 0),
              d_deduct_total: parseFloat(salaryEmpList.d_deduct_total || 0),
              d_ri_ent: parseFloat(salaryEmpList.d_ri_ent || 0),
              d_soai_ent: parseFloat(salaryEmpList.d_soai_ent || 0),
              d_mi_ent: parseFloat(salaryEmpList.d_mi_ent || 0),
              d_smi_ent: parseFloat(salaryEmpList.d_smi_ent || 0),
              d_ui_ent: parseFloat(salaryEmpList.d_ui_ent || 0),
              d_maternity_insu_ent: parseFloat(salaryEmpList.d_maternity_insu_ent || 0),
              d_eii_ent: parseFloat(salaryEmpList.d_eii_ent || 0),
              d_si_total_ent: parseFloat(salaryEmpList.d_si_total_ent || 0),
              d_hf_ent: parseFloat(salaryEmpList.d_hf_ent || 0),
              pay_ent: parseFloat(salaryEmpList.pay_ent || 0),
              d_chi: parseFloat(salaryEmpList.d_chi || 0),
              d_pw_donation: parseFloat(salaryEmpList.d_pw_donation || 0),
              d_btax_total: parseFloat(salaryEmpList.d_btax_total || 0),
              d_pi_tax: normalTax + disposableTax,
              take_home_pay: parseFloat(salaryEmpList.take_home_pay || 0),
              emp_id_type: parseInt(salaryEmpList.emp_id_type > 6 ? salaryEmpList.emp_id_type % 6 : salaryEmpList.emp_id_type || 0),
              sign: String(salaryEmpList.sign || ''),
              d_co_pi_tax: normalTax,
              d_ot_pi_tax: disposableTax
            }
            empList.push(item)
          })
        }

        // 添加判断
        let isCopyVal = ''
        let simple_module_Val = ''
        if (this.hasImportData) {   // 如果是“新增”导入，这两个字段由新增导入接口返回的值来标识
          isCopyVal = this.import_isCopy
          simple_module_Val = this.import_simple_module
        } else {
          if (this.access === 'create') {  // 如果是重新新增的话，isCopy和simple_module_Val要重置为0
            isCopyVal = 0
            simple_module_Val = 0
          } else {      // “查看详情”和“编辑”情况下，这两个字段由根据父页面传进来的进行标识
            isCopyVal = this.isCopy
            simple_module_Val = this.simple_module
          }
        }

        const params = {
          ent_id: indexData.entAcctVO.id,
          isCopy: parseInt(isCopyVal),
          simple_module: parseInt(simple_module_Val),
          bill_no: type,
          private_state: mainData.private_state,
          summary: JSON.stringify(summary),
          trans_desc: JSON.stringify(trans_desc),
          empList: empList
        }

        saveSalary(params).then(res => {
          if (res.success) {
            this.$message({
              title: '成功',
              message: res.message,
              type: 'success',
              duration: 2000
            })
            this.$emit('on-save')
          } else {
            this.$message({
              title: '失败',
              message: res.message,
              type: 'error',
              duration: 2000
            })
          }
          this.isMust.i_pay_total.isMust = true // 重置银行账号不能为空的校验
        }, error => {
          this.isMust.i_pay_total.isMust = true  // 重置银行账号不能为空的校验
          this.$emit('failed-to-crate-voucher')
        })
      },
      // 导入
      handleImport () {
        this.formModal.modal = true
        this.main_readState = true
      },
      // 导入 确认
      salaryImport (param) {  // 参数param接收的是导入页面导入请求回来的数据
        this.isShowToggle = true
        this.tableData = param
        this.evalData(this.formModal.flag)
        this.import_simple_module = param.salaryDeptList[0].simple_module
        this.import_isCopy = param.salaryDeptList[0].isCopy
        this.hasImportData = true   // 标识已有导入进来的数据
        this.$emit('on-import-salary', param.salaryDeptList[0].simple_module)
        // console.log( this.access === 'create' && this.hasImportData,this.readState)
      }
    },
    watch: {
      access (val) {
        this.evalData(val)
      },
      tableDataOrigin (val) {
        this.tableData = val
        this.evalData(this.access)
      },
      viceData: {
        handler: function (oldVal, newVal) {
          // 实发工资 联动
          if (this.row) {
            this.row.take_home_pay = Number(this.row.i_pay_total) - Number(this.row.d_si_total) - Number(this.row.d_hf) - Number(this.row.d_pi_tax) - Number(this.row.d_deduct_other_total)
            if (this.row.take_home_pay < 0) {
              this.$message({
                message: '实发工资不能为负数',
                type: 'warning',
                duration: 2000
              })
            }
          }
        },
        deep: true
      },
      visible: {
        handler: function (oldVal) {
          this.toggleState = false  // 一进入查看详情页面先进入明细汇总表
          this.evalData(this.access)
        },
        deep: true
      }
    },
    components: {
      ImportForm
    }

  }
</script>
