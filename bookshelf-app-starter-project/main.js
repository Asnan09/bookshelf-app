const STORAGE_KEY = "BOOKSHELF_APPS";
let books = [];

// Cek localStorage
function isStorageExist() {
  return typeof Storage !== "undefined";
}

// Simpan ke localStorage
function saveData() {
  if (isStorageExist()) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
  }
}

// Ambil dari localStorage
function loadData() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  if (serializedData) {
    books = JSON.parse(serializedData);
  }
  renderBooks();
}

// Tambah buku
function addBook(title, author, year, isComplete) {
  const book = {
    id: +new Date(),
    title,
    author,
    year: Number(year),
    isComplete,
  };
  books.push(book);
  saveData();
  renderBooks();
}

// Hapus buku
function deleteBook(id) {
  books = books.filter((book) => book.id !== id);
  saveData();
  renderBooks();
}

// Toggle pindah rak
function toggleBook(id) {
  const book = books.find((book) => book.id === id);
  if (book) {
    book.isComplete = !book.isComplete;
  }
  saveData();
  renderBooks();
}

// Edit buku
function editBook(id, newTitle, newAuthor, newYear) {
  const book = books.find((book) => book.id === id);
  if (book) {
    book.title = newTitle;
    book.author = newAuthor;
    book.year = Number(newYear);
  }
  saveData();
  renderBooks();
}

// Cari buku
function searchBook(keyword) {
  const lowerKeyword = keyword.toLowerCase();
  const filtered = books.filter((book) =>
    book.title.toLowerCase().includes(lowerKeyword)
  );
  renderBooks(filtered);
}

// Render buku ke rak
function renderBooks(filteredBooks = books) {
  const incompleteList = document.getElementById("incompleteBookList");
  const completeList = document.getElementById("completeBookList");

  incompleteList.innerHTML = "";
  completeList.innerHTML = "";

  filteredBooks.forEach((book) => {
    const bookItem = document.createElement("div");
    bookItem.classList.add("book-item");
    bookItem.setAttribute("data-bookid", book.id);
    bookItem.setAttribute("data-testid", "bookItem");

    bookItem.innerHTML = `
      <h3 data-testid="bookItemTitle">${book.title}</h3>
      <p data-testid="bookItemAuthor">Penulis: ${book.author}</p>
      <p data-testid="bookItemYear">Tahun: ${book.year}</p>
      <div class="action-buttons">
        <button class="complete-btn" data-testid="bookItemIsCompleteButton">
          ${book.isComplete ? "Belum selesai dibaca" : "Selesai dibaca"}
        </button>
        <button class="delete-btn" data-testid="bookItemDeleteButton">Hapus Buku</button>
        <button class="edit-btn" data-testid="bookItemEditButton">Edit Buku</button>
      </div>
    `;

    // Tombol pindah rak
    bookItem
      .querySelector("[data-testid=bookItemIsCompleteButton]")
      .addEventListener("click", () => toggleBook(book.id));

    // Tombol hapus
    bookItem
      .querySelector("[data-testid=bookItemDeleteButton]")
      .addEventListener("click", () => deleteBook(book.id));

    // Tombol edit
    bookItem
      .querySelector("[data-testid=bookItemEditButton]")
      .addEventListener("click", () => {
        const newTitle = prompt("Judul baru:", book.title);
        const newAuthor = prompt("Penulis baru:", book.author);
        const newYear = prompt("Tahun baru:", book.year);
        if (newTitle && newAuthor && newYear) {
          editBook(book.id, newTitle, newAuthor, newYear);
        }
      });

    if (book.isComplete) {
      completeList.appendChild(bookItem);
    } else {
      incompleteList.appendChild(bookItem);
    }
  });
}

// Event listener form tambah
document.getElementById("bookForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const title = document.getElementById("bookFormTitle").value;
  const author = document.getElementById("bookFormAuthor").value;
  const year = document.getElementById("bookFormYear").value;
  const isComplete = document.getElementById("bookFormIsComplete").checked;

  addBook(title, author, year, isComplete);

  e.target.reset();
});

// Event listener form cari
document.getElementById("searchBook").addEventListener("submit", (e) => {
  e.preventDefault();
  const keyword = document.getElementById("searchBookTitle").value;
  searchBook(keyword);
});

// Load data saat halaman pertama kali dibuka
window.addEventListener("load", loadData);
