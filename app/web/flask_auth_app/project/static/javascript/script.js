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

            console.log('Sorted data:', data); // Debugging: Log sorted data

            // Get the div element to display the markdown content
            const markdownContentDiv = document.getElementById('markdown-content');

            // Create a new instance of Showdown converter
            const converter = new showdown.Converter();
            
            // Create section element
            const section = document.createElement('section');
            section.classList.add('bg0', 'p-t-62', 'p-b-60');

            // Create container element
            const containerDiv = document.createElement('div');
            containerDiv.classList.add('container');
            section.appendChild(containerDiv);

            // Create row element
            const rowDiv = document.createElement('div');
            rowDiv.classList.add('row');
            containerDiv.appendChild(rowDiv);

            // Create main content column
            const columnDiv = document.createElement('div');
            columnDiv.classList.add('col-md-8', 'col-lg-9', 'p-b-80');

            const innerColumnDiv = document.createElement('div');
            innerColumnDiv.classList.add('p-r-45', 'p-r-0-lg');
            columnDiv.appendChild(innerColumnDiv);
            rowDiv.appendChild(columnDiv);

            // Process data to identify popular markdowns
            const popularMarkdowns = data.filter(item => item.metadata.popular === 'on');
            console.log('Popular Markdowns:', popularMarkdowns); // Debugging: Log popular markdowns

            // Sort popular markdowns by date as well
            popularMarkdowns.sort((a, b) => parseDate(b.metadata.date) - parseDate(a.metadata.date));
            console.log('Sorted Popular Markdowns:', popularMarkdowns); // Debugging: Log sorted popular markdowns

            // Iterate over each item in the JSON data
            data.forEach(item => {
                const itemBlogDiv = document.createElement('div');
                itemBlogDiv.classList.add('p-b-63');

                const linkElement = document.createElement('a');
                linkElement.href = 'blog-detail.html';
                linkElement.classList.add('hov-img0', 'how-pos5-parent');

                const imageElement = document.createElement('img');
                imageElement.src = item.metadata.image_url;
                imageElement.alt = 'IMG-BLOG';

                const dateDiv = document.createElement('div');
                dateDiv.classList.add('flex-col-c-m', 'size-123', 'bg9', 'how-pos5');

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
                linkElement.appendChild(imageElement);
                linkElement.appendChild(dateDiv);

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
                innerColumnDiv.appendChild(itemBlogDiv);
            });

            const categories = data.map(item => item.metadata.category);
            const uniqueCategories = [...new Set(categories)];

            // Add archive handling
            const archiveMap = new Map();
            data.forEach(markdown => {
                const [day, month, year] = markdown.metadata.date.split('-');
                const key = `${year}-${month}`;
                if (!archiveMap.has(key)) {
                    archiveMap.set(key, []);
                }
                archiveMap.get(key).push(markdown);
            });

            const sortedArchiveKeys = Array.from(archiveMap.keys()).sort((a, b) => new Date(b) - new Date(a));
            const archiveDiv = document.createElement('div');
            archiveDiv.classList.add('p-t-65');

            const archiveTitle = document.createElement('h4');
            archiveTitle.classList.add('mtext-112', 'cl2', 'p-b-33');
            archiveTitle.textContent = 'Archive';

            const archiveList = document.createElement('ul');

            sortedArchiveKeys.forEach(key => {
                const [year, month] = key.split('-');
                const monthName = new Date(year, month - 1).toLocaleString('default', { month: 'long' });
                const posts = archiveMap.get(key);
                const archiveItem = document.createElement('li');

                const archiveLink = document.createElement('a');
                archiveLink.href = `archive.html?year=${year}&month=${month}`;
                archiveLink.classList.add('dis-block', 'stext-115', 'cl6', 'hov-cl1', 'trans-04', 'p-tb-8');
                archiveLink.textContent = `${monthName} ${year} (${posts.length})`;

                archiveItem.appendChild(archiveLink);
                archiveList.appendChild(archiveItem);
            });

            archiveDiv.appendChild(archiveTitle);
            archiveDiv.appendChild(archiveList);
            innerColumnDiv.appendChild(archiveDiv);

            // Add category filter section
            const categoryDiv = document.createElement('div');
            categoryDiv.classList.add('p-t-50');

            const categoryTitle = document.createElement('h4');
            categoryTitle.classList.add('mtext-112', 'cl2', 'p-b-33');
            categoryTitle.textContent = 'Categories';

            const categoryList = document.createElement('ul');

            uniqueCategories.forEach(category => {
                const categoryItem = document.createElement('li');

                const categoryLink = document.createElement('a');
                categoryLink.href = 'index.html';
                categoryLink.classList.add('dis-block', 'stext-115', 'cl6', 'hov-cl1', 'trans-04', 'p-tb-8');
                categoryLink.textContent = category;

                categoryItem.appendChild(categoryLink);
                categoryList.appendChild(categoryItem);
            });

            categoryDiv.appendChild(categoryTitle);
            categoryDiv.appendChild(categoryList);
            innerColumnDiv.appendChild(categoryDiv);

            // Append the section element to the markdown content div
            markdownContentDiv.appendChild(section);

            // Call createSidebar to initialize the sidebar
            createSidebar();
        } catch (error) {
            console.error('Error processing data:', error);
        }
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });
