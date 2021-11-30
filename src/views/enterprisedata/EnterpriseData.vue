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

        <!--          <template slot="taskStatus" slot-scope="text, record, index">-->
        <!--            <span :style="{'color': taskStatusStrColor(record.taskStatus), 'font-weight': 'bold'}">-->
        <!--              {{record.taskStatusStr}}-->
        <!--            </span>-->
        <!--          </template>-->

        <template slot="fileName" slot-scope="text, record, index">
          <a @click="showFileTextModal(record)">{{record.fileName}}</a>
        </template>

        <template slot="pointNum" slot-scope="text, record, index">
          <a @click="showPointInfoModal(record)">{{record.pointNum}}</a>
        </template>

        <template slot="nodeNum" slot-scope="text, record, index">
          <a @click="showNodeInfoModal(record)">{{record.nodeNum}}</a>
        </template>

        <template slot="netFileName" slot-scope="text, record, index">
          <a @click="showNetFileModal(record)">{{record.netFileName}}</a>
        </template>

        <template slot="otherDataFile" slot-scope="text, record, index">
          <a @click="showOtherDataFileModal(record)">共{{record.otherDataFile}}个文件</a>
        </template>

        <template slot="resultFile" slot-scope="text, record, index">
          <a @click="showResultFileModal(record)">共{{record.resultFile}}个文件</a>
        </template>

        <template slot="calculation" slot-scope="text, record, index">
          <a-button type="primary" @click="calcActionInvoked(record)">计算</a-button>
        </template>

        <template slot="otherNetFile" slot-scope="text, record, index">
          <a @click="showOtherNetFileModal(record)">共{{record.otherNetFile}}个文件</a>
        </template>

        <!--          <template slot="requirement" slot-scope="text, record, index">-->
        <!--            <a-tooltip trigger="click">-->
        <!--              <template slot="title">-->
        <!--                {{record.dataTooltip}}-->
        <!--              </template>-->
        <!--              <a>{{record.dataRequirement}}</a>-->
        <!--            </a-tooltip>-->
        <!--          </template>-->

      </a-table>
    </a-card>

    <create-enterprise-data-modal ref="createEnterpriseDataModal"
                                  @addAnData="userAddAnEnterpriseData" />
    <editor-text-modal ref="editorTextModal"
                       :dat-type="0" />
    <insert-point-modal ref="insertPointModal" />
    <other-data-files-modal ref="otherDataFilesModal" />

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
  import InsertPointModal from "@/views/enterprisedata/SubModal/InsertPointModal";
  import OtherDataFilesModal from "@/views/enterprisedata/SubModal/OtherDataFilesModal";

  export default {
    description: '这是企业数据页面',
    name: "EnterpriseData",     // 企业数据页面
    mixins: [ListMixin],
    components: {
      HeaderView,
      CreateEnterpriseDataModal,
      EditorTextModal,
      InsertPointModal,
      OtherDataFilesModal,
    },
    data() {
      return {
        title: '企业数据',
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
            title: '所属企业',
            align: 'center',
            width: 100,
            dataIndex: 'enterprise',
          },
          {
            title: '所属用户',
            align: 'center',
            width: 150,
            dataIndex: 'userName',
            // ellipsis: true,                 // 超过宽度省略显示
          },
          {
            title: '任务类型',
            align: 'center',
            width: 180,
            dataIndex: 'taskType',
          },
          {
            title: '电网数据类型',
            align: 'center',
            width: 150,
            dataIndex: 'dataType',
          },
          {
            title: '电网数据时间',
            align: 'center',
            width: 150,
            dataIndex: 'dataTime',
          },
          {
            title: '电网规划数据年',
            align: 'center',
            width: 120,
            dataIndex: 'plan',
          },
          {
            title: '电网规划数据方式',
            align: 'center',
            width: 150,
            dataIndex: 'planDataType',
          },
          {
            title: '接入点数',
            align: 'center',
            width: 120,
            dataIndex: 'pointNum',
            scopedSlots: { customRender: 'pointNum' },
          },
          {
            title: '接收时间',
            align: 'center',
            width: 150,
            dataIndex: 'receiveTime',
          },
          {
            title: '节点数',
            align: 'center',
            width: 120,
            dataIndex: 'nodeNum',
            scopedSlots: { customRender: 'nodeNum' },
          },
          {
            title: '电网数据文件编号',
            align: 'center',
            width: 150,
            dataIndex: 'dataFileNo',
          },
          {
            title: '电网文件名称',
            align: 'center',
            width: 120,
            dataIndex: 'netFileName',
            scopedSlots: { customRender: 'netFileName' },
          },
          {
            title: '计算状态',
            align: 'center',
            width: 120,
            dataIndex: 'calcState',
          },
          {
            title: '完成时间',
            align: 'center',
            width: 150,
            dataIndex: 'finishTime',
          },
          {
            title: '其他数据文件',
            align: 'center',
            width: 120,
            dataIndex: 'otherDataFile',
            scopedSlots: { customRender: 'otherDataFile' },
          },
          {
            title: '计算结果文件',
            align: 'center',
            width: 120,
            dataIndex: 'resultFile',
            scopedSlots: { customRender: 'resultFile' },
          },
          {
            title: '计算',
            align: 'center',
            width: 120,
            dataIndex: 'calculation',
            scopedSlots: { customRender: 'calculation' },
          },
          {
            title: '其他电网数据文件',
            align: 'center',
            width: 150,
            dataIndex: 'otherNetFile',
            scopedSlots: { customRender: 'otherNetFile' },
          },
        ],
        url: {
          list: '/v1/enterGrid/select.g',
          calc: '/v1/simulation/compute.g',
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
        postAction(this.url.list, params).then((res) => {
          if (res.code === 0) {
            let data = this.formatEnterpriseListData(res.data.records)
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
        // this.dataSource = this.formatEnterpriseListData(testData)
        // this.ipagination.total = 1
        // 测试代码结束
      },
      addOne() {
        // 新增按钮动作
        this.$refs.createEnterpriseDataModal.open()
      },
      showFileTextModal(record) {
        this.$refs.editorTextModal.open(record)
      },
      showPointInfoModal(record) {
        this.$refs.insertPointModal.open(record)
      },
      showNodeInfoModal(record) {
        this.$router.push({ name:'EnterpriseNode', params: { 'fileid': record.id } })
      },
      showNetFileModal(record) {
        this.$refs.editorTextModal.open(record)
      },
      showOtherDataFileModal(record) {
        this.$refs.otherDataFilesModal.open(record, 1)
      },
      showResultFileModal(record) {
        this.$refs.otherDataFilesModal.open(record, 2)
      },
      calcActionInvoked(record) {
        // to do 根据当前用户是否允许自动计算的状态决定本列是否允许操作
        // 触发计算动作api接口
        let params = {
          'id': record.id,
        }
        console.log(params)
        postAction(this.url.calc, params).then((res) => {
          if (res.status === 1) {
            this.$message.success(`${res.msg}`)
          } else {
            this.$message.error(`${res.msg}`)
          }
        }).catch(err => {
          this.$message.error(`${err}`)
        })
      },
      showOtherNetFileModal(record) {
        this.$refs.otherDataFilesModal.open(record, 3)
      },
      // 创建一条企业数据弹窗的回调
      userAddAnEnterpriseData(values) {
        this.loadData(this.ipagination.current)         // 刷新主table当前页
      },
      // 企业数据 - 主表格获取数据组装
      formatEnterpriseListData(response) {
        let result = []
        if (response.length) {
          response.forEach(resp => {
            let rowObj = {}     // 每行对应的数据结构
            rowObj['id'] = resp.id                        // 该行对应结果的唯一id（计算结果这类子弹窗请求所需要的数据）
            rowObj['fileName'] = resp.name            // 文件名称
            rowObj['baseCapacity'] = resp.sbase         // 基准容量
            rowObj['enterprise'] = resp.enterprise        // 所属企业
            rowObj['userName'] = resp.user            // 所属用户
            rowObj['theProject'] = resp.theproject    // 所属工程
            rowObj['theJob'] = resp.thejob            // 所属作业
            rowObj['theTask'] = resp.thetask          // 所属任务
            rowObj['taskType'] = this.formatTaskTypeStr(resp.tasktype)        // 任务类型
            rowObj['dataType'] = this.formatDataTypeStr(resp.eqtype)          // 电网数据类型
            rowObj['dataTime'] = this.formatTableTimeStr(resp.opertime)      // 电网数据时间
            rowObj['plan'] = resp.planyear                  // 电网规划数据年
            rowObj['planDataType'] = this.formatPlanDataTypeStr(resp.planmode)    // 电网规划数据方式
            rowObj['pointNum'] = resp.intercount   // 接入点数
            rowObj['receiveTime'] = this.formatTableTimeStr(resp.rcvtime, '未接收')       // 接收时间
            rowObj['nodeNum'] = resp.enternodes              // 节点数
            rowObj['dataFileNo'] = resp.dataFileNo           // 电网数据文件编号
            rowObj['netFileName'] = resp.netFileName       // 电网文件名称
            rowObj['calcState'] = this.formatCalcStatusStr(resp.calstas)            // 计算状态
            rowObj['finishTime'] = this.formatTableTimeStr(resp.endtime, '未完成')   // 完成时间
            rowObj['otherDataFile'] = resp.otherfiles         // 其他数据文件
            rowObj['resultFile'] = resp.resultfiles         // 计算结果文件
            rowObj['action'] = 'actionSlot'
            rowObj['otherNetFile'] = resp.enterfiles    // 其他电网数据文件
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
      // 主表格任务类型显示格式化
      formatTaskTypeStr(taskType) {
        switch (taskType) {
          case 2:
            return '潮流计算'
          case 6:
            return '短路电流计算'
          case 9:
            return '暂态故障仿真'
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
      // 主表格计算状态显示格式化
      formatCalcStatusStr(taskType) {
        switch (taskType) {
          case 0:
            return '计算状态0'
          case 1:
            return '计算状态1'
          case 2:
            return '计算状态2'
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