const express = require("express");

let publications = [];

const server = express();

server.use(express.json());
const POST = '/posts';
let id = 1;

//EJERCICIO 1
server.post(POST, (req,res)=>{ 
    const {author,title,contents} = req.body
    
    if(!author || !title || !contents){
        return res
            .status(400)
            .json({
                error: "No se recibieron los parámetros necesarios para crear la publicación"
            })
    }
    const postData = {id: id++, author, title, contents};
    publications.push(postData)
    
    res.status(200).json(postData)
})

//EJERCICIO 2
server.get(POST, (req, res) => {
    const { author, title } = req.query;
  
    if ((author, title)) {
      const newPost = publications.filter( p => p.author === author && p.title === title)      
      if(newPost.length) return res.send(newPost);
    }
    return res.status(400).json({error: "No existe ninguna publicación con dicho título y autor indicado"});  
});

//EJERCICIO 3
server.get(`${POST}/:author`,(req,res)=>{
    let{author}= req.params
    const postAuthor = publications.filter(p => p.author === author);
    postAuthor.length > 0 ? res.json(postAuthor) : 
    res.status(400).json({error: "No existe ninguna publicación del autor indicado"})
    
})

//EJERCICIO 4
server.put(`${POST}/:id`,(req,res)=>{
    const{id}= req.params
    const{title, contents} = req.body
    
    if(!id || !title || !contents){
        return res.status(400).json({
            error: "No se recibieron los parámetros necesarios para modificar la publicación"
        })
    }        
    let postId = publications.find(p => p.id == id)
    if(postId.length){
        return res.status(400).json({
            error: "No se recibió el id correcto necesario para modificar la publicación"
        })
    } else {
        postId = {...postId, title, contents}
        return res.json(postId)
    }   
})

//EJERCICIO 5
server.delete(`${POST}/:id`,(req,res)=>{
    let{id}= req.params
    if(!id) return res.status(400).json({
        error: "No se recibió el id de la publicación a eliminar"
    })    
    const postDel = publications.filter( p => p.id !== +id)
    if(postDel.length) return res.status(400).json({
        error: "No se recibió el id correcto necesario para eliminar la publicación"
    })
    publications = postDel;
    return res.json({ success: true })
    
})


//NO MODIFICAR EL CODIGO DE ABAJO. SE USA PARA EXPORTAR EL SERVIDOR Y CORRER LOS TESTS
module.exports = { publications, server };
