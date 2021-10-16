export const settingData = {
  createType: {
    title: '生成方式',
    className: 'expense-create-box setting-label-box',
    subItem: [{
      title: '',
      type: '0', // 凭证生成方式
      options: [{
        name: '单笔报销单生成凭证',
        val: '0'
      }, {
        name: '相同时间的报销单合并生成凭证',
        val: '1'
      }, {
        name: '对勾选的报销单合并生成凭证',
        val: '2'
      }]
    }]
  },
  createDate: {
    title: '凭证日期',
    voucherDateRule: '',
    className: 'expense-date-box setting-label-box',
    subItem: [{
      name: '按审批日期',
      val: '1'
    }, {
      name: '按月末最后一日',
      val: '0',
      tip: ''
    }]
  }
}
