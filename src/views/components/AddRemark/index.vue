<template >
  <div>
    <el-dialog
      title="备注"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      width="500px"
      :before-close="handleClose">
      <el-input
        type="textarea"
        @input="handleInput"
        :rows="6"
        resize='none'
        maxlength=200
        placeholder="请输入备注，最多不超过200字"
        v-model="textRemark"
      >
      </el-input>
      <span class="text-span">剩余{{textlength}}字</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" size='mini' @click="saveAll">保存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: 'addRemark',
    data () {
      return {
        textRemark: this.remarks_contents,
        textlength: this.text_length,
        ifTextRemark: this.remarks_contents
      }
    },
    computed: {
    },
    methods: {
      handleInput () {
        const num = this.textRemark.length
        this.textlength = 200 - num
      },
      // 保存
      saveAll () {
        const vm = this
        let remark = this.textRemark
        while (remark.lastIndexOf(' ') >= 0) {
          remark = remark.replace(' ', '')
        }
        if (vm.textRemark && remark.length !== 0) {
          if (vm.ifTextRemark !== null && vm.ifTextRemark !== '') {
            vm.$confirm('本次备注信息将会替换原清单的备注信息, 是否确认?', '请确认', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              vm.$emit('on-save-all',  vm.textRemark)
            }).catch(() => {
            })
          } else {
            vm.$emit('on-save-all',  vm.textRemark)
          }
        } else {
          this.$message({
            showClose: false,
            message: '输入信息不能为空,请重新输入',
            duration: 1500,
            type: 'error'
          })
        }
      },
      // 关闭
      handleClose () {
        const dialogVisible = false
        this.$emit('on-handleClose', dialogVisible)
      }
    },
    props: {
      dialogVisible: {
        type: Boolean,
        default: false
      },
      remarks_contents: {
        type: String
      },
      text_length: {
        type: Number
      }
    }
  }
</script>

<style lang="scss">
  .el-textarea__inner:hover{
    border-color: #1ab394;
  }
  .el-textarea__inner:focus{
    border-color: #1ab394;
  }
  .text-span{
    color: #ccc;
    margin-top: -19px;
    z-index: 9999;
    position: absolute;
    left: 80%;
  }
</style>
