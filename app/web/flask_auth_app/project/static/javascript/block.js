export function getLatestPopularMarkdown(popularMarkdowns) {
    const latestPopularMarkdown = popularMarkdowns[0];

    const markdownContentDiv = document.createElement('div');
    markdownContentDiv.classList.add('markdown-content', 'row'); // Bootstrap grid layout

    // Image container
    const imageDiv = document.createElement('div');
    imageDiv.classList.add('col-md-12'); // Full-width image
    const markdownImage = document.createElement('img');
    markdownImage.src = latestPopularMarkdown.metadata.image_url;
    markdownImage.alt = latestPopularMarkdown.metadata.title;
    markdownImage.classList.add('img-fluid'); // Responsive image class
    imageDiv.appendChild(markdownImage);

    // Content container
    const contentDiv = document.createElement('div');
    contentDiv.classList.add('col-md-12', 'p-t-20'); // Full-width content with padding on top

    // Title
    const markdownLink = document.createElement('a');
    markdownLink.href = latestPopularMarkdown.metadata.link;
    markdownLink.textContent = latestPopularMarkdown.metadata.title;
    markdownLink.classList.add('stext-116', 'cl8', 'hov-cl1', 'trans-04', 'd-block', 'p-b-10'); // Styled link with bottom padding

    // Date and reading time container
    const dateTimeDiv = document.createElement('div');
    dateTimeDiv.classList.add('d-flex', 'justify-content-between', 'align-items-center', 'p-b-10'); // Flexbox for date and time

    const dateSpan = document.createElement('span');
    dateSpan.classList.add('stext-116', 'cl6');
    dateSpan.textContent = latestPopularMarkdown.metadata.date;

    const calculateReadingTime = (text) => {
        const wordsPerMinute = 200; // Average reading speed
        const words = text.split(/\s+/).length;
        const minutes = Math.ceil(words / wordsPerMinute);
        return `${minutes} min read`;
    };

    const timeToReadSpan = document.createElement('span');
    timeToReadSpan.classList.add('stext-116', 'cl6');
    timeToReadSpan.textContent = calculateReadingTime(latestPopularMarkdown.content);

    dateTimeDiv.appendChild(dateSpan);
    dateTimeDiv.appendChild(timeToReadSpan);

    // Category span
    const categorySpan = document.createElement('span');
    categorySpan.classList.add('stext-116', 'cl4', 'd-block', 'p-b-10');
    categorySpan.textContent = `Category: ${latestPopularMarkdown.metadata.category}`;

    // Excerpt
    const excerptDiv = document.createElement('div');
    excerptDiv.classList.add('stext-117', 'cl6', 'p-t-10');
    const excerptText = latestPopularMarkdown.content.split(/\s+/).slice(0, 50).join(' ') + '...';
    excerptDiv.textContent = excerptText;

    // Append elements to content container
    contentDiv.appendChild(markdownLink);
    contentDiv.appendChild(dateTimeDiv);
    contentDiv.appendChild(categorySpan);
    contentDiv.appendChild(excerptDiv);

    // Append containers to main container
    markdownContentDiv.appendChild(imageDiv);
    markdownContentDiv.appendChild(contentDiv);

    return markdownContentDiv;
}

// Define the function
export function renderLatestTrendingMarkdowns(trendingMarkdowns) {
    const trendingContainer = document.createElement('div');
    trendingContainer.classList.add('trending-markdowns-container');

    trendingMarkdowns.forEach(markdown => {
        const markdownDiv = document.createElement('div');
        markdownDiv.classList.add('markdown-item');

        const titleLink = document.createElement('a');
        titleLink.href = markdown.metadata.link;
        titleLink.textContent = markdown.metadata.title;
        titleLink.classList.add('trending-title');

        const dateSpan = document.createElement('span');
        dateSpan.classList.add('trending-date');
        dateSpan.textContent = markdown.metadata.date;

        const excerptDiv = document.createElement('div');
        excerptDiv.classList.add('trending-excerpt');
        const excerptText = markdown.content.split(/\s+/).slice(0, 50).join(' ') + '...';
        excerptDiv.textContent = excerptText;

        markdownDiv.appendChild(titleLink);
        markdownDiv.appendChild(dateSpan);
        markdownDiv.appendChild(excerptDiv);
        trendingContainer.appendChild(markdownDiv);
    });

    return trendingContainer;
}

// Ensure you have this export statement
export { renderLatestTrendingMarkdowns };
