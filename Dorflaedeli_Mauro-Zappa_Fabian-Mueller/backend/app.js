'use strict'
import {Router} from 'https://deno.land/x/oak@v6.3.1/mod.ts';
import {v4} from 'https://deno.land/std@0.77.0/uuid/mod.ts';


//status
//1 = ToDo
//2 = Progress
//3 = Done
let list = [
    {id: v4.generate(), name: "Meeting for Kanban Project at 17.50.", description: "Meeting Kanban", status: 3},
    {id: v4.generate(), description: "Study Page 185+186 in Dornbader.", title: "Physics Test!", status: 1 },
    {id: v4.generate(), description: "Mathematics Page 19, Number 3+4.", title: "Homework", status: 2},
];

const router = new Router();

router
.get("/api", context => context.response.body = list);

export const apiRoutes = router.routes();