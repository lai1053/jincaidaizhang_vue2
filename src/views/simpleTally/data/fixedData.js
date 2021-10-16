const btnType = [{
  key: 'keepAccount',
  name: '记账报税',
  value: false
}, {
  key: 'saveAccount',
  name: '保存',
  value: true
}]
const incomeModule = {
  trans_name: '',
  trans_id: '',
  ex_tax_amount: '',
  tax_amount: '',
  shouldPayAcct: '',
  showIcon: false,
  showInput: false
}
const payModule = {
  trans_name: '',
  trans_id: '',
  amount: '',
  shouldPayAcct: '',
  showInput: false,
  showIcon: false
}
export const fixedData = {
  btnType,
  incomeModule,
  payModule
}
