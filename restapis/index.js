const express = require('express');
const app = express();
const exphbs = require('express-handlebars');
const MongoClient = require('mongodb').MongoClient;
const url = "mongodb://localhost:27017";

const port = 8080;
app.listen(port, ()=>console.log(`http://localhost:${port}`));

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.set("view engine","hbs");
app.engine("hbs",exphbs({
    extname : "hbs",
    layoutsDir: __dirname + "/views/layouts",
    partialsDir: __dirname + "/views/partials",
    defaultLayout: "root",
}));

app.get('/',(req,res)=>{
    res.render("home");
});

//GET for MongoDB
app.get('/api/cars',(req,res)=>{

    //DB Connection
    MongoClient.connect(url,(err,client)=>{
        if(err) throw err;

        //select DB
        client.db("cars_db")
            .collection("cars")
            .find()
            .toArray((err,result)=>{
                if(err) throw err;
                console.log(result);
                res.render("cars",{ cars: result })
                client.close();
            });
    });
});

//GET by location for MongoDB
app.get('/api/cars/:loc',(req,res)=>{

    const loc = req.params.loc;
    //DB Connection
    MongoClient.connect(url,(err,client)=>{
        if(err) throw err;

        //select DB
        client.db("cars_db")
            .collection("cars")
            .find( { location: loc } )
            .toArray((err,result)=>{
                if(err) throw err;
                console.log(result);
                res.render("cars",{ cars: result })
                client.close();
            });
    });
});

//GET by location for MongoDB
app.get('/api/cars/make/:make',(req,res)=>{

    const make = req.params.make;
    //DB Connection
    MongoClient.connect(url,(err,client)=>{
        if(err) throw err;

        //select DB
        client.db("cars_db")
            .collection("cars")
            .find( { 'car.make': make } )
            .toArray((err,result)=>{
                if(err) throw err;
                console.log(result);
                res.render("cars",{ cars: result })
                client.close();
            });
    });
});

//POST for MongoDB
app.post('/api/cars',(req,res)=>{

    const data = req.body; // { firstname:"Christian"}

    //DB Connection
    MongoClient.connect(url,(err,client)=>{
        if(err) throw err;

        //select DB
        client.db("cars_db")
            .collection("cars")
            .insertOne(data,(err,result)=>{
                if(err) throw err;
                console.log(result);
                res.json("Data Added!");
                client.close();
            });
    });
});