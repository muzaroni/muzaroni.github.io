// --- Navigation Loader ---
async function loadNavigation() {
    const navPlaceholder = document.getElementById('nav-placeholder');
    if (!navPlaceholder) return;

    try {
        const response = await fetch('nav.html');
        const navHtml = await response.text();
        navPlaceholder.innerHTML = navHtml;
        
        // Initialize sidebar and search AFTER the HTML is loaded
        initSidebarLogic();
        initSearchLogic();
    } catch (err) {
        console.error("Error loading navigation:", err);
    }
}

// --- Collapsible Sidebar Logic ---
function initSidebarLogic() {
    const parents = document.querySelectorAll('.has-children');
    parents.forEach(parent => {
        const link = parent.querySelector('a');
        const subNav = parent.querySelector('.sub-nav');
        link.addEventListener('click', (e) => {
            e.preventDefault();
            subNav.classList.toggle('open');
            parent.classList.toggle('active-parent');
        });
    });
}

// --- Search Functionality ---
function initSearchLogic() {
    const searchInput = document.getElementById('navSearch');
    const navItems = document.querySelectorAll('#navMenu > li');
    if (!searchInput) return;

    searchInput.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();
        navItems.forEach(item => {
            const text = item.textContent.toLowerCase();
            const isMatch = text.includes(term);
            item.classList.toggle('hidden', !isMatch);
            const subNav = item.querySelector('.sub-nav');
            if (subNav && term !== "") {
                if (isMatch) {
                    subNav.classList.add('open');
                    item.classList.add('active-parent');
                }
            }
        });
    });
}

// --- Initialize Everything ---
window.addEventListener('DOMContentLoaded', () => {
    loadNavigation();

    // ScrollSpy Logic
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            const id = entry.target.getAttribute('id');
            const tocLink = document.querySelector(`.toc li a[href="#${id}"]`);
            if (entry.isIntersecting) {
                document.querySelectorAll('.toc li a').forEach(l => l.classList.remove('active'));
                if (tocLink) tocLink.classList.add('active');
            }
        });
    }, { rootMargin: '-20% 0px -70% 0px' });

    document.querySelectorAll('article h2, article h3').forEach(s => observer.observe(s));

    // Checkbox Logic
    document.querySelectorAll('.checklist input[type="checkbox"]').forEach(cb => {
        cb.addEventListener('change', function() {
            this.parentElement.classList.toggle('checked', this.checked);
        });
    });
});
function copyCode(button) {
    const codeBlock = button.parentElement.nextElementSibling.querySelector('code');
    const text = codeBlock.innerText;

    navigator.clipboard.writeText(text).then(() => {
        button.innerText = "Copied!";
        setTimeout(() => {
            button.innerText = "Copy";
        }, 2000);
    });
}