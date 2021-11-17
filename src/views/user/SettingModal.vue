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
          <a-form-item label="企业电网文件根目录">
            <a-input v-decorator="['dataFile', ctrlOptions.dataFile]"
                     class="modal-input" />

          </a-form-item>
        </a-col>
      </a-row>

      <a-row :gutter="0">
        <a-col :span="18" :offset="2">
          <a-form-item label="外部电网文件根目录">
            <a-input v-decorator="['netDataFile', ctrlOptions.netDataFile]"
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
  import {removePropertyOfNull} from "@/utils/util";

  export default {
    name: "SettingModal",
    data() {
      return {
        title: '设置',
        labelCol:  {span: 9, offset: 0},
        wrapperCol: {span: 13, offset: 1},
        visible: false,
        confirmLoading: false,
        reqParams: {},
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
          getInfo: '/v1/jointConfig/findOne.g',
          updateInfo: '/v1/jointConfig/update.g',
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
        netDataFile: {    // 电网数据文件夹
          initialValue: this.formData.netDataFile,
        },
      }
    },
    methods: {
      loadData() {
        this.loading = true
        postAction(this.url.getInfo, this.reqParams).then((res) => {
          if (res.code === 0) {
            this.formatSettingData(res.data)
            this.updateData()
          } else {
            this.$message.error(`${res.message}`)
          }

          this.loading = false
        }).catch(err => {
          this.$message.error(`${err}`)
        })
      },
      open() {
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
        Promise.all([
          this.submitForm(),
        ]).then((results) => {
          let data = results[0]
          let params = {
            id: this.formData.id,
            rcvdir: data.receiveDir,
            senddir: data.sendDir,
            calcdir: data.calcDir,
            calcmode: data.autoCalc ? 1 : 0,
            enterdir: data.dataFile,
            outerdir: data.netDataFile,
          }

          this.loading = true
          postAction(this.url.updateInfo, params).then((res) => {
            if (res.code === 0) {
              this.visible = false
            } else {
              this.$message.error(`${res.message}`)
            }

            this.loading = false
          }).catch(err => {
            this.$message.error(`${err}`)
          })
        })
      },
      handleCancel() {
        this.close()
      },
      formatSettingData(response) {
        if (Object.keys(response).length) {
          this.formData['id'] = response.id                      // 该行对应结果的唯一id（计算结果这类子弹窗请求所需要的数据）
          this.formData.receiveDir = response.rcvdir             // 接收文件夹路径
          this.formData.sendDir = response.senddir               // 发送文件夹路径
          this.formData.calcDir = response.calcdir               // 计算文件夹路径
          this.formData.autoCalc = response.calcmode === 1       // 计算模式 0-手动 1-自动
          this.formData.dataFile = response.enterdir             // 企业电网文件根目录
          this.formData.netDataFile = response.outerdir          // 外部电网文件根目录
        }
      },
      // 生成更新form使用的对象
      getUpdateObj(keys) {
        let result = {}
        if (keys === null || keys === undefined) {    // 若未传特定更新的key那么整个tab的form都更新
          keys = Object.keys(this.formData)
        }
        for (let key of keys) {
          // card字段对应卡片子弹窗，tableItems不是表单form项未做字段绑定, modelValue在UI不显示,更新表单域不涉及这些
          if (key !== 'card' &&
            key !== 'tableItems' &&
            key !== 'modelValue') {
            result[key] = this.formData[key]
          }
        }
        return result
      },
      // 更新表单域的数据（指定参数时只更新数组内给定的key值，不传参时整个tab一起更新）
      // 参数为数组，数组由字符串组成，每个字符串对应form中各个控件的id
      updateData(keys = null) {
        this.$nextTick(() => {
          this.form.setFieldsValue(this.getUpdateObj(keys))
        })
      },
      submitForm() {
        let that = this;
        return new Promise((resolve, reject) => {
          that.form.validateFields((err, values) => {
            if (!err) {
              resolve(values)
            } else {
              reject(err)
            }
          })
        })
      },
    },
  }
</script>

<style scoped>

</style>