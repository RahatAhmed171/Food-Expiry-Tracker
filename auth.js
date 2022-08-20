var users_db=require('./databases/users')
const {product_displayer,product_insert_delete,expiry_date_updater}=require('./databases/products')
const{schedule_task}=require('./schedule_task')
const http = require("http");
const fs = require('fs').promises;
const url = require("url")
const formidable = require("formidable");
require('dotenv').config()
const jwt=require('jsonwebtoken')
const jwt_decode=require("jwt-decode")
const bcrypt = require('bcrypt');



let json_header="application/json"
let html_header="text/html"
const server = http.createServer(function(req, res) {
    
    let parsedURL = url.parse(req.url, true);
    let path = parsedURL.pathname;
    path = path.replace(/^\/+|\/+$/g, "");
    

    let form= new formidable.IncomingForm()
    form.parse(req,function(err,fields,files){
        if(err){
            console.error(err.message)
            return
        }
    
  
   
    let route=routes[path]
    console.log(route)
    
    route(fields,res)
})
    
})

let routes={
    "loginOperation":function(data,res){
    
    let parsed_email=data['Email']
    let parsed_password=data['Password']
    verify_a_user(parsed_email,parsed_password).then((is_verified)=>{
        
        if(is_verified){
            
            let token=generate_token(parsed_email)
            send_response(res,{res_type:json_header,res_code:200,res_body:{message:"Login Successful",mytoken:token}})
            
        }
        else{
            
            send_response(res,{res_type:json_header,res_code:200,res_body:{message:"Login Unsuccessful"}})
           

        }
    })
    .catch((err)=>{
    send_response(res,{res_type:json_header,res_code:200,res_body:{message:"Login operation failed due to internal error"}})

    })
    
   

},

    "registerOperation":function(data,res){
        
        let parsed_email=data['Email']
        let parsed_fname=data['Fname']
        let parsed_password=data['Password']
        let parsed_store=data['Store']
        users_db.check_email_exist(parsed_email)
        .then((is_duplicate)=>{

            if(is_duplicate){
                send_response(res,{res_type:json_header,res_code:200,res_body:{message:"Registration Unsuccessful"}})
             
                //
            }
            else{
                
                hash_password(parsed_password)
                .then((hashed_password)=>{
                    users_db.insert_data({email:parsed_email,fname:parsed_fname,password:hashed_password,store:parsed_store})
                    .then((result)=>{
                        console.log(`A new user named "${parsed_email}" registered successfully`)
                        send_response(res,{res_type:json_header,res_code:200,res_body:{message:"Registration Successful"}})
                        
                    })
                .catch((err)=>{
                send_response(res,{res_type:json_header,res_code:200,res_body:{message:"Registration failed due to internal error"}})
    
                })
                })
                .catch((err)=>{
                    send_response(res,{res_type:json_header,res_code:200,res_body:{message:"Registration failed due to internal error"}})

                })
              
            }

        })
        .catch((err)=>{
            send_response(res,{res_type:json_header,res_code:200,res_body:{message:"Registration failed due to internal error"}})
        })
   
            
        
       

        
        
    },
    "display_products":function(data,res){
        
            let parsed_token=data['mytoken']
            let is_token_valid=verify_token(parsed_token)
            if(is_token_valid){
                let decoded_token=decode_token(parsed_token)
                let user=decoded_token['email']
                product_displayer.display_all_products(user)
                .then((result)=>{
                    send_response(res,{res_type:json_header,res_code:200,res_body:{message:"Product fetch successful",allproducts:result}})
                  
                })
                .catch((err)=>{
                    send_response(res,{res_type:json_header,res_code:200,res_body:{message:'Failed to do the operation due to internal error'}})

                })
                

            }
            else{
                send_response(res,{res_type:json_header,res_code:403,res_body:{message:"Error 403 Forbidden. You need to login to view this page"}})
               
            }
        
     
    },
    "add_a_product":function(data,res){
        let parsed_token=data['mytoken']
        let is_token_valid=verify_token(parsed_token)
        if(is_token_valid){
            let parsed_product_name=data['product_name']
            let parsed_product_type=data['product_type']
            let parsed_expiration_date=data['expiration_date']
           
            let decoded_token=decode_token(parsed_token)
            let user=decoded_token['email']
            // check for product duplication
            product_insert_delete.check_product_exist(parsed_product_name,user)
            .then((is_duplicate)=>{
                if (is_duplicate){
                    send_response(res,{res_type:json_header,res_code:200,res_body:{message:"Product with that name already exists"}})
                    
                }
                else{
                product_insert_delete.insert_a_product({product_name:parsed_product_name,product_type:parsed_product_type,expiration_date:parsed_expiration_date,email:user})
                .then((result)=>{
                 
                    send_response(res,{res_type:json_header,res_code:200,res_body:{message:"Product inserted successfully"}})    
                })
                .catch((err)=>{
                    console.log(err.message)
                    send_response(res,{res_type:json_header,res_code:200,res_body:{message:'Failed to do the operation due to internal error'}})   
                })
    
            }
            })
            .catch((err)=>{
                console.log(err.message)
                send_response(res,{res_type:json_header,res_code:200,res_body:{message:'Failed to do the operation due to internal error'}})
            })
          
        }
        else{
            send_response(res,{res_type:json_header,res_code:403,res_body:{message:"Error 403 Forbidden. You need to login to view this page"}})
           
        }
    },
    "delete_a_product":function(data,res){
        
        let parsed_token=data['mytoken']
        let is_token_valid=verify_token(parsed_token)
        if(is_token_valid){
        let parsed_product_name=data['product_name']
        let decoded_token=decode_token(parsed_token)
        let user=decoded_token['email']
        product_insert_delete.delete_a_product(parsed_product_name,user)
        .then((result)=>{
            if(result==0){
                send_response(res,{res_type:json_header,res_code:200,res_body:{message:'Failed to do the operation due to internal error'}})
                
            }
            else{
                send_response(res,{res_type:json_header,res_code:200,res_body:{message:"Product deleted successfully"}})
               

            }

        })
        .catch((err)=>{
            send_response(res,{res_type:json_header,res_code:200,res_body:{message:'Failed to do the operation due to internal error'}})
        })
    }
    else{
        send_response(res,{res_type:json_header,res_code:403,res_body:{message:"Error 403 Forbidden. You need to login to view this page"}})
       
    }

    },
    "display_a_product":function(data,res){
        let parsed_token=data['mytoken']
        let is_token_valid=verify_token(parsed_token)
        if(is_token_valid){
            let parsed_product_name=data['product_name']
            let decoded_token=decode_token(parsed_token)
            let user=decoded_token['email']
            product_displayer.display_a_product(parsed_product_name,user)
            .then((result)=>{
                send_response(res,{res_type:json_header,res_code:200,res_body:{message:"Product fetch successful",productinfo:result}})
                
            })
            .catch((err)=>{
                send_response(res,{res_type:json_header,res_code:200,res_body:{message:'Failed to do the operation due to internal error'}})
            })
        }
        else{
            send_response(res,{res_type:json_header,res_code:403,res_body:{message:"Error 403 Forbidden. You need to login to view this page"}})
            
        }
    },
    "update_a_product":function(data,res){
        let parsed_token=data['mytoken']
        let is_token_valid=verify_token(parsed_token)
        if(is_token_valid){
            let parsed_product_name=data['product_name']
            let parsed_expiration_date=data['expiration_date']
            let decoded_token=decode_token(parsed_token)
            let user=decoded_token['email']
            expiry_date_updater.update_expiry_date(parsed_expiration_date,parsed_product_name,user)
            .then((result)=>{
                if(result==0){
                send_response(res,{res_type:json_header,res_code:200,res_body:{message:'Failed to do the operation due to internal error'}})
              
                }
                else{
                send_response(res,{res_type:json_header,res_code:200,res_body:{message:"Product updated successfully"}})
           

                }
            })
            .catch((err)=>{
                send_response(res,{res_type:json_header,res_code:200,res_body:{message:'Failed to do the operation due to internal error'}})
            })
            
        }
        else{
            send_response(res,{res_type:json_header,res_code:403,res_body:{message:"Error 403 Forbidden. You need to login to view this page"}})
           

        }
    },
    "register":function(data,res){
        send_response(res,{res_type:html_header,res_code:200,res_body:register})
       
    },
    "login":function(data,res){
        send_response(res,{res_type:html_header,res_code:200,res_body:login})
      
    },
    "home":function(data,res){
      
        send_response(res,{res_type:html_header,res_code:200,res_body:home})
       
    },
    "verifytokenloginpage":function(data,res){
        let parsed_token=data['mytoken']
        let is_token_valid=verify_token(parsed_token)
        if(is_token_valid){
            send_response(res,{res_type:json_header,res_code:200,res_body:{message:'Token valid'}})
           
        }
        else{
            send_response(res,{res_type:json_header,res_code:200,res_body:{message:'Token invalid'}})
           
        }

    },
    "favicon.ico":function(data,res){
        send_response(res,{res_type:json_header,res_code:200,res_body:{message:'No icon image'}})
    },
    "storeName":function(data,res){
        let parsed_token=data['mytoken']
        let is_token_valid=verify_token(parsed_token)
        if(is_token_valid){
           
            let decoded_token=decode_token(parsed_token)
            let user=decoded_token['email']
            users_db.display_store_name(user)
            .then((result)=>{
                send_response(res,{res_type:json_header,res_code:200,res_body:{message:'StoreName fetch successful',store:result}})
            })
            .catch((err)=>{
                send_response(res,{res_type:json_header,res_code:200,res_body:{message:'Failed to do the operation due to internal error'}})
            })

    }
    else{
        send_response(res,{res_type:json_header,res_code:403,res_body:{message:"Error 403 Forbidden. You need to login to view this page"}})
    }
    }
    
 

}
let home;
let login;
let register;
function upload_files(){
fs.readFile(__dirname + "/static/home.html")
    .then(contents => {
        home = contents;
       // console.log("home page uploaded")
       
    })
    fs.readFile(__dirname + "/static/login.html")
    .then(contents => {
        login = contents;
        //console.log("login page uploaded")
        
        
    })
    fs.readFile(__dirname + "/static/register.html")
    .then(contents => {
        register = contents;
       // console.log("register page uploaded")
       
    })
}


server.listen(1234, function() {
    upload_files()
    schedule_task()

    console.log("Listening on port 1234"); 
  })



function send_response(response,{res_type,res_code,res_body}){
    let res_body_str=''
    if(res_type=="application/json"){
        res_body_str=JSON.stringify(res_body)
    }
    else{
        res_body_str=res_body
    }
    
    response.setHeader("Access-Control-Allow-Origin", "*");
    response.setHeader("Content-Type", res_type);
    response.writeHead(res_code);
    response.end(res_body_str);

    
}


async function verify_a_user(email,password){
 let email_exists=await users_db.check_email_exist(email)
 
 
 if(email_exists){
     
     let password_match=await users_db.verify_password(email,password)
     
    
     if(password_match){
         return true
     }
     else{
         return false
     }
         
     }
    else{
        return false
    }
 }
 function generate_token(email){
  let id = Math.random().toString(36).substring(2, 8);
  let limit =3600 // 60 mins
  let expires = Math.floor(Date.now() / 1000) + limit;
  
  let payload = {
    id: id,
    exp: expires,
    email:email
  }
  const accessToken=jwt.sign(payload,process.env.ACCESS_TOKEN_SECRET)
 

  
  return `${accessToken}`
 }

 function decode_token(token){
    let decoded_token=jwt_decode(token)
    return decoded_token
 }

 function verify_token(token=null){
    try{
    jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
    return true
    }
    catch(err){
        return false
    }
    
 }
 async function hash_password(the_password){
    let saltRounds=8
    let passHash = await bcrypt.hash(the_password, saltRounds);
    return passHash
 }


 
 
     
    
 




    

module.exports={verify_a_user,generate_token,decode_token,verify_token,hash_password}
