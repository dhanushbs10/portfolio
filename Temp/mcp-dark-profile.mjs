import { spawn } from "child_process";
import fs from "fs";
const proc = spawn("cmd", ["/c", "npx -y reactbits-dev-mcp-server"], { stdio: ["pipe", "pipe", "pipe"] });
let out="";
proc.stdout.on("data", d=> out+=d.toString());
const send = (obj)=> proc.stdin.write(JSON.stringify(obj)+"\n");
setTimeout(()=> send({ jsonrpc:"2.0", id:1, method:"initialize", params:{ protocolVersion:"2024-11-05", capabilities:{}, clientInfo:{name:"test", version:"1.0"} } }), 200);
setTimeout(()=> send({ jsonrpc:"2.0", id:2, method:"tools/list" }), 700);
let id=3;
["dark-veil","profile-card"].forEach((n,i)=> setTimeout(()=> send({ jsonrpc:"2.0", id:id++, method:"tools/call", params:{ name:"get_component", arguments:{ name:n } } }), 1200 + i*500));
setTimeout(()=> {
  fs.writeFileSync("C:/Users/Rohan/portfolio-v3/Temp/mcp-dark-profile-out.json", out);
  console.log(out.slice(0,12000));
  proc.kill();
}, 7000);
