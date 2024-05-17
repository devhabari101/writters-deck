// sidebar.js

// Function to create the sidebar
export function createSidebar(categories) {
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

    // Append search bar and categories to sidebar
    sideMenuDiv.appendChild(searchDiv);
    sideMenuDiv.appendChild(categoriesDiv);

    // Add sidebar to sidebar column
    sidebarColumnDiv.appendChild(sideMenuDiv);

    return sidebarColumnDiv;
}
