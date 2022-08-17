// @unocss-include
import type { DefineComponent, VNode } from 'vue'
import { defineComponent, h, reactive, ref, watch, watchEffect } from 'vue'
import type { FormRules } from 'element-plus'
import { ElCascader, ElCheckbox, ElCheckboxButton, ElCheckboxGroup, ElCol, ElDatePicker, ElForm, ElFormItem, ElInput, ElInputNumber, ElOption, ElRadio, ElRadioButton, ElRadioGroup, ElRow, ElSelect, ElSwitch } from 'element-plus'
export interface TypeComponent {
  Text: (type?: string) => VNode
  Email: () => VNode
  RichText: () => VNode
  Password: () => VNode
  Date: () => VNode
  Number: () => VNode
  Enumeration: () => VNode
  switch: () => VNode
  Boolean: () => VNode
  radio: (type?: string) => VNode
  checkbox: (type?: string) => VNode
  checkboxButton: () => VNode
  radioButton: () => VNode
  cascader: () => VNode
}

export interface Schema {
  size?: 'small' | 'large' | 'default'
  order?: string[]
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
        const { default: value, key: _key, type, name, regExp, errMsg, required, class: className, position, style, description, show, maxlength, minlength, options, values, min, max, disabled, disables, border, precision, step, debounce = 300, placeholder, children } = form[key]
        watchEffect(() => judgeShow(), {
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
            'modelValue': model[key] || 0,
            'class': className,
            style,
            disabled,
            min,
            max,
            precision,
            step,
            'onUpdate:modelValue': modelValue,
          }),
          switch: () => h(ElSwitch, {
            'modelValue': model[key] || 0,
            'class': className,
            style,
            disabled,
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
            'modelValue': model[key] || 0,
            'class': className,
            style,
            disabled,
            'onUpdate:modelValue': modelValue,
          }),
          radio: (type = 'radio') => h(ElRadioGroup, {
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
          checkbox: (type = 'checkbox') => h(ElCheckboxGroup, {
            'modelValue': model[key] || [],
            'class': className,
            style,
            disabled,
            'onUpdate:modelValue': modelValue,
          }, {
            default: () => (form[key]?.options || []).map((item: any, i: number) => h(type === 'checkbox'
              ? ElCheckbox
              : ElCheckboxButton, { label: values?.[i] || item, disabled: disables?.[i], border }, { default: () => item })),
          }),
          checkboxButton: () => typeComponent.checkbox('checkboxButton'),
          radioButton: () => typeComponent.radio('radioButton'),
          cascader: () => h(ElCascader, {
            'modelValue': model[key] || [],
            'class': className,
            options,
            debounce,
            style,
            disabled,
            placeholder,
            'filterable': true,
            'onUpdate:modelValue': modelValue,
          }),
        }
        if (!type)
          throw new Error(`type is required in ${form}`)
        const formItem = h(ElFormItem, {
          label: name,
          prop: key,
          required: !!required,
          class: `json_${type + _key}`,
          position,
        }, {
          default: () => [h('div', {
            class: ' w-full text-1 lh-4 text-gray-600:50 mb-1',
          }, description), typeComponent[type as keyof TypeComponent]()],
        })

        formList.push(formItem)
        if (children)
          formList.push(...renderForm(children))

        function modelValue(val: any) {
          model[key] = val
        }
        function judgeShow() {
          const el = document.querySelector(`.json_${type + _key}`)! as HTMLElement
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
      const g1 = data.filter((item: any) => item.props.position.startsWith('0-')).sort(sortIndex)
      const g2 = data.filter((item: any) => item.props.position.startsWith('1-')).sort(sortIndex)
      const g3 = data.filter((item: any) => item.props.position.startsWith('2-')).sort(sortIndex)
      const max = Math.max(g1.length, g2.length, g3.length)
      const result = []
      for (let i = 0; i < max; i++) {
        const col: any[] = []
        const level = (g1[i] ? 1 : 0) + (g2[i] ? 1 : 0) + (g3[i] ? 1 : 0)
        g1[i] && col.push(h(ElCol, { span: level === 3 ? 6 : level === 2 ? 12 : 24 }, { default: () => g1[i] }))
        g2[i] && col.push(h(ElCol, { span: level === 3 ? 6 : level === 2 ? 12 : 24 }, { default: () => g2[i] }))
        g3[i] && col.push(h(ElCol, { span: level === 3 ? 6 : level === 2 ? 12 : 24 }, { default: () => g3[i] }))
        result.push(h(ElRow, { gutter: 10 }, {
          default: () => col,
        }))
      }
      return result
      function sortIndex(a: any, b: any) {
        if (!b)
          return -1
        return a.props.position.split('-')[1] - b.props.position.split('-')[1]
      }
    }
  },
}) as DefineComponent<{ schema: Schema }, {}, { getFormData: () => Record<string, any>; submit: () => Promise<boolean | Record<string, any>> }>
