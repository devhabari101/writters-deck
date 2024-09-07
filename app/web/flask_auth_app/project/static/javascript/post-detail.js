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
                categoryItem.appendChild(categoryLink);
                categoriesList.appendChild(categoryItem);
            });

            categoriesDiv.appendChild(categoriesList);
            sideMenuDiv.appendChild(categoriesDiv);

           // Popular Posts
    const popularDiv = document.createElement('div');
    popularDiv.classList.add('p-t-50');

    const popularHeading = document.createElement('h4');
    popularHeading.classList.add('mtext-112', 'cl2', 'p-b-33');
    popularHeading.textContent = 'Popular Posts';
    popularDiv.appendChild(popularHeading);

    popularPosts.forEach(popularPost => {
        const popularItemDiv = document.createElement('div');
        popularItemDiv.classList.add('flex-w', 'p-b-20');

        const popularImageLink = document.createElement('a');
        popularImageLink.href = `post-detail.html?slug=${popularPost.metadata.slug}`;
        popularImageLink.classList.add('wrao-pic-w', 'size-214', 'hov-ovelay1', 'm-r-20');

        const popularImage = document.createElement('img');
        popularImage.src = popularPost.metadata.image_url;
        popularImage.alt = 'Popular Post Image';

        popularImageLink.appendChild(popularImage);
        popularItemDiv.appendChild(popularImageLink);

        const popularContentDiv = document.createElement('div');
        popularContentDiv.classList.add('size-215', 'flex-col-t', 'p-t-8');

        const popularTitleLink = document.createElement('a');
        popularTitleLink.href = `post-detail.html?slug=${popularPost.metadata.slug}`;
        popularTitleLink.classList.add('stext-116', 'cl8', 'hov-cl1', 'trans-04');
        popularTitleLink.textContent = popularPost.metadata.title;

        popularContentDiv.appendChild(popularTitleLink);

        const popularDateSpan = document.createElement('span');
        popularDateSpan.classList.add('stext-116', 'cl6', 'p-t-20');
        popularDateSpan.textContent = popularPost.metadata.date;

        popularContentDiv.appendChild(popularDateSpan);
        popularItemDiv.appendChild(popularContentDiv);

        popularDiv.appendChild(popularItemDiv);
    });

    sideMenuDiv.appendChild(popularDiv);


            // Archive Section in Sidebar
            const archiveDiv = document.createElement('div');
            archiveDiv.classList.add('p-t-50');

            const archiveHeading = document.createElement('h4');
            archiveHeading.classList.add('mtext-112', 'cl2', 'p-b-33');
            archiveHeading.textContent = 'Archive';
            archiveDiv.appendChild(archiveHeading);

            const archiveList = document.createElement('ul');
            archiveList.classList.add('list-none');

            const groupedByYearMonth = {};
            data.forEach(post => {
                const [day, month, year] = post.metadata.date.split('-');
                const yearMonth = `${year}-${month}`;
                if (!groupedByYearMonth[yearMonth]) {
                    groupedByYearMonth[yearMonth] = [];
                }
                groupedByYearMonth[yearMonth].push(post);
            });

            Object.keys(groupedByYearMonth).forEach(yearMonth => {
                const [year, month] = yearMonth.split('-');
                const monthName = new Date(`${year}-${month}-01`).toLocaleString('default', { month: 'long' });

                const archiveItem = document.createElement('li');
                const archiveLink = document.createElement('a');
                archiveLink.href = `/archive.html?month=${month}&year=${year}`;
                archiveLink.textContent = `${monthName} ${year} (${groupedByYearMonth[yearMonth].length})`;
                archiveItem.appendChild(archiveLink);
                archiveList.appendChild(archiveItem);
            });

            archiveDiv.appendChild(archiveList);
            sideMenuDiv.appendChild(archiveDiv);

            sidebarDiv.appendChild(sideMenuDiv);
            rowDiv.appendChild(sidebarDiv);

        } catch (error) {
            console.error('Error parsing JSON:', error);
        }
    })
    .catch(error => {
        console.error('Error fetching JSON:', error);
    });

createSidebar();
