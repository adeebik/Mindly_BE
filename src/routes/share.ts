import { Router } from "express"
const shareRouter = Router();
import { Request, Response } from "express";
import { auth } from "../middleware/auth";

shareRouter.post("/mindShare" , auth, (req: Request, res:Response)=>{
    const share = req.params.share;
    if(!share){
    
    }
    

})

shareRouter.get('/:mindShareLink', (req: Request, res:Response)=>{

})

shareRouter.post('/contentShare',auth, (req: Request, res : Response)=>{
    const share = req.params.share;
    const contentId = req.body;



})

shareRouter.get('/:contentShareLink', (req: Request, res : Response)=>{
    
})

export default shareRouter 