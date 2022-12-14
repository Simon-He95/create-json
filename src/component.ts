// @unocss-include
import type { DefineComponent, VNode } from 'vue'
import { defineComponent, h, reactive, ref, watch, watchEffect } from 'vue'
import type { FormRules } from 'element-plus'
import { ElCascader, ElCheckbox, ElCheckboxButton, ElCheckboxGroup, ElCol, ElDatePicker, ElDialog, ElForm, ElFormItem, ElIcon, ElInput, ElInputNumber, ElOption, ElRadio, ElRadioButton, ElRadioGroup, ElRow, ElSelect, ElSwitch, ElUpload } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { addStyle } from 'simon-js-tool'

export interface TypeComponent {
  Text: (type?: string) => VNode
  Email: () => VNode
  RichText: () => VNode
  Password: () => VNode
  Date: () => VNode
  Number: () => VNode
  Enumeration: () => VNode
  Boolean: () => VNode
  Radio: (type?: string) => VNode
  Checkbox: (type?: string) => VNode
  CheckboxButton: () => VNode
  RadioButton: () => VNode
  Cascader: () => VNode
  Upload: () => VNode[]
}

export interface Schema {
  size?: 'small' | 'large' | 'default'
  name?: string
  description?: string
  form: Record<string, any>
}

export const jsonSchemaTransformForm = defineComponent({
  props: {
    schema: {
      type: Object,
      default: () => { },
    },
  },
  setup(props, { expose }) {
    const schema = ref(props.schema)
    const model = reactive<Record<string, any>>({})
    const rules = reactive<FormRules>({})
    const formEl = ref<HTMLFormElement>()
    const styles = ref('')
    let remove: () => void
    watch(props, () => {
      schema.value = props.schema
    })
    expose({
      getFormData: () => model,
      submit: () => new Promise((resolve) => {
        formEl.value!.validate((valid: boolean) => resolve(valid && model))
      }),
    })
    return () => schema.value
      ? h('div', {
        style: {
          textAlign: 'left',
        },
      }, [
        h('h3', {
          class: 'text-2xl mb-2',
        }, props.schema.name),
        h('h1', {
          class: 'text-sm mb-3',
        }, props.schema.description),
        h(ElForm, {
          ref: formEl,
          model,
          rules,
          size: props.schema.size,
          class: props.schema.class,
        }, { default: () => wrapper(renderForm(props.schema.attribs)) })])
      : ''

    function renderForm(form: Record<string, any>) {
      const formList: VNode[] = []
      for (const key in form) {
        const { default: value, key: _key, type, size, limit = 1, cascaderType, colorTitle, json, label, regExp, errMsg, required, class: className, position, style, description, show, maxlength, minlength, options, values, min, max, disabled, disables, border, precision, step, debounce = 300, placeholder, children } = form[key]
        const formItemClass = `json_${type + _key}`
        const dialogShow = ref(false)
        const previewSrc = ref('')
        watchEffect(judgeShow, {
          flush: 'post',
        })
        if (value !== undefined)
          model[key] = value || ''
        if (regExp) {
          const reg = new RegExp(regExp)
          rules[key] = [{
            validator: (o, value, callback) => {
              if (!reg.test(value))
                return callback(new Error(errMsg || `${key} is invalid`))
            },
          }]
        }
        const typeComponent: TypeComponent = {
          Text: (type = 'text') => h(ElInput, {
            'modelValue': model[key],
            'class': className,
            style,
            maxlength,
            minlength,
            type,
            placeholder,
            disabled,
            'onUpdate:modelValue': modelValue,
          }),
          Email: () => typeComponent.Text(),
          RichText: () => typeComponent.Text('textarea'),
          Password: () => typeComponent.Text('password'),
          Date: () => h(ElDatePicker, {
            'modelValue': model[key],
            'class': className,
            style,
            disabled,
            'onUpdate:modelValue': modelValue,
          }),
          Number: () => h(ElInputNumber, {
            'modelValue': model[key] || (model[key] = 0),
            'class': className,
            style,
            disabled,
            min,
            max,
            precision,
            step,
            'onUpdate:modelValue': modelValue,
          }),
          Enumeration: () => h(ElSelect, {
            'modelValue': model[key],
            'class': className,
            style,
            disabled,
            placeholder,
            'onUpdate:modelValue': modelValue,
          },
          { default: () => (options || []).map((item: any, i: number) => h(ElOption, { value: values?.[i] || i, label: item })) },
          ),
          Boolean: () => h(ElSwitch, {
            'modelValue': model[key] || (model[key] = 0),
            'class': className,
            style,
            disabled,
            'onUpdate:modelValue': modelValue,
          }),
          Radio: (type = 'radio') => h(ElRadioGroup, {
            'modelValue': model[key],
            'class': className,
            style,
            disabled,
            'onUpdate:modelValue': modelValue,
          }, {
            default: () => (options || []).map((item: any, i: number) => h(type === 'radio'
              ? ElRadio
              : ElRadioButton, { label: values?.[i] || item, disabled: disables?.[i], border }, { default: () => item })),
          }),
          Checkbox: (type = 'checkbox') => h(ElCheckboxGroup, {
            'modelValue': model[key] || (model[key] = []),
            'class': className,
            style,
            disabled,
            'onUpdate:modelValue': modelValue,
          }, {
            default: () => (options || []).map((item: any, i: number) => h(type === 'checkbox'
              ? ElCheckbox
              : ElCheckboxButton, { label: values?.[i] || item, disabled: disables?.[i], border }, { default: () => item })),
          }),
          CheckboxButton: () => typeComponent.Checkbox('checkboxButton'),
          RadioButton: () => typeComponent.Radio('radioButton'),
          Cascader: () => h(ElCascader, {
            'modelValue': model[key] || (model[key] = []),
            'class': className,
            'options': json?.options || [],
            debounce,
            style,
            disabled,
            'props': {
              multiple: cascaderType,
            },
            placeholder,
            'filterable': true,
            'onUpdate:modelValue': modelValue,
            'collapse-tags-tooltip': true,
          }),
          Upload: () => {
            return [
              h(ElUpload, {
                'fileList': model[key] || (model[key] = []),
                'class': className,
                'listType': 'picture-card',
                'action': '#',
                'autoUpload': false,
                limit,
                style,
                disabled,
                'onChange': uploadChange,
                'onRemove': removeFile,
                onPreview,
                placeholder,
                'onUpdate:modelValue': modelValue,
              }, {
                default: () => {
                  return h(ElIcon, null, { default: () => h(Plus) })
                },
              }),
              h(ElDialog, {
                'modelValue': dialogShow.value,
                'onUpdate:modelValue': val => (dialogShow.value = val),
              }, {
                default: () => h('img', {
                  class: 'w-full',
                  src: previewSrc.value,
                  alt: 'Preview Image',
                }),
              }),
            ]
          },
        }
        if (!type)
          throw new Error(`type is required in ${form}`)
        if (colorTitle) {
          styles.value += `
          .${formItemClass} .el-form-item__label{
            color:${colorTitle};
          }
          `
        }
        formList.push(h(ElFormItem, {
          label,
          prop: key,
          required: !!required,
          class: formItemClass,
          position,
          size,
        }, {
          default: () => [h('div', {
            class: ' w-full text-1 lh-4 text-gray-600:50 mb-1',
          }, description), typeComponent[type as keyof TypeComponent]()],
        }))
        if (children)
          formList.push(...renderForm(children))
        function onPreview(uploadFile: any) {
          previewSrc.value = uploadFile.url
          dialogShow.value = true
        }
        function uploadChange(data: any) {
          model[key].push(data)
        }
        function removeFile(data: any) {
          model[key].splice(data, 1)
        }
        function modelValue(val: any) {
          model[key] = val
        }
        function judgeShow() {
          const el = document.querySelector(`.${formItemClass}`)! as HTMLElement
          if (!el)
            return
          if (!show)
            return el.style.display = 'block'
          for (let i = 0; i < show?.length; i++) {
            const item = show[i]
            const val = model[item.relevancy]
            const type = item.controlType
            if (type === 'value') {
              if (!val)
                return el.style.display = 'none'
            }
            else {
              if (!item.controlReg)
                continue
              const reg = new RegExp(item.controlReg)
              if (!reg.test(val))
                return el.style.display = 'none'
            }
          }
          return el.style.display = 'block'
        }
      }
      return formList
    }
    function wrapper(data: any[]) {
      remove?.()
      remove = addStyle(styles.value)
      const g1 = transformData(data.filter((item: any) => item.props.position.startsWith('0-')).sort(sortIndex))
      const g2 = transformData(data.filter((item: any) => item.props.position.startsWith('1-')).sort(sortIndex))
      const g3 = transformData(data.filter((item: any) => item.props.position.startsWith('2-')).sort(sortIndex))
      return Array.from({ length: Math.max(g1.length, g2.length, g3.length) }).map((item, i) => {
        const col: any[] = []
        const l_1 = (g1[i]?.props && g1[i].props.label) ? 1 : 0
        const l_2 = (g2[i]?.props && g2[i].props.label) ? 1 : 0
        const l_3 = (g3[i]?.props && g3[i].props.label) ? 1 : 0
        const level = l_1 + l_2 + l_3
        l_1 && col.push(h(ElCol, { span: level === 3 ? 8 : level === 2 ? 12 : 24 }, { default: () => g1[i] }))
        l_2 && col.push(h(ElCol, { span: level === 3 ? 8 : level === 2 ? 12 : 24 }, { default: () => g2[i] }))
        l_3 && col.push(h(ElCol, { span: level === 3 ? 8 : level === 2 ? 12 : 24 }, { default: () => g3[i] }))
        return h(ElRow, { gutter: 10 }, {
          default: () => col,
        })
      })
      function sortIndex(a: any, b: any) {
        return !b ? -1 : a.props.position.split('-')[1] - b.props.position.split('-')[1]
      }
      function transformData(data: any[]) {
        if (!data.length)
          return []
        const [col, n] = data[0]?.props.position?.split('-')
        if (+n === 0)
          return data
        for (let i = +n - 1; i >= 0; i--) {
          data.unshift({
            label: '',
            id: `${col}-${n}`,
          })
        }
        return data
      }
    }
  },
}) as DefineComponent<{ schema: Schema }, {}, { getFormData: () => Record<string, any>; submit: () => Promise<boolean | Record<string, any>> }>
