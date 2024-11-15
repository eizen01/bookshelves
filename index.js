import express from "express";
import bodyParser from "body-parser";
import pg from 'pg';

const db = new pg.Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'utkarsh84',
  port: '5432'
});

db.connect();

// let items= [];
const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get('/', async (req, res) => {

  try {
    const book = await db.query("SELECT * FROM booklist");
    const items = book.rows;
    res.render('index.ejs', { bookList: items, name: "utkarsh", introduction: "GET STUFF DONE", bookcover: "#" });
  } catch (error) {
    res.status(500).send(`Something wrong ${error}`);
  }
});

app.get("/edit/:id", async (req, res) => {
  try {
    const id = await req.params.id;
    const ids = await parseInt(id.substring(3));
    const book = await db.query(`SELECT * FROM booklist WHERE id = $1`, [ids]);
    res.render('edit.ejs', { detail: book.rows[0] });
  } catch (error) {
    res.status(500).send(`Something wrong ${error}`)
  }
});

app.post("/edit/:id", async (req, res) => {
  try {
    const id = await req.params.id;
    const name = await req.body.name;
    const rating = await req.body.rating;
    const isbn = await req.body.isbn;
    const writer = await req.body.writer;
    const introduction = await req.body.introduction;
    await db.query(`Update booklist set name = $1, rating = $2, isbn = $3, writer = $4, introduction = $5 where id = $6`, [name, rating, isbn, writer, introduction, id]);
    res.redirect('/');
  } catch (error) {
    res.status(500).send(`Something wrong ${error}`);
  }
});

app.post("/delete/:id", async (req, res) => {
  try {
    const id = await req.params.id;
    const ids = await parseInt(id.substring(3));
    // console.log(id);
    await db.query(`DELETE from booklist where id= $1`, [ids]);
    res.redirect("/");
  } catch (error) {
    res.status(500).send(`Something wrong ${error}`);
  }
})

app.get("/add", async (req, res) => {
  try {
    res.render('newbook.ejs');
  } catch (error) {
    res.status(500).send(`something wrong ${error}`)
  }
})

app.post("/addNewbook", async (req, res) => {
  try {
    const name = await req.body.name;
    const rating = await req.body.rating;
    const isbn = await req.body.isbn;
    const writer = await req.body.writer;
    const introduction = await req.body.introduction;
    const detail = await req.body.detail;
    await db.query(" INSERT INTO booklist (name, rating, isbn, writer, introduction, detail) values ($1,$2,$3,$4,$5,$6)", [name, rating, isbn, writer, introduction, detail])
    res.redirect("/")
  } catch (error) {
    res.status(500).send(`SOME THING WRONG ${error}`)
  }
})

app.get("/bookdetails/:id/:bookname", async (req, res) => {
  try {
    const id = await req.params.id;
    console.log(id)
    const book = await db.query("SELECT * FROM booklist WHERE id = $1", [id]);
    console.log(book)
    res.render("bookDetails.ejs", { book: book.rows[0] });
  } catch (error) {
    res.status(500).send(`SOME THING WRONG ${error}`)
  }
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});