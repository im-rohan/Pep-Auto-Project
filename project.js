// node project.js "Immortals of Meluha"
let puppeteer = require("puppeteer");
let fs = require("fs");
link = "https://www.goodreads.com/";
book = process.argv[2];
(async function (){
    let browser = await puppeteer.launch({
        headless : false,
        defaultViewport : null,
        args : ["--start-maximized", "--disable-notifications"],
    });
    let numberofPages = await browser.pages();
    let tab = numberofPages[0];
    await tab.goto(link, {
        waitUntil: "networkidle2"
    });
    await tab.waitForSelector("#sitesearch_field");
    await tab.type("#sitesearch_field", book, { delay: 200 });
    await tab.waitForSelector(".submitLink");
    await tab.click(".submitLink");
    
    await tab.waitForSelector(".modal__content .modal__close button.gr-iconButton");
    await tab.click(".modal__content .modal__close button.gr-iconButton");

    await tab.waitForSelector(".bookTitle");
    await tab.click(".bookTitle");

    await tab.waitForSelector('h1.gr-h1.gr-h1--serif');
    const btitle = await tab.$eval('h1.gr-h1.gr-h1--serif', el => el.innerText.trim());
    console.log("Book Title - " + btitle);
    const author = await tab.$eval(`a.authorName span[itemprop = 'name']`, el => el.innerText);
    console.log('By ' + author);
    
    await tab.waitForSelector('#bookMeta > span:nth-child(2)');
    const rating = await tab.$eval('#bookMeta > span:nth-child(2)', el => el.innerText);
    
    console.log('Ratings - ' + rating);
    
    await tab.waitForSelector('#details > div:nth-child(1) > span:nth-child(1)');
    const format = await tab.$eval('#details > div:nth-child(1) > span:nth-child(1)', el => el.innerText);
    console.log('Book Format - '+format);
    
    await tab.waitForSelector('#details > div:nth-child(1) > span:nth-child(2)');
    const numpage = await tab.$eval('#details > div:nth-child(1) > span:nth-child(2)', el => el.innerText);
    console.log(numpage);
    
    await tab.waitForSelector('#details > div:nth-child(2)');
    const publish = await tab.$eval('#details > div:nth-child(2)', el => el.innerText);
    console.log(publish);

    await tab.waitForSelector(`#buyButton`);
    await tab.click(`#buyButton`);
    
    await tab.waitFor(3000);
    numberofPages = await browser.pages();
    
    let ntab = numberofPages[1];
    
    await ntab.waitForSelector(`li[ id ='p_n_feature_three_browse-bin/9141482031']`);
    await ntab.click(`li[ id ='p_n_feature_three_browse-bin/9141482031']`);

    await ntab.waitForSelector(".a-section.aok-relative.s-image-fixed-height");
    await ntab.click(".a-section.aok-relative.s-image-fixed-height");

    await tab.waitFor(3000);
    numberofPages = await browser.pages();
    
    let page = numberofPages[2];
    
    await page.waitForSelector('.a-size-medium.a-color-price.inlineBlock-display.offer-price.a-text-normal.price3P');
    const price = await page.$eval('.a-size-medium.a-color-price.inlineBlock-display.offer-price.a-text-normal.price3P', el => el.innerText.trim());
    console.log('Price - '+price);
    
    await page.waitForSelector('#ddmDeliveryMessage > b');
    const deldate = await page.$eval('#ddmDeliveryMessage > b', el => el.innerText);
    console.log('Delivery Date - '+deldate);
    
    await page.waitForSelector('#upsell-message > b');
    const fastdel = await page.$eval('#upsell-message > b', el => el.innerText);
    console.log('Fastest Delivery by '+fastdel);
    
})()
