const nodemailer=require('nodemailer')
class email_sender{
    constructor(email_subject,sender_email,sender_pass){
        
        this.email_subject=email_subject
        this.sender_email=sender_email
        this.sender_pass=sender_pass
        this.transporter=null
    }
    create_tranporter(){
      this.transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: this.sender_email,
          pass: this.sender_pass,
        },
        
      });
    }
    send_email(message,recipient_email){
      let mailOptions = {
        from: this.sender_email,
        to: recipient_email,
        subject: this.email_subject,
        html: message,

       
      };
      this.transporter.sendMail(mailOptions, function (err, info) {
        if (err) {
          console.log(err);
        } else {
          console.log(info);
        }
      });

    }
    
}




module.exports={email_sender}

