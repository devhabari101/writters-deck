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

            // Find the main content container
            const mainContent = document.getElementById('main-content');
            if (!mainContent) {
                console.error('Main content container not found');
                return;
            }

            if (mainContent) {
              console.log('Clearing content of mainContent:', mainContent);
             // mainContent.innerHTML = ''; // Comment this out to see if the issue persists
             mainContent.innerHTML = '<h2>Test Post Title</h2><p>This is a test post content.</p>';   
            } else {
              console.error('Main content container not found');
            }


            // Breadcrumbs
            const breadcrumbContainer = document.querySelector('.bread-crumb');
            breadcrumbContainer.innerHTML = `
                <a href="index.html" class="stext-109 cl8 hov-cl1 trans-04">
                    Home
                    <i class="fa fa-angle-right m-l-9 m-r-10" aria-hidden="true"></i>
                </a>
                <a href="blog.html" class="stext-109 cl8 hov-cl1 trans-04">
                    Blog
                    <i class="fa fa-angle-right m-l-9 m-r-10" aria-hidden="true"></i>
                </a>
                <span class="stext-109 cl4">${post.metadata.title}</span>
            `;

            console.log('Breadcrumbs updated with post title:', post.metadata.title);

            // Image Section
            const postImage = document.querySelector('.wrap-pic-w img');
            postImage.src = post.metadata.image_url;
            postImage.alt = 'Post Image';
            console.log('Post image set to:', post.metadata.image_url);

            const postDaySpan = document.querySelector('.flex-col-c-m .ltext-107');
            const postMonthYearSpan = document.querySelector('.flex-col-c-m .stext-109');
            const [day, month, year] = post.metadata.date.split('-');
            const monthName = new Date(`${year}-${month}-${day}`).toLocaleString('default', { month: 'short' });
            postDaySpan.textContent = day;
            postMonthYearSpan.textContent = `${monthName} ${year}`;
            console.log('Post date set:', day, monthName, year);

            // Author, Date, Categories, and Comments
            const postMeta = document.querySelector('.flex-w.stext-111');
            postMeta.innerHTML = `
                <span><span class="cl4">By</span> ${post.metadata.user_id || 'Admin'}<span class="cl12 m-l-4 m-r-6">|</span></span>
                <span>${day} ${monthName}, ${year}<span class="cl12 m-l-4 m-r-6">|</span></span>
                <span>${post.metadata.category}<span class="cl12 m-l-4 m-r-6">|</span></span>
                <span>8 Comments</span>
            `;
            console.log('Post meta data updated:', post.metadata.user_id, post.metadata.category);

            // Title and Content
            const postTitle = document.querySelector('.ltext-109');
            postTitle.textContent = post.metadata.title;
            console.log('Post title set:', post.metadata.title);

            const postContent = document.querySelector('.stext-117');
            const converter = new showdown.Converter();
            postContent.innerHTML = converter.makeHtml(post.content || '');
            console.log('Post content set:', post.content);

            // Handle YouTube Video (if exists)
            if (post.metadata.youtube_link) {
                const videoContainer = document.createElement('div');
                videoContainer.innerHTML = `
                    <iframe width="560" height="315" src="${post.metadata.youtube_link}" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                `;
                postContent.appendChild(videoContainer);
                console.log('YouTube video embedded:', post.metadata.youtube_link);
            }

            // Handle Sidebar
            const categories = data.map(item => item.metadata.category);
            const uniqueCategories = [...new Set(categories)];
            console.log('Unique categories:', uniqueCategories);

            const archiveMap = new Map();
            data.forEach(markdown => {
                const [day, month, year] = markdown.metadata.date.split('-');
                const key = `${year}-${month}`;
                if (!archiveMap.has(key)) {
                    archiveMap.set(key, []);
                }
                archiveMap.get(key).push(markdown);
            });
            console.log('Archive map created:', archiveMap);

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
            console.log('Sidebar created and archive section appended');

            const sidebarContainer = document.getElementById('sidebar-container');
            if (sidebarContainer) {
                sidebarContainer.appendChild(sidebar);
                console.log('Sidebar appended to container');
            } else {
                console.error('Sidebar container not found');
            }
        })
        .catch(error => {
            console.error('Error fetching markdown data:', error);
        });
});
