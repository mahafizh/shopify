export const verificationTemplate = (name, verificationToken) => `
<!DOCTYPE html>
<html>
<body style="margin:0;background:#f5f5f5;font-family:Arial,sans-serif;">

<table width="100%" cellpadding="0" cellspacing="0" bgcolor="#f5f5f5">
<tr>
<td align="center">

<table width="600" cellpadding="0" cellspacing="0"
style="background:#ffffff;border-radius:12px;margin:40px 0;">

<tr>
<td style="padding:30px 40px;">

<p>Hello <b>${name}</b>,</p>

<p>
Verify Your Email!
</p>
<div style="text-align: center; margin: 30px 0;">
      <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #4CAF50;">${verificationToken}</span>
</div>
<p>
<span>
Please verify your email by enter this verification code on the 
</span><a style="color:#0000FF">verification page</a>
</p>
<p>
This code will expire in 15 minutes. If you didn't create an account with this email or didn't sending an email verification request, please ignore this email.
</p>
<div style="text-align:center;margin-top:35px;">

</div>

</td>
</tr>

<tr>

<td
align="center"
style="
padding:10px;
background:#f8fafc;
color:#666;
font-size:13px;
">

Need help?
<br>

support@shopify.com

</td>

</tr>

</table>

</td>
</tr>
</table>

</body>
</html>
`;
