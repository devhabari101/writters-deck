import { createSidebar } from './sidebar.js';

const urlParams = new URLSearchParams(window.location.search);
const selectedMonth = urlParams.get('month');
const selectedYear = urlParams.get('year');

// Debugging: Log the selected month and year
console.log(`Selected Month: ${selectedMonth}, Selected Year: ${selectedYear}`);

fetch('markdown_output.json')
    .then(response => response.json())
    .then(data => {
        // Debugging: Log fetched data
        console.log('Fetched Data:', data);

        const parseDate = (dateString) => {
            const dateParts = dateString.split('-');
            if (dateParts.length === 3) {
                const [day, month, year] = dateParts;
                return new Date(`${year}-${month}-${day}`);
            } else {
                return new Date(dateString);
            }
        };

        data.sort((a, b) => parseDate(b.metadata.date) - parseDate(a.metadata.date));

        const archiveContainer = document.getElementById('archive-container');

        const filteredData = data.filter(item => {
            const [day, month, year] = item.metadata.date.split('-');
            return year === selectedYear && month === selectedMonth;
        });

        // Debugging: Log the filtered data
        console.log('Filtered Data:', filteredData);

        if (filteredData.length === 0) {
            archiveContainer.innerHTML = '<p>No posts available for the selected month and year.</p>';
        } else {
            filteredData.forEach(item => {
                const itemDiv = document.createElement('div');
                itemDiv.classList.add('p-b-63');

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
                const converter = new showdown.Converter();
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

                itemDiv.appendChild(linkElement);
                itemDiv.appendChild(contentDiv);
                itemDiv.appendChild(authorCategoryDiv);
                archiveContainer.appendChild(itemDiv);
            });
        }
    })
    .catch(error => {
        console.error('Error fetching markdown data:', error);
    });
