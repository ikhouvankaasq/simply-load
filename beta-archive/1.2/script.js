// --- Code Component Base Units ---
const templates = {
    navbar: `
        <div class="nav-block">
            <div class="nav-brand" contenteditable="true">MY LOGO</div>
            <div class="nav-menu">
                <a href="#" class="editor-link-target" contenteditable="true">HomeLink</a>
                <a href="#" class="editor-link-target" contenteditable="true">Dashboard</a>
            </div>
        </div>`,
    hero: `
        <div class="hero-block">
            <h1 class="heading-block" contenteditable="true">Spacious Structural Box</h1>
            <p class="para-block" contenteditable="true">You can drop additional paragraph tags, headings, or clickable actions directly below this row to assemble custom headers.</p>
        </div>`,
    heading: `<h2 class="heading-block" contenteditable="true">Standalone Section Title</h2>`,
    paragraph: `<p class="para-block" contenteditable="true">This is independent body text that adjusts inside its layout parent. Click here to adjust font-size or text coloring inside the sidebar properties module.</p>`,
    'link-btn': `<a href="#" class="btn-block editor-link-target" contenteditable="true">Action Button</a>`
};

// --- DOM References ---
const canvas = document.getElementById('canvas');
const draggables = document.querySelectorAll('.draggable-item');
const inspectorHint = document.getElementById('inspector-hint');
const inspectorControls = document.getElementById('inspector-controls');
const linkFieldGroup = document.getElementById('link-field-group');

// Control Inputs
const activeElementTag = document.getElementById('active-element-tag');
const propLink = document.getElementById('prop-link');
const propColor = document.getElementById('prop-color');
const propSize = document.getElementById('prop-size');

let activeDraggedType = null;
let selectedElement = null;

// --- Drag & Drop Core System ---
draggables.forEach(item => {
    item.addEventListener('dragstart', () => activeDraggedType = item.getAttribute('data-type'));
    item.addEventListener('dragend', () => activeDraggedType = null);
});

canvas.addEventListener('dragover', (e) => e.preventDefault());

canvas.addEventListener('drop', (e) => {
    e.preventDefault();
    const placeholder = canvas.querySelector('.canvas-placeholder');
    if (placeholder) placeholder.remove();

    if (activeDraggedType && templates[activeDraggedType]) {
        const wrapper = document.createElement('div');
        wrapper.className = 'dropped-component';
        wrapper.innerHTML = `
            <button class="delete-btn" onclick="this.parentElement.remove(); resetInspector();">✕</button>
            ${templates[activeDraggedType]}
        `;
        canvas.appendChild(wrapper);
    }
});

// --- Dynamic Visual Selection & Inspector Processing (Addresses Goals #2 & #3) ---
canvas.addEventListener('click', (e) => {
    // If user clicked the delete box or container canvas, bypass selection logic
    if (e.target.classList.contains('delete-btn') || e.target === canvas) return;
    
    // Prevent links from redirecting the browser tab while inside the canvas workspace
    if (e.target.tagName === 'A' || e.target.classList.contains('editor-link-target')) {
        e.preventDefault();
    }

    // Clean up preceding highlight markers
    if (selectedElement) {
        selectedElement.classList.remove('editor-selected');
    }

    // Target the specific active leaf element
    selectedElement = e.target;
    selectedElement.classList.add('editor-selected');

    // Display inspector engine
    inspectorHint.classList.add('hidden');
    inspectorControls.classList.remove('hidden');
    
    // Populate configurations based on target profiles
    activeElementTag.textContent = selectedElement.tagName.toLowerCase();

    // Check if element is a link or contains link components
    if (selectedElement.tagName === 'A' || selectedElement.classList.contains('editor-link-target')) {
        linkFieldGroup.classList.remove('hidden');
        // Reads standard href attribute or defaults to placeholder value
        propLink.value = selectedElement.getAttribute('href') || '#';
    } else {
        linkFieldGroup.classList.add('hidden');
    }

    // Capture existing inline or computed stylings to populate control panel fields
    const computedStyles = window.getComputedStyle(selectedElement);
    propSize.value = parseInt(computedStyles.fontSize) || 16;
    
    // Convert text RGB matrix colors into clean Hex notation formatting for input mapping
    propColor.value = rgbToHex(computedStyles.color) || '#000000';
});

function resetInspector() {
    selectedElement = null;
    inspectorControls.classList.add('hidden');
    inspectorHint.classList.remove('hidden');
}

// --- Live Control Listeners updating style maps ---
propLink.addEventListener('input', () => {
    if (selectedElement) {
        selectedElement.setAttribute('href', propLink.value);
    }
});

propColor.addEventListener('input', () => {
    if (selectedElement) {
        selectedElement.style.color = propColor.value;
    }
});

propSize.addEventListener('input', () => {
    if (selectedElement) {
        selectedElement.style.fontSize = propSize.value + 'px';
    }
});

// --- Formatting Cleanups & Helper Pipelines ---
function rgbToHex(rgb) {
    if (!rgb || rgb.indexOf('rgb') === -1) return '#000000';
    const rgbValues = rgb.match(/\d+/g);
    const r = parseInt(rgbValues[0]).toString(16).padStart(2, '0');
    const g = parseInt(rgbValues[1]).toString(16).padStart(2, '0');
    const b = parseInt(rgbValues[2]).toString(16).padStart(2, '0');
    return `#${r}${g}${b}`;
}

function getCleanCanvasHTML() {
    const canvasClone = canvas.cloneNode(true);
    
    // Purge builder structural components
    canvasClone.querySelectorAll('.delete-btn').forEach(btn => btn.remove());
    canvasClone.querySelectorAll('[contenteditable]').forEach(el => el.removeAttribute('contenteditable'));
    
    // Purge active highlights or specialized designer tracker tracking flags
    canvasClone.querySelectorAll('.editor-selected').forEach(el => el.classList.remove('editor-selected'));
    
    const wrappers = canvasClone.querySelectorAll('.dropped-component');
    let dynamicHTML = '';
    wrappers.forEach(wrap => {
        if(wrap.children.length > 0) {
            dynamicHTML += wrap.innerHTML.trim() + '\n';
        }
    });
    return dynamicHTML.trim();
}

function getProductionStyles() {
    return `
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: system-ui, sans-serif; }
    .nav-block { display: flex; justify-content: space-between; align-items: center; padding: 15px 20px; background: #fafafa; border-bottom: 1px solid #eee; }
    .nav-brand { font-weight: bold; }
    .nav-menu a { color: #4f46e5; text-decoration: none; margin-left: 15px; font-size: 0.9rem; }
    .hero-block { padding: 50px 30px; text-align: center; background: #f3f4f6; border-radius: 6px; }
    .heading-block { font-size: 2rem; font-weight: 800; margin-bottom: 10px; color: #111; }
    .para-block { font-size: 1rem; line-height: 1.6; color: #374151; margin-bottom: 8px; }
    .btn-block { display: inline-block; background: #6366f1; color: white; padding: 10px 20px; border-radius: 6px; text-decoration: none; font-weight: 500; text-align: center; }
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

// --- Distribution Event Pipelines ---
document.getElementById('download-single').addEventListener('click', () => {
    const htmlContent = getCleanCanvasHTML();
    if (!htmlContent) return alert("Canvas workspace is currently empty!");

    const outputDoc = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Exported App Workspace</title>
    <style>${getProductionStyles()}</style>
</head>
<body>
${htmlContent}
</body>
</html>`;
    triggerDownload('index.html', outputDoc);
});

document.getElementById('download-multiple').addEventListener('click', () => {
    const htmlContent = getCleanCanvasHTML();
    if (!htmlContent) return alert("Canvas workspace is currently empty!");

    const outputDoc = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Exported App Workspace</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
${htmlContent}
</body>
</html>`;

    triggerDownload('index.html', outputDoc);
    setTimeout(() => triggerDownload('style.css', getProductionStyles()), 250);
});
