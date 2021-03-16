<template>
  <div>
   <el-breadcrumb separator-class="el-icon-arrow-right">
  <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
  <el-breadcrumb-item>权限管理</el-breadcrumb-item>
  <el-breadcrumb-item>角色列表</el-breadcrumb-item>
</el-breadcrumb>
<el-card >
  <el-row>
    <el-col >
    <el-button type="primary" @click="addDialogVisible = true"  >添加角色</el-button>
</el-col>
  </el-row>
<el-table :data="rolelist" stripe border >
   <el-table-column type="expand">
      <template  slot-scope="scope">
        <el-row :class="['bdbottom','vcenter', i1 === 0 ? 'bdtop' : '']"   v-for="(item1, i1) in scope.row.children" :key="item1.id" >
          <el-col :span="5">
           <el-tag closable @close="removeRightById(scope.row,item1.id)">
             {{item1.authName}}
             </el-tag>
             <i class="el-icon-caret-right"></i>
          </el-col>
          <el-col :span="19">
           <el-row :class="[ 'vcenter', i2 !== 0 ? 'bdtop' : '']" v-for="(item2, i2) in item1.children" :key="item2.id" >
             <el-col :span="6">
               <el-tag type="success" closable @close="removeRightById(scope.row,item2.id)">
             {{item2.authName}}
             </el-tag>
              <i class="el-icon-caret-right"></i>
             </el-col>
             <el-col :span="18">
   <el-tag type="warning" v-for="(item3,i3) in item2.children" :key="i3" closable @close="removeRightById(scope.row,item3.id)">
             {{item3.authName}}
             </el-tag>
             </el-col>
           </el-row>
          </el-col>
        </el-row>

            </template>
   </el-table-column>
  <el-table-column type="index"></el-table-column>
  <el-table-column label="角色名称" prop="roleName"></el-table-column>
  <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
 <el-table-column label="操作" >
     <template  slot-scope="scope">
   <el-button type="primary"  icon="el-icon-edit" @click="showEditDialog(scope.row.id)" > 编辑
   </el-button>
   <el-button type="danger"  icon="el-icon-delete" @click="removeUserById(scope.row.id)">删除</el-button>
        <el-tooltip  effect="dark" content="分配角色" placement="top" :enterable="false">
            <el-button type="warning" icon="el-icon-setting" @click="showSetRightDialog(scope.row)">分配权限</el-button>
    </el-tooltip>
    </template>
  </el-table-column>
</el-table>
</el-card>
<el-dialog
  title="修改用户"
  :visible.sync="editDialogVisible"
  width="50%"
  @close="editDialogClosed"
 >
  <el-form :model="editForm"  ref="editFormRef" label-width="100px" >
  <el-form-item label="姓名" prop="roleName">
    <el-input v-model="editForm.roleName" disabled></el-input>
  </el-form-item>
   <el-form-item label="角色描述" prop="roleDesc">
    <el-input v-model="editForm.roleDesc"></el-input>
  </el-form-item>
  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="editDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="editUserInfo">确 定</el-button>
  </span>
</el-dialog>
<el-dialog
  title="分配权限"
  :visible.sync="setRightDialogVisible"
  width="50%"
  @close="setRightDialogVisibled"
 >
 <el-tree ref="treeRef" default-expand-all :default-checked-keys="defKeys" node-key="id" show-checkbox :data="rightslist" :props="treeProps" @node-click="handleNodeClick"></el-tree>
  <span slot="footer" class="dialog-footer">
    <el-button @click="setRightDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="allotRights">确 定</el-button>
  </span>
</el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      rolelist: [],
      editForm: [],
      setRightDialogVisible: false,
      rightslist: [],
      treeProps: {
          children: 'children',
          label: 'authName'
        },
        defKeys: [],
        roleId: '',
        editDialogVisible: false
    }
  },
  created () {
    this.getRolesList()
  },
  methods: {
    setRightDialogVisibled () {
   this.defKeys = []
    },
        editDialogClosed () {
      this.$refs.editFormRef.resetFields()
    },
async getRolesList () {
     const { data: res } = await this.$http.get('roles')
     if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
     this.rolelist = res.data
    },
    async showEditDialog (id) {
    this.editDialogVisible = true
const { data: res } = await this.$http.get('roles/' + id) // eslint-disable-line no-unused-vars
 if (res.meta.status !== 200) { return this.$message.error('查询失败！') }
 this.editForm = res.data
   },
      editUserInfo () {
  this.$refs.editFormRef.validate(async valid => {
 if (!valid) return
 const { data: res } = await this.$http.put('roles/' + this.editForm.roleId, this.editForm) // eslint-disable-line no-unused-vars
 if (res.meta.status !== 200) { return this.$message.error('添加失败！') }
 this.$message.success('添加成功！')
   this.editDialogVisible = false
 this.getRolesList()
  })
  },
  async removeRightById (role, rightId) {
const confirmRuselt = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)
        if (confirmRuselt !== 'confirm') {
          return this.$message.info('取消删除')
                  }
        const { data: res } = await this.$http.delete(`roles/${role.id}/rights/${rightId}`) // eslint-disable-line no-unused-vars
 if (res.meta.status !== 200) { return this.$message.error('删除用户失败！') }
 this.$message.success('删除用户成功！')
 role.children = res.data
  },
 async showSetRightDialog (role) {
   this.roleId = role.id
         const { data: res } = await this.$http.get('rights/tree')
     if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
     this.rightslist = res.data
      this.getLeafKeys(role, this.defKeys)
   this.setRightDialogVisible = true
  },
  getLeafKeys (node, arr) {
  if (!node.children) {
    return arr.push(node.id)
  }
  node.children.forEach(item =>
    this.getLeafKeys(item, arr)
  )
  },
  async allotRights () {
const keys = [
...this.$refs.treeRef.getCheckedKeys(),
...this.$refs.treeRef.getHalfCheckedKeys()
]
const idStr = keys.join(',')
 const { data: res } = await this.$http.post(`roles/${this.roleId}/rights`,
{ rids: idStr }) // eslint-disable-line no-unused-vars
if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
  this.getRolesList()
   this.setRightDialogVisible = false
  }
  }
}
</script>
<style lang="less" scoped>
.el-table {
    margin-top: 30px;
    margin-bottom: 15px;
}
.bdtop {
  border-top: 1px solid #eee ;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
.el-tag {
  margin: 7px;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>
