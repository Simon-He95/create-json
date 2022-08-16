<script setup lang="ts">
const dialogVisible = ref(false)
const cardShow = ref(true)
const type = ref('add')
const current = ref(null)
function add() {
  type.value = 'add'
  dialogVisible.value = true
}
const cardType = ref('')
function choose(e: any) {
  cardShow.value = false
  cardType.value = e.target.parentNode.attributes.type.nodeValue
}
const input = ref('')
const activeName = ref('first')
const tableData = ref<Record<string, any>[]>([])
const defaultvalue = ref('')
const regExp = ref('')
const min = ref(false)
const minvalue = ref(0)
const max = ref(false)
const maxvalue = ref(0)
const required = ref('false')
const textarea = ref('')
function confirm() {
  if (current.value !== input.value && getAllname().includes(input.value)) {
    alert('该字段名已存在')
    return
  }
  if (!input.value)
    return
  const t = textarea.value.replace(/ /g, '').split('\n').filter(Boolean)
  const data = {
    name: input.value,
    type: cardType.value,
    default: defaultvalue.value,
    description: null,
    min: minvalue.value,
    max: maxvalue.value,
    required: required.value,
    regExp: regExp.value,
    textarea: t,
  }
  if (type.value === 'add') { tableData.value = [...tableData.value, data] }
  else {
    const idx = tableData.value.findIndex(item => item.name === current.value)
    tableData.value[idx] = data
    current.value = null
  }
  dialogVisible.value = false
  resetData()
}

function cancel() {
  dialogVisible.value = false
  resetData()
}

function save() {
  console.log(transformToJson(tableData.value))
}

function transformToJson(data: any[]) {
  return data.reduce((result, item) => {
    const key = item.name
    result[key] = item
    return result
  }, {})
}
function resetData() {
  cardShow.value = true
  cardType.value = ''
  input.value = ''
  min.value = false
  max.value = false
  required.value = ''
  minvalue.value = 0
  maxvalue.value = 0
  defaultvalue.value = ''
  regExp.value = ''
  activeName.value = 'first'
}
function editHandler(row: any) {
  type.value = 'edit'
  current.value = input.value = row.name
  cardShow.value = false
  cardType.value = row.type
  defaultvalue.value = row.default
  regExp.value = row.regExp
  if (row.min) {
    min.value = true
    minvalue.value = row.min
  }
  if (row.max) {
    max.value = true
    maxvalue.value = row.max
  }
  required.value = row.required
  activeName.value = 'first'
  dialogVisible.value = true
}
function getAllname() {
  return tableData.value.reduce((result, item) => {
    result.push(item.name)
    return result
  }, [])
}
function deleteHandler(row: any) {
  tableData.value = tableData.value.filter(item => item.name !== row.name)
}
const types = ['Text', 'Email', 'Rich text', 'Date', 'Enumeration', 'Password', 'Number', 'Media', 'Boolean', 'Relation']
function handleClose(done: () => void) {
  resetData()
  done()
}
</script>

<template>
  <main font-sans p="x-4 y-10" text="center gray-700 dark:gray-200">
    <div class="wrapper">
      <el-button @click="add">
        add
      </el-button>
      <el-button @click="save">
        save
      </el-button>
    </div>
    <el-dialog v-model="dialogVisible" title="Type" width="50%" :before-close="handleClose">
      <div v-show="cardShow" flex="~ gap-2" w-full flex-wrap justify-center @click="choose">
        <el-card v-for="i in types" :key="i" shadow="hover" class="w-45%" :type="i">
          {{ i }}
        </el-card>
      </div>

      <div v-show="cardType" relative>
        <h2 absolute left-0 top-0 h-10 lh-10 text-5 font-600 text-black>
          {{ type === 'add' ? 'Add new' : 'Edit' }} {{ cardType }} field
        </h2>
        <el-tabs v-model="activeName" class="demo-tabs">
          <el-tab-pane label="Basic settings" name="first">
            <div v-show="cardType">
              <el-form-item label="Name:" class="w-50%">
                <el-input v-model="input" placeholder="Please input Name" />
              </el-form-item>
              <el-input
                v-show="cardType === 'Enumeration'" v-model="textarea" :rows="5" type="textarea" placeholder="Ex:
morning
noon
evening"
              />
            </div>
          </el-tab-pane>
          <el-tab-pane label="Advanced settings" name="second">
            <div flex="~ gap-2">
              <el-form-item label="Default value" flex-col items-start class="w-50%">
                <el-input v-model="defaultvalue" />
              </el-form-item>
              <el-form-item label="RegExp pattern" flex-col items-start class="w-50%">
                <el-input v-model="regExp" />
              </el-form-item>
            </div>
            <div flex="~" flex-col items-start>
              <h3 text-black>
                Settings
              </h3>
              <div flex="~ gap-2" w-full flex-wrap>
                <el-checkbox v-model="required" label="Required field" size="large" class="w-45%" />
                <div class="w-45%" text-left flex flex-col>
                  <el-checkbox v-model="min" label="Minimum value" size="large" />
                  <el-input-number
                    v-show="min" v-model="minvalue" :min="0" :max="10" size="small"
                    controls-position="right"
                  />
                </div>
                <div class="w-45%" text-left flex flex-col>
                  <el-checkbox v-model="max" label="Maximum value" size="large" />
                  <el-input-number
                    v-show="max" v-model="maxvalue" :min="0" :max="10" size="small"
                    controls-position="right"
                  />
                </div>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="cancel">Cancel
          </el-button>
          <el-button @click="confirm">Confirm</el-button>
        </span>
      </template>
    </el-dialog>
    <el-table :data="tableData" w-200 ma>
      <el-table-column prop="name" label="Name" />
      <el-table-column prop="type" label="Type" />
      <el-table-column fixed="right" width="120">
        <template #default="scope">
          <el-button link type="primary" size="small" @click="deleteHandler(scope.row)">
            Delete
          </el-button>
          <el-button link type="primary" size="small" @click="editHandler(scope.row)">
            Edit
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <Footer />
  </main>
</template>

<style scoped>
:deep(.demo-tabs .el-tabs__nav) {
  float: right !important;
}

:deep(.demo-tabs .el-form-item__content) {
  width: 100%;
}
</style>
