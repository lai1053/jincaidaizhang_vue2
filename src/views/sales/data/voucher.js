export const settingData = {
  createType: {
    title: '生成方式',
    className: 'sale-create-box setting-label-box',
    subItem: [{
      title: '',
      type: '1', // 凭证生成方式
      options: [{
        name: '单张发票生成凭证',
        val: '0'
      }, {
        name: '相同借方科目合并',
        val: '1',
        tip: true,
        showTip: false,
        tipContent: {
          title: '',
          description: [{
            title: '案例',
            text: 'A公司卖给B客户a、b、c三件商品'
          }, {
            title: '合并效果',
            hasSubTitle: true,
            subTitle: '借：',
            text: '应收账款-B客户'
          }, {
            title: '',
            hasSubTitle: true,
            subTitle: '贷：',
            text: '主营业务收入-a/b/c商品'
          }, {
            title: '',
            hasSubTitle: true,
            subTitle: '',
            text: '应交税费-应交增值税(销项税额)'
          }]
        }
      }, {
        name: '相同贷方科目合并',
        val: '2',
        tip: true,
        showTip: false,
        tipContent: {
          title: '',
          description: [{
            title: '案例',
            text: ' A公司卖a商品给B\\C\\D三位客户'
          }, {
            title: '合并效果',
            hasSubTitle: true,
            subTitle: '借：',
            text: '应收账款-B\\C\\D 客户'
          }, {
            title: '',
            hasSubTitle: true,
            subTitle: '贷：',
            text: '主营业务收入-a商品'
          }, {
            title: '',
            hasSubTitle: true,
            subTitle: '',
            text: '应交税费-应交增值税(销项税额)'
          }]
        }
      }, {
        name: '相同日期的清单合并',
        val: '4',
        tip: true,
        showTip: false,
        tipContent: {
          title: '',
          description: [{
            title: '案例',
            width: '',
            text: '10月25日A公司卖了b商品给C客户'
          }, {
            title: '',
            text: '10月25日A公司卖了d商品给C客户'
          }, {
            title: '合并效果',
            hasSubTitle: true,
            subTitle: '借：',
            text: '应收账款-C客户'
          }, {
            title: '',
            hasSubTitle: true,
            subTitle: '贷：',
            text: '主营业务收入-b商品'
          }, {
            title: '',
            hasSubTitle: true,
            subTitle: '',
            text: '主营业务收入-d商品'
          }, {
            title: '',
            hasSubTitle: true,
            subTitle: '',
            text: '应交税费-应交增值税（销项税额）'
          }]
        }
      }, {
        name: '对勾选的清单合并',
        val: '3',
        tip: true,
        showTip: false,
        tipContent: {
          title: '',
          description: [{
            title: '案例',
            hasSubTitle: true,
            subTitle: '发票A：',
            width: '46px',
            text: 'A公司卖a商品给B客户'
          }, {
            title: '',
            hasSubTitle: true,
            subTitle: '发票B：',
            width: '46px',
            text: 'A公司卖b商品给C客户'
          }, {
            title: '合并效果',
            hasSubTitle: true,
            subTitle: '借：',
            text: '应收账款-B客户'
          }, {
            title: '',
            hasSubTitle: true,
            subTitle: '',
            text: '应收账款-C客户 '
          }, {
            title: '',
            hasSubTitle: true,
            subTitle: '贷：',
            text: '主营业务收入-a商品'
          }, {
            title: '',
            hasSubTitle: true,
            subTitle: '',
            text: '主营业务收入-b商品'
          }, {
            title: '',
            hasSubTitle: true,
            subTitle: '',
            text: '应交税费-应交增值税（销项税额）'
          }]
        }
      }]
    }]
  },
  summary: {
    title: '凭证摘要',
    className: 'setting-label-box summary-box',
    subItem: [{
      summaryType: ['sm_id'],
      title: '借方科目摘要',
      tip: true,
      tipContent: [
        '向x公司销售，暂未收款，普票 99999999'
      ],
      options: [
        {
          name: '结算方式',
          defaultName: '结算方式',
          origin: '结算方式',
          showIcon: true,
          value: 'sm_id',
          disabled: true,
          isEdit: false,
          show: true
        }, {
          name: '往来单位',
          value: 'custName',
          showIcon: false,
          show: true
        }, {
          name: '销售',
          showIcon: false,
          value: 'qdlx',
          show: true
        }, {
          name: '发票类型',
          value: 'fplx',
          showIcon: false,
          show: true
        }, {
          name: '发票号码',
          showIcon: false,
          value: 'invNo',
          show: true
        }
      ]
    }, {
      summaryType: ['sale'],
      title: '贷方科目摘要',
      tip: true,
      tipContent: [
        '销售服装（M码，1件，单价100元）'
      ],
      options: [
        {
          showIcon: true,
          name: '销售业务',
          defaultName: '销售业务',
          origin: '销售业务',
          value: 'sale',
          disabled: true,
          isEdit: false,
          show: true
        }, {
          showIcon: false,
          name: '商品或服务名称',
          value: 'goodServiceName',
          show: true
        }, {
          showIcon: false,
          name: '规格型号',
          value: 'specification',
          show: false
        }, {
          showIcon: false,
          name: '数量单位',
          value: 'qtyAndunit',
          show: false
        }, {
          showIcon: false,
          name: '单价',
          value: 'unitPrice',
          show: false
        }
      ]
    }]
  },

  createDate: {
    title: '凭证日期',
    voucherDateRule: '',
    className: 'sale-create-box setting-label-box',
    subItem: [{
      name: '按开票日期',
      val: '1',
      tip: ''
    }, {
      name: '按月末最后一日',
      val: '0',
      tip: ''
    }]
  }
}
