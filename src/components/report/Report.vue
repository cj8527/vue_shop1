<template>
  <div>
   <el-breadcrumb separator-class="el-icon-arrow-right">
  <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
  <el-breadcrumb-item>权限管理</el-breadcrumb-item>
  <el-breadcrumb-item>权限列表</el-breadcrumb-item>
</el-breadcrumb>
<el-card class="box-card">
  <div id="main" style="width: 750px;height:400px;"></div>
</el-card>
  </div>
</template>
<script>
import echarts from 'echarts'
import _ from 'lodash'
export default {
  data () {
    return {
      options: {
        title: {
          text: '用户来源'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#E9EEF3'
            }
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            boundaryGap: false
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ]
      }
    }
},
created () {
},
 async mounted () {
  var myChart = echarts.init(document.getElementById('main')) // eslint-disable-line no-unused-vars
const { data: res } = await this.$http.get('reports/type/1')
     if (res.meta.status !== 200) {
          return this.$message.error('更新失败！')
     }

   const result = _.merge(res.data, this.options)
  //  var option = {
  //           title: {
  //               text: 'ECharts 入门示例'
  //           },
  //           tooltip: {},
  //           legend: {
  //               data: ['销量']
  //           },
  //           xAxis: {
  //               data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
  //           },
  //           yAxis: {},
  //           series: [{
  //               name: '销量',
  //               type: 'bar',
  //               data: [5, 20, 36, 10, 10, 20]
  //           }]
  //  }
   myChart.setOption(result)
},

methods: {
}
}
</script>
<style lang="less">
</style>
