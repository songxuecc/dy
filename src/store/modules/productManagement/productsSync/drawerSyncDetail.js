import createBaseModel from '@commonModels/createBaseModel.js'
import modelExtend from '@commonModels/modelExtend.js'
import servises from '@servises'

const model = modelExtend(
  createBaseModel({
    fetch: servises.hhTaskPage
  }),
  {
    namespaced: true,
    state: () => ({
      pagination: {
        page_size: 10,
        page_index: 1
      }
    }),
    actions: {
      async fetch ({commit, state, dispatch}, payload) {
        await dispatch('query', payload)
        console.log(state, 'data-drawerSyncDetail')

        const data = {
          'data': {
            'total': 1,
            'item_list': [
              {
                'image_url': 'https://sf3-ttcdn-tos.pstatp.com/obj/temai/4de3143e69cd7d17446630775bb6ccccwww600-600',
                'goods_id': '1121',
                'goods_name': '商品名商品名商品名商品名商品名商品名商品名商品名商品名商品名',
                'sync_content_list': [{'title': 1, 'price': 0, 'shelf': 0}],
                'status': 0,
                'publish_status': 0,
                'sync_time': '2021-09-02 12:31:09',
                'fail_reason': '检测失败原因',
                'ext_json': {
                  'goods_id': '1121',
                  'data_list': [
                    {
                      'data_type': 'title',
                      'old_data': 'ddd',
                      'new_data': 'kkk'
                    },
                    {
                      'data_type': 'price',
                      'old_data': 'ddd',
                      'new_data': 'kkk'
                    }
                  ]
                }
              },
              {
                'image_url': 'https://sf3-ttcdn-tos.pstatp.com/obj/temai/4de3143e69cd7d17446630775bb6ccccwww600-600',
                'goods_id': '1111',
                'goods_name': '商品名商品名商品名商品名商品名商品名商品名商品名商品名商品名',
                'sync_content_list': [{'title': 1, 'price': 0, 'shelf': 0}],
                'status': 0,
                'publish_status': 0,
                'sync_time': '2021-09-02 12:31:09',
                'fail_reason': '检测失败原因',
                'ext_json': {
                  'goods_id': '1111',
                  'data_list': [
                    {
                      'data_type': 'title',
                      'old_data': 'ddd',
                      'new_data': 'kkk'
                    },
                    {
                      'data_type': 'price',
                      'old_data': 'ddd',
                      'new_data': 'kkk'
                    }
                  ]
                }
              },
              {
                'image_url': 'https://sf3-ttcdn-tos.pstatp.com/obj/temai/4de3143e69cd7d17446630775bb6ccccwww600-600',
                'goods_id': '1113',
                'goods_name': '商品名商品名商品名商品名商品名商品名商品名商品名商品名商品名',
                'sync_content_list': [{'title': 1, 'price': 0, 'shelf': 0}],
                'status': 0,
                'publish_status': 0,
                'sync_time': '2021-09-02 12:31:09',
                'fail_reason': '检测失败原因',
                'ext_json': {
                  'goods_id': '1113',
                  'data_list': [
                    {
                      'data_type': 'title',
                      'old_data': 'ddd',
                      'new_data': 'kkk'
                    },
                    {
                      'data_type': 'price',
                      'old_data': 'ddd',
                      'new_data': 'kkk'
                    }
                  ]
                }
              },
              {
                'image_url': 'https://sf3-ttcdn-tos.pstatp.com/obj/temai/4de3143e69cd7d17446630775bb6ccccwww600-600',
                'goods_id': '1114',
                'goods_name': '商品名商品名商品名商品名商品名商品名商品名商品名商品名商品名',
                'sync_content_list': [{'title': 1, 'price': 0, 'shelf': 0}],
                'status': 0,
                'publish_status': 0,
                'sync_time': '2021-09-02 12:31:09',
                'fail_reason': '检测失败原因',
                'ext_json': {
                  'goods_id': '1114',
                  'data_list': [
                    {
                      'data_type': 'title',
                      'old_data': 'ddd',
                      'new_data': 'kkk'
                    },
                    {
                      'data_type': 'price',
                      'old_data': 'ddd',
                      'new_data': 'kkk'
                    }
                  ]
                }
              },
              {
                'image_url': 'https://sf3-ttcdn-tos.pstatp.com/obj/temai/4de3143e69cd7d17446630775bb6ccccwww600-600',
                'goods_id': '1115',
                'goods_name': '商品名商品名商品名商品名商品名商品名商品名商品名商品名商品名',
                'sync_content_list': [{'title': 1, 'price': 0, 'shelf': 0}],
                'status': 0,
                'publish_status': 0,
                'sync_time': '2021-09-02 12:31:09',
                'fail_reason': '检测失败原因',
                'ext_json': {
                  'goods_id': '1115',
                  'data_list': [
                    {
                      'data_type': 'title',
                      'old_data': 'ddd',
                      'new_data': 'kkk'
                    },
                    {
                      'data_type': 'price',
                      'old_data': 'ddd',
                      'new_data': 'kkk'
                    }
                  ]
                }
              },
              {
                'image_url': 'https://sf3-ttcdn-tos.pstatp.com/obj/temai/4de3143e69cd7d17446630775bb6ccccwww600-600',
                'goods_id': '1116',
                'goods_name': '商品名商品名商品名商品名商品名商品名商品名商品名商品名商品名',
                'sync_content_list': [{'title': 1, 'price': 0, 'shelf': 0}],
                'status': 0,
                'publish_status': 0,
                'sync_time': '2021-09-02 12:31:09',
                'fail_reason': '检测失败原因',
                'ext_json': {
                  'goods_id': '1116',
                  'data_list': [
                    {
                      'data_type': 'title',
                      'old_data': 'ddd',
                      'new_data': 'kkk'
                    },
                    {
                      'data_type': 'price',
                      'old_data': 'ddd',
                      'new_data': 'kkk'
                    }
                  ]
                }
              },
              {
                'image_url': 'https://sf3-ttcdn-tos.pstatp.com/obj/temai/4de3143e69cd7d17446630775bb6ccccwww600-600',
                'goods_id': '1117',
                'goods_name': '商品名商品名商品名商品名商品名商品名商品名商品名商品名商品名',
                'sync_content_list': [{'title': 1, 'price': 0, 'shelf': 0}],
                'status': 0,
                'publish_status': 0,
                'sync_time': '2021-09-02 12:31:09',
                'fail_reason': '检测失败原因',
                'ext_json': {
                  'goods_id': '1117',
                  'data_list': [
                    {
                      'data_type': 'title',
                      'old_data': 'ddd',
                      'new_data': 'kkk'
                    },
                    {
                      'data_type': 'price',
                      'old_data': 'ddd',
                      'new_data': 'kkk'
                    }
                  ]
                }
              },
              {
                'image_url': 'https://sf3-ttcdn-tos.pstatp.com/obj/temai/4de3143e69cd7d17446630775bb6ccccwww600-600',
                'goods_id': '1118',
                'goods_name': '商品名商品名商品名商品名商品名商品名商品名商品名商品名商品名',
                'sync_content_list': [{'title': 1, 'price': 0, 'shelf': 0}],
                'status': 0,
                'publish_status': 0,
                'sync_time': '2021-09-02 12:31:09',
                'fail_reason': '检测失败原因',
                'ext_json': {
                  'goods_id': '1118',
                  'data_list': [
                    {
                      'data_type': 'title',
                      'old_data': 'ddd',
                      'new_data': 'kkk'
                    },
                    {
                      'data_type': 'price',
                      'old_data': 'ddd',
                      'new_data': 'kkk'
                    }
                  ]
                }
              }
            ]
          },
          'msg': 'succ',
          'code': 0
        }

        const tableData = data.data.item_list.map(item => ({...item, ...item.ext_json}))
        console.log(tableData, 'tableData')

        commit('save', {
          tableData
        })
      }
    },
    getters: {
    }
  })

export default model
