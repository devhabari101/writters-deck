// Function to render the latest single markdown
export function renderLatestMarkdown(data) {
    // Find the latest markdown with "trending", "topPick", and "popular" set to "on"
    const latestMarkdown = data.find(item => item.metadata.trending === "on" && item.metadata.topPick === "on" && item.metadata.popular === "on");

    if (!latestMarkdown) {
        console.error("No markdown found with 'trending', 'topPick', and 'popular' set to 'on'");
        return null;
    }

    // Create container elements
    const containerFluid = document.createElement('div');
    containerFluid.className = 'container-fluid features mb-5';
    const container = document.createElement('div');
    container.className = 'container py-5';
    const row = document.createElement('div');
    row.className = 'row g-4';

    // Create column element
    const column = document.createElement('div');
    column.className = 'col-md-6 col-lg-6 col-xl-3';

    // Create features item element
    const featuresItem = document.createElement('div');
    featuresItem.className = 'row g-4 align-items-center features-item';

    // Create image container
    const imageContainer = document.createElement('div');
    imageContainer.className = 'col-4';

    // Create image element
    const image = document.createElement('img');
    image.src = latestMarkdown.metadata.image_url;
    image.className = 'img-zoomin img-fluid rounded-circle w-100';
    image.alt = 'Image';

    // Create image overlay
    const overlay = document.createElement('span');
    overlay.className = 'rounded-circle border border-2 border-white bg-primary btn-sm-square text-white position-absolute';
    overlay.style.top = '10%';
    overlay.style.right = '-10px';
    overlay.textContent = '3'; // Assuming this is the number of content within a category

    // Append image and overlay to the image container
    imageContainer.appendChild(image);
    imageContainer.appendChild(overlay);

    // Create content container
    const contentContainer = document.createElement('div');
    contentContainer.className = 'col-8';

    // Create features content element
    const featuresContent = document.createElement('div');
    featuresContent.className = 'features-content d-flex flex-column';

    // Create category element
    const category = document.createElement('p');
    category.className = 'text-uppercase mb-2';
    category.textContent = latestMarkdown.metadata.category;

    // Create title element
    const title = document.createElement('a');
    title.className = 'h6';
    title.href = '#';
    title.textContent = latestMarkdown.metadata.title;

    // Create date element
    const date = document.createElement('small');
    date.className = 'text-body d-block';
    date.innerHTML = `<i class="fas fa-calendar-alt me-1"></i>${latestMarkdown.metadata.date}`;

    // Append category, title, and date to features content
    featuresContent.appendChild(category);
    featuresContent.appendChild(title);
    featuresContent.appendChild(date);

    // Append features content to content container
    contentContainer.appendChild(featuresContent);

    // Append image container and content container to features item
    featuresItem.appendChild(imageContainer);
    featuresItem.appendChild(contentContainer);

    // Append features item to column
    column.appendChild(featuresItem);

    // Append column to row
    row.appendChild(column);

    // Append row to container
    container.appendChild(row);

    // Append container to container fluid
    containerFluid.appendChild(container);

    return containerFluid; // Return the container with the latest markdown
}
