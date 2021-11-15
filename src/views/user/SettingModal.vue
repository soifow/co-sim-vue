<template>
  <!--  okText="提交计算"-->
  <a-modal
    :title="title"
    :width="600"
    :visible="visible"
    :confirmLoading="confirmLoading"
    :destroyOnClose="true"
    @ok="handleOk"
    @cancel="handleCancel"
    cancelText="关闭"
  >

    <a-form :form="form"
            :label-col="labelCol"
            :wrapper-col="wrapperCol">

      <a-row :gutter="0">
        <a-col :span="18" :offset="2">
          <a-form-item label="接收文件夹">
            <a-input v-decorator="['receiveDir', ctrlOptions.receiveDir]"
                     class="modal-input" />

          </a-form-item>
        </a-col>
      </a-row>

      <a-row :gutter="0">
        <a-col :span="18" :offset="2">
          <a-form-item label="发送文件夹">
            <a-input v-decorator="['sendDir', ctrlOptions.sendDir]"
                     class="modal-input" />

          </a-form-item>
        </a-col>
      </a-row>

      <a-row :gutter="0">
        <a-col :span="18" :offset="2">
          <a-form-item label="计算文件夹">
            <a-input v-decorator="['calcDir', ctrlOptions.calcDir]"
                     class="modal-input" />

          </a-form-item>
        </a-col>
      </a-row>

      <a-row :gutter="0">
        <a-col :span="18" :offset="2">
          <a-form-item label="自动计算">
            <a-checkbox v-decorator="['autoCalc', ctrlOptions.autoCalc]" />

          </a-form-item>
        </a-col>
      </a-row>

      <a-row :gutter="0">
        <a-col :span="18" :offset="2">
          <a-form-item label="数据文件夹">
            <a-input v-decorator="['dataFile', ctrlOptions.dataFile]"
                     class="modal-input" />

          </a-form-item>
        </a-col>
      </a-row>

    </a-form>
  </a-modal>
</template>

<script>
  import { postAction } from '@/api/manage'
  import { mapGetters } from 'vuex'

  export default {
    name: "SettingModal",
    data() {
      return {
        title: '设置',
        labelCol:  {span: 9, offset: 0},
        wrapperCol: {span: 13, offset: 1},
        visible: false,
        confirmLoading: false,
        form: this.$form.createForm(this),
        formData: {
          receiveDir: '',   // 接收文件夹
          sendDir: '',      // 发送文件夹
          calcDir: '',      // 计算文件夹
          autoCalc: false,  // 是否自动计算
          dataFile: '',     // 数据文件夹
        },
        ctrlOptions: {        // 定义空对象，在created中定义初始值
          // 在这里直接引用this.formData.name之类的会报错，因为formData执行到这里时还未被创建，对undefined的取属性直接报错
        },
        url: {
          getInfo: '/v1/enterNode/select.g',
        },
      }
    },
    computed: {
      ...mapGetters(['userInfo','teamInfo']),
    },
    created() {
      // 将ctrlOptions的初始化延迟到这里
      this.ctrlOptions = {
        receiveDir: {   // 接收文件夹
          initialValue: this.formData.receiveDir,
        },
        sendDir: {   // 发送文件夹
          initialValue: this.formData.sendDir,
        },
        calcDir: {    // 计算文件夹
          initialValue: this.formData.calcDir,
        },
        autoCalc: {   // 所属用户
          initialValue: this.formData.autoCalc,
          valuePropName: 'checked',
        },
        dataFile: {    // 数据文件夹
          initialValue: this.formData.dataFile,
        },
      }
    },
    methods: {
      loadData() {
        // this.loading = true
        // postAction(this.url.getInfo, this.reqParams).then((res) => {
        //   if (res.code === 0) {
        //     console.log(res)
        //     let data = this.formatListData(res.data)
        //     this.dataSource = data
        //   } else {
        //     this.$message.error(`${res.message}`)
        //   }
        //
        //   this.loading = false
        // }).catch(err => {
        //   this.$message.error(`${err}`)
        // })
      },
      open(record, type) {
        this.visible = true
        // this.reqParams = {
        //   id: record.id,
        //   tasktype: type
        // }
        this.loadData()
      },
      close() {
        this.$emit('close')
        this.visible = false
      },
      handleOk() {
        this.close()    // 该功能暂时不实现
      },
      handleCancel() {
        this.close()
      },
    },
  }
</script>

<style scoped>

</style>