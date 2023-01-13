const express = require('express');
const puppeteer = require('puppeteer')
const cheerio = require('cheerio');
const nodemailer = require('nodemailer')
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());

app.get("/",(req,res)=>{
    res.send("hello");
})

const configureBrowser = async (url) => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);
    return page;
}

const checkprice = async (page) => {
    await page.reload();
    let html = await page.evaluate(() => document.body.innerHTML);
    const $ = cheerio.load(html);
   const price = $('span.a-price-whole').text();
        return price;
   
}
app.post('/track-price',async(req,res)=>{

    try {
        const {productlink ,desiredprice, Usermail} = req.body;
        
            const page =await configureBrowser(productlink);
           const currentPrice =await checkprice(page);
          console.log(currentPrice);
        

         if(currentPrice<=desiredprice){
            sendNotification(productlink,currentPrice,Usermail);
         }

         res.json({success: true});
    } catch (error) {
        
        res.json({success:false,error:error.message});
    }
});

const transport = nodemailer.createTransport({
    host:'smtp.gmail.com',
    port:587,
    secure: false,
    auth:{
      user: process.env.MAIL_ID,
      pass:process.env.PASS 
    }
 
 });
const sendNotification = async (productlink,currentPrice,Usermail)=>{
    
    const message ={
        from: 'Price Tracker <noreply@example.com>',
        to: Usermail,
        subject: 'Price Drop Alert',
        text: `The price of the product at ${productlink} has dropped to ${currentPrice}! `
    };
    await transport.sendMail(message);
}

app.listen(process.env.port || 3000,()=>{
    console.log("listening to the requests");
})