var currentEditingBookId = null;

function insertNewBook(title, length, author, id) {

    var book = Handlebars.templates.book({
        title: title,
        length: length,
        author: author,
        id: id
    })

    var booksContainer = document.getElementById('books-container')
    booksContainer.insertAdjacentHTML( "beforeend", book)
}

var allBooks = []

function handleModalAcceptClick() {
    var title  = document.getElementById('title-input').value.trim();
    var length = document.getElementById('length-input').value.trim();
    var author = document.getElementById('author-input').value.trim();

    if (!title) {
        alert("You must at least have a title");
        return;
    }

    // Check if we're editing an existing book
    if (currentEditingBookId) {
        // Update the book in the array
        for (var i = 0; i < allBooks.length; i++) {
            if (allBooks[i].id == currentEditingBookId) {
                allBooks[i].title  = title;
                allBooks[i].length = length;
                allBooks[i].author = author;
                break;
            }
        }
        // Re-render all books based on current (or cleared) filters
        clearFiltersAndReinsertBooks();
        // Reset the editing flag
        currentEditingBookId = null;
    } else {
        // Otherwise, add a new book
        let bookId = Date.now();
        allBooks.push({
            title:  title,
            length: length,
            author: author,
            id: bookId
        });
        // Re-render all books rather than just inserting one
        clearFiltersAndReinsertBooks();
    }
    hideBookModal();
}

function handleDeleteBook() {
    // Ensure we have a book in edit mode
    if (!currentEditingBookId) return;

    // Display a confirmation dialog
    var confirmed = window.confirm("Are you sure you want to delete this book? This action cannot be undone.");
    if (confirmed) {
        // Remove the book from the allBooks array by filtering it out
        allBooks = allBooks.filter(function(book) {
            return book.id != currentEditingBookId;
        });
        // Reset the editing flag
        currentEditingBookId = null;

        // Re-render the book list. You can either clear the filters or simply update the UI.
        clearFiltersAndReinsertBooks();
        
        // Optionally hide the modal after deletion
        hideBookModal();
    }
}


function clearFiltersAndReinsertBooks() {
    document.getElementById('filter-title').value = ""
    document.getElementById('filter-min-length').value = ""
    document.getElementById('filter-max-length').value = ""
    document.getElementById('filter-author').value = ""

    doFilterUpdate()
}

function showEditBookModal(bookElem) {
    // Fill the modal inputs with the current book data
    document.getElementById('title-input').value  = bookElem.getAttribute('data-title');
    document.getElementById('author-input').value = bookElem.getAttribute('data-author'); 
    document.getElementById('length-input').value = bookElem.getAttribute('data-length');

    // Store the book's id so we know which book to update
    currentEditingBookId = bookElem.getAttribute('data-id');

    var modalTitle = document.getElementById('modal-title');
    modalTitle.textContent = "Edit Book";

    var editBookModal = document.getElementById('add-book-modal');
    var modalBackdrop = document.getElementById('book-backdrop');
    editBookModal.classList.remove('hidden');
    modalBackdrop.classList.remove('hidden');

    // Show the delete button since we're in edit mode
    var modalDeleteButton = document.getElementById('modal-delete');
    if (modalDeleteButton) {
        modalDeleteButton.style.display = 'inline-block';
    }
}

function showAddBookModal() {
    var modalTitle = document.getElementById('modal-title');
    var addBookModal = document.getElementById('add-book-modal');
    var modalBackdrop = document.getElementById('book-backdrop');

    modalTitle.textContent = "Add a Book";
    addBookModal.classList.remove('hidden');
    modalBackdrop.classList.remove('hidden');

    // Hide the delete button when adding a new book
    var modalDeleteButton = document.getElementById('modal-delete');
    if (modalDeleteButton) {
        modalDeleteButton.style.display = 'none';
    }
}

function clearBookModalInputs() {
    var bookTextInputElements = [
        document.getElementById('title-input'),
        document.getElementById('length-input'),
        document.getElementById('author-input')
    ]

    /*
     * Clear any text entered in the text inputs.
     */
    bookTextInputElements.forEach(function (inputElem) {
        inputElem.value = ''
    })
}

function hideBookModal() {
    var addBookModal = document.getElementById('add-book-modal')
    var modalBackdrop = document.getElementById('book-backdrop')

    addBookModal.classList.add('hidden')
    modalBackdrop.classList.add('hidden')

    clearBookModalInputs()
}

function bookPassesFilters(book, filters) {
    if (filters.title) {
        var bookTitle = book.title.toLowerCase();
        var filterTitle = filters.title.toLowerCase();
        if (bookTitle.indexOf(filterTitle) === -1) {
            return false;
        }
    }

    if (filters.minLength) {
        var filterMinLength = Number(filters.minLength);
        if (Number(book.length) < filterMinLength) {
            return false;
        }
    }

    if (filters.maxLength) {
        var filterMaxLength = Number(filters.maxLength);
        if (Number(book.length) > filterMaxLength) {
            return false;
        }
    }

    if (filters.author) {
        if (book.author.toLowerCase() !== filters.author.toLowerCase()) {
            return false;
        }
    }

    return true;
}

function doFilterUpdate() {
    /*
     * Grab values of filters from user inputs.
     */
    var filters = {
        title: document.getElementById('filter-title').value.trim(),
        minLength: document.getElementById('filter-min-length').value,
        maxLength: document.getElementById('filter-max-length').value,
        author: document.getElementById('filter-author').value.trim()
    }

    /*
     * Remove all "book" elements from the DOM.
     */
    var bookContainer = document.getElementById('books-container')
    while(bookContainer.lastChild) {
        bookContainer.removeChild(bookContainer.lastChild)
    }

    /*
     * Loop through the collection of all "book" elements and re-insert ones
     * that meet the current filtering criteria.
     */
    allBooks.forEach(function (book) {
        if (bookPassesFilters(book, filters)) {
            insertNewBook(
                book.title,
                book.length,
                book.author,
                book.id
            )
        }
    })
}

function parseBookElem(bookElem) {
    var book = {
        title:  bookElem.getAttribute('data-title'),
        length: bookElem.getAttribute('data-length'),
        author: bookElem.getAttribute('data-author'),
        id: bookElem.getAttribute('data-id')
    }

    return book
}



window.addEventListener('DOMContentLoaded', function () {
    /*
     * Remember all of the initial book elements initially displayed in the page.
     */
    var bookElems = document.getElementsByClassName('book')
    for (var i = 0; i < bookElems.length; i++) {
        allBooks.push(parseBookElem(bookElems[i]))
    }
    
    var booksContainer = this.document.getElementById('books-container')
    booksContainer.addEventListener('click', (event) => {
        var bookElement = event.target.closest('.book');
        if (bookElement) {
            showEditBookModal(bookElement);
        }
    });
    

    var addBookButton = document.getElementsByClassName('add-book-button')
    for (var i = 0; i < addBookButton.length; i++) {
        addBookButton[i].addEventListener('click', showAddBookModal)
    }

    var modalAcceptButton = document.getElementById('modal-accept')
    if (modalAcceptButton) {
        modalAcceptButton.addEventListener('click', handleModalAcceptClick)
    }

    var modalDeleteButton = document.getElementById('modal-delete');
    if (modalDeleteButton) {
        modalDeleteButton.addEventListener('click', handleDeleteBook);
    }

    var modalHideButtons = document.getElementsByClassName('modal-hide-button')
    for (var i = 0; i < modalHideButtons.length; i++) {
        modalHideButtons[i].addEventListener('click', hideBookModal)
    }

    var filterUpdateButton = document.getElementById('filter-update-button')
    if (filterUpdateButton) {
        filterUpdateButton.addEventListener('click', doFilterUpdate)
    }
})