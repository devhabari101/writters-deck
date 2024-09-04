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
            const postImageContainer = document.createElement('div');
            postImageContainer.className = 'wrap-pic-w how-pos5-parent';
            const postImage = document.createElement('img');
            postImage.src = post.metadata.image_url;
            postImage.alt = 'Post Image';

            const dateContainer = document.createElement('div');
            dateContainer.className = 'flex-col-c-m size-123 bg9 how-pos5';
            const [day, month, year] = post.metadata.date.split('-');
            const monthName = new Date(`${year}-${month}-${day}`).toLocaleString('default', { month: 'short' });

            const postDay = document.createElement('span');
            postDay.className = 'ltext-107 cl2 txt-center';
            postDay.textContent = day;

            const postMonthYear = document.createElement('span');
            postMonthYear.className = 'stext-109 cl3 txt-center';
            postMonthYear.textContent = `${monthName} ${year}`;

            dateContainer.appendChild(postDay);
            dateContainer.appendChild(postMonthYear);
            postImageContainer.appendChild(postImage);
            postImageContainer.appendChild(dateContainer);

            // Populate Metadata Section
            const metadataContainer = document.createElement('div');
            metadataContainer.className = 'p-t-32';

            const metadataInfo = document.createElement('span');
            metadataInfo.className = 'flex-w flex-m stext-111 cl2 p-b-19';

            const author = document.createElement('span');
            author.innerHTML = `<span class="cl4">By</span> ${post.metadata.user_id || 'Admin'} <span class="cl12 m-l-4 m-r-6">|</span>`;
            const postDate = document.createElement('span');
            postDate.textContent = `${day} ${monthName}, ${year} `;
            postDate.className = 'cl12 m-l-4 m-r-6';

            const categories = document.createElement('span');
            categories.textContent = post.metadata.category;
            categories.className = 'cl12 m-l-4 m-r-6';

            metadataInfo.appendChild(author);
            metadataInfo.appendChild(postDate);
            metadataInfo.appendChild(categories);
            metadataContainer.appendChild(metadataInfo);

            // Create and populate Title Section
            const postTitle = document.createElement('h4');
            postTitle.className = 'ltext-109 cl2 p-b-28';
            postTitle.textContent = post.metadata.title;

            // Convert Markdown to HTML and populate Content Section
            const converter = new showdown.Converter();
            const postContent = document.createElement('div');
            postContent.className = 'stext-117 cl6 p-b-26';
            postContent.innerHTML = converter.makeHtml(post.content || '');

            // Append all created elements to the main container
            const mainContainer = document.getElementById('main-content');
            if (mainContainer) {
                mainContainer.appendChild(postImageContainer);
                mainContainer.appendChild(metadataContainer);
                mainContainer.appendChild(postTitle);
                mainContainer.appendChild(postContent);
            } else {
                console.error('Main content container not found');
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
