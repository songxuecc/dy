const getSourceIcon = (source) => {
  if (source === '淘宝') {
    return require('@/assets/images/taobao.png')
  } else if (source === '天猫') {
    return require('@/assets/images/tm.png')
  } else if (source === '1688') {
    return require('@/assets/images/1688.png')
  } else if (source === '京东') {
    return require('@/assets/images/jd.png')
  } else if (source === '苏宁') {
    return require('@/assets/images/sn.png')
  } else if (source === '网易考拉') {
    return require('@/assets/images/kaola.png')
  } else if (source === '唯品会') {
    return require('@/assets/images/vph.png')
  } else if (source === '一起做网店17zwd') {
    return require('@/assets/images/17.png')
  } else if (source === '抖音') {
    return require('@/assets/images/dy.png')
  } else if (source === '拼多多') {
    return require('@/assets/images/pdd.png')
  } else if (source === '蝉妈妈') {
    return require('@/assets/images/chanmama.png')
  } else if (source === 'vvic搜款网') {
    return require('@/assets/images/soukuanwang.png')
  } else if (source === '有赞') {
    return require('@/assets/images/youzan.png')
  }
  return ''
}

export default getSourceIcon
