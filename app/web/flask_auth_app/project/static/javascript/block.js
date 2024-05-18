export function getLatestPopularMarkdown(popularMarkdowns) {
    const latestPopularMarkdown = popularMarkdowns[0];
    
    const markdownContentDiv = document.createElement('div');
    markdownContentDiv.classList.add('markdown-content');
    
    const markdownTitle = document.createElement('h2');
    markdownTitle.textContent = latestPopularMarkdown.metadata.title;

    const markdownLink = document.createElement('a');
    markdownLink.href = latestPopularMarkdown.metadata.link;
    markdownLink.textContent = latestPopularMarkdown.metadata.title;

    const markdownImage = document.createElement('img');
    markdownImage.src = latestPopularMarkdown.metadata.image_url;
    markdownImage.alt = latestPopularMarkdown.metadata.title;
    markdownImage.classList.add('img-fluid'); // Add Bootstrap class for responsive images

    markdownContentDiv.appendChild(markdownTitle);
    markdownContentDiv.appendChild(markdownLink);
    markdownContentDiv.appendChild(markdownImage);

    return markdownContentDiv;
}

export function renderLatestTrendingMarkdowns(markdowns) {
    // Filter the markdowns based on the "trending" field being "on"
    const trendingMarkdowns = markdowns.filter(markdown => markdown.metadata.trending === "on");

    // Sort the trending markdowns by date to get the latest ones
    const sortedTrendingMarkdowns = trendingMarkdowns.sort((a, b) => {
        // Convert dates to Date objects for comparison
        const dateA = new Date(a.metadata.date);
        const dateB = new Date(b.metadata.date);
        return dateB - dateA; // Sort in descending order (latest first)
    });

    // Take the first three markdowns (latest)
    const latestTrendingMarkdowns = sortedTrendingMarkdowns.slice(0, 3);

    // Create a container to hold the markdowns
    const containerDiv = document.createElement('div');

    // Render each of the latest trending markdowns
    latestTrendingMarkdowns.forEach(markdown => {
        const markdownContentDiv = document.createElement('div');
        markdownContentDiv.classList.add('latest-trending-markdown', 'row'); // Add Bootstrap classes for grid layout

        const imageDiv = document.createElement('div');
        imageDiv.classList.add('image-container', 'col-md-8'); // Bootstrap grid column class
        const markdownImage = document.createElement('img');
        markdownImage.src = markdown.metadata.image_url;
        markdownImage.alt = markdown.metadata.title;
        markdownImage.classList.add('img-fluid', 'col-md-12'); // Adjusted Bootstrap class
        imageDiv.appendChild(markdownImage);

        // Title and Date container
        const titleDateDiv = document.createElement('div');
        titleDateDiv.classList.add('title-date-container', 'col-md-4'); // Bootstrap grid column class

        // Title
        const titleLink = document.createElement('a');
        titleLink.href = markdown.metadata.link;
        titleLink.classList.add('stext-116', 'cl8', 'hov-cl1', 'trans-04');
        titleLink.textContent = markdown.metadata.title;

        // Date
        const dateSpan = document.createElement('span');
        dateSpan.classList.add('stext-116', 'cl6', 'p-t-20');
        dateSpan.textContent = markdown.metadata.date;

        titleDateDiv.appendChild(titleLink);
        titleDateDiv.appendChild(dateSpan);

        markdownContentDiv.appendChild(imageDiv);
        markdownContentDiv.appendChild(titleDateDiv);

        containerDiv.appendChild(markdownContentDiv);
    });

    return containerDiv;
}
