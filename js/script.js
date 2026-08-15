function generarColorHSL() {
    const h = Math.floor(Math.random() * 360); // 0 a 359
    const s = Math.floor(Math.random() * 61) + 40; // 40 a 100
    const l = Math.floor(Math.random() * 56) + 25; // 25 a 80

    return { h: h, s: s, l: l };
}

function hslToHex(h, s, l) {
    // 1. Convertir S y L de porcentaje (0-100) a decimal (0-1)
    s = s / 100;
    l = l / 100;

    // 2. Calcular los valores auxiliares C, X, m
    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    const m = l - c / 2;

    // 3. Determinar R', G', B' según el sector de 60° donde cae H
    let r1, g1, b1;

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

    // 4. Sumar m y llevar a escala 0-255, redondeando
    const r = Math.round((r1 + m) * 255);
    const g = Math.round((g1 + m) * 255);
    const b = Math.round((b1 + m) * 255);

    // 5. Convertir cada canal a hexadecimal de 2 dígitos
    const rHex = r.toString(16).padStart(2, "0");
    const gHex = g.toString(16).padStart(2, "0");
    const bHex = b.toString(16).padStart(2, "0");

    // 6. Armar el string final
    return "#" + rHex + gHex + bHex;
}

function generarColor() {
    const colorHSL = generarColorHSL();
    const hex = hslToHex(colorHSL.h, colorHSL.s, colorHSL.l);

    return {
        h: colorHSL.h,
        s: colorHSL.s,
        l: colorHSL.l,
        hex: hex,
    };
}
