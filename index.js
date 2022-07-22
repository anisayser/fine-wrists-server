const { MongoClient, ServerApiVersion } = require('mongodb');
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const ObjectId = require('mongodb').ObjectId;

const app = express();
const port = process.env.POST || 5000;

//middleware
app.use(cors());
app.use(express.json());


/* const products = [
    {
        title: 'Cosmograph Daytona',
        brand: 'Rolex',
        category: ['mens-watch'],
        price: 38499,
        oldprice: 40000,
        rating: 3,
        description: 'It is a long established fact that a reader will be distracted by the eadable content',
        img: 'https://i.ibb.co/ZcVN3pn/7-450x450.jpg'

    },
    {
        title: 'Yacht Master',
        brand: 'Rolex',
        category: ['mens-watch'],
        price: 17999,
        oldprice: 20000,
        rating: 4,
        description: 'It is a long established fact that a reader will be distracted by the eadable content',
        img: 'https://i.ibb.co/zfH6Pzb/6-450x450.jpg'

    },
    {
        title: 'Datejust',
        brand: 'Rolex',
        category: ['mens-watch'],
        price: 11119,
        oldprice: 13000,
        rating: 3,
        description: 'It is a long established fact that a reader will be distracted by the eadable content',
        img: 'https://i.ibb.co/8dfHPfk/3-450x450.jpg'

    },
    {
        title: 'GMT Master II',
        brand: 'Rolex',
        category: ['mens-watch'],
        price: 25399,
        oldprice: 28000,
        rating: 4.5,
        description: 'It is a long established fact that a reader will be distracted by the eadable content',
        img: 'https://i.ibb.co/pb7P30P/1-1-600x600.jpg'

    },
    {
        title: 'Longines Conquest',
        brand: 'Rolex',
        category: ['mens-watch'],
        price: 1039,
        oldprice: 1200,
        rating: 3,
        description: 'It is a long established fact that a reader will be distracted by the eadable content',
        img: 'https://i.ibb.co/qsF6jYP/18-450x450.jpg'

    },
    {
        title: 'Speedmaster',
        brand: 'OMEGA',
        category: ['mens-watch'],
        price: 32099,
        oldprice: 35000,
        rating: 3.5,
        description: 'It is a long established fact that a reader will be distracted by the eadable content',
        img: 'https://i.ibb.co/Kbp7Xrf/16-450x450.jpg'

    },
    {
        title: 'The Longines Master Collection',
        brand: 'LONGINES',
        category: ['mens-watch'],
        price: 2550,
        oldprice: 3000,
        rating: 3,
        description: 'It is a long established fact that a reader will be distracted by the eadable content',
        img: 'https://i.ibb.co/6gKgDs1/16-16-450x450.jpg'

    },
    {
        title: 'Heritage Black Bay',
        brand: 'TUDOR',
        category: ['mens-watch'],
        price: 4180,
        oldprice: 4500,
        rating: 3.5,
        description: 'It is a long established fact that a reader will be distracted by the eadable content',
        img: 'https://i.ibb.co/MkLpyfd/15-450x450.jpg'

    },
    {
        title: 'Chronomaster',
        brand: 'ZENITH',
        category: ['mens-watch'],
        price: 6500,
        oldprice: 7000,
        rating: 4,
        description: 'It is a long established fact that a reader will be distracted by the eadable content',
        img: 'https://i.ibb.co/ryGCfkk/12-12-450x450.jpg'

    },
    {
        title: 'BLACK BAY',
        brand: 'TUDOR',
        category: ['mens-watch'],
        price: 3750,
        oldprice: 4000,
        rating: 4.5,
        description: 'It is a long established fact that a reader will be distracted by the eadable content',
        img: 'https://i.ibb.co/Z8sMzxT/11-11-450x450.jpg'

    },
    {
        title: 'Heritage Black Bay',
        brand: 'TUDOR',
        category: ['mens-watch'],
        price: 2800,
        oldprice: 3000,
        rating: 3.5,
        description: 'It is a long established fact that a reader will be distracted by the eadable content',
        img: 'https://i.ibb.co/fFDSF58/9-9-450x450.jpg'

    },
    {
        title: 'Tudor 1926',
        brand: 'TUDOR',
        category: ['mens-watch'],
        price: 1765,
        oldprice: 2000,
        rating: 3,
        description: 'It is a long established fact that a reader will be distracted by the eadable content',
        img: 'https://i.ibb.co/7Xmvj44/10-10-450x450.jpg'

    },
] */



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.madlbkn.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

const run = async () => {
    try {
        await client.connect();
        // console.log('Connected to db');

        const db = client.db('fineWrists');
        const productCollection = db.collection('products');
        const cartCollection = db.collection('cart');
        const ordersCollection = db.collection('orders');
        const userCollection = db.collection('users');
        const reviewCollection = db.collection('reviews');

        //GET ALL PRODUCTS
        app.get('/products', async (req, res) => {
            const cursor = productCollection.find({}, { sort: { _id: -1 } });
            const products = await cursor.toArray();
            res.json(products);
        })

        //ADD PRODUCT
        app.post('/addproduct', async (req, res) => {
            const product = req.body;
            const addProduct = await productCollection.insertOne(product);
            res.json(addProduct);
        })

        //ADD PRODUCT TO CART
        app.post('/addtocart', async (req, res) => {
            const cartProduct = req.body;
            const cart = await cartCollection.insertOne(cartProduct);
            res.json(cart);
        })

        //GET USER CART
        app.get('/usercart/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const cursor = cartCollection.find(query, { sort: { _id: -1 } });
            const result = await cursor.toArray();
            res.json(result)
        })

        //GET ALL PRODUCTS
        app.get('/products', async (req, res) => {
            const cursor = productCollection.find({}, { sort: { _id: -1 } });
            const products = await cursor.toArray();
            res.json(products);
        })

        //GET PRODUCT BY ID
        app.get('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const theProduct = await productCollection.findOne(query);
            res.json(theProduct);
        })

        //DELETE PRODUCT BY ID
        app.delete('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const deleteProduct = await productCollection.deleteOne(query);
            res.json(deleteProduct);
        })

        //DELETE USER CART
        app.delete('/usercart/:id', async (req, res) => {
            const id = req.params.id;
            // const email = req.params.email;
            // const query = { _id: ObjectId(id) };
            const query = { productId: id };
            // const query = { _id: id };
            const deleteCart = await cartCollection.deleteOne(query);
            res.json(deleteCart);
        })

        //DELETE ALL CART OF USER
        app.delete('/allusercart/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const deleteAllCart = await cartCollection.deleteMany(query);
            res.json(deleteAllCart);
        })

        //PLACE ORDERS
        app.post('/placeorder', async (req, res) => {
            const order = req.body;
            const placeOrder = await ordersCollection.insertOne(order);
            res.json(placeOrder);
        })

        //GET THE PLACED ORDER BY ID
        app.get('/placedorder/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const getOrder = await ordersCollection.findOne(query);
            res.json(getOrder);
        })

        //ADD UPSERT USER
        app.put('/adduser', async (req, res) => {
            const user = req.body;
            const query = { email: user.email };
            const options = { upsert: true };
            const doc = { $set: user };
            const addUser = await userCollection.updateOne(query, doc, options);
            res.json(addUser)
        })

        //MAKE ADMIN TO AN USER
        app.put('/makeadmin/:email', async (req, res) => {
            const email = req.params.email;
            const role = req.body;
            const filter = { email: email };
            const doc = { $set: role }
            const makeAdmin = await userCollection.updateOne(filter, doc);
            res.json(makeAdmin);
        })

        //GET ALL ORDERS
        app.get('/orders', async (req, res) => {
            const cursor = ordersCollection.find({}, { sort: { _id: -1 } });
            const orders = await cursor.toArray();
            res.json(orders);
        })

        //UPDATE ORDER STATUS
        app.put('/orderstatus/:id', async (req, res) => {
            const id = req.params.id;
            const status = req.body;
            const filter = { _id: ObjectId(id) };
            const doc = { $set: status };
            const updateStatus = await ordersCollection.updateOne(filter, doc);
            res.json(updateStatus);
        })

        //GET USER ROLE
        app.get('/user/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const getUser = await userCollection.findOne(query);
            let isAdmin = false;
            if (getUser?.role === 'admin') {
                isAdmin = true;
            }

            res.json({ admin: isAdmin });
        })

        //ADD REVIEWS
        app.post('/addreview', async (req, res) => {
            const review = req.body;
            const addReview = await reviewCollection.insertOne(review);
            res.json(addReview);
        })

        //GET REVIES
        app.get('/reviews', async (req, res) => {
            const cursor = reviewCollection.find({}, { sort: { _id: -1 }, limit: 2 });
            const reviews = await cursor.toArray();
            res.json(reviews)
        })




    } finally {
        // await client.close();
    }
}
run().catch(console.dir);


//checking the server
app.get('/', (req, res) => {
    res.send('Fine Wrists server is Running.');
})

app.listen(port, () => {
    console.log('Listening to port', port);
})