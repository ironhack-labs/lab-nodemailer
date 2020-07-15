require('dotenv').config();
const nodemailer = require('nodemailer');
const { getMaxListeners } = require('process');

const user = process.env.NM_USER;
const pass = process.env.NM_PASS;
const host = process.env.HOST || 'http://localhost:3000';

const transport = nodemailer.createTransport({
	service: 'Gmail',
	auth: {
		user: user,
		pass: pass
	}
});

module.exports.sendValidationEmail = (username, email, confirmationCode) => {
	transport.sendMail({
		to: email,
		from: `Ironhack nodemailer welcome! <${username}>`,
		subject: 'We have received your signup!',
		html: `
		<head style="-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;">
		<meta charset="utf-8" style="-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;">
		<!-- utf-8 works for most cases -->
		<meta name="viewport" content="width=device-width" style="-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;">
		<!-- Forcing initial-scale shouldn't be necessary -->
		<meta http-equiv="X-UA-Compatible" content="IE=edge" style="-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;">
		<!-- Use the latest (edge) version of IE rendering engine -->
		<title style="-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;"></title>
		<!-- The title tag shows in email notifications, like Android 4.4. -->
	
		<!-- Web Font / @font-face : BEGIN -->
		<!-- NOTE: If web fonts are not required, lines 9 - 26 can be safely removed. -->
		
		<!-- Desktop Outlook chokes on web font references and defaults to Times New Roman, so we force a safe fallback font. -->
		<!--[if mso]>
					<style>
							* {
									font-family: sans-serif !important;
							}
					</style>
			<![endif]-->
	
		<!-- All other clients get the webfont reference; some will render the font and others will silently fail to the fallbacks. More on that here: http://stylecampaign.com/blog/2015/02/webfont-support-in-email/ -->
		<!--[if !mso]><!-->
		<link href="https://t11media.s3.amazonaws.com/email/transactional/fonts/fonts.css" rel="stylesheet" type="text/css" style="-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;">
		<!--<![endif]-->
	
		<!-- Web Font / @font-face : END -->
	
		<!-- CSS Reset -->
		<style type="text/css" style="-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;">
			/* What it does: Remove spaces around the email design added by some email clients. */
			/* Beware: It can remove the padding / margin and add a background color to the compose a reply window. */
			
			html,
			body {
				Margin: 0 !important;
				padding: 0 !important;
				height: 100% !important;
				width: 100% !important;
			}
			/* What it does: Stops email clients resizing small text. */
			
			* {
				-ms-text-size-adjust: 100%;
				-webkit-text-size-adjust: 100%;
			}
			/* What it does: Centers email on Android 4.4 */
			
			div[style*="margin: 16px 0"] {
				margin: 0 !important;
			}
			/* What it does: Stops Outlook from adding extra spacing to tables. */
			
			table,
			td {
				mso-table-lspace: 0pt !important;
				mso-table-rspace: 0pt !important;
			}
			/* What it does: Fixes webkit padding issue. Fix for Yahoo mail table alignment bug. Applies table-layout to the first 2 tables then removes for anything nested deeper. */
			
			table {
				border-spacing: 0 !important;
				border-collapse: collapse !important;
				table-layout: fixed !important;
				Margin: 0 auto !important;
			}
			
			table table table {
				table-layout: auto;
			}
			/* What it does: Uses a better rendering method when resizing images in IE. */
			
			img {
				-ms-interpolation-mode: bicubic;
			}
			/* What it does: Overrides styles added when Yahoo's auto-senses a link. */
			
			.yshortcuts a {
				border-bottom: none !important;
			}
			/* What it does: A work-around for iOS meddling in triggered links. */
			
			.mobile-link--footer a,
			a[x-apple-data-detectors] {
				color: inherit !important;
				text-decoration: underline !important;
			}
		</style>
	
		<!-- Progressive Enhancements -->
		<style style="-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;">
			/* What it does: Hover styles for buttons */
			
			.button-td,
			.button-a {
				transition: all 100ms ease-in;
			}
			
			.button-td:hover,
			.button-a:hover {
				background: #000000 !important;
				border-color: #000000 !important;
			}
			/* Media Queries */
			
			@media screen and (max-width: 480px) {
				/* What it does: Forces elements to resize to the full width of their container. Useful for resizing images beyond their max-width. */
				.fluid,
				.fluid-centered {
					width: 100% !important;
					max-width: 100% !important;
					height: auto !important;
					Margin-left: auto !important;
					Margin-right: auto !important;
				}
				/* And center justify these ones. */
				.fluid-centered {
					Margin-left: auto !important;
					Margin-right: auto !important;
				}
				/* What it does: Forces table cells into full-width rows. */
				.stack-column,
				.stack-column-center {
					display: block !important;
					width: 100% !important;
					max-width: 100% !important;
					direction: ltr !important;
				}
				/* And center justify these ones. */
				.stack-column-center {
					text-align: center !important;
				}
				/* What it does: Generic utility class for centering. Useful for images, buttons, and nested tables. */
				.center-on-narrow {
					text-align: center !important;
					display: block !important;
					Margin-left: auto !important;
					Margin-right: auto !important;
					float: none !important;
				}
				table.center-on-narrow {
					display: inline-block !important;
				}
				.heading-text {
					font-size: 36px!important;
					line-height: 36px!important;
				}
			}
		</style>
	
	</head>
	
	<body width="100%" bgcolor="#131416" style="margin: 0 !important;background-color: #131416;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;padding: 0 !important;height: 100% !important;width: 100% !important;">
		<div style="background: #131416;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;">
			<table cellpadding="0" cellspacing="0" border="0" height="100%" width="100%" bgcolor="#131416" style="border-collapse: collapse!important;border-spacing: 0!important;margin: 0 auto;table-layout: fixed!important;background: url('https://cdn.shopify.com/s/files/1/0013/7332/files/trans_email_footer.jpg?317488461733349908') no-repeat bottom center/100% auto;max-width: 1000px;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;mso-table-lspace: 0pt !important;mso-table-rspace: 0pt !important;">
				<tbody>
					<tr style="-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;">
						<td valign="top" style="background: url('https://cdn.shopify.com/s/files/1/0013/7332/files/trans_email_header.jpg?317488461733349908') no-repeat top center/100% auto;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;mso-table-lspace: 0pt !important;mso-table-rspace: 0pt !important;">
							<center style="width: 100%;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;">
	
								<!-- Visually Hidden Preheader Text : BEGIN -->
								<div style="display: none;font-size: 1px;line-height: 1px;max-height: 0px;max-width: 0px;opacity: 0;overflow: hidden;mso-hide: all;font-family: sans-serif;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;">
									
								</div>
								<!-- Visually Hidden Preheader Text : END -->
	
								<!--    
							Set the email width. Defined in two places:
							1. max-width for all clients set with Outlook, allowing the email to squish on narrow but never go wider than 600px.
							2. MSO tags for Desktop Windows Outlook enforce a 600px width.
					-->
								<div style="max-width: 680px;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;">
									<!--[if (gte mso 9)|(IE)]>
							<table cellspacing="0" cellpadding="0" border="0" width="680" align="center">
							<tr>
							<td>
							<![endif]-->
	
	
									<!-- Email Letterhead : BEGIN -->
									<table cellspacing="0" cellpadding="0" border="0" align="center" width="100%" style="max-width: 680px;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;mso-table-lspace: 0pt !important;mso-table-rspace: 0pt !important;border-spacing: 0 !important;border-collapse: collapse !important;table-layout: fixed !important;margin: 0 auto !important;">
										<tbody>
											<tr style="-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;">
												<td style="padding: 20px;text-align: center;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;mso-table-lspace: 0pt !important;mso-table-rspace: 0pt !important;">
													<a style="border: none;display: block;padding: 0;-ms-text-size-adjust: 25%;-webkit-text-size-adjust: 25%;" href="https://www.ironhack.com" target="_blank">
														<img src="https://s3-eu-west-1.amazonaws.com/ih-materials/uploads/ironhack-skydive-logo.png" width="25%" style="width: 25%;height: auto;border: none;-ms-text-size-adjust: 25%;-webkit-text-size-adjust: 25%;-ms-interpolation-mode: bicubic;" border="0" alt="ironhack">
													</a>
												</td>
											</tr>
										</tbody>
									</table>
									<!-- Email Letterhead : END -->
	
	
									<!-- Email Header : BEGIN -->
									<table cellspacing="0" cellpadding="0" border="0" align="center" width="100%" style="max-width: 680px;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;mso-table-lspace: 0pt !important;mso-table-rspace: 0pt !important;border-spacing: 0 !important;border-collapse: collapse !important;table-layout: fixed !important;margin: 0 auto !important;">
	
										<tbody>
											<tr style="-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;">
												<td id="heading" class="heading-text" style="padding: 25px 20px 8px 20px;text-align: center;color: #b78846;font-family: 'minion-pro', 'Minion Pro', Georgia, serif;text-transform: uppercase;font-weight: 500;font-size: 42px;line-height: 46px;letter-spacing: 4px;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;mso-table-lspace: 0pt !important;mso-table-rspace: 0pt !important;">
												 ${username}
												</td>
											</tr>
											<tr style="-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;">
												<td id="subheading" style="padding: 0 20px 10px 20px;text-align: center;color: #FFFFFF;text-transform: uppercase;font-family: 'brandon-grotesque', 'Brandon Grotesque', helvetica, arial, sans-serif;font-size: 18px;font-weight: 700;line-height: 24px;letter-spacing: 4px;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;mso-table-lspace: 0pt !important;mso-table-rspace: 0pt !important;">
													Please Confirm Subscription
												</td>
											</tr>
	
											<tr style="-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;">
												<td style="padding: 0 0 10px 0;text-align: center;color: #b78846;text-transform: uppercase;font-family: arial, helvetica, sans-serif;font-size: 12px;font-weight: 700;line-height: 12px;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;mso-table-lspace: 0pt !important;mso-table-rspace: 0pt !important;">
													♦ ♦ ♦
												</td>
											</tr>
	
										</tbody>
									</table>
									<!-- Email Header : END -->
	
	
									<!-- Email Body : BEGIN -->
									<table cellspacing="0" cellpadding="0" border="0" align="center" width="100%" style="max-width: 680px;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;mso-table-lspace: 0pt !important;mso-table-rspace: 0pt !important;border-spacing: 0 !important;border-collapse: collapse !important;table-layout: fixed !important;margin: 0 auto !important;">
										<tbody>
											<tr style="-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;">
												<td style="font-family: 'brandon-grotesque', 'Brandon Grotesque', helvetica, arial, sans-serif;color: #FFFFFF;font-size: 18px;line-height: 22px;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;mso-table-lspace: 0pt !important;mso-table-rspace: 0pt !important;">
	
	
													<!-- Button : Begin -->
													<table cellspacing="0" cellpadding="0" border="0" align="center" style="padding-top: 30px;margin: auto;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;table-layout: fixed !important;mso-table-lspace: 0pt !important;mso-table-rspace: 0pt !important;border-spacing: 0 !important;border-collapse: collapse !important;">
														<tbody>
															<tr style="-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;">
																<td style="background: #b78846;text-align: center;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;transition: all 100ms ease-in;mso-table-lspace: 0pt !important;mso-table-rspace: 0pt !important;" class="button-td">
																	<a href="${host}/auth/confirm/${confirmationCode}" style="background: #b78846;border: 15px solid #b78846;padding: 0 10px;color: #ffffff;font-family: 'brandon-grotesque', 'Brandon Grotesque', helvetica, arial, sans-serif;text-transform: uppercase;letter-spacing: 2px;font-size: 16px;line-height: 1.1;text-align: center;text-decoration: none;display: block;font-weight: bold;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;transition: all 100ms ease-in;"
																		class="button-a" target="_blank">
																		<!--[if mso]>    <![endif]-->Yes, sign me up!
																		<!--[if mso]>    <![endif]-->
																	</a>
																</td>
															</tr>
														</tbody>
													</table>
													<!-- Button : END -->
	
	
													<table border="0" cellpadding="0" cellspacing="0" align="center" width="100%" style="max-width: 660px;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;table-layout: fixed !important;mso-table-lspace: 0pt !important;mso-table-rspace: 0pt !important;border-spacing: 0 !important;border-collapse: collapse !important;margin: 0 auto !important;">
														<tbody>
															<tr style="-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;">
																<td align="center" valign="top" style="font-size: 0;padding: 10px;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;mso-table-lspace: 0pt !important;mso-table-rspace: 0pt !important;">
																	<p style="font-family: 'brandon-grotesque', 'Brandon Grotesque', helvetica, arial, sans-serif;color: #FFFFFF;font-size: 20px;line-height: 32px;margin: 10px 0;display: block;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;">Click the confirmation link above to subscribe and <strong style="-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;">log in immediately!</strong> 
																		.</p>
																</td>
															</tr>
														</tbody>
													</table>
	
	
												</td>
											</tr>
										</tbody>
									</table>
									<!-- Email Body : END -->
	
	
									<!-- Email Footer : BEGIN -->
									<table cellspacing="0" cellpadding="0" border="0" align="center" width="100%" style="max-width: 680px;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;mso-table-lspace: 0pt !important;mso-table-rspace: 0pt !important;border-spacing: 0 !important;border-collapse: collapse !important;table-layout: fixed !important;margin: 0 auto !important;">
										<tbody>
											<tr style="-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;">
												<td style="-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;mso-table-lspace: 0pt !important;mso-table-rspace: 0pt !important;">
													<a style="border: none;display: block;padding: 0;width: 112px;margin: 50px auto 0px auto;text-align: center;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;" href="https://www.ironhack.com" target="_blank">
														<img src="https://s3-eu-west-1.amazonaws.com/ih-materials/uploads/ironhack-skydive-logo.png" width="80" style="width: 80px;height: auto;border: none;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;-ms-interpolation-mode: bicubic;" border="0" alt="ironhack">
													</a>
												</td>
											</tr>
	
											<tr style="-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;">
												<td style="padding: 20px 20px 40px 20px;width: 100%;font-size: 16px;font-family: 'brandon-grotesque', 'Brandon Grotesque', helvetica, arial, sans-serif;mso-height-rule: exactly;line-height: 20px;text-align: center;color: #FFFFFF;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;mso-table-lspace: 0pt !important;mso-table-rspace: 0pt !important;">
													<div style="max-width: 320px;margin: 0 auto;text-align: center;display: inline-block;position: relative;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;">
														He robado este email molón para ver bien cómo funciona el css inline y así también ver cómo se aplica. Nada de esto es mío.
													  Todos los derechos a https://codepen.io/reallygoodemails, aunque lo he modificado un poco
														</div>
												</td>
											</tr>
	
										</tbody>
									</table>
									<!-- Email Footer : END -->
	
									<!--[if (gte mso 9)|(IE)]>
							</td>
							</tr>
							</table>
							<![endif]-->
								</div>
							</center>
						</td>
					</tr>
				</tbody>
			</table>
		</div>
	</body>
		`
	})
}