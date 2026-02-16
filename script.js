// --- Navigation Loader (Side Menu) ---
async function loadNavigation() {
    const navPlaceholder = document.getElementById('nav-placeholder');
    if (!navPlaceholder) return;

    try {
        const response = await fetch('nav.html');
        const navHtml = await response.text();
        navPlaceholder.innerHTML = navHtml;
        
        initSidebarLogic();
        initSearchLogic();
    } catch (err) {
        console.error("Error loading navigation:", err);
    }
}

function initSidebarLogic() {
    const parents = document.querySelectorAll('.has-children');
    parents.forEach(parent => {
        const link = parent.querySelector('a');
        const subNav = parent.querySelector('.sub-nav');
        
        if (link && subNav) {
            link.addEventListener('click', (e) => {
                e.preventDefault(); // Stop the link from navigating
                e.stopPropagation(); // Prevent event bubbling
                
                // Toggle the 'open' class on the sub-menu
                subNav.classList.toggle('open');
                
                // Toggle an 'active' class on the parent for rotation/styling
                parent.classList.toggle('active-parent');
            });
        }
    });
}

// --- ScrollSpy Logic ---
function initScrollSpy() {
    const scrollContainer = document.querySelector('.content-wrapper');
    // Finds the spans you added: ## <span id="regex"></span>
    const targets = document.querySelectorAll('article span[id]');
    const tocLinks = document.querySelectorAll('.toc a');

    if (!scrollContainer || targets.length === 0) return;

    const observerOptions = {
        root: scrollContainer,
        // This margin creates a "hit zone" near the top of the scroll container
        rootMargin: '-5% 0px -80% 0px',
        threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            // Only trigger when the span enters the top area
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                
                // Clear all active classes from TOC
                tocLinks.forEach(link => link.classList.remove('active'));
                
                // Find the link pointing to this ID and highlight it
                const activeLink = document.querySelector(`.toc a[href="#${id}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                }
            }
        });
    }, observerOptions);

    targets.forEach(t => observer.observe(t));
}

function copyDiscord(element) {
    const textToCopy = "@muzaroni";
    const textSpan = element.querySelector('.social-text');
    
    navigator.clipboard.writeText(textToCopy).then(() => {
        const originalText = textSpan.innerText;
        textSpan.innerText = "@muzaroni";
        textSpan.style.color = "var(--accent-color)";
        
        setTimeout(() => {
            textSpan.innerText = originalText;
            textSpan.style.color = "";
        }, 2000);
    });
}
// --- Initialization ---
window.addEventListener('DOMContentLoaded', () => {
    // 1. Load the sidebar nav
    loadNavigation();

    // 2. Start ScrollSpy for the TOC on the page
    // Using a tiny timeout ensures the browser has rendered the MD spans
    setTimeout(initScrollSpy, 200);

    // 3. Checklist Logic
    document.querySelectorAll('.checklist li').forEach(listItem => {
        listItem.addEventListener('click', function(e) {
            const checkbox = this.querySelector('input[type="checkbox"]');
            if (!checkbox) return;
            if (e.target !== checkbox) {
                checkbox.checked = !checkbox.checked;
            }
            this.classList.toggle('checked', checkbox.checked);
        });
    });
});

// --- Copy Code Logic ---
function copyCode(button) {
    const container = button.closest('.code-container');
    const codeBlock = container ? container.querySelector('code') : null;
    if (!codeBlock) return;
    navigator.clipboard.writeText(codeBlock.innerText).then(() => {
        const originalText = button.innerText;
        button.innerText = "COPIED!";
        setTimeout(() => button.innerText = originalText, 2000);
    });
}
// Add this to your script.js
const topBtn = document.getElementById('back-to-top');
if (topBtn) {
    topBtn.addEventListener('click', (e) => {
        e.preventDefault();
        document.querySelector('.content-wrapper').scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}