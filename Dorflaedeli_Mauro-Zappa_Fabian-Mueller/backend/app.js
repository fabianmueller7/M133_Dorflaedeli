'use strict'
import {Router} from 'https://deno.land/x/oak@v6.3.1/mod.ts';


const router = new Router();

router
.get("/api/allarticles", async context => context.response.body = await JSON.parse(Deno.readTextFileSync('./products.json')));

export const apiRoutes = router.routes();