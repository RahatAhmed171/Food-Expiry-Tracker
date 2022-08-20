const Sequelize=require('sequelize')
const {user}=require('../models/users_model')



const product=sequelize.define('product',{
    product_id:{
        type: Sequelize.DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true
       
    },
    product_name:{
        type: Sequelize.DataTypes.STRING,
        allowNull:false
    },
    product_type:{
        type: Sequelize.DataTypes.STRING,
        allowNull:false
    },
    product_exp_date:{
        type: Sequelize.DataTypes.DATE,
        allowNull:false
        
    },
   
},
{
    freezeTableName: true,
    timestamps: false,
})

user.hasMany(product,{foreignKey:{allowNull:false}})



module.exports={sequelize,product}