import { createSidebar } from './sidebar.js';

console.log('post-detail.js script loaded');

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded and parsed');

    // Check for main content container with the specific classes
    const mainContainer = document.getElementsByClassName('col-md-8 col-lg-9 p-b-80')[0];
    if (!mainContainer) {
        console.error('Main container not found. Ensure the HTML structure matches the expected class names.');
        return;
    }

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

            // Create and populate Image Section with Date Overlay
            const postImageContainer = document.createElement('div');
            postImageContainer.classList.add('wrap-pic-w', 'how-pos5-parent', 'position-relative');

            const postImage = document.createElement('img');
            postImage.src = post.metadata.image_url;
            postImage.alt = 'Post Image';
            postImage.classList.add('img-fluid');
            postImageContainer.appendChild(postImage);

            // Create Date Container to overlay on the image
            const [day, month, year] = post.metadata.date.split('-');
            const monthName = new Date(`${year}-${month}-${day}`).toLocaleString('default', { month: 'short' });

            const dateContainer = document.createElement('div');
            dateContainer.classList.add('flex-col-c-m', 'size-123', 'bg9', 'how-pos5', 'position-absolute', 'top-0', 'left-0');

            const postDay = document.createElement('span');
            postDay.id = 'post-day';
            postDay.textContent = day;

            const postMonthYear = document.createElement('span');
            postMonthYear.id = 'post-month-year';
            postMonthYear.textContent = `${monthName} ${year}`;

            dateContainer.appendChild(postDay);
            dateContainer.appendChild(postMonthYear);
            postImageContainer.appendChild(dateContainer);

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
            mainContainer.appendChild(postImageContainer);
            mainContainer.appendChild(postTitle);
            mainContainer.appendChild(postMetadataContainer);
            mainContainer.appendChild(postContent);

            // Append the YouTube video if the link is present
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

            // Handle Sidebar (Optional)
             const sidebarContainer = document.getElementById('sidebar-container');
            if (sidebarContainer) {
                console.log('Rendering sidebar...');
                if (Array.isArray(data)) {
                    const sidebar = createSidebar(data); // Ensure createSidebar can handle the passed data
                    sidebarContainer.appendChild(sidebar);
                } else {
                    console.error('Sidebar data is not an array:', data);
                }
            } else {
                console.error('Sidebar container not found');
            }

        })
        .catch(error => {
            console.error('Error fetching markdown data:', error);
        });
});

// Helper function to extract YouTube ID from URL
function extractYouTubeID(url) {
    const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([^&?/]+)/;
    const match = url.match(regex);
    return match ? match[1] : '';
}
