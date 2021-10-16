<template>
  <div>
    <el-row class="vue-main vue-main-create">
      <div v-for="(item, index) in mainTitle" v-if="!item.hide">
        <el-col :span="3" class="vue-row-col vue-row-col-bg">
          {{item.name}}<span v-if="item.isMust" class="vue-must">*</span></el-col>
        <el-col :span="item.width" class="vue-row-col">
          <el-select
            v-if="item.type==='select'"
            v-model="item.value"
            :clearable="item.clear"
            :popper-class="subjectData&&subjectData.subModal?'auto-complete-t':'auto-complete'"
            @change="changeMainFileVal(index)"
            filterable
            class="vue-edit-box"
            placeholder=""
            no-match-text="">
            <el-option
              v-for="(label, val) in editData[item.options]"
              :key="val"
              :label="label"
              :value="val">
            </el-option>
            <div v-if="item.name!=='往来单位'" class="auto-complete-btn" @click="addSubject(item.options)">
              <i class="el-icon-circle-plus-outline" style="color: #999999;"></i>
              <span>新增</span>
            </div>
          </el-select>
          <el-input
            v-else
            :disabled="item.type==='disabled'"
            readonly="item.type==='readonly'"
            @change="changeMainFileVal(index)"
            @input="handleInput(item, $event)"
            v-model="item.value"
          ></el-input>
          <span
            class="fuzhu"
            v-if="item.hasAssist&&item.value&&editData[item.options][item.value]&&editData[item.options][item.value].split(' ')[editData[item.options][item.value].split(' ').length-1]==='辅'"
            @click="showAssist(index, item)">辅</span>
        </el-col>
      </div>
    </el-row>
  </div>
</template>

<script>
    export default {
      name: 'mainFileCreate',
      props: {
        mainTitle: Object,
        subjectData: Object,
        editData: Object
      }
    }
</script>

<style scoped lang="scss">
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
      position: relative;
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
    .vue-edit-box {
      width: 100%;
    }

  }
</style>
<style lang="scss">
  .vue-main-create{
    .el-input__inner {
      height: 30px;
      line-height: 30px;
      border: 1px solid transparent;
      border-radius: 0;
    }
  }
</style>
