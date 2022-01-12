'use strict'
import {Router} from 'https://deno.land/x/oak@v6.3.1/mod.ts';


const router = new Router();

router
.get("/api/allProducts", async context => context.response.body = await JSON.parse(await Deno.readTextFile('./backend/products.json')))

.get("/api/productById", async context => {
    const item =  await context.request.body({type: "json"}).value;
    context.response.body = await JSON.parse(await Deno.readTextFile('./backend/products.json')).filter(function (el){return el.id == item.id})
})

//item.id => itemid, item.count => anzahl +artikel(-1 für Wahrenkorb leeren)
.post("/api/addProdcutToCart", async context => { 
    const item =  await context.request.body({type: "json"}).value;
    const cookie = context.cookies.get("productsInCart");
    if(typeof cookie === 'undefined') {
        console.log("undefined");
        let datalist = [];
        if(item.count < 0) {
            item.count = 0;
        }
        let data = {id: item.id, count : item.count};
        datalist.push(data);
        context.cookies.set("productsInCart", JSON.stringify(datalist));
    } else {
        console.log("exists");
        let datastring = context.cookies.get("productsInCart");
        let objlist = JSON.parse(datastring);
        if(objlist.filter(function (el){return el.id == item.id}).length === 0) {
            //add new product
            objlist.push({ id : item.id , count : item.count}); 
        } else {
            //update existing product
            for (let i = 0; i < objlist.length; i++) {
                if (objlist[i].id === item.id) {
                    objlist[i].count += parseInt(item.count);
                    if(objlist[i].count < 0) {
                        objlist[i].count = 0; 
                    }
                }
            }
        }
        context.cookies.set("productsInCart", JSON.stringify(objlist));
    }
})

.get("/api/getCart", async context => { 
    let productsCount = await JSON.parse(context.cookies.get("productsInCart"));
    let result = [];
    
    for (let i = 0; i < productsCount.length; i++) {
        let filterproductslist = await JSON.parse(await Deno.readTextFile('./backend/products.json')).filter(function (el){return el.id == productsCount[i].id});
        if(filterproductslist[0] !== undefined) {
        let product = filterproductslist[0];
        product.count = productsCount[i].count;
        result.push(product);
        }
    }
    context.response.body = result;
})

.post("/api/clearCart", context =>{
    context.cookies.set("productsInCart", '[]');
})

.get("/api/getCartcount", async context =>{
    let productsCount = await JSON.parse(context.cookies.get("productsInCart"));
    let result = 0;
    
    for (let i = 0; i < productsCount.length; i++) {
        result +=  parseInt(productsCount[i].count);
    }
    context.response.body = result;
});

export const apiRoutes = router.routes();