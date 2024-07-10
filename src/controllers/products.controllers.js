import { getConnection } from '../database/connections.js'
import sql from 'mssql'

export const getProducts = async (req, res) => {
    const pool = await getConnection()

    const result = await pool.request().query('SELECT * FROM products')

    res.json(result.recordset)
}

export const getProduct = async (req, res) => {
    console.log(req.params.id)
    const pool = await getConnection()
    const result = await pool.request()
        .input('id', sql.Int, req.params.id)
        .query('SELECT * FROM products WHERE id = @id')
    if (result.rowsAffected[0] === 0) {
        return res.status(404).json({ message: "Product not found" })
    }
    return res.json(result.recordset[0])
}

export const createProduct = async (req, res) => {
    console.log(req.body)
    const pool = await getConnection()
    const result = await pool
        .request()
        .input("name", sql.VarChar, req.body.name) //Tipamos 
        .input("description", sql.Text, req.body.description)
        .input("quantity", sql.Int, req.body.quantity)
        .input("price", sql.Decimal, req.body.price) //despues de la consulta nos dara el id
        .query('INSERT INTO products(name, description, quantity, price) VALUES (@name,@description,@quantity,@price ); SELECT SCOPE_IDENTITY() AS id;')
    console.log(result)
    res.json({
        id: result.recordset[0].id,
        name: req.body.name,
        description: req.body.description,
        quantity: req.body.quantity,
        price: req.body.price
    })
}

export const updateProduct = async (req, res) => {
    const pool = await getConnection()
    const result = await pool.request()
        .input('id', sql.Int, req.params.id)
        .input("name", sql.VarChar, req.body.name)
        .input("description", sql.Text, req.body.description)
        .input("quantity", sql.Int, req.body.quantity)
        .input("price", sql.Decimal, req.body.price)
        .query('UPDATE products SET name = @name, description = @description , quantity = @quantity, price = @price  WHERE id = @id')

    console.log(result)
    if (result.rowsAffected[0] === 0) {
        return res.status(404).json({ message: "Product not found" });
    }
    res.json({
        id: req.params.id,
        name: req.body.name,
        description: req.body.description,
        quantity: req.body.quantity,
        price: req.body.price
    })
}

export const deleteProduct = async (req, res) => {
    const pool = await getConnection()
    const result = await pool.request()
        .input("id", sql.Int, req.params.id)
        .query("DELETE FROM products WHERE id=@id")

    console.log(result)
    if (result.rowsAffected[0] === 0) {
        return res.status(404).json({ message: "Product not found" })
    }
    return res.json({ message: "Product Delete" })
}