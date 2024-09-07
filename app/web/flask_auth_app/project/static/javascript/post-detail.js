document.addEventListener('DOMContentLoaded', function () {
    const markdownContentDiv = document.getElementById('markdown-content');

    // Function to extract query parameters from the URL
    function getQueryParam(param) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(param);
    }

    // Get the slug from the URL
    const slug = getQueryParam('slug');

    // Function to handle JSON fetch and process data
    function loadData() {
        fetch('markdown_output.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                const post = data.find(item => item.metadata.slug === slug);
                if (!post) {
                    console.error('Post not found for slug:', slug);
                    return;
                }

                const converter = new showdown.Converter();
                const section = createMainContent(post, converter);
                markdownContentDiv.appendChild(section);

                // Extract categories and popular posts
                const categories = [...new Set(data.map(item => item.metadata.category))];
                const popularPosts = data.filter(item => item.metadata.popular === 'on');
                
                const sidebar = createSidebar(categories, popularPosts);

                // Ensure the sidebar is placed correctly in the layout
                const rowDiv = document.querySelector('.row');
                if (rowDiv) {
                    rowDiv.appendChild(sidebar);
                } else {
                    console.error('.row div not found in the document.');
                }
            })
            .catch(error => {
                console.error('Error fetching markdown data:', error);
            });
    }

    // Function to create the main content section
    function createMainContent(post, converter) {
        const section = document.createElement('section');
        section.classList.add('bg0', 'p-t-62', 'p-b-60');

        const containerDiv = document.createElement('div');
        containerDiv.classList.add('container');
        section.appendChild(containerDiv);

        const rowDiv = document.createElement('div');
        rowDiv.classList.add('row');
        containerDiv.appendChild(rowDiv);

        // Left column for post content
        const columnDiv = document.createElement('div');
        columnDiv.classList.add('col-md-8', 'col-lg-9', 'p-b-80');
        const innerColumnDiv = document.createElement('div');
        innerColumnDiv.classList.add('p-r-45', 'p-r-0-lg');
        columnDiv.appendChild(innerColumnDiv);
        rowDiv.appendChild(columnDiv);

        // Main post content
        const itemBlogDiv = document.createElement('div');
        itemBlogDiv.classList.add('p-b-63');
        const wrapPicDiv = document.createElement('div');
        wrapPicDiv.classList.add('wrap-pic-w', 'how-pos5-parent');
        const imageElement = document.createElement('img');
        imageElement.src = post.metadata.image_url || 'default-image.jpg';
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
        itemBlogDiv.appendChild(wrapPicDiv);

        const contentDiv = document.createElement('div');
        contentDiv.classList.add('p-t-32');
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

        const titleElement = document.createElement('h4');
        titleElement.classList.add('ltext-109', 'cl2', 'p-b-28');
        titleElement.textContent = post.metadata.title;
        contentDiv.appendChild(titleElement);

        const contentParagraph = document.createElement('p');
        contentParagraph.classList.add('stext-117', 'cl6', 'p-b-26');
        contentParagraph.innerHTML = converter.makeHtml(post.content);
        contentDiv.appendChild(contentParagraph);

        // YouTube video embedding (if available)
        if (post.metadata.youtube_link) {
            const youtubeDiv = document.createElement('div');
            youtubeDiv.classList.add('p-t-32', 'p-b-32');
            const youtubeIframe = document.createElement('iframe');
            youtubeIframe.src = `https://www.youtube.com/embed/${extractYouTubeID(post.metadata.youtube_link)}`;
            youtubeIframe.width = '560';
            youtubeIframe.height = '315';
            youtubeIframe.frameBorder = '0';
            youtubeIframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
            youtubeIframe.allowFullscreen = true;
            youtubeDiv.appendChild(youtubeIframe);
            contentDiv.appendChild(youtubeDiv);
        }

        itemBlogDiv.appendChild(contentDiv);
        innerColumnDiv.appendChild(itemBlogDiv);

        return section;
    }

    // Helper function to extract YouTube ID from URL
    function extractYouTubeID(url) {
        const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([^&?/]+)/;
        const match = url.match(regex);
        return match ? match[1] : '';
    }

    // Function to create the sidebar
    function createSidebar(categories, popularPosts) {
        const sidebarDiv = document.createElement('div');
        sidebarDiv.classList.add('col-md-4', 'col-lg-3', 'p-b-80');

        const sideMenuDiv = document.createElement('div');
        sideMenuDiv.classList.add('side-menu');

        // Search bar
        const searchDiv = document.createElement('div');
        searchDiv.classList.add('bor17', 'of-hidden', 'pos-relative');
        const searchInput = document.createElement('input');
        searchInput.classList.add('stext-103', 'cl2', 'plh4', 'size-116', 'p-l-28', 'p-r-55');
        searchInput.type = 'text';
        searchInput.name = 'search';
        searchInput.placeholder = 'Search';
        searchDiv.appendChild(searchInput);

        const searchButton = document.createElement('button');
        searchButton.classList.add('flex-c-m', 'size-122', 'ab-t-r', 'fs-18', 'cl4', 'hov-cl1', 'trans-0-4');
        searchButton.innerHTML = '<i class="zmdi zmdi-search"></i>';
        searchDiv.appendChild(searchButton);

        sideMenuDiv.appendChild(searchDiv);

        // Categories
        if (categories.length > 0) {
            const categoryDiv = document.createElement('div');
            categoryDiv.classList.add('p-t-20', 'p-b-35');
            const title = document.createElement('h4');
            title.classList.add('mtext-114', 'cl2', 'p-b-32');
            title.textContent = 'Categories';
            categoryDiv.appendChild(title);

            const listGroupDiv = document.createElement('ul');
            listGroupDiv.classList.add('p-b-40');

            categories.forEach(category => {
                const listItem = document.createElement('li');
                listItem.classList.add('p-t-10');
                const link = document.createElement('a');
                link.href = `/archive.html?category=${category}`;
                link.classList.add('stext-107', 'cl6', 'hov-cl1', 'trans-0-4');
                link.textContent = category;
                listItem.appendChild(link);
                listGroupDiv.appendChild(listItem);
            });

            categoryDiv.appendChild(listGroupDiv);
            sideMenuDiv.appendChild(categoryDiv);
        }

        // Popular posts
        if (popularPosts.length > 0) {
            const popularDiv = document.createElement('div');
            popularDiv.classList.add('p-t-20', 'p-b-35');
            const title = document.createElement('h4');
            title.classList.add('mtext-114', 'cl2', 'p-b-32');
            title.textContent = 'Popular Posts';
            popularDiv.appendChild(title);

            const listGroupDiv = document.createElement('ul');
            listGroupDiv.classList.add('p-b-40');

            popularPosts.forEach(post => {
                const listItem = document.createElement('li');
                listItem.classList.add('p-t-10');
                const link = document.createElement('a');
                link.href = `/post-detail.html?slug=${post.metadata.slug}`;
                link.classList.add('stext-107', 'cl6', 'hov-cl1', 'trans-0-4');
                link.textContent = post.metadata.title;
                listItem.appendChild(link);
                listGroupDiv.appendChild(listItem);
            });

            popularDiv.appendChild(listGroupDiv);
            sideMenuDiv.appendChild(popularDiv);
        }

        sidebarDiv.appendChild(sideMenuDiv);
        return sidebarDiv;
    }

    // Load the data when the DOM is fully loaded
    loadData();
});
