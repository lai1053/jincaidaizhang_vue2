export const settingData = {
  createType: {
    title: '生成方式',
    className: 'sale-create-box setting-label-box',
    subItem: [{
      title: '采购',
      type: '0', // 凭证生成方式
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
            text: 'A公司向B\\C\\D三个供应商购买a材料'
          }, {
            title: '合并效果',
            hasSubTitle: true,
            subTitle: '借：',
            text: '原材料-a材料'
          }, {
            title: '',
            hasSubTitle: true,
            subTitle: '',
            text: '应交税费-应交增值税（进项税额）'
          }, {
            title: '',
            hasSubTitle: true,
            subTitle: '贷：',
            text: '应付账款-B\\C\\D 供应商'
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
            text: 'A公司向B供应商购买a、b、c三种材料'
          }, {
            title: '合并效果',
            hasSubTitle: true,
            subTitle: '借：',
            text: '原材料-a/b/c材料'
          }, {
            title: '',
            hasSubTitle: true,
            subTitle: '',
            text: '应交税费-应交增值税（进项税额）'
          }, {
            title: '',
            hasSubTitle: true,
            subTitle: '贷：',
            text: '应付账款-B供应商'
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
            text: '10月25日A公司向B供应商购买了a材料'
          }, {
            title: '',
            text: '10月25日A公司向B供应商购买了b材料'
          }, {
            title: '合并效果',
            hasSubTitle: true,
            subTitle: '借：',
            text: '库存商品-a材料 '
          }, {
            title: '',
            hasSubTitle: true,
            subTitle: '',
            text: '库存商品-b材料'
          }, {
            title: '',
            hasSubTitle: true,
            subTitle: '',
            text: '应交税费-应交增值税（进项税额）'
          }, {
            title: '',
            hasSubTitle: true,
            subTitle: '贷：',
            text: '应付账款-B供应商'
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
            text: 'A公司向B供应商购买a材料'
          }, {
            title: '',
            hasSubTitle: true,
            subTitle: '发票B：',
            width: '46px',
            text: 'A公司向C供应商购买b材料'
          }, {
            title: '合并效果',
            hasSubTitle: true,
            subTitle: '借：',
            text: '库存商品-a材料'
          }, {
            title: '',
            hasSubTitle: true,
            subTitle: '',
            text: '库存商品-b材料'
          }, {
            title: '',
            hasSubTitle: true,
            subTitle: '',
            text: '应交税费-应交增值税（进项税额）'
          }, {
            title: '',
            hasSubTitle: true,
            subTitle: '贷：',
            text: '应付账款- B供应商'
          }, {
            title: '',
            hasSubTitle: true,
            subTitle: '',
            text: '应付账款- C供应商'
          }]
        }
      }]
    }, {
      title: '费用',
      type: '0', // 凭证生成方式
      options: [{
        name: '单张发票生成凭证',
        val: '0'
      }, {
        name: '按费用一级科目合并生成凭证',
        val: '1'
      }, {
        name: '相同贷方科目合并',
        val: '2'
      }, {
        name: '相同日期的清单合并',
        val: '3'
      }, {
        name: '对勾选的清单合并',
        val: '4'
      }]
    }]
  },
  summary: {
    title: '凭证摘要',
    className: 'setting-label-box summary-box',
    subItem: [{
      summaryType: ['purchase'],
      title: '采购借方科目摘要',
      tip: true,
      tipContent: ['采购服装（M码，1件，单价100元）'],
      options: [
        {
          showIcon: true,
          name: '采购业务',
          defaultName: '采购业务',
          origin: '采购业务',
          value: 'purchase',
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
    }, {
      summaryType: ['expense'],
      title: '费用借方科目摘要',
      options: [
        {
          showIcon: true,
          name: '费用业务',
          defaultName: '费用业务',
          origin: '费用业务',
          value: 'expense',
          disabled: true,
          isEdit: false,
          show: true
        }, {
          showIcon: false,
          name: '商品或服务名称',
          value: 'goodServiceName',
          show: true
        }
      ]
    }, {
      summaryType: ['sm_id'],
      title: '采购/费用贷方科目摘要',
      tip: true,
      tipContent: [
        '向x公司采购，现金付款，专票 00000000'
      ],
      options: [
        {
          name: '结算方式',
          value: 'sm_id',
          defaultName: '结算方式',
          origin: '结算方式',
          showIcon: true,
          disabled: true,
          isEdit: false,
          show: true
        }, {
          name: '往来单位',
          showIcon: false,
          value: 'custName',
          show: true
        }, {
          name: '采购/费用',
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
  },
  financeSetting: {
    'title': '税额账务处理',
    inputVatProcessType: '',
    subItem: [
      {
        name: '已认证、未认证分别入账',
        value: '0',
        content: '已认证专票税额计入“进项税额”',
        content2: '未认证专票税额计入“待认证进项税额”'
      },
      {
        name: '所有专票税额先计入待认证税额',
        value: '1',
        content: '所有专票税额计入“待认证进项税额”'
      }]
  }
}
