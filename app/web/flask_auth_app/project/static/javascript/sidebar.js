export function createSidebar(categories, popularMarkdowns) {
    const sidebarColumnDiv = document.createElement('div');
    sidebarColumnDiv.classList.add('col-md-4', 'col-lg-3', 'p-b-80');

    const sideMenuDiv = document.createElement('div');
    sideMenuDiv.classList.add('side-menu');

    // Search bar
    const searchDiv = document.createElement('div');
    searchDiv.classList.add('bor17', 'of-hidden', 'pos-relative');

    const searchInput = document.createElement('input');
    searchInput.classList.add('stext-103', 'cl2', 'plh4', 'size-116', 'p-l-28', 'p-r-55');
    searchInput.type = 'text';
    searchInput.name = 'search';
    searchInput.placeholder = 'Search';

    const searchButton = document.createElement('button');
    searchButton.classList.add('flex-c-m', 'size-122', 'ab-t-r', 'fs-18', 'cl4', 'hov-cl1', 'trans-04');
    searchButton.innerHTML = '<i class="zmdi zmdi-search"></i>';

    searchDiv.appendChild(searchInput);
    searchDiv.appendChild(searchButton);

    // Categories
    const categoriesDiv = document.createElement('div');
    categoriesDiv.classList.add('p-t-55');

    const categoriesTitle = document.createElement('h4');
    categoriesTitle.classList.add('mtext-112', 'cl2', 'p-b-33');
    categoriesTitle.textContent = 'Categories';

    const categoriesList = document.createElement('ul');

    categories.forEach(category => {
        const listItem = document.createElement('li');
        listItem.classList.add('bor18');

        const categoryLink = document.createElement('a');
        categoryLink.href = '#';
        categoryLink.classList.add('dis-block', 'stext-115', 'cl6', 'hov-cl1', 'trans-04', 'p-tb-8', 'p-lr-4');
        categoryLink.textContent = category;

        listItem.appendChild(categoryLink);
        categoriesList.appendChild(listItem);
    });

    categoriesDiv.appendChild(categoriesTitle);
    categoriesDiv.appendChild(categoriesList);

    // Popular markdowns
    const popularMarkdownsDiv = document.createElement('div');
    popularMarkdownsDiv.classList.add('p-t-55');

    const popularMarkdownsTitle = document.createElement('h4');
    popularMarkdownsTitle.classList.add('mtext-112', 'cl2', 'p-b-33');
    popularMarkdownsTitle.textContent = 'Popular Markdowns';

    const popularMarkdownsList = document.createElement('ul');

    popularMarkdowns.forEach(markdown => {
        const listItem = document.createElement('li');
        listItem.classList.add('flex-w', 'flex-t', 'p-b-30');

        const linkWrapper = document.createElement('a');
        linkWrapper.href = markdown.metadata.link;
        linkWrapper.classList.add('wrao-pic-w', 'size-214', 'hov-ovelay1', 'm-r-20');

        const image = document.createElement('img');
        image.src = markdown.metadata.image_url;
        image.alt = 'PRODUCT';
        image.classList.add('img-fluid'); // Add Bootstrap class for responsive images

        const titleWrapper = document.createElement('div');
        titleWrapper.classList.add('size-215', 'flex-col-t', 'p-t-8');

        const titleLink = document.createElement('a');
        titleLink.href = markdown.metadata.link;
        titleLink.classList.add('stext-116', 'cl8', 'hov-cl1', 'trans-04');
        titleLink.textContent = markdown.metadata.title;

        linkWrapper.appendChild(image);
        titleWrapper.appendChild(titleLink);
        listItem.appendChild(linkWrapper);
        listItem.appendChild(titleWrapper);
        popularMarkdownsList.appendChild(listItem);
    });

    popularMarkdownsDiv.appendChild(popularMarkdownsTitle);
    popularMarkdownsDiv.appendChild(popularMarkdownsList);

    // Append search bar, categories, and popular markdowns to sidebar
    sideMenuDiv.appendChild(searchDiv);
    sideMenuDiv.appendChild(categoriesDiv);
    sideMenuDiv.appendChild(popularMarkdownsDiv);

    // Append sidebar to sidebar column
    sidebarColumnDiv.appendChild(sideMenuDiv);

    return sidebarColumnDiv;
}
