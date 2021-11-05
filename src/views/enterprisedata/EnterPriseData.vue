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
        <a-table
          ref="table"
          bordered
          size="middle"
          rowKey="userId"
          :columns="columns"
          :dataSource="dataSource"
          :pagination="ipagination"
          :loading="loading"
          :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
          @change="handleTableChange"
          :scroll="{ x: 1500 }"
        >

<!--          <template slot="taskStatus" slot-scope="text, record, index">-->
<!--            <span :style="{'color': taskStatusStrColor(record.taskStatus), 'font-weight': 'bold'}">-->
<!--              {{record.taskStatusStr}}-->
<!--            </span>-->
<!--          </template>-->

<!--          <template slot="address" slot-scope="text, record, index">-->
<!--            <a @click="showAccessBus(record)">{{record.station}}</a>-->
<!--          </template>-->

<!--          <template slot="requirement" slot-scope="text, record, index">-->
<!--            <a-tooltip trigger="click">-->
<!--              <template slot="title">-->
<!--                {{record.dataTooltip}}-->
<!--              </template>-->
<!--              <a>{{record.dataRequirement}}</a>-->
<!--            </a-tooltip>-->
<!--          </template>-->

<!--          <template slot="calcData" slot-scope="text, record, index">-->
<!--            <a @click="showCalcData(record)">共{{record.dataFiles}}个文件[.DAT]</a>-->
<!--          </template>-->

<!--          <template slot="calcResult" slot-scope="text, record, index">-->
<!--            <a @click="showCalcResult(record)">共{{record.resultFiles}}个文件[.BAT,.BSE]</a>-->
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
            title: '提交时间',
            align: 'center',
            width: 120,
            dataIndex: 'createTime',
          },
          {
            title: '任务类型',
            align: 'center',
            width: 100,
            dataIndex: 'taskType',
          },
          {
            title: '任务状态',
            align: 'center',
            width: 100,
            dataIndex: 'taskStatusStr',
            scopedSlots: { customRender: 'taskStatus' },
          },
          {
            title: '接入地点',
            align: 'center',
            width: 150,
            dataIndex: 'station',
            scopedSlots: { customRender: 'address' },
            ellipsis: true,                 // 超过宽度省略显示
          },
          {
            title: '数据要求',
            align: 'center',
            width: 180,
            dataIndex: 'dataRequirement',
            scopedSlots: { customRender: 'requirement' },
          },
          {
            title: '计算数据',
            align: 'center',
            width: 150,
            dataIndex: 'dataFiles',
            scopedSlots: { customRender: 'calcData' },
          },
          {
            title: '计算结果',
            align: 'center',
            width: 150,
            dataIndex: 'resultFiles',
            scopedSlots: { customRender: 'calcResult' },
          },
          {
            title: '认领时间',
            align: 'center',
            width: 120,
            dataIndex: 'claimTime',
          },
          {
            title: '返回时间',
            align: 'center',
            width: 120,
            dataIndex: 'returnTime',
          },
        ],
        url: {
          list: '/v1/simulation/joint/list.g',
        },
      }
    },
    computed: {
      ...mapGetters(['userInfo','teamInfo','projectInfo']),   // 从store中取值
      importExcelUrl: function () {
        return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`
      },
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
        params.companyId = this.companyId
        params.pageNum = params.pageNo
        params.sort = 'desc'
        params.theproject = this.projectInfo.uid    // 工程id
        params.pveruid = this.projectInfo.veruid    // 工程版本
        params.userid = this.userInfo.id            // 提交用户id
        this.loading = true
        console.log(params)
        getAction(this.url.list, params).then((res) => {
          if (res.success) {
            let data = this.formatCoSimAdminData(res.result.records)
            this.dataSource = data
            this.ipagination.total = res.result.total
          }
          if (res.code === 510) {
            this.$message.warning(res.message)
          }
          this.loading = false
        })
      },
      onChangeRangeDate(value, dateString) {
        this.queryParam.starttime = dateString[0]
        this.queryParam.endtime = dateString[1]
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
      showAccessBus(record) {
        this.$refs.accessBusWindow.open(record)
      },
      showCalcData(record) {
        this.$refs.calcDataWindow.open(record)
      },
      showCalcResult(record) {
        this.$refs.calcResultWindow.open(record)
      },
      // 联合仿真（企业管理员）主表格获取数据组装
      formatCoSimAdminData(response) {
        let result = []
        console.log(response)
        if (response.length) {
          response.forEach(resp => {
            let rowObj = {}     // 每行对应的数据结构
            rowObj['createTime'] = this.formatTableTimeStr(resp.committime, '未提交')       // 提交时间
            rowObj['projectId'] = resp.theproject         // 所属工程
            rowObj['gridId'] = resp.thegrid               // 外部电网id（接入地点子弹窗请求所需要的数据）
            rowObj['id'] = resp.id                        // 该行对应结果的唯一id（计算结果这类子弹窗请求所需要的数据）
            rowObj['taskType'] = this.formatTaskTypeStr(resp.tasktype)        // 任务类型
            rowObj['taskStatus'] = resp.taskstatus                  // 任务状态
            rowObj['taskStatusStr'] = this.formatTaskStatusStr(resp.taskstatus)  // 任务状态描述
            rowObj['station'] = resp.station              // 接入地点
            rowObj['dataRequirement'] = resp.datademand   // 数据要求
            rowObj['dataTooltip'] = resp.datadesc         // 数据要求列被点击后的toolTip中显示的内容
            rowObj['dataFiles'] = resp.calcdata           // 计算数据文件数量
            rowObj['resultFiles'] = resp.calcresult       // 计算结果文件数量
            rowObj['claimTime'] = this.formatTableTimeStr(resp.taketime, '未认领')           // 认领时间
            rowObj['returnTime'] = this.formatTableTimeStr(resp.backtime, '未返回')          // 返回时间
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
      // 主表格任务状态显示格式化
      formatTaskStatusStr(taskType) {
        switch (taskType) {
          case 0:
            return '未认领'
          case 1:
            return '认领计算中'
          case 2:
            return '结果已返回'
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