$ErrorActionPreference = 'Stop'

$visionRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$python = Get-Command python -ErrorAction SilentlyContinue
if (-not $python) {
    $candidate = Join-Path $env:LOCALAPPDATA 'Programs\Python\Python314\python.exe'
    if (-not (Test-Path $candidate)) {
        throw 'Python est introuvable. Installez Python 3.12+ puis relancez ce script.'
    }
    $pythonPath = Split-Path $candidate
    $python = @{ Source = $candidate }
} else {
    $pythonPath = Split-Path $python.Source
}

$venv = Join-Path $visionRoot '.venv'
if (-not (Test-Path (Join-Path $venv 'Scripts\python.exe'))) {
    & $python.Source -m venv $venv
}

$venvPython = Join-Path $venv 'Scripts\python.exe'
& $venvPython -m pip install --upgrade pip
if ($LASTEXITCODE -ne 0) { throw 'Mise à jour de pip échouée.' }
& $venvPython -m pip install -r (Join-Path $visionRoot 'requirements.txt')
if ($LASTEXITCODE -ne 0) { throw 'Installation des dépendances vision échouée. Vérifiez le réseau puis relancez .\setup.ps1.' }
& $venvPython -m pip install -r (Join-Path $visionRoot 'requirements-dev.txt')
if ($LASTEXITCODE -ne 0) { throw 'Installation des dépendances de test échouée. Vérifiez le réseau puis relancez .\setup.ps1.' }

& $venvPython -c "import cv2, ultralytics, face_recognition, requests, yaml; print('Dépendances vision validées')"
if ($LASTEXITCODE -ne 0) { throw 'Les dépendances vision ne sont pas importables dans .venv.' }

$faces = Join-Path $visionRoot 'faces'
New-Item -ItemType Directory -Force -Path $faces | Out-Null
$config = Join-Path $visionRoot 'config.yaml'
if (-not (Test-Path $config)) {
    Copy-Item (Join-Path $visionRoot 'config.example.yaml') $config
}

Write-Host "Moteur vision prêt avec $venvPython" -ForegroundColor Green
Write-Host 'Ajoutez les photos faces/<student-id>.jpg puis lancez .\run.ps1 -Display'