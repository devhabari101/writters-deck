import { createSidebar } from './sidebar.js';

// Function to extract query parameters from the URL
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

// Get the slug from the URL
const slug = getQueryParam('slug');

// Function to parse date and format it as needed
function formatDate(dateString) {
    const [day, month, year] = dateString.split('-');
    const monthName = new Date(`${year}-${month}-${day}`).toLocaleString('default', { month: 'short' });
    return { day, monthName, year };
}

// Fetch markdown data
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

            // Create the main section structure
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

            // Breadcrumbs
            const breadcrumbDiv = document.createElement('div');
            breadcrumbDiv.classList.add('p-b-17');
            const breadcrumbList = document.createElement('ul');
            breadcrumbList.classList.add('breadcrumb');

            const homeItem = document.createElement('li');
            homeItem.classList.add('breadcrumb-item');
            homeItem.innerHTML = `<a href="/" class="cl8 hov-cl1 trans-04">Home</a>`;
            breadcrumbList.appendChild(homeItem);

            const categoryItem = document.createElement('li');
            categoryItem.classList.add('breadcrumb-item');
            categoryItem.innerHTML = `<a href="/category.html?category=${post.metadata.category}" class="cl8 hov-cl1 trans-04">${post.metadata.category}</a>`;
            breadcrumbList.appendChild(categoryItem);

            const titleItem = document.createElement('li');
            titleItem.classList.add('breadcrumb-item', 'active');
            titleItem.textContent = post.metadata.title;
            breadcrumbList.appendChild(titleItem);

            breadcrumbDiv.appendChild(breadcrumbList);
            innerColumnDiv.appendChild(breadcrumbDiv);

            // Image with overlay date
            const wrapPicDiv = document.createElement('div');
            wrapPicDiv.classList.add('wrap-pic-w', 'how-pos5-parent');
            const imageElement = document.createElement('img');
            imageElement.src = post.metadata.image_url;
            imageElement.alt = 'IMG-BLOG';
            wrapPicDiv.appendChild(imageElement);

            const dateDiv = document.createElement('div');
            dateDiv.classList.add('flex-col-c-m', 'size-123', 'bg9', 'how-pos5');

            const { day, monthName, year } = formatDate(post.metadata.date);

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

            // Post content
            const contentDiv = document.createElement('div');
            contentDiv.classList.add('p-t-32');

            // Post info (author, date, categories)
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

            infoSpan.appendChild(authorSpan);
            infoSpan.appendChild(dateSpan);
            infoSpan.appendChild(categoriesSpan);
            contentDiv.appendChild(infoSpan);

            // Post title
            const titleElement = document.createElement('h4');
            titleElement.classList.add('ltext-109', 'cl2', 'p-b-28');
            titleElement.textContent = post.metadata.title;
            contentDiv.appendChild(titleElement);

            // Post body content
            const contentParagraph = document.createElement('p');
            contentParagraph.classList.add('stext-117', 'cl6', 'p-b-26');
            contentParagraph.innerHTML = converter.makeHtml(post.content);
            contentDiv.appendChild(contentParagraph);

            // YouTube video embedding (if available)
            if (post.metadata.youtube_link) {
                const youtubeDiv = document.createElement('div');
                youtubeDiv.classList.add('p-t-32', 'p-b-32');

                const iframe = document.createElement('iframe');
                iframe.width = '560';
                iframe.height = '315';
                iframe.src = `https://www.youtube.com/embed/${post.metadata.youtube_link}`;
                iframe.title = 'YouTube video player';
                iframe.frameBorder = '0';
                iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
                iframe.allowFullscreen = true;

                youtubeDiv.appendChild(iframe);
                contentDiv.appendChild(youtubeDiv);
            }

            innerColumnDiv.appendChild(contentDiv);
            markdownContentDiv.appendChild(section);

            // Create and append sidebar using the imported function
            createSidebar(data);
        } catch (error) {
            console.error('Error parsing JSON:', error);
        }
    })
    .catch(error => {
        console.error('Error fetching JSON:', error);
    });
