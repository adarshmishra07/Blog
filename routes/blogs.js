const express = require('express')
const router = express.Router()
const {ensureAuth} = require('../middleware/auth')

const Blog = require('../models/Blog')

router.get('/add' ,ensureAuth,(req,res)=>{
    res.render('blogs/add')
})
 
router.post('/',ensureAuth, async (req,res)=>{
    try{
        req.body.user = req.user.id
        await Blog.create(req.body)
        res.redirect('/dashboard')
    }
    catch(err){
        console.error(err)
        return res.render('error/500')
    }
})


router.get('/' ,ensureAuth,async(req,res)=>{
    try{
       const blogs= await Blog.find({status : 'public'}).populate('user').sort({createdAt: 'desc'}).lean()
       
        res.render('blogs/index',{blogs})
    }catch(err){
        console.error(err)
        return res.render('error/500')
    }
})

router.get('/view/:id',async(req,res)=>{
    try{
    let blog= await  Blog.findById(req.params.id).populate('user').lean()
    if(!blog){
        res.redirect('error/404')
    }else{
        res.render('blogs/view',{blog})
    }
}catch(err){
    console.error(err)
    return res.render('error/404')
}
})

router.get('/edit/:id',ensureAuth ,async(req,res)=>{
    try {
        const blog = await Blog.findOne({
          _id: req.params.id,
        }).lean()
    
        if (!blog) {
          return res.render('error/404')
        }
    
        if (blog.user != req.user.id) {
          res.redirect('/blogs')
        } else {
          res.render('blogs/edit', {
            blog,
          })
        }
      } catch (err) {
        console.error(err)
        return res.render('error/500')
      }
})

router.put('/:id' ,ensureAuth, async(req,res)=>{
    try {
        let blog = await Blog.findById(req.params.id).lean()
    
        if (!blog) {
          return res.render('error/404')
        }
    
        if (blog.user != req.user.id) {
          res.redirect('/blogs')
        } else {
          story = await Blog.findOneAndUpdate({ _id: req.params.id }, req.body, {
            new: true,
            runValidators: true,
          })
    
          res.redirect('/dashboard')
        }
      } catch (err) {
        console.error(err)
        return res.render('error/500')
      }
    
})




router.delete('/:id',async(req,res)=>{
    try{
        await Blog.deleteOne({_id:req.params.id})
        res.redirect('/dashboard')
    }
    catch(err){
        console.error(err)
        return res.render('error/500')
    }
})
module.exports = router