import { createSidebar } from './sidebar.js';

fetch('markdown_output.json')
    .then(response => response.json())
    .then(data => {
        try {
            console.log('Fetched data:', data);

            const parseDate = (dateString) => {
                const dateParts = dateString.split('-');
                if (dateParts.length === 3) {
                    const [day, month, year] = dateParts;
                    return new Date(`${year}-${month}-${day}`);
                } else {
                    console.error('Invalid date format:', dateString);
                    return new Date(dateString);
                }
            };

            data.sort((a, b) => parseDate(b.metadata.date) - parseDate(a.metadata.date));

            console.log('Sorted data:', data);

            const archiveContainer = document.getElementById('archive-container');
            const converter = new showdown.Converter();

            const archiveMap = new Map();
            data.forEach(markdown => {
                const [day, month, year] = markdown.metadata.date.split('-');
                const key = `${year}-${month}`;
                if (!archiveMap.has(key)) {
                    archiveMap.set(key, []);
                }
                archiveMap.get(key).push(markdown);
            });

            const sortedArchiveKeys = Array.from(archiveMap.keys()).sort((a, b) => new Date(b) - new Date(a));

            sortedArchiveKeys.forEach(key => {
                const posts = archiveMap.get(key);

                posts.forEach(post => {
                    const postDiv = document.createElement('div');
                    postDiv.classList.add('archive-item', 'col-sm-6', 'col-md-4', 'col-lg-3', 'p-b-35', 'isotope-item', 'women');

                    const blockDiv = document.createElement('div');
                    blockDiv.classList.add('block2');

                    const imgDiv = document.createElement('div');
                    imgDiv.classList.add('block2-pic', 'hov-img0');

                    const imageElement = document.createElement('img');
                    imageElement.src = post.metadata.image_url; // dynamic post image
                    imageElement.alt = 'IMG-PRODUCT';

                    imgDiv.appendChild(imageElement);
                    blockDiv.appendChild(imgDiv);

                    const textDiv = document.createElement('div');
                    textDiv.classList.add('block2-txt', 'flex-w', 'flex-t', 'p-t-14');

                    const textChildDiv1 = document.createElement('div');
                    textChildDiv1.classList.add('block2-txt-child1', 'flex-col-l');

                    const titleLink = document.createElement('a');
                    titleLink.href = 'product-detail.html'; // dynamic post link
                    titleLink.classList.add('stext-104', 'cl4', 'hov-cl1', 'trans-04', 'js-name-b2', 'p-b-6');
                    titleLink.textContent = post.metadata.title; // dynamic post title

                    const categorySpan = document.createElement('span');
                    categorySpan.classList.add('stext-105', 'cl3');
                    categorySpan.textContent = post.metadata.category; // dynamic post category

                    textChildDiv1.appendChild(titleLink);
                    textChildDiv1.appendChild(categorySpan);
                    textDiv.appendChild(textChildDiv1);

                    const textChildDiv2 = document.createElement('div');
                    textChildDiv2.classList.add('block2-txt-child2', 'flex-r', 'p-t-3');

                    const wishLink = document.createElement('a');
                    wishLink.href = '#';
                    wishLink.classList.add('btn-addwish-b2', 'dis-block', 'pos-relative', 'js-addwish-b2');

                    const iconHeart1 = document.createElement('img');
                    iconHeart1.classList.add('icon-heart1', 'dis-block', 'trans-04');
                    iconHeart1.src = 'images/icons/icon-heart-01.png';
                    iconHeart1.alt = 'ICON';

                    const iconHeart2 = document.createElement('img');
                    iconHeart2.classList.add('icon-heart2', 'dis-block', 'trans-04', 'ab-t-l');
                    iconHeart2.src = 'images/icons/icon-heart-02.png';
                    iconHeart2.alt = 'ICON';

                    wishLink.appendChild(iconHeart1);
                    wishLink.appendChild(iconHeart2);
                    textChildDiv2.appendChild(wishLink);

                    textDiv.appendChild(textChildDiv2);
                    blockDiv.appendChild(textDiv);
                    postDiv.appendChild(blockDiv);

                    archiveContainer.appendChild(postDiv);
                });
            });
        } catch (error) {
            console.error('Error processing data:', error);
        }
    })
    .catch(error => {
        console.error('Error fetching markdown data:', error);
    });
