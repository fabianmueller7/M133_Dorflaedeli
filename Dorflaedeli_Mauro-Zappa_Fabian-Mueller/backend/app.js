'use strict'
import {Router} from 'https://deno.land/x/oak@v6.3.1/mod.ts';


const router = new Router();

router
.get("/api/allProducts", async context => context.response.body = await JSON.parse(await Deno.readTextFile('./backend/products.json')))

.get("/api/productById", async context => {
    const item =  await context.request.body({type: "json"}).value;
    context.response.body = await JSON.parse(await Deno.readTextFile('./backend/products.json')).filter(function (el){return el.id == item.id})
})

.get("/api/addProdcutToCart", async context => { 
    const item =  await context.request.body({type: "json"}).value;
    const cookie = context.cookies.get("productsInCart");
    if(typeof cookie === 'undefined') {
        console.log("undefined");
        let datalist = [];
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
                    objlist[i].count = item.count;
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
        console.log("filter: " + filterproductslist);
        let product = filterproductslist[0];
        console.log("product: " + product);
        product.count = productsCount[i].count;
        result.push(product);
    }
    context.response.body = result;
})

.get("/api/clearCart", context =>{
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