const contentStorageKey = 'adminContentItems';

function loadContentItems() {
    const stored = localStorage.getItem(contentStorageKey);
    if (stored) {
        try {
            const parsed = JSON.parse(stored);
            if (Array.isArray(parsed)) {
                return parsed;
            }
        } catch (error) {
            // fall through to fallback
        }
    }

    const fallback = typeof defaultContentItems !== 'undefined' && Array.isArray(defaultContentItems)
        ? defaultContentItems
        : [];
    localStorage.setItem(contentStorageKey, JSON.stringify(fallback));
    return fallback;
}

function renderContentGrids() {
    const grids = document.querySelectorAll('[data-content-category]');
    if (!grids.length) {
        return;
    }

    const items = loadContentItems();

    grids.forEach(grid => {
        const category = grid.dataset.contentCategory;
        const emptyMessage = grid.parentElement.querySelector('[data-content-empty]');
        const filteredItems = items.filter(item => item.category === category || item.category === 'general');

        grid.innerHTML = '';

        if (!filteredItems.length) {
            if (emptyMessage) {
                emptyMessage.textContent = 'No curated content yet. Check back soon.';
                emptyMessage.style.display = 'block';
            }
            return;
        }

        if (emptyMessage) {
            emptyMessage.style.display = 'none';
        }

        filteredItems.forEach(item => {
            const card = document.createElement('div');
            card.className = 'card content-card';

            const cardContent = document.createElement('div');
            cardContent.className = 'card-content';

            const title = document.createElement('h3');
            title.textContent = item.title;

            const meta = document.createElement('div');
            meta.className = 'content-meta';

            const categoryTag = document.createElement('span');
            categoryTag.className = 'content-tag';
            categoryTag.textContent = formatCategory(item.category);

            const levelTag = document.createElement('span');
            levelTag.className = 'content-tag';
            levelTag.textContent = item.level;

            const durationTag = document.createElement('span');
            durationTag.className = 'content-tag';
            durationTag.textContent = item.duration;

            meta.append(categoryTag, levelTag, durationTag);

            const description = document.createElement('p');
            description.className = 'content-description';
            description.textContent = item.description;

            const actions = document.createElement('div');
            actions.className = 'content-actions';

                // Validate link protocol to avoid javascript: XSS vectors
                let linkNode = null;
                try {
                    const parsedUrl = new URL(item.link, window.location.origin);
                    if (parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:') {
                        const link = document.createElement('a');
                        link.className = 'btn btn-outline';
                        link.href = parsedUrl.href;
                        link.target = '_blank';
                        link.rel = 'noopener';
                        link.textContent = 'Open Resource';
                        linkNode = link;
                    }
                } catch (error) {
                    // invalid URL — leave linkNode null
                }

                if (linkNode) {
                    actions.appendChild(linkNode);
                } else {
                    const disabled = document.createElement('button');
                    disabled.className = 'btn btn-outline disabled';
                    disabled.disabled = true;
                    disabled.textContent = 'Invalid link';
                    actions.appendChild(disabled);
                }
            cardContent.append(title, meta, description, actions);
            card.appendChild(cardContent);
            grid.appendChild(card);
        });
    });
}

function formatCategory(category) {
    switch (category) {
        case 'webdev':
            return 'Web Development';
        case 'ai':
            return 'AI & ML';
        case 'career':
            return 'Career';
        default:
            return 'General';
    }
}

document.addEventListener('DOMContentLoaded', renderContentGrids);
