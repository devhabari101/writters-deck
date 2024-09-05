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

            // Breadcrumb dynamic title
            const breadcrumbTitle = document.querySelector('.bread-crumb .stext-109.cl4');
            breadcrumbTitle.textContent = post.metadata.title;

            // Author, Date, Categories, and Comments
            const [day, month, year] = post.metadata.date.split('-');
            const monthName = new Date(`${year}-${month}-${day}`).toLocaleString('default', { month: 'short' });

            const postMeta = document.querySelector('.flex-w.stext-111');
            postMeta.innerHTML = `
                <span><span class="cl4">By</span> ${post.metadata.user_id || 'Admin'}<span class="cl12 m-l-4 m-r-6">|</span></span>
                <span>${day} ${monthName}, ${year}<span class="cl12 m-l-4 m-r-6">|</span></span>
                <span>${post.metadata.category}<span class="cl12 m-l-4 m-r-6">|</span></span>
                <span>${post.comments || '0'} Comments</span>
            `;
            console.log('Post meta data updated:', post.metadata.user_id, post.metadata.category);

            // Create and populate Image Section
            const postImageContainer = document.createElement('div');
            postImageContainer.classList.add('wrap-pic-w', 'how-pos5-parent');

            const postImage = document.createElement('img');
            postImage.src = post.metadata.image_url;
            postImage.alt = 'Post Image';
            postImage.classList.add('img-fluid');
            postImageContainer.appendChild(postImage);

            const dateContainer = document.createElement('div');
            dateContainer.classList.add('flex-col-c-m', 'size-123', 'bg9', 'how-pos5');
            dateContainer.innerHTML = `
                <span class="ltext-107 cl2 txt-center">${day}</span>
                <span class="stext-109 cl3 txt-center">${monthName} ${year}</span>
            `;
            postImageContainer.appendChild(dateContainer);

            // Create and populate Metadata Section
            const postMetadataContainer = document.createElement('div');
            postMetadataContainer.classList.add('p-t-32');

            const postTitle = document.createElement('h4');
            postTitle.classList.add('ltext-109', 'cl2', 'p-b-28');
            postTitle.textContent = post.metadata.title;

            const postContent = document.createElement('div');
            postContent.classList.add('stext-117', 'cl6', 'p-b-26');

            // Convert Markdown to HTML and populate Content Section
            const converter = new showdown.Converter();
            postContent.innerHTML = converter.makeHtml(post.content || '');

            // Append all created elements to the main container
            const mainContainer = document.querySelector('.col-md-8.col-lg-9.p-b-80');
            if (mainContainer) {
                mainContainer.innerHTML = ''; // Clear existing content
                mainContainer.appendChild(postImageContainer);
                mainContainer.appendChild(postTitle);
                mainContainer.appendChild(postContent);
            } else {
                console.error('Main content container not found');
            }

            // Create and populate Tags Section
            const tagsContainer = document.createElement('div');
            tagsContainer.classList.add('flex-w', 'flex-t', 'p-t-16');
            tagsContainer.innerHTML = `
                <span class="size-216 stext-116 cl8 p-t-4">Tags</span>
                <div class="flex-w size-217">
                    ${post.metadata.tags.map(tag => `
                        <a href="#" class="flex-c-m stext-107 cl6 size-301 bor7 p-lr-15 hov-tag1 trans-04 m-r-5 m-b-5">
                            ${tag}
                        </a>
                    `).join('')}
                </div>
            `;

            const tagsContainerDiv = document.createElement('div');
            tagsContainerDiv.classList.add('p-t-32');
            tagsContainerDiv.appendChild(tagsContainer);

            if (mainContainer) {
                mainContainer.appendChild(tagsContainerDiv);
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
