import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const port = 3000;

app.use(express.static("public"));

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "BookNotes",
  password: process.env.DATABASE_PASSWORD,
  port: 5432,
});

db.connect();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", async (req, res) => {

    const userId = req.query.user_id;
    let booksResult;
    if(userId){
        booksResult = await db.query("SELECT * FROM books WHERE owner_id = $1 ORDER BY id DESC", [userId])
    }else {
        booksResult = await db.query("SELECT * FROM books ORDER BY id DESC");
    }
  const result = await db.query("SELECT * FROM books ORDER BY id DESC");
const usersResult = await db.query("SELECT * FROM people ORDER BY id DESC");

  res.render("index.ejs", { books: booksResult.rows, users:usersResult.rows, selectedUserId: userId });
});


app.post("/add-user", async(req,res) =>{
    const name = req.body.name;
    await db.query("INSERT INTO people (name) VALUES ($1)", [name]);
    res.redirect("/")
});

app.post("/delete-user/:id", async (req, res)=>{
    const id = req.params.id;
    await db.query("DELETE FROM people WHERE id = $1", [id]);
    res.redirect("/");
})



app.post("/add", async (req, res) => {
  const isbn = req.body.isbn;

  try {
    const api = `https://openlibrary.org/api/books?bibkeys=ISBN:${isbn}&format=json&jscmd=data`;
    const response = await axios.get(api);
    const bookData = response.data[`ISBN:${isbn}`];

    if (!bookData) {
      return res.send("Book not found :(");
    }

    const title = bookData.title || "Unknown";
    const author = bookData.authors ? bookData.authors[0].name : null;
    const cover_url = bookData.cover ? bookData.cover.small : null;

    const year = bookData.publish_date
      ? parseInt(bookData.publish_date.match(/\d{4}/))
      : null;

    await db.query(
      "INSERT INTO books (title, author, year_published, owner_id, cover_url) VALUES ($1, $2, $3, $4, $5)",
      [title, author, year, null, cover_url]
    );

    res.redirect("/");
  } catch (err) {
    console.error(err);
    res.send("Error fetching or saving book.");
  }
});


app.post("/add-by-title", async (req, res) => {
  const searchTitle = req.body.title;

  try {
    const api = `https://openlibrary.org/search.json?title=${encodeURIComponent(searchTitle)}&limit=1`;
    const response = await axios.get(api);
    const bookData = response.data.docs[0];

    if (!bookData) {
      return res.send("Book not found :(");
    }

    const title = bookData.title || "Unknown";
    const author = bookData.author_name ? bookData.author_name[0] : null;
    const year = bookData.first_publish_year || null;
    const cover_url = bookData.cover_i ? `https://covers.openlibrary.org/b/id/${bookData.cover_i}-M.jpg` : null ;

   

    await db.query(
      "INSERT INTO books (title, author, year_published, owner_id, cover_url) VALUES ($1, $2, $3, $4, $5)",
      [title, author, year, null, cover_url]
    );

    res.redirect("/");
  } catch (err) {
    console.error(err);
    res.send("Error fetching or saving book.");
  }
});


app.post("/delete/:id", async (req,res) => {
    const id = req.params.id;
    await db.query("DELETE FROM books WHERE id = $1", [id]);
    res.redirect("/");
})

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
