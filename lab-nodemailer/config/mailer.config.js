const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
	service: "Gmail",
	auth: {
		user: process.env.NM_USER,
		pass: process.env.NM_PASSWORD
	}
});

module.exports.sendMessageAck = (email, username, confirmationCode) => {
	transporter.sendMail({
		from: `"Nodemailer Test" <${process.env.NM_USER}>`,
		to: email,
		subject: "Verify your e-mail adress",
		text: "Verify your e-mail adress",
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
                
            <!--[if !mso]><!-->
                <link href="https://fonts.googleapis.com/css?family=Ubuntu:300,400,500,700" rel="stylesheet" type="text/css">
                <style type="text/css">
                @import url(https://fonts.googleapis.com/css?family=Ubuntu:300,400,500,700);
                </style>
            <!--<![endif]-->

            
                
            <style type="text/css">
            @media only screen and (min-width:480px) {
                .mj-column-per-100 { width:100% !important; max-width: 100%; }
            }
            </style>
            
        
                <style type="text/css">
                
                

            @media only screen and (max-width:480px) {
            table.mj-full-width-mobile { width: 100% !important; }
            td.mj-full-width-mobile { width: auto !important; }
            }
        
                </style>
                
                
            </head>
            <body style="word-spacing:normal;background-color:#eeeeee;">
                
                
            <div
                style="background-color:#eeeeee;"
            >
                
            
            <!--[if mso | IE]><table align="center" border="0" cellpadding="0" cellspacing="0" class="" style="width:600px;" width="600" ><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><![endif]-->
            
            
            <div  style="background:#ffffff;background-color:#ffffff;margin:0px auto;max-width:600px;">
                
                <table
                align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#ffffff;background-color:#ffffff;width:100%;"
                >
                <tbody>
                    <tr>
                    <td
                        style="direction:ltr;font-size:0px;padding:20px 0;text-align:center;"
                    >
                        <!--[if mso | IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td class="" style="vertical-align:top;width:600px;" ><![endif]-->
                    
            <div
                class="mj-column-per-100 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;"
            >
                
            <table
                border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%"
            >
                <tbody>
                
                    <tr>
                        <td
                        align="center" style="font-size:0px;padding:10px 25px;word-break:break-word;"
                        >
                        
            <table
                border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:collapse;border-spacing:0px;"
            >
                <tbody>
                <tr>
                    <td  style="width:100px;">
                    
            <img
                height="auto" src="https://i.ibb.co/CQbFhqd/ironhack-logonegro.png" style="border:0;display:block;outline:none;text-decoration:none;height:auto;width:100%;font-size:13px;" width="100"
            />
            
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
            
            
            <!--[if mso | IE]></td></tr></table><table align="center" border="0" cellpadding="0" cellspacing="0" class="" style="width:600px;" width="600" ><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><![endif]-->
            
            
            <div  style="background:#ffffff;background-color:#ffffff;margin:0px auto;max-width:600px;">
                
                <table
                align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#ffffff;background-color:#ffffff;width:100%;"
                >
                <tbody>
                    <tr>
                    <td
                        style="direction:ltr;font-size:0px;padding:20px 0;text-align:center;"
                    >
                        <!--[if mso | IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td class="" style="vertical-align:top;width:600px;" ><![endif]-->
                    
            <div
                class="mj-column-per-100 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;"
            >
                
            <table
                border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%"
            >
                <tbody>
                
                    <tr>
                        <td
                        align="center" style="font-size:0px;padding:10px 25px;word-break:break-word;"
                        >
                        
            <div
                style="font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:13px;line-height:1;text-align:center;color:#555555;"
            ><h1>Hi, ${username}!</h1></div>
            
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
            
            
            <!--[if mso | IE]></td></tr></table><table align="center" border="0" cellpadding="0" cellspacing="0" class="" style="width:600px;" width="600" ><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><![endif]-->
            
            
            <div  style="background:#ffffff;background-color:#ffffff;margin:0px auto;max-width:600px;">
                
                <table
                align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#ffffff;background-color:#ffffff;width:100%;"
                >
                <tbody>
                    <tr>
                    <td
                        style="direction:ltr;font-size:0px;padding:20px 0;text-align:center;"
                    >
                        <!--[if mso | IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td class="" style="vertical-align:top;width:600px;" ><![endif]-->
                    
            <div
                class="mj-column-per-100 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;"
            >
                
            <table
                border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%"
            >
                <tbody>
                
                    <tr>
                        <td
                        align="center" style="font-size:0px;padding:10px 25px;word-break:break-word;"
                        >
                        
            <div
                style="font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:13px;line-height:1;text-align:center;color:#555555;"
            >Your account has been created. Now you have to follow this link to verify your e-mail adress:</div>
            
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
            
            
            <!--[if mso | IE]></td></tr></table><table align="center" border="0" cellpadding="0" cellspacing="0" class="" style="width:600px;" width="600" ><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><![endif]-->
            
            
            <div  style="background:#ffffff;background-color:#ffffff;margin:0px auto;max-width:600px;">
                
                <table
                align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#ffffff;background-color:#ffffff;width:100%;"
                >
                <tbody>
                    <tr>
                    <td
                        style="direction:ltr;font-size:0px;padding:20px 0;text-align:center;"
                    >
                        <!--[if mso | IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td class="" style="vertical-align:top;width:600px;" ><![endif]-->
                    
            <div
                class="mj-column-per-100 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;"
            >
                
            <table
                border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%"
            >
                <tbody>
                
                    <tr>
                        <td
                        align="center" vertical-align="middle" style="font-size:0px;padding:10px 25px;word-break:break-word;"
                        >
                        
            <table
                border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:separate;line-height:100%;"
            >
                <tr>
                <td
                    align="center" bgcolor="#414141" role="presentation" style="border:none;border-radius:3px;cursor:auto;mso-padding-alt:10px 25px;background:#414141;" valign="middle"
                >
                    <a
                    href="${process.env.DOMAIN}/auth/confirm/${confirmationCode}" style="display:inline-block;background:#414141;color:#ffffff;font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:13px;font-weight:normal;line-height:120%;margin:0;text-decoration:none;text-transform:none;padding:10px 25px;mso-padding-alt:0px;border-radius:3px;" target="_blank"
                    >
                    Verify e-mail
                    </a>
                </td>
                </tr>
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
            
            
            <!--[if mso | IE]></td></tr></table><table align="center" border="0" cellpadding="0" cellspacing="0" class="" style="width:600px;" width="600" ><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><![endif]-->
            
            
            <div  style="background:#ffffff;background-color:#ffffff;margin:0px auto;max-width:600px;">
                
                <table
                align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#ffffff;background-color:#ffffff;width:100%;"
                >
                <tbody>
                    <tr>
                    <td
                        style="direction:ltr;font-size:0px;padding:20px 0;text-align:center;"
                    >
                        <!--[if mso | IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td class="" style="vertical-align:top;width:600px;" ><![endif]-->
                    
            <div
                class="mj-column-per-100 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;"
            >
                
            <table
                border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%"
            >
                <tbody>
                
                    <tr>
                        <td
                        align="center" style="font-size:0px;padding:10px 25px;word-break:break-word;"
                        >
                        
            <div
                style="font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:13px;line-height:1;text-align:center;color:#555555;"
            >You can also follow this link:
                <a href="${process.env.DOMAIN}/auth/confirm/${confirmationCode}">${process.env.DOMAIN}/auth/confirm/${confirmationCode}</a></div>
            
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
};