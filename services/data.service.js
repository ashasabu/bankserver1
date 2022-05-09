//jsonwebtoken import
const jwt=require('jsonwebtoken')

//import db
const db=require('./db')
database={
    1000:{acno:1000,username:"meena",password:1000,balance:5000,transaction:[]},
    1001:{acno:1001,username:"neena",password:1001,balance:3000,transaction:[]},
    1002:{acno:1002,username:"aneena",password:1002,balance:4000,transaction:[]}
  }

 const register= (username,acno,password)=>{
   
    //asynchronous
    return db.User.findOne({acno})
    .then(user=>{
      if(user){
        //user exist
        return {
          statusCode:401,
          status:false,
          message:"Account number already exist"
        }
      }
else{
  const newUser=new db.User({
    acno,
    username,
    password,
    balance:0,
    transaction:[]
  })
  newUser.save()
  return  {
    statusCode:200,
    status:true,
    message:"Successfully registered...Please login"

  } 
}
    })
 
    
   }

  const login=(acno,pswd)=>{
    //assynchronous 
   return db.User.findOne({acno,password:pswd})
    .then(user=>{
      if(user){
        currentUser=user.username
        currentAcno=acno
        //token generate
        const token=jwt.sign({
          currentAcno:acno
        },'supersecret123456789')
      return {
        statusCode:200,
        status:true,
        message:"Login Sucessfull...",
        token:token,
        currentAcno,
        currentUser
      } 
      }
      else{
        return{
          statusCode:401,
        status:false,
        message:"Invalid Creditials"
        }
       
      }
    })
  }
//deposit
 const deposit=(acno,pswd,amt)=>{
    let amount=parseInt(amt)
    return db.User.findOne({acno,password:pswd})
    .then(user=>{
      if(user){
        user.balance+=amount
        user.transaction.push(
          {
            type:"CREDIT",
            amount:amount
          }
        )
       // console.log(database);
   user.save()
  return  {
    statusCode:200,
    status:true,
    message:amount+"successfully debited... And new balance is"+ user.balance

  }
      }

     else{
      return{
        statusCode:401,
      status:false,
      message:"Invalid Creditials"
      }
     } 
    })
    }

  const withdraw=(req,acno,pswd,amt)=>{
    let amount=parseInt(amt)
    return db.User.findOne({acno,password:pswd})
    .then(user=>{
      if(req.currentAcno!=acno){
        return{
          statusCode:422,
          status:false,
          message:"Operation Denied"
        }
      }
      if(user){
        if(user.balance>amount){
          user.balance-=amount
           user.transaction.push(
            {
              type:"DEBIT",
              amount:amount
            }
          )
         // console.log(database);
     user.save()
    return  {
      statusCode:200,
      status:true,
      message:amount+"successfully debited... And new balance is"+ user.balance
  
    }
          }
          else{
//insufficient
return {
  statusCode:422,
  status:false,
  message:"Insufficient balance"
}

          }
      }
      else{
        return{
          statusCode:401,
        status:false,
        message:"Invalid Creditials"
        }
      }

    })
    ///
    
    
  }

  const transaction=(acno)=>{
    return db.User.findOne({acno})
    .then(user=>{
      if(user){
        return  {
          statusCode:200,
          status:true,
          transaction:user.transaction
        } 
      }
      else{
        return  {
          statusCode:401,
          status:false,
          message:"user does not exist"
        }
      }
    })
  }



   
   //export
   module.exports={
    register,
    login,
    deposit,
    withdraw,
    transaction
   }