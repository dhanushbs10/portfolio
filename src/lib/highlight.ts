const CPP_KEYWORDS = new Set(
  ("alignas alignof and and_eq asm auto bitand bitor bool break case catch " +
    "char char8_t char16_t char32_t class compl concept const consteval constexpr " +
    "constinit const_cast continue co_await co_return co_yield decltype default delete do " +
    "double dynamic_cast else enum explicit export extern false float for friend goto if " +
    "inline int long mutable namespace new noexcept not not_eq nullptr operator or or_eq " +
    "private protected public register reinterpret_cast requires return short signed sizeof " +
    "static static_assert static_cast struct switch template this thread_local throw true " +
    "try typedef typeid typename union unsigned using virtual void volatile wchar_t while " +
    "xor xor_eq NULL TRUE FALSE").split(" ")
);

function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

const TOKEN_RE =
  /(\/\/[^\n]*|\/\*[\s\S]*?\*\/)|("(?:[^"\\\n]|\\.)*"|'(?:[^'\\\n]|\\.)*')|(&lt;[\w.]+&gt;)|(^\s*#[a-zA-Z]+\b)|\b(0[xX][0-9a-fA-F']+|\d[\w']*(?:\.\d+)?)\b|\b([A-Za-z_]\w*)(?=\s*\()|\b([A-Za-z_]\w*)\b/gm;

export function highlightCpp(src: string): string {
  return esc(src).replace(
    TOKEN_RE,
    (
      m: string,
      comment?: string,
      str?: string,
      angle?: string,
      pre?: string,
      num?: string,
      call?: string,
      word?: string
    ) => {
      if (comment) return `<span class="tok-c">${comment}</span>`;
      if (str) return `<span class="tok-s">${str}</span>`;
      if (angle) return `<span class="tok-s">${angle}</span>`;
      if (pre) return `<span class="tok-p">${pre}</span>`;
      if (num) return `<span class="tok-n">${num}</span>`;
      if (call) {
        if (CPP_KEYWORDS.has(call)) return `<span class="tok-k">${call}</span>`;
        return `<span class="tok-f">${call}</span>`;
      }
      if (word) {
        if (CPP_KEYWORDS.has(word)) return `<span class="tok-k">${word}</span>`;
        if (/^[A-Z]/.test(word)) return `<span class="tok-t">${word}</span>`;
      }
      return m;
    }
  );
}

const BASH_COMMENT_RE = /(#[^\n]*)/g;

export function highlightBash(src: string): string {
  return esc(src).replace(BASH_COMMENT_RE, `<span class="tok-c">$1</span>`);
}
