module.exports = (confirmationCode) => {
  return `<!DOCTYPE html>
  <html
    xmlns="http://www.w3.org/1999/xhtml"
    xmlns:v="urn:schemas-microsoft-com:vml"
    xmlns:o="urn:schemas-microsoft-com:office:office"
  >
    <head>
      <title> CONFIRMATION MAIL</title>
      <meta http-equiv="X-UA-Compatible" content="IE=edge" />
      <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <style type="text/css">
        body {
          margin: 0 auto;
          padding: 0;
          width: 600px;
          display: flex;
          flex-direction: column;
          align-items: center;
          -webkit-text-size-adjust: 100%;
          -ms-text-size-adjust: 100%;
        }
        img {
          border: 0;
          height: auto;
          line-height: 100%;
          margin-top: 20px;
          margin-bottom: 30px;
          box-shadow: 4px 7px 23px -2px rgba(0,0,0,0.55);  border-radius: 5px;
          outline: none;
          text-decoration: none;
          -ms-interpolation-mode: bicubic;
        }
        a {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40%;
          height: 30px;
          text-align: center;
          box-shadow: 4px 7px 23px -2px rgba(0,0,0,0.55);  border-radius: 5px;
  
        }
      </style>
    </head>
    <body>
      <a
        href="${process.env.URL_01}${confirmationCode}"
        style="background: #dbdbdb; font-family: Arial, sans-serif; font-size: 16px; font-weight: bold; line-height: 120%; Margin: 0; text-transform: none; text-decoration: none; color: inherit;"
        target="_blank"
      >
        CLICK THE LINK!!!
      </a>
    </body>
  </html>    
  `
  }