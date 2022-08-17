<script setup lang="ts">
const data = ref<Record<string, any>>({
  attribs: {
    'Text': {
      name: 'Text',
      id: '123',
      default: '',
      placeholder: '132',
      min: null,
      regExp: '[a-z]',
      errMsg: '输入a-z的字母',
      rules: null,
      textarea: null,
      show: [
        {
          controlReg: null,
          controlType: 'value',
          relevancy: 'Password',
        },
      ],
      key: 1,
      type: 'Text',
    },
    'Rich text': {
      id: '333',
      name: 'Rich text',
      default: '12',
      min: null,
      rules: null,
      textarea: null,
      type: 'RichText',
    },
    'Password': {
      id: 'Password',
      name: 'Password',
      default: '12',
      min: null,
      rules: null,
      textarea: null,
      regExp: '\\w{6,}',
      errMsg: '密码长度需要大于6位',
      type: 'Password',
      key: 2,
      required: true,
    },
    'number': {
      id: '333',
      name: 'number',
      default: '12',
      min: 2,
      required: true,
      rules: null,
      textarea: null,
      type: 'Number',
      key: 3,

    },
    'Enumeration': {
      id: '333',
      name: 'Enumeration',
      min: 2,
      required: true,
      rules: null,
      textarea: null,
      options: ['option1', 'top2', 'top23'],
      type: 'Enumeration',
      key: 4,

    },
  },
  description: 'xxx',
  name: '123',
})
const formEl = ref(null)
const form = ref()
const name = ref('')
function transform() {
  form.value = formEl.value.transformToJson()
  console.log(form.value)
}
</script>

<template>
  <main font-sans p="x-4 y-10" text="center gray-700 dark:gray-200">
    <Form ref="formEl" :name="name" :data="data" />
    <Drag :data="data" />
    <div>
      <el-button @click="transform">
        transform json to form
      </el-button>
    </div>
    <div w-50>
      <jsonSchemaTransformForm :schema="form" />
    </div>
    <Footer />
  </main>
</template>

<style scoped>
:deep(.demo-tabs .el-tabs__nav) {
  float: right !important;
}

:deep(.demo-tabs .el-form-item__content) {
  width: 100%;
  align-items: flex-start;
}

:deep(.el-form-item__content .el-select) {
  width: 100%;
}
</style>
