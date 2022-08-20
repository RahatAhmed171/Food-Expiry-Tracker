var expect=require("chai").expect;
var user_db=require('../databases/users')





describe("User DB testing", function() {
  
  describe("insert data into db", function() {
        
    it("inserts the data successfully", function() {
      
       
        user_db.insert_data({email:"test@gmail.com",fname:"testname",password:'1234567890',store:'teststore'})
        .then((result)=>{
          expect(result).to.equal({message:"data inserted successfully"})
        })
         

        });
        
    it("cannot insert data",function() {
        
    
        user_db.insert_data({email:"test@gmail.com",fname:"testname",password:'1234567890',store:"teststore"})
        .then((result)=>{
         
          expect(result).to.throw(error)
        })
        
      
        })
    })



  
    
    describe("checks if email exists in db", function() {
    it("finds given email", function() {
        
       
        user_db.check_email_exist("test@gmail.com")
        .then((result)=>{
            expect(result).to.equal(true)

        })
        
      
          });
    it("doesn't find given email", function() {
       
    
        user_db.check_email_exist("test2@gmail.com")
        .then((result)=>{
            expect(result).to.equal(false)
      
          });
          
        })
    })
    
    

  
    describe("matches given password in db", function() {
      it("matches the password", function() {
        
         
          user_db.verify_password("test@gmail.com","1234567890")
          .then((result)=>{
              expect(result).to.equal(true)
  
          })
          
        
            });
      it("doesn't match password", function() {
          
      
          user_db.verify_password("test@gmail.com","123456789")
          .then((result)=>{
              expect(result).to.equal(false)
        
            });
            
          })
      })
      
      
    

      
     
      
})

