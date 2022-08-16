<script setup lang="ts">
const data = ref<Record<string, any>>({
  attribs: {
    123: {
      name: '123',
      type: 'Text',
      default: '12',
      min: null,
      name: '123',
      regExp: '312',
      required: true,
      rules: null,
      textarea: null,
      type: 'Text',
    },
  },
  description: 'xxx',
  name: '123',
})
const name = ref('')
</script>

<template>
  <main font-sans p="x-4 y-10" text="center gray-700 dark:gray-200">
    <Form :name="name" :data="data" />
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
