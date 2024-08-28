import { createSidebar } from './sidebar.js';

fetch('markdown_output.json')
    .then(response => response.json())
    .then(data => {
        try {
            console.log('Fetched data:', data); // Debugging: Log fetched data

            // Function to parse dates safely
            const parseDate = (dateString) => {
                const dateParts = dateString.split('-');
                if (dateParts.length === 3) {
                    const [day, month, year] = dateParts;
                    return new Date(`${year}-${month}-${day}`);
                } else {
                    console.error('Invalid date format:', dateString);
                    return new Date(dateString); // Fallback parsing
                }
            };

            // Sort data by date
            data.sort((a, b) => {
                const dateA = parseDate(a.metadata.date);
                const dateB = parseDate(b.metadata.date);
                console.log('Comparing dates:', dateA, dateB); // Debugging: Log date comparisons
                return dateB - dateA;
            });

            // Create a new instance of Showdown converter
            const converter = new showdown.Converter();
            
            // Create a category filter
            const categories = data.map(item => item.metadata.category);
            const uniqueCategories = [...new Set(categories)];

            const categoryFilterDiv = document.getElementById('category-filter');
            uniqueCategories.forEach(category => {
                const button = document.createElement('button');
                button.classList.add('stext-106', 'cl6', 'hov1', 'bor3', 'trans-04', 'm-r-32', 'm-tb-5');
                button.dataset.filter = `.${category.toLowerCase()}`;
                button.textContent = category;
                button.addEventListener('click', () => {
                    // Handle category filter click
                    filterByCategory(category);
                });
                categoryFilterDiv.appendChild(button);
            });

            // Display archive content
            displayArchiveContent(data);

        } catch (error) {
            console.error('Error processing data:', error);
        }
    })
    .catch(error => {
        console.error('Error fetching markdown data:', error);
    });

// Function to display archive content based on posts
function displayArchiveContent(posts) {
    const archiveContainer = document.getElementById('archive-container');
    archiveContainer.innerHTML = ''; // Clear previous content

    posts.forEach(post => {
        const itemBlogDiv = document.createElement('div');
        itemBlogDiv.classList.add('p-b-63');

        const linkElement = document.createElement('a');
        linkElement.href = 'blog-detail.html';
        linkElement.classList.add('hov-img0', 'how-pos5-parent');

        const imageElement = document.createElement('img');
        imageElement.src = post.metadata.image_url;
        imageElement.alt = 'IMG-BLOG';

        const dateDiv = document.createElement('div');
        dateDiv.classList.add('flex-col-c-m', 'size-123', 'bg9', 'how-pos5');

        const [day, month, year] = post.metadata.date.split('-');
        const monthName = new Date(`${year}-${month}-${day}`).toLocaleString('default', { month: 'short' });

        const daySpan = document.createElement('span');
        daySpan.classList.add('ltext-107', 'cl2', 'txt-center');
        daySpan.textContent = day;

        const monthYearSpan = document.createElement('span');
        monthYearSpan.classList.add('stext-109', 'cl3', 'txt-center');
        monthYearSpan.textContent = `${monthName} ${year}`;

        dateDiv.appendChild(daySpan);
        dateDiv.appendChild(monthYearSpan);
        linkElement.appendChild(imageElement);
        linkElement.appendChild(dateDiv);

        const contentDiv = document.createElement('div');
        contentDiv.classList.add('p-t-32');

        const titleElement = document.createElement('h4');
        titleElement.classList.add('p-b-15');

        const titleLink = document.createElement('a');
        titleLink.href = 'blog-detail.html';
        titleLink.classList.add('ltext-108', 'cl2', 'hov-cl1', 'trans-04');
        titleLink.textContent = post.metadata.title;

        titleElement.appendChild(titleLink);

        const contentParagraph = document.createElement('p');
        contentParagraph.classList.add('stext-117', 'cl6');
        const htmlContent = converter.makeHtml(post.content);
        contentParagraph.innerHTML = htmlContent;

        contentDiv.appendChild(titleElement);
        contentDiv.appendChild(contentParagraph);

        const authorCategoryDiv = document.createElement('div');
        authorCategoryDiv.classList.add('flex-w', 'flex-sb-m', 'p-t-18');

        const authorSpan = document.createElement('span');
        authorSpan.classList.add('flex-w', 'flex-m', 'stext-111', 'cl2', 'p-r-30', 'm-tb-10');
        authorSpan.innerHTML = `<span class="cl4">By</span> Admin <span class="cl12 m-l-4 m-r-6">|</span>`;

        const categorySpan = document.createElement('span');
        categorySpan.textContent = post.metadata.category;
        categorySpan.classList.add('cl4'); // Add category color class if needed

        const separatorSpan = document.createElement('span');
        separatorSpan.classList.add('cl12', 'm-l-4', 'm-r-6');
        separatorSpan.textContent = '|';

        authorSpan.appendChild(categorySpan);
        authorSpan.appendChild(separatorSpan);

        const continueReadingLink = document.createElement('a');
        continueReadingLink.href = 'blog-detail.html';
        continueReadingLink.classList.add('stext-101', 'cl2', 'hov-cl1', 'trans-04', 'm-tb-10');
        continueReadingLink.innerHTML = `Continue Reading <i class="fa fa-long-arrow-right m-l-9"></i>`;

        authorCategoryDiv.appendChild(authorSpan);
        authorCategoryDiv.appendChild(continueReadingLink);

        itemBlogDiv.appendChild(linkElement);
        itemBlogDiv.appendChild(contentDiv);
        itemBlogDiv.appendChild(authorCategoryDiv);
        archiveContainer.appendChild(itemBlogDiv);
    });
}

// Function to filter by category
function filterByCategory(category) {
    const filteredPosts = data.filter(post => post.metadata.category === category);
    displayArchiveContent(filteredPosts);
}
