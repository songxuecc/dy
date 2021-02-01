import upperFirst from 'lodash/upperFirst'
import camelCase from 'lodash/camelCase'
import Vue from 'vue'

const requireComponent = require.context(
  '@/components/ui',
  false,
  /([\w\W]*)\.(vue|js)$/
)
// global components register
export const registerComponent = () =>
  requireComponent.keys().forEach(fileName => {
    const componentConfig = requireComponent(fileName)
    const componentName = upperFirst(
      camelCase(
        fileName
          .split('/')
          .pop()
          .replace(/\.\w+$/, '')
      )
    )
    Vue.component(
      componentName,
      componentConfig.default || componentConfig
    )
  })

// global directives register
const requireDirectives = require.context(
  '@/directives',
  false,
  /([\w\W]*)\.(vue|js)$/
)

export const registerDirectives = () =>
  requireDirectives.keys().forEach(fileName => {
    const directiveConfig = requireDirectives(fileName)
    const directiveName = fileName.split('/').pop().replace(/\.\w+$/, '')
    Vue.directive(
      directiveName,
      directiveConfig.default || directiveConfig
    )
  })

export const requireAll = requireContext => requireContext.keys().map(requireContext)
