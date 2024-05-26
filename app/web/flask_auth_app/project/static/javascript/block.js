export function renderLatestMarkdown(data) {
    const featuresContainer = document.querySelector('.features .container .row');

    // Clear existing content
    featuresContainer.innerHTML = '';

    // Loop through each item in the data
    data.forEach(item => {
        // Create column div for the item
        const colDiv = document.createElement('div');
        colDiv.className = 'col-md-6 col-lg-6 col-xl-3';

        // Create features-item div
        const featuresItemDiv = document.createElement('div');
        featuresItemDiv.className = 'row g-4 align-items-center features-item';

        // Create image div
        const imageDiv = document.createElement('div');
        imageDiv.className = 'col-4';
        const image = document.createElement('img');
        image.src = item.metadata.image_url;
        image.classList.add('img-zoomin', 'img-fluid', 'rounded-circle', 'w-100');
        image.alt = 'Image';
        imageDiv.appendChild(image);

        // Create number of content span
        const contentNumberSpan = document.createElement('span');
        contentNumberSpan.className = 'rounded-circle border border-2 border-white bg-primary btn-sm-square text-white position-absolute';
        contentNumberSpan.style.top = '10%';
        contentNumberSpan.style.right = '-10px';
        contentNumberSpan.textContent = '3'; // Example number of content within a category
        imageDiv.appendChild(contentNumberSpan);

        // Create features-content div
        const featuresContentDiv = document.createElement('div');
        featuresContentDiv.className = 'col-8 features-content d-flex flex-column';

        // Create category paragraph
        const categoryParagraph = document.createElement('p');
        categoryParagraph.className = 'text-uppercase mb-2';
        categoryParagraph.textContent = item.metadata.category;
        featuresContentDiv.appendChild(categoryParagraph);

        // Create title link
        const titleLink = document.createElement('a');
        titleLink.className = 'h6';
        titleLink.href = '#';
        titleLink.textContent = item.metadata.title;
        featuresContentDiv.appendChild(titleLink);

        // Create date small element
        const dateSmall = document.createElement('small');
        dateSmall.className = 'text-body d-block';
        dateSmall.innerHTML = `<i class="fas fa-calendar-alt me-1"></i> ${item.metadata.date}`;
        featuresContentDiv.appendChild(dateSmall);

        // Append image and content to featuresItemDiv
        featuresItemDiv.appendChild(imageDiv);
        featuresItemDiv.appendChild(featuresContentDiv);

        // Append featuresItemDiv to colDiv
        colDiv.appendChild(featuresItemDiv);

        // Append colDiv to featuresContainer
        featuresContainer.appendChild(colDiv);
    });
}
