// Fetch JSON data from the server and render markdown content
fetch('markdown_output.json')
    .then(response => response.json())
    .then(data => {
        console.log('Fetched data:', data); // Debugging: Log fetched data

        // Get the div element to display the markdown content
        const markdownContentDiv = document.getElementById('markdown-content');

        // Create a new instance of Showdown converter
        const converter = new showdown.Converter(); // Define and initialize converter
        
        // Create section element
        const section = document.createElement('section');
        section.classList.add('bg0', 'p-t-62', 'p-b-60');

        // Create container element
        const containerDiv = document.createElement('div');
        containerDiv.classList.add('container');

        // Append container element to section
        section.appendChild(containerDiv);

        // Iterate over each item in the JSON data
        data.forEach(item => {
            // Create row, column, and inner column elements
            const rowDiv = document.createElement('div');
            rowDiv.classList.add('row');

            const columnDiv = document.createElement('div');
            columnDiv.classList.add('col-md-8', 'col-lg-9', 'p-b-80');
            columnDiv.style.paddingRight = '45px'; // Applying inline style

            const innerColumnDiv = document.createElement('div');
            innerColumnDiv.classList.add('p-r-45', 'p-r-0-lg');

            // Append column elements to row and row to container
            rowDiv.appendChild(columnDiv);
            containerDiv.appendChild(rowDiv);
            columnDiv.appendChild(innerColumnDiv);
            markdownContentDiv.appendChild(section);

            // Create div for item blog
            const itemBlogDiv = document.createElement('div');
            itemBlogDiv.classList.add('p-b-63');

            // Create link element that wraps the content
            const linkElement = document.createElement('a');
            linkElement.href = 'blog-detail.html';
            linkElement.classList.add('hov-img0', 'how-pos5-parent');

            // Create image element
            const imageElement = document.createElement('img');
            imageElement.src = item.metadata.image_url;
            imageElement.alt = 'IMG-BLOG';

            // Create elements for each field
            const titleElement = document.createElement('h2');
            titleElement.textContent = item.metadata.title;

            const attributionElement = document.createElement('div');
            attributionElement.textContent = `Image Attribution: ${item.metadata.imageAttribution}`;

            const dateElement = document.createElement('h2');
            dateElement.textContent = `Date: ${item.metadata.date}`;

            const categoryElement = document.createElement('div');
            categoryElement.textContent = `Category: ${item.metadata.category}`;

            const trendingElement = document.createElement('div');
            trendingElement.textContent = `Trending: ${item.metadata.trending}`;

            const topPickElement = document.createElement('div');
            topPickElement.textContent = `Top Pick: ${item.metadata.topPick}`;

            const popularElement = document.createElement('div');
            popularElement.textContent = `Popular: ${item.metadata.popular}`;

            const linkMetadataElement = document.createElement('a');
            linkMetadataElement.href = item.metadata.link;
            linkMetadataElement.textContent = 'Link';

            // Convert Markdown content to HTML using showdown.js
            const contentElement = document.createElement('div');
            const htmlContent = converter.makeHtml(item.content);
            contentElement.innerHTML = htmlContent;

            // Append elements to the link element
            linkElement.appendChild(imageElement);
            linkElement.appendChild(titleElement);
            linkElement.appendChild(attributionElement);
            linkElement.appendChild(dateElement);
            linkElement.appendChild(categoryElement);
            linkElement.appendChild(trendingElement);
            linkElement.appendChild(topPickElement);
            linkElement.appendChild(popularElement);
            linkElement.appendChild(linkMetadataElement);
            linkElement.appendChild(contentElement);

            // Append link element to item blog div
            itemBlogDiv.appendChild(linkElement);

            // Append item blog div to inner column div
            innerColumnDiv.appendChild(itemBlogDiv);
        });
    })
    .catch(error => console.error('Error fetching JSON:', error));
