每个子任务，涉及的 file 不能超过三个。


[[项目]]

现在我要开发 email 界面的功能。
我要链接 gmail 和 exchange 的邮箱，然后显示邮件。



Next.js 项目中进行开发

核心步骤

安装所需库: 在你的 Next.js 项目中安装 imap-simple 和 mailparser。

创建 API Route: 新建一个 API Route (例如 app/api/emails/route.js) 来处理邮件获取逻辑。
用action server，_action_server.ts 而不是api route。
EXCHANGE_USERNAME=xxxx
EXCHANGE_KEY=ssss


EXCHANGE_SERVER=mail.rwth-aachen.de
EXCHANGE_PORT_POP=995
EXCHANGE_PORT_IMAP=993
EXCHANGE_PORT_SMTP=587

编写获取邮件的后端逻辑: 在 API Route 中，连接到你的 IMAP 服务器，获取邮件，并解析邮件内容。

在前端 mails/page.tsx 中，调用 _action_server.ts 中的 getEmails 函数，获取邮件。



