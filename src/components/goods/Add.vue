<template>
  <div>
   <el-breadcrumb separator-class="el-icon-arrow-right">
  <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
  <el-breadcrumb-item>商品管理</el-breadcrumb-item>
  <el-breadcrumb-item>添加商品</el-breadcrumb-item>
</el-breadcrumb>
<el-card>
   <el-alert
    title="添加商品信息"
    type="info"
    center
    show-icon>
  </el-alert>
  <el-steps :space="200" :active="activeIndex - 0" finish-status="success" align-center>
  <el-step title="基本信息"></el-step>
  <el-step title="商品参数"></el-step>
  <el-step title="商品属性"></el-step>
  <el-step title="商品图片"></el-step>
  <el-step title="商品内容"></el-step>
  <el-step title="完成"></el-step>
</el-steps>
  <el-tabs v-model="activeIndex" :tab-position="tabPosition" style="height: 600px;" :before-leave='beforeTableave' @tab-click='tabClicked'>
    <el-tab-pane name="0" label="基本信息">
      <el-form ref="addFormRef" :model="addForm" label-width="80px" :rules="rules" label-position="top">
  <el-form-item label="商品名称" prop="goods_name">
    <el-input v-model="addForm.goods_name" type="number"></el-input>
  </el-form-item>
  <el-form-item  label="商品价格" prop="goods_price">
    <el-input v-model="addForm.goods_price" type="number"></el-input>
  </el-form-item>
  <el-form-item  label="商品重量" prop="goods_weight">
    <el-input v-model="addForm.goods_weight" type="number"></el-input>
  </el-form-item>
  <el-form-item  label="商品数量" prop="goods_number">
    <el-input v-model="addForm.goods_number" type="number"></el-input>
  </el-form-item>
  <el-form-item label="商品分类：">
<el-cascader
expand-trigger="hover"
    v-model="selectedKeys"
    :options="parentCateList"
    :props="cascadderPorps"
    @change="handleChange"
    clearable></el-cascader>
  </el-form-item>
  </el-form>
  <el-row>
  <el-col>
<el-cascader
expand-trigger="hover"
    v-model="addForm.selectedKeys"
    :options="parentCateList"
    :props="cascadderPorps"
    @change="handleChange"
    clearable
></el-cascader>

  </el-col>
</el-row>
    </el-tab-pane>
    <el-tab-pane name="1" label="商品参数">
      <el-form-item :label="item.attr_name" v-for="item in manyTableData" :key="item.attr_id"></el-form-item>
    </el-tab-pane>
    <el-tab-pane name="2" label="商品属性">配置管理</el-tab-pane>
    <el-tab-pane name="3" label="商品图片">
      <el-upload
      :headers="headerObj"
  action="http://127.0.0.1:8888/api/private/v1/upload"
  :on-preview="handlePreview"
  :on-remove="handleRemove"
  :file-list="fileList"
  list-type="picture"
  :on-success="handleSuccess">
  <el-button size="small" type="primary">点击上传</el-button>
  <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
</el-upload>
    </el-tab-pane>
    <el-tab-pane name="4" label="商品内容">
      <quill-editor v-model="addForm.goods_introduce"></quill-editor>
      <el-button type="primary" @click="add"  >添加用户</el-button>
    </el-tab-pane>
  </el-tabs>
</el-card>
<el-dialog
  title="图片预览"
  :visible.sync="dialogVisible"
  width="50%"
  :before-close="handleClose">
 <img :src="previewPath" alt="">
</el-dialog>
  </div>
</template>

<script>
import _ from 'lodash'
export default {
  data () {
    return {
       addForm: {
          goods_price: '',
          goods_name: '',
          goods_weight: '',
          goods_number: '',
          pics: [],
          goods_introduce: '',
          attrs: []
        },
         rules: {
          goods_name: [
            { required: true, message: '请输入商品名称', trigger: 'blur' },
            { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
          ],
           goods_price: [
            { required: true, message: '请输入价格', trigger: 'blur' },
            { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
          ],
          goods_weight: [
            { required: true, message: '请输入重量', trigger: 'blur' }
            // { validator: checkEmail, trigger: 'blur' }
          ],
           goods_number: [
            { required: true, message: '请输入数量', trigger: 'blur' }
            // { validator: checkMobile, trigger: 'blur' }
          ]
          },
      activeIndex: 0,
      tabPosition: 'left',
       parentCateList: [],
      cascadderPorps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
       manyTableData: [],
        selectedKeys: [],
        headerObj: {
          Authorization: window.sessionStorage.getItem('token')
        },
        previewPath: '',
        dialogVisible: false
    }
  },
  created () {
    this.getParentCateList()
  },
  methods: {
    handleChange () {
      this.getParamsDate()
    },
     async getParentCateList () {
      const { data: res } = await this.$http.get('categories', { params: { type: 3 } })
      if (res.meta.status !== 200) { return this.$message.error(res.meta.msg) }
      this.parentCateList = res.data
      console.log(this.parentCateList)
    },
      async getParamsDate () {
          console.log(this.selectedKeys)
           if (this.selectedKeys.length !== 3) {
       this.selectedKeys = []
      }
      },
      beforeTableave (activeName, oldactiveName) {
         if (oldactiveName === '0' && this.selectedKeys.length !== 3) {
           this.$message.error('请先选择商品分类')
           return false
         }
      },
      async tabClicked () {
        console.log(this.selectedKeys[2])
if (this.activeIndex === '1') {
    const { data: res } = await this.$http.get(`categories/${this.selectedKeys[2]}/attributes`, { params: { sel: 'many' } }) // eslint-disable-line no-unused-vars
      // if (res.meta.status !== 200) { return this.$message.error('res.meta.msg') }
      this.manyTableData = res.data
      console.log(res.data)
}
      },
      handlePreview (file) {
        this.previewPath = file.response.data.url
        this.dialogVisible = true
},
      handleRemove (file) {
        console.log(file)
         const filePath = file.response.data.tmp_path
       const i = this.addForm.pics.findIndex(x => x.pic === filePath) // eslint-disable-line no-unused-vars
       this.addForm.pics.splice(i, 1)
      },
      handleSuccess (response) {
         const picInfo = { pic: response.data.tmp_path } // eslint-disable-line no-unused-vars
          this.addForm.pics.push(picInfo)
         console.log(this.addForm)
      },
     async add () {
        this.$refs.addFormRef.validate(async valid => {
 if (!valid) {
   return this.$message.error('请填写必要的表单项！')
}
const form = _.clonDeep(this.addForm)
  form.goods_cat = form.goods_cat.join(',')
          this.manyTableData.forEach(item => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals.join(' ')
          }
          this.addForm.attrs.push(newInfo)
        })
        // 处理静态属性
        this.onlyTableData.forEach(item => {
          const newInfo = { attr_id: item.attr_id, attr_value: item.attr_vals }
          this.addForm.attrs.push(newInfo)
        })
        form.attrs = this.addForm.attrs
        console.log(form)
})
 const { data: res } = await this.$http.post('/goods', Form) // eslint-disable-line no-unused-vars
 if (res.meta.status !== 201) { return this.$message.error('添加失败！') }
 this.$message.success('添加成功！')
 this.$router.push('/goods')
      }
}
}
</script>
<style lang="less" scoped>
.el-alert, .el-steps {
  margin-bottom: 15px;
}
.el-card {
  height: 1200px;
}
.el-button {
  margin-top: 15px;
}
.ql-editor {
  min-height: 300px;
}
</style>
