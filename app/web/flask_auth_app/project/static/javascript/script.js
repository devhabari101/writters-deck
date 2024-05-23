import { createSidebar } from './sidebar.js';
// import { getLatestPopularMarkdown, renderLatestTrendingMarkdowns } from './block.js';

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

        // Iterate over the fetched data to create blog entries
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
            monthYearSpan.textContent = `${monthName}
