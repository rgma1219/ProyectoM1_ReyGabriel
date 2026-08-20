/* ============================
    1. COLOR LOGIC (GENERATION & CONVERSION)
   ============================ */
function generateHSLColor() {
    const h = Math.floor(Math.random() * 360);
    const s = Math.floor(Math.random() * 61) + 40; // 40% - 100%
    const l = Math.floor(Math.random() * 56) + 25; // 25% - 80%

    return { h, s, l };
}

function hslToHex(h, s, l) {
    const sNorm = s / 100;
    const lNorm = l / 100;

    const c = (1 - Math.abs(2 * lNorm - 1)) * sNorm;
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    const m = lNorm - c / 2;

    let r1 = 0,
        g1 = 0,
        b1 = 0;

    if (h >= 0 && h < 60) {
        r1 = c;
        g1 = x;
        b1 = 0;
    } else if (h >= 60 && h < 120) {
        r1 = x;
        g1 = c;
        b1 = 0;
    } else if (h >= 120 && h < 180) {
        r1 = 0;
        g1 = c;
        b1 = x;
    } else if (h >= 180 && h < 240) {
        r1 = 0;
        g1 = x;
        b1 = c;
    } else if (h >= 240 && h < 300) {
        r1 = x;
        g1 = 0;
        b1 = c;
    } else {
        r1 = c;
        g1 = 0;
        b1 = x;
    }

    const r = Math.round((r1 + m) * 255)
        .toString(16)
        .padStart(2, "0");
    const g = Math.round((g1 + m) * 255)
        .toString(16)
        .padStart(2, "0");
    const b = Math.round((b1 + m) * 255)
        .toString(16)
        .padStart(2, "0");

    return `#${r}${g}${b}`;
}

function generateColor() {
    const hsl = generateHSLColor();
    const hex = hslToHex(hsl.h, hsl.s, hsl.l);

    return { ...hsl, hex };
}

/* ============================
    2. DOM REFERENCES
   ============================ */
const paletteList = document.getElementById("palette-list");
const generateBtn = document.getElementById("generate-btn");
const toast = document.getElementById("toast");
const paletteInstruction = document.getElementById("palette-instruction");
const saveBtn = document.getElementById("save-btn");
const historyList = document.getElementById("history-list");
const historyInstruction = document.getElementById("history-instruction");

let currentPalette = null; // { colors: [...], format: "hsl" | "hex" }
let toastTimer = null;
let toastHideTimer = null;

const HISTORY_KEY = "colorfly-history";
const HISTORY_LIMIT = 10;

/* ============================
    3. PALETTE LOGIC & RENDER
   ============================ */
function getSelectedSize() {
    const selectedOption = document.querySelector(
        'input[name="palette-size"]:checked',
    );
    return selectedOption ? Number(selectedOption.value) : 6;
}

function getSelectedFormat() {
    const selectedOptionFormat = document.querySelector(
        'input[name="color-format"]:checked',
    );
    return selectedOptionFormat ? selectedOptionFormat.value : "hsl";
}

function generatePalette(size) {
    return Array.from({ length: size }, () => generateColor());
}

function renderPalette(colors, format) {
    if (paletteInstruction) {
        paletteInstruction.hidden = true;
    }

    paletteList.innerHTML = "";

    colors.forEach((color, index) => {
        const li = document.createElement("li");
        li.className = "color-item";

        const swatch = document.createElement("button");
        swatch.className = "swatch";
        swatch.style.backgroundColor = color.hex;
        swatch.setAttribute(
            "aria-label",
            `Copiar código del color ${index + 1}`,
        );

        if (format === "hsl") {
            swatch.dataset.colorData = `hsl(${color.h}, ${color.s}%, ${color.l}%)`;
        } else {
            swatch.dataset.colorData = color.hex;
        }

        const hexText = document.createElement("p");
        hexText.className = "code-text";
        hexText.textContent = color.hex;

        const hslText = document.createElement("p");
        hslText.className = "code-text";
        hslText.textContent = `hsl(${color.h}, ${color.s}%, ${color.l}%)`;

        li.appendChild(swatch);
        if (format === "hsl") {
            li.appendChild(hslText);
        } else {
            li.appendChild(hexText);
        }

        paletteList.appendChild(li);
    });
}

/* ============================
    4. HISTORY LOGIC & STORAGE
   ============================ */
function getHistory() {
    try {
        const raw = localStorage.getItem(HISTORY_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch (error) {
        console.error("Error al leer el historial:", error);
        return [];
    }
}

function saveHistory(history) {
    try {
        localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
        return true;
    } catch (error) {
        console.error("Error al guardar el historial:", error);
        return false;
    }
}

function savePaletteToHistory(palette) {
    try {
        const history = getHistory();
        const newEntry = {
            id: crypto.randomUUID(),
            colors: palette.colors,
            format: palette.format,
        };
        const updatedHistory = [newEntry, ...history].slice(0, HISTORY_LIMIT);

        const success = saveHistory(updatedHistory);
        renderHistory(updatedHistory);
        showToast(success ? "Paleta guardada" : "No se pudo guardar la paleta");
    } catch (error) {
        console.error("Error al guardar la paleta:", error);
        showToast("No se pudo guardar la paleta");
    }
}

function deletePaletteFromHistory(id) {
    const history = getHistory();
    const updatedHistory = history.filter((entry) => entry.id !== id);

    const success = saveHistory(updatedHistory);
    renderHistory(updatedHistory);
    showToast(success ? "Paleta eliminada" : "No se pudo eliminar la paleta");
}

function restorePaletteFromHistory(id) {
    const history = getHistory();
    const entry = history.find((item) => item.id === id);
    if (!entry) return;

    currentPalette = { colors: entry.colors, format: entry.format };
    renderPalette(entry.colors, entry.format);
    saveBtn.hidden = false;
    showToast("Paleta restaurada");
}

function renderHistory(history) {
    historyList.innerHTML = "";

    if (history.length === 0) {
        historyInstruction.hidden = false;
        return;
    }
    historyInstruction.hidden = true;

    history.forEach((entry) => {
        const li = document.createElement("li");
        li.className = "history-item";

        const restoreBtn = document.createElement("button");
        restoreBtn.type = "button";
        restoreBtn.className = "history-restore-btn";
        restoreBtn.dataset.action = "restore";
        restoreBtn.dataset.id = entry.id;
        restoreBtn.setAttribute(
            "aria-label",
            `Restaurar paleta de ${entry.colors.length} colores`,
        );

        entry.colors.forEach((color) => {
            const miniSwatch = document.createElement("span");
            miniSwatch.className = "mini-swatch";
            miniSwatch.style.backgroundColor = color.hex;
            miniSwatch.setAttribute("aria-hidden", "true");
            restoreBtn.appendChild(miniSwatch);
        });

        const deleteBtn = document.createElement("button");
        deleteBtn.type = "button";
        deleteBtn.className = "history-delete-btn";
        deleteBtn.dataset.action = "delete";
        deleteBtn.dataset.id = entry.id;
        deleteBtn.setAttribute(
            "aria-label",
            `Eliminar paleta de ${entry.colors.length} colores`,
        );
        deleteBtn.innerHTML = `<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path fill="currentColor" d="M9 3v1H4v2h1v13a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V6h1V4h-5V3H9zm2 5h2v9h-2V8zm-4 0h2v9H7V8zm8 0h2v9h-2V8z"/></svg>`;

        li.appendChild(restoreBtn);
        li.appendChild(deleteBtn);
        historyList.appendChild(li);
    });
}

/* ============================
    5. TOAST (FEEDBACK)
   ============================ */
function showToast(message) {
    clearTimeout(toastTimer);
    clearTimeout(toastHideTimer);

    toast.textContent = message;
    toast.hidden = false;
    toast.classList.add("visible");

    toastTimer = setTimeout(() => {
        toast.classList.remove("visible");
        toastHideTimer = setTimeout(() => {
            toast.hidden = true;
        }, 250);
    }, 2000);
}

/* ============================
    6. EVENT HANDLERS
   ============================ */
function handleGenerateClick() {
    const size = getSelectedSize();
    const format = getSelectedFormat();
    const colors = generatePalette(size);
    currentPalette = { colors, format };

    renderPalette(colors, format);
    saveBtn.hidden = false;
}

async function handlePaletteClick(event) {
    const swatch = event.target.closest(".swatch");
    if (!swatch) return;

    const dataColor = swatch.dataset.colorData;

    try {
        await navigator.clipboard.writeText(dataColor);
        showToast(`${dataColor} copiado al portapapeles`);
    } catch (error) {
        showToast("No se pudo copiar el color");
        console.error("Error al copiar:", error);
    }
}

function handleSaveClick() {
    if (!currentPalette) return;
    savePaletteToHistory(currentPalette);
}

function handleHistoryClick(event) {
    const button = event.target.closest("button");
    if (!button) return;

    const { action, id } = button.dataset;

    if (action === "restore") {
        restorePaletteFromHistory(id);
    } else if (action === "delete") {
        deletePaletteFromHistory(id);
    }
}

/* ============================
    7. EVENT LISTENERS & INITIALIZATION
   ============================ */
generateBtn.addEventListener("click", handleGenerateClick);
paletteList.addEventListener("click", handlePaletteClick);
saveBtn.addEventListener("click", handleSaveClick);
historyList.addEventListener("click", handleHistoryClick);

// Carga el historial guardado en localStorage al iniciar la página
renderHistory(getHistory());
