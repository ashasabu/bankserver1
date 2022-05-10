//server creation
// import express
const express=require('express')
//import data.service
const dataService=require('./services/data.service')

//jsonwebtoken import
const jwt=require('jsonwebtoken')
//import cors
const cors=require('cors')
//create server app using express
const app=express()

//use cores in server app
app.use(cors({

    origin:'http://localhost:4200'
}))

//to parse json data
app.use(express.json())

//set port number
app.listen(3000,()=>{
    console.log("server started at 3000");
})
//resolve api call
app.get('/',(req,res)=>{
    res.send("GET REQUEST")
})
app.post('/',(req,res)=>{
    res.send("POST REQUEST")
})
app.patch('/',(req,res)=>{
    res.send("PATCH REQUEST")
})
app.put('/',(req,res)=>{
    res.send("PUT REQUEST")
})
app.delete('/',(req,res)=>{
    res.send("delete REQUEST")
})

//bank server

//jwtMiddleware
const jwtMiddleware=(req,res,next)=>{
    try{
        const token=req.headers["x-access-token"]
        const data=jwt.verify(token,'supersecret123456789')
        req.currentAcno=data.currentAcno
        next()
    }
    catch{
        res.status(401).json({
            status:false,
            message:"Please login!!!"
        })
    }
}

//register api
app.post('/register',(req,res)=>{
  dataService.register(req.body.username,req.body.acno,req.body.password)
  .then(result=>{
    res.status(result.statusCode).json(result)

  })
})

//login api 
app.post('/login',(req,res)=>{
    dataService.login(req.body.acno,req.body.pswd)
    .then(result=>{
        res.status(result.statusCode).json(result)
    
      })
  })
  //deposit api

  app.post('/deposit',jwtMiddleware,(req,res)=>{
    dataService.deposit(req.body.acno,req.body.pswd,req.body.amt)
    .then(result=>{
        res.status(result.statusCode).json(result)
    
      })
  })

  //withdraw
  app.post('/withdraw',jwtMiddleware,(req,res)=>{
    dataService.withdraw(req,req.body.acno,req.body.pswd,req.body.amt)
    .then(result=>{
        res.status(result.statusCode).json(result)
 })
  })

  //transaction
  app.post('/transaction',jwtMiddleware,(req,res)=>{
      dataService.transaction(req.body.acno)
      .then(result=>{
        res.status(result.statusCode).json(result)
 })  })

 app.delete('/onDelete/:acno',jwtMiddleware,(req,res)=>{
    dataService.deleteAcc(req.params.acno)
    .then(result=>{
        res.status(result.statusCode).json(result)
    
      })
  })
