module.exports.generateTemplate = ((token) => {
    return `<!DOCTYPE html>
    <html>
    <head>
    <title></title>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <style type="text/css">
        /* FONTS */
        @media screen {
            @font-face {
              font-family: 'Lato';
              font-style: normal;
              font-weight: 400;
              src: local('Lato Regular'), local('Lato-Regular'), url(https://fonts.gstatic.com/s/lato/v11/qIIYRU-oROkIk8vfvxw6QvesZW2xOQ-xsNqO47m55DA.woff) format('woff');
            }
            
            @font-face {
              font-family: 'Lato';
              font-style: normal;
              font-weight: 700;
              src: local('Lato Bold'), local('Lato-Bold'), url(https://fonts.gstatic.com/s/lato/v11/qdgUG4U09HnJwhYI-uK18wLUuEpTyoUstqEm5AMlJo4.woff) format('woff');
            }
            
            @font-face {
              font-family: 'Lato';
              font-style: italic;
              font-weight: 400;
              src: local('Lato Italic'), local('Lato-Italic'), url(https://fonts.gstatic.com/s/lato/v11/RYyZNoeFgb0l7W3Vu1aSWOvvDin1pK8aKteLpeZ5c0A.woff) format('woff');
            }
            
            @font-face {
              font-family: 'Lato';
              font-style: italic;
              font-weight: 700;
              src: local('Lato Bold Italic'), local('Lato-BoldItalic'), url(https://fonts.gstatic.com/s/lato/v11/HkF_qI1x_noxlxhrhMQYELO3LdcAZYWl9Si6vvxL-qU.woff) format('woff');
            }
        }
        
        /* CLIENT-SPECIFIC STYLES */
        body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
        table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
        img { -ms-interpolation-mode: bicubic; }
    
        /* RESET STYLES */
        img { border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
        table { border-collapse: collapse !important; }
        body { height: 100% !important; margin: 0 !important; padding: 0 !important; width: 100% !important; }
    
        /* iOS BLUE LINKS */
        a[x-apple-data-detectors] {
            color: inherit !important;
            text-decoration: none !important;
            font-size: inherit !important;
            font-family: inherit !important;
            font-weight: inherit !important;
            line-height: inherit !important;
        }
        
        /* MOBILE STYLES */
        @media screen and (max-width:600px){
            h1 {
                font-size: 32px !important;
                line-height: 32px !important;
            }
        }
    
        /* ANDROID CENTER FIX */
        div[style*="margin: 16px 0;"] { margin: 0 !important; }
    </style>
    </head>
    <body style="background-color: #f4f4f4; margin: 0 !important; padding: 0 !important;">
    
    <!-- HIDDEN PREHEADER TEXT -->
    <div style="display: none; font-size: 1px; color: #fefefe; line-height: 1px; font-family: 'Lato', Helvetica, Arial, sans-serif; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;">
        We're thrilled to have you here! Get ready to dive into your new account.
    </div>
    
    <table border="0" cellpadding="0" cellspacing="0" width="100%">
        <!-- LOGO -->
        <tr>
            <td bgcolor="#FFA73B" align="center">
                <!--[if (gte mso 9)|(IE)]>
                <table align="center" border="0" cellspacing="0" cellpadding="0" width="600">
                <tr>
                <td align="center" valign="top" width="600">
                <![endif]-->
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;" >
                    <tr>
                        <td align="center" valign="top" style="padding: 40px 10px 40px 10px;">
                            <a href="http://litmus.com" target="_blank">
                            </a>
                        </td>
                    </tr>
                </table>
                <!--[if (gte mso 9)|(IE)]>
                </td>
                </tr>
                </table>
                <![endif]-->
            </td>
        </tr>
        <!-- HERO -->
        <tr>
            <td bgcolor="#FFA73B" align="center" style="padding: 0px 10px 0px 10px;">
                <!--[if (gte mso 9)|(IE)]>
                <table align="center" border="0" cellspacing="0" cellpadding="0" width="600">
                <tr>
                <td align="center" valign="top" width="600">
                <![endif]-->
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;" >
                    <tr>
                        <td bgcolor="#ffffff" align="center" valign="top" style="padding: 40px 20px 20px 20px; border-radius: 4px 4px 0px 0px; color: #111111; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 48px; font-weight: 400; letter-spacing: 4px; line-height: 48px;">
                          <h1 style="font-size: 48px; font-weight: 400; margin: 0;">Hello there!</h1>
                        </td>
                    </tr>
                </table>
                <!--[if (gte mso 9)|(IE)]>
                </td>
                </tr>
                </table>
                <![endif]-->
            </td>
        </tr>
        <!-- COPY BLOCK -->
        <tr>
            <td bgcolor="#f4f4f4" align="center" style="padding: 0px 10px 0px 10px;">
                <!--[if (gte mso 9)|(IE)]>
                <table align="center" border="0" cellspacing="0" cellpadding="0" width="600">
                <tr>
                <td align="center" valign="top" width="600">
                <![endif]-->
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;" >
                  <!-- COPY -->
                  <tr>
                    <td bgcolor="#ffffff" align="left" style="padding: 20px 30px 40px 30px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;" >
                      <p style="margin: 0;">We are very glad to welcome you to our community! Click on the button bellow to join the trees and log in</p>
                    </td>
                  </tr>
                  <!-- BULLETPROOF BUTTON -->
                  <tr>
                    <td bgcolor="#ffffff" align="left">
                      <table width="100%" border="0" cellspacing="0" cellpadding="0">
                        <tr>
                          <td bgcolor="#ffffff" align="center" style="padding: 20px 30px 60px 30px;">
                            <table border="0" cellspacing="0" cellpadding="0">
                              <tr>
                                  <td align="center" style="border-radius: 3px;" bgcolor="#FFA73B"><a href="${process.env.HOST || `http://localhost:${process.env.PORT || 3000}`}/activate/${token}" target="_blank" style="font-size: 20px; font-family: Helvetica, Arial, sans-serif; color: #ffffff; text-decoration: none; color: #ffffff; text-decoration: none; padding: 15px 25px; border-radius: 2px; border: 1px solid #FFA73B; display: inline-block;">Confirm Account</a></td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
    
        </tr>
    </table>
        
    </body>
    </html>
    `
})
































/* <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
    <html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
    <head>
      <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
      <!--[if !mso]><!-->
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <!--<![endif]-->
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta name="format-detection" content="telephone=no">
      <meta name="x-apple-disable-message-reformatting">
      <title></title>
      <style type="text/css">
        @media screen {
          @font-face {
            font-family: 'Fira Sans';
            font-style: normal;
            font-weight: 300;
            src: local(''),
            url('https://fonts.gstatic.com/s/firasans/v10/va9B4kDNxMZdWfMOD5VnPKruRA.woff2') format('woff2'),
            url('https://fonts.gstatic.com/s/firasans/v10/va9B4kDNxMZdWfMOD5VnPKruQg.woff') format('woff');
          }
          @font-face {
            font-family: 'Fira Sans';
            font-style: normal;
            font-weight: 400;
            src: local(''),
            url('https://fonts.gstatic.com/s/firasans/v10/va9E4kDNxMZdWfMOD5VflQ.woff2') format('woff2'),
            url('https://fonts.gstatic.com/s/firasans/v10/va9E4kDNxMZdWfMOD5Vfkw.woff') format('woff');
          }
          @font-face {
            font-family: 'Fira Sans';
            font-style: normal;
            font-weight: 500;
            src: local(''),
            url('https://fonts.gstatic.com/s/firasans/v10/va9B4kDNxMZdWfMOD5VnZKvuRA.woff2') format('woff2'),
            url('https://fonts.gstatic.com/s/firasans/v10/va9B4kDNxMZdWfMOD5VnZKvuQg.woff') format('woff');
          }
          @font-face {
            font-family: 'Fira Sans';
            font-style: normal;
            font-weight: 700;
            src: local(''),
            url('https://fonts.gstatic.com/s/firasans/v10/va9B4kDNxMZdWfMOD5VnLK3uRA.woff2') format('woff2'),
            url('https://fonts.gstatic.com/s/firasans/v10/va9B4kDNxMZdWfMOD5VnLK3uQg.woff') format('woff');
          }
          @font-face {
            font-family: 'Fira Sans';
            font-style: normal;
            font-weight: 800;
            src: local(''),
            url('https://fonts.gstatic.com/s/firasans/v10/va9B4kDNxMZdWfMOD5VnMK7uRA.woff2') format('woff2'),
            url('https://fonts.gstatic.com/s/firasans/v10/va9B4kDNxMZdWfMOD5VnMK7uQg.woff') format('woff');
          }
        }
      </style>
      <style type="text/css">
        #outlook a {
          padding: 0;
        }
    
        .ReadMsgBody,
        .ExternalClass {
          width: 100%;
        }
    
        .ExternalClass,
        .ExternalClass p,
        .ExternalClass td,
        .ExternalClass div,
        .ExternalClass span,
        .ExternalClass font {
          line-height: 100%;
        }
    
        div[style*="margin: 14px 0"],
        div[style*="margin: 16px 0"] {
          margin: 0 !important;
        }
    
        table,
        td {
          mso-table-lspace: 0;
          mso-table-rspace: 0;
        }
    
        table,
        tr,
        td {
          border-collapse: collapse;
        }
    
        body,
        td,
        th,
        p,
        div,
        li,
        a,
        span {
          -webkit-text-size-adjust: 100%;
          -ms-text-size-adjust: 100%;
          mso-line-height-rule: exactly;
        }
    
        img {
          border: 0;
          outline: none;
          line-height: 100%;
          text-decoration: none;
          -ms-interpolation-mode: bicubic;
        }
    
        a[x-apple-data-detectors] {
          color: inherit !important;
          text-decoration: none !important;
        }
    
        body {
          margin: 0;
          padding: 0;
          width: 100% !important;
          -webkit-font-smoothing: antialiased;
        }
    
        .pc-gmail-fix {
          display: none;
          display: none !important;
        }
    
        @media screen and (min-width: 621px) {
          .pc-email-container {
            width: 620px !important;
          }
        }
      </style>
      <style type="text/css">
        @media screen and (max-width:620px) {
          .pc-sm-p-35-30 {
            padding: 35px 30px !important
          }
        }
      </style>
      <style type="text/css">
        @media screen and (max-width:525px) {
          .pc-xs-p-25-20 {
            padding: 25px 20px !important
          }
          .pc-xs-fs-30 {
            font-size: 30px !important
          }
          .pc-xs-lh-42 {
            line-height: 42px !important
          }
          .pc-xs-br-disabled br {
            display: none !important
          }
        }
      </style>
      <!--[if mso]>
        <style type="text/css">
            .pc-fb-font {
                font-family: Helvetica, Arial, sans-serif !important;
            }
        </style>
        <![endif]-->
      <!--[if gte mso 9]><xml><o:OfficeDocumentSettings><o:AllowPNG/><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml><![endif]-->
    </head>
    <body style="width: 100% !important; margin: 0; padding: 0; mso-line-height-rule: exactly; -webkit-font-smoothing: antialiased; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; background-color: #f6e6d9; background-image: url('images/Screenshot-2021-02-10-at-09.31.53-yh4.png')" class="">
      <div style="display: none !important; visibility: hidden; opacity: 0; overflow: hidden; mso-hide: all; height: 0; width: 0; max-height: 0; max-width: 0; font-size: 1px; line-height: 1px; color: #151515;"></div>
      <div style="display: none !important; visibility: hidden; opacity: 0; overflow: hidden; mso-hide: all; height: 0; width: 0; max-height: 0; max-width: 0;">
        ‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;
      </div>
      <table class="pc-email-body" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="table-layout: fixed;">
        <tbody>
          <tr>
            <td class="pc-email-body-inner" align="center" valign="top">
              <!--[if gte mso 9]>
                <v:background xmlns:v="urn:schemas-microsoft-com:vml" fill="t">
                    <v:fill type="tile" src="/images/Screenshot.png" color="#f6e6d9"></v:fill>
                </v:background>
                <![endif]-->
              <!--[if (gte mso 9)|(IE)]><table width="620" align="center" border="0" cellspacing="0" cellpadding="0" role="presentation"><tr><td width="620" align="center" valign="top"><![endif]-->
              <table class="pc-email-container" width="100%" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="margin: 0 auto; max-width: 620px;">
                <tbody>
                  <tr>
                    <td align="left" valign="top" style="padding: 0 10px;">
                      <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
                        <tbody>
                          <tr>
                            <td height="20" style="font-size: 1px; line-height: 1px;">&nbsp;</td>
                          </tr>
                        </tbody>
                      </table>
                      <!-- BEGIN MODULE: Call to Action 2 -->
                      <table border="0" cellpadding="0" cellspacing="0" width="100%" role="presentation">
                        <tbody>
                          <tr>
                            <td class="pc-sm-p-35-30 pc-xs-p-25-20" style="padding: 40px; background-color: #ffffff; border-radius: 8px;" valign="top" bgcolor="#ffffff">
                              <table border="0" cellpadding="0" cellspacing="0" width="100%" role="presentation">
                                <tbody>
                                  <tr>
                                    <td class="pc-xs-fs-30 pc-xs-lh-42 pc-fb-font" style="font-family: 'Fira Sans', Helvetica, Arial, sans-serif; font-size: 36px; font-weight: 900; line-height: 46px; letter-spacing: -0.6px; color: #151515; text-align: center;" valign="top">Hello there!</td>
                                  </tr>
                                  <tr>
                                    <td height="10" style="font-size: 1px; line-height: 1px;">&nbsp;</td>
                                  </tr>
                                </tbody>
                                <tbody>
                                  <tr>
                                    <td class="pc-fb-font" style="font-family: 'Fira Sans', Helvetica, Arial, sans-serif; font-size: 20px; font-weight: 300; line-height: 28px; color: #1B1B1B; letter-spacing: -0.2px;" valign="top" align="center">Click on the button bellow to join us</td>
                                  </tr>
                                  <tr>
                                    <td height="15" style="font-size: 1px; line-height: 1px;">&nbsp;</td>
                                  </tr>
                                </tbody>
                                <tbody>
                                  <tr>
                                    <td style="padding: 5px 0;" valign="top" align="center">
                                      <table border="0" cellpadding="0" cellspacing="0" role="presentation">
                                        <tbody>
                                          <tr>
                                            <td style="padding: 13px 17px; border-radius: 8px; background-color: #7cc9c9" bgcolor="#7cc9c9" valign="top" align="center">
                                              <a href="${process.env.HOST || `http://localhost:${process.env.PORT || 3000}`}/activate/${token}" style="line-height: 1.5; text-decoration: none; word-break: break-word; font-weight: 500; display: block; font-family: 'Fira Sans', Helvetica, Arial, sans-serif; font-size: 16px; color: #ffffff;">Activate account</a>
                                            </td>
                                          </tr>
                                        </tbody>
                                      </table>
                                    </td>
                                  </tr>
                                </tbody>
                                <tbody>
                                  <tr>
                                    <td height="15" style="font-size: 1px; line-height: 1px;">&nbsp;</td>
                                  </tr>
                                  <tr>
                                    <td class="pc-fb-font" style="font-family: 'Fira Sans', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 300; line-height: 28px; color: #9B9B9B; text-align: center;" valign="top">This email will expire in 24h</td>
                                  </tr>
                                </tbody>
                              </table>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                      <!-- END MODULE: Call to Action 2 -->
                      <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
                        <tbody>
                          <tr>
                            <td height="20" style="font-size: 1px; line-height: 1px;">&nbsp;</td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </tbody>
              </table>
              <!--[if (gte mso 9)|(IE)]></td></tr></table><![endif]-->
            </td>
          </tr>
        </tbody>
      </table>
      <!-- Fix for Gmail on iOS -->
      <div class="pc-gmail-fix" style="white-space: nowrap; font: 15px courier; line-height: 0;">&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; </div>
    </body>
    </html> */