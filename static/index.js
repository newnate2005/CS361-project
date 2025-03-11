var currentEditingBookId = null;

async function handleModalAcceptClick() {
    console.log("Current Editing Book ID:", currentEditingBookId); // Debugging

    if (currentEditingBookId) {
        console.log("Editing existing book...");
    } else {
        console.log("Adding new book...");
    }
    var title  = document.getElementById('title-input').value.trim();
    var length = document.getElementById('length-input').value.trim();
    var author = document.getElementById('author-input').value.trim();
    var timesRead = document.getElementById('timesRead-input').value.trim();
    var review = document.getElementById('review-input').value.trim();
    var genre = document.getElementById('genre-input').value.trim();
    var image = document.getElementById('image-input').value.trim();

    if (!title) {
        alert("You must at least have a title");
        return;
    }

    let bookData = { 
      title, 
      author, 
      length, 
      timesRead: timesRead ? Number(timesRead) : 0, 
      review, 
      genre, 
      image 
    };

    try {
        if (currentEditingBookId) {
            // Update existing book
            let response = await fetch(`/update-book/${currentEditingBookId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(bookData)
            });
            if (response.ok) {
                location.reload();
            } else {
                alert("Error updating book");
            }
        } else {
            // Add new book
            let response = await fetch("/add-book", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(bookData)
            });
            if (response.ok) {
                location.reload();
            } else {
                alert("Error adding book");
            }
        }
    } catch (err) {
        console.error(err);
        alert("Operation failed");
    }

    hideBookModal();
}

async function handleDeleteBook() {
    if (!currentEditingBookId) return;
    var confirmed = window.confirm("Are you sure you want to delete this book? This action cannot be undone.");
    if (confirmed) {
        try {
            let response = await fetch(`/delete-book/${currentEditingBookId}`, {
                method: "DELETE"
            });
            if (response.ok) {
                location.reload();
            } else {
                alert("Error deleting book");
            }
        } catch (err) {
            console.error(err);
            alert("Operation failed");
        }
    }
}

function showEditBookModal(bookElem) {
    currentEditingBookId = bookElem.getAttribute('data-id');
    console.log("Book ID set for editing:", currentEditingBookId);  // Debugging  

    if (!currentEditingBookId) {
        console.error("Error: Book ID is missing!");
        return; // Stop execution if no ID
    }

    document.getElementById('title-input').value = bookElem.getAttribute('data-title');
    document.getElementById('author-input').value = bookElem.getAttribute('data-author');
    document.getElementById('length-input').value = bookElem.getAttribute('data-length');
    document.getElementById('timesRead-input').value = bookElem.getAttribute('data-timesread') || 0;
    document.getElementById('review-input').value = bookElem.getAttribute('data-review') || "";
    document.getElementById('genre-input').value = bookElem.getAttribute('data-genre') || "";
    document.getElementById('image-input').value = bookElem.getAttribute('data-image') || "";
    
    document.getElementById('modal-title').textContent = "Edit Book";

    var editBookModal = document.getElementById('add-book-modal');
    var modalBackdrop = document.getElementById('book-backdrop');
    editBookModal.classList.remove('hidden');
    modalBackdrop.classList.remove('hidden');

    var modalDeleteButton = document.getElementById('modal-delete');
    if (modalDeleteButton) {
        modalDeleteButton.style.display = 'inline-block';
    }
}

function showAddBookModal() {
    // Reset the editing ID to ensure a new book is created
    currentEditingBookId = null;
    
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
        document.getElementById('author-input'),
        document.getElementById('timesRead-input'),
        document.getElementById('review-input'),
        document.getElementById('genre-input'),
        document.getElementById('image-input')
    ]
    
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

window.addEventListener('DOMContentLoaded', function () {

    const booksContainers = document.querySelectorAll('.books-container');
    booksContainers.forEach(container => {
        container.addEventListener('click', (event) => {
            const bookElement = event.target.closest('.book');
            if (bookElement) {
            showEditBookModal(bookElement);
            }
        });
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
})