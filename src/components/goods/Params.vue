<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-tag type="warning" el-icon-warning>注意：只允许为第三级分类设置相关参数！</el-tag>
<el-row>
  <el-col>
<el-cascader
expand-trigger="hover"
    v-model="selectedKeys"
    :options="parentCateList"
    :props="cascadderPorps"
    @change="handleChange"
    clearable
></el-cascader>
  </el-col>
</el-row>
<el-tabs v-model="activeName" @tab-click="handleClick">
    <el-tab-pane label="动态参数" name="many">
            <el-row>
        <el-col>
          <el-button type="primary" :disabled='isBtnDisabled'>添加参数</el-button>
        </el-col>
      </el-row>
      <el-table :data="manyTableData" stripe border >
  <el-table-column type="index"></el-table-column>
  <el-table-column label="参数名称" prop="attr_name"></el-table-column>
  <el-table-column label="操作" >
     <template  slot-scope="scope">
   <el-button size="mini" type="primary" icon="el-icon-edit" @click="showEditDialog(scope.row.id)" >
   </el-button>
   <el-button  size="mini" type="danger" icon="el-icon-delete" @click="removeUserById(scope.row.id)"></el-button>
        <el-tooltip  effect="dark" content="分配角色" placement="top" :enterable="false" >
            <el-button type="warning" icon="el-icon-setting" @click="setRole(scope.row)" size="mini">
            </el-button>
    </el-tooltip>
    </template>
  </el-table-column>
</el-table>
    </el-tab-pane>
    <el-tab-pane label="静态属性" name="only" >
       <el-row>
        <el-col>
          <el-button type="primary" disabled='isBtnDisabled'>添加属性</el-button>
        </el-col>
      </el-row>
    </el-tab-pane>
  </el-tabs>
    </el-card>
  </div>
</template>
<script>
export default {
  data () {
    return {
      parentCateList: [],
      cascadderPorps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      selectedKeys: [],
      activeName: 'many',
      manyTableData: [],
      onlyTableData: []
    }
  },
  created () {
    this.getParentCateList()
  },
  methods: {
     async getParentCateList () {
      const { data: res } = await this.$http.get('categories', { params: { type: 3 } })
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.parentCateList = res.data
    },
    // handleChange () {
    //   if (this.selectedKeys.length > 0) {
    //   this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length - 1]
    //   this.addCateForm.cat_level = this.selectedKeys.length
    //   return
    //   }
    //   this.addCateForm.cat_pid = 0
    //   this.addCateForm.cat_level = 0
    // },
         handleChange () {
           this.getParamsDate()
    },
    handleClick () {
      console.log(this.activeName)
      this.getParamsDate()
    },
    async getParamsDate () {
           if (this.selectedKeys.length !== 3) {
       this.selectedKeys = []
       return
      }
      console.log(this.selectedKeys)
         const { data: res } = await this.$http.get(`categories/${this.selectedKeys[2]}/attributes`, { params: { sel: this.activeName } })
     if (res.meta.status !== 200) { return this.$message.error('获取失败') }
      console.log(res.data)
      if (this.activeName === 'many') {
this.manyTableData = res.data
      } else {
    this.onlyTableData = res.data
      }
    }
  },
  computed: {
         isBtnDisabled () {
      if (this.selectedKeys.length !== 3) {
       return true
      }
      return false
  },
           cateId () {
      if (this.selectedKeys.length === 3) {
       return this.selectedKeys[2]
      }
      return null
  }
}
}
</script>
<style lang="less" scoped>
.el-tag {
width: 100%;
height: 50px;
line-height: 50px;
font-size: 16px;
margin-bottom: 15px;
}
</style>
