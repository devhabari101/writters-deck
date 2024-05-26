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
            // Create article element for each item
            const articleElement = document.createElement('article');
            articleElement.className = 'card'; // Using Bulma card class

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
            const contentElement = document.createElement('div');

            // Set values for each field
            titleElement.textContent = item.metadata.title;
            imageElement.src = item.metadata.image_url;
            imageElement.classList.add('image', 'is-16by9'); // Add Bulma classes for image aspect ratio
            attributionElement.textContent = `Image Attribution: ${item.metadata.imageAttribution}`;
            dateElement.textContent = `Date: ${item.metadata.date}`;
            categoryElement.textContent = `Category: ${item.metadata.category}`;
            trendingElement.textContent = `Trending: ${item.metadata.trending}`;
            topPickElement.textContent = `Top Pick: ${item.metadata.topPick}`;
            popularElement.textContent = `Popular: ${item.metadata.popular}`;
            linkElement.href = item.metadata.link;
            linkElement.textContent = 'Link';

            // Convert Markdown content to HTML using showdown.js
            const htmlContent = converter.makeHtml(item.content);
            contentElement.innerHTML = htmlContent;

            // Append elements to the article element
            articleElement.appendChild(titleElement);
            articleElement.appendChild(imageElement);
            articleElement.appendChild(attributionElement);
            articleElement.appendChild(dateElement);
            articleElement.appendChild(categoryElement);
            articleElement.appendChild(trendingElement);
            articleElement.appendChild(topPickElement);
            articleElement.appendChild(popularElement);
            articleElement.appendChild(linkElement);
            
            // Append content element (markdown) to the article element
            articleElement.appendChild(contentElement);

            // Append article element to the markdownContentDiv
            markdownContentDiv.appendChild(articleElement);
        });
        
        // Adjust width of the image
        const images = markdownContentDiv.querySelectorAll('.image');
        images.forEach(image => {
            image.style.width = '100%';
        });
    })
    .catch(error => console.error('Error fetching JSON:', error));
