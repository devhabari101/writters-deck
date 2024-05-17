fetch('markdown_output.json')
    .then(response => response.json())
    .then(data => {
        console.log('Fetched data:', data); // Debugging: Log fetched data

        // Assuming categories are provided in the fetched data
        const categories = data.map(item => item.metadata.category);
        const uniqueCategories = [...new Set(categories)];

        // Filter popular markdowns
        const popularMarkdowns = data.filter(item => item.metadata.popular === 'on');

        // Append the sidebar to the row, passing popularMarkdowns as the second argument
        rowDiv.appendChild(createSidebar(uniqueCategories, popularMarkdowns));

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

            // Extract day, month, and year from item.metadata.date
            const [day, month, year] = item.metadata.date.split('-');
            const monthName = new Date(`${year}-${month}-${day}`).toLocaleString('default', { month: 'short' });

            const daySpan = document.createElement('span');
            daySpan.classList.add('ltext-107', 'cl2', 'txt-center');
            daySpan.textContent = day;

            const monthYearSpan = document.createElement('span');
            monthYearSpan.classList.add('stext-109', 'cl3', 'txt-center');
            monthYearSpan.textContent = `${monthName} ${year}`;

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

            const authorSpan = document.createElement('span');
            authorSpan.classList.add('flex-w', 'flex-m', 'stext-111', 'cl2', 'p-r-30', 'm-tb-10');
            authorSpan.innerHTML = `<span class="cl4">By</span> Admin <span class="cl12 m-l-4 m-r-6">|</span>`;

            const categorySpan = document.createElement('span');
            categorySpan.textContent = item.metadata.category;
            categorySpan.classList.add('cl4'); // Add category color class if needed

            const separatorSpan = document.createElement('span');
            separatorSpan.classList.add('cl12', 'm-l-4', 'm-r-6');
            separatorSpan.textContent = '|';

            // Append category and separator to authorSpan
            authorSpan.appendChild(categorySpan);
            authorSpan.appendChild(separatorSpan);

            // Create "Continue Reading" link
            const continueReadingLink = document.createElement('a');
            continueReadingLink.href = 'blog-detail.html';
            continueReadingLink.classList.add('stext-101', 'cl2', 'hov-cl1', 'trans-04', 'm-tb-10');
            continueReadingLink.innerHTML = `Continue Reading <i class="fa fa-long-arrow-right m-l-9"></i>`;

            authorCategoryDiv.appendChild(authorSpan);
            authorCategoryDiv.appendChild(continueReadingLink);

            // Append link element, content div, and author/category div to item blog div
            itemBlogDiv.appendChild(linkElement);
            itemBlogDiv.appendChild(contentDiv);
            itemBlogDiv.appendChild(authorCategoryDiv);

            // Append item blog div to inner column div
            innerColumnDiv.appendChild(itemBlogDiv);
        });

        // Append the complete section to the markdown content div
        markdownContentDiv.appendChild(section);
    })
    .catch(error => console.error('Error fetching JSON:', error));
