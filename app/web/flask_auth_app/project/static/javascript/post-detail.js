import { createSidebar } from './sidebar.js';

// Function to extract query parameters from the URL
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

// Get the slug from the URL
const slug = getQueryParam('slug');

fetch('markdown_output.json')
    .then(response => response.json())
    .then(data => {
        try {
            // Find the post by slug
            const post = data.find(item => item.metadata.slug === slug);
            if (!post) {
                console.error('Post not found for slug:', slug);
                return;
            }

            const markdownContentDiv = document.getElementById('main-content');
            const converter = new showdown.Converter();

            // Create the section and container structure
            const section = document.createElement('section');
            section.classList.add('bg0', 'p-t-52', 'p-b-20');

            const containerDiv = document.createElement('div');
            containerDiv.classList.add('container');
            section.appendChild(containerDiv);

            const rowDiv = document.createElement('div');
            rowDiv.classList.add('row');
            containerDiv.appendChild(rowDiv);

            // Left column for post details
            const columnDiv = document.createElement('div');
            columnDiv.classList.add('col-md-8', 'col-lg-9', 'p-b-80');

            const innerColumnDiv = document.createElement('div');
            innerColumnDiv.classList.add('p-r-45', 'p-r-0-lg');
            columnDiv.appendChild(innerColumnDiv);
            rowDiv.appendChild(columnDiv);

            // Create wrap-pic-w div for image and date overlay
            const wrapPicDiv = document.createElement('div');
            wrapPicDiv.classList.add('wrap-pic-w', 'how-pos5-parent');

            const imageElement = document.createElement('img');
            imageElement.src = post.metadata.image_url;
            imageElement.alt = 'IMG-BLOG';
            wrapPicDiv.appendChild(imageElement);

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
            wrapPicDiv.appendChild(dateDiv);
            innerColumnDiv.appendChild(wrapPicDiv);

            // Create content div for post content
            const contentDiv = document.createElement('div');
            contentDiv.classList.add('p-t-32');

            // Post info: By Admin, Date, Categories, Comments
            const infoSpan = document.createElement('span');
            infoSpan.classList.add('flex-w', 'flex-m', 'stext-111', 'cl2', 'p-b-19');

            const authorSpan = document.createElement('span');
            authorSpan.innerHTML = `<span class="cl4">By</span> ${post.metadata.author || 'Admin'}`;
            authorSpan.innerHTML += '<span class="cl12 m-l-4 m-r-6">|</span>';

            const dateSpan = document.createElement('span');
            dateSpan.textContent = `${day} ${monthName}, ${year}`;
            dateSpan.innerHTML += '<span class="cl12 m-l-4 m-r-6">|</span>';

            const categoriesSpan = document.createElement('span');
            categoriesSpan.textContent = post.metadata.category;
            categoriesSpan.innerHTML += '<span class="cl12 m-l-4 m-r-6">|</span>';

            const commentsSpan = document.createElement('span');
            commentsSpan.textContent = '8 Comments';  // This should be dynamic if you have comment data

            infoSpan.appendChild(authorSpan);
            infoSpan.appendChild(dateSpan);
            infoSpan.appendChild(categoriesSpan);
            infoSpan.appendChild(commentsSpan);
            contentDiv.appendChild(infoSpan);

            // Title
            const titleElement = document.createElement('h4');
            titleElement.classList.add('ltext-109', 'cl2', 'p-b-28');
            titleElement.textContent = post.metadata.title;
            contentDiv.appendChild(titleElement);

            // Post content
            const contentParagraph1 = document.createElement('p');
            contentParagraph1.classList.add('stext-117', 'cl6', 'p-b-26');
            contentParagraph1.innerHTML = converter.makeHtml(post.content);

            contentDiv.appendChild(contentParagraph1);

            // Append content div to inner column div
            innerColumnDiv.appendChild(contentDiv);

            // Append YouTube video if the link exists
            if (post.metadata.youtube_link) {
                const youtubeVideoContainer = document.createElement('div');
                youtubeVideoContainer.classList.add('video-container');

                const iframe = document.createElement('iframe');
                iframe.src = `https://www.youtube.com/embed/${extractYouTubeID(post.metadata.youtube_link)}`;
                iframe.width = '560';
                iframe.height = '315';
                iframe.frameBorder = '0';
                iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
                iframe.allowFullscreen = true;

                youtubeVideoContainer.appendChild(iframe);
                innerColumnDiv.appendChild(youtubeVideoContainer);
            }

            // Append the final section to the main content div
            markdownContentDiv.appendChild(section);

            // Sidebar Section
            const sidebarDiv = document.createElement('div');
            sidebarDiv.classList.add('col-md-4', 'col-lg-3', 'p-b-80');

            const sideMenuDiv = document.createElement('div');
            sideMenuDiv.classList.add('side-menu');

            const searchDiv = document.createElement('div');
            searchDiv.classList.add('bor17', 'of-hidden', 'pos-relative');

            const searchInput = document.createElement('input');
            searchInput.classList.add('stext-103', 'cl2', 'plh4', 'size-116', 'p-l-28', 'p-r-55');
            searchInput.type = 'text';
            searchInput.name = 'search';
            searchInput.placeholder = 'Search';
            searchDiv.appendChild(searchInput);

            const searchButton = document.createElement('button');
            searchButton.classList.add('flex-c-m', 'size-122', 'ab-t-r', 'fs-18', 'cl4', 'hov-cl1', 'trans-04');
            searchButton.innerHTML = `<i class="zmdi zmdi-search"></i>`;
            searchDiv.appendChild(searchButton);

            sideMenuDiv.appendChild(searchDiv);

            // Categories Section in Sidebar
            const categoriesDiv = document.createElement('div');
            categoriesDiv.classList.add('p-t-55');

            const categoriesHeading = document.createElement('h4');
            categoriesHeading.classList.add('mtext-112', 'cl2', 'p-b-33');
            categoriesHeading.textContent = 'Categories';
            categoriesDiv.appendChild(categoriesHeading);

            // List the categories dynamically
            const categoriesList = document.createElement('ul');
            categoriesList.classList.add('list-none');

            const categories = [...new Set(data.map(item => item.metadata.category))];

            categories.forEach(category => {
                const categoryItem = document.createElement('li');
                const categoryLink = document.createElement('a');
                categoryLink.href = `/category.html?category=${category}`;
                categoryLink.textContent = category;
                categoryLink.classList.add('stext-113', 'cl7', 'hov-cl1', 'trans-04');
                categoryItem.appendChild(categoryLink);
                categoriesList.appendChild(categoryItem);
            });

            categoriesDiv.appendChild(categoriesList);
            sideMenuDiv.appendChild(categoriesDiv);

            // Append sidebar to the row
            sidebarDiv.appendChild(sideMenuDiv);
            rowDiv.appendChild(sidebarDiv);

        } catch (error) {
            console.error('Error processing post detail:', error);
        }
    })
    .catch(error => {
        console.error('Error fetching post data:', error);
    });

// Helper function to extract YouTube ID from URL
function extractYouTubeID(url) {
    const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([^&?/]+)/;
    const match = url.match(regex);
    return match ? match[1] : '';
}
