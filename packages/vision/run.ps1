param(
    [switch]$Display
)

$ErrorActionPreference = 'Stop'
$visionRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$python = Join-Path $visionRoot '.venv\Scripts\python.exe'
if (-not (Test-Path $python)) {
    throw 'Environnement Python absent. Lancez d abord .\setup.ps1.'
}
& $python -c "import cv2, ultralytics, face_recognition, requests, yaml" 2>&1 | Out-Null
if ($LASTEXITCODE -ne 0) {
    throw 'Dépendances IA manquantes (Ultralytics, PyTorch ou face-recognition). Vérifiez le réseau puis relancez .\setup.ps1.'
}

$arguments = @('main.py', '--config', 'config.yaml')
if ($Display) { $arguments += '--display' }
Push-Location $visionRoot
try { & $python @arguments } finally { Pop-Location }