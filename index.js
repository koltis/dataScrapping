const puppeteer = require("puppeteer");

const search = async() => {
    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto(
            "https://www.amazon.es/?&tag=hydesnav-21&ref=pd_sl_781oit2196_e&adgrpid=55589983189&hvpone=&hvptwo=&hvadid=366505385431&hvpos=1t1&hvnetw=g&hvrand=16460705958279548807&hvqmt=e&hvdev=c&hvdvcmdl=&hvlocint=&hvlocphy=9061043&hvtargid=kwd-10573980&hydadcr=4855_1809861&gclid=EAIaIQobChMI_5Tnk5-k5wIVA4fVCh079AFTEAAYASAAEgIne_D_BwE", { waitUntil: "networkidle2" }
        );
        await page.type("input#twotabsearchtextbox.nav-input", "galletas");
        await Promise.all([
            page.waitForNavigation(),
            page.click("input.nav-input")
        ]);
        const products = await page.evaluate(() => {
            let i = 0
            let price = 0
            const nodeListImg = Array.from(document.querySelectorAll('img.s-image')).map((img) => {
                !img.closest('div.s-include-content-margin.s-border-bottom').querySelector('span.a-price-whole') ? price = "0" :
                    price = img.closest('div.s-include-content-margin.s-border-bottom').querySelector('span.a-price-whole').innerText;
                const productLink = img.closest('div.s-include-content-margin.s-border-bottom').querySelector('a').href
                const description = img.alt
                const imgLink = img.src
                price = Number(price.replace(',', '.'))
                    ++i
                return { i, description, price, imgLink, productLink }
            })
            return nodeListImg
        })
        await browser.close()
        const orderedProducts = products.sort((a, b) => {
            return (a.price > b.price) ? -1 : (a.price < b.price) ? 1 : 0
        })
        orderedProducts.forEach(value => console.log(value))
    } catch (e) {
        console.log(e.message);
    }
};
search();