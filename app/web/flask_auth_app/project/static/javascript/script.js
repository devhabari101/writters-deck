import { renderLatestMarkdown } from './block.js';

// Fetch JSON data from the server and render markdown content
fetch('markdown_output.json')
    .then(response => response.json())
    .then(data => {
        console.log('Fetched data:', data); // Debugging: Log fetched data

        // Call the renderLatestMarkdown function with the fetched data
        renderLatestMarkdown(data);
    })
    .catch(error => console.error('Error fetching JSON:', error));
