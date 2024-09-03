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

            data.sort((a, b) => {
                const dateA = parseDate(a.metadata.date);
                const dateB = parseDate(b.metadata.date);
                return dateB - dateA;
            });

            console.log('Sorted data:', data);

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

            const displayArchivePosts = (posts) => {
                innerColumnDiv.innerHTML = '';

                posts.forEach(post => {
                    const itemBlogDiv = document.createElement('div');
                    itemBlogDiv.classList.add('p-b-63');

                    const linkElement = document.createElement('a');
                    linkElement.href = `post-detail.html?slug=${post.metadata.slug}`;
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
                    titleLink.href = `post-detail.html?slug=${post.metadata.slug}`;
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
                    categorySpan.classList.add('cl4');

                    const separatorSpan = document.createElement('span');
                    separatorSpan.classList.add('cl12', 'm-l-4', 'm-r-6');
                    separatorSpan.textContent = '|';

                    authorSpan.appendChild(categorySpan);
                    authorSpan.appendChild(separatorSpan);

                    //const continueReadingLink = document.createElement('a');
                    //continueReadingLink.href = `post-detail.html?slug=${post.metadata.slug}`;
                    //continueReadingLink.classList.add('stext-101', 'cl2', 'hov-cl1', 'trans-04', 'm-tb-10');
                    //continueReadingLink.innerHTML = `Continue Reading <i class="fa fa-long-arrow-right m-l-9"></i>`;

                    authorCategoryDiv.appendChild(authorSpan);
                    //authorCategoryDiv.appendChild(continueReadingLink);

                    itemBlogDiv.appendChild(linkElement);
                    itemBlogDiv.appendChild(contentDiv);
                    itemBlogDiv.appendChild(authorCategoryDiv);
                    innerColumnDiv.appendChild(itemBlogDiv);
                });
            };

            const categories = data.map(item => item.metadata.category);
            const uniqueCategories = [...new Set(categories)];

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
                archiveLink.href = `/archive.html?month=${month}&year=${year}`;
                archiveLink.classList.add('dis-block', 'stext-115', 'cl6', 'hov-cl1', 'trans-04', 'p-tb-8', 'p-lr-4');
                archiveLink.textContent = `${monthName} ${year} (${posts.length})`;

               

                archiveItem.appendChild(archiveLink);
                archiveList.appendChild(archiveItem);
            });

            archiveDiv.appendChild(archiveTitle);
            archiveDiv.appendChild(archiveList);

            const sidebar = createSidebar(uniqueCategories, data.filter(item => item.metadata.popular === 'on'));
            sidebar.appendChild(archiveDiv);

            rowDiv.appendChild(sidebar);
            markdownContentDiv.appendChild(section);

            if (sortedArchiveKeys.length > 0) {
                displayArchivePosts(archiveMap.get(sortedArchiveKeys[0]));
            }

        } catch (error) {
            console.error('Error processing data:', error);
        }
    })
    .catch(error => {
        console.error('Error fetching markdown data:', error);
    });
