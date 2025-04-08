
const form = document.querySelector('.searchForm');

form.addEventListener('submit', handleSubmit);

async function handleSubmit(event) {
    event.preventDefault();
    const inputValue = document.querySelector('.searchInput').value;
    const searchQuery = inputValue.trim();
    
    if (!searchQuery) {
        alert('Please enter a search term');
        return;
    }

    const searchResults = document.querySelector('.js-search-results');
    // Clear the previous results
    searchResults.innerHTML = '';

    const spinner = document.querySelector('.js-spinner');
    spinner.classList.remove('hidden');
   
    try {
        const results = await searchWikipedia(searchQuery);
        spinner.classList.add('hidden');
        
        if (results.query.searchinfo.totalhits === 0) {
            alert('No results found. Try different keywords');
            return;
        }

        displayResults(results);
    } catch(err) {
        console.log(err);
        spinner.classList.add('hidden');
        alert('Failed to search Wikipedia');
    }
};

async function searchWikipedia(searchQuery) {
    const endpoint = `https://en.wikipedia.org/w/api.php?action=query&list=search&prop=info&inprop=url&utf8=&format=json&origin=*&srlimit=20&srsearch=${searchQuery}`;
    const response = await fetch(endpoint);
    if (!response.ok) {
        throw Error(response.statusText);
    }
    const json = await response.json();
    return json;
}

function displayResults(results) {
    const searchResults = document.querySelector('.js-search-results');

    results.query.search.forEach(result => {
        const url = `https://en.wikipedia.org/?curid=${result.pageid}`;

        // Append the search result to the DOM
        searchResults.insertAdjacentHTML(
            'beforeend',
            `<div class="p-4 mb-4 border border-slate-300 rounded-md bg-slate-50">
                <h3 class="text-xl font-bold mb-2">
                    <a href="${url}" target="_blank" rel="noopener" class="text-blue-600 hover:underline">${result.title}</a>
                </h3>
                <a href="${url}" class="text-green-600 text-sm mb-2 block" target="_blank" rel="noopener">${url}</a>
                <p class="text-slate-700">${result.snippet}</p>
            </div>`
        );
    });
}
