require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion } = require('mongodb');


app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ourphyd.mongodb.net/Blog_Website?retryWrites=true&w=majority`;
// console.log(uri)
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
    try {
        const db = client.db("blog_content");
        const blogCollection = db.collection("blog");
    
        // get all blogs api
        app.get("/blogs", async (req, res) => {
          const cursor = blogCollection.find({});
          const blog = await cursor.toArray();
    
          res.send({ status: true, data: blog });
        });
        
        //  get single blog api 
        app.get('/blog/:id',async(req,res)=>{
          const id = req.params.id;
          const query = { _id:ObjectId(id) };
          const blog = await blogCollection.findOne(query);
          // console.log(blog);
          res.json(blog);

          });



      // post  blog api
        app.post("/blog", async (req, res) => {
          const blog = req.body;
          const result = await blogCollection.insertOne(blog);
          // console.log(product);
    
          res.send(result);
        });
       // delete  blog api
        app.delete("/blog/:id", async (req, res) => {
          const id = req.params.id;
          const result = await blogCollection.deleteOne({ _id: ObjectId(id) });
          res.send(result);
        });

          // edit blog api
        app.put("/blog/:id", async (req, res) => {
          const id = req.params.id;
          const updatedBlog = req.body;
          const filter = { _id: ObjectId(id) };
          const options = { upsert: true };
          const updateDoc = {
            $set: {
              title: updatedBlog.title,
              image: updatedBlog.image,
              category: updatedBlog.category,
              author: updatedBlog.author,
              desc1: updatedBlog.desc1,
              desc2: updatedBlog.desc2,
              desc3: updatedBlog.desc3,

            },
          };
    

          const result = await blogCollection.updateOne(filter, updateDoc, options);
          console.log(result);
          res.send(result);
        });

      }
    finally {
      // Ensures that the client will close when you finish/error
    //   await client.close();
    }
  }
  run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Blog server is Running  !!!')
})

app.listen(port, () => {
  console.log(`Blog server is Running  on port ${port}`)
})