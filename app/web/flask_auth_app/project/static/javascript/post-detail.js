import { createSidebar } from './sidebar.js';

// Function to extract query parameters from the URL
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

// Get the slug from the URL
const slug = getQueryParam('slug');

fetch('markdown_output.json')
    .then(response => response.json())
    .then(data => {
        try {
            // Find the post by slug
            const post = data.find(item => item.metadata.slug === slug);
            if (!post) {
                console.error('Post not found for slug:', slug);
                return;
            }

            const markdownContentDiv = document.getElementById('main-content');
            const converter = new showdown.Converter();

            // Create the row structure
            const rowDiv = document.createElement('div');
            rowDiv.classList.add('row');
            
            // Left column for post content
            const leftColumnDiv = document.createElement('div');
            leftColumnDiv.classList.add('col-md-8', 'col-lg-9', 'p-b-80');
            rowDiv.appendChild(leftColumnDiv);

            // Main content wrapper
            const mainContentDiv = document.createElement('div');
            mainContentDiv.id = 'main-content';
            leftColumnDiv.appendChild(mainContentDiv);

            // Create the image container with overlay date
            const wrapPicDiv = document.createElement('div');
            wrapPicDiv.classList.add('wrap-pic-w', 'how-pos5-parent', 'position-relative');

            const imageElement = document.createElement('img');
            imageElement.src = post.metadata.image_url;
            imageElement.alt = 'Post Image';
            imageElement.classList.add('img-fluid');
            wrapPicDiv.appendChild(imageElement);

            const dateOverlayDiv = document.createElement('div');
            dateOverlayDiv.classList.add('flex-col-c-m', 'size-123', 'bg9', 'how-pos5', 'position-absolute', 'top-0', 'left-0');

            const [day, month, year] = post.metadata.date.split('-');
            const monthName = new Date(`${year}-${month}-${day}`).toLocaleString('default', { month: 'short' });

            const daySpan = document.createElement('span');
            daySpan.textContent = day;
            dateOverlayDiv.appendChild(daySpan);

            const monthYearSpan = document.createElement('span');
            monthYearSpan.textContent = `${monthName} ${year}`;
            dateOverlayDiv.appendChild(monthYearSpan);

            wrapPicDiv.appendChild(dateOverlayDiv);
            mainContentDiv.appendChild(wrapPicDiv);

            // Title and metadata
            const titleElement = document.createElement('h1');
            titleElement.id = 'post-title';
            titleElement.textContent = post.metadata.title;
            mainContentDiv.appendChild(titleElement);

            const metadataDiv = document.createElement('div');
            metadataDiv.classList.add('post-metadata', 'p-t-10');

            const authorSpan = document.createElement('span');
            authorSpan.id = 'post-author';
            authorSpan.textContent = `By ${post.metadata.author || 'Admin'}`;
            metadataDiv.appendChild(authorSpan);

            const categoriesSpan = document.createElement('span');
            categoriesSpan.id = 'post-categories';
            categoriesSpan.textContent = `Category: ${post.metadata.category}`;
            metadataDiv.appendChild(categoriesSpan);

            mainContentDiv.appendChild(metadataDiv);

            // Post content
            const contentDiv = document.createElement('div');
            contentDiv.id = 'post-content';
            contentDiv.innerHTML = converter.makeHtml(post.content);
            mainContentDiv.appendChild(contentDiv);

            // Add YouTube video
            if (post.metadata.youtube_link) {
                const videoContainerDiv = document.createElement('div');
                videoContainerDiv.classList.add('video-container');

                const iframeElement = document.createElement('iframe');
                iframeElement.src = post.metadata.youtube_link;
                iframeElement.width = '560';
                iframeElement.height = '315';
                iframeElement.frameborder = '0';
                iframeElement.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
                iframeElement.allowFullscreen = true;

                videoContainerDiv.appendChild(iframeElement);
                mainContentDiv.appendChild(videoContainerDiv);
            }

            // Right column for the sidebar
            const rightColumnDiv = document.createElement('div');
            rightColumnDiv.classList.add('col-md-4', 'col-lg-3', 'p-b-80');
            rowDiv.appendChild(rightColumnDiv);

            // Sidebar container
            const sidebarContainerDiv = document.createElement('div');
            sidebarContainerDiv.id = 'sidebar-container';
            rightColumnDiv.appendChild(sidebarContainerDiv);

            // Append the entire row structure to the main container
            markdownContentDiv.appendChild(rowDiv);

        } catch (error) {
            console.error('Error parsing JSON:', error);
        }
    })
    .catch(error => {
        console.error('Error fetching JSON:', error);
    });

createSidebar();
