const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();

app.use(cors());
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.onsb2w9.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {
    try {
        const categoryCollection = client.db('reused-products').collection('categories')
        const productCollection = client.db('reused-products').collection('products');


        app.get('/home', async (req, res) => {
            const query = {}
            const cursor = categoryCollection.find(query)
            const categories = await cursor.toArray();
            res.send(categories)
        })
        app.get('/category', async (req, res) => {
            const category_name = req.query.category_name;
            const query = { category_name: category_name }
            const cursor = productCollection.find(query)
            const products = await cursor.toArray();
            res.send(products)
        })
    }
    finally {

    }
}

run().catch(err => console.error(err));








app.get('/', (req, res) => {
    res.send('server is running')
})

app.listen(port, () => {
    console.log(`Server running on ${port}`)

})