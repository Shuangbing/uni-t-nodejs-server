const mailgun = require("mailgun-js")
const DOMAIN = "domain.com"
const FROM = "Uni-T Service <service@"+DOMAIN+">"
const mail = mailgun({apiKey: "apikey", domain: DOMAIN})
const subject = "ユニツからの自動配信"

async function VerifyEmail(username, code) {
    const data = {
        from: FROM,
        to: username,
        subject: subject,
        html: "ユニツのご利用ありがとうございます。<br>認証コードは「"+code+"」です (有効期間1時間)"
    }
    return await mail.messages().send(data, function (error, body) {
        if(error) { return false }
        return true
    })
}

module.exports.VerifyEmail = VerifyEmail