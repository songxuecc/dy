
module.exports = {
  productStatusMap: {
    '-1': '全部',
    0: '待上线',
    1: '等待搬迁',
    2: '搬迁中',
    3: '保存草稿箱',
    4: '已上线',
    5: '失败',
    6: '待修改',
    7: '抓取失败',
    8: '驳回',
    9: '审核中',
    10: '已删除'
  },
  dyProductStatusMap: {
    '-': '全部',
    '0-3': '售卖中',
    '0-1': '草稿箱',
    '0-4': '审核驳回',
    '1-1': '已下架',
    '1-5': '封禁中'
  },
  captureTypeMap: {
    1001: '链接抓取',
    1002: '整店抓取'
  },
  captureStatusMap: {
    0: '开始抓取',
    1: '抓取中',
    2: '抓取成功',
    3: '失败',
    4: '等待抓取'
  },
  captureShopStatusMap: {
    0: '开始复制',
    1: '正在确认商品数量',
    2: '确认完成',
    3: '失败',
    4: '等待复制'
  },
  orderStatusMap: {
    0: '未完成',
    1: '已完成',
    2: '已取消'
  },
  subscItemLevelMap: {
    'free': 0,
    'basic': 1,
    'advanced': 2
  },
  controlTypeMap: {
    'input': 0,
    'select': 1,
    'un_editable': 20,
    'multi_select': 21
  },
  CONTROL_INPUT: 0,
  CONTROL_SELECT: 1,
  CONTROL_INPUT_SELECT: 3,
  CONTROL_ONE_DATE_YMD: 5,
  CONTROL_TWO_DATE_YMD: 6,
  CONTROL_ONE_DATE_YM: 7,
  CONTROL_TWO_DATE_YM: 8,
  CONTROL_RANGE: 11,
  CONTROL_TWO_PRODUCT: 12,
  CONTROL_THREE_PRODUCT: 13,
  valueTypeMap: {
    'text': 0,
    'number': 1
  },
  dyGoodsCreateUrl: 'https://fxg.jinritemai.com/index.html#/ffa/goods/create?product_id=',
  CAPTURE_SHOP: 1002,
  PRODUCT_TITLE_LIMIT: 60,
  PRODUCT_DESC_LIMIT: 500,
  pictureBelongTypeMap: {
    'banner': 0,
    'desc': 1
  },
  PictureViewFeature: {
    'delete': 1,
    'select': 1 << 1,
    'add': 1 << 2,
    'handle': 1 << 3,
    'sort': 1 << 4
  },
  NotificationType: {
    'show_in_white_list': 0,
    'nav_cannot_close': 1,
    'nav_close_not_show_again': 2,
    'msg_box': 3,
    'only_in_mail': 3
  },
  taskResultStatus: {
    'no_result': 0,
    'ready': 1,
    'running': 2,
    'success': 3,
    'fail': 4
  },
  wmActivityStatus: {
    'BEFORERUN': 1, // 未开始,
    'RUNNING': 2, // 投放中,
    'FINISH': 3, // 已结束,
    'STOP': 4, // 中止,
    'DEPLOYING': 5, // 设置中,
    'DELETED': 0, // 已删除,
    'FAIL': 6, // 失败,
    'DRAFT': 7 // 草稿箱,尚未配置完成
  },
  SyncType: {
    'all': 0,
    'with_ids': 1,
    'onsale': 2
  },
  SHOP_CAPTURE_TYPE: {
    'server': 0,
    'client': 1
  }
}
