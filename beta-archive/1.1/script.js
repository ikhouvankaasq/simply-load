// --- Atomically Mapped Component Templates ---
const templates = {
    // Structural Components
    navbar: `
        <nav class="nav-section">
            <div class="nav-logo" contenteditable="true">BRAND</div>
            <div class="nav-links">
                <a href="#" contenteditable="true">Features</a>
                <a href="#" contenteditable="true">Pricing</a>
                <a href="#" contenteditable="true">Contact</a>
            </div>
        </nav>`,
    hero: `
        <div class="hero-section">
            <h1 contenteditable="true">Spacious Layout Box</h1>
            <p contenteditable="true">Drop additional individual elements below this structure to grow your project section by section.</p>
        </div>`,
    footer: `
        <div class="footer-section">
            <p contenteditable="true">© 2026 Simply Load Builder Workspace. All rights reserved.</p>
        </div>`,

    // Granular Pieces (Atomic)
    heading: `
        <h2 class="el-heading" contenteditable="true">Dynamic Custom Heading</h2>`,
    paragraph: `
        <p class="el-paragraph" contenteditable="true">This is an isolated text block. You can write your own descriptions, product copy, or documentation segments completely from scratch without restrictions.</p>`,
    button: `
        <div class="el-button-wrap">
            <button class="el-button" contenteditable="true">Action Trigger</button>
        </div>`,
    image: `
        <div class="el-image-wrap">
            <img class="el-image" src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=60" alt="Placeholder Graphic">
        </div>`
};

// --- DOM Target Engine ---
const canvas = document.getElementById('canvas');
const draggables = document.querySelectorAll('.draggable-item');
const downloadSingleBtn = document.getElementById('download-single');
const downloadMultipleBtn = document.getElementById('download-multiple');

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
    e.preventDefault();
});

canvas.addEventListener('drop', (e) => {
    e.preventDefault();
    
    const placeholder = canvas.querySelector('.canvas-placeholder');
    if (placeholder) placeholder.remove();

    if (activeDraggedType && templates[activeDraggedType]) {
        const wrapper = document.createElement('div');
        wrapper.className = 'dropped-component';
        wrapper.innerHTML = `
            <button class="delete-btn" onclick="this.parentElement.remove()">Remove</button>
            ${templates[activeDraggedType]}
        `;
        canvas.appendChild(wrapper);
    }
});

// --- Export Optimization Logic ---
function getCleanCanvasHTML() {
    const canvasClone = canvas.cloneNode(true);
    
    // Scrub control elements out of the clean markup string
    const deleteButtons = canvasClone.querySelectorAll('.delete-btn');
    deleteButtons.forEach(btn => btn.remove());
    
    const editableElements = canvasClone.querySelectorAll('[contenteditable]');
    editableElements.forEach(el => el.removeAttribute('contenteditable'));
    
    const components = canvasClone.querySelectorAll('.dropped-component');
    
    let finalHTML = '';
    components.forEach(comp => {
        finalHTML += comp.firstElementChild.outerHTML + '\n';
    });
    
    return finalHTML.trim();
}

// Consolidates structural & granular styling declarations for production distributions
function getComponentStyles() {
    return `
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: system-ui, -apple-system, sans-serif; }
    .nav-section { display: flex; justify-content: space-between; align-items: center; padding: 20px 40px; background: #ffffff; border-bottom: 1px solid #eaeaea; }
    .nav-logo { font-weight: bold; font-size: 1.2rem; color: #111; }
    .nav-links a { text-decoration: none; color: #555; margin-left: 20px; font-size: 0.95rem; }
    .hero-section { padding: 80px 40px; text-align: center; background: linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%); color: #1e1e24; }
    .footer-section { padding: 30px; background: #111116; color: #9ca3af; text-align: center; font-size: 0.9rem; }
    .el-heading { padding: 15px 40px 5px 40px; color: #111116; font-size: 2rem; font-weight: 700; }
    .el-paragraph { padding: 10px 40px; color: #4b5563; font-size: 1.05rem; line-height: 1.6; }
    .el-button-wrap { padding: 15px 40px; }
    .el-button { background-color: #4f46e5; color: white; border: none; padding: 12px 28px; font-size: 1rem; border-radius: 6px; cursor: pointer; font-weight: 500; }
    .el-image-wrap { padding: 20px 40px; text-align: center; }
    .el-image { max-width: 100%; height: auto; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
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

// --- Trigger Exporters ---
downloadSingleBtn.addEventListener('click', () => {
    const cleanHTML = getCleanCanvasHTML();
    if (!cleanHTML) return alert("Drag items onto your layout workspace first!");

    const fullDocument = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Tailored App Architecture</title>
    <style>${getComponentStyles()}</style>
</head>
<body>
${cleanHTML}
</body>
</html>`;

    triggerDownload('index.html', fullDocument);
});

downloadMultipleBtn.addEventListener('click', () => {
    const cleanHTML = getCleanCanvasHTML();
    if (!cleanHTML) return alert("Drag items onto your layout workspace first!");

    const fullDocument = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Custom Decoupled Document</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
${cleanHTML}
</body>
</html>`;

    triggerDownload('index.html', fullDocument);
    setTimeout(() => {
        triggerDownload('style.css', getComponentStyles());
    }, 300);
});
