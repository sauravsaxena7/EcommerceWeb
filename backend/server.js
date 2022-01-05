const app = require("./app");

const dotenv =  require("dotenv");

const connectDatabase = require("./config/database")



//Handling Uncaught exception

process.on("uncaughtException",(err)=>{
    console.log(`Error:${err.message}`);

    console.log(`shutting down the server due to uncaughtException`);

    process.exit(1);
});

//console.log(oo);


//config

dotenv.config({path:"backend/config/config.env"});


//connecting to database

connectDatabase();



const server=app.listen(process.env.PORT,()=>{

    console.log(`Server is running on http://localhost:${process.env.PORT}`);

});



//Unhandled Promise Rjection 

process.on("unhandledRejection",err=>{
    console.log(`Error:${err.message}`);
    console.log(`shutting down the server due to unhandled promise rejection`);

    server.close(()=>{

        process.exit(1)

    });
})