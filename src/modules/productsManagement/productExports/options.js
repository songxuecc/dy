export const cityOptions1 = [
  '商品ID',
  '商品链接',
  '来源链接',
  '商品标题',
  '商品分类',
  '类目属性',
  '商品库存',
  '商品状态',
  '划线价',
  '售卖价',
  '轮播图',
  '详情图',
  '支付方式',
  '客服手机',
  '货号',
  '发货模式',
  '创建时间'
]

export const cityOptions2 = [
  'skuID',
  'sku规格属性',
  'sku价格',
  'sku编码',
  'sku现货或预售库存',
  'sku阶梯库存'
]

export const exportFieldList = {
  '商品ID': {
    name: '商品ID', key: 'goods_id'
  },
  '商品链接': {
    name: '商品链接', key: 'goods_url'
  },
  '来源链接': {
    name: '来源链接', key: 'origin_goods_url'
  },
  '商品标题': {
    name: '商品标题', key: 'goods_name'
  },
  '商品分类': {
    name: '商品分类', key: 'category'
  },
  '类目属性': {
    name: '类目属性', key: 'goods_desc'
  },
  '商品库存': {
    name: '商品库存', key: 'goods_quantity'
  },
  '商品状态': {
    name: '商品状态', key: 'status_str'
  },
  '划线价': {
    name: '划线价', key: 'market_price'
  },
  '售卖价': {
    name: '售卖价', key: 'discount_price'
  },
  '轮播图': {
    name: '轮播图', key: 'banner_image'
  },
  '详情图': {
    name: '详情图', key: 'detail_image'
  },
  '支付方式': {
    name: '支付方式', key: 'pay_type_str'
  },
  '客服手机': {
    name: '客服手机', key: 'mobile'
  },
  '货号': {
    name: '货号', key: 'tp_outer_iid'
  },
  '发货模式': {
    name: '发货模式', key: 'presell_type'
  },
  '创建时间': {
    name: '创建时间', key: 'create_time'
  },
  'skuID': {
    name: 'skuID', key: 'sku_id'
  },
  'sku规格属性': {
    name: 'sku规格属性', key: 'spec_detail_names'
  },
  'sku价格': {
    name: 'sku价格', key: 'sku_price'
  },
  'sku编码': {
    name: 'sku编码', key: 'sku_code'
  },
  'sku现货或预售库存': {
    name: 'sku现货或预售库存', key: 'sku_quantity'
  },
  'sku阶梯库存': {
    name: 'sku阶梯库存', key: 'sku_step_quantity'
  }

}

export const status = {
  '售卖中': {check_status: 3, status: 0},
  '已下架': {check_status: 1, status: 1},
  '全部商品': {check_status: -1, status: -1}
}
