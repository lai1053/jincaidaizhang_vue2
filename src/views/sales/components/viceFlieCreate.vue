<style lang='scss' scoped>

</style>

<template>
  <div>
    <el-table
      stripe
      border
      :data="list"
      :height="height"
      class="vue-table vue-vice-file">
      <el-table-column
        v-for="(item, i) in columns"
        v-if="!item.hide"
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
          <template v-if="item.prop==='item_name'">
            <template>
              <el-select
                v-model="scope.row[item.prop]"
                popper-class="auto-complete"
                class="vue-edit-box"
                placeholder=""
                clearable
                filterable
                no-match-text="">
                <el-option
                  v-for="(val, i) in codeList"
                  :key="i"
                  :label="val"
                  :value="val">
                </el-option>
              </el-select>
            </template>
          </template>
          <span v-else>{{scope.row[item.prop]}}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
  export default {
    name: 'mainFileCreate',
    props: {
      columns: Array,
      list: Array,
      height: String
    }
  }
</script>
