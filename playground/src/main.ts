import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import routes from 'virtual:generated-pages'
import ElementPlus from 'element-plus'
import JsonEditorVue from 'json-editor-vue'
import { jsonSchemaTransformForm } from '../../src/component'
import App from './App.vue'
import 'mavon-editor/dist/css/index.css'
import 'element-plus/dist/index.css'
import '@unocss/reset/tailwind.css'
import './styles/main.css'
import 'uno.css'

const app = createApp(App)
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})
app.component('JsonSchemaTransformForm', jsonSchemaTransformForm)
app.component('JsonEditorVue', JsonEditorVue)

app.use(ElementPlus)
app.use(router)
app.mount('#app')
