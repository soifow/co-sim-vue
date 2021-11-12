<template>
  <a-modal
    :title="title"
    :width="1000"
    :ok="false"
    :visible="visible"
    :confirmLoading="confirmLoading"
    :footer="null"
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
          rowKey="rowIndex"
          :columns="columns"
          :dataSource="dataSource"
          :pagination="ipagination"
          :loading="loading"
        >
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

  export default {
    name: 'InsertPointWindow',
    mixins: [ListMixin],
    components: {

    },
    data() {
      return {
        title: '接入点数',
        fileId: 0,
        visible: false,
        labelCol: { xs: { span: 24 }, sm: { span: 5 } },
        wrapperCol: { xs: { span: 24 }, sm: { span: 16 } },
        reqParams: {},
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
            title: '企业接入点名称',
            align: 'center',
            dataIndex: 'enterprisePtName',
          },
          {
            title: '企业接入点电压',
            align: 'center',
            dataIndex: 'enterprisePtVoltage',
          },
          {
            title: '电网接入点名称',
            align: 'center',
            dataIndex: 'netPtName',
          },
          {
            title: '电网接入点电压',
            align: 'center',
            dataIndex: 'netPtVoltage',
          },
        ],
        url: {
          list: '/v1/enterGrid/dinFind.g',
        },
      }
    },
    computed: {
      ...mapGetters(['userInfo','teamInfo']),
    },
    created() {},
    methods: {
      loadData() {
        if (!this.url.list) {
          this.$message.error('请设置url.list属性!')
          return
        }
        //加载数据 若传入参数1则加载第一页的内容
        let params = this.getQueryParams()          // 查询条件
        params.id = this.fileId

        this.loading = true
        postAction(this.url.list, params).then((res) => {
          if (res.code === 0) {
            let data = this.formatListData(res.data)
            this.dataSource = data
          }

          this.loading = false
        })
      },
      open(record) {
        this.visible = true
        this.fileId = record.id
        this.loadData()
      },
      close() {
        this.$emit('close')
        this.visible = false
      },
      handleOk() {

      },
      handleCancel() {
        this.close()
      },
      formatListData(response) {
        let result = []
        if (response.length) {
          response.forEach(resp => {
            let row = {}
            // row['id'] = resp.id                         // update接口使用的
            row['enterprisePtName'] = resp.inname       // 企业接入点名称
            row['enterprisePtVoltage'] = resp.invbase   // 企业接入点电压
            row['netPtName'] = resp.outname             // 电网接入点名称
            row['netPtVoltage'] = resp.outvbase         // 电网接入点电压
            result.push(row)
          })
        }

        return result
      }
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