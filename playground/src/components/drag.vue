<script setup lang="ts">
import draggable from 'vuedraggable'
const props = defineProps<{ data: Record<string, any> }>()
const list1 = ref<Record<string, any>[]>([
])

const list2 = ref<Record<string, any>[]>([
])
const list3 = ref<Record<string, any>[]>([
])
watch(props, update)
update()
function update() {
  if (props.data) {
    const { attribs } = props.data
    const map = Object.keys(attribs).map(key => attribs[key])
    const l1 = map.filter(item => item.position.startsWith('0-')).sort(sortIndex)
    const l2 = map.filter(item => item.position.startsWith('1-')).sort(sortIndex)
    const l3 = map.filter(item => item.position.startsWith('2-')).sort(sortIndex)
    function sortIndex(a: any, b: any) {
      return a.position.split('-')[1] - b.position.split('-')[1]
    }
    list1.value = transformData(l1)
    list2.value = transformData(l2)
    list3.value = transformData(l3)
  }
}

function transformData(data: any[]) {
  if (!data.length)
    return []
  const [col, n] = data[0]?.position?.split('-')
  if (+n === 0)
    return data
  for (let i = +n - 1; i >= 0; i--) {
    data.unshift({
      name: '',
      id: `${col}-${n}`,
    })
  }
  return data
}

watch(list1, () => {
  const lis1 = list1.value.length - 1
  const lis2 = list2.value.length - 1
  const lis3 = list3.value.length - 1

  const max = Math.max(lis1, lis2, lis3)
  for (let i = lis1; i >= max; i--) {
    const cur = list1.value[i]
    if (cur?.name) {
      list1.value.splice(i + 1, lis1)
      break
    }
  }
  for (let i = lis2; i >= max; i--) {
    const cur = list2.value[i]
    if (cur?.name) {
      list2.value.splice(i + 1, lis2)
      break
    }
  }
  for (let i = lis3; i >= max; i--) {
    const cur = list3.value[i]
    if (cur?.name) {
      list3.value.splice(i + 1, lis3)
      break
    }
  }
  const len = list2.value.length - list1.value.length
  if (len < 0) {
    for (let i = 0; i < -len; i++) {
      const id = `${list1.value[i].id}empty`
      list2.value.push({ name: '', id })
    }
  }
  const len1 = list3.value.length - list1.value.length
  if (len1 < 0) {
    for (let i = 0; i < -len1; i++) {
      const id = `${list1.value[i].id}empty-1`
      list3.value.push({ name: '', id })
    }
  }
}, { immediate: true })

function save1() {
  addPosition(list1.value, 0)
  addPosition(list2.value, 1)
  addPosition(list3.value, 2)
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
    <el-button @click="save1">
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
