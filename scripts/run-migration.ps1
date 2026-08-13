Add-Type @"
using System;
using System.Runtime.InteropServices;
using System.Text;

[StructLayout(LayoutKind.Sequential, CharSet = CharSet.Unicode)]
public struct CREDENTIAL
{
    public int Flags;
    public int Type;
    public string TargetName;
    public string Comment;
    public System.Runtime.InteropServices.ComTypes.FILETIME LastWritten;
    public int CredentialBlobSize;
    public IntPtr CredentialBlob;
    public int Persist;
    public int AttributeCount;
    public IntPtr Attributes;
    public string TargetAlias;
    public string UserName;
}

public static class VaultHelper
{
    [DllImport("advapi32.dll", EntryPoint = "CredReadW", CharSet = CharSet.Unicode, SetLastError = true)]
    private static extern bool NativeCredRead(string target, int type, int reservedFlag, out IntPtr credPtr);

    [DllImport("advapi32.dll", EntryPoint = "CredFree", SetLastError = true)]
    private static extern bool CredFree(IntPtr cred);

    public static string ReadPassword(string target)
    {
        IntPtr credPtr = IntPtr.Zero;
        if (!NativeCredRead(target, 1, 0, out credPtr)) return null;
        try
        {
            var cred = Marshal.PtrToStructure<CREDENTIAL>(credPtr);
            byte[] blob = new byte[cred.CredentialBlobSize];
            Marshal.Copy(cred.CredentialBlob, blob, 0, cred.CredentialBlobSize);
            return Encoding.UTF8.GetString(blob);
        }
        finally { CredFree(credPtr); }
    }
}
"@

$token = [VaultHelper]::ReadPassword("Supabase CLI:supabase")
if (-not $token) { Write-Output "FAILED to read credential"; exit 1 }

$headers = @{ "apikey" = $token; "Authorization" = "Bearer $token"; "Content-Type" = "application/json" }

function Invoke-Sql($file) {
    $sql = [IO.File]::ReadAllText((Join-Path $PSScriptRoot $file))
    $body = @{ query = $sql } | ConvertTo-Json -Depth 5
    Write-Output "--- Running $file ---"
    $r = Invoke-RestMethod -Uri "https://api.supabase.com/v1/projects/gcgguaxkttlbivguabyn/database/query" -Method POST -Headers $headers -Body $body
    $r | ConvertTo-Json -Depth 5
}

Invoke-Sql "push-migrations-part1.sql"
Invoke-Sql "push-migrations-part2.sql"
