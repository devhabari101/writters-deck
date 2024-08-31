import { createSidebar } from './sidebar.js';

document.addEventListener('DOMContentLoaded', () => {
    fetch('markdown_output.json')
        .then(response => response.json())
        .then(data => {
            console.log('Fetched data:', data);

            const urlParams = new URLSearchParams(window.location.search);
            const slug = urlParams.get('slug');
            console.log('Requested slug:', slug);

            const post = data.find(item => item.metadata.slug === slug);
            if (!post) {
                console.error('Post not found');
                return;
            }

            console.log('Post data:', post);

            // Populate Image Section
            const postImage = document.getElementById('post-image');
            postImage.src = post.metadata.image_url;

            const [day, month, year] = post.metadata.date.split('-');
            const monthName = new Date(`${year}-${month}-${day}`).toLocaleString('default', { month: 'short' });

            document.getElementById('post-day').textContent = day;
            document.getElementById('post-month-year').textContent = `${monthName} ${year}`;

            // Populate Content Section
            document.getElementById('post-author').textContent = post.metadata.user_id || 'Admin';
            document.getElementById('post-date').textContent = post.metadata.date;
            document.getElementById('post-categories').textContent = post.metadata.category;
            document.getElementById('post-title').textContent = post.metadata.title;

            // Convert Markdown to HTML
            const converter = new showdown.Converter();
            const postContent = document.getElementById('post-content');
            postContent.innerHTML = converter.makeHtml(post.content || '');

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

            const rowDiv = document.querySelector('.row');
            rowDiv.appendChild(sidebar);

        })
        .catch(error => {
            console.error('Error fetching markdown data:', error);
        });
});