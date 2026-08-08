const data = require('./tmp_svgs.json');

const TOOLS = [
  { name: 'React',      slug: 'react',      url: 'https://react.dev' },
  { name: 'Next.js',    slug: 'nextdotjs',  url: 'https://nextjs.org' },
  { name: 'Tailwind CSS',slug:'tailwindcss', url: 'https://tailwindcss.com' },
  { name: 'Node.js',    slug: 'nodedotjs',  url: 'https://nodejs.org' },
  { name: 'Git',        slug: 'git',        url: 'https://git-scm.com' },
  { name: 'GitHub',     slug: 'github',     url: 'https://github.com' },
  { name: 'TypeScript', slug: 'typescript', url: 'https://www.typescriptlang.org' },
  { name: 'Python',     slug: 'python',     url: 'https://www.python.org' },
  { name: 'JavaScript', slug: 'javascript', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript' },
  { name: 'HTML',       slug: 'html5',      url: 'https://developer.mozilla.org/en-US/docs/Web/HTML' },
  { name: 'CSS',        slug: 'css',        url: 'https://developer.mozilla.org/en-US/docs/Web/CSS' },
  { name: 'C',          slug: 'c',          url: 'https://en.wikipedia.org/wiki/C_(programming_language)' },
  { name: 'Linux',      slug: 'linux',      url: 'https://www.linux.org' },
  { name: 'Kali Linux', slug: 'kalilinux',  url: 'https://www.kali.org' },
  { name: 'Ubuntu',     slug: 'ubuntu',     url: 'https://ubuntu.com' },
  { name: 'Wireshark',  slug: 'wireshark',  url: 'https://www.wireshark.org' },
  { name: 'Burp Suite', slug: 'burpsuite',  url: 'https://portswigger.net/burp' },
  { name: 'Metasploit', slug: 'metasploit', url: 'https://www.metasploit.com' },
];

const results = [];
for (const t of TOOLS) {
  const raw = data[t.slug];
  if (!raw || !raw.includes('<svg')) continue;
  const fillMatch = raw.match(/fill="([^"]+)"/);
  const fill = fillMatch ? fillMatch[1] : 'currentColor';
  const inner = raw.replace(/<svg[^>]*>/, '').replace(/<\/svg>/, '').trim();
  // Double-escape for TS template literal
  const escaped = inner.replace(/\\/g, '\\\\').replace(/\n/g, '\\n');
  results.push({ name: t.name, slug: t.slug, url: t.url, fill, inner: escaped });
}

console.log(JSON.stringify(results, null, 2));
