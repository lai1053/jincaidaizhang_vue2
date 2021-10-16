<style lang="scss">
  .import-box{
    width: 530px;
    .import-form-edit-box {
      width: 300px;
      height: 16px;

    }
    .import-help{
      margin-left: 20px;
      line-height:2;
      word-break: break-all;
      color: #000000;
    }
    .el-input-group__append{
      padding: 0;
    }
    .upload-btn{
      text-align: center;
      line-height: 34px;
      height: 34px;
      display: block;
      cursor: pointer;
      width: 66px;
    }
    .import-tip {
      .el-form-item__label {
        color: #FFA854;
        line-height: 28px;
      }
      .el-form-item__content {
        line-height: 30px;
      }
      p {
        margin: 0;
      }
    }
    .download-bill{
      left: 50px;
    }
  }

</style>
<template>
    <div class="import-box">
      <div class="import-help"> <b>第一步 :</b> <span>  导出发票数据</span> <a v-if="!changeTaxType" class="download-bill" :href="downloadUrl" download><i class="iconfont icon-export"></i><span style="color:#1a6be6;"> 导出</span></a>
      <div style="width: 495px"><div><b>第二步 :</b>1、修改发票数据: 可针对发票中的商品或服务名称、单位、</div><span style="margin-left: 14%">数量、单价等字段进行修改</span>
        <div style="margin-left: 10%"><span>2、删除不入账的发票数据,</span><span v-if="formModal.mold === 'sales'">该类型发票可通过再次理票进行查看</span><span v-else>该发票自动进入【待选票】</span></div>
      </div>
      <div>
        <span><b>第三步 :</b> 导入修改后发票数据: xls、xlsx</span>
        <div style="margin-left:26px;">
        <el-form label-position="right" label-width="108px" :model="formModal">
          <el-form-item label="请选择文件">
            <input
              type="file"
              accept=".xlsx, .xls"
              style="display: none"
              id="upload-input"
              @change="handleFileChange"
            >
            <el-input
              class="import-form-edit-box"
              type="text"
              size="small"
              placeholder=""
              v-model="formModal.fileInfo.name"
              readonly
            >
              <template slot="append">
                <span @click="handleUpload" class="upload-btn">浏览</span>
              </template>
            </el-input>
          </el-form-item>
        </el-form>
        </div>
      </div>
      </div>
    </div>
</template>

<script>
    export default {
      name: 'importForm',
      props: {
        formModal: Object,
        downloadUrl:'',
        changeTaxType:Boolean
      },
      methods: {
        handleUpload() {
          document.getElementById('upload-input').click()
        },
        handleFileChange(e) {
          if (e.target.files.length === 0) return
          const files = e.target.files
          this.formModal.fileInfo = files[0]
        }
      }
    }
</script>

<style scoped>

</style>
