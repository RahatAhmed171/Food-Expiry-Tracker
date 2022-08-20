# **Food Expiry Tracker App**
<P>Most of the food store faces the problem of throwing away lots of expired products. 
Food Expiry Tracker sends an alert 3 days before to rotate your expired food.

By using this app user can:

* Add a product to the online store
* Update product's expiry date
* Remove a product from the store
* Recieve email alert for about-to-expired food products

### Tech stack used:
* Vanilla NodeJS
* HTML & CSS
_____

## **Project dependencies:**
Install all of the dependecies locally to run this application :

```javascript

  "dependencies": {
    "axios": "^0.27.2",
    "bcrypt": "^5.0.1",
    "chai": "^4.3.6",
    "dotenv": "^16.0.1",
    "form-data": "^4.0.0",
    "formidable": "^2.0.1",
    "jsonwebtoken": "^8.5.1",
    "jwt-decode": "^3.1.2",
    "mocha": "^10.0.0",
    "mysql2": "^2.3.3",
    "node-cron": "^3.0.1",
    "nodemailer": "^6.7.7",
    "sequelize": "^6.21.2",
    "uuid": "^8.3.2"
  }
```
___


## **Project design:**

### 1) Use Case Diagram:

This app is mainly divided into two parts. 
* Authentication and authorization
* Main App logic

From a user point of view, one first registers an account, then logs in with created credentials. Upon successful token based login, the user gets an online store where he/she performs CRUD operations.

At a fixed schedule, the server independently checks for expired products and send email to associated user.


### 2 ) DB design:

One user can have atleast one to many products. All the columns of  `User` and `Product` table are `NOTNULL`.

### 3 ) Class Diagram:

Here `Notifier` is an abstract class that imitates the properties of Observer Pattern. The concrete `expiry_date_notifer` does the work of notifying users of their expired product.


`expiry_date_notifier` uses `email_sender` as its notifying medium.

`email_sender` class is designed in an extensible way so that we can send any type of emails to the users in future.



`Auth Module` contains both the logic of authenticaion-autorization and CRUD operations of the app.

`Expiry_Date_Updater` , `Product_Displayer` , and `Product_Insert_Delete` does the work of CRUD. 

They are also used at times in the email sending logic.

_____

## **Project setup:**

### 1) Initializing the database( Sequelize ORM):

In `./databases` folder there are two database models: `users_model.js` and `products_model.js`.

To initialize these models, first we have to connect to a database workbench installed in our local machine.

Connect to your installed local DB using this code:

```javascript
const sequelize=new Sequelize('databasename','username','password',{
    dialect:/*'mysql/postgres/mongodb,etc'*/
})
```
Put your `'databasename'` , `'username'` and `'password'` according to your local DB settings.

Then put this code snippet in both `users_model.js` and `products_model.js` file .


After writing the DB connection code, we have to sync our model definitions with the local DB.

Copy this code snippet and paste it in `users_model.js` file : 

```javascript
function sync_user_model(){
    user.sync().then(()=>{
        console.log(" user model syncing succesful")
    }).catch((err)=>{
        console.log(`Error occured :${err}`)
    })
    }

//Once the model is synced, comment out the sync function call
sync_user_model() 
```
This will sync `user` table in your DB.

Similarly, copy this code snippet and paste it in `products_model.js` file : 

```javascript
function sync_product_model(){
    product.sync().then(()=>{
        console.log(" product model syncing succesful")
    }).catch((err)=>{
        console.log(`Error occured :${err}`)
    })
    }

//Once the model is synced, comment out the sync function call
sync_product_model()
```

This will sync the `product` table in your local DB.

Finally, go to your terminal and run `node users_model.js` and `node products_model.js` respectively.

> **NOTE :** Once you sucessfully sync the model definitions with your machine's DB, remove the sync call from the files. Otherwise the model will be synced multiple times and may cause issues.

 
### 2) JWT Token key :

This app uses JWT based authentication system. So when a user logs in, it returns a token. The token is generated with the help of a secret key. 

This secret key is generally stored in `.env` file. 
So in root folder, create an `.env` file and put your secret key in a variable :
```
ACCESS_TOKEN_SECRET = Your secret key
```
Make sure the secret is long and unique enough for not getting duplicated.

### 3) Setting up the email sending configuration :

This app use Gmail as the default mail sender service. In order to send email you need to provide email and app password. 

If you dont know how to get your gmail app password, watch this [tutorial](https://www.youtube.com/watch?v=thAP7Fvrql4 "Configure Gmail Authentication for Nodemailer") .

Now go to the `.env` file and put your email and password:

```
SENDER_EMAIL = 'Your email'

SENDER_PASSWORD ='Your gmail app password'
```
---
Once you complete setting up the whole project, go to the terminal and run `node auth.js`

The app server will start listening at `port:1234`

---


## **How to use Food Expiry Tracker API:**

Food Expiry Tracker API mainly consists of CRUD operations and login/logout operations. 
If you want to integrate your frontend interface with the app, then read on the API documentation below.

### 1) `loginOperation` :
 To send request to `loginOperation` you need to send a `FormData` object along with `'Email'` and `'Password'` values.

Here's an example :
 ```javascript
let url="http://127.0.0.1:1234/loginOperation";

let formdata=new FormData()
formdata.append("Email","test@gmail.com")
formdata.append("Password","123456")

 let options={
      method:'post',
      body:formdata,
 }
 ```
This will return different json responses depending on login success or failure.

* if login succesful, it will return a success message with a JWT token. This JWT token will be needed to do CRUD operation later.

Here's the success message :
```javascript
{message:"Login Successful",mytoken:token}
```

* if login unsuccessful, it will return an error message :
```javascript
{message:"Login Unsuccessful"}
```

* if there is any internal error from server, it will return error message
```javascript
{message:"Login operation failed due to internal error"}
```

> **NOTE :** All of the api of this application sends `FormData` as its request body .

### 2) `registerOperation` :

 To send request to `registerOperation` you need to send a `FormData` object along with `'Email'`, `'Fname'` , `'Password'` and `'Store'` values.

 Here's an example :
 ```javascript
let url="http://127.0.0.1:1234/registerOperation";

let formdata=new FormData()
formdata.append("Email","test@gmail.com")
formdata.append("Fname","test1")
formdata.append("Password","12345")
formdata.append("Store","testshop")

 let options={
      method:'post',
      body:formdata,
 }
 ```

 * if account registration successful, it will create the account and return a success message :
 ```javascript
 {message:"Registration Successful"}
 ```

 * if its unsuccessful or if there is any internal error it will return this message :

 ```javascript
{message:"Registration failed due to internal error"}
 ```

### 3) `display_products` :

You can fetch all of the food products associated with a user using this endpoint.
To send request to `display_products` you need to send a `FormData` object along with `'mytoken'` value.


 ```javascript
let url="http://127.0.0.1:1234/display_products";

let formdata=new FormData()
formdata.append("mytoken","put generated token here")
formdata.append("email","test@gmail.com")


 let options={
      method:'post',
      body:formdata,
 }
 ```

 * if the token verification is successful, it will return a success message along with the list of products associated with the given email :

 ```javascript
 {message:"Product fetch successful",allproducts:result}
 ```

 * if the token verification is unsuccessful, it will return `404` error message :

```javascript
 {message:"Error 403 Forbidden. You need to login to view this page"}
 ```

 * if there is any internal error from server, it will return an error message :

 ```javascript
{message:'Failed to do the operation due to internal error'}
 ```

> **NOTE :** In order to use CRUD api, you need to login first since the you'll recieve the token only when you login to the app.

### 4) `display_a_product` :

This api will return details of a single food product associated with a user. It will return values such as: Product name, Product Type and Product expiry date.

To send request to `display_a_product` you need to send a `FormData` object along with `'mytoken'` and `'product_name'` values.

 ```javascript
let url="http://127.0.0.1:1234/display_a_product";

let formdata=new FormData()
formdata.append("mytoken","put generated token here");
formdata.append("product_name","put product name here");


 let options={
      method:'post',
      body:formdata,
 }
```
* if the token is verified successfully, it will return a success message along with the product details :
```javascript
{message:"Product fetch successful",productinfo:result}
```

* if the token verification is unsuccessful, it will return `404` error message :

```javascript
 {message:"Error 403 Forbidden. You need to login to view this page"}
 ```

 * if there is any internal error from server, it will return an error message :

 ```javascript
{message:'Failed to do the operation due to internal error'}
 ```


### 5) `add_a_product` :
This endpoint will add a product to your store.


To send request to `add_a_product` you need to send a `FormData` object along with `'mytoken'` and `'product_name'` , `'product_type'` and `'expiration_date'` values.

```javascript
let url="http://127.0.0.1:1234/add_a_product";

let formdata=new FormData()
formdata.append("mytoken","put generated token here");
formdata.append("product_name","put product name here");
formdata.append("product_type","put product type here");
formdata.append("expiration_date",/*put a datetime object here */);


 let options={
      method:'post',
      body:formdata,
 }
```
* if the token is verified successfully, it will add the product to the store and return a success message:
```javascript
{message:"Product inserted successfully"}
```
* if the online store already have product with same name, it will return error message:

```javascript
{message:"Product with that name already exists"}
 ```

* if the token verification is unsuccessful, it will return `404` error message :

```javascript
 {message:"Error 403 Forbidden. You need to login to view this page"}
 ```

 * if there is any internal error from server, it will return an error message :

 ```javascript
{message:'Failed to do the operation due to internal error'}
 ```

### 6 ) `update_a_product` :
This will only let you update the expiry date of a product.


To send request to `update_a_product` you need to send a `FormData` object along with `'mytoken'` ,  `'product_name'`  and `'expiration_date'` values.

```javascript
let url="http://127.0.0.1:1234/update_a_product";

let formdata=new FormData()
formdata.append("mytoken","put generated token here");
formdata.append("product_name","put product name here");
formdata.append("expiration_date",/*put a datetime object here */);


 let options={
      method:'post',
      body:formdata,
 }
```
* if the token is verified successfully, it will update the date and return a success message:
```javascript
{message:"Product updated successfully"}
```

* if the token verification is unsuccessful, it will return `404` error message :

```javascript
 {message:"Error 403 Forbidden. You need to login to view this page"}
 ```

 * if there is any internal error from server, it will return an error message :

 ```javascript
{message:'Failed to do the operation due to internal error'}
 ```

### 7 ) `delete_a_product` :
This will delete a product from a user's store.


To send request to `delete_a_product` you need to send a `FormData` object along with `'mytoken'` and `'product_name'` values.

```javascript
let url="http://127.0.0.1:1234/delete_a_product";

let formdata=new FormData()
formdata.append("mytoken","put generated token here");
formdata.append("product_name","put product name here");


 let options={
      method:'post',
      body:formdata,
 }
```

* if the token is verified successfully, it will delete the product and return a success message:
```javascript
{message:"Product deleted successfully"}
```

* if the token verification is unsuccessful, it will return `404` error message :

```javascript
 {message:"Error 403 Forbidden. You need to login to view this page"}
 ```

 * if there is any internal error from server, it will return an error message :

 ```javascript
{message:'Failed to do the operation due to internal error'}
 ```

### 8 ) `storeName` :
It will display the food store name of the user.


To send request to `storeName` you need to send a `FormData` object along with `'mytoken'` value.

```javascript
let url="http://127.0.0.1:1234/storeName";

let formdata=new FormData()
formdata.append("mytoken","put generated token here");

 let options={
      method:'post',
      body:formdata,
 }
```

* if the token is verified successfully, it will return a success message along with store name:
```javascript
{message:'StoreName fetch successful',store:result}
```

* if the token verification is unsuccessful, it will return `404` error message :

```javascript
 {message:"Error 403 Forbidden. You need to login to view this page"}
 ```

 * if there is any internal error from server, it will return an error message :

 ```javascript
{message:'Failed to do the operation due to internal error'}
 ```

___


## **Testing the App :**
The app has unit testing module that tests some features of the system.


### 1 ) Test Coverage :
Only the authentication part of the system has been tested.

It does not cover the CRUD operations and email sending logic of the system.


### 2 ) Test Score :
There are total 14 unit test codes. All tests are passed. So test passing score is 100%.

### 3 ) Test it yourself :

If you want to do perform unit test on the system, then read on this section.

* The system uses `mocha` testing library. Once you install it, go to the `package.json` file and write this code snippet under `scripts` :
```javascript
{"test": "mocha --reporter spec"}
```

* Open your terminal, go to `./test` folder , run `npm test`.

* You can also run tests by giving you own data.



