export function createSidebar(categories, allMarkdowns) {
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
    popularMarkdownsDiv.classList.add('p-t-65');

    const popularMarkdownsTitle = document.createElement('h4');
    popularMarkdownsTitle.classList.add('mtext-112', 'cl2', 'p-b-33');
    popularMarkdownsTitle.textContent = 'Popular post';

    const popularMarkdownsList = document.createElement('ul');

    // Filter and sort popular posts by date
    const popularMarkdowns = allMarkdowns.filter(markdown => markdown.metadata.popular === "on");
    popularMarkdowns.sort((a, b) => new Date(b.metadata.date) - new Date(a.metadata.date));

    popularMarkdowns.forEach(markdown => {
        const listItem = document.createElement('li');
        listItem.classList.add('flex-w', 'flex-t', 'p-b-30');

        const linkWrapper = document.createElement('a');
        linkWrapper.href = markdown.metadata.link;
        linkWrapper.classList.add('wrao-pic-w', 'size-214', 'hov-ovelay1', 'm-r-20');

        const image = document.createElement('img');
        image.src = markdown.metadata.image_url;
        image.alt = 'PRODUCT';
        image.style.width = '100%'; // Ensure the image fits the container

        const titleWrapper = document.createElement('div');
        titleWrapper.classList.add('size-215', 'flex-col-t', 'p-t-8');

        const titleLink = document.createElement('a');
        titleLink.href = markdown.metadata.link;
        titleLink.classList.add('stext-116', 'cl8', 'hov-cl1', 'trans-04');
        titleLink.textContent = markdown.metadata.title;

        const categorySpan = document.createElement('span');
        categorySpan.classList.add('stext-116', 'cl6', 'p-t-20');
        categorySpan.textContent = markdown.metadata.category;

        linkWrapper.appendChild(image);
        titleWrapper.appendChild(titleLink);
        titleWrapper.appendChild(categorySpan);
        listItem.appendChild(linkWrapper);
        listItem.appendChild(titleWrapper);
        popularMarkdownsList.appendChild(listItem);
    });

    popularMarkdownsDiv.appendChild(popularMarkdownsTitle);
    popularMarkdownsDiv.appendChild(popularMarkdownsList);

    // Archive Section (showing all posts)
    const archiveDiv = document.createElement('div');
    archiveDiv.classList.add('p-t-65');

    const archiveTitle = document.createElement('h4');
    archiveTitle.classList.add('mtext-112', 'cl2', 'p-b-33');
    archiveTitle.textContent = 'Archive';

    const archiveList = document.createElement('ul');

    // Group posts by year and month using the full allMarkdowns array
    const archiveMap = new Map();
    allMarkdowns.forEach(markdown => {
        const [day, month, year] = markdown.metadata.date.split('-');
        const key = `${year}-${month}`;
        if (!archiveMap.has(key)) {
            archiveMap.set(key, []);
        }
        archiveMap.get(key).push(markdown);
    });

    // Sort the archive keys and display them
    const sortedArchiveKeys = Array.from(archiveMap.keys()).sort((a, b) => new Date(b) - new Date(a));
    sortedArchiveKeys.forEach(key => {
        const [year, month] = key.split('-');
        const monthName = new Date(year, month - 1).toLocaleString('default', { month: 'long' });
        const posts = archiveMap.get(key);
        const archiveItem = document.createElement('li');

        const archiveLink = document.createElement('a');
        archiveLink.href = '#'; // You might want to add a specific link here
        archiveLink.classList.add('dis-block', 'stext-115', 'cl6', 'hov-cl1', 'trans-04', 'p-tb-8', 'p-lr-4');
        archiveLink.textContent = `${monthName} ${year} (${posts.length})`;

        archiveItem.appendChild(archiveLink);
        archiveList.appendChild(archiveItem);
    });

    archiveDiv.appendChild(archiveTitle);
    archiveDiv.appendChild(archiveList);

    // Append sections to sidebar
    sideMenuDiv.appendChild(searchDiv);
    sideMenuDiv.appendChild(categoriesDiv);
    sideMenuDiv.appendChild(popularMarkdownsDiv);
    sideMenuDiv.appendChild(archiveDiv);

    // Append sidebar to sidebar column
    sidebarColumnDiv.appendChild(sideMenuDiv);

    return sidebarColumnDiv;
}
