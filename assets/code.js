"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// code.ts
figma.showUI(__html__, { width: 360, height: 520 });
function traverse(node, fn) {
    fn(node);
    if ("children" in node) {
        for (const c of node.children)
            traverse(c, fn);
    }
}
function canResize(node) {
    return typeof node.resize === "function";
}
function scaleToSize(node, target) {
    const w = node.width;
    const h = node.height;
    if (w === 0 || h === 0)
        return;
    const scale = target / Math.max(w, h);
    if (canResize(node)) {
        node.resize(w * scale, h * scale);
        return;
    }
    // Fallback (rare): resize first resizable child
    if ("children" in node) {
        for (const child of node.children) {
            if (canResize(child)) {
                child.resize(child.width * scale, child.height * scale);
                break;
            }
        }
    }
}
function placeNearViewportCenter(node) {
    const vp = figma.viewport.center;
    node.x = vp.x - node.width / 2;
    node.y = vp.y - node.height / 2;
}
figma.ui.onmessage = (msg) => __awaiter(void 0, void 0, void 0, function* () {
    if (msg.type === "INSERT_ICON") {
        const { name, svg, size } = msg.payload;
        try {
            const created = figma.createNodeFromSvg(svg);
            created.name = name;
            // Normalize size (based on max(w, h))
            scaleToSize(created, size);
            // Ensure it is on the page
            if (!created.parent) {
                figma.currentPage.appendChild(created);
            }
            // Place and select
            placeNearViewportCenter(created);
            figma.currentPage.selection = [created];
            figma.viewport.scrollAndZoomIntoView([created]);
        }
        catch (e) {
            // UI feedback removed per request; see console if needed.
            console.error(e);
        }
    }
    else if (msg.type === "OPEN_EXTERNAL") {
        const { url } = msg.payload;
        figma.openExternal(url);
    }
});
