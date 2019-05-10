const validateRule = {
  mobile: [
    {
      regex: /^\d+$/,
      tip: '请输入手机号'
    },
    {
      regex: /^\d{11}$/,
      tip: '手机号码格式不正确'
    }
  ],
  mobileCode: [
    {
      regex: /^\d+$/,
      tip: '请输入验证码'
    },
    {
      regex: /^\d{6}$/,
      tip: '请输入正确的短信验证码'
    }
  ],
  nickName: [
    {
      regex: /^[\u4e00-\u9fa5a-zA-Z]{0,12}$|^[\w\d]{0,12}$/,
      tip: '只允许不超过12个字母、数字或汉字'
    }
  ],
  name: [
    {
      regex: /^[\s\S]*.*[^\s][\s\S]*$/,
      tip: '请输入姓名'
    }
  ],
  realBuyerName: [
    {
      regex: /^\S+$/,
      tip: '请输入企业名称'
    }
  ],
  username: [{
    regex: /^.{1,24}$/,
    tip: '请输入昵称'
  }],
  codeNo: [
    {
      regex: /^\w+$/,
      tip: '请输入证件号码'
    },
    {
      regex: /^[0-9a-zA-Z]{1,50}$/,
      tip: '证件号码格式不正确'
    }
  ],
  codeNo1: [
    {
      regex: /^\w+$/,
      tip: '企业代码可输入不超过50个字母或数字'
    },
    {
      regex: /^[0-9a-zA-Z]{1,50}$/,
      tip: '企业代码可输入不超过50个字母或数字'
    }
  ]
}
export default validateRule
