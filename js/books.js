var book = {
    containerId: 'book',
    apiServer: API_URL + ':' + API_PORT,
    libraryTemplate: `
    <div class="userAuth">
        <div id="book" class="bookAuth center">
            <div class="bookForm" id="bookP">
                <div class="spinner" id="spinner"></div>
                <div>
                    <button class="button" id="createBook">Add Book</button>
                </div>
                <div>
                    <button id="getBooks" class="button">Get Books</button>
                </div>
                <div class="getBook">
                    <button id="getBook" class="button">Find A Book</button>
                    <div id="findByIsbn" class="inputFind">
                        <input placeholder="ISBN" name="isbn-get">
                        <div class="error" id="error"></div>
                    </div>
                </div>
                <div>
                    <button onclick="user.logout()">LOGOUT</button>
                </div>
            </div>
        </div>
    </div>
    `.trim(),
    showBookPage: function() {
        document.getElementById(this.containerId).innerHTML = this.libraryTemplate;
        document.getElementById('createBook').onclick = this.showAddBook.bind(this);
        document.getElementById('getBooks').onclick = this.showAllBooksTemplate.bind(this);
        document.getElementById('getBook').onclick = this.showInput.bind(this);
    },
    showInput: function(isbn) {
        document.getElementById('findByIsbn').style.display = "block";
        document.getElementById('getBook').onclick = this.findBook.bind(this);
   },
    addBookTemplate: `
        <div id="book" class="bookAuth">
            <div class="bookForm">
                <button id="backBtn" class="button">BACK</button>
                <div class="spinner" id="spinner"></div>
                <h3>Create New Book</h3>
                <div>
                    <label for="isbn">ISBN</label>
                    <input type="text" placeholder="isbn No." id="isbnField" name="isbn">
                </div>
                <div>
                    <label for="title">Title</label>
                    <input placeholder="Book title" name="title">
                </div>
                <div>
                    <label for="author">Author</label>
                    <input placeholder="Book author" name="author">
                </div>
                <div>
                    <label for="publish_date">Published Date</label>
                    <input type="date" name="publish_date">
                </div>
                <div>
                    <label for="publisher">Publisher</label>
                    <input placeholder="Book publisher" name="publisher">
                </div>
                <div>
                    <label for="numOfPages">Number Of Pages</label>
                    <input type="number"  id="pgsField" placeholder="Number of pages" name="numOfPages">
                    <button class="button" id="createBook">Create Book</button>
                </div>
            </div>
        </div>
    `.trim(),
    showAddBook: function () {
        document.getElementById(this.containerId).innerHTML = this.addBookTemplate;
        document.getElementById('createBook').onclick = this.createBook.bind(this);
        document.getElementById('backBtn').onclick = this.showBookPage.bind(this);
    },
    createBook: function() {
        app.testProtected();
        user.showSpinner();
        var book = {
            "isbn": document.querySelector('[name="isbn"]').value,
            "title": document.querySelector('[name="title"]').value,
            "author": document.querySelector('[name="author"]').value,
            "publish_date": document.querySelector('[name="publish_date"]').value,
            "publisher": document.querySelector('[name="publisher"]').value,
            "numOfPages": document.querySelector('[name="numOfPages"]').value
        };
        console.log(book);
        const xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState==4 && this.status==200) {
                console.log(xhttp.responseText);
                user.exitAuthAndMsg("Book created!");
                user.hideSpinner();
                /* book.showBookPage; Ovdje bih ubacila i bind,
                 ali ne kontam kakvu ulogu ima.
                 Htjela bih da me vrati na pocetnu kada se knjiga sacuva u bazi */
            }
        };
        xhttp.open("POST", this.apiServer + "/book", true);
        xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xhttp.send(JSON.stringify(book));
    },
    allBooksTemplate: `
    <div id="book" class="bookAuth">
        <div class="bookForm" id="bookP">
            <button id="backBtn">BACK</button>
            <!--- Book List Goes Here -->
            <table>
                <thead>
                    <tr>
                        <th>ISBN</th>
                        <th>Title</th>
                        <th>Author</th>
                    </tr>
                </thead>
                <tbody  id="bookList">
                    <tr>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
    `.trim(),
    showAllBooksTemplate: function() {
        document.getElementById(this.containerId).innerHTML = this.allBooksTemplate;
        document.getElementById('backBtn').onclick = this.showBookPage.bind(this);
        this.getBooks();
    },
    getBooks: function() {
        const xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState==4 && this.status==200) {
                console.log(xhttp.responseText);
                var res = JSON.parse(xhttp.responseText);
                var bookList = res.length;
                for (i=0; i < bookList; i++) {
                    document.getElementById('bookList').innerHTML += "<td>" + res[i].isbn + "</td>" + "<td>" + res[i].title + "</td>" + "<td>" + res[i].author + "</td>";
                }
            }
        };
        xhttp.open("GET", this.apiServer + "/books", true);
        xhttp.send();
    },
    bookFoundTemplate: `
    <div id="book" class="bookAuth">
        <div class="bookForm" id="bookFound">
            <div id="bookFoundPg" class="findBookPage">
                <button id="backBtn">BACK</button>
                <div class="error" id="error"></div>
                <div class="spinner" id="spinner"></div>
                <h3>Book found!</h3>
                <div id="book-info">
                    ISBN: <p id="isbn" class="book-info"></p>
                    TITLE: <p id="title" class="book-info"></p>
                    AUTHOR: <p id="author" class="book-info"></p>
                    PUBLISH DATE: <p id="publish_date" class="book-info"></p>
                    PUBLISHER: <p id="publisher" class="book-info"></p>
                    NUMBER OF PAGES: <p id="numOfPages" class="book-info"></p>
                </div>
                <div class="deleteBook">
                    <button id="deleteBook" class="button">Delete Book</button>
                </div>
                <div class="editBookBtn">
                    <button id="editBookBtn" class="button">Edit Book</button>
                </div>
            </div>
        
            <div id="editBookPg" class="editBookPage">
                <div>
                    <label for="isbn-get">ISBN</label>
                    <input type="text" placeholder="isbn No." id="isbn" name="isbn">
                </div>
                <div>
                    <label for="title">Title</label>
                    <input placeholder="Book title" name="title" id="titleField">
                </div>
                <div>
                    <label for="author">Author</label>
                    <input placeholder="Book author" name="author" id="authorField">
                </div>
                <div>
                    <label for="publish_date">Published Date</label>
                    <input type="date" name="publish_date" id="dateField">
                </div>
                <div>
                    <label for="publisher">Publisher</label>
                    <input placeholder="Book publisher" name="publisher" id="publisherField">
                </div>
                <div>
                    <label for="numOfPages">Number Of Pages</label>
                    <input type="number" placeholder="Number of pages" name="numOfPages"  id="pgsField">
                 </div>
                <button class="button" id="saveEdit">Save Edit</button>
                <button class="cancelEdit" id="cancelEdit">Cancel</button>
            </div>
        </div>
    </div>
    `.trim(),
    showBookFound: function() {
        // document.getElementById('findByIsbn').style.display = "none";
        user.hideError();
        document.getElementById(this.containerId).innerHTML = this.bookFoundTemplate;
        document.getElementById('backBtn').onclick = this.showBookPage.bind(this);
        document.getElementById('deleteBook').onclick = this.deletePrompt.bind(this);
        document.getElementById('editBookBtn').onclick = this.showEditBook.bind(this);
    },
    findBook: function() {
        user.showSpinner();
        var isbn = document.querySelector('[name="isbn-get"]').value;
        if (isbn.length < 1) {
            user.hideSpinner();
            user.showError("ISBN field can't be empty!");
            return;
        }
        console.log(isbn);
    //    user.hideError();

        const xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (xhttp.readyState == 4) {
                //user.hideSpinner();
                switch (xhttp.status) {
                    case 200:
                        var res = JSON.parse(xhttp.responseText);
                        console.log(xhttp.response);
                        book.showBookFound();
                        user.hideSpinner();
                        document.getElementById('isbn').innerHTML = res.isbn;
                        document.getElementById('title').innerHTML = res.title;
                        document.getElementById('author').innerHTML = res.author;
                        document.getElementById('publish_date').innerHTML = res.publish_date.substring(0,10);
                        document.getElementById('publisher').innerHTML = res.publisher;
                        document.getElementById('numOfPages').innerHTML = res.numOfPages;

                        if (book.showEditBook) {
                            document.querySelector('[name="isbn"]').value = res.isbn;
                            document.querySelector('[name="title"]').value = res.title;
                            document.querySelector('[name="author"]').value = res.author;
                            console.log(res.publish_date.substring(0,10));
                            document.querySelector('[name="publish_date"]').value = res.publish_date.substring(0,10);
                            document.querySelector('[name="publisher"]').value = res.publisher;
                            document.querySelector('[name="numOfPages"]').value = res.numOfPages;  
                        }
                        break;
                    case 403:
                        var res = JSON.parse(xhttp.responseText);
                        user.showError(res.message);
                        console.log("book Not found!");
                        user.hideSpinner();
                        break;
                    default:
                    console.log('unknown error');
                    user.showError("Unknown Error Occured. Server response not received. Try again later.");
                    }
                }
            }
        
        xhttp.open("GET", this.apiServer + "/book/" + isbn, true);
        xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xhttp.send();
    },
    deletePrompt: function() {
        var isbn = document.getElementById('isbn').innerHTML;
        console.log(isbn);
        var result = confirm("Are you sure you want to delete the book with isbn: " + isbn + "?");
        if (result) {
            user.showSpinner();
            this.deleteBook();
        }
    },
    deleteBook: function() {
        app.testProtected();
        var isbn = document.getElementById('isbn').innerHTML;
        console.log(isbn);

        var book =  {
            'isbn': isbn
        }
        console.log(JSON.stringify(book));

        const xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState==4 && this.status==200) {
                console.log(xhttp.responseText);
                user.hideSpinner();
                user.exitAuthAndMsg('Book deleted');
               // var info = document.querySelectorAll('.book-info');
               // info.innerHTML = "";
                /*      
                Ovdje bih dodala kod da vrati na pocetnu stranu 
                nakon uspjesne delete sesije 
                ili da 
                    isprazni polja 
                */
            }
        }
        xhttp.open("DELETE", this.apiServer + "/book/" + isbn, true);
        xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xhttp.send();
    },
    showEditBook: function() {
        document.getElementById('bookFoundPg').style.display = "none";
        document.getElementById('editBookPg').style.display = "block";
        document.getElementById('cancelEdit').onclick = this.backToFound.bind(this);
        document.getElementById('saveEdit').onclick = this.saveEditBook.bind(this);
    },
    backToFound: function() {
        document.getElementById('editBookPg').style.display = "none";
        document.getElementById('bookFoundPg').style.display = "block";
    },
    saveEditBook: function() {
        app.testProtected();
        user.showSpinner();
        var book = {
            "isbn": document.querySelector('[name="isbn"]').value,
            "title": document.querySelector('[name="title"]').value,
            "author": document.querySelector('[name="author"]').value,
            "publish_date": document.querySelector('[name="publish_date"]').value,
            "publisher": document.querySelector('[name="publisher"]').value,
            "numOfPages": document.querySelector('[name="numOfPages"]').value
        };
        console.log(book);
        const xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState==4 && this.status==200) {
                console.log(xhttp.responseText);
                user.hideSpinner();
            }
        };
        xhttp.open("PUT", this.apiServer + "/book/" + document.querySelector('[name="isbn"]').value, true);
        xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xhttp.send(JSON.stringify(book));
    }
};