<template>
  <div>
      <el-breadcrumb separator-class="el-icon-arrow-right">
  <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
  <el-breadcrumb-item>权限管理</el-breadcrumb-item>
  <el-breadcrumb-item>权限列表</el-breadcrumb-item>
</el-breadcrumb>
<el-card >
        <el-row :gutter="40" >
  <el-col :span="8"><div >
    <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear='getUsersList'>
    <el-button slot="append" icon="el-icon-search" @click="getUsersList"></el-button>
  </el-input>
    </div></el-col>
</el-row>
<el-table :data="rightsList" stripe border >
  <el-table-column type="index"></el-table-column>
  <el-table-column label="订单编号" prop="order_number"></el-table-column>
  <el-table-column label="订单价格" prop="order_price"></el-table-column>
  <el-table-column label="是否付款" prop="pay_status">
    <template slot-scope="scope">
    <el-tag type="success" v-if="scope.row.pay_status === '1'">已付款</el-tag>
    <el-tag type="danger" v-if="scope.row.pay_status === '0' ">未付款</el-tag>
    </template>
  </el-table-column>
  <el-table-column label="是否发货" prop="is_send"></el-table-column>
  <el-table-column label="下单时间" prop="create_time">
    <template slot-scope="scope">
   {{scope.row.create_time | dateFormat}}
 </template>
  </el-table-column>
  <el-table-column label="操作" >
     <template  slot-scope="scope">
   <el-button size="mini" type="primary" icon="el-icon-edit" @click="showEditDialog(scope.row.id)" >
   </el-button>
   <el-button size="mini" type="danger" icon="el-icon-location" @click="showProgressBox(scope.row.id)"></el-button>
    </template>
  </el-table-column>
</el-table>
<el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[1, 2, 5, 10]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
</el-card>
<el-dialog
  title="修改地址"
  :visible.sync="editDialogVisible"
  width="50%"
  @close="addDialogClosed">
  <el-form :model="addressForm" rules="addresssFormRules" ref="addressFormRef" label-width="100px" >
  <el-form-item label="省市区/县" prop="address1" >
    <el-cascader
expand-trigger="hover"
    v-model="addressForm.address1"
    :options="cityData"
    clearable></el-cascader>
    </el-form-item>
    <el-form-item label="详细地址" prop="address2" >
    <el-input v-model="addressForm.address2"></el-input>
  </el-form-item>
  </el-form>
    <span slot="footer" class="dialog-footer">
    <el-button @click="editDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="editUserInfo">确 定</el-button>
  </span>
</el-dialog>
<el-dialog
  title="物流进度"
  :visible.sync="progressVisible"
  width="50%"
  @close="addDialogClosed">
 <el-timeline >
    <el-timeline-item
      v-for="(activity, index) in progressInfo"
      :key="index"
      :timestamp="activity.time">
      {{activity.context}}
    </el-timeline-item>
  </el-timeline>
</el-dialog>
  </div>
</template>
<script>
import cityData from './citydata.js'
export default {
  data () {
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      total: 0,
      rightsList: [],
      progressInfo: [],
      editDialogVisible: false,
      progressVisible: false,
      addressForm: {
           address1: [],
           address2: ''
      },
      cityData,
      addresssFormRules: {
        address1: [
           { required: true, message: '请输入名称', trigger: 'blur' },
            { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
   this.getUsersList()
  },
  methods: {
    async getUsersList () {
     const { data: res } = await this.$http.get('orders', { params: this.queryInfo })
     if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
     this.rightsList = res.data.goods
     console.log(this.rightsList)
     this.total = res.data.total
    },
        handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
       this.getUsersList()
    },
    handleCurrentChange (newPage) {
      this.queryInfo.pagenum = newPage
     this.getUsersList()
    },
    showEditDialog () {
      this.editDialogVisible = true
    },
  addDialogClosed () {
      this.$refs.addressFormRef.resetFields()
    },
   async showProgressBox () {
       this.progressVisible = true
            const { data: res } = await this.$http.get('kuaidi/1106975712662')
     if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
     this.progressInfo = res.data
     console.log(this.progressInfo)
    }
  }
}
</script>
<style lang="less" scoped>
.el-col {
  margin-bottom: 15px;
}
</style>
