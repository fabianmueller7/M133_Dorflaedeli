'use strict'
import {Router} from 'https://deno.land/x/oak@v6.3.1/mod.ts';


const router = new Router();

router
.get("/api/allProducts", async context => context.response.body = await JSON.parse(await Deno.readTextFile('./backend/products.json')))

.get("/api/productById", async context => {
    const item =  await context.request.body({type: "json"}).value;
    context.response.body = await JSON.parse(await Deno.readTextFile('./backend/products.json')).filter(function (el){return el.id == item.id})})

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
            for (var i = 0; i < objlist.length; i++) {
                if (objlist[i].id === item.id) {
                    objlist[i].count = item.count;
                }
            }
        }
        context.cookies.set("productsInCart", JSON.stringify(objlist));
    }
})

.get("/api/getCart", context => context.response.body = Console.log(context.cookies.get("productsInCart")))

.get("/api/checkoutCart", context => context.response.body = Console.log(context.cookies.get("productsInCart")));

export const apiRoutes = router.routes();