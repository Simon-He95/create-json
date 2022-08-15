<script setup lang="ts">
const dialogVisible = ref(false)
const cardShow = ref(true)
function add() {
  dialogVisible.value = true
}
const cardType = ref('')
function choose(e: any) {
  cardShow.value = false
  cardType.value = e.target.parentNode.attributes.type.nodeValue
}
const options = reactive([1])
function addOptions() {
  options.push(options.length + 1)
}
const input = ref('')
</script>

<template>
  <main font-sans p="x-4 y-10" text="center gray-700 dark:gray-200">
    <div class="wrapper">
      <el-button @click="add">
        add
      </el-button>
    </div>
    <el-dialog v-model="dialogVisible" title="Tips" width="30%" :before-close="handleClose">
      <div v-show="cardShow" flex="~ gap-2" w-full flex-wrap justify-center @click="choose">
        <el-card shadow="hover" class="w-45%" type="text">
          Text
        </el-card>
        <el-card shadow="hover" class="w-45%" type="input">
          Input
        </el-card>
        <el-card shadow="hover" class="w-45%" type="select">
          Select
        </el-card>
        <el-card shadow="hover" class="w-45%" type="radio">
          Radio
        </el-card>
        <el-card shadow="hover" class="w-45%" type="switch">
          Switch
        </el-card>
        <el-card shadow="hover" class="w-45%" type="number">
          Number
        </el-card>
      </div>
      <div v-show="cardType === 'input'">
        <el-form-item label="Name:">
          <el-input v-model="input" placeholder="Please input Name" />
        </el-form-item>
      </div>
      <div v-show="cardType === 'text'">
        <el-form-item label="Name:">
          <el-input v-model="input" placeholder="Please input Name" />
        </el-form-item>
      </div>
      <div v-show="cardType === 'select'">
        <el-form-item label="Name:">
          <el-input v-model="input" placeholder="Please input Name" />
        </el-form-item>
        <div v-for="i in options" :key="i">
          <el-form-item :label="`options${i}:`">
            <el-input v-model="input" placeholder="Please input Name" />
          </el-form-item>
        </div>
        <button @click="addOptions">
          add options
        </button>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="() => {
            cardShow = true;
            cardType = ''
          }">Cancel</el-button>
          <el-button @click="dialogVisible = false">Confirm</el-button>
        </span>
      </template>
    </el-dialog>
    <Footer />
  </main>
</template>
