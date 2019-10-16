const express = require('express');
const server = express();
//Indica ao servidor que ele deve aceitar JSON
server.use(express.json());

// Query params = ?teste=1
// Route params = /users/1
//Request body = {"nome"="Fagner"}

//CRUD - Create - Read - Update - Delete

const users = ["Fagner","Diego","Andre","Cabelo de Boneca"]

//Middlewares


//Global

server.use((req,res, next)=>{
        console.time('Request');
        console.log("A requisição foi chamanda...");
        console.log(`Método: ${req.method}; URL: ${req.url}`);

        next();

        console.timeEnd('Request');
});

// Middlewares LOCAL

function nomeUsuarioExiste(req,res,next){
    if(!req.body.name){
        return res.status(400).json({error:'User name is required'});
    }return next();
}

function usuarioExisteNoArray(req,res,next){
    const user = users[req.params.index];
    if(!user){
        return res.status(400).json({error:'User does not exists'});
    }    
    req.user = user;
    return next();
}


//Buscar todos os usuarios
server.get('/users', (req,res)=>{
        return res.json(users);
})

//Buscar usuario por indice
server.get('/users/:index',usuarioExisteNoArray, (req, res)=>{
    //const nome = req.query.nome;
    //const {index}= req.params;

    return res.json(req.user);
})

//Adicionar novo usuario pega o parametro no corpo da requisicao Request Body
server.post('/users',nomeUsuarioExiste,(req,res)=>{
    const {name}=req.body;
    users.push(name);
    return res.json(users);

})


//Editar Usuario passando o ID (index) como parametro e o novo nome no body

server.put('/users/:index', nomeUsuarioExiste,usuarioExisteNoArray, (req, res)=>{
    const {index} = req.params;
    const {name} = req.body;

    users[index] = name;

    return res.json(users);
})

//Excluir usuario recebe o 
server.delete('/users/:index', usuarioExisteNoArray, (req,res)=>{
    const {index} = req.params;

    users.splice(index,1);
    return res.send();
})


server.listen(3000);