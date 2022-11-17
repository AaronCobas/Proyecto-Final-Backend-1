import { Router } from "express"
import CartManager from "../Managers/CartManager.js";
import ProductManager from "../Managers/productManager.js";

const router = Router()
const productService = new ProductManager();
const cartService = new CartManager();

router.post("/",async(req,res)=>{
    const newCart = await cartService.addCart();
    const cartId = newCart.id
    res.send({status:"success",payload:newCart, cartId:cartId})
})

router.delete("/:cid",async(req,res)=>{
    const {cid} = req.params
    const id = parseInt(cid)
    const existsCart = await cartService.exists(id);
    if(!existsCart) return res.status(404).send({status:"error",error:"Cart not found"})
    const deletedCart = cartService.deleteCartById(id)
    res.send({status:"success",payload:deletedCart,message:"Cart deleted successfully"})
})

router.get("/:cid/products",async(req,res)=>{
    const {cid} = req.params
    const id = parseInt(cid)
    const existsCart = await cartService.exists(id);
    if(!existsCart) return res.status(404).send({status:"error",error:"Cart not found"})
    const cart = await cartService.getCartById(id)
    res.send({status:"success",payload:cart})
})

router.post("/:cid/products",async(req,res)=>{
    const {cid} = req.params
    const {id,quantity}= req.body;
    if(!id||!quantity) return res.status(400).send({status:"error",error:"Incomplete values"})
    const cartId = parseInt(cid)
    const productId = parseInt(id)
    const quantityProducts = parseInt(quantity)
    const existsCart = await cartService.exists(cartId);
    const existsProduct = await productService.exists(productId);
    if(!existsCart) return res.status(404).send({status:"error",error:"Cart not found"})
    if(!existsProduct) return res.status(404).send({status:"error",error:"Product not found"})
    const productCheck = await cartService.checkProduct(cartId, productId)
    if(productCheck){
        const result = await cartService.updateCartwithProduct(cartId,productId,quantityProducts)
        res.send({status:"success",payload:result})
    }else{
        const result = await cartService.addProductToCart(cartId,productId,quantityProducts);
        res.send({status:"success",payload:result})
    }
})

router.delete("/:cid/products/:pid",async(req,res)=>{
    const {cid,pid} = req.params
    const cartId = parseInt(cid)
    const productId = parseInt(pid)
    const existsCart = await cartService.exists(cartId);
    const existsProduct = await productService.exists(productId);
    if(!existsCart) return res.status(404).send({status:"error",error:"Cart not found"})
    if(!existsProduct) return res.status(404).send({status:"error",error:"Product not found"})
    const result = await cartService.deleteById(cartId,productId)
    res.send({status:"sucess",payload:result})
})

export default router