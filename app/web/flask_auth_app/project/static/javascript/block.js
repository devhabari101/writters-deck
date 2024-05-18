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
        markdownContentDiv.classList.add('markdown-content');

        const markdownTitle = document.createElement('h4');
        markdownTitle.textContent = markdown.metadata.title;

        const markdownImage = document.createElement('img');
        markdownImage.src = markdown.metadata.image_url;
        markdownImage.alt = markdown.metadata.title;
        markdownImage.classList.add('img-fluid');

        markdownContentDiv.appendChild(markdownTitle);
        markdownContentDiv.appendChild(markdownImage);

        containerDiv.appendChild(markdownContentDiv);
    });

    return containerDiv;
}

