const {sequelize,user}=require('../models/users_model')
const bcrypt = require('bcrypt');


async function check_email_exist(email){

let result=await user.findAll({attributes:['email'],where:{email:email}})

if(result.length===0){
    return false
}
else{
    return true
}
    
}
async function display_store_name(email){

    let result=await user.findAll({attributes:['store'],where:{email:email}})
    return result
}

async function verify_password(email,password){
  
    let result=await user.findAll({attributes:['password'],where:{email:email}})
   
        let password_in_json=""
        result.forEach((element)=>{
            password_in_json=element.toJSON()
            
            
        })
        
     
        let res=await bcrypt.compare(password,password_in_json['password'])
        return res
          
}


async function insert_data({email,fname,password,store}){
let result=await user.create({email:email,fname:fname,password:password,store:store})
.then((data)=>{
    return {message:"data inserted successfully"}
})
.catch((err)=>{
    throw err
})

   
}
















module.exports={check_email_exist,verify_password,insert_data,display_store_name}
