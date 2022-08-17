<script setup lang="ts">
import draggable from 'vuedraggable'
const props = defineProps<{ data: Record<string, any> }>()
const list1 = reactive<Record<string, any>[]>([
])

const list2 = reactive<Record<string, any>[]>([
])
const list3 = reactive<Record<string, any>[]>([
])
watch(() => props.data, () => {
  console.log('222')
  if (props.data) {
    const { attribs } = props.data
    Object.keys(attribs).forEach(key => list1.push(attribs[key]))
  }
}, {
  deep: true,
})
console.log(props.data)
if (props.data) {
  const { attribs } = props.data
  Object.keys(attribs).forEach(key => list1.push(attribs[key]))
}

watch(list1, () => {
  const lis1 = list1.length - 1
  for (let i = lis1; i >= 0; i--) {
    const cur = list1[i]
    if (cur?.name) {
      list1.splice(i + 1, lis1)
      break
    }
  }
  const lis2 = list2.length - 1
  for (let i = lis2; i >= 0; i--) {
    const cur = list2[i]
    if (cur?.name) {
      list2.splice(i + 1, lis2)
      break
    }
  }
  const lis3 = list3.length - 1
  for (let i = lis3; i >= 0; i--) {
    const cur = list3[i]
    if (cur?.name) {
      list3.splice(i + 1, lis3)
      break
    }
  }

  const len = list2.length - list1.length
  if (len < 0) {
    for (let i = 0; i < -len - 1; i++) {
      const id = `${list1[i].id}empty`
      list2.push({ name: '', id })
    }
  }
  const len1 = list3.length - list1.length
  if (len1 < 0) {
    for (let i = 0; i < -len1 - 1; i++) {
      const id = `${list1[i].id}empty-1`
      list3.push({ name: '', id })
    }
  }
}, { immediate: true })

function save() {
  addPosition(list1, 0)
  addPosition(list2, 1)
  addPosition(list3, 2)
  console.log(props.data)
}
function addPosition(list: any[], key: number) {
  list.forEach((item, idx) => {
    if (!item.name)
      return
    item.position = `${key}-${idx}`
  })
}
</script>

<template>
  <div>
    <el-button @click="save">
      save
    </el-button>
    <div flex="~ gap-1" border-1 border-black border-rd-1 w-200>
      <draggable class="list-group" :list="list1" group="people" item-key="name">
        <template #item="{ element }">
          <div class="list-group-item" h-10 :class="element.name ? 'border-1' : ''" border-gray border-rd-1 m-2 lh-10>
            {{ element.name }}
          </div>
        </template>
      </draggable>

      <draggable class="list-group" :list="list2" group="people" item-key="name">
        <template #item="{ element }">
          <div class="list-group-item" h-10 :class="element.name ? 'border-1' : ''" border-gray border-rd-1 m-2 lh-10>
            {{ element.name }}
          </div>
        </template>
      </draggable>
      <draggable class="list-group" :list="list3" group="people" item-key="name">
        <template #item="{ element }">
          <div class="list-group-item" h-10 :class="element.name ? 'border-1' : ''" border-gray border-rd-1 m-2 lh-10>
            {{ element.name }}
          </div>
        </template>
      </draggable>
    </div>
  </div>
</template>

<style scoped>
.list-group {
  width: 100%;
}
</style>
