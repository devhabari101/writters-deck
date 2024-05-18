import { createSidebar } from './sidebar.js';
import { getLatestPopularMarkdown, renderLatestTrendingMarkdowns} from './block.js';

fetch('markdown_output.json')
    .then(response => response.json())
    .then(data => {
        console.log('Fetched data:', data);

        const markdownContentDiv = document.getElementById('markdown-content');
        const converter = new showdown.Converter();

        const section = document.createElement('section');
        section.classList.add('bg0', 'p-t-62', 'p-b-60');

        const containerDiv = document.createElement('div');
        containerDiv.classList.add('container');
        section.appendChild(containerDiv);

        const rowDiv = document.createElement('div');
        rowDiv.classList.add('row');
        containerDiv.appendChild(rowDiv);

        const columnDiv = document.createElement('div');
        columnDiv.classList.add('col-md-8', 'col-lg-9', 'p-b-80');

        const innerColumnDiv = document.createElement('div');
        innerColumnDiv.classList.add('p-r-45', 'p-r-0-lg');
        columnDiv.appendChild(innerColumnDiv);
        rowDiv.appendChild(columnDiv);

        const popularMarkdowns = data.filter(item => item.metadata.popular === 'on');

        // Insert the latest popular markdown into the first column
        const firstColumnDiv = document.querySelector('.d-flex .col-md-4:first-child');
        if (popularMarkdowns.length > 0) {
            const latestPopularMarkdownDiv = getLatestPopularMarkdown(popularMarkdowns);
            firstColumnDiv.innerHTML = ''; // Clear existing content
            firstColumnDiv.appendChild(latestPopularMarkdownDiv);
        }
        // Render the latest trending markdowns in the second column
        const secondColumnDiv = document.querySelector('.d-flex .col-md-4:nth-child(2)'); // Select the second column
        const latestTrendingMarkdownsDiv = renderLatestTrendingMarkdowns(data); // Use the new function to render latest trending markdowns
        secondColumnDiv.innerHTML = ''; // Clear existing content
        secondColumnDiv.appendChild(latestTrendingMarkdownsDiv); // Append the rendered markdowns to the second column

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
            categorySpan.classList.add('cl4');

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

        rowDiv.appendChild(createSidebar(uniqueCategories, popularMarkdowns));

        markdownContentDiv.appendChild(section);
    })
    .catch(error => console.error('Error fetching JSON:', error));
