import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import routes from 'virtual:generated-pages'
import ElementPlus from 'element-plus'
import JsonEditorVue from 'json-editor-vue'
// import { jsonSchemaTransformForm } from '../../src/component'
import { jsonSchemaTransformForm } from 'json-schema-transform-form'
import App from './App.vue'
import 'element-plus/dist/index.css'
import '@unocss/reset/tailwind.css'
import './styles/main.css'
import 'uno.css'

let instance: any
const router = createRouter({
  history: createWebHistory(
    window.__POWERED_BY_QIANKUN__ ? '/app-vue/' : import.meta.env.BASE_URL,
  ),
  routes,
})

interface IRenderProps {
  container: Element | string
}
declare global {
  interface Window {
    __POWERED_BY_QIANKUN__?: string
  }
}

function render(props: IRenderProps) {
  const { container } = props
  instance = createApp(App)
  instance
    .use(ElementPlus)
    .use(router)
    .component('JsonSchemaTransformForm', jsonSchemaTransformForm)
    .component('JsonEditorVue', JsonEditorVue)
    .mount(
      container instanceof Element
        ? (container.querySelector('#app') as Element)
        : (container as string),
    )
}

if (!window.__POWERED_BY_QIANKUN__) { render({ container: '#app' }) }
else {
  createApp(App)
    .component('JsonSchemaTransformForm', jsonSchemaTransformForm)
    .component('JsonEditorVue', JsonEditorVue)
    .use(ElementPlus)
    .use(router)
    .mount('#app')
}
// 暴露主应用生命周期钩子
export async function bootstrap() {
  console.log('subapp bootstraped')
}

export async function mount(props: any) {
  console.log('mount subapp')
  render(props)
}

export async function unmount() {
  console.log('unmount college app')
  instance.unmount()
}
