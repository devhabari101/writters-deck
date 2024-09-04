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

            // Create and populate Image Section
            const postImageContainer = document.createElement('div');
            const postImage = document.createElement('img');
            postImage.id = 'post-image';
            postImage.src = post.metadata.image_url;
            postImage.alt = 'Post Image';
            postImageContainer.appendChild(postImage);

            // Create and populate Date Section
            const [day, month, year] = post.metadata.date.split('-');
            const monthName = new Date(`${year}-${month}-${day}`).toLocaleString('default', { month: 'short' });

            const postDateContainer = document.createElement('div');
            const postDay = document.createElement('span');
            postDay.id = 'post-day';
            postDay.textContent = day;

            const postMonthYear = document.createElement('span');
            postMonthYear.id = 'post-month-year';
            postMonthYear.textContent = `${monthName} ${year}`;

            postDateContainer.appendChild(postDay);
            postDateContainer.appendChild(postMonthYear);

            // Create and populate Metadata Section
            const postMetadataContainer = document.createElement('div');
            const postAuthor = document.createElement('span');
            postAuthor.id = 'post-author';
            postAuthor.textContent = post.metadata.user_id || 'Admin';

            const postDate = document.createElement('span');
            postDate.id = 'post-date';
            postDate.textContent = post.metadata.date;

            const postCategories = document.createElement('span');
            postCategories.id = 'post-categories';
            postCategories.textContent = post.metadata.category;

            const postTitle = document.createElement('h1');
            postTitle.id = 'post-title';
            postTitle.textContent = post.metadata.title;

            postMetadataContainer.appendChild(postAuthor);
            postMetadataContainer.appendChild(postDate);
            postMetadataContainer.appendChild(postCategories);

            // Convert Markdown to HTML and populate Content Section
            const converter = new showdown.Converter();
            const postContent = document.createElement('div');
            postContent.id = 'post-content';
            postContent.innerHTML = converter.makeHtml(post.content || '');

            // Append all created elements to the main container
            const mainContainer = document.getElementById('main-content');
            if (mainContainer) {
                mainContainer.appendChild(postImageContainer);
                mainContainer.appendChild(postDateContainer);
                mainContainer.appendChild(postMetadataContainer);
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

            // Instead of appending to `.row`, append to `#sidebar-container`
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
