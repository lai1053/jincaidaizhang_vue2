const getters = {
  sidebar: state => state.app.sidebar,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  roles: state => state.user.roles,
  urlInfo: state => state.info.urlInfo,
  indexData: state => state.info.indexData,
  accountList: state => state.info.accountList,   // 科目列表
  currencyAccount: state => state.info.currencyAccount,   // 科目列表
  matchAccount: state => state.info.matchAccount,
  currency: state => state.info.currency,
  imgModal: state => state.img.imgModal,
  amountList: state => state.common.amountList,
  subject: state => state.common.subject,
  acctsys_id: state => state.info.indexData.acctsys_id,
  // salary 工资表
  salaryBillData: state => state.salary.billData,
  subjectMatch: state => state.info.subjectMatch,
  allowBack: state => state.info.allowBack
}
export default getters
