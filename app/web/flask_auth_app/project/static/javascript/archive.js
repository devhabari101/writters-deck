import { createSidebar } from './sidebar.js';

fetch('markdown_output.json')
    .then(response => response.json())
    .then(data => {
        try {
            console.log('Fetched data:', data);

            const parseDate = (dateString) => {
                const dateParts = dateString.split('-');
                if (dateParts.length === 3) {
                    const [day, month, year] = dateParts;
                    return new Date(`${year}-${month}-${day}`);
                } else {
                    console.error('Invalid date format:', dateString);
                    return new Date(dateString);
                }
            };

            data.sort((a, b) => parseDate(b.metadata.date) - parseDate(a.metadata.date));

            console.log('Sorted data:', data);

            const archiveContainer = document.getElementById('archive-container');
            const converter = new showdown.Converter();

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

            sortedArchiveKeys.forEach(key => {
                const [year, month] = key.split('-');
                const monthName = new Date(year, month - 1).toLocaleString('default', { month: 'long' });
                const posts = archiveMap.get(key);

                const monthYearHeader = document.createElement('h3');
                monthYearHeader.textContent = `${monthName} ${year}`;
                archiveContainer.appendChild(monthYearHeader);

                posts.forEach(post => {
                    const postDiv = document.createElement('div');
                    postDiv.classList.add('p-b-63');

                    const titleElement = document.createElement('h4');
                    const titleLink = document.createElement('a');
                    titleLink.href = 'blog-detail.html';
                    titleLink.textContent = post.metadata.title;
                    titleElement.appendChild(titleLink);

                    const dateElement = document.createElement('p');
                    dateElement.textContent = post.metadata.date;

                    const imageElement = document.createElement('img');
                    imageElement.src = post.metadata.image_url; // Set the image URL
                    imageElement.alt = post.metadata.title; // Optional: Set alt text using the title
                    imageElement.classList.add('img-blog'); // Add any necessary CSS class for styling

                    const contentElement = document.createElement('p');
                    contentElement.innerHTML = converter.makeHtml(post.content);

                    postDiv.appendChild(imageElement); // Add the image element to the post div
                    postDiv.appendChild(titleElement);
                    postDiv.appendChild(dateElement);
                    postDiv.appendChild(contentElement);

                    archiveContainer.appendChild(postDiv);
                });
            });
        } catch (error) {
            console.error('Error processing data:', error);
        }
    })
    .catch(error => {
        console.error('Error fetching markdown data:', error);
    });
