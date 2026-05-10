# sync-shared-final.ps1
# Rebru -- Shared File Sync (Final v3 - ASCII Fixed)
# Menyinkronisasi 15 file canonical dari Website ke Bio-link
#
# Cara pakai:
#   cd D:\rebrustudio.ID\Project\IG-Website
#   powershell -ExecutionPolicy Bypass -File .\sync-shared-final.ps1
#
# Preview tanpa copy:
#   powershell -ExecutionPolicy Bypass -File .\sync-shared-final.ps1 -DryRun

param(
  [switch]$DryRun
)

# -- Path Konfigurasi --
$WebsiteRoot = "D:\rebrustudio.ID\Project\Website\src"
$BioLinkRoot = "D:\rebrustudio.ID\Project\IG-Website\src"
$LogFile     = "D:\rebrustudio.ID\Project\IG-Website\sync-log.txt"

# -- Daftar 15 File yang Disinkronisasi --
$SharedFiles = @(
  @{ From = "context\CartContext.tsx";         To = "context\CartContext.tsx"         },
  @{ From = "types\cart.ts";                   To = "types\cart.ts"                   },
  @{ From = "types\product.ts";                To = "types\product.ts"                },
  @{ From = "types\index.ts";                  To = "types\index.ts"                  },
  @{ From = "lib\products.ts";                 To = "lib\products.ts"                 },
  @{ From = "utils\format.ts";                 To = "utils\format.ts"                 },
  @{ From = "utils\helpers.ts";                To = "utils\helpers.ts"                },
  @{ From = "utils\slug.ts";                   To = "utils\slug.ts"                   },
  @{ From = "utils\index.ts";                  To = "utils\index.ts"                  },
  @{ From = "services\order.ts";               To = "services\order.ts"               },
  @{ From = "constants\config.ts";             To = "constants\config.ts"             },
  @{ From = "hooks\useInView.ts";              To = "hooks\useInView.ts"              },
  @{ From = "components\ui\Accordion.tsx";     To = "components\ui\Accordion.tsx"     },
  @{ From = "components\ui\Toast.tsx";         To = "components\ui\Toast.tsx"         },
  @{ From = "components\cart\CartDrawer.tsx";  To = "components\cart\CartDrawer.tsx"  }
)

# -- Header --
$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
$modeLabel = if ($DryRun) { "[DRY RUN]" } else { "" }

$header = "
============================================================
  REBRU SYNC v3 $modeLabel -- $timestamp
  Dari : $WebsiteRoot
  Ke   : $BioLinkRoot
  File : $($SharedFiles.Count) shared files
============================================================"

Write-Host $header -ForegroundColor Cyan
Add-Content -Path $LogFile -Value $header

# -- Validasi Path --
if (-not (Test-Path $WebsiteRoot)) {
  $msg = "  [ERROR] Website src tidak ditemukan: $WebsiteRoot"
  Write-Host $msg -ForegroundColor Red
  Add-Content -Path $LogFile -Value $msg
  exit 1
}

if (-not (Test-Path $BioLinkRoot)) {
  $msg = "  [ERROR] Bio-link src tidak ditemukan: $BioLinkRoot"
  Write-Host $msg -ForegroundColor Red
  Add-Content -Path $LogFile -Value $msg
  exit 1
}

# -- Sync Loop --
$ok      = 0
$skipped = 0
$warned  = 0
$errors  = 0

foreach ($file in $SharedFiles) {
  $src    = Join-Path $WebsiteRoot $file.From
  $dst    = Join-Path $BioLinkRoot $file.To
  $dstDir = Split-Path $dst -Parent

  if (-not (Test-Path $src)) {
    $msg = "  [SKIP]  $($file.From) -- tidak ditemukan di Website"
    Write-Host $msg -ForegroundColor Yellow
    Add-Content -Path $LogFile -Value $msg
    $skipped++
    continue
  }

  if (-not (Test-Path $dstDir)) {
    if (-not $DryRun) {
      New-Item -ItemType Directory -Path $dstDir -Force | Out-Null
    }
    $dirShort = $dstDir.Replace($BioLinkRoot, "src")
    $msg = "  [MKDIR] Buat folder: $dirShort"
    Write-Host $msg -ForegroundColor DarkCyan
    Add-Content -Path $LogFile -Value $msg
  }

  if (Test-Path $dst) {
    $srcTime = (Get-Item $src).LastWriteTime
    $dstTime = (Get-Item $dst).LastWriteTime
    if ($dstTime -gt $srcTime) {
      $warnMsg = "  [WARN]  $($file.To) -- bio-link lebih baru dari Website"
      Write-Host $warnMsg -ForegroundColor Yellow
      Add-Content -Path $LogFile -Value $warnMsg
      $warned++
    }
  }

  try {
    if (-not $DryRun) {
      Copy-Item -Path $src -Destination $dst -Force
    }
    $status = if ($DryRun) { "[PREVIEW]" } else { "[OK]     " }
    $msg    = "  $status $($file.From)"
    Write-Host $msg -ForegroundColor Green
    Add-Content -Path $LogFile -Value $msg
    $ok++
  }
  catch {
    $errMsg = "  [ERROR] $($file.From) -- $($_.Exception.Message)"
    Write-Host $errMsg -ForegroundColor Red
    Add-Content -Path $LogFile -Value $errMsg
    $errors++
  }
}

# -- Summary --
$summary = "
  Hasil: $ok berhasil  $skipped dilewati  $warned peringatan  $errors error
------------------------------------------------------------
  Langkah berikutnya:
  1. npx tsc --noEmit       (zero error sebelum lanjut)
  2. npm run dev            (test di http://localhost:3000/ig)
  3. git add . && git commit -m sync && git push
============================================================"

$color = if ($errors -gt 0) { "Red" } elseif ($warned -gt 0) { "Yellow" } else { "Cyan" }
Write-Host $summary -ForegroundColor $color
Add-Content -Path $LogFile -Value $summary

if ($errors -gt 0) { exit 1 } else { exit 0 }