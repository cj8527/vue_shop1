<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary"
                     @click="showAddDialogVisible">添加分类</el-button>
        </el-col>
      </el-row>
      <tree-table :data="rightsList"
                  :columns="columns"
                  :selection-type='false'
                  :expand-type='false'
                  show-index
                  index-text='#'
                  border
                  :show-row-hover='false'>
        <template slot="isok"
                  slot-scope="scope">
          <i class="el-icon-success"
             v-if="scope.row.cat_deleted === false"
             style="color: lightgreen"></i>
          <i class="el-icon-error"
             v-else
             style="color: red"></i>
        </template>
        <template slot="order"
                  slot-scope="scope">
          <el-tag v-if="scope.row.cat_level === 0"
                  size="mini">一级</el-tag>
          <el-tag v-if="scope.row.cat_level === 1"
                  type="success"
                  size="mini">二级</el-tag>
          <el-tag v-if="scope.row.cat_level === 2"
                  type="warning"
                  size="mini">三级</el-tag>
        </template>
        <template slot="opt"
                  slot-scope="scope">
          <el-button type="primary"
                     icon="el-icon-edit"
                     @click="showSetRightDialog(scope.row.cat_id)"
                     size="mini"> 编辑
          </el-button>
          <el-button type="danger"
                     icon="el-icon-delete"
                     size="mini"
                      @click="removeUserById(scope.row.cat_id)">删除</el-button>
        </template>
      </tree-table>
      <el-pagination @size-change="handleSizeChange"
                     @current-change="handleCurrentChange"
                     :current-page="queryInfo.pagenum"
                     :page-sizes="[1, 2, 5, 10]"
                     :page-size="queryInfo.pagesize"
                     layout="total, sizes, prev, pager, next, jumper"
                     :total="total">
      </el-pagination>
    </el-card>
    <el-dialog
  title="提示"
  :visible.sync="addCateDialogVisible"
  width="30%"
   @close="editDialogClosed"
>
  <el-form :model="addCateForm" :rules="addCateFormRules" ref="addCateFormRef" label-width="100px"
  >
  <el-form-item label="添加分类" prop="cate_name">
    <el-input v-model="addCateForm.cat_name" ></el-input>
  </el-form-item>
    <el-form-item label="父级分类：">
<el-cascader
expand-trigger="hover"
    v-model="selectedKeys"
    :options="parentCateList"
    :props="cascadderPorps"
    @change="handleChange"
    clearable
    change-on-select></el-cascader>
  </el-form-item>
  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="addCateDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addCate">确 定</el-button>
  </span>
</el-dialog>
<el-dialog
  title="修改用户"
  :visible.sync="editDialogVisible"
  width="50%"
  @close="editDialogClosed">
  <el-form :model="addCateForm"  ref="addCateFormRef" label-width="100px" >
  <el-form-item label="分类名称：" prop="cat_name">
    <el-input v-model="addCateForm.cat_name" ></el-input>
    </el-form-item>
  <span slot="footer" class="dialog-footer">
    <el-button @click="editDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="editUserInfo">确 定</el-button>
  </span>
  </el-form>
</el-dialog>
  </div>
</template>
<script>
export default {
  data () {
    return {
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      rightsList: [],
      total: 0,
      columns: [{
        label: '分类名称',
        prop: 'cat_name'
      },
      {
        label: '是否有效',
        type: 'template',
        template: 'isok'
      },
      {
        label: '排序',
        type: 'template',
        template: 'order'
      },
      {
        label: '操作',
        type: 'template',
        template: 'opt'
      }],
      addCateDialogVisible: false,
      addCateForm: {
        cat_name: '',
        cat_pid: 0,
        cat_level: 0
      },
      addCateFormRules: {
        cat_name: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ]
      },
      parentCateList: [],
      cascadderPorps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      selectedKeys: []
    }
  },
  created () {
    this.getRightsList()
  },
  methods: {
            editDialogClosed () {
      this.$refs.addCateFormRef.resetFields()
      this.selectedKeys = []
            this.addCateForm.cat_pid = 0
      this.addCateForm.cat_level = 0
    },
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.getRightsList()
    },
    handleCurrentChange (newPage) {
      this.queryInfo.pagenum = newPage
      this.getRightsList()
    },
    async getRightsList () {
      const { data: res } = await this.$http.get('categories', { params: this.queryInfo })
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.rightsList = res.data.result
      this.total = res.data.total
    },
    async showAddDialogVisible () {
    this.getParentCateList()
     this.addCateDialogVisible = true
    },
    async getParentCateList () {
      const { data: res } = await this.$http.get('categories', { params: { type: 2 } })
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.parentCateList = res.data
    },
    handleChange () {
      if (this.selectedKeys.length > 0) {
      this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length - 1]
      this.addCateForm.cat_level = this.selectedKeys.length
      return
      }
      this.addCateForm.cat_pid = 0
      this.addCateForm.cat_level = 0
    },
    addCate () {
this.$refs.addCateFormRef.validate(async valid => {
 if (!valid) return
 const { data: res } = await this.$http.post('categories', this.addCateForm) // eslint-disable-line no-unused-vars
 if (res.meta.status !== 201) { return this.$message.error('添加失败！') }
 this.$message.success('添加成功！')
 this.addCateDialogVisible = false
 this.getRightsList()
    })
    },
     editUserInfo () {
  this.$refs.addCateFormRef.validate(async valid => {
 if (!valid) return
 const { data: res } = await this.$http.put('ategories/' + this.addCateForm.id, this.addCateForm) // eslint-disable-line no-unused-vars
 if (res.meta.status !== 200) { return this.$message.error('添加失败！') }
 this.$message.success('添加成功！')
   this.editDialogVisible = false
 this.getRightsList()
  })
  },
   async showSetRightDialog (id) {
    this.editDialogVisible = true
const { data: res } = await this.$http.get('categories/' + id) // eslint-disable-line no-unused-vars
 if (res.meta.status !== 200) { return this.$message.error('查询失败！') }
 this.addCateForm = res.data
 console.log(this.addCateForm)
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
        const { data: res } = await this.$http.delete('categories/' + id) // eslint-disable-line no-unused-vars
 if (res.meta.status !== 200) { return this.$message.error('删除用户失败！') }
 this.$message.success('删除用户成功！')
this.getRightsList()
  }
  }
}
</script>
<style lang="less" scoped>
.tree-table {
  margin-top: 30px;
  margin-bottom: 15px;
}
.el-row {
  margin-bottom: 15px;
}
</style>
