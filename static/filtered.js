// static/filtered.js

var allBooks = []

// Wait for DOM to load
window.addEventListener("DOMContentLoaded", function () {
    const filterForm = document.getElementById("filter-form");
    const filteredBooksContainer = document.getElementById("filtered-books");
    const noResultsMsg = document.getElementById("no-results");
  
    // Event listener for form submission
    filterForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      // Get filter values
      const author = document.getElementById("author").value.trim();
      const genre = document.getElementById("genre").value.trim();
      const timesRead = document.getElementById("timesRead").value.trim();
      const keyword = document.getElementById("keyword").value.trim();
  
      // Build query string parameters
      const params = new URLSearchParams();
      if (author) params.append("author", author);
      if (genre) params.append("genre", genre);
      if (timesRead) params.append("timesRead", timesRead);
      if (keyword) params.append("keyword", keyword);
  
      try {
        // Call the filtering microservice (adjust port if needed)
        const response = await fetch(`http://localhost:3003/filter-books?${params.toString()}`);
        const data = await response.json();
        
        // Clear current results
        filteredBooksContainer.innerHTML = "";
        
        if (data.books && data.books.length > 0) {
          noResultsMsg.style.display = "none";
          // Render each book using the Handlebars card template
          data.books.forEach(book => {
            // Assume your Handlebars template is compiled and available as Handlebars.templates.book
            const bookHTML = Handlebars.templates.book({
              title: book.title,
              author: book.author,
              length: book.length,
              genre: book.genre,
              timesRead: book.timesRead,
              review: book.review,
              image: book.image,
              _id: book._id  // Ensure _id is passed correctly
            });
            filteredBooksContainer.insertAdjacentHTML("beforeend", bookHTML);
          });
          
          // Add click event listeners to the newly rendered cards to trigger the edit modal.
          // Assuming your cards have the class 'book' and that showEditBookModal is globally available.
          const booksContainers = document.querySelectorAll('.books-container');
          booksContainers.forEach(container => {
            container.addEventListener("click", (event) => {
              const bookElement = event.target.closest('.book');
              console.log("Editing book ID:", currentEditingBookId); // Debugging
              if (bookElement) {
                showEditBookModal(bookElement);
              }
            });
          });
        } else {
          // No books found
          noResultsMsg.style.display = "block";
        }
      } catch (error) {
        console.error("Error filtering books:", error);
      }
    });
  
    // Optionally, add event listener for the reset button to clear the results
    filterForm.addEventListener("reset", () => {
      filteredBooksContainer.innerHTML = "";
      noResultsMsg.style.display = "none";
    });
  });
