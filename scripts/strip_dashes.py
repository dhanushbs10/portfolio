import sys, os, re
sys.stdout = open(sys.stdout.fileno(), mode='w', encoding='utf-8', buffering=1)

# Sweep every .ts/.tsx/.mdx/.md file in the repo for em/en dashes and replace.
# Default: -> ", " (reads as a comma-clause, the common em-dash use).
# We do NOT touch ASCII hyphen "-" (U+002D): those are structural (class names,
# slugs, filenames, operator). Only typographic dashes.
#
# Special handling we can do cheaply + safely with regex:
#   - "X —— Y" (double em) -> "X, Y"   (double often a hard break; comma fine)
#   - "X — Y"  (single em)  -> "X, Y"
#   - "X – Y"  (single en)  -> "X, Y"
#   - Range like "2008–2025" -> "2008 to 2025"  (en-dash numeric range)
#   - Prefix like "non‑breaking" (U+2011 non-breaking hyphen) -> "non-breaking"
# We also collapse double-space artifacts left behind (" ," -> ","), but only
# when the dash sat between spaces. We do the wholesale char swaps, then fix
# spacing around them.

ROOT = os.getcwd()
EXTS = (".ts", ".tsx", ".mdx", ".md")
EM = "—"   # —
EN = "–"   # –
EM2 = "——"
HORIZ = "―"  # ― horizontal bar
NBHYPHEN = "‑"  # ‑ non-breaking hyphen

targets = []
for dirpath, dirs, files in os.walk(ROOT):
    # skip noise dirs
    parts = dirpath.replace(ROOT, "").lstrip(os.sep).split(os.sep)
    if any(p in {"node_modules", ".next", ".git", "dist", "build"} for p in parts):
        continue
    for f in files:
        if f.endswith(EXTS):
            fp = os.path.join(dirpath, f)
            with open(fp, "r", encoding="utf-8") as fh:
                txt = fh.read()
            orig = txt
            # numeric/date ranges with en dash: "2008–2025" -> "2008 to 2025"
            txt = re.sub(r"(\d)" + EN + r"(\d)", r"\1 to \2", txt)
            # double em dash -> ", "
            txt = txt.replace(EM + EM, ", ")
            # single em -> ", "
            txt = txt.replace(EM, ", ")
            # en dash (remaining, not ranges) -> ", "
            txt = txt.replace(EN, ", ")
            # horizontal bar -> ", "
            txt = txt.replace(HORIZ, ", ")
            # non-breaking hyphen -> plain hyphen (structural, keep hyphen)
            txt = txt.replace(NBHYPHEN, "-")
            # tidy: a stray space before the comma (e.g. "word —word" ->
            # "word , word") becomes "word, word". Use [ ] (literal space),
            # NOT \s, so we never match a newline and eat line breaks.
            txt = re.sub(r"[ ],", ", ", txt)
            # collapse runs of literal spaces after a comma (e.g. "word,  word"
            # from a double-space artifact) -> single space. Crucially use
            # [ ]{2,}, NOT \s{2,}, so this does NOT join lines: ",\n  "
            # (comma + newline + indent) is formatting we must keep.
            txt = re.sub(r",[ ]{2,}", ", ", txt)
            # Refinement: "**Term**, Value" (a bold label then comma then the
            # description) reads best as "**Term**: Value" (a definition colon).
            # This is the single most common em-dash shape in the MDX writeups,
            # so it is worth a targeted second pass. Only matches a bold run at
            # line start (after "- " or nothing) followed by the comma.
            txt = re.sub(r"(?m)(^|\n[-*]\s)\*\*([^*]+?)\*\*, ", r"\1**\2**: ", txt)
            txt = re.sub(r"(?m)(^[-*]\s)\*\*([^*]+?)\*\*, ", r"\1**\2**: ", txt)
            if txt != orig:
                with open(fp, "w", encoding="utf-8") as fh:
                    fh.write(txt)
                targets.append(fp.replace(ROOT + os.sep, ""))

print("Files changed: %d" % len(targets))
for t in sorted(targets):
    print("  " + t)
print("=== DONE ===")
