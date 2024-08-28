// Extract query parameters from URL
const urlParams = new URLSearchParams(window.location.search);
const year = urlParams.get('year');
const month = urlParams.get('month');

fetch('markdown_output.json')
    .then(response => response.json())
    .then(data => {
        try {
            console.log('Fetched data for archive:', data); // Debugging: Log fetched data

            // Filter data based on query parameters
            const filteredData = data.filter(item => {
                const [itemDay, itemMonth, itemYear] = item.metadata.date.split('-');
                return itemYear === year && itemMonth === month;
            });

            console.log('Filtered data for archive:', filteredData); // Debugging: Log filtered data

            const archiveContentDiv = document.getElementById('archive-content');

            // Create new elements for the filtered data
            filteredData.forEach(item => {
                const itemDiv = document.createElement('div');
                itemDiv.classList.add('archive-item');

                const titleElement = document.createElement('h3');
                titleElement.textContent = item.metadata.title;

                const dateElement = document.createElement('p');
                const [day, month, year] = item.metadata.date.split('-');
                dateElement.textContent = `${day}-${month}-${year}`;

                itemDiv.appendChild(titleElement);
                itemDiv.appendChild(dateElement);

                archiveContentDiv.appendChild(itemDiv);
            });
        } catch (error) {
            console.error('Error processing archive data:', error);
        }
    })
    .catch(error => {
        console.error('Error fetching archive data:', error);
    });
