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
            // Create container, row, and column elements
            const rowDiv = document.createElement('div');
            rowDiv.classList.add('row');

            const columnDiv = document.createElement('div');
            columnDiv.classList.add('col-md-8', 'col-lg-9', 'p-b-80');
            columnDiv.style.paddingRight = '45px'; // Applying inline style

            const innerColumnDiv = document.createElement('div');
            innerColumnDiv.classList.add('p-r-0-lg');

            // Append column elements to row and row to container
            rowDiv.appendChild(columnDiv);
            containerDiv.appendChild(rowDiv);
            columnDiv.appendChild(innerColumnDiv);
            markdownContentDiv.appendChild(section);

            // Create article element for each item
            const articleElement = document.createElement('article');
            articleElement.className = 'card'; // Using Bulma card class

            // Create elements for each field
            const titleElement = document.createElement('h2');
            const imageWrapperElement = document.createElement('div');
            imageWrapperElement.classList.add('p-b-63');
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
            imageElement.classList.add('hov-img0', 'how-pos5-parent', 'is-16by9'); // Add Bulma classes for image aspect ratio
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
            articleElement.appendChild(attributionElement);
            articleElement.appendChild(dateElement);
            articleElement.appendChild(categoryElement);
            articleElement.appendChild(trendingElement);
            articleElement.appendChild(topPickElement);
            articleElement.appendChild(popularElement);
            articleElement.appendChild(linkElement);

            // Wrap image element in a div with class "p-b-63" and append to article element
            imageWrapperElement.appendChild(imageElement);
            articleElement.appendChild(imageWrapperElement);

            // Append content element (markdown) to the article element
            articleElement.appendChild(contentElement);

            // Append article element to the inner column div
            innerColumnDiv.appendChild(articleElement);
        });
        
        // Adjust width of the image
        const images = document.querySelectorAll('.image');
        images.forEach(image => {
            // image.style.width = '75%';
        });
    })
    .catch(error => console.error('Error fetching JSON:', error));
