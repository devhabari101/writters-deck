export function renderLatestMarkdown(data) {
    // Iterate over the JSON data to find the latest item with trending, topPick, and popular set to "on"
    const latestMarkdown = data.find(item => item.metadata.trending === "on" && item.metadata.topPick === "on" && item.metadata.popular === "on");

    if (!latestMarkdown) {
        console.error("No markdown data found for trending, topPick, and popular.");
        return null;
    }

    // Create a container div for the latest markdown
    const container = document.createElement('div');
    container.className = 'container-fluid features mb-5';

    // Create the inner container
    const innerContainer = document.createElement('div');
    innerContainer.className = 'container py-5';

    // Create the row for the latest markdown
    const row = document.createElement('div');
    row.className = 'row g-4';

    // Create the column for the latest markdown
    const column = document.createElement('div');
    column.className = 'col-md-6 col-lg-6 col-xl-3';

    // Create the features item row
    const featuresItemRow = document.createElement('div');
    featuresItemRow.className = 'row g-4 align-items-center features-item';

    // Create the column for the image
    const imageColumn = document.createElement('div');
    imageColumn.className = 'col-4';

    // Create the image element
    const image = document.createElement('img');
    image.className = 'img-zoomin img-fluid rounded-circle w-100';
    image.src = latestMarkdown.metadata.image_url;
    image.alt = 'Image';

    // Append the image to the image column
    imageColumn.appendChild(image);

    // Create the content column
    const contentColumn = document.createElement('div');
    contentColumn.className = 'col-8';

    // Create the features content
    const featuresContent = document.createElement('div');
    featuresContent.className = 'features-content d-flex flex-column';

    // Create the category paragraph
    const categoryParagraph = document.createElement('p');
    categoryParagraph.className = 'text-uppercase mb-2';
    categoryParagraph.textContent = latestMarkdown.metadata.category;

    // Create the title link
    const titleLink = document.createElement('a');
    titleLink.className = 'h6';
    titleLink.href = latestMarkdown.metadata.link;
    titleLink.textContent = latestMarkdown.metadata.title;

    // Create the date small element
    const dateSmall = document.createElement('small');
    dateSmall.className = 'text-body d-block';
    dateSmall.innerHTML = `<i class="fas fa-calendar-alt me-1"></i> ${latestMarkdown.metadata.date}`;

    // Append the category, title link, and date elements to the features content
    featuresContent.appendChild(categoryParagraph);
    featuresContent.appendChild(titleLink);
    featuresContent.appendChild(dateSmall);

    // Append the features content to the content column
    contentColumn.appendChild(featuresContent);

    // Append the image column and content column to the features item row
    featuresItemRow.appendChild(imageColumn);
    featuresItemRow.appendChild(contentColumn);

    // Append the features item row to the column
    column.appendChild(featuresItemRow);

    // Append the column to the row
    row.appendChild(column);

    // Append the row to the inner container
    innerContainer.appendChild(row);

    // Append the inner container to the container
    container.appendChild(innerContainer);

    // Return the container with the latest markdown
    return container;
}
