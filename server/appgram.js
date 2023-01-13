const express = require('express');
const puppeteer = require('puppeteer')
const cheerio = require('cheerio');
const nodemailer = require('nodemailer')
const TelegramBot = require('node-telegram-bot-api');
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
        const {productlink ,desiredprice, ChatID} = req.body;
        
            const page =await configureBrowser(productlink);
           const currentPrice =await checkprice(page);
          console.log(currentPrice);
        

         if(currentPrice<=desiredprice){
            sendNotification(productlink,desiredprice,ChatID);
            res.redirect("index");
         }

         res.json({success: true});
    } catch (error) {
        // console.log("ni chl rha");
        res.json({success:false,error:error.message});
    }
});


 
 const token = process.env.TOKEN;
const sendNotification = async (productlink ,desiredprice,ChatID)=>{
   
const bot = new TelegramBot(token, { polling: true });

bot.sendMessage(ChatID, `The price of the product you were tracking has reached your desired price of ${desiredprice}. Here's the product link ${productlink}`);

    
}

app.listen(process.env.port || 3000,()=>{
    console.log("listening to the requests");
})