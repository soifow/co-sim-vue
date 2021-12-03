<template>
  <a-modal
    :title="title"
    :width="1000"
    :visible="visible"
    :destroyOnClose="true"
    :confirmLoading="confirmLoading"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :form="form"
              :label-col="labelCol"
              :wrapper-col="wrapperCol">

        <a-row :gutter="0">
          <a-col :span="12" :offset="6">
            <a-form-item label="任务类型">
              <!--              <a-select :v-decorator="['taskType', ctrlOptions.taskType]">-->
              <a-select :defaultValue="taskType" @change="selectChanged">
                <a-select-option :value="2">
                  潮流计算
                </a-select-option>
                <a-select-option :value="6">
                  短路电流计算
                </a-select-option>
                <a-select-option :value="9">
                  暂态故障仿真
                </a-select-option>
              </a-select>
            </a-form-item>

          </a-col>
        </a-row>

        <a-row>
          <!-- table区域-begin -->
          <a-table
            size="middle"
            bordered
            rowKey="id"
            :columns="columns"
            :dataSource="dataSource"
            :pagination="false"
            :loading="loading"
          >

            <div slot="file" slot-scope="text, record">
            <span v-if="record.fileName">
              {{record.fileName}}
            </span>
            </div>

            <span slot="action" slot-scope="text, record">
<!--            <a @click="handleDetail(record)">查看</a>-->
              <!--            <a-divider type="vertical" />-->
            <a-upload :customRequest="customRequest"
                      :show-upload-list="false"
                      :before-upload="function(file) { return beforeUpload(file, record)}"
                      @change="function(info) { return handleUploadFileChange(info, record)}"
                      :disabled="!enableUpload">
              <a :style="{color: !enableUpload ? 'gray' : ''}"
                 :disabled="!enableUpload"> 上传 </a>
            </a-upload>
              <!--            <a-divider type="vertical" />-->
              <!--            <a :href="`${url.download}?filepath=${record.filePath}`">下载</a>-->
          </span>
          </a-table>
          <!-- table区域-end -->
        </a-row>

        <a-row :gutter="0">
          <a-col :span="12" :offset="6">
            <a-form-item label="规划数据年份">
              <a-input class="modal-input"
                       :defaultValue="planYear"
                       @change="planYearChange"
                       :disabled="dataType === '运行'" />

            </a-form-item>

          </a-col>
        </a-row>

        <a-row :gutter="0">
          <a-col :span="12" :offset="6">
            <a-form-item label="规划数据方式">
              <!--              <a-select :v-decorator="['taskType', ctrlOptions.taskType]">-->
              <a-select :defaultValue="planMode"
                        @change="planModeChange"
                        :disabled="dataType === '运行'">
                <a-select-option :value="0">
                  大方式
                </a-select-option>
                <a-select-option :value="1">
                  小方式
                </a-select-option>
                <a-select-option :value="2">
                  其他方式
                </a-select-option>
              </a-select>
            </a-form-item>

          </a-col>
        </a-row>

        <a-row :gutter="0">
          <a-col :span="12" :offset="6">
            <a-form-item label="数据类型">
              <a-input class="modal-input"
                       :defaultValue="dataType"
                       :value="dataType"
                       disabled />

            </a-form-item>

          </a-col>
        </a-row>

        <a-row :gutter="0">
          <a-col :span="12" :offset="6">
            <a-form-item label="基准容量">
              <a-input class="modal-input"
                       :defaultValue="baseCapacity"
                       :value="baseCapacity"
                       disabled />

            </a-form-item>

          </a-col>
        </a-row>
      </a-form>
    </a-spin>

    <template slot="footer">
      <div v-if="enableUpload">
        <a-button type="primary"
                  @click="handleOk">创建</a-button>
      </div>
      <div v-else>
        <a-button @click="handleCancel">关闭</a-button>
      </div>
    </template>

  </a-modal>
</template>

<script>
  import { postAction } from '@/api/manage'
  import { axios } from '@/utils/request'
  import { mapGetters } from 'vuex'
  import { ListMixin } from '@/mixins/ListMixin'

  export default {
    name: 'CreatePowerGridDataWindow',
    mixins: [ListMixin],
    components: {

    },
    data() {
      return {
        title: '新建电网数据',
        visible: false,
        taskType: 2,
        planYear: 2022,
        planMode: 0,        // 创建规划数据方式
        dataType: 0,        // 0-运行；1-规划
        baseCapacity: 0,
        labelCol: { xs: { span: 24 }, sm: { span: 5 } },
        wrapperCol: { xs: { span: 24 }, sm: { span: 16 } },
        form: this.$form.createForm(this),
        reqParams: {},
        uploadPosInfo: {},       // 上传文件本地暂存的数据
        takeUserId: null,               // 认领任务的用户id
        // taskStatus: 2,                  // 任务状态
        confirmLoading: false,
        disableMixinCreated: true,      // 本组件初始化时不进行数据请求（弹窗被联合仿真页面加载初始化时）
        // 表头
        columns: [
          {
            title: '序号',
            dataIndex: '',
            key: 'rowIndex',
            width: 60,
            align: 'center',
            customRender: function (t, r, index) {
              return parseInt(index) + 1
            },
          },
          {
            title: '文件说明',
            align: 'center',
            dataIndex: 'fileDesc',
          },
          {
            title: '文件名称',
            dataIndex: 'fileName',
            scopedSlots: { customRender: 'file' },
            align: 'center',
          },
          {
            title: '操作',
            dataIndex: 'action',
            scopedSlots: { customRender: 'action' },
            align: 'center',
            width: 170,
          },
        ],
        fileConfigs: {  // 每种类型的任务需要哪些文件
          2: [
            {
              'id': 1,
              'fileId': '',
              'fileName': '',
              'fileDesc': 'DAT文件',
              'fileSuffix': 'dat',
            },
            {
              'id': 2,
              'fileId': '',
              'fileName': '',
              'fileDesc': 'SWI文件',
              'fileSuffix': 'swi',
            }
          ],
          6: [
            {
              'id': 1,
              'fileId': '',
              'fileName': '',
              'fileDesc': 'DAT文件',
              'fileSuffix': 'dat',
            },
          ],
          9: [
            {
              'id': 1,
              'fileId': '',
              'fileName': '',
              'fileDesc': 'BSE文件',
              'fileSuffix': 'bse',
            },
          ],
        },
        url: {
          // list: '/v1/simulation/joint/outfile.g',
          // download: '/v1/simulation/joint/download.g',
          uploadFile: '/v1/outerGrid/upload.g',
          createTask: '/v1/outerGrid/insert.g',
        },
      }
    },
    computed: {
      // ...mapGetters(['userInfo','teamInfo']),
      isAllFileUploaded: function () {  // 查看是否还有未上传的文件（true-所有文件都上传完毕;false-仍有未完成上传的文件）
        let unUpload = false
        this.dataSource.some(item => {
          if (item.fileName == null || item.fileName == undefined || item.fileName.length === 0) {
            unUpload = true       // 该文件未上传
            return true       // 跳出数组循环
          }
        })
        return !unUpload
      },
      // // 是否是认领任务的用户
      // isCurrentUser: function () {
      //   return this.takeUserId == this.userInfo.id
      // },
      // // 该任务是否已完成
      // isTaskFinished: function () {
      //   return this.taskStatus === 2
      // },
      // 是否允许上传文件(是认领任务的用户且任务未完成时允许上传)
      enableUpload: function () {
        // return (this.isCurrentUser && !this.isTaskFinished)
        return true
      },
    },
    created() {},
    mounted() {
      this.selectChanged(this.taskType)
    },
    methods: {
      // loadData() {
      //   if (!this.url.list) {
      //     this.$message.error('请设置url.list属性!')
      //     return
      //   }
      //
      //   this.loading = true
      //   getAction(this.url.list, this.reqParams).then((res) => {
      //     if (res.success) {
      //       let data = this.formatListData(res.result)
      //       this.dataSource = data
      //     } else {
      //       this.$message.error(`${res.message}`)
      //     }
      //     this.loading = false
      //   }).catch(err => {
      //     this.$message.error(`${err}`)
      //   })
      // },
      open() {
        this.visible = true
        // this.takeUserId = record.takeUserId         // 当前任务被哪个用户认领了
        // this.taskStatus = record.taskStatus         // 当前任务状态
        // this.reqParams = {
        //   id: record.id,
        // }
        // this.uploadParams = {     // 上传文件接口使用的参数
        //   id: record.id,
        // }
        // this.loadData()
      },
      selectChanged(value) {
        this.dataSource = this.fileConfigs[value]
      },
      planYearChange(event) {
        this.planYear = event.target.value
      },
      planModeChange(value) {
        this.planMode = value
      },
      close() {
        this.$emit('close')
        this.visible = false
      },
      handleOk() {
        if (!this.isAllFileUploaded) {    // 完成成功前需要检查文件是否都上传完毕了
          this.$message.error(`仍有文件未完成上传，无法完成任务`)
          return
        }

        this.loading = true

        let params = {
          id: this.getIdWithTaskType(this.taskType),
          tasktype: this.taskType,
        }

        if (this.dataType === '运行') {    // 运行数据
          // this.reqParams['datatype'] = this.dataType
          // this.reqParams['sbase'] = this.baseCapacity
        } else {
          this.reqParams['planyear'] = this.planYear
          this.reqParams['planmode'] = this.planMode
        }

        params = Object.assign(params, this.reqParams)

        postAction(this.url.createTask, params).then(res => {
          if (res.code === 0) {
            if (res.data === true) {
              // this.$emit('addAnData', {taskId: this.reqParams.id, userId: this.takeUserId})
              this.$emit('addAnData')
            }
            this.loading = false
            this.visible = false
          } else {
            this.$message.error(`${res.message}`)
          }
        }).catch(err => {
          this.$message.error(`${err}`)
        })

      },
      handleCancel() {
        this.close()
      },
      // formatListData(response) {
      //   let result = []
      //   if (response.length) {
      //     response.forEach(resp => {
      //       let row = {}
      //       row['fileName'] = resp.filename           // 文件名
      //       row['fileId'] = resp.fileid               // 文件上传接口使用的参数
      //       row['filePath'] = resp.filepath           // 文件下载接口使用的参数
      //       row['fileDesc'] = resp.filedesc           // 文件描述信息
      //       row['fileSuffix'] = resp.filetype.toLowerCase()    // 文件扩展名
      //       result.push(row)
      //     })
      //   }
      //   return result
      // },
      // 获取当前任务类型所有已上传的文件名称
      // getAllFilesName(type) {
      //   let result = []
      //   this.fileConfigs[type].forEach(item => {
      //     if (item.fileName.length) {
      //       result.push(item.fileName)
      //     }
      //   })
      //   return result
      // },
      getIdWithTaskType(type) {
        let result = ''
        this.fileConfigs[type].some(item => {
          if (item.fileId) {
            result = item.fileId
            return true
          }
        })
        return result
      },
      // 通过文件名获取文件扩展名
      getFileSuffixFrom(fileName) {
        let nameParts = fileName.split('.')
        if (nameParts.length > 1) {
          let suffixStr = nameParts[1]
          if (suffixStr.indexOf(')') === -1) {
            return suffixStr        // 无需处理末尾的括号直接返回
          } else {
            return suffixStr = suffixStr.substring(0, suffixStr.length - 1)     // 需要去掉末尾的括号
          }
        }
        return ''
      },
      // 文件上传前的钩子（file-系统弹窗选择的文件信息；record-table该行数据项）
      beforeUpload(file, record) {
        let fileSuffix = this.getFileSuffixFrom(file.name).toLowerCase()
        const isRightType = fileSuffix === record.fileSuffix      // 比较用户当前选择的文件扩展名是否与本行要求的文件扩展名一致
        if (!isRightType) {
          this.$message.error(`上传文件格式错误，需要上传${record.fileSuffix}格式的文件`);
        }
        this.uploadPosInfo = Object.assign(this.uploadPosInfo, {
          id: record.id,
        })   // 记录当前哪个位置在上传（为了将接口返回的文件名记录在正确的位置）
        return isRightType
      },
      // 文件上传过程中的回调
      handleUploadFileChange(info, record) {
        if (info.file.status !== 'uploading') {
          console.log(info.file, info.fileList)
        }
        if (info.file.status === 'done') {
          this.$message.success(`${info.file.name} 文件上传成功`)    // 展示用户本地所选择的文件名
          // this.loadData()         // 重新刷新本页数据（主要为了获取刚上传的文件的下载路径）
        } else if (info.file.status === 'error') {
          this.$message.error(`${info.file.name} 文件上传失败`)   // 展示用户本地所选择的文件名
        }
      },
      // 自定义上传，不通过action属性
      customRequest(file) {
        // 后端需要接受的参数是formData数据，
        const form = new FormData()
        form.append('file', file.file)
        // Object.keys(this.uploadParams).forEach(key => {
        //   form.append(key, this.uploadParams[key])
        // })
        
        this.uploadFile(form).then(res => {
          if (res.code === 0) {
            this.fileConfigs[this.taskType].some(item => {
              if (item.id === this.uploadPosInfo['id']) {
                item.fileId = res.data.id
                item.fileName = file.file.name
                this.dataType = res.data.eqtype === 1 ? '规划' : '运行'
                this.baseCapacity = res.data.sbase
                return true
              }
            })
            // to do 根据接口返回的数据更新数据类型和基准容量

            // 调用组件内方法（回调至this.handleUploadFileChange）, 设置为成功状态
            file.onSuccess(res, file.file)
            file.status = 'done'
          } else {
            file.onError()
            file.status = 'error'
          }
        })
      },
      // 设置好请求头
      uploadFile(params) {
        return axios({
          url: this.url.uploadFile,
          method: 'post',
          headers: { 'Content-Type': 'multipart/form-data' },
          data: params
        })
      },
    },
  }
</script>

<style lang="less" scoped>
  .search-div {
    display: flex;
    align-items: stretch;
    margin-bottom: 10px;
  }
  /deep/ .search-form {
    flex: 1;
    .ant-form-item {
      margin-bottom: 10px;

      &:last-child {
        margin-bottom: 0;
      }
    }
  }
  .search-btn {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    margin-left: 15px;
  }

  /deep/ .ant-table-body {
    margin-bottom: 25px;
  }
</style>