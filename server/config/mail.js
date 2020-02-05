const mailjet = require('node-mailjet')
    .connect(process.env.MAIL_ID, process.env.MAIL_KEY)

async function VerifyEmail(username, code) {
    const request = mailjet
        .post("send", { 'version': 'v3.1' })
        .request({
            "Messages": [
                {
                    "From": {
                        "Email": "account@noreply.uni-t.cc",
                        "Name": "Uni-T Account"
                    },
                    "To": [
                        {
                            "Email": username,
                            "Name": "Uni-T User"
                        }
                    ],
                    "Subject": "[Uni-T]新規登録認証コード",
                    "TextPart": "認証用コードの通知",
                    "HTMLPart": "ユニツのご利用ありがとうございます。<br>認証コードは「" + code + "」です (有効期間1時間)",
                    "CustomID": "AppGettingStartedTest"
                }
            ]
        })
    return await request
        .then(() => {
            return true
        })
        .catch(() => {
            return false
        })
}

module.exports.VerifyEmail = VerifyEmail




