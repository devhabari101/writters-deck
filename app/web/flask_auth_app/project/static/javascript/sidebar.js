export function createSidebar(categories, allMarkdowns) {
    const sidebarColumnDiv = document.createElement('div');
    sidebarColumnDiv.classList.add('col-md-4', 'col-lg-3', 'p-b-80');

    const sideMenuDiv = document.createElement('div');
    sideMenuDiv.classList.add('side-menu');

    // Archive Section (showing all posts)
    const archiveDiv = document.createElement('div');
    archiveDiv.classList.add('p-t-65');

    const archiveTitle = document.createElement('h4');
    archiveTitle.classList.add('mtext-112', 'cl2', 'p-b-33');
    archiveTitle.textContent = 'Archive';

    const archiveList = document.createElement('ul');

    // Group posts by year and month
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

    // Append other sections (like Search, Categories, and Popular posts)
    sideMenuDiv.appendChild(archiveDiv); // Add Archive section
    // Append Search, Categories, Popular Markdown sections here...
    sideMenuDiv.appendChild(searchDiv);
    sideMenuDiv.appendChild(categoriesDiv);
    sideMenuDiv.appendChild(popularMarkdownsDiv);
    sideMenuDiv.appendChild(archiveDiv);


    // Append sidebar to sidebar column
    sidebarColumnDiv.appendChild(sideMenuDiv);

    return sidebarColumnDiv;
}
