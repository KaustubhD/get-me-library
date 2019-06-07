Project Personal Library
------
On the front-end,
- edit `public/client.js`, `public/style.css` and `views/index.html`
- drag in `assets`, like images or music, to add them to your project

On the back-end,
- your app starts at `server.js`
- add frameworks and packages in `package.json`
- safely store app secrets in `.env` (nobody can see this but you and people you invite)


Directions to use
-------------------

**API** | **GET** | **POST** | **DELETE**
-------- | --------- | ---------- | --------
**/api/books** | list all books | add new book | delete all books
**/api/books/1234** | show book 1234| add comment to 1234 | delete 1234


2. API
    * Root URL: ```/api/books```
    * Book URL: ```/api/books/{_id}```
    * To add book: **POST** request to root URL with `title`
    * To post a comment on book: **POST** request to book URL with `comment`
    * Get all books: **GET** request to root URL
    * Get a book details: **GET** request to book URL
    * To delete a book: **DELETE** request to book URL
    * To delete all books: **DELETE** request to root URL



Objectives
-------------------
- [ ] Nothing from my website will be cached in my client as a security measure.
- [ ] I will see that the site is powered by 'PHP 4.2.0' even though it isn't as a security measure.
- [ ] I can post a title to /api/books to add a book and returned will be the object with the title and a unique _id.
- [ ] I can get /api/books to retrieve an aray of all books containing title, _id, & commentcount.
- [ ] I can get /api/books/{_id} to retrieve a single object of a book containing title, _id, & an array of comments (empty array if no comments present).
- [ ] I can post a comment to /api/books/{_id} to add a comment to a book and returned will be the books object similar to get /api/books/{_id}.
- [ ] I can delete /api/books/{_id} to delete a book from the collection. Returned will be 'delete successful' if successful.
- [ ] If I try to request a book that doesn't exist I will get a 'no book exists' message.
- [ ] I can send a delete request to /api/books to delete all books in the database. Returned will be 'complete delete successful' if successful.
- [ ] All 6 functional tests required are complete and passing


Testing
-------------------
For testing, the ```NODE_ENV``` variable needs to be set to testin the **.env** file


Live Project
-------------------
[\ ゜o゜)ノ](https://get-me-library.glitch.me)
