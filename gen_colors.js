const data = require('./tmp_svgs.json');

const TOOLS = [
  { name: 'React',       slug: 'react',      url: 'https://react.dev', color: '#61DAFB' },
  { name: 'Next.js',     slug: 'nextdotjs',  url: 'https://nextjs.org', color: '#FFFFFF' },
  { name: 'Tailwind CSS',slug: 'tailwindcss', url: 'https://tailwindcss.com', color: '#06B6D4' },
  { name: 'Node.js',     slug: 'nodedotjs',  url: 'https://nodejs.org', color: '#5FA04E' },
  { name: 'Git',         slug: 'git',        url: 'https://git-scm.com', color: '#F03C2E' },
  { name: 'GitHub',      slug: 'github',     url: 'https://github.com', color: '#FFFFFF' },
  { name: 'TypeScript',  slug: 'typescript', url: 'https://www.typescriptlang.org', color: '#3178C6' },
  { name: 'Python',      slug: 'python',     url: 'https://www.python.org', color: '#3776AB' },
  { name: 'JavaScript',  slug: 'javascript', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript', color: '#F7DF1E' },
  { name: 'HTML',        slug: 'html5',      url: 'https://developer.mozilla.org/en-US/docs/Web/HTML', color: '#E34F26' },
  { name: 'CSS',         slug: 'css',        url: 'https://developer.mozilla.org/en-US/docs/Web/CSS', color: '#663399' },
  { name: 'C',           slug: 'c',          url: 'https://en.wikipedia.org/wiki/C_(programming_language)', color: '#A8B9CC' },
  { name: 'Linux',       slug: 'linux',      url: 'https://www.linux.org', color: '#FCC624' },
  { name: 'Kali Linux',  slug: 'kalilinux',  url: 'https://www.kali.org', color: '#557C94' },
  { name: 'Ubuntu',      slug: 'ubuntu',     url: 'https://ubuntu.com', color: '#E95420' },
  { name: 'Wireshark',   slug: 'wireshark',  url: 'https://www.wireshark.org', color: '#1679A7' },
  { name: 'Burp Suite',  slug: 'burpsuite',  url: 'https://portswigger.net/burp', color: '#FF6633' },
  { name: 'Metasploit',  slug: 'metasploit', url: 'https://www.metasploit.com', color: '#2596CD' },
  { name: 'Windows',     slug: 'windows',    url: 'https://www.microsoft.com/windows' },
  { name: 'Nmap',        slug: 'nmap',       url: 'https://nmap.org' },
];

const NO_ICON = { windows: true, nmap: true };

function esc(s) {
  return s.replace(/\\/g, '\\\\').replace(/\n/g, '\\n');
}

for (const t of TOOLS) {
  if (NO_ICON[t.slug]) {
    console.log('  ' + t.name + ': null /* no icon */');
    continue;
  }
  let raw = data[t.slug];
  let inner = raw.replace(/<svg[^>]*>/, '').replace(/<\/svg>/, '').trim();
  inner = inner.replace(/fill="#[^"]*"/g, 'fill="currentColor"');
  const color = t.color || '#E8E8E8';
  console.log('  ' + t.name + ': { color: \\'#' + color + '\\', inner: \\'' + esc(inner) + '\\' },');
}
