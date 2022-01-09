'use strict'
import {Router} from 'https://deno.land/x/oak@v6.3.1/mod.ts';


const router = new Router();

router
.get("/api/allArticles", async context => context.response.body = await JSON.parse(await Deno.readTextFile('./backend/products.json')))
.get("/api/articleById", async context => {
    const item =  await context.request.body({type: "json"}).value;
    console.log(item);
    context.response.body = await JSON.parse(await Deno.readTextFile('./backend/products.json')).filter(function (el){return el.id == item.id})
});

export const apiRoutes = router.routes();