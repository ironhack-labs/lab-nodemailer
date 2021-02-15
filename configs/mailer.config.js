const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: process.env.NM_USER,
        pass: process.env.NM_PASSWORD
    }
})

module.exports.sendActivationEmail = (email, token) => {
transporter.sendMail({
    from: `'Nodemailer Test' <${process.env.NM_USER}>`,
    to: email,
    subject: "Thanks for joining us",
    html: `
    <!doctype html>
    <html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
      <head>
        <title>
        </title>
        <!--[if !mso]><!-->
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <!--<![endif]-->
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style type="text/css">
          #outlook a { padding:0; }
          body { margin:0;padding:0;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%; }
          table, td { border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt; }
          img { border:0;height:auto;line-height:100%; outline:none;text-decoration:none;-ms-interpolation-mode:bicubic; }
          p { display:block;margin:13px 0; }
        </style>
        <!--[if mso]>
        <xml>
        <o:OfficeDocumentSettings>
          <o:AllowPNG/>
          <o:PixelsPerInch>96</o:PixelsPerInch>
        </o:OfficeDocumentSettings>
        </xml>
        <![endif]-->
        <!--[if lte mso 11]>
        <style type="text/css">
          .mj-outlook-group-fix { width:100% !important; }
        </style>
        <![endif]-->
    <style type="text/css">
      @media only screen and (min-width:480px) {
        .mj-column-per-100 { width:100% !important; max-width: 100%; }
      }
    </style>  
        <style type="text/css">        
        </style>        
      </head>
      <body style="word-spacing:normal;background-color:#bedae6;">        
      <div style="background-color:#bedae6;">      
      <!--[if mso | IE]><table align="center" border="0" cellpadding="0" cellspacing="0" class="" style="width:600px;" width="600" ><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><![endif]-->
             <div style="background:#ffffff;background-color:#ffffff;margin:0px auto;max-width:600px;">        
        <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#ffffff;background-color:#ffffff;width:100%;">
          <tbody>
            <tr>
              <td style="direction:ltr;font-size:0px;padding:0px;text-align:center;">
                <!--[if mso | IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr></tr></table><![endif]-->
              </td>
            </tr>
          </tbody>
        </table>        
      </div>      
      <!--[if mso | IE]></td></tr></table><table align="center" border="0" cellpadding="0" cellspacing="0" class="" style="width:600px;" width="600" ><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><![endif]-->
          <div style="background:#ffffff;background-color:#ffffff;margin:0px auto;max-width:600px;">
            <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#ffffff;background-color:#ffffff;width:100%;">
          <tbody>
            <tr>
              <td style="direction:ltr;font-size:0px;padding:0px;padding-bottom:20px;padding-top:10px;text-align:center;">
                <!--[if mso | IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td class="" style="vertical-align:top;width:600px;" ><![endif]-->
           <div class="mj-column-per-100 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;">
         <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%">
        <tbody>
          <tr>
            <td style="vertical-align:top;padding:0px;">              
      <table border="0" cellpadding="0" cellspacing="0" role="presentation" style width="100%">
        <tbody>          
              <tr>
                <td align="center" style="font-size:0px;padding:0 25px;padding-top:20px;word-break:break-word;">                  
      <div style="font-family:Arial, sans-serif;font-size:25px;font-weight:bold;line-height:35px;text-align:center;color:#489BDA;">Thanks for joining!</div>
                    </td>
              </tr>            
              <tr>
                <td align="center" style="font-size:0px;padding:0 25px;padding-top:30px;word-break:break-word;">                  
      <div style="font-family:Arial;font-size:18px;line-height:1;text-align:center;color:#000000;">Click on the following button<br> to activate your account</div>
                 </td>
              </tr>            
              <tr>
                <td align="center" vertical-align="middle" style="font-size:0px;padding:20px 0 0 0;word-break:break-word;">                  
      <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:separate;line-height:100%;">
        <tr>
          <td align="center" bgcolor="#8bb420" role="presentation" style="border:none;border-radius:3px;cursor:auto;mso-padding-alt:10px 25px;background:#8bb420;" valign="middle">
          <a href="${process.env.HOST || `http://localhost:${process.env.PORT || 3000}`}/activate/${token}" style="display: inline-block; background: #8bb420; font-family: Arial, sans-serif; font-size: 16px; font-weight: bold; line-height: 120%; margin: 0; text-transform: none; padding: 10px 25px; mso-padding-alt: 0px; border-radius: 3px; text-decoration: none; color: inherit;" target="_blank">
              Activate account
            </a>
          </td>
        </tr>
      </table>    
                </td>
              </tr>            
              <tr>
                <td align="center" style="font-size:0px;padding:0 25px;padding-top:40px;word-break:break-word;">                  
      <div style="font-family:Arial, sans-serif;font-size:14px;line-height:1;text-align:center;color:#000000;">Contact our support staff at contact@contact.com
          <p></p></div>    
                </td>
              </tr>            
        </tbody>
      </table>    
            </td>
          </tr>
        </tbody>
      </table>    
      </div>    
          <!--[if mso | IE]></td></tr></table><![endif]-->
              </td>
            </tr>
          </tbody>
        </table>        
      </div>      
      <!--[if mso | IE]></td></tr></table><![endif]-->    
      </div>    
      </body>
    </html>
  `
    
})
}

module.exports.sendActivationAccountMessage = (email, subject) => {

} 
 