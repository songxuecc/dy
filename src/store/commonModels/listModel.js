// 列表的 分页 查询 搜索
import Api from '@/api/apis'
import isEqual from 'lodash/isEqual'

/** 使用
 * this[fetchName]({
        apiName: [apiName],
        pagination: {
          page_size: 100,
          page_index: 1
        },
        filters: {

        }
      }).then(() => {
        console.log(this.table1tableData, 'table1tableData')
      })
 */

const listModel = (modelName = '') => {
  const fetchName = modelName ? `${modelName}Fetch` : 'fetch'
  const sizesName = modelName ? `${modelName}Sizes` : 'sizes'
  const totalName = modelName ? `${modelName}Total` : 'total'
  const paginationName = modelName ? `${modelName}Pagination` : 'pagination'
  const filtersName = modelName ? `${modelName}Filters` : 'filters'
  const tableDataName = modelName ? `${modelName}TableData` : 'tableData'
  const setFilterName = modelName ? `${modelName}SetFilter` : 'setFilter'
  const setStateName = modelName ? `${modelName}SetState` : 'setState'

  return {
    namespaced: true,
    state: () => ({
      [sizesName]: [10, 20, 50, 100],
      [totalName]: 0,
      [paginationName]: {
        page_size: 10,
        page_index: 1
      },
      [filtersName]: {
      },
      [tableDataName]: []
    }),
    mutations: {
      // save (state, payload) {
      //   console.log(payload, 'payload')
      //   Object.assign(state, payload)
      // }
    },
    actions: {
      [setStateName] ({commit, state}, payload) {
        const {pagination, filters, tableData, total} = payload || {}
        const nextState = Object.assign(
          pagination && {[paginationName]: pagination},
          filters && {[filtersName]: filters},
          tableData && {[tableDataName]: tableData},
          total && {[totalName]: total},
          {}
        )
        commit('save', nextState)
      },
      async [setFilterName] ({commit, state}, payload) {
        const {pagination, filters} = payload || {}
        const apiName = payload.apiName
        try {
          const nextPagination = {
            ...state[paginationName],
            ...pagination
          }
          const nextFilters = {
            ...filters
          }

          // 如果filter和之前的条件不等 则从第一页开始获取数据
          if (!isEqual(nextFilters, state[filtersName])) {
            nextPagination.page_index = 1
          }

          const parmas = {
            ...nextPagination,
            ...nextFilters
          }
          const data = await Api.hhgjAPIs[apiName](parmas)

          let items
          if (data.hasOwnProperty('items')) {
            items = data.items
          } else {
            items = data.item_list
          }
          commit('save', {
            [paginationName]: nextPagination,
            [filtersName]: nextFilters,
            [tableDataName]: items,
            [totalName]: data.total
          })
          return data
        } catch (err) {
          this._vm.$message({
            message: `${err}`,
            type: 'error',
            duration: 0
          })
          return false
        }
      },
      async [fetchName] ({commit, state}, payload) {
        const {pagination, filters} = payload || {}
        const apiName = payload.apiName
        try {
          const nextPagination = {
            ...state[paginationName],
            ...pagination
          }
          const nextFilters = {
            ...state[filtersName],
            ...filters
          }
          // 如果filter和之前的条件不等 则从第一页开始获取数据
          if (!isEqual(nextFilters, state[filtersName])) {
            nextPagination.page_index = 1
          }
          const parmas = {
            ...nextPagination,
            ...nextFilters
          }
          const data = await Api.hhgjAPIs[apiName](parmas)

          let items
          if (data.hasOwnProperty('items')) {
            items = data.items
          } else {
            items = data.item_list
          }
          commit('save', {
            [paginationName]: nextPagination,
            [filtersName]: nextFilters,
            [tableDataName]: items,
            [totalName]: data.total
          })
          return data
        } catch (err) {
          this._vm.$message.error(`${err}`)
        }
      }

    }
  }
}

export default listModel
