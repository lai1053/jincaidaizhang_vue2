<style lang="scss" scoped>

</style>
<template>
  <div>
    <el-dialog
      width="500px"
      title="新增科目"
      :visible.sync="addSubjectModal.visible"
      append-to-body>
      <el-form label-position="right" :model="form" ref="form" label-width="115px">
        <el-form-item label="上级科目名称：">
          <el-select v-model="form.superior" filterable style="width: 345px" :disabled="form.superList.length === 0">
            <el-option
              v-for="(val, i) in form.superList"
              :key="i"
              :label="val"
              :value="val">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="新增科目名称：">
          <el-input v-model="form.newName"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button size="medium" type="default" @click="cancel">取消</el-button>
        <el-button size="medium" type="primary" @click="confirm" :loading="btnLoading">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { mapGetters, mapMutations } from 'vuex'

  import {
    addAcct
  } from '@/api/common'

  export default {
    name: 'create-subject',
    props: {
      addSubjectModal: Object,
      subjectData: Object,
      newAddRowParam: Object
    },
    data () {
      return {
        form: {
          superior: '2323',
          superList: [],
          newName: ''
        },
        btnLoading: false
      }
    },
    computed: {},
    created () {
      this.getSubject()
    },
    methods: {
      getSubject () {
        this.resetData()
      },
      resetData () {
        this.form = {
          superior: '',
          superList: [],
          newName: ''
        }
      },
      confirm () {
        this.btnLoading = true
        const params = {
          acctName: this.form.newName,
          acct: this.form.superior
        }
        addAcct(params).then(res => {
          if (res.success) {
            this.$message({
              message: res.message,
              type: 'success',
              duration: 2000
            })
            const resp = res
            this.$store.dispatch('GetAccountList').then(res => {
              this.$emit('confirm', resp.data, this.newAddRowParam)
            }, error => {
              console.log(error)
            })
          } else {
            this.$message({
              message: res.message,
              type: 'fail',
              duration: 2000
            })
          }
          this.btnLoading = false
          this.resetData()
          this.addSubjectModal.visible = false
        }, error => {
          console.log(error)
          this.btnLoading = false
          this.addSubjectModal.visible = false
        })
      },
      cancel () {
        this.addSubjectModal.visible = false
        this.resetData()
      }
    },
    watch: {
      subjectData (val) {
        console.log(val, 222)
        const list = val.acctList[0].split(';')
        list.length = list.length - 1
        // console.log(list, list[0], list.length)
        this.form = {
          superior: list[0],
          superList: (list.length <= 2) ? [] : list,
          newName: val.name
        }
      }
    }
  }
</script>

