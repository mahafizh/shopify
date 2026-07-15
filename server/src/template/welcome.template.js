export const welcomeTemplate = (name) => `
<!DOCTYPE html>
<html>
<body style="margin:0;background:#f5f5f5;font-family:Arial,sans-serif;">

<table width="100%" cellpadding="0" cellspacing="0" bgcolor="#f5f5f5">
<tr>
<td align="center">

<table width="600" cellpadding="0" cellspacing="0"
style="background:#ffffff;border-radius:12px;margin:40px 0;">

<tr>
<td align="center" style="padding:40px 20px;">
<h1 style="color:#2563eb;margin:0;">
Welcome to Shopify 🎉
</h1>
</td>
</tr>

<tr>
<td align="center">
<img
src="https://yourdomain.com/welcome.png"
width="250"
alt="Welcome">
</td>
</tr>

<tr>
<td style="padding:30px 40px;">

<p>Hello <b>${name}</b>,</p>

<p>
Thank you for joining Shopify!
Your account has been successfully created.
</p>

<p>
You can now:
</p>

<ul>
<li>Browse products</li>
<li>Save your wishlist</li>
<li>Track your orders</li>
<li>Receive exclusive offers</li>
</ul>

<div style="text-align:center;margin-top:35px;">

<a href="https://yourdomain.com"
style="
background:#2563eb;
padding:14px 32px;
color:white;
text-decoration:none;
border-radius:8px;
display:inline-block;
font-weight:bold;
">
Start Shopping
</a>

</div>

</td>
</tr>

<tr>

<td
align="center"
style="
padding:25px;
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
