import { Router } from "express"
import ProductManager from "../Managers/productManager.js";
const router = Router()
const productService = new ProductManager();

const admin = true

router.get("/",async(req,res)=>{
    let products = await productService.getProducts();
    res.send({status:"sucess",payload:products})
})

router.get("/:pid",async(req,res)=>{
    const {pid} = req.params
    const id = parseInt(pid)
    const existsProduct = await productService.exists(id);
if(!existsProduct) return res.status(404).send({status:"error",error:"Product not found"})
    const product = await productService.getProductById(id)
    res.send({status:"success",payload:product})
})

router.post("/",async(req,res)=>{
    if (admin) {
        const {title,description,thumbnail,price,stock}= req.body;
    if(!title||!description||!thumbnail||!price||!stock) return res.status(400).send({status:"error",error:"Incomplete values"})
    let timestamp = Date.now();
    let code = Math.random().toString(16).slice(2)
    const productToInsert ={
        timestamp,
        title,
        description,
        code,
        thumbnail,
        price,
        stock
    }
    const result = await productService.addProduct(productToInsert);
    res.send({status:"success",payload:result})
    } else {
        res.send({status:"error",error:"Admin only"})
    }
})
router.put("/:pid",async(req,res)=>{
    if(admin){
        const {pid} = req.params
        const id = parseInt(pid)
        const existsProduct = await productService.exists(id);
        if(!existsProduct) return res.status(404).send({status:"error",error:"Product not found"})
        const {title,description,thumbnail,price,stock}= req.body;
    if(!title||!description||!thumbnail||!price||!stock) return res.status(400).send({status:"error",error:"Incomplete values"})
    let timestamp = Date.now();
    let code = Math.random().toString(16).slice(2)
    const productToPut ={
        timestamp,
        title,
        description,
        code,
        thumbnail,
        price,
        stock
    }
    const result = await productService.putProduct(productToPut, id)
    res.send({status:"success",payload:result})
    }else{
        res.send({status:"error",error:"Admin only"})
    }
})
router.delete("/:pid",async(req,res)=>{
    if(admin){
        const {pid} = req.params
        const id = parseInt(pid)
        const existsProduct = await productService.exists(id);
        if(!existsProduct) return res.status(404).send({status:"error",error:"Product not found"})
        const deletedProduct = productService.deleteById(id)
        res.send({status:"succes",payload:deletedProduct,message:"Product deleted successfully"})
    }else{
        res.send({status:"error",error:"Admin only"})
    }
})

export default router