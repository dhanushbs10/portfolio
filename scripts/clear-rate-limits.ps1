Add-Type @'
using System;
using System.Runtime.InteropServices;
using System.Text;
[StructLayout(LayoutKind.Sequential, CharSet = CharSet.Unicode)]
public struct CRED2 { public int Flags; public int Type; public string TargetName; public string Comment; public System.Runtime.InteropServices.ComTypes.FILETIME LastWritten; public int CredentialBlobSize; public IntPtr CredentialBlob; public int Persist; public int AttributeCount; public IntPtr Attributes; public string TargetAlias; public string UserName; }
public static class Vault2 {
    [DllImport("advapi32.dll", EntryPoint = "CredReadW", CharSet = CharSet.Unicode, SetLastError = true)] private static extern bool NativeCredRead(string target, int type, int reservedFlag, out IntPtr credPtr);
    [DllImport("advapi32.dll", EntryPoint = "CredFree", SetLastError = true)] private static extern bool CredFree(IntPtr cred);
    public static string Read(string target) {
        IntPtr p = IntPtr.Zero; if (!NativeCredRead(target, 1, 0, out p)) return null;
        try { var c = Marshal.PtrToStructure<CRED2>(p); byte[] b = new byte[c.CredentialBlobSize]; Marshal.Copy(c.CredentialBlob, b, 0, c.CredentialBlobSize); return Encoding.UTF8.GetString(b); }
        finally { CredFree(p); }
    }
}
'@

$token = [Vault2]::Read("Supabase CLI:supabase")
if (-not $token) { Write-Output "No credential found"; exit 1 }

$body = @{ query = "DELETE FROM rate_limits;" } | ConvertTo-Json
$r = Invoke-RestMethod -Uri "https://api.supabase.com/v1/projects/gcgguaxkttlbivguabyn/database/query" -Method POST -Headers @{ "apikey" = $token; "Authorization" = "Bearer $token"; "Content-Type" = "application/json" } -Body $body
Write-Output ($r | ConvertTo-Json -Depth 5)
