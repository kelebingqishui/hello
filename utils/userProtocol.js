/**
 * 协议数据配置文件
 * 采用 HTML 字符串格式，方便 rich-text 组件解析渲染
 */
const serviceHtml = `
  <div style="line-height: 1.8; color: #333; font-family: sans-serif;">
    <p style="text-indent: 2em; margin-bottom: 20px;">
       欢迎您使用<strong>哈基米妙妙屋</strong>小程序。在您注册或使用本小程序服务前，请您务必审慎阅读、充分理解各条款内容，<strong>特别是免除或者限制责任的条款、法律适用和争议解决条款</strong>。如您不同意本协议，请立即停止使用。当您点击确认或实际使用本小程序服务时，即表示您已充分理解并同意接受本协议的全部内容。
    </p>

    <h3 style="font-size: 18px; border-left: 4px solid #07c160; padding-left: 10px; margin-top: 20px;">第一条 定义与服务范围</h3>
    <p>1.1 <strong>本小程序</strong>：指由<strong>该小程序开发者</strong>（以下简称“本方”）开发并运营的【哈基米妙妙屋】小程序。</p>
    <p>1.2 <strong>服务内容</strong>：本方向用户提供包括但不限于用户登录、信息展示、数据新增、数据查询等技术服务。</p>

    <h3 style="font-size: 18px; border-left: 4px solid #07c160; padding-left: 10px; margin-top: 20px;">第二条 用户账号与安全</h3>
    <p>2.1 用户在使用本服务前需通过系统授权登录。用户应妥善保管账号信息及授权状态。</p>
    <p>2.2 用户承诺注册信息真实有效。如因用户提供虚假信息导致的法律后果，由用户自行承担。</p>
    <p>2.3 用户不得将账号转让、借用或售卖给他人。</p>

    <h3 style="font-size: 18px; border-left: 4px solid #07c160; padding-left: 10px; margin-top: 20px;">第三条 用户行为规范</h3>
    <p>3.1 用户不得利用本服务从事以下行为：</p>
    <ul>
      <li>发布、传播、储存危害国家安全、破坏社会稳定、侮辱诽谤他人、色情、暴力等内容。</li>
      <li>从事侵害他人知识产权、商业秘密等合法权利的活动。</li>
      <li>利用技术手段攻击、干扰本小程序的正常运行。</li>
    </ul>
    <p>3.2 若用户违反上述规定，本方有权采取警告、限制功能、封禁账号等措施。</p>

    <h3 style="font-size: 18px; border-left: 4px solid #07c160; padding-left: 10px; margin-top: 20px;">第四条 知识产权声明</h3>
    <p>4.1 本小程序内所有文字、图片、代码等内容的知识产权均归本方或相关权利人所有。</p>
    <p>4.2 未经书面许可，用户不得擅自复制、转载、抓取或用于商业目的。</p>

    <h3 style="font-size: 18px; border-left: 4px solid #07c160; padding-left: 10px; margin-top: 20px;">第五条 免责声明</h3>
    <p>5.1 <strong>【系统维护】</strong>因系统维护、设备故障、黑客攻击等原因导致的服务中断，本方不承担赔偿责任，但将尽力减少影响。</p>
    <p>5.2 <strong>【信息准确性】</strong>部分信息可能来自第三方，本方不保证其绝对准确性，用户应自行核实。</p>
    <p>5.3 <strong>【第三方链接】</strong>本小程序包含指向第三方的链接，用户点击后需自行承担相应风险。</p>

    <h3 style="font-size: 18px; border-left: 4px solid #07c160; padding-left: 10px; margin-top: 20px;">第六条 第三方共享说明</h3>
    <p>6.1 除非获得您的明确同意，我们不会向本方以外的任何公司、组织和个人分享您的个人敏感信息。</p>

    <h3 style="font-size: 18px; border-left: 4px solid #07c160; padding-left: 10px; margin-top: 20px;">第七条 用户权利</h3>
    <p>7.1 <strong>访问与更正</strong>：您可以在“个人中心”中查看或修改您的个人信息。</p>
    <p>7.2 <strong>撤回授权与删除</strong>：您有权撤回授权，但这可能导致相关功能无法继续使用。</p>
    <p>7.3 <strong>注销账号</strong>：我们提供账号注销途径，一旦注销，我们将停止服务并依法处理您的个人信息。</p>

    <h3 style="font-size: 18px; border-left: 4px solid #07c160; padding-left: 10px; margin-top: 20px;">第八条 协议的变更与终止</h3>
    <p>8.1 本方有权修改本协议，并在小程序显著位置公示。</p>
    <p>8.2 若您不同意修改内容，应停止使用；继续使用则视为接受修改后的协议。</p>

    <h3 style="font-size: 18px; border-left: 4px solid #07c160; padding-left: 10px; margin-top: 20px;">第九条 法律适用与争议解决</h3>
    <p>9.1 本协议的订立、执行和解释均适用<strong>中华人民共和国法律</strong>。</p>
    <p>9.2 若双方发生争议，应通过友好协商解决；协商不成的，均有权向<strong>【你的所在地】人民法院</strong>提起诉讼。</p>
  </div>
`;

// 导出
module.exports = {
  serviceHtml: serviceHtml
}