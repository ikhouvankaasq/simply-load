// --- Component Templates ---
// Elements have contenteditable="true" so users can change wording on the fly.
const templates = {
    hero: `
        <div class="hero-section">
            <h1 contenteditable="true">Design Simpler, Load Faster</h1>
            <p contenteditable="true">This is your awesome new website landing page built seamlessly with Simply Load.</p>
            <button contenteditable="true">Get Started Today</button>
        </div>`,
    features: `
        <div class="features-section">
            <div class="feature-card">
                <h3 contenteditable="true">Blazing Fast</h3>
                <p contenteditable="true">No bloated frameworks. Just clean HTML and highly optimized CSS layouts.</p>
            </div>
            <div class="feature-card">
                <h3 contenteditable="true">Responsive Design</h3>
                <p contenteditable="true">Looks stellar out of the box on mobile devices, tablets, and wide displays.</p>
            </div>
        </div>`,
    content: `
        <div class="content-section">
            <h2 contenteditable="true">Our Core Mission</h2>
            <p contenteditable="true">Write a compelling paragraph here about what your business or project stands for. Keep your visitors hooked with clear, concise wording that highlights your unique value proposition.</p>
        </div>`,
    footer: `
        <div class="footer-section">
            <p contenteditable="true">© 2026 Simply Load Builder Workspace. Built with pure code.</p>
        </div>`
};

// --- DOM References ---
const canvas = document.getElementById('canvas');
const draggables = document.querySelectorAll('.draggable-item');
const downloadSingleBtn = document.getElementById('download-single');
const downloadMultipleBtn = document.getElementById('download-multiple');

// --- Drag and Drop State Machine ---
let activeDraggedType = null;

draggables.forEach(item => {
    item.addEventListener('dragstart', () => {
        activeDraggedType = item.getAttribute('data-type');
    });
    item.addEventListener('dragend', () => {
        activeDraggedType = null;
    });
});

canvas.addEventListener('dragover', (e) => {
    e.preventDefault(); // Required to allow dropping
});

canvas.addEventListener('drop', (e) => {
    e.preventDefault();
    
    // Remove layout placeholder on first item drop
    const placeholder = canvas.querySelector('.canvas-placeholder');
    if (placeholder) placeholder.remove();

    if (activeDraggedType && templates[activeDraggedType]) {
        // Create a system wrapper for structural safety and deletion mechanics
        const wrapper = document.createElement('div');
        wrapper.className = 'dropped-component';
        wrapper.innerHTML = `
            <button class="delete-btn" onclick="this.parentElement.remove()">Delete</button>
            ${templates[activeDraggedType]}
        `;
        canvas.appendChild(wrapper);
    }
});

// --- Helper Functions to Extract & Clean Code ---
function getCleanCanvasHTML() {
    // Clone the canvas so we don't break the active editor screen
    const canvasClone = canvas.cloneNode(true);
    
    // Strip out all system builder utilities (delete keys, edit triggers)
    const deleteButtons = canvasClone.querySelectorAll('.delete-btn');
    deleteButtons.forEach(btn => btn.remove());
    
    const editableElements = canvasClone.querySelectorAll('[contenteditable]');
    editableElements.forEach(el => el.removeAttribute('contenteditable'));
    
    const components = canvasClone.querySelectorAll('.dropped-component');
    
    // Extract only raw component markup
    let finalHTML = '';
    components.forEach(comp => {
        finalHTML += comp.firstElementChild.outerHTML + '\n';
    });
    
    return finalHTML.trim();
}

// Automatically pulls CSS components from style.css for standalone building blocks
function getComponentStyles() {
    return `
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: system-ui, sans-serif; }
    .hero-section { padding: 60px 40px; text-align: center; background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%); color: #1e1e24; }
    .hero-section h1 { font-size: 2.5rem; margin-bottom: 15px; }
    .hero-section p { font-size: 1.2rem; margin-bottom: 25px; color: #555; }
    .hero-section button { background-color: #4f46e5; color: white; border: none; padding: 12px 24px; font-size: 1rem; border-radius: 5px; cursor: pointer; }
    .features-section { padding: 40px 20px; display: flex; gap: 20px; background: #ffffff; }
    .feature-card { flex: 1; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px; background: #fafafa; }
    .feature-card h3 { margin-bottom: 10px; color: #111; }
    .feature-card p { color: #666; font-size: 0.95rem; line-height: 1.5; }
    .content-section { padding: 40px; background: #ffffff; max-width: 700px; margin: 0 auto; }
    .content-section h2 { margin-bottom: 15px; color: #111; }
    .content-section p { color: #444; line-height: 1.6; font-size: 1.05rem; }
    .footer-section { padding: 30px; background: #111116; color: #9ca3af; text-align: center; font-size: 0.9rem; }
    `;
}

function triggerDownload(filename, textContent) {
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(textContent));
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}

// --- Download Event Listeners ---

// Choice A: Everything inline in one self-contained .html file
downloadSingleBtn.addEventListener('click', () => {
    const cleanHTML = getCleanCanvasHTML();
    if (!cleanHTML) return alert("Add elements to your canvas before exporting!");

    const styles = getComponentStyles();
    
    const fullDocument = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Exported via Simply Load</title>
    <style>
        ${styles}
    </style>
</head>
<body>
    ${cleanHTML}
</body>
</html>`;

    triggerDownload('index.html', fullDocument);
});

// Choice B: Modular development structure (Separate index.html and style.css files)
downloadMultipleBtn.addEventListener('click', () => {
    const cleanHTML = getCleanCanvasHTML();
    if (!cleanHTML) return alert("Add elements to your canvas before exporting!");

    const fullDocument = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Exported via Simply Load</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    ${cleanHTML}
</body>
</html>`;

    const styles = getComponentStyles();

    // Trigger both downloads sequentially
    triggerDownload('index.html', fullDocument);
    setTimeout(() => {
        triggerDownload('style.css', styles);
    }, 300);
});
