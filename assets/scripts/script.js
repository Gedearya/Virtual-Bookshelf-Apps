// web storage starter
const LOCAL_STORAGE_KEY = "VIRTUAL_BOOKSELF";
let myBook = [];
const saveBook = document.getElementById("saveBook");

// check whether browser support local storage
const isStorageSupport = () => {
  return typeof Storage !== undefined;
};
if (isStorageSupport()) {
  if (localStorage.getItem(LOCAL_STORAGE_KEY) === null) {
    myBook = [];
  } else {
    myBook = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY));
  }
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(myBook));
}

// display all the data that have been entered into the local storage
window.addEventListener("load", function () {
  if (isStorageSupport) {
    loadBooks(myBook);
  } else {
    alert("OOps, Your browser isn't support web storage");
  }
});

// display book to browser
const unfinishedReads = "unfinished-read";
const finishedReads = "finished-read";
const loadBooks = (myBook) => {
  const books = myBook;
  const listUnfinished = document.getElementById(unfinishedReads);
  const listFinished = document.getElementById(finishedReads);
  listUnfinished.innerHTML = "";
  listFinished.innerHTML = "";
  for (let book of books.keys()) {
    const listGroupItem = document.createElement("article");
    listGroupItem.classList.add("listBook-item");

    // book detail
    const bookDetail = document.createElement("div");
    bookDetail.classList.add("book-detail");

    // book detail children
    const bookTitle = document.createElement("b");
    bookTitle.innerHTML = books[book].title;
    const bookAuthor = document.createElement("p");
    bookAuthor.classList.add("small");
    bookAuthor.innerHTML = "Author: " + books[book].author;
    const bookYear = document.createElement("p");
    bookYear.classList.add("small");
    bookYear.innerHTML = "Year: " + books[book].year;
    bookDetail.append(bookTitle, bookAuthor, bookYear);

    // book action
    const bookAction = document.createElement("div");
    bookAction.classList.add("book-action");

    // book action children
    const buttonRead = document.createElement("button");
    if (books[book].isComplete) {
      buttonRead.classList.add("button-finish");
      buttonRead.innerHTML = "Unfinished read";
      buttonRead.addEventListener("click", () => {
        unfinishedRead(book);
      });
    } else {
      buttonRead.classList.add("button-unfinish");
      buttonRead.innerHTML = "Finished read";
      buttonRead.addEventListener("click", () => {
        finishedRead(book);
      });
    }
    const buttonDelete = document.createElement("button");
    buttonDelete.classList.add("button-delete");
    buttonDelete.innerHTML = "Delete book";
    buttonDelete.addEventListener("click", () => {
      let confirmDelete = confirm(
        "Are you sure you want to delete the book '" + books[book].title + "'?"
      );
      if (confirmDelete) {
        deleteBook(book);
      }
    });
    bookAction.append(buttonRead, buttonDelete);

    // append book detail and action
    listGroupItem.append(bookDetail, bookAction);
    if (books[book].isComplete) {
      listFinished.append(listGroupItem);
    } else {
      listUnfinished.append(listGroupItem);
    }
  }
};

// search book by title in local storage
const searchBook = (keyword) => {
  const r = myBook.filter((book) =>
    book.title.toLowerCase().includes(keyword.toLowerCase())
  );
  loadBooks(r);
};

// add book to local storage
const addBook = (Object, LOCAL_STORAGE_KEY) => {
  myBook.push(Object);
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(myBook));
};

// delete book from local storage
const deleteBook = (book) => {
  myBook.splice(book, 1);
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(myBook));
  loadBooks(myBook);
};

// move to finished read
const finishedRead = (book) => {
  myBook[book].isComplete = true;
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(myBook));
  loadBooks(myBook);
};

// move to unfinished read
const unfinishedRead = (book) => {
  myBook[book].isComplete = false;
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(myBook));
  loadBooks(myBook);
};

// search form event handler
searchBookForm = document.getElementById("searchBook");
searchBookForm.addEventListener("submit", (event) => {
  const keyword = document.querySelector("#searchBookTitle").value;
  event.preventDefault();
  searchBook(keyword);
});

// button save event handler
saveBook.addEventListener("click", function (event) {
  // input value from add new book form
  const title = document.getElementById("title");
  const author = document.getElementById("author");
  const year = document.getElementById("year");
  const isComplete = document.getElementById("isComplete");

  // put book into object
  let Object = {
    id: +new Date(),
    title: title.value,
    author: author.value,
    year: year.value,
    isComplete: isComplete.checked,
  };

  // checking whether blank field
  if (title.value && author.value && year.value) {
    // run addBook function for add book data to local storage
    addBook(Object, LOCAL_STORAGE_KEY);
  } else {
    return alert("Please fill the blank space");
  }
  loadBooks(myBook);
  alert("Yeay, your favorite book have been added!");
});
