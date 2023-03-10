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
        const usersCollection = client.db('reused-products').collection('users');
        const bookingsCollection = client.db('reused-products').collection('bookings');


        app.get('/home', async (req, res) => {
            const query = {}
            const cursor = categoryCollection.find(query)
            const categories = await cursor.toArray();
            res.send(categories)
        })
        app.get('/category/:name', async (req, res) => {
            const name = req.params.name;
            const query = { category_name: name }
            const cursor = productCollection.find(query)
            const products = await cursor.toArray();
            res.send(products)
        })
        app.post('/addProduct', async (req, res) => {
            const product = req.body;
            const products = await productCollection.insertOne(product);
            res.send(products)
        })
        app.get('/myProduct', async (req, res) => {
            const email = req.query.email;
            const query = { seller_email: email }
            const cursor = productCollection.find(query)
            const products = await cursor.toArray();
            res.send(products)
        })
        app.post('/users', async (req, res) => {
            const user = req.body;
            const users = await usersCollection.insertOne(user);
            res.send(users)
        })
        app.get('/users', async (req, res) => {
            const query = {};
            const users = await usersCollection.find(query).toArray();
            res.send(users)
        })
        app.get('/users/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email }
            const users = await usersCollection.find(query).toArray();
            res.send(users)
        })
        app.post('/bookings', async (req, res) => {
            const booking = req.body;
            const bookings = await bookingsCollection.insertOne(booking);
            res.send(bookings)
        })
        app.get('/bookings', async (req, res) => {
            const email = req.query.email;
            const query = { email: email }
            const userBookings = await bookingsCollection.find(query).toArray();
            res.send(userBookings)
        })
        app.get('/allBuyers', async (req, res) => {
            const role = req.query.role;
            if (role === 'Buyer') {
                const query = { role: role }
                const allBuyers = await usersCollection.find(query).toArray();
                res.send(allBuyers)
            }

        })
        app.get('/allSellers', async (req, res) => {
            const role = req.query.role;
            if (role === 'Seller') {
                const query = { role: role }
                const allSellers = await usersCollection.find(query).toArray();
                res.send(allSellers)
            }

        })
        app.delete('/myProduct/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const result = await productCollection.deleteOne(filter);
            res.send(result);
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