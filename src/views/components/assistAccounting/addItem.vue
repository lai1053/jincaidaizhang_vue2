<template>
  <el-dialog
  :title="addItemData.title"
  :visible.sync="addItemData.dialogVisible"
  width="500px"
  class="vau-add-sub"
  :close-on-click-modal="false"
  append-to-body
  >
  <el-form :form="addItemData.dataList" label-width="130px">
    <el-form-item
      :label="addItemData.department"
      v-if="addItemData.department!==''"
    >
      <el-select
        v-model="department"
        placeholder="请选择"
        style="width:236px"
        size="small"
        @change="selectDepartment(department)"
      >
        <el-option
          v-for="item1 in addItemData.dataList"
          :value="item1.name"
          :label="item1.name"
          :key="item1.name"
        >
        </el-option>
      </el-select>
      <!--<el-input v-model="addItemData.dataList.departmentVal" style="width:236px"></el-input>-->
    </el-form-item>
    <el-form-item :label="addItemData.project">
      <el-input v-model="addItemData.name" style="width:236px" size="small"></el-input>
    </el-form-item>
    <el-form-item label="规格型号" v-if="addItemData.hasGuige">
      <el-input v-model="addItemData.guige" style="width:236px" size="small"></el-input>
    </el-form-item>
    <el-form-item :label="addItemData.unit" v-if="addItemData.unit !== ''">
      <el-select v-model="addItemData.unitName" size="small" placeholder="请选择" style="width:236px">
        <el-option
          v-for="item in addItemData.dataList"
          :value="item.name"
          :label="item.name"
          :key="item.name"
        ></el-option>
      </el-select>
    </el-form-item>
  </el-form>
    <div slot="footer">
      <!--<el-button size="small" @click="closeModal">取消</el-button>-->
      <el-button size="small" style="margin-left: 15px" type='primary' @click="addItem">增加</el-button>
    </div>
  </el-dialog>
</template>

<script>
    import {Message, Loading} from 'element-ui'
    import {localParams} from '@/views/components/data/common'

    import {createAuxAccItem} from '@/api/common'
    import {duration} from '@/views/components/data/common'
    export default {
      name: 'index',
      data () {
        return {
          addData: {},
          department: ''
        }
      },
      props: {
        addItemData: Object
      },
      methods: {
        closeModal () {
          this.addItemData.dialogVisible = false
        },
        addItem () {
          // if (this.addItemData.department && !this.addItemData.classId && !this.addItemData.tbCode) {
          //   return Message({
          //     message: '上级部门名称不能为空！',
          //     type: 'warning'
          //   })
          // }
          const {name, guige, acctCode, tbCode, classId, unitName} = this.addItemData
          const shortName = name
          if (!shortName) {
            return Message({
              message: '新增项目名称不能为空！',
              type: 'warning'
            })
          }
          Loading.service(localParams)
          const params = {
            classId: classId,
            name: shortName,
            tbCode: tbCode,
            shortName: shortName,
            unitName: unitName,
            acctCode: acctCode,
            guige: guige
          }
          createAuxAccItem(params).then(resp => {
            const msg = '新增自定义辅助项目成功'
            Loading.service().close()
            Message({
              message: msg,
              type: 'success',
              duration: duration
            })
            this.addItemData.dialogVisible = false
            const newAcct = guige ? `${shortName}(${guige})` : shortName
            this.$emit('refreshList', newAcct)
          }).catch(error => {
            Loading.service().close()
          })
        },
        selectDepartment (value) {
          const departmentName = this.addItemData.departmentName
          let index = ''
          for (let i = 0; i < departmentName.length; i++) {
            if (departmentName[i] === value) {
              index = i
            }
          }
          this.addItemData.classId = this.addItemData.dataList[index].classId
          this.addItemData.tbCode = this.addItemData.dataList[index].tbCode
        }
      }
    }
</script>

<style scoped>

</style>
