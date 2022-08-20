const Sequelize=require('sequelize')



const user=sequelize.define('user',{
    email:{
        type: Sequelize.DataTypes.STRING,
        primaryKey:true,
       
    },
    fname:{
        type: Sequelize.DataTypes.STRING,
        allowNull:false
    },
    password:{
        type: Sequelize.DataTypes.STRING,
        allowNull:false
    },
    store:{
        type: Sequelize.DataTypes.STRING,
        allowNull:false
        
    },
   
},
{
    freezeTableName: true,
    timestamps: false,
})



module.exports={sequelize,user}