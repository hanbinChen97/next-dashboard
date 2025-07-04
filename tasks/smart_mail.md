我要做一个智能邮件助手，能够根据邮件内容，选出重要的邮件，并告诉我，我可能需要的做的下一步工作。

先做一个 interface，然后 mock 一个 agent function。 后期我会用 llm 来实现。

帮我从我的邮件里 mock 几个紧急 data, 显示在 app/(routes)/(dashboard)/page.tsx
<EmailSection emails={importantEmails} />

todo:
llm