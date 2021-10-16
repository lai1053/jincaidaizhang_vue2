import { ywqdindex, getAccountList, getMatchAccountList, getCurrencyList, subjectMatch} from '@/api/initial'
import { getUrlData } from '@/utils/validate'

const info = {
  state: {
    urlInfo: {
      qyid: '', // 企业id
      token: '', // token令牌
      taxType: '', // 企业性质  1-小规模企业 2-一般企业
      hydm: '', // 企业所属行业代码
      nsrsbh: '', // 纳税人识别号
      nsrmc: '', // 纳税人识名称
      qdtype: '', // 清单类型
      scpzzt: '', // 生成凭证状态
      scpzjgType: '', // 生成凭证结果类型？这个不是很确定是什么意思
      ssyf: '', // 所属月份 或者叫 会计期间
      accountId: '', // 账套id
      isjckqy: '', // 是否进出口企业
      accountType: '' // 账套类型
    },
    indexData: {
      subordinateindustry: '',
      iae_mark: '', // 进出口企业标志"1":非进出口企业"2":进出口企业
      txm: '',
      sfzd: '',
      archiveCode: '',
      permission: '',
      version: null,
      acctsys_id: 101, // 会计准则
      acct_level_length: '',
      daxx: '',
      daxxNew: '', // 添加处理daxx后的字段
      entAcctVO: {
        id: '', // end_id
        code: '',
        name: '',
        uuid: '',
        server_region_id: 6,
        acct_uuid: '',
        ind_type_id: 99,
        vat_id: 2,
        acct_book: {
          uuid: '',
          name: '',
          start_acct_year: 2017,
          start_acct_period: 8,
          crnt_acct_year: 2017,
          crnt_acct_period: 8,
          vat_id: 2,
          acctsys_id: 101, // 会计准则
          acct_level: 5,
          acct_level_length: '',
          version: null
        },
        iae_type_id: 1,
        taxpayer_id: '',
        nei_type_src_code: ''
      },
      lcbs: '',
      checkoutFlag: ''
    },
    accountList: null, // 明细科目列表数据 {accounts, allAccount, accountDetail}
    currencyAccount: null,
    matchAccount: null, // 科目匹配表的数据
    currency: null, // 外币数据
    subjectMatch: null, // 科目匹配
    allowBack: false
  },
  mutations: {
    SET_URL_INFO: (state, urlInfo) => {
      state.urlInfo = urlInfo
    },
    SET_INDEX_DATA: (state, indexData) => {
      state.indexData = indexData
    },
    SET_ACCOUNT_LIST: (state, accountList) => {
      state.accountList = accountList
    },
    SET_MATCH_ACCOUNT: (state, matchAccount) => {
      state.matchAccount = matchAccount
    },
    SET_MATCH_SUBJECT: (state, subjectMatch) => {
      state.subjectMatch = subjectMatch
    },
    SET_CURRENCY: (state, currency) => {
      state.currency = currency
    },
    SET_CURRENCY_ACCOUNT: (state, currencyAccount) => {
      state.currencyAccount = currencyAccount
    },
    SET_ROUTE: (state, allowBack) => {
      state.allowBack = allowBack
    }
    /* SET_IS_INIT: (state, isInit) => {
      state.isInit = isInit
    } */
  },

  actions: {
    // 保存链接信息
    SetUrlInfo({ commit }) {
      const url = window.location.search
      const urlInfo = getUrlData(url.substring(1, url.length))
      commit('SET_URL_INFO', urlInfo)
      return new Promise((resolve, reject) => {
        const {qyid, ssyf, hydm, nsrsbh, nsrmc, token, accountId, taxType, isjckqy, accountType, regPhone} = urlInfo
        const params = {
          qyid,
          ssyf,
          hydm,
          nsrsbh,
          nsrmc,
          token,
          accountId,
          taxType,
          isjckqy,
          accountType,
          from: 'ywqd',
          regPhone
        }
        ywqdindex(params).then(resp => {
          commit('SET_INDEX_DATA', resp.data)
          resolve(urlInfo)
        }).catch((error) => {
          reject(error)
        })
      })
    },
    // 获取明细科目列表
    GetAccountList({ commit, state }) {
      return new Promise((resolve, reject) => {
        const {urlInfo, indexData} = state
        getAccountList({
          qyid: urlInfo.qyid
        }).then(resp => {
          if (resp.data && resp.data.dataDetail) {
            const datas = resp.data.dataDetail
            const accountList = {}
            const accountDetail = []
            const accounts = []
            const allAccount = []
            const lastAccount = []
            const disabledAccount = []
            const WBHS = []
            const acxAccItem = []
            for (let i = 0; i < datas.length; i++) {
              const item = datas[i]
              if (item._Disable === 'false') {
                allAccount.push(item._Code.trim() + ' ' + item._Name.trim())
              }
              if (item._IsEnd === 'true' || item._IsEnd === true) {
                if (item._Disable === 'false') {
                  accountDetail.push(item)
                  let newItem = item._Code.trim() + ' ' + item._Name.trim()
                  if (item._AuxAccItem.trim() !== '' && item._AuxAccItem.trim() !== null) {
                    newItem = item._Code.trim() + ' ' + item._Name.trim() + ' ' + '辅'
                  }
                  // 修改后的
                  accounts.push({
                    account: newItem,
                    tip: item._Code.trim() + ' ' + item._ParentName
                  })
                  // accounts.push(newItem)
                } else {
                  disabledAccount.push(item)
                }
                lastAccount.push(item)
              }
              if (item._WBHS === 'true' || item._WBHS === true) {
                WBHS.push(item._Code)
              }
              // 过滤出参照辅助项目的数据
              if (item._AuxAccItem.trim() !== '') {
                acxAccItem.push(item)
              }
            }
            accountList.accountDetail = accountDetail
            accountList.accounts = accounts
            accountList.allAccount = allAccount
            accountList.acxAccItem = acxAccItem
            accountList.lastAccount = lastAccount
            accountList.disabledAccount = disabledAccount
            commit('SET_ACCOUNT_LIST', accountList)
            commit('SET_CURRENCY_ACCOUNT', WBHS)
          }
          resolve(resp)
        }).catch((error) => {
          reject(error)
        })
      })
    },
    // 获取科目匹配表的数据
    GetMatchAccountList({ commit, state }) {
      return new Promise((resolve, reject) => {
        getMatchAccountList({
          qyid: state.urlInfo.qyid
        }).then(resp => {
          commit('SET_MATCH_ACCOUNT', resp.data)
          resolve(resp.data)
        }).catch((error) => {
          reject(error)
        })
      })
    },
    // 获取外币列表
    GetCurrencyList ({commit, state }) {
      return new Promise((resolve, reject) => {
        getCurrencyList({
          qyid: state.urlInfo.qyid,
          ssyf: state.urlInfo.ssyf
        }).then(resp => {
          commit('SET_CURRENCY', resp.data)
          resolve(resp.data)
        }).catch((error) => {
          reject(error)
        })
      })
    },
    subjectMatch ({commit, state} ) {
      return new Promise((resolve, reject) => {
        subjectMatch({
          qyid: state.urlInfo.qyid,
        }).then(resp => {
          commit('SET_MATCH_SUBJECT', resp)
          resolve(resp)
        }).catch((error) => {
          reject(error)
        })
      })
    },
    updateAppSetting ({commit, state}, allowBack) {
      commit('SET_ROUTE', allowBack)
    }
  }
}

export default info
