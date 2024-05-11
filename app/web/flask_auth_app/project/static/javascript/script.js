// script.js

// Import the populateCategoryList function from category.js
//import { populateCategoryList } from './components/category.js';

// Call the function to populate category list
//populateCategoryList();

// Fetch JSON data from the server and display markdown content (without category)
fetch('markdown_output.json') // Adjusted path to include the root directory
    .then(response => response.json())
    .then(data => {
        // Get the div element to display the markdown content
        const markdownContentDiv = document.getElementById('markdown-content');

        // Iterate over each item in the JSON data
        data.forEach(item => {
            // Create elements for title and content
            const titleElement = document.createElement('h2');
            const contentElement = document.createElement('div');

            // Set title text
            titleElement.textContent = item.metadata.title;

            // Create metadata information and append to the content
            const metadataInfo = document.createElement('ul');
            metadataInfo.innerHTML = `
                <li><strong>Date:</strong> ${item.metadata.date}</li>
                <li><strong>Category:</strong> ${item.metadata.category}</li>
                <li><strong>Trending:</strong> ${item.metadata.trending}</li>
                <li><strong>Top Pick:</strong> ${item.metadata.topPick}</li>
                <li><strong>Popular:</strong> ${item.metadata.popular}</li>
                <li><strong>Link:</strong> ${item.metadata.link}</li>
            `;
            markdownContentDiv.appendChild(metadataInfo);

            // Create image element if image metadata is available
            if (item.metadata.image) {
                const imageElement = document.createElement('img');
                imageElement.src = item.metadata.image;
                if (item.metadata.imageAttribution) {
                    imageElement.setAttribute('alt', item.metadata.title);
                    imageElement.setAttribute('title', item.metadata.imageAttribution);
                }
                markdownContentDiv.appendChild(imageElement);
            }

            // Set content HTML
            contentElement.innerHTML = item.content;

            // Append title and content to the markdownContentDiv
            markdownContentDiv.appendChild(titleElement);
            markdownContentDiv.appendChild(contentElement);
        });
    })
    .catch(error => console.error('Error fetching JSON:', error));
