import Api from '@/api/apis'

import assign from '../../commonModels/assign'
import listModel from '../../commonModels/listModel'

const tableDataDetail = listModel('productList')
const tableHhTaskProductOverview = listModel('hhTaskProductOverview')
const tableHhTaskPage = listModel('hhTaskPage')
const tableHhTaskProductPage = listModel('hhTaskProductPage')

const model = assign(tableDataDetail, tableHhTaskPage, tableHhTaskProductPage, tableHhTaskProductOverview, {
  namespaced: true,
  state: () => ({
    jobs: [],
    poolingLoading: false
  }),
  mutations: {
    save (state, payload) {
      Object.assign(state, payload)
      console.log(state, 'state')
    }
  },
  actions: {
    async fetchProductList ({commit, state, dispatch}, payload) {
      await dispatch('productListFetch', {
        apiName: 'getProductList',
        ...payload
      })
    },
    async fetchHhTaskProductOverview ({commit, state, dispatch}, payload) {
      await dispatch('hhTaskProductOverviewFetch', {
        apiName: 'hhTaskProductOverview',
        ...payload
      })
    },
    async fetchHhTaskPage ({commit, state, dispatch}, payload) {
      await dispatch('hhTaskPageFetch', {
        apiName: 'hhTaskPage',
        ...payload
      })
    },
    async fetchHhTaskProductPage ({commit, state, dispatch}, payload) {
      await dispatch('hhTaskProductPageFetch', {
        apiName: 'hhTaskProductPage',
        ...payload
      })

      const hhTaskProductPageTableData = state.hhTaskProductPageTableData.map(item => {
        return Object.assign(
          item,
          item.ext_json,
          item.ext_json && item.ext_json.sku_list ? item.ext_json.sku_list : {}
        )
      })

      commit('save', { hhTaskProductPageTableData })
    },
    async updateProduct ({commit, state, dispatch}, payload) {
      try {
        await Api.hhgjAPIs.hhTaskCreate(payload)
        this._vm.$message({
          message: `批量修改开始,请点击查看修改记录`,
          type: 'success'
        })
      } catch (err) {
        this._vm.$message({
          message: `批量失败`,
          type: 'error'
        })
      }
    },
    async pooling ({commit, state, dispatch}, payload) {
      const jobIds = state.jobs.map(item => item.jobId)
      const data = await Api.hhgjAPIs.getUpdateProductRes({job_ids: jobIds})
      const jobs = []
      Object.entries(data).forEach(([key, jobRes]) => {
        const hasSucceed = jobRes.goods_list.every(item => item.message === '更新成功')
        const job = state.jobs.find(item => item.jobId === key)
        // 全部更新成功
        if (jobRes.status === 'complete' && jobRes.goods_list.length <= jobRes.total && hasSucceed) {
          this._vm.$message({
            message: `${job.jobName}修改成功`,
            type: 'success'
          })
        // 有更新失败
        } else if (jobRes.status === 'complete' && jobRes.goods_list.length <= jobRes.total && !hasSucceed) {
          // 虚拟节点
          const tableData = []
          jobRes.goods_list.forEach(jonResDetail => {
            const columnData = job.tableData.find(d => d.goods_id === jonResDetail.goods_id)

            console.log(job, columnData)
            const obj = {
              title: columnData.goods_name,
              imgUrl: columnData.image_url,
              reason: jonResDetail.message
            }
            tableData.push(obj)
          })

          console.log(tableData, 'tableData')

          const h = this._vm.$createElement
          this._vm.$msgbox({
            customClass: 'batch-edit-custom-message',
            confirmButtonText: '好的',
            confirmButtonClass: 'batch-edit-custom-message-btn',
            center: true,
            message: h('p', {
              props: {}
            }, [
              h('div',
                { style: 'text-align:center;width: 100%; height: 30px;margin-bottom:30px;margin-top:20px; font-size: 22px; font-family: PingFangSC-Medium, PingFang SC; font-weight: 500; color: #4E4E4E; line-height: 30px;' },
                '修改提示'
              ),
              h('ElAlert', {
                class: 'mb-10',
                props: {title: '下列商品修改失败，请调整后再试', 'show-icon': true, type: 'warning', center: true, closable: false}
              }),
              h('ElTable', {
                props: {data: tableData, style: {width: '100%'}, height: '50vh'}
              }, [
                h(
                  'ElTableColumn', {
                    props: {
                      prop: 'imgUrl',
                      label: '图片',
                      align: 'center',
                      width: '100'
                    },
                    scopedSlots: {
                      default: function (props) {
                        return h(
                          'ElImage', {
                            style: {height: '50px', 'max-width': '50px'},
                            props: {
                              src: props.row.imgUrl,
                              'preview-src-list': [props.row.imgUrl]
                            }
                          }
                        )
                      }
                    }
                  }
                ),
                h(
                  'ElTableColumn', {
                    props: {
                      prop: 'title',
                      label: '标题',
                      width: '250'
                    }
                  }
                ),
                h(
                  'ElTableColumn', {
                    props: {
                      prop: 'reason',
                      label: '原因',
                      align: 'center'
                    }
                  }
                )
              ])
            ])
          })
        // 未完成任务
        } else {
          jobs.push(job)
        }
      })
      commit('save', { jobs })
      if (jobs.length > 0) {
        setTimeout(() => {
          dispatch('pooling')
        }, 500)
      }
    }
  },
  getters: {
  }
})

console.log(model)
export default model
