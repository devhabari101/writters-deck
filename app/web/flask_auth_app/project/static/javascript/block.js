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
