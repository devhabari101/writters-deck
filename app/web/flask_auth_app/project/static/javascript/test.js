export function getLatestPopularMarkdown(popularMarkdowns) {
    const latestPopularMarkdown = popularMarkdowns[0];

    const markdownContentDiv = document.createElement('div');
    markdownContentDiv.classList.add('markdown-content', 'row'); // Add Bootstrap classes for grid layout

    // Image container
    const imageDiv = document.createElement('div');
    imageDiv.classList.add('col-md-8'); // Bootstrap grid column class
    const markdownImage = document.createElement('img');
    markdownImage.src = latestPopularMarkdown.metadata.image_url;
    markdownImage.alt = latestPopularMarkdown.metadata.title;
    markdownImage.classList.add('img-fluid', 'col-md-12'); // Add Bootstrap class for responsive images
    imageDiv.appendChild(markdownImage);

    // Content container
    const contentDiv = document.createElement('div');
    contentDiv.classList.add('col-md-4', 'title-date-container'); // Bootstrap grid column class with custom class

    // Title
    const markdownLink = document.createElement('a');
    markdownLink.href = latestPopularMarkdown.metadata.link;
    markdownLink.textContent = latestPopularMarkdown.metadata.title;
    markdownLink.classList.add('stext-116', 'cl8', 'hov-cl1', 'trans-04'); // Add text classes

    // Reading time calculation
    const calculateReadingTime = (text) => {
        const wordsPerMinute = 200; // Average reading speed
        const words = text.split(/\s+/).length;
        const minutes = Math.ceil(words / wordsPerMinute);
        return `${minutes} min read`;
    };

    // Time to read span
    const timeToReadSpan = document.createElement('span');
    timeToReadSpan.classList.add('stext-116', 'cl6', 'p-t-20');
    timeToReadSpan.textContent = calculateReadingTime(latestPopularMarkdown.content);

    // Date span
    const dateSpan = document.createElement('span');
    dateSpan.classList.add('stext-116', 'cl6', 'p-t-20');
    dateSpan.textContent = latestPopularMarkdown.metadata.date;

    // Append elements to content container
    contentDiv.appendChild(markdownLink);
    contentDiv.appendChild(dateSpan);
    contentDiv.appendChild(timeToReadSpan);

    // Append containers to main container
    markdownContentDiv.appendChild(imageDiv);
    markdownContentDiv.appendChild(contentDiv);

    return markdownContentDiv;
}
