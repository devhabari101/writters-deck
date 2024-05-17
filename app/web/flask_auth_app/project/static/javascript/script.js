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

        // Append section to markdown content div (outside loop)
        markdownContentDiv.appendChild(section);

        // Iterate over each item in the JSON data
        data.forEach(item => {
            // Create row, column, and inner column elements
            const rowDiv = document.createElement('div');
            rowDiv.classList.add('row');

            const columnDiv = document.createElement('div');
            columnDiv.classList.add('col-md-8', 'col-lg-9', 'p-b-80');

            const innerColumnDiv = document.createElement('div');
            innerColumnDiv.classList.add('p-r-45', 'p-r-0-lg');

            // Append column elements to row and row to container
            rowDiv.appendChild(columnDiv);
            containerDiv.appendChild(rowDiv);
            columnDiv.appendChild(innerColumnDiv);

            // Create div for item blog
            const itemBlogDiv = document.createElement('div');
            itemBlogDiv.classList.add('p-b-63');

            // Create link element that wraps the image
            const linkElement = document.createElement('a');
            linkElement.href = 'blog-detail.html';
            linkElement.classList.add('hov-img0', 'how-pos5-parent');

            // Create image element
            const imageElement = document.createElement('img');
            imageElement.src = item.metadata.image_url;
            imageElement.alt = 'IMG-BLOG';

            // Create date div
            const dateDiv = document.createElement('div');
            dateDiv.classList.add('flex-col-c-m', 'size-123', 'bg9', 'how-pos5');

            const date = new Date(item.metadata.date);
            const day = date.getDate();
            const month = date.toLocaleString('default', { month: 'short' });
            const year = date.getFullYear();

            const daySpan = document.createElement('span');
            daySpan.classList.add('ltext-107', 'cl2', 'txt-center');
            daySpan.textContent = day;

            const monthYearSpan = document.createElement('span');
            monthYearSpan.classList.add('stext-109', 'cl3', 'txt-center');
            monthYearSpan.textContent = `${month} ${year}`;

            dateDiv.appendChild(daySpan);
            dateDiv.appendChild(monthYearSpan);

            // Append image and date to link element
            linkElement.appendChild(imageElement);
            linkElement.appendChild(dateDiv);

            // Create content div
            const contentDiv = document.createElement('div');
            contentDiv.classList.add('p-t-32');

            const titleElement = document.createElement('h4');
            titleElement.classList.add('p-b-15');

            const titleLink = document.createElement('a');
            titleLink.href = 'blog-detail.html';
            titleLink.classList.add('ltext-108', 'cl2', 'hov-cl1', 'trans-04');
            titleLink.textContent = item.metadata.title;

            titleElement.appendChild(titleLink);

            const contentParagraph = document.createElement('p');
            contentParagraph.classList.add('stext-117', 'cl6');
            const htmlContent = converter.makeHtml(item.content);
            contentParagraph.innerHTML = htmlContent;

            contentDiv.appendChild(titleElement);
            contentDiv.appendChild(contentParagraph);

            // Create author and category elements
            const authorCategoryDiv = document.createElement('div');
            authorCategoryDiv.classList.add('flex-w', 'flex-sb-m', 'p-t-18');

            const authorDiv = document.createElement('span');
            authorDiv.classList.add('flex-w', 'flex-m', 'stext-111', 'cl2', 'p-r-30', 'm-tb-10');
            authorDiv.innerHTML = `<span class="cl4">By</span> Admin <span class="cl12 m-l-4 m-r-6">|</span>`;

            authorCategoryDiv.appendChild(authorDiv);

            // Dynamically create category elements
            if (item.metadata.categories && item.metadata.categories.length > 0) {
                const categoriesDiv = document.createElement('span');
                categoriesDiv.classList.add('flex-w', 'flex-m', 'stext-111', 'cl2', 'p-r-30', 'm-tb-10');

                item.metadata.categories.forEach(category => {
                    const categorySpan = document.createElement('span');
                    categorySpan.textContent = category;
                    categorySpan.classList.add('cl4'); // Add category color class if needed

                    categoriesDiv.appendChild(categorySpan);

                    const separatorSpan = document.createElement('span');
                    separatorSpan.classList.add('cl12', 'm-l-4', 'm-r-6');
                    separatorSpan.textContent = '|';
                    categoriesDiv.appendChild(separatorSpan);
                });

                authorCategoryDiv.appendChild(categoriesDiv);
            }

            // Create "Continue Reading" link
            const continueReadingLink = document.createElement('a');
            continueReadingLink.href = 'blog-detail.html';
            continueReadingLink.classList.add('stext-101', 'cl2', 'hov-cl1', 'trans-04', 'm-tb-10');
            continueReadingLink.innerHTML = `Continue Reading <i class="fa fa-long-arrow-right m-l-9"></i>`;

            authorCategoryDiv.appendChild(continueReadingLink);

            // Append link element, content div, and author/category div to item blog div
            itemBlogDiv.appendChild(linkElement);
            itemBlogDiv.appendChild(contentDiv);
            itemBlogDiv.appendChild(authorCategoryDiv);

            // Append item blog div to inner column div
            innerColumnDiv.appendChild(itemBlogDiv);
        });
    })
    .catch(error => console.error('Error fetching JSON:', error));
