require("dotenv").config();

const MongoClient = require("mongodb").MongoClient;

const url = process.env.DB_Products;
const createProduct = async (req, res, next) => {
  const newProduct = {
    name: req.body.name,
    price: req.body.price,
  };

  const client = new MongoClient(url);

  try {
    await client.connect();
    const db = client.db();
    const result = await db.collection("products").insertOne(newProduct);
    res.status(201).json({ product: newProduct });
    await client.close();
  } catch (error) {
    return res.json({ message: "Could not store data" });
  } finally {
    //
  }
};

const getProducts = async (req, res, next) => {
  const client = new MongoClient(url);
  let products;
  try {
    await client.connect();
    const db = client.db();
    products = await db.collection("products").find().toArray();
    res.status(201).json({ products: products });
    await client.close();
  } catch (error) {
    return res.json({ message: "Could not store data" });
  }
};

exports.createProduct = createProduct;
exports.getProducts = getProducts;
