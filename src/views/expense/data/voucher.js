export const settingData = {
  createType: {
    title: '生成方式',
    className: 'expense-create-box setting-label-box',
    subItem: [{
      title: '',
      type: '0', // 凭证生成方式
      options: [{
        name: '单行费用生成凭证',
        val: '0'
      }, {
        name: '按费用一级科目合并生成凭证',
        val: '1'
      }, {
        name: '按相同日期的费用行合并',
        val: '3'
      }, {
        name: '对勾选的费用行合并',
        val: '2'
      }]
    }]
  },
  createDate: {
    title: '凭证日期',
    voucherDateRule: '',
    className: 'expense-date-box setting-label-box',
    subItem: [{
      name: '按费用日期',
      val: '1',
      tip: ''
    }, {
      name: '按月末最后一日',
      val: '0',
      tip: ''
    }]
  }
}
