

module.exports = {
     templateExample: (message) => { return `<mjml>
     <mj-head>
       <mj-attributes>
         <mj-all padding="0px"></mj-all>
         <mj-text font-family="Ubuntu, Helvetica, Arial, sans-serif" padding="0 25px" font-size="13px"></mj-text>
         <mj-section background-color="#ffffff"></mj-section>
         <mj-class name="preheader" color="#000000" font-size="11px"></mj-class>
       </mj-attributes>
       <mj-style inline="inline">a { text-decoration: none!important; color: inherit!important; }</mj-style>
     </mj-head>
     <mj-body background-color="#bedae6">
       <mj-section>
         <mj-column width="100%">
           <mj-image src="http://go.mailjet.com/tplimg/mtrq/b/ox8s/mg1q9.png" alt="header image" padding="0px"></mj-image>
         </mj-column>
       </mj-section>
       <mj-section padding-bottom="20px" padding-top="10px">
         <mj-column>
           <mj-text align="center" padding="10px 25px" font-size="20px" color="#512d0b"><strong>Hey {{FirstName}}!</strong></mj-text>
           <mj-text align="center" font-size="18px" font-family="Arial">Are you enjoying our weekly newsletter?<br/> Then why not share it with your friends?</mj-text>
           <mj-text align="center" color="#489BDA" font-size="25px" font-family="Arial, sans-serif" font-weight="bold" line-height="35px" padding-top="20px">Congrats for joining <br/>
             <span style="font-size:18px"></span></mj-text>
           <mj-button background-color="#8bb420" color="#FFFFFF" href="https://mjml.io" font-family="Arial, sans-serif" padding="20px 0 0 0" font-weight="bold" font-size="16px">Join Us</mj-button>
           <mj-text align="center" color="#000000" font-size="14px" font-family="Arial, sans-serif" padding-top="40px">Best, <br /> The Telegram Team
             <p></p>
           </mj-text>
         </mj-column>
       </mj-section>
     </mj-body>
   </mjml>` }}