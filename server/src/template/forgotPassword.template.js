export const forgotPasswordTemplate = (name, resetUrl) =>`
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

<p>We received a request to reset your password. If you didn't make this request, please ignore this email.</p>
<p>To reset your password, click the button below:</p>
<div style="text-align: center; margin: 30px 0;">
  <a href=${resetUrl} style="background-color: #4CAF50; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Reset Password</a>
</div>
<p>This link will expire in 15 minutes for security reasons.</p>

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
