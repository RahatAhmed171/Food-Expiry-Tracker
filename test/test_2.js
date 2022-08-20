var expect=require("chai").expect;
var user_auth=require('../auth')
const axios=require('axios')
var Forms=require('form-data')
const assert=require('assert')

describe("authentication system testing", function() {
    
    describe("verifying a user", function() {
        it("verifies both email and password", function() {
            let result=user_auth.verify_a_user("test@gmail.com","1234567890").then((result)=>{
                expect(result).to.equal(true)
            })
            
            
            })
        it("verifies email but fails to verify password", function() {
            let result=user_auth.verify_a_user("test@gmail.com","123456789").then((result)=>{
                expect(result).to.equal(false)
            })
            
            
            })
         it("fails to verify email", function() {
            let result=user_auth.verify_a_user("test2@gmail.com","1234567890").then((result)=>{
                expect(result).to.equal(false)
            })
           
            
            })
            
    })
    

    
    describe("testing jwt", function() {
        
        it("checks if jwt token is generated", function() {
          let result=user_auth.generate_token("test@gmail.com")
          expect(typeof(result)).to.equal('string')

            })
            
            
           
            it("decodes the token and check if the token has the given email", function() {
                let token=user_auth.generate_token("test@gmail.com")
                let result=user_auth.decode_token(token)
                expect(result['email']).to.equal('test@gmail.com')
          
            })
            
           
            describe("verifying token", function() {
           
            it("successfully verifies the token", function() {
                let token=user_auth.generate_token("test@gmail.com")
                let result=user_auth.verify_token(token)
                expect(result).to.equal(true)
            })
          
            it("fail to verifies as token is not provided", function() {
                let token=null
                let result=user_auth.verify_token(token)
                expect(result).to.equal(false)
            })
        })

    })
     
   
   
    describe("hashing password", function() {
        it("successfully hashes the password", function() {
            let password="1234567890"
            user_auth.hash_password(password).then((res)=>{
            expect(typeof(result)).to.equal('string')
            })
        })
    })
    
})



