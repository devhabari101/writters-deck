export function getLatestPopularMarkdown(popularMarkdowns) {
    const latestPopularMarkdown = popularMarkdowns[0];

    const markdownContentDiv = document.createElement('div');
    markdownContentDiv.classList.add('markdown-content', 'row'); // Add Bootstrap classes for grid layout

    // Image container
    const imageDiv = document.createElement('div');
    imageDiv.classList.add('col-md-12'); // Full-width image
    const markdownImage = document.createElement('img');
    markdownImage.src = latestPopularMarkdown.metadata.image_url;
    markdownImage.alt = latestPopularMarkdown.metadata.title;
    markdownImage.classList.add('img-fluid'); // Add Bootstrap class for responsive images
    imageDiv.appendChild(markdownImage);

    // Title, date, and reading time container
    const contentDiv = document.createElement('div');
    contentDiv.classList.add('col-md-12', 'title-date-container'); // Full-width content

    // Title
    const markdownLink = document.createElement('a');
    markdownLink.href = latestPopularMarkdown.metadata.link;
    markdownLink.textContent = latestPopularMarkdown.metadata.title;
    markdownLink.classList.add('stext-116', 'cl8', 'hov-cl1', 'trans-04'); // Add text classes

    // Date and reading time span
    const dateTimeDiv = document.createElement('div');
    dateTimeDiv.classList.add('d-flex', 'justify-content-between', 'align-items-center');

    const dateSpan = document.createElement('span');
    dateSpan.classList.add('stext-116', 'cl6', 'p-t-20');
    dateSpan.textContent = latestPopularMarkdown.metadata.date;

    const calculateReadingTime = (text) => {
        const wordsPerMinute = 200; // Average reading speed
        const words = text.split(/\s+/).length;
        const minutes = Math.ceil(words / wordsPerMinute);
        return `${minutes} min read`;
    };

    const timeToReadSpan = document.createElement('span');
    timeToReadSpan.classList.add('stext-116', 'cl6', 'p-t-20');
    timeToReadSpan.textContent = calculateReadingTime(latestPopularMarkdown.content);

    dateTimeDiv.appendChild(dateSpan);
    dateTimeDiv.appendChild(timeToReadSpan);

    // Category span
    const categorySpan = document.createElement('span');
    categorySpan.classList.add('stext-116', 'cl6', 'p-t-20');
    categorySpan.textContent = `Category: ${latestPopularMarkdown.metadata.category}`;

    // Excerpt
    const excerptDiv = document.createElement('div');
    excerptDiv.classList.add('stext-117', 'cl6', 'p-t-20');
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
