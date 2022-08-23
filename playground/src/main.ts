import { createApp } from 'vue'
import type { Router, RouterHistory } from 'vue-router'
import { createRouter, createWebHistory } from 'vue-router'
import ElementPlus from 'element-plus'
import JsonEditorVue from 'json-editor-vue'
import { jsonSchemaTransformForm } from 'json-schema-transform-form'
// import { jsonSchemaTransformForm } from '../../src/component'
import App from './App.vue'
import 'element-plus/dist/index.css'
import '@unocss/reset/tailwind.css'
import './styles/main.css'
import 'uno.css'

let instance: any
const routes = [
  {
    path: '/pro/anteater',
    component: () => import('./App.vue'),
    children: [
      { path: 'works/index', meta: { permission: 'anteater' }, component: () => import('./pages/index.vue') },
    ],
  },
]

interface IRenderProps {
  container: Element | string
}
declare global {
  interface Window {
    __POWERED_BY_QIANKUN__?: string
  }
}
const history = createWebHistory((window as any).__POWERED_BY_QIANKUN__ ? '/' : '/') as RouterHistory

const router = createRouter({
  history,
  routes,
}) as Router

function render(props: IRenderProps) {
  const { container } = props
  instance = createApp(App)
    .use(ElementPlus)
    .use(router)
    .component('JsonSchemaTransformForm', jsonSchemaTransformForm)
    .component('JsonEditorVue', JsonEditorVue)
    .mount(typeof (container) === 'string' ? container : (container.querySelector('#app') as Element))
}

if (!window.__POWERED_BY_QIANKUN__)
  render({ container: '#app' })

// 暴露主应用生命周期钩子
export async function bootstrap() {
  console.log('%c ', 'color: green;', 'vue3.0 app bootstraped')
}

export async function mount(props: any) {
  console.log('mount subapp', props)
  render(props)
}

export async function unmount() {
  instance.unmount()
  if (instance._container)
    instance._container.innerHTML = ''
  history.destroy()
}

export async function update() {
  console.log('update props')
}

