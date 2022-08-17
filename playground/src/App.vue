<script setup lang="ts">
const data = ref<Record<string, any>>({
  description: 'xxx',
  name: '123',
})
const formEl = ref(null)
const name = ref('')
function transform() {
  data.value = formEl.value?.transformToJson()
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
    <div w-200>
      <jsonSchemaTransformForm :schema="data" />
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
