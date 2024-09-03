import { createSidebar } from './sidebar.js';

console.log('post-detail.js script loaded');

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded and parsed');

    // Call createSidebar here
    createSidebar();

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
                if (!markdownContentDiv) {
                    console.error('Element with ID "markdown-content" not found.');
                    return;
                }

                const converter = new showdown.Converter();

                data.forEach(post => {
                    console.log('Processing post:', post);

                    const section = document.createElement('section');
                    section.classList.add('bg0', 'p-t-52', 'p-b-20');

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

                    const itemBlogDiv = document.createElement('div');
                    itemBlogDiv.classList.add('wrap-pic-w', 'how-pos5-parent');

                    const imageElement = document.createElement('img');
                    imageElement.src = post.metadata.image_url;
                    imageElement.alt = 'IMG-BLOG';
                    itemBlogDiv.appendChild(imageElement);

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
                    itemBlogDiv.appendChild(dateDiv);

                    const contentDiv = document.createElement('div');
                    contentDiv.classList.add('p-t-32');

                    const authorCategoryDiv = document.createElement('span');
                    authorCategoryDiv.classList.add('flex-w', 'flex-m', 'stext-111', 'cl2', 'p-b-19');

                    const authorSpan = document.createElement('span');
                    authorSpan.innerHTML = `<span class="cl4">By</span> Admin <span class="cl12 m-l-4 m-r-6">|</span>`;

                    const dateSpan = document.createElement('span');
                    dateSpan.innerHTML = `${day} ${monthName}, ${year} <span class="cl12 m-l-4 m-r-6">|</span>`;

                    const categorySpan = document.createElement('span');
                    categorySpan.innerHTML = `${post.metadata.category} <span class="cl12 m-l-4 m-r-6">|</span>`;

                    const commentsSpan = document.createElement('span');
                    commentsSpan.textContent = `${post.metadata.comments || '0 Comments'}`;

                    authorCategoryDiv.appendChild(authorSpan);
                    authorCategoryDiv.appendChild(dateSpan);
                    authorCategoryDiv.appendChild(categorySpan);
                    authorCategoryDiv.appendChild(commentsSpan);

                    const titleElement = document.createElement('h4');
                    titleElement.classList.add('ltext-109', 'cl2', 'p-b-28');
                    titleElement.textContent = post.metadata.title;

                    const contentParagraph = document.createElement('p');
                    contentParagraph.classList.add('stext-117', 'cl6', 'p-b-26');
                    const htmlContent = converter.makeHtml(post.content);
                    contentParagraph.innerHTML = htmlContent;

                    contentDiv.appendChild(authorCategoryDiv);
                    contentDiv.appendChild(titleElement);
                    contentDiv.appendChild(contentParagraph);

                    innerColumnDiv.appendChild(itemBlogDiv);
                    innerColumnDiv.appendChild(contentDiv);

                    const tagsDiv = document.createElement('div');
                    tagsDiv.classList.add('flex-w', 'flex-t', 'p-t-16');

                    const tagsLabel = document.createElement('span');
                    tagsLabel.classList.add('size-216', 'stext-116', 'cl8', 'p-t-4');
                    tagsLabel.textContent = 'Tags';

                    const tagsListDiv = document.createElement('div');
                    tagsListDiv.classList.add('flex-w', 'size-217');

                    if (post.metadata.tags) {
                        post.metadata.tags.forEach(tag => {
                            const tagLink = document.createElement('a');
                            tagLink.href = '#';
                            tagLink.classList.add('flex-c-m', 'stext-107', 'cl6', 'size-301', 'bor7', 'p-lr-15', 'hov-tag1', 'trans-04', 'm-r-5', 'm-b-5');
                            tagLink.textContent = tag;
                            tagsListDiv.appendChild(tagLink);
                        });
                    } else {
                        console.warn('No tags found for post:', post);
                    }

                    tagsDiv.appendChild(tagsLabel);
                    tagsDiv.appendChild(tagsListDiv);
                    innerColumnDiv.appendChild(tagsDiv);

                    markdownContentDiv.appendChild(section);

                    console.log('Content appended for post:', post.metadata.title);
                });

            } catch (error) {
                console.error('Error processing data:', error);
            }
        })
        .catch(error => {
            console.error('Error fetching markdown data:', error);
        });
});
