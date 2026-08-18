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

let toastTimer = null;
let toastHideTimer = null;

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
    4. TOAST (FEEDBACK)
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
    5. EVENT HANDLERS
   ============================ */
function handleGenerateClick() {
    const size = getSelectedSize();
    const format = getSelectedFormat();
    const colors = generatePalette(size);
    renderPalette(colors, format);
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

/* ============================
    6. EVENT LISTENERS & INITIALIZATION
   ============================ */
generateBtn.addEventListener("click", handleGenerateClick);
paletteList.addEventListener("click", handlePaletteClick);

// Genera una paleta inicial al cargar la página
// handleGenerateClick();
