// Quick script: strip hardcoded fills from icon SVGs so CSS color works
import { readFileSync, writeFileSync } from "fs";

const file = "src/lib/icons.ts";
let content = readFileSync(file, "utf-8");

// Replace fill="#XXXXXX" patterns in path elements with nothing,
// but keep the stroke/color styling handled via CSS currentColor
// Strategy: strip fill attributes from all SVG content
content = content.replace(/<path\s+fill="[^"]*"/g, '<path fill="currentColor"');

writeFileSync(file, content);
console.log("Done — all paths now use fill=\"currentColor\"");
