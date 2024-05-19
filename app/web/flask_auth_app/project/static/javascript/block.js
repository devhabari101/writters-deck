export function renderLatestMarkdown(data) {
    // Check if there is data available
    if (data && data.length > 0) {
        const latestItem = data.find(item => item.metadata.trending === "on" && item.metadata.topPick === "on" && item.metadata.popular === "on");

        if (latestItem) {
            const featuresContainer = document.querySelector('.container-fluid.features .container .row');

            // Create a column div for the item
            const colDiv = document.createElement('div');
            colDiv.className = 'col-md-6 col-lg-6 col-xl-3';

            // Create a row div for the features item
            const featuresItemRowDiv = document.createElement('div');
            featuresItemRowDiv.className = 'row g-4 align-items-center features-item';

            // Create the image column
            const imageColDiv = document.createElement('div');
            imageColDiv.className = 'col-4';

            // Create the image element
            const imageElement = document.createElement('img');
            imageElement.src = latestItem.metadata.image_url;
            imageElement.classList.add('img-zoomin', 'img-fluid', 'rounded-circle', 'w-100');
            imageElement.alt = 'Image';

            // Create the content number span
            const contentNumberSpan = document.createElement('span');
            contentNumberSpan.className = 'rounded-circle border border-2 border-white bg-primary btn-sm-square text-white position-absolute';
            contentNumberSpan.style.top = '10%';
            contentNumberSpan.style.right = '-10px';
            contentNumberSpan.textContent = '3'; // Example number of content within a category

            // Append image and content number to image column
            imageColDiv.appendChild(imageElement);
            imageColDiv.appendChild(contentNumberSpan);

            // Create the content column
            const contentColDiv = document.createElement('div');
            contentColDiv.className = 'col-8 features-content d-flex flex-column';

            // Create the category paragraph
            const categoryParagraph = document.createElement('p');
            categoryParagraph.className = 'text-uppercase mb-2';
            categoryParagraph.textContent = latestItem.metadata.category;

            // Create the title link
            const titleLink = document.createElement('a');
            titleLink.className = 'h6';
            titleLink.href = '#';
            titleLink.textContent = latestItem.metadata.title;

            // Create the date small element
            const dateSmall = document.createElement('small');
            dateSmall.className = 'text-body d-block';
            dateSmall.innerHTML = `<i class="fas fa-calendar-alt me-1"></i> ${latestItem.metadata.date}`;

            // Append elements to content column
            contentColDiv.appendChild(categoryParagraph);
            contentColDiv.appendChild(titleLink);
            contentColDiv.appendChild(dateSmall);

            // Append image column and content column to features item row
            featuresItemRowDiv.appendChild(imageColDiv);
            featuresItemRowDiv.appendChild(contentColDiv);

            // Append features item row to column
            colDiv.appendChild(featuresItemRowDiv);

            // Append column to features container
            featuresContainer.appendChild(colDiv);
        }
    }
}
