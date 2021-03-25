
const NAMESPACE = '@@loading'

const createLoadingPlugin = ({
  namespace = NAMESPACE,
  includes = [],
  excludes = [],
  Vue
} = {}) => {
  return store => {
    if (store.state[namespace]) {
      throw new Error(
        `createLoadingPlugin: ${namespace} exited in current store`
      )
    }

    store.registerModule(namespace, {
      namespaced: true,
      state: {
        global: false,
        effects: {

        }
      },
      mutations: {
        SHOW (state, { payload }) {
          state.global = true
          state.effects = {
            ...state.effects,
            [payload]: true
          }
        },
        HIDE (state, { payload }) {
          state.global = false
          state.effects = {
            ...state.effects,
            [payload]: false
          }
        }
      }
    })

    store.subscribeAction({
      before: action => {
        if (shouldEffect(action, includes, excludes)) {
          store.commit({ type: namespace + '/SHOW', payload: action.type })
        }
      },
      after: action => {
        if (shouldEffect(action, includes, excludes)) {
          store.commit({ type: namespace + '/HIDE', payload: action.type })
        }
      },
      error: (action, state, error) => {
        if (shouldEffect(action, includes, excludes)) {
          store.commit({ type: namespace + '/HIDE', payload: action.type })
        }
        // store._vm.$message({
        //   message: `${error}`,
        //   type: 'error'
        // })
      }
    })
  }
}

function shouldEffect ({ type }, includes, excludes) {
  if (includes.length === 0 && excludes.length === 0) {
    return true
  }

  if (includes.length > 0) {
    return includes.indexOf(type) > -1
  }

  return excludes.length > 0 && excludes.indexOf(type) === -1
}

export default createLoadingPlugin
