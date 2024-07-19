const { model } = require('mongoose');
const nodemailer=require('nodemailer');
const pug=require('pug');
const htmlToText=require('html-to-text');

exports.Email=class sendMail{
    constructor(user,url){
        this.user=user
        this.to=user.email;
        this.firstName=user.name.split(' ')[0];
        this.url=url;
        this.from=`Utkarsh Raghuvanshi <${process.env.MY_MAIL}>`
    }

    transporter(){
        if(process.env.NODE_ENV==='production'){
            return 0;
        }

        return nodemailer.createTransport({
            host:process.env.MAIL_HOST,
            port:process.env.MAIL_PORT,
            auth:{
                user:process.env.MAIL_USERNAME,
                pass:process.env.MAIL_PASSWORD
            }
        });
        
    }

   async send(template,subject){

     const html=  pug.renderFile(`${__dirname}/../views/${template}.pug`,{
            firstName:this.firstName,
            url:this.url,
            subject,
            user:this.user
           
        })


        const mailOps={
            from:this.from,
            to:this.to,
            subject,
            html,
            text: htmlToText.convert(html),
            
        }


        await this.transporter().sendMail(mailOps);
    }

     async sendWelcome(){
       await this.send('welcome','Welcome to natorurs.io');
    }
    async resetPassword(){
        await this.send('passwordreset','here is your password reset link')
    }
}

// const sendEmail=async (options)=>{

//     // creating the transporter- for mailTrap NOT G-MAIL
//     console.log(options);
//     const transporter=nodemailer.createTransport({
//         host:process.env.MAIL_HOST,
//         port:process.env.MAIL_PORT,
//         auth:{
//             user:process.env.MAIL_USERNAME,
//             pass:process.env.MAIL_PASSWORD
//         }
//     });
    
//     console.log(transporter);


//     //creating the options for mail

//     const mailOps={
//         from:'Utkarsh Raghuvanshi <utkarshraghuvanshi743@gmail.com>',
//         to:options.email,
//         subject:options.subject,
//         text:options.message
//     }
//     console.log(mailOps);

//    await transporter.sendMail(mailOps);
// }

// module.exports=sendEmail;