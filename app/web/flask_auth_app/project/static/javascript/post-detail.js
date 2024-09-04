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

            // Breadcrumb population
            const breadcrumbSpan = document.querySelector('.bread-crumb span.stext-109.cl4');
            breadcrumbSpan.textContent = post.metadata.title;

            // Populate image and date in the content page
            const postImage = document.querySelector('.wrap-pic-w img');
            postImage.src = post.metadata.image_url;
            postImage.alt = post.metadata.title;

            const postDay = document.querySelector('.wrap-pic-w .ltext-107.cl2');
            const postMonthYear = document.querySelector('.wrap-pic-w .stext-109.cl3');
            const [day, month, year] = post.metadata.date.split('-');
            const monthName = new Date(`${year}-${month}-${day}`).toLocaleString('default', { month: 'short' });
            postDay.textContent = day;
            postMonthYear.textContent = `${monthName} ${year}`;

            // Populate metadata section
            const postAuthor = document.querySelector('.stext-111 .cl4 + span');
            const postDate = document.querySelector('.stext-111 .cl12 + span');
            const postCategories = document.querySelector('.stext-111 .cl12 + span + span');

            postAuthor.textContent = post.metadata.user_id || 'Admin';
            postDate.textContent = `${day} ${monthName}, ${year}`;
            postCategories.textContent = post.metadata.category.split(', ').join(', ');

            // Populate post title
            const postTitle = document.querySelector('.ltext-109.cl2.p-b-28');
            postTitle.textContent = post.metadata.title;

            // Convert Markdown to HTML and populate content section
            const converter = new showdown.Converter();
            const postContent = document.querySelector('.stext-117.cl6.p-b-26');
            postContent.innerHTML = converter.makeHtml(post.content || '');

            // Handle YouTube Link
            if (post.metadata.youtube_link) {
                const youtubeContainer = document.createElement('div');
                youtubeContainer.classList.add('youtube-video-container');
                youtubeContainer.innerHTML = `
                    <iframe width="560" height="315" src="${post.metadata.youtube_link}" 
                            frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                            allowfullscreen>
                    </iframe>
                `;
                postContent.appendChild(youtubeContainer);
            }

            // Handle Sidebar
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

            // Append sidebar to the sidebar container
            const sidebarContainer = document.getElementById('sidebar-container');
            if (sidebarContainer) {
                sidebarContainer.appendChild(sidebar);
            } else {
                console.error('Sidebar container not found');
            }

        })
        .catch(error => {
            console.error('Error fetching markdown data:', error);
        });
});
