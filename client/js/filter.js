import Api from './api.js';

class Filter {
    constructor(dropdownMenuContainer) {
        this.dropdownMenuContainer = dropdownMenuContainer;
        
        this.dropdownMenuContainer.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', this.onCategorySelected);
        });
    }

    onCategorySelected(event) {
        // L'elemento HTML che e' stato cliccato
        const el = event.target;
        // La proprietà 'data-id' dell'elemento, ad esempio 'Tecnologia'
        const categoryType = el.dataset.id;
        if(categoryType === 'All') {
            Api.getAllPodcast().then(p => {
                document.dispatchEvent(new CustomEvent('category-selected', { detail: p }));
            });
        } else {
            Api.getAllPodcast().then(p => {
                p = p.filter(pod => pod.category.includes(categoryType));
                document.dispatchEvent(new CustomEvent('category-selected', { detail: p }));
            });
        }
    }

}

export default Filter;