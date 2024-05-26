// components/category.js

// Function to fetch and populate category list
export function populateCategoryList() {
    fetch('markdown_output.json') // Adjusted path to include the root directory
        .then(response => response.json())
        .then(data => {
            // Get the category list element
            const categoryList = document.getElementById('category-list');

            // Array to store unique categories
            const categories = [];

            // Iterate over each item in the JSON data
            data.forEach(item => {
                // Extract category from metadata
                const category = item.metadata.category;

                // If category is not already in the categories array, add it
                if (!categories.includes(category)) {
                    categories.push(category);

                    // Create list item for the category and add it to the category list
                    const listItem = document.createElement('li');
                    listItem.textContent = category;
                    categoryList.appendChild(listItem);
                }
            });
        })
        .catch(error => console.error('Error fetching JSON:', error));
}
