<template>
  <div>
    <!-- header -->
    <header-view :page-title="this.title"
                 :add-btn-enable="true"
                 @addOneBtnInvoked="addOne" />

    <a-card>
      <!--        :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"-->
      <a-table
        ref="table"
        bordered
        size="middle"
        rowKey="id"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        @change="handleTableChange"
        :scroll="{ x: 1500 }"
      >

        <template slot="fileName" slot-scope="text, record, index">
          <a @click="showFileTextModal(record)">{{record.fileName}}</a>
        </template>

        <!--          <template slot="pointNum" slot-scope="text, record, index">-->
        <!--            <a @click="showPointInfoModal(record)">{{record.pointNum}}</a>-->
        <!--          </template>-->

        <template slot="nodeNum" slot-scope="text, record, index">
          <a @click="showNodeInfoModal(record)">{{record.nodeNum}}</a>
        </template>

      </a-table>
    </a-card>

    <create-enterprise-data-modal ref="createEnterpriseDataModal"
                                  @addAnData="userAddAnEnterpriseData" />
    <editor-text-modal ref="editorTextModal" />

  </div>
</template>

<script>
  import { postAction } from '@/api/manage'
  import { ListMixin } from '@/mixins/ListMixin'
  import { mapGetters } from 'vuex'
  import { removePropertyOfNull } from "@/utils/util";
  import moment from "dayjs";

  import HeaderView from "@/views/header/HeaderView";
  import CreateEnterpriseDataModal from "@/views/enterprisedata/SubModal/CreateEnterpriseDataModal";
  import EditorTextModal from "@/views/common/EditorTextModal";

  export default {
    description: '这是电网数据页面',
    name: "PowerGridData",     // 电网数据页面
    mixins: [ListMixin],
    components: {
      HeaderView,
      CreateEnterpriseDataModal,
      EditorTextModal,
    },
    data() {
      return {
        title: '电网数据',
        dataSource:[],      // 表格数据源
        columns: [
          /*{
              title: '#',         // 列表头名
              dataIndex: '',      // 该列所展示的值对应dataSource中某一项中的哪个key
              key:'rowIndex',     // vue需求唯一
              width:60,           // 列宽，允许使用百分比
              align:"center",     // 内容对齐方式(左/中/右)
              ellipsis: true,     // 超过宽度将自动省略，暂不支持和排序筛选一起使用
              customRender:function (t,r,index) {   // 生成复杂数据的渲染函数，参数分别为当前行的值，当前行数据，行索引
                return parseInt(index)+1;
              }
            },*/
          {
            title: '数据文件编号',
            align: 'center',
            width: 150,
            dataIndex: 'id',
          },
          {
            title: '文件名称',
            align: 'center',
            width: 180,
            dataIndex: 'fileName',
            scopedSlots: { customRender: 'fileName' },
          },
          {
            title: '基准容量(MVA)',
            align: 'center',
            width: 150,
            dataIndex: 'baseCapacity',
          },
          {
            title: '所属工程',
            align: 'center',
            width: 100,
            dataIndex: 'project',
          },
          {
            title: '电网数据类型',
            align: 'center',
            width: 150,
            dataIndex: 'powerGridDataType',
            // ellipsis: true,                 // 超过宽度省略显示
          },
          {
            title: '运行数据时间',
            align: 'center',
            width: 180,
            dataIndex: 'runDataTime',
          },
          {
            title: '规划数据年份',
            align: 'center',
            width: 150,
            dataIndex: 'plan',
          },
          {
            title: '规划数据方式',
            align: 'center',
            width: 150,
            dataIndex: 'planDataType',
          },
          {
            title: '节点数',
            align: 'center',
            width: 120,
            dataIndex: 'nodeNum',
            scopedSlots: { customRender: 'nodeNum' },
          },
        ],
        url: {
          list: '/v1/enterGrid/select.g',
        },
      }
    },
    computed: {
      // ...mapGetters(['userInfo','teamInfo','projectInfo']),   // 从store中取值
      // importExcelUrl: function () {
      //   return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`
      // },
      taskStatusStrColor: function () {   // 无法直接给计算属性传参，需要用匿名函数实现，透传给匿名函数
        return function (taskStatus) {
          switch (taskStatus) {
            case 0:     // 未认领
              return '#f00'
            case 1:     // 计算中
              return '#dbc604'
            case 2:     // 返回
              return '#25cd25'
            default:
              return '#000'
          }
        }
      },
    },
    methods: {
      loadData(arg) {
        if (!this.url.list) {
          this.$message.error('请设置url.list属性!')
          return
        }
        //加载数据 若传入参数1则加载第一页的内容
        if (arg === 1) {
          this.ipagination.current = 1
        }
        let params = this.getQueryParams()          // 查询条件
        params.pageNum = params.pageNo
        // params.theproject = this.projectInfo.uid    // 工程id
        // params.pveruid = this.projectInfo.veruid    // 工程版本
        // params.userid = this.userInfo.id            // 提交用户id

        this.loading = true
        console.log(params)
        postAction(this.url.list, params).then((res) => {
          if (res.code === 0) {
            let data = this.formatPowerGridListData(res.data.records)
            this.dataSource = data
            this.ipagination.total = res.data.total
          }

          if (res.code < 0) {
            this.$message.warning(res.message)
          }
          this.loading = false
        })

        // 测试代码
        // let testData = [
        //   {
        //     'id': '0',
        //     'name': '文件名1',
        //     'sbase': 120,
        //     'enterprise': '企业名1',
        //     'user': '用户名1',
        //     'tasktype': 6,
        //     'eqtype': 1,
        //     'opertime': 1636338050734,
        //     'planyear': 2022,
        //     'planmode': 1,
        //     'intercount': 10,
        //     'rcvtime': 1636338070321,
        //     'nodeNum': 24,
        //     'dataFileNo': '4001',
        //     'netFileName': '电网文件名1',
        //     'calstas': 0,
        //     'endtime': 1636338081368,
        //     'otherDataFile': 2,
        //     'resultFile': 3,
        //     'otherNetFile': 5,
        //   },
        // ]
        // this.dataSource = this.formatPowerGridListData(testData)
        // this.ipagination.total = 1
        // 测试代码结束
      },
      addOne() {
        // 新增按钮动作
        console.log('新增一行数据的动作')
        this.$refs.createEnterpriseDataModal.open()
      },
      showFileTextModal(record) {
        this.$refs.editorTextModal.open(record)
      },
      // showPointInfoModal(record) {
      //   this.$refs.insertPointModal.open(record)
      // },
      showNodeInfoModal(record) {
        this.$router.push({ name:'PowerGridNode', params: { 'fileid': record.id } })
      },
      // 创建一条企业数据弹窗的回调
      userAddAnEnterpriseData(values) {
        this.loadData(this.ipagination.current)         // 刷新主table当前页
      },
      // 电网数据 - 主表格获取数据组装
      formatPowerGridListData(response) {
        let result = []
        console.log(response)
        if (response.length) {
          response.forEach(resp => {
            let rowObj = {}     // 每行对应的数据结构
            rowObj['id'] = resp.id                      // 该行对应结果的唯一id（计算结果这类子弹窗请求所需要的数据）
            rowObj['fileName'] = resp.name              // 文件名称
            rowObj['baseCapacity'] = resp.sbase         // 基准容量
            rowObj['project'] = resp.theproject         // 所属工程
            rowObj['powerGridDataType'] = this.formatDataTypeStr(resp.eqtype)       // 电网数据类型
            rowObj['runDataTime'] = this.formatTableTimeStr(resp.opertime)      // 运行数据时间
            rowObj['plan'] = resp.planyear                  // 规划数据年份
            rowObj['planDataType'] = this.formatPlanDataTypeStr(resp.planmode)    // 规划数据方式
            rowObj['nodeNum'] = resp.enternodes              // 节点数
            rowObj = removePropertyOfNull(rowObj)         // 删除无效key
            result.push(rowObj)
          })
        }

        return result
      },
      // 主表格时间显示格式化
      formatTableTimeStr(timeStamp, defaultDesc) {
        if (timeStamp > 0) {
          return moment(timeStamp).format('YYYY-MM-DD HH:mm:ss')
        }

        return defaultDesc
      },
      // 主表格电网数据类型显示格式化
      formatDataTypeStr(taskType) {
        switch (taskType) {
          case 0:
            return '运行'
          case 1:
            return '规划'
          default:
            return taskType + ''
        }
      },
      // 主表格电网规划数据方式显示格式化
      formatPlanDataTypeStr(taskType) {
        switch (taskType) {
          case 0:
            return '大方式'
          case 1:
            return '小方式'
          case 2:
            return '其他方式'
          default:
            return taskType + ''
        }
      },
    },
  }
</script>

<style scoped>
  @import '~@assets/less/common.less';
</style>