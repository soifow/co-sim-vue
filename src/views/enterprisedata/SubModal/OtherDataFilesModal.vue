<template>
<!--  okText="提交计算"-->
  <a-modal
    :title="title"
    :width="1000"
    :visible="visible"
    :confirmLoading="confirmLoading"
    :destroyOnClose="true"
    @ok="handleOk"
    @cancel="handleCancel"
    cancelText="关闭"
  >
    <a-spin :spinning="confirmLoading">
      <!-- table区域-begin -->
      <div>
        <a-table
          size="middle"
          bordered
          rowKey="filename"
          :columns="columns"
          :dataSource="dataSource"
          :pagination="false"
          :loading="loading"
        >

          <span v-if="record.fileType === 'pfe'" slot="action" slot-scope="text, record">
            <a :href="`${url.download}?filepath=${record.filePath}`">下载</a>
            <a-divider type="vertical" />
            <a @click="handleExtract(record)">提取</a>
            <a-divider type="vertical" />
            <a @click="handleSend(record)">发送</a>
          </span>
          <span v-else slot="action" slot-scope="text, record">
            <a :href="`${url.download}?filepath=${record.filePath}`">下载</a>
          </span>

        </a-table>
      </div>
      <!-- table区域-end -->
    </a-spin>
  </a-modal>
</template>

<script>
  import { postAction } from '@/api/manage'
  // import pick from 'lodash.pick'
  import { mapGetters } from 'vuex'
  import { ListMixin } from '@/mixins/ListMixin'

  // 表头
  let otherColumns = [
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
      title: '文件名称',
      align: 'center',
      dataIndex: 'fileName',
    },
    {
      title: '操作',
      dataIndex: 'action',
      scopedSlots: { customRender: 'action' },
      align: 'center',
      width: 170,
    },
  ]

  let resultColumns = [
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
      align: 'center',
      dataIndex: 'fileName',
    },
    {
      title: '操作',
      dataIndex: 'action',
      scopedSlots: { customRender: 'action' },
      align: 'center',
      width: 170,
    },
  ]

  let powerColumns = [
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
      title: '文件名称',
      align: 'center',
      dataIndex: 'fileName',
    },
    {
      title: '操作',
      dataIndex: 'action',
      scopedSlots: { customRender: 'action' },
      align: 'center',
      width: 170,
    },
  ]

  export default {
    name: 'OtherDataFilesWindow',
    mixins: [ListMixin],
    components: {

    },
    data() {
      return {
        title: this.getModalTitle(this.modalType),
        modalType: 0,   // 弹窗类型
        visible: false,
        labelCol: { xs: { span: 24 }, sm: { span: 5 } },
        wrapperCol: { xs: { span: 24 }, sm: { span: 16 } },
        reqParams: {},
        confirmLoading: false,
        disableMixinCreated: true,      // 本组件初始化时不进行数据请求（弹窗被联合仿真页面加载初始化时）
        columns: this.getModalColumns(this.modalType),
        url: {
          list: '/v1/enterGrid/otherFind.g',
          download: '/v1/simulation/joint/download.g',
        },
      }
    },
    computed: {
      ...mapGetters(['userInfo','teamInfo']),
    },
    watch: {
      modalType: {   // 监听弹窗类型变化，对弹窗的标题、table列定义等进行动态修改（解决弹窗被主页加载后初始化信息延迟的问题）
        handler(newVal, oldVal) {
          this.title = this.getModalTitle(newVal)   // 更新标题
          this.columns = this.getModalColumns(newVal)   // 更新列定义
        },
        deep: true,
      }
    },
    created() {},
    methods: {
      loadData() {
        if (!this.url.list) {
          this.$message.error('请设置url.list属性!')
          return
        }

        this.loading = true
        postAction(this.url.list, this.reqParams).then((res) => {
          if (res.code === 0) {
            let data = this.formatListData(res.data)
            // let data = [
            //   {
            //     'fileDesc': 'pfe文件',
            //     'fileName': 'xxxx.pfe',
            //     'fileType': 'pfe',
            //     'filePath': '',
            //   },
            //   {
            //     'fileDesc': 'pfo文件',
            //     'fileName': 'xxxx.pfo',
            //     'fileType': 'pfo',
            //     'filePath': '',
            //   },
            //   {
            //     'fileDesc': 'bse文件',
            //     'fileName': 'xxxx.bse',
            //     'fileType': 'bse',
            //     'filePath': '',
            //   },
            // ]
            this.dataSource = data
          } else {
            this.$message.error(`${res.message}`)
          }

          this.loading = false
        }).catch(err => {
          this.$message.error(`${err}`)
        })
      },
      open(record, type) {
        this.modalType = type
        this.visible = true
        this.reqParams = {
          id: record.id,
          tasktype: type
        }
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
      formatListData(response) {
        let result = []
        if (response.length) {
          response.forEach(resp => {
            let row = {}
            row['fileDesc'] = resp.filedesc       // 文件描述
            row['fileName'] = resp.filename       // 文件名
            row['fileType'] = resp.filetype       // 文件类型
            row['filePath'] = resp.url            // 文件下载接口使用的参数
            result.push(row)
          })
        }
        return result
      },
      getModalTitle(modalType) {
        switch (modalType) {
          case 1:
            return '其他数据文件'
          case 2:
            return '计算结果文件'
          case 3:
            return '其他电网数据文件'
          default:
            return '标题'
        }
      },
      getModalColumns(modalType) {
        switch (modalType) {
          case 1:
            return otherColumns
            break
          case 2:
            return resultColumns
            break
          case 3:
            return powerColumns
            break
          default:
            return otherColumns
        }
      },
      // 提取按钮动作
      handleExtract(record) {
        console.log(`提取按钮${record}`)
      },
      // 发送按钮动作
      handleSend(record) {
        console.log(`发送按钮${record}`)
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
</style>