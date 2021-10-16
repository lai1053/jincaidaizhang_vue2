export const settingData = {
  createType: {
    title: '生成方式',
    className: 'fund-create-box setting-label-box',
    subItem: [{
      title: '凭证的合并',
      type: '0', // 凭证生成方式
      options: [{
        name: '单笔流水生成凭证',
        val: '0',
        className: 'margin-l'
      }, {
        name: '同会计科目的流水合并',
        val: '1',
        tip: true,
        showTip: false,
        tipContent: {
          title: '',
          description: [{
            title: '案例',
            width: '',
            text: '2018年5月1日收到A公司货款'
          }, {
            title: '',
            width: '',
            text: '2018年5月2日收到A公司货款'
          }, {
            title: '合并效果',
            hasSubTitle: true,
            subTitle: '借：',
            text: '银行存款-xx银行'
          }, {
            title: '',
            hasSubTitle: true,
            subTitle: '',
            text: '银行存款-xx银行'
          }, {
            title: '',
            hasSubTitle: true,
            subTitle: '贷：',
            text: '应收账款-A公司'
          }]
        }
      }, {
        name: '同会计科目、同日期的流水合并',
        val: '2',
        tip: true,
        showTip: false,
        tipContent: {
          title: '',
          description: [{
            title: '案例',
            width: '',
            text: '2018年5月1日年收到A公司货款'
          }, {
            title: '',
            width: '',
            text: '2018年5月1日年收到A公司货款'
          }, {
            title: '合并效果',
            hasSubTitle: true,
            subTitle: '借：',
            text: '银行存款-xx银行'
          }, {
            title: '',
            hasSubTitle: true,
            subTitle: '',
            text: '银行存款-xx银行'
          }, {
            title: '',
            hasSubTitle: true,
            subTitle: '贷：',
            text: '应收账款-A公司'
          }]
        }
      }, {
        name: '同收付类型的流水合并',
        val: '3',
        tip: true,
        showTip: false,
        tipContent: {
          title: '',
          description: [{
            title: '案列',
            text: ' 2018年5月1日收到A公司货款，支付B公司货款'
          }, {
            title: '',
            text: '2018年5月2日收到A公司货款，支付B公司货款'
          }, {
            title: '合并效果',
            text: '凭证1：'
          }, {
            title: '',
            hasSubTitle: true,
            subTitle: '借:',
            text: '银行存款-xx银行'
          }, {
            title: '',
            hasSubTitle: true,
            subTitle: '',
            text: '银行存款-xx银行'
          },  {
            title: '',
            hasSubTitle: true,
            subTitle: '贷:',
            text: '应收账款-A公司'
          }, {
            title: '',
            text: '凭证2：'
          }, {
            title: '',
            hasSubTitle: true,
            subTitle: '借:',
            text: '应付账款-B公司'
          }, {
            title: '',
            hasSubTitle: true,
            subTitle: '贷:',
            text: '银行存款-xx银行'
          },  {
            title: '',
            hasSubTitle: true,
            subTitle: '',
            text: '银行存款-xx银行'
          }]
        }
      }, {
        name: '一级科目相同的流水合并',
        val: '4',
        tip: true,
        showTip: false,
        tipContent: {
          title: '',
          description: [{
            title: '案列',
            text: '2018年5月1日收到A公司货款，收到B公司货款'
          }, {
            title: '',
            text: '2018年5月2日支付C公司货款，支付D公司货款'
          }, {
            title: '合并效果',
            text: '凭证1：'
          }, {
            title: '',
            hasSubTitle: true,
            subTitle: '借:',
            text: '银行存款-XXX'
          }, {
            title: '',
            hasSubTitle: true,
            subTitle: '',
            text: '银行存款-XXX'
          },  {
            title: '',
            hasSubTitle: true,
            subTitle: '贷:',
            text: '应收账款-A公司'
          }, {
            title: '',
            hasSubTitle: true,
            subTitle: '',
            text: '应收账款-B公司'
          },  {
            title: '',
            text: '凭证2：'
          }, {
            title: '',
            hasSubTitle: true,
            subTitle: '借:',
            text: '应付账款-C公司'
          }, {
            title: '',
            hasSubTitle: true,
            subTitle: '',
            text: '应付账款-D公司'
          },  {
            title: '',
            hasSubTitle: true,
            subTitle: '贷:',
            text: '银行存款-XXX'
          }, {
            title: '',
            hasSubTitle: true,
            subTitle: '',
            text: '银行存款-XXX'
          }]
        }
      }]
    }],
    subject: [{
      title: '凭证科目的合并',
      type: [], // 凭证科目合并方式
      options: [{
        name: '银行存款科目合并',
        val: 'depositAccount'
      }, {
        name: '银行存款科目的对方科目合并',
        val: 'oppositeFlowfundAccount'
      }]
    }]
  },
  summary: {
    title: '凭证摘要',
    className: 'setting-label-box summary-box',
    subItem: [],
    summaryType: '0',
    createSummaryType: [{
      name: '自动摘要',
      value: '0',
      tip: '按系统内置规则生成凭证的摘要，推荐使用'
    }, {
      name: '自定义摘要',
      value: '1',
      settingSummaryType: [{
        name: '收款流水',
        type: ['transType', 'summary'],
        options: [
          {
            showIcon: true,
            name: '收款',
            defaultName: '收款',
            origin: '收款',
            value: 'transType',
            disabled: true,
            isEdit: false,
            show: true
          }, {
            showIcon: false,
            name: '交易日期',
            value: 'billDate',
            show: true
          }, {
            showIcon: false,
            name: '对方户名',
            value: 'counterparty',
            show: true
          }, {
            showIcon: false,
            name: '交易摘要',
            value: 'summary',
            show: true
          }
        ]
      }, {
        name: '付款流水',
        type: ['transType', 'summary'],
        options: [
          {
            showIcon: true,
            name: '付款',
            defaultName: '付款',
            origin: '付款',
            value: 'transType',
            disabled: true,
            isEdit: false,
            show: true
          }, {
            showIcon: false,
            name: '交易日期',
            value: 'billDate',
            show: true
          }, {
            showIcon: false,
            name: '对方户名',
            value: 'counterparty',
            show: true
          }, {
            showIcon: false,
            name: '交易摘要',
            value: 'summary',
            show: true
          }
        ]
      }]
    }]
  },
  createDate: {
    title: '凭证日期',
    voucherDateRule: '',
    className: 'fund-create-box setting-label-box',
    subItem: [{
      name: '按交易日期',
      val: '1',
      tip: ''
    }, {
      name: '按月末最后一日',
      val: '0',
      tip: ''
    }]
  }
}
