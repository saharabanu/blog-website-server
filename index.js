require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion } = require('mongodb');


app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ourphyd.mongodb.net/Blog_Website?retryWrites=true&w=majority`;
console.log(uri)
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
    try {
        const db = client.db("blog_content");
        const blogCollection = db.collection("blog");
    
        app.get("/blogs", async (req, res) => {
          const cursor = blogCollection.find({});
          const blog = await cursor.toArray();
    
          res.send({ status: true, data: blog });
        });
    
        app.post("/blog", async (req, res) => {
          const blog = req.body;
    
          const result = await blogCollection.insertOne(blog);
          // console.log(product);
    
          res.send(result);
        });
    
        app.delete("/blog/:id", async (req, res) => {
          const id = req.params.id;
    
          const result = await blogCollection.deleteOne({ _id: ObjectId(id) });
          res.send(result);
        });
        // app.put("/blog/:id", async (req, res) => {
        //   const id = req.params.id;
        //   const updatedBlog = req.body;
        //   const filter = { _id: ObjectId(id) };
        //   const options = { upsert: true };
        //   const updateDoc = {
        //     $set: {
        //       model: updatedBlog.model,
        //       image: updatedBlog.image,
        //       status: updatedBlog.status,
        //       keyFeature: updatedBlog.keyFeature,
        //       price: updatedBlog.price,
        //       rating: updatedBlog.rating,
        //       spec: updatedBlog.spec,
              
        //     },
        //   };
    
        //   const result = await blogCollection.updateOne(filter, updateDoc, options);
        //   console.log(result);
        //   res.send(result);
        // });
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