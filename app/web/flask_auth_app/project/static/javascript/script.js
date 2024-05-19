import showdown from 'showdown'; // Import Showdown library
import { renderLatestMarkdown } from './block.js';

// Fetch JSON data from the server and render markdown content
fetch('markdown_output.json')
    .then(response => response.json())
    .then(data => {
        console.log('Fetched data:', data); // Debugging: Log fetched data

        // Create a new instance of Showdown converter
        const converter = new showdown.Converter();

        // Convert Markdown content to HTML
        data.forEach(item => {
            item.htmlContent = converter.makeHtml(item.content);
        });

        // Call the renderLatestMarkdown function with the fetched data
        renderLatestMarkdown(data);
    })
    .catch(error => console.error('Error fetching JSON:', error));
