const cron = require('node-cron');
const {email_sender}=require('./email_sender.js')
require('dotenv').config()
const {product_insert_delete,expiry_date_updater,product_displayer}=require("./databases/products")

class expiry_date_notifier{
   
constructor(notifying_medium){
    this.allproducts=[]
    this.subscribers=[]
    this.unsubscribers=[]
    this.notifying_medium=notifying_medium

}

async get_all_expiry_dates(){
    let res=await product_displayer.display_product_dates()
    
        
        
        res.forEach((element)=>{
            this.allproducts.push(element.toJSON())
            
            
        })
       
    
    
}
calculate_time_difference(){
    
    var current_date = new Date()
    var Difference_In_Time=0
    var Difference_In_Days=0

    this.allproducts.forEach((element)=>{
        var expiry_date=new Date(element['product_exp_date'])
        
        Difference_In_Time =expiry_date.getTime()-current_date.getTime()
        
  
        Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
        console.log(`${Math.floor(Difference_In_Days)} for ${element['product_name']}`)

        if(Math.floor(Difference_In_Days)<=0){
            this.unsubscribers.push(element)
            
        }
        if(Math.floor(Difference_In_Days<=3 && Difference_In_Days)>0){
            this.subscribers.push(element)
        }
    })
    console.log(`Email will be sent to this list ${this.subscribers}`)
    
    console.log(`This products will be deleted ${this.unsubscribers}`)
    
}
async subscribe(){
    await this.get_all_expiry_dates()
    this.calculate_time_difference()
  
}
unsubscribe(){
    if(this.unsubscribers.length==0){
        console.log("No one to delete")
    }
    else{
    this.unsubscribers.forEach((element)=>{
        product_insert_delete.delete_a_product(element["product_name"],element["userEmail"])
        .then((res)=>{
            console.log(`${element['product_name']} of user : ${element['userEmail']} has been deleted`)
        })
    })
}
}
notify_subscribers(){

    this.subscribers.forEach((element)=>{
        
        try{
        this.notifying_medium.send_email(`Hi ${element['userEmail']}, your ${element["product_name"]} is about to get expired.`,element["userEmail"])
        
        console.log(`Email sent successfully to ${element["userEmail"]}`)
        }
    
        catch(e){
            console.log(`Couldn't send email to ${element['userEmail']}`)
        }

    })
}

}


function schedule_task(){
    console.log("Product expiry checker initiated")
    let Email_Sender=new email_sender("Product Expiry Reminder",process.env.SENDER_EMAIL,process.env.SENDER_PASSWORD)
    Email_Sender.create_tranporter()
 

cron.schedule('02 04 * * *', function() { // the cron task will run at 4 am local time
    console.log('Running the product notifier task');
    let product_expiry_date_notifier=new expiry_date_notifier(Email_Sender)
    product_expiry_date_notifier.subscribe()
    .then((res)=>{
        
        if(product_expiry_date_notifier.subscribers.length==0){
            console.log("no subscribers")
        }
        else{
            
            product_expiry_date_notifier.notify_subscribers()
            
        }
        
        product_expiry_date_notifier.unsubscribe()
        
        
        
    })
    

})

}

schedule_task()
module.exports={schedule_task}




