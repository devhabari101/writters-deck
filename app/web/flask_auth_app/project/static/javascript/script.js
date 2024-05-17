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

        // Create row element
        const rowDiv = document.createElement('div');
        rowDiv.classList.add('row');

        // Append row to container
        containerDiv.appendChild(rowDiv);

        // Create main content column
        const columnDiv = document.createElement('div');
        columnDiv.classList.add('col-md-8', 'col-lg-9', 'p-b-80');

        const innerColumnDiv = document.createElement('div');
        innerColumnDiv.classList.add('p-r-45', 'p-r-0-lg');

        // Append inner column to main column and main column to row
        columnDiv.appendChild(innerColumnDiv);
        rowDiv.appendChild(columnDiv);

        // Iterate over each item in the JSON data
        data.forEach(item => {
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

            const date = new Date(item.metadata.date.split('-').reverse().join('-')); // Convert to standard format
            const day = date.getDate();
            const month = date.toLocaleString('default', { month: 'short' });
            const year = date.getFullYear();

            const daySpan = document.createElement('span');
            daySpan.classList.add('ltext-107', 'cl2', 'txt-center');
            daySpan.textContent = isNaN(day) ? '' : day;

            const monthYearSpan = document.createElement('span');
            monthYearSpan.classList.add('stext-109', 'cl3', 'txt-center');
            monthYearSpan.textContent = isNaN(year) ? '' : `${month} ${year}`;

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

            const categorySpan = document.createElement('span');
            categorySpan.textContent = item.metadata.category;
            authorDiv.appendChild(categorySpan);
            authorDiv.innerHTML += ' <span class="cl12 m-l-4 m-r-6">|</span>';

            authorCategoryDiv.appendChild(authorDiv);

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

        // Create sidebar column
        const sidebarColumnDiv = document.createElement('div');
        sidebarColumnDiv.classList.add('col-md-4', 'col-lg-3', 'p-b-80');

        const sideMenuDiv = document.createElement('div');
        sideMenuDiv.classList.add('side-menu');

        // Search bar
        const searchDiv = document.createElement('div');
        searchDiv.classList.add('bor17', 'of-hidden', 'pos-relative');

        const searchInput = document.createElement('input');
        searchInput.classList.add('stext-103', 'cl2', 'plh4', 'size-116', 'p-l-28', 'p-r-55');
        searchInput.type = 'text';
        searchInput.name = 'search';
        searchInput.placeholder = 'Search';

        const searchButton = document.createElement('button');
        searchButton.classList.add('flex-c-m', 'size-122', 'ab-t-r', 'fs-18', 'cl4', 'hov-cl1', 'trans-04');
        searchButton.innerHTML = '<i class="zmdi zmdi-search"></i>';

        searchDiv.appendChild(searchInput);
        searchDiv.appendChild(searchButton);

        // Categories
        const categoriesDiv = document.createElement('div');
        categoriesDiv.classList.add('p-t-55');

        const categoriesTitle = document.createElement('h4');
        categoriesTitle.classList.add('mtext-112', 'cl2', 'p-b-33');
        categoriesTitle.textContent = 'Categories';

        const categoriesList = document.createElement('ul');

        ['Fashion', 'Beauty', 'Street Style', 'Life Style', 'DIY & Crafts'].forEach(category => {
            const listItem = document.createElement('li');
            listItem.classList.add('bor18');

            const categoryLink = document.createElement('a');
            categoryLink.href = '#';
            categoryLink.classList.add('dis-block', 'stext-115', 'cl6', 'hov-cl1', 'trans-04', 'p-tb-8', 'p-lr-4');
            categoryLink.textContent = category;

            listItem.appendChild(categoryLink);
            categoriesList.appendChild(listItem);
        });

        categoriesDiv.appendChild(categoriesTitle);
        categoriesDiv.appendChild(categoriesList);

        // Append search bar and categories to sidebar
        sideMenuDiv.appendChild(searchDiv);
        sideMenuDiv.appendChild(categoriesDiv);

        // Add sidebar to sidebar column and sidebar column to row
        sidebarColumnDiv.appendChild(sideMenuDiv);
        rowDiv.appendChild(sidebarColumnDiv);

        // Append section to markdown content div (outside loop)
        markdownContentDiv.appendChild(section);
    })
    .catch(error => console.error('Error fetching JSON:', error));
