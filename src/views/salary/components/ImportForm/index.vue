<style lang="scss" scoped>
  .vue-edit-box {
    width: 320px;
  }
  .vue-a{
    cursor: pointer;
  }
  .browse{
    cursor: pointer;
  }
</style>

<template>
  <div>
    <el-dialog
      width="400px"
      title="导入"
      :close-on-click-modal="false"
      :visible.sync="formModal.modal"
      append-to-body>
      <el-form label-position="right" :model="form">
        <div>
          请选择  工资表文件路径：
          <span style="color:#9f9f9f">下载模板</span>
          <span class="vue-a">（<a :href="dl_Standard_src" download>标准表</a>&nbsp;&nbsp;<a :href="dl_Simplify_src" download>简表</a>）</span>
        </div>
        <div > <!-- @click="handleUpload" -->
          <label >
            <el-form-item style="margin-top: 20px">
              <input id="excel-upload-input" type="file" accept=".xlsx, .xls" :value='file_input_val' style="display: none"
                     @change="handleFileChange">
              <el-input size="small" placeholder="" v-model="fileName" class="vue-edit-box">
                <template slot="append">
                  <span class="browse">浏览</span>
                </template>
              </el-input>
            </el-form-item>
          </label>
        </div>
      </el-form>
      <div slot="footer">
        <el-button size="small" type="primary" @click="sureImport" :loading="btnLoading">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: 'import-form',
    props: {
      formModal: Object,
      flag: String
    },
    data () {
      return {
        iframeSrc: '',  // iframe路径
        fileName: '',
        form: {
          fileInfo: {
            // name: ''
          } // 对账单信息
        },
        btnLoading: false,
        dl_Standard_src: `${process.env.BASE_API}/common/downloadModule.do?fileName=salaryModule.xls`,
        dl_Simplify_src: `${process.env.BASE_API}/common/downloadModule.do?fileName=simpleSalaryModule.xls`,
        file_input_val: ''
      }
    },
    methods: {
      // 从本地获取文件
      handleFileChange (e) {  // input的change事件产生的事件对象，包含了target属性
        const files = e.target.files  // 事件对象的target属性下的files属性是一个数组对象，包含了上传到input中的所有文件的信息对象。
        this.form.fileInfo = files[0] // only use files[0]
        this.fileName = this.form.fileInfo.name  // 读取上传的文件名
      },
      // 重置数据
      resetData () {
        this.iframeSrc = ''
        this.form.fileInfo = {}  // (清空输入框change事件发生时所获取到的文件对象的属性)fileInfo是target对象中获取的input中输入的文件的对象类型
        this.fileName = ''  // 上传的文件名 (每次点击确定导入之后要清空输入框中的文件名)
        return false
      },
      // 确定
      sureImport () {
        const fileInfo = this.form.fileInfo
        const urlInfo = this.$store.getters.urlInfo
        const formData = new FormData()
        const self = this
        if (!fileInfo.name) {
          this.$message({
            message: '请选择需要导入的模板文件！',
            type: 'warning'
          })
          return
        }
        this.btnLoading = true
        let url = ''
        if (this.flag === 'add_import') {  // 如果是在新增界面点击“导入模板”按钮
          formData.append('qyid', urlInfo.qyid)
          formData.append('time', fileInfo.lastModified)
          formData.append('file', fileInfo)
          url = `${process.env.BASE_API}/salary/getImportSalary.do`
        } else {                         // 如果是在工资表主界面点击“导入”按钮
          // 不同的参数
          formData.append('qyid', urlInfo.qyid)
          formData.append('archive_code', String(urlInfo.ssyf))
          formData.append('id', -1)
          formData.append('time', fileInfo.lastModified)
          formData.append('file', fileInfo)
          url = `${process.env.BASE_API}/salary/saveImportSalary1.do`
        }
        // 导入工资表
        this.$http.post(url, formData).then(function (res) {
          const data = res.data
          if (data && data.code === '0') {
            self.$message({
              message: data.message,
              type: 'success'
            })
            self.btnLoading = false
            self.formModal.modal = false
            self.file_input_val = ''  // 清空input[file]的输入的文件名，这样才能在下次导入同名文件的时候触发change事件
            self.$emit('on-import', res.data.data)

            // 重置数据
            self.resetData()
          } else {
            self.$message({
              message: data.message,
              type: 'error'
            })
            self.btnLoading = false
          }
        }, function (err) {
          self.$message({
            message: err.message,
            type: 'error'
          })
        })
        this.btnLoading = false
      },
      // 取消
      close () {
        // this.resetData()
        this.formModal.modal = false
      }
    },
    watch: {
      'formModal.modal': function (newVal) {
        if (newVal) {
          this.fileName = ''
          this.file_input_val = '' // 清空input[file]的输入的文件名
        }
      }
    }
  }
</script>
