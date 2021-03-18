<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card >
        <el-row :gutter="40" >
  <el-col :span="8"><div >
    <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear='getUserList'>
    <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
  </el-input>
    </div></el-col>
  <el-col :span="4"><div>
    <el-button type="primary" @click="goAddpage"  >添加用户</el-button>
    </div></el-col>
</el-row>
<el-table :data="userlist" stripe border >
  <el-table-column type="index"></el-table-column>
  <el-table-column label="商品名称" prop="goods_name" ></el-table-column>
  <el-table-column label="商品价格" prop="goods_price" width="90px"></el-table-column>
 <el-table-column label="商品重量" prop="goods_weight" width="90px"></el-table-column>
 <el-table-column label="创建时间" prop="add_time" width="200px">
<template slot-scope="scope">
   {{scope.row.add_time | dateFormat}}
 </template>
 </el-table-column>
 <el-table-column label="操作" width="140px">
     <template  slot-scope="scope">
   <el-button type="primary" icon="el-icon-edit" @click="showEditDialog(scope.row.id)" size="mini">
   </el-button>
   <el-button type="danger" icon="el-icon-delete" @click="removeUserById(scope.row.goods_id)" size="mini"></el-button>
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
      :total="total"
      background="blue">
    </el-pagination>
</el-card>
  </div>
</template>
<script>
export default {
 data () {
   return {
     queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      userlist: [],
      total: 0
   }
 },
 created () {
   this.getUserList()
 },
 methods: {
      async getUserList () {
     const { data: res } = await this.$http.get('goods', { params: this.queryInfo })
     if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
     this.userlist = res.data.goods
     this.total = res.data.total
    },
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
       this.getUserList()
    },
    handleCurrentChange (newPage) {
      this.queryInfo.pagenum = newPage
     this.getUserList()
    },
    async  removeUserById (id) {
    const confirmRuselt = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)
        if (confirmRuselt !== 'confirm') {
          return this.$message.info('取消删除')
        }
        const { data: res } = await this.$http.delete('goods/' + id) // eslint-disable-line no-unused-vars
 if (res.meta.status !== 200) { return this.$message.error('删除用户失败！') }
 this.$message.success('删除用户成功！')
 this.getUserList()
  },
  goAddpage () {
    this.$router.push('/goods/add')
  }
 }
}
</script>
<style lang="less" scoped>
.el-col {
  margin-bottom: 15px;
}
</style>
