function insertNewBook(title, length, author) {

    var book = Handlebars.templates.book({
        title: title,
        length: length,
        author: author,
    })

    // /*
    //  * Add the new book element into the DOM at the end of the bookshelf.
    //  */
    var bookshelf = document.getElementById('bookshelf')
    bookshelf.insertAdjacentHTML( "beforeend", book)
}

var allBooks = []

function handleModalAcceptClick() {
    var title  = document.getElementById('title-input').value.trim()
    var length = document.getElementById('length-input').value.trim()
    var author = document.getElementById('author-input').value.trim()

    if (!title) {
        alert("You must at least have a title")
    } else {
        allBooks.push({
            title: title,
            length: length,
            author: author,
        })
        clearFiltersAndReinsertBooks()
        hideAddBookModal()
    }
}

function clearFiltersAndReinsertBooks() {
    document.getElementById('filter-title').value = ""
    document.getElementById('filter-min-length').value = ""
    document.getElementById('filter-max-length').value = ""
    document.getElementById('filter-author').value = ""

    doFilterUpdate()
}

function showAddBookModal() {
    var addBookModal = document.getElementById('add-book-modal')
    var modalBackdrop = document.getElementById('book-backdrop')

    addBookModal.classList.remove('hidden')
    modalBackdrop.classList.remove('hidden')
}

function clearAddBookModalInputs() {
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

function hideAddBookModal() {
    var addBookModal = document.getElementById('add-book-modal')
    var modalBackdrop = document.getElementById('book-backdrop')

    addBookModal.classList.add('hidden')
    modalBackdrop.classList.add('hidden')

    clearAddBookModalInputs()
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
    var bookContainer = document.getElementById('bookshelf')
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
                book.author
            )
        }
    })
}

function parseBookElem(bookElem) {
    var book = {
        title:  bookElem.getAttribute('data-title'),
        length: bookElem.getAttribute('data-length'),
        author: bookElem.getAttribute('data-author')
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

    var addBookButton = document.getElementById('add-book-button')
    if (addBookButton) {
        addBookButton.addEventListener('click', showAddBookModal)
    }

    var modalAcceptButton = document.getElementById('modal-accept')
    if (modalAcceptButton) {
        modalAcceptButton.addEventListener('click', handleModalAcceptClick)
    }

    var modalHideButtons = document.getElementsByClassName('modal-hide-button')
    for (var i = 0; i < modalHideButtons.length; i++) {
        modalHideButtons[i].addEventListener('click', hideAddBookModal)
    }

    var filterUpdateButton = document.getElementById('filter-update-button')
    if (filterUpdateButton) {
        filterUpdateButton.addEventListener('click', doFilterUpdate)
    }
})