const {sequelize,product}=require('../models/products_model')

class Product_InsertDelete{
    constructor(){
        this.product=product
        
    }

    
async insert_a_product({product_name,product_type,expiration_date,email}){
    let result=await this.product.create({product_name:product_name,product_type:product_type,product_exp_date:expiration_date,userEmail:email})
    
    return result
    



}


async delete_a_product(product_name,email){
    let result=await this.product.destroy({
        where:{product_name:product_name,userEmail:email}
    })
   return result
}
async check_product_exist(product_name,email){

    let result=await this.product.findAll({attributes:['product_name'],where:{product_name:product_name,userEmail:email}})
    
    if(result.length===0){
        return false
    }
    else{
        return true
    }
        
    }
}


class Expiry_Date_Updater{
    constructor(){
        this.product=product
        
    }

    async update_expiry_date(exp_date,product_name,email){
        let result=await this.product.update({
            product_exp_date: exp_date,
        },
        {
            where:{product_name:product_name,userEmail:email}
        })
        return result
    }

}
class Product_Displayer {
    constructor(){
        this.product=product
        
    }


    async display_all_products(email){
        let result=await this.product.findAll({attributes:['product_name','product_exp_date'],where:{userEmail:email}})
        return result
            
            
        
    }
    async display_a_product(product_name,email){
        let result=await this.product.findAll({attributes:['product_name','product_type','product_exp_date'],where:{product_name:product_name,userEmail:email}})
        return result
    }

    async display_product_dates(){
        let result=await this.product.findAll({attributes:['product_name','product_exp_date','userEmail']})
        return result
    }

}

let product_insert_delete=new Product_InsertDelete()
let expiry_date_updater=new Expiry_Date_Updater()
let product_displayer=new Product_Displayer()




module.exports={product_insert_delete,expiry_date_updater,product_displayer}