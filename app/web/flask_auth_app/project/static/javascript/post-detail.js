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

            // Create main container structure
            const mainContainer = document.querySelector('.col-md-8.col-lg-9.p-b-80 .p-r-45.p-r-0-lg');
            if (!mainContainer) {
                console.error('Main container not found');
                return;
            }

            // Create Image Section with Date Overlay
            const postImageContainer = document.createElement('div');
            postImageContainer.classList.add('wrap-pic-w', 'how-pos5-parent');

            const postImage = document.createElement('img');
            postImage.src = post.metadata.image_url || 'images/blog-default.jpg';
            postImage.alt = 'Post Image';
            postImageContainer.appendChild(postImage);

            const dateContainer = document.createElement('div');
            dateContainer.classList.add('flex-col-c-m', 'size-123', 'bg9', 'how-pos5');

            const postDay = document.createElement('span');
            postDay.classList.add('ltext-107', 'cl2', 'txt-center');
            postDay.textContent = new Date(post.metadata.date).getDate(); // Get day from date

            const postMonthYear = document.createElement('span');
            postMonthYear.classList.add('stext-109', 'cl3', 'txt-center');
            const postDate = new Date(post.metadata.date);
            postMonthYear.textContent = `${postDate.toLocaleString('default', { month: 'short' })} ${postDate.getFullYear()}`; // Format as 'Jan 2018'

            dateContainer.appendChild(postDay);
            dateContainer.appendChild(postMonthYear);
            postImageContainer.appendChild(dateContainer);
            mainContainer.appendChild(postImageContainer);

            // Create Metadata Section
            const metadataContainer = document.createElement('div');
            metadataContainer.classList.add('p-t-32');

            const postMetadata = document.createElement('span');
            postMetadata.classList.add('flex-w', 'flex-m', 'stext-111', 'cl2', 'p-b-19');

            // Post Author
            const postAuthor = document.createElement('span');
            postAuthor.innerHTML = `<span class="cl4">By</span> ${post.metadata.user_id || 'Admin'} <span class="cl12 m-l-4 m-r-6">|</span>`;

            // Post Date
            const postDateSpan = document.createElement('span');
            postDateSpan.textContent = `${postDate.getDate()} ${postMonthYear.textContent}`;
            postDateSpan.innerHTML += `<span class="cl12 m-l-4 m-r-6">|</span>`;

            // Post Categories
            const postCategories = document.createElement('span');
            postCategories.textContent = `Category: ${post.metadata.category}`;
            postCategories.innerHTML += `<span class="cl12 m-l-4 m-r-6">|</span>`;

            // Comments (Dummy content as no real comments are fetched)
            const comments = document.createElement('span');
            comments.textContent = '8 Comments'; // You can replace this with dynamic data if available

            postMetadata.appendChild(postAuthor);
            postMetadata.appendChild(postDateSpan);
            postMetadata.appendChild(postCategories);
            postMetadata.appendChild(comments);
            metadataContainer.appendChild(postMetadata);

            // Create and Populate Title Section
            const postTitle = document.createElement('h4');
            postTitle.classList.add('ltext-109', 'cl2', 'p-b-28');
            postTitle.textContent = post.metadata.title || 'Post Title';

            metadataContainer.appendChild(postTitle);
            mainContainer.appendChild(metadataContainer);

            // Convert Markdown to HTML and populate Content Section
            const converter = new showdown.Converter();
            const postContent = document.createElement('div');
            postContent.innerHTML = converter.makeHtml(post.content || '');

            mainContainer.appendChild(postContent);

            // Handle YouTube Video Embedding
            if (post.metadata.youtube_link) {
                const youtubeVideoContainer = document.createElement('div');
                youtubeVideoContainer.classList.add('video-container');

                const iframe = document.createElement('iframe');
                iframe.src = `https://www.youtube.com/embed/${extractYouTubeID(post.metadata.youtube_link)}`;
                iframe.width = '560';
                iframe.height = '315';
                iframe.frameBorder = '0';
                iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
                iframe.allowFullscreen = true;

                youtubeVideoContainer.appendChild(iframe);
                mainContainer.appendChild(youtubeVideoContainer);
            }

            // Handle Sidebar
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
