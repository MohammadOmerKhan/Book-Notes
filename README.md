# Book Notes

Book Notes is a full-stack web application for tracking books, users, and reviews. Built with Node.js, Express, EJS, PostgreSQL, and Bootstrap, it allows you to:

- **Add books** by ISBN or title (using OpenLibrary API)
- **Assign books to users** and filter books by user
- **Create and delete users** (from the `people` table)
- **Delete books** from your collection
- *(Optional: Add and view reviews for each book)*

## Features

- **User Management:**  
  Create and delete users. Each user can have their own collection of books.

- **Book Management:**  
  Add books by ISBN or by searching for a title. Books are fetched from OpenLibrary and stored in your database.

- **Book Filtering:**  
  Filter and view books by user.

- **Book Deletion:**  
  Remove books from the collection with a single click.

- **Responsive UI:**  
  Clean, responsive interface using Bootstrap 5.

## Getting Started

1. **Clone the repository**  
   ```
   git clone <your-repo-url>
   cd Book-Notes
   ```

2. **Install dependencies**  
   ```
   npm install
   ```

3. **Set up your PostgreSQL database**  
   - Create a database named `BookNotes`.
   - Create the required tables (`books`, `people`, and optionally `reviews`).

4. **Configure database connection**  
   Edit the connection settings in `index.js` if needed.

5. **Run the app**  
   ```
   npm start
   ```
   or  
   ```
   node index.js
   ```

6. **Visit in your browser**  
   [http://localhost:3000](http://localhost:3000)

## Folder Structure

```
Book Notes/
├── Public/
│   └── styles/
│       └── style.css
├── views/
│   └── index.ejs
├── index.js
├── package.json
└── README.md
```

## Dependencies

- express
- body-parser
- pg
- axios
- ejs
- bootstrap (via CDN)

## License

MIT

---

*Built by Omer Khan*
