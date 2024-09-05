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
            postImageContainer.classList.add('wrap-pic-w', 'how-pos5-parent');

            const postImage = document.createElement('img');
            postImage.src = post.metadata.image_url;
            postImage.alt = 'Post Image';
            postImage.classList.add('img-fluid');
            postImageContainer.appendChild(postImage);

            // Create and populate Date Section
            const [day, month, year] = post.metadata.date.split('-');
            const monthName = new Date(`${year}-${month}-${day}`).toLocaleString('default', { month: 'short' });

            const dateContainer = document.createElement('div');
            dateContainer.classList.add('flex-col-c-m', 'size-123', 'bg9', 'how-pos5');

            const postDay = document.createElement('span');
            postDay.id = 'post-day';
            postDay.textContent = day;

            const postMonthYear = document.createElement('span');
            postMonthYear.id = 'post-month-year';
            postMonthYear.textContent = `${monthName} ${year}`;

            dateContainer.appendChild(postDay);
            dateContainer.appendChild(postMonthYear);

            // Create and populate Metadata Section
            const postMetadataContainer = document.createElement('div');
            postMetadataContainer.classList.add('post-metadata', 'p-t-10');

            const postAuthor = document.createElement('span');
            postAuthor.id = 'post-author';
            postAuthor.textContent = `By ${post.metadata.user_id || 'Admin'}`;

            const postCategories = document.createElement('span');
            postCategories.id = 'post-categories';
            postCategories.textContent = `Category: ${post.metadata.category}`;

            postMetadataContainer.appendChild(postAuthor);
            postMetadataContainer.appendChild(postCategories);

            // Create and populate Title Section
            const postTitle = document.createElement('h1');
            postTitle.id = 'post-title';
            postTitle.textContent = post.metadata.title;

            // Convert Markdown to HTML and populate Content Section
            const converter = new showdown.Converter();
            const postContent = document.createElement('div');
            postContent.id = 'post-content';
            postContent.innerHTML = converter.makeHtml(post.content || '');

            // Append all created elements to the main container
            const mainContainer = document.getElementById('main-content');
            if (mainContainer) {
                mainContainer.appendChild(postImageContainer);
                mainContainer.appendChild(dateContainer);
                mainContainer.appendChild(postTitle);
                mainContainer.appendChild(postMetadataContainer);
                mainContainer.appendChild(postContent);
            } else {
                console.error('Main content container not found');
            }
            // Handle YouTube Video Embedding
            if (post.metadata.youtube_link) {
                const youtubeContainer = document.createElement('div');
                youtubeContainer.classList.add('video-container');

                const youtubeIframe = document.createElement('iframe');
                youtubeIframe.width = '560';
                youtubeIframe.height = '315';
                youtubeIframe.src = `https://www.youtube.com/embed/${post.metadata.youtube_link.split('v=')[1]}`;
                youtubeIframe.frameborder = '0';
                youtubeIframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
                youtubeIframe.allowFullscreen = true;

                youtubeContainer.appendChild(youtubeIframe);
                mainContainer.appendChild(youtubeContainer);
            }
            // Handle Sidebar (Optional)
            const sidebarContainer = document.getElementById('sidebar-container');
            if (sidebarContainer) {
                const sidebar = createSidebar(data);
                sidebarContainer.appendChild(sidebar);
            } else {
                console.error('Sidebar container not found');
            }

        })
        .catch(error => {
            console.error('Error fetching markdown data:', error);
        });
});
