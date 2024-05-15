// Fetch JSON data from the server and render markdown content
fetch('markdown_output.json')
    .then(response => response.json())
    .then(data => {
        console.log('Fetched data:', data); // Debugging: Log fetched data

        // Get the div element to display the markdown content
        const markdownContentDiv = document.getElementById('markdown-content');

        // Create a new instance of Showdown converter
        const converter = new showdown.Converter();

        // Iterate over each item in the JSON data
        data.forEach(item => {
            // Create elements for each field
            const titleElement = document.createElement('h2');
            const imageElement = document.createElement('img');
            const attributionElement = document.createElement('div');
            const dateElement = document.createElement('h2');
            const categoryElement = document.createElement('div');
            const trendingElement = document.createElement('div');
            const topPickElement = document.createElement('div');
            const popularElement = document.createElement('div');
            const linkElement = document.createElement('a');
            const bodyElement = document.createElement('div');
            const contentElement = document.createElement('div');

            // Set values for each field
            titleElement.textContent = item.metadata.title;
            imageElement.src = item.metadata.image_url;
            attributionElement.textContent = `Image Attribution: ${item.metadata.imageAttribution}`;
            dateElement.textContent = `date: ${item.metadata.date}`;
            categoryElement.textContent = `Category: ${item.metadata.category}`;
            trendingElement.textContent = `Trending: ${item.metadata.trending}`;
            topPickElement.textContent = `Top Pick: ${item.metadata.topPick}`;
            popularElement.textContent = `Popular: ${item.metadata.popular}`;
            linkElement.href = item.metadata.link;
            linkElement.textContent = 'Link';

            // Convert Markdown content to HTML using showdown.js
            const htmlContent = converter.makeHtml(item.content);
            contentElement.innerHTML = htmlContent;

            // Append elements to the markdownContentDiv
            markdownContentDiv.appendChild(titleElement);
            markdownContentDiv.appendChild(imageElement);
            markdownContentDiv.appendChild(attributionElement);
            markdownContentDiv.appendChild(dateElement);
            markdownContentDiv.appendChild(categoryElement);
            markdownContentDiv.appendChild(trendingElement);
            markdownContentDiv.appendChild(topPickElement);
            markdownContentDiv.appendChild(popularElement);
            markdownContentDiv.appendChild(linkElement);
            markdownContentDiv.appendChild(contentElement);
        });
    })
    .catch(error => console.error('Error fetching JSON:', error));
