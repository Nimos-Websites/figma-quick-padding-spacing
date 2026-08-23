"use strict";
// Show the UI
figma.showUI(__html__, { visible: true });
// Handle messages from the UI
figma.ui.onmessage = (msg) => {
    if (msg.type === "normalize") {
        const nodes = figma.currentPage.selection;
        if (nodes.length === 0) {
            figma.notify("No layers selected");
            return;
        }
        // Apply uniform padding and spacing to selected layers
        nodes.forEach((node) => {
            if ("paddingLeft" in node) {
                node.paddingLeft = msg.targetSpacing;
                node.paddingRight = msg.targetSpacing;
                node.paddingTop = msg.targetSpacing;
                node.paddingBottom = msg.targetSpacing;
            }
            if ("itemSpacing" in node) {
                node.itemSpacing = msg.targetSpacing;
            }
        });
        figma.notify(`Normalized padding and spacing to ${msg.targetSpacing}px`);
        figma.closePlugin();
    }
};
