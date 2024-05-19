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



export function renderLatestTrendingMarkdowns(markdowns) {
    // Filter the markdowns based on the "trending" field being "on"
    const trendingMarkdowns = markdowns.filter(markdown => markdown.metadata.trending === "on");

    // Sort the trending markdowns by date to get the latest ones
    const sortedTrendingMarkdowns = trendingMarkdowns.sort((a, b) => {
        const dateA = new Date(a.metadata.date);
        const dateB = new Date(b.metadata.date);
        return dateB - dateA; // Sort in descending order (latest first)
    });

    // Take the first three markdowns (latest)
    const latestTrendingMarkdowns = sortedTrendingMarkdowns.slice(0, 3);

    // Create a container to hold the markdowns
    const containerDiv = document.createElement('div');

    // Function to calculate the estimated reading time
    const calculateReadingTime = (text) => {
        const wordsPerMinute = 200; // Average reading speed
        const words = text.split(/\s+/).length;
        const minutes = Math.ceil(words / wordsPerMinute);
        return `${minutes} min read`;
    };

    // Render each of the latest trending markdowns
    latestTrendingMarkdowns.forEach(markdown => {
        const markdownContentDiv = document.createElement('div');
        markdownContentDiv.classList.add('latest-trending-markdown', 'row'); // Add Bootstrap classes for grid layout

        const imageDiv = document.createElement('div');
        imageDiv.classList.add('col-md-8'); // Bootstrap grid column class
        const markdownImage = document.createElement('img');
        markdownImage.src = markdown.metadata.image_url;
        markdownImage.alt = markdown.metadata.title;
        markdownImage.classList.add('img-fluid', 'col-md-12'); // Add Bootstrap class for responsive images
        imageDiv.appendChild(markdownImage);

        // Title and Date container
        const titleDateDiv = document.createElement('div');
        titleDateDiv.classList.add('col-md-4', 'title-date-container'); // Bootstrap grid column class

        // Title
        const titleLink = document.createElement('a');
        titleLink.href = markdown.metadata.link;
        titleLink.classList.add('stext-116', 'cl8', 'hov-cl1', 'trans-04', 'd-block', 'mb-2');
        titleLink.textContent = markdown.metadata.title;

        // Time to read
        const timeToReadSpan = document.createElement('span');
        timeToReadSpan.classList.add('stext-116', 'cl6', 'd-block', 'mb-2');
        timeToReadSpan.textContent = calculateReadingTime(markdown.content);

        // Date
        const dateSpan = document.createElement('span');
        dateSpan.classList.add('stext-116', 'cl6', 'd-block');
        dateSpan.textContent = markdown.metadata.date;

        titleDateDiv.appendChild(titleLink);
        titleDateDiv.appendChild(timeToReadSpan);
        titleDateDiv.appendChild(dateSpan);

        markdownContentDiv.appendChild(imageDiv);
        markdownContentDiv.appendChild(titleDateDiv);

        containerDiv.appendChild(markdownContentDiv);
    });

    return containerDiv;
}
