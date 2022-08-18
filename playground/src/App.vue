<script setup lang="ts">
const data = ref<Record<string, any>>({
  attribs: {},
  description: 'xxx',
  name: '123',
})
const formEl = ref<{ transformToJson: () => Record<string, any> }>()
const json = ref()
function transform() {
  data.value = formEl.value!.transformToJson()
}
function toJson() {
  console.log(json.value.getFormData())
}
</script>

<template>
  <main font-sans p="x-4 y-10" text="center gray-700 dark:gray-200">
    <Form ref="formEl" :data="data" />
    <Drag :data="data" />
    <div m-5>
      <el-button @click="transform">
        transform json to form
      </el-button>
    </div>
    <div w-200 border-1 border-gray m-5 ma p-2>
      <jsonSchemaTransformForm ref="json" :schema="data" />
    </div>

    <div m-t-5>
      <el-button @click="toJson">
        To Json
      </el-button>
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
