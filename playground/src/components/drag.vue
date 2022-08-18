<script setup lang="ts">
import draggable from 'vuedraggable'
const props = defineProps<{ data: Record<string, any> }>()
const list1 = ref<Record<string, any>[]>([])
const list2 = ref<Record<string, any>[]>([])
const list3 = ref<Record<string, any>[]>([])
const isShow = computed(() => Object.keys(props.data.attribs).length)
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
  for (let i = 0; i < max - lis2 - 1; i++) {
    const id = `${list1.value[i].id}empty`
    list2.value.push({ name: '', id })
  }
  for (let i = 0; i < max - lis3 - 1; i++) {
    const id = `${list1.value[i].id}empty-1`
    list3.value.push({ name: '', id })
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
  <div v-show="isShow">
    <el-button m-2 @click="save1">
      save
    </el-button>
    <div flex="~ gap-1" border-1 border-black border-rd-1 w-200 ma>
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
