import { createSidebar } from './sidebar.js';
console.log('post-detail.js script loaded');
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded and parsed');
    fetch('markdown_output.json')
        .then(response => response.json())
        .then(data => {
            console.log('Fetched data:', data);

            const urlParams = new URLSearchParams(window.location.search);
            const slug = urlParams.get('slug');
            console.log('Requested slug:', slug);

            const post = data.find(item => item.metadata.slug === slug);
            console.log('Post data:', post);

            if (!post) {
                console.error('Post not found');
                return;
            }

            // Populate Image Section
            const postImage = document.getElementById('post-image');
            if (postImage) {
                postImage.src = post.metadata.image_url;
            } else {
                console.error('Post image element not found');
            }

            const [day, month, year] = post.metadata.date.split('-');
            const monthName = new Date(`${year}-${month}-${day}`).toLocaleString('default', { month: 'short' });

            const postDay = document.getElementById('post-day');
            const postMonthYear = document.getElementById('post-month-year');
            if (postDay && postMonthYear) {
                postDay.textContent = day;
                postMonthYear.textContent = `${monthName} ${year}`;
            } else {
                console.error('Date elements not found');
            }

            // Populate Content Section
            const postAuthor = document.getElementById('post-author');
            const postDate = document.getElementById('post-date');
            const postCategories = document.getElementById('post-categories');
            const postTitle = document.getElementById('post-title');
            if (postAuthor && postDate && postCategories && postTitle) {
                postAuthor.textContent = post.metadata.user_id || 'Admin';
                postDate.textContent = post.metadata.date;
                postCategories.textContent = post.metadata.category;
                postTitle.textContent = post.metadata.title;
            } else {
                console.error('Content elements not found');
            }

            // Convert Markdown to HTML
            const converter = new showdown.Converter();
            const postContent = document.getElementById('post-content');
            if (postContent) {
                postContent.innerHTML = converter.makeHtml(post.content || '');
            } else {
                console.error('Post content element not found');
            }

        // Handle Sidebar
    const categories = data.map(item => item.metadata.category);
    const uniqueCategories = [...new Set(categories)];

    const sidebarDiv = document.createElement('div');
    sidebarDiv.classList.add('col-md-4', 'col-lg-3', 'p-b-80');

    const sideMenuDiv = document.createElement('div');
    sideMenuDiv.classList.add('side-menu');

    // Search Box
    const searchDiv = document.createElement('div');
    searchDiv.classList.add('bor17', 'of-hidden', 'pos-relative');

    const searchInput = document.createElement('input');
    searchInput.classList.add('stext-103', 'cl2', 'plh4', 'size-116', 'p-l-28', 'p-r-55');
    searchInput.type = 'text';
    searchInput.name = 'search';
    searchInput.placeholder = 'Search';

    const searchButton = document.createElement('button');
    searchButton.classList.add('flex-c-m', 'size-122', 'ab-t-r', 'fs-18', 'cl4', 'hov-cl1', 'trans-04');

    const searchIcon = document.createElement('i');
    searchIcon.classList.add('zmdi', 'zmdi-search');
    searchButton.appendChild(searchIcon);

    searchDiv.appendChild(searchInput);
    searchDiv.appendChild(searchButton);

    // Categories Section
    const categoriesDiv = document.createElement('div');
    categoriesDiv.classList.add('p-t-55');

    const categoriesTitle = document.createElement('h4');
    categoriesTitle.classList.add('mtext-112', 'cl2', 'p-b-33');
    categoriesTitle.textContent = 'Categories';

    const categoriesList = document.createElement('ul');

    uniqueCategories.forEach(category => {
        const categoryItem = document.createElement('li');
        categoryItem.classList.add('bor18');

        const categoryLink = document.createElement('a');
        categoryLink.href = '#';
        categoryLink.classList.add('dis-block', 'stext-115', 'cl6', 'hov-cl1', 'trans-04', 'p-tb-8', 'p-lr-4');
        categoryLink.textContent = category;

        categoryItem.appendChild(categoryLink);
        categoriesList.appendChild(categoryItem);
    });

    categoriesDiv.appendChild(categoriesTitle);
    categoriesDiv.appendChild(categoriesList);

    // Archive Section
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

    // Append all sections to side menu
    sideMenuDiv.appendChild(searchDiv);
    sideMenuDiv.appendChild(categoriesDiv);
    sideMenuDiv.appendChild(archiveDiv);

    // Append side menu to sidebar div
    sidebarDiv.appendChild(sideMenuDiv);

    // Append sidebar to the correct row
    const rowDiv = document.querySelector('.row');
    if (rowDiv) {
        rowDiv.appendChild(sidebarDiv);
    } else {
        console.error('Row div not found');
    }


        })
        .catch(error => {
            console.error('Error fetching markdown data:', error);
        });
});
