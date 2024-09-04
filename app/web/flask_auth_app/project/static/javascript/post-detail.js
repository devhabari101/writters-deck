document.addEventListener('DOMContentLoaded', () => {
    fetch('markdown_output.json')
        .then(response => response.json())
        .then(data => {
            const urlParams = new URLSearchParams(window.location.search);
            const slug = urlParams.get('slug');

            const post = data.find(item => item.metadata.slug === slug);

            if (!post) {
                console.error('Post not found');
                return;
            }

            // Create and populate the image section
            const imageWrapper = document.createElement('div');
            imageWrapper.classList.add('wrap-pic-w', 'how-pos5-parent');

            const postImage = document.createElement('img');
            postImage.src = post.metadata.image_url;
            postImage.alt = 'IMG-BLOG';
            imageWrapper.appendChild(postImage);

            const dateContainer = document.createElement('div');
            dateContainer.classList.add('flex-col-c-m', 'size-123', 'bg9', 'how-pos5');

            const [day, month, year] = post.metadata.date.split('-');
            const monthName = new Date(`${year}-${month}-${day}`).toLocaleString('default', { month: 'short' });

            const daySpan = document.createElement('span');
            daySpan.classList.add('ltext-107', 'cl2', 'txt-center');
            daySpan.textContent = day;

            const monthYearSpan = document.createElement('span');
            monthYearSpan.classList.add('stext-109', 'cl3', 'txt-center');
            monthYearSpan.textContent = `${monthName} ${year}`;

            dateContainer.appendChild(daySpan);
            dateContainer.appendChild(monthYearSpan);
            imageWrapper.appendChild(dateContainer);

            // Create and populate metadata section
            const metadataContainer = document.createElement('div');
            metadataContainer.classList.add('p-t-32');

            const metadataFlex = document.createElement('span');
            metadataFlex.classList.add('flex-w', 'flex-m', 'stext-111', 'cl2', 'p-b-19');

            const authorSpan = document.createElement('span');
            authorSpan.innerHTML = `<span class="cl4">By</span> ${post.metadata.user_id || 'Admin'}<span class="cl12 m-l-4 m-r-6">|</span>`;
            metadataFlex.appendChild(authorSpan);

            const dateSpan = document.createElement('span');
            dateSpan.innerHTML = `${day} ${monthName}, ${year}<span class="cl12 m-l-4 m-r-6">|</span>`;
            metadataFlex.appendChild(dateSpan);

            const categorySpan = document.createElement('span');
            categorySpan.textContent = post.metadata.category;
            metadataFlex.appendChild(categorySpan);

            metadataContainer.appendChild(metadataFlex);

            // Convert Markdown to HTML and populate the content section
            const converter = new showdown.Converter();
            const postContent = document.createElement('div');
            postContent.classList.add('post-content');
            postContent.innerHTML = converter.makeHtml(post.content || '');

            // Append the YouTube video if the link is present
            if (post.metadata.youtube_link) {
                const youtubeWrapper = document.createElement('div');
                youtubeWrapper.classList.add('youtube-video', 'p-t-32');

                const iframe = document.createElement('iframe');
                iframe.width = "560";
                iframe.height = "315";
                iframe.src = `https://www.youtube.com/embed/${getYouTubeID(post.metadata.youtube_link)}`;
                iframe.title = "YouTube video player";
                iframe.frameBorder = "0";
                iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
                iframe.allowFullscreen = true;

                youtubeWrapper.appendChild(iframe);
                postContent.appendChild(youtubeWrapper);
            }

            // Append all created elements to the main container
            const mainContainer = document.getElementById('main-content');
            if (mainContainer) {
                mainContainer.appendChild(imageWrapper);
                mainContainer.appendChild(metadataContainer);
                mainContainer.appendChild(postContent);
            } else {
                console.error('Main content container not found');
            }
        })
        .catch(error => {
            console.error('Error fetching markdown data:', error);
        });
});

// Helper function to extract the YouTube video ID from a full URL
function getYouTubeID(url) {
    const urlObj = new URL(url);
    if (urlObj.searchParams.get('v')) {
        return urlObj.searchParams.get('v');
    }
    return urlObj.pathname.split('/').pop();
}
