<template>
  <div>
    <!-- header -->
    <a-row :gutter="24">
      <a-col :span="6">
        icon
      </a-col>
      <a-col :span="6">
        企业数据
      </a-col>
      <a-col :span="6">
        <a-button type="primary" @click="addOne">新增</a-button>
      </a-col>
      <a-col :span="6">
        用户菜单
      </a-col>
    </a-row>

    <a-row>
      <a-col :span="24">
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
            <a @click="showOtherDataFileModal(record)">{{record.otherDataFile}}</a>
          </template>

          <template slot="resultFile" slot-scope="text, record, index">
            <a @click="showResultFileModal(record)">{{record.resultFile}}</a>
          </template>

          <template slot="calculation" slot-scope="text, record, index">
<!--            <a @click="showResultFileModal(record)">{{record.resultFile}}</a>-->
            <a-button type="primary" @click="calcActionInvoked(record)">计算</a-button>
          </template>

          <template slot="otherNetFile" slot-scope="text, record, index">
            <a @click="showOtherNetFileModal(record)">{{record.otherNetFile}}</a>
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
      </a-col>
    </a-row>
  </div>
</template>

<script>
  import { getAction } from '@/api/manage'
  import { ListMixin } from '@/mixins/ListMixin'
  import { mapGetters } from 'vuex'
  import { removePropertyOfNull } from "@/utils/util";
  import moment from "dayjs";

  export default {
    description: '这是企业数据页面',
    name: "EnterPriseData",     // 企业数据页面
    mixins: [ListMixin],
    components: {

    },
    data() {
      return {
        dataSource:[],    // 表格数据源

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
            width: 120,
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
          list: '/v1/simulation/joint/list.g',
        },
      }
    },
    computed: {
      ...mapGetters(['userInfo','teamInfo','projectInfo']),   // 从store中取值
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
        console.log('in loadData from enterPriseData.vue')
        if (!this.url.list) {
          this.$message.error('请设置url.list属性!')
          return
        }
        //加载数据 若传入参数1则加载第一页的内容
        if (arg === 1) {
          this.ipagination.current = 1
        }
        // let params = this.getQueryParams()          // 查询条件
        // params.companyId = this.companyId
        // params.pageNum = params.pageNo
        // params.sort = 'desc'
        // params.theproject = this.projectInfo.uid    // 工程id
        // params.pveruid = this.projectInfo.veruid    // 工程版本
        // params.userid = this.userInfo.id            // 提交用户id

        // this.loading = true
        // console.log(params)
        // getAction(this.url.list, params).then((res) => {
        //   if (res.success) {
        //     let data = this.formatEnterpriseListData(res.result.records)
        //     this.dataSource = data
        //     this.ipagination.total = res.result.total
        //   }
        //   if (res.code === 510) {
        //     this.$message.warning(res.message)
        //   }
        //   this.loading = false
        // })

        // 测试代码
        let testData = [
          {
            'id': '0',
            'fileName': '文件名1',
            'baseCapacity': 120,
            'enterprise': '企业名1',
            'userName': '用户名1',
            'taskType': 6,
            'dataType': 1,
            'dataTime': 1636338050734,
            'plan': 2022,
            'planDataType': 1,
            'pointNum': 10,
            'receiveTime': 1636338070321,
            'nodeNum': 24,
            'dataFileNo': '4001',
            'netFileName': '电网文件名1',
            'calcState': 0,
            'finishTime': 1636338081368,
            'otherDataFile': 2,
            'resultFile': 3,
            'otherNetFile': 5,
          },
        ]
        this.dataSource = this.formatEnterpriseListData(testData)
        this.ipagination.total = 1
        // 测试代码结束
      },
      // handleMenuClick(e) {
      //   if (e.key == 1) {
      //     this.batchDel()
      //   } else if (e.key == 2) {
      //     this.batchFrozen(2)
      //   } else if (e.key == 3) {
      //     this.batchFrozen(1)
      //   }
      // },
      addOne() {
        // 新增按钮动作
        console.log('新增一行数据的动作')
      },
      showFileTextModal(record) {
        // this.$refs.accessBusWindow.open(record)
      },
      showPointInfoModal(record) {
        // this.$refs.calcDataWindow.open(record)
      },
      showNodeInfoModal(record) {
        // this.$refs.calcResultWindow.open(record)
      },
      showNetFileModal(record) {
        // this.$refs.calcResultWindow.open(record)
      },
      showOtherDataFileModal(record) {
        // this.$refs.calcResultWindow.open(record)
      },
      showResultFileModal(record) {
        // this.$refs.calcResultWindow.open(record)
      },
      calcActionInvoked(record) {
        // 触发计算动作api接口
      },
      showOtherNetFileModal(record) {
        // this.$refs.calcResultWindow.open(record)
      },
      // 企业数据 - 主表格获取数据组装
      formatEnterpriseListData(response) {
        let result = []
        console.log(response)
        if (response.length) {
          response.forEach(resp => {
            let rowObj = {}     // 每行对应的数据结构
            rowObj['id'] = resp.id                        // 该行对应结果的唯一id（计算结果这类子弹窗请求所需要的数据）
            rowObj['fileName'] = resp.fileName            // 文件名称
            rowObj['baseCapacity'] = resp.baseCapacity         // 基准容量
            rowObj['enterprise'] = resp.enterprise        // 所属企业
            rowObj['userName'] = resp.userName            // 所属用户
            rowObj['taskType'] = this.formatTaskTypeStr(resp.taskType)        // 任务类型
            rowObj['dataType'] = resp.dataType          // 电网数据类型
            rowObj['dataTime'] = this.formatTableTimeStr(resp.dataTime)      // 电网数据时间
            rowObj['plan'] = resp.plan                  // 电网规划数据年
            rowObj['planDataType'] = resp.planDataType              // 电网规划数据方式
            rowObj['pointNum'] = resp.pointNum   // 接入点数
            rowObj['receiveTime'] = this.formatTableTimeStr(resp.receiveTime, '未接收')       // 接收时间
            rowObj['nodeNum'] = resp.nodeNum              // 节点数
            rowObj['dataFileNo'] = resp.dataFileNo           // 电网数据文件编号
            rowObj['netFileName'] = resp.netFileName       // 电网文件名称
            rowObj['calcState'] = this.formatCalcStatusStr(resp.calcState)            // 计算状态
            rowObj['finishTime'] = this.formatTableTimeStr(resp.finishTime, '未完成')   // 完成时间
            rowObj['otherDataFile'] = resp.otherDataFile         // 其他数据文件
            rowObj['resultFile'] = resp.resultFile         // 计算结果文件
            rowObj['action'] = 'actionSlot'
            rowObj['otherNetFile'] = resp.otherNetFile    // 其他电网数据文件
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