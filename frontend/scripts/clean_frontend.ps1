# Script de nettoyage du projet FASTCUBE Frontend
# PowerShell script pour nettoyer et organiser le projet frontend

Write-Host "🧹 NETTOYAGE DU PROJET FASTCUBE FRONTEND" -ForegroundColor Green
Write-Host "=========================================" -ForegroundColor Green

# Fonction pour supprimer un dossier s'il existe
function Remove-DirectoryIfExists {
    param([string]$Path)
    if (Test-Path $Path) {
        Write-Host "🗑️ Suppression de: $Path" -ForegroundColor Yellow
        Remove-Item -Recurse -Force $Path
    } else {
        Write-Host "ℹ️ Dossier inexistant: $Path" -ForegroundColor Gray
    }
}

# Fonction pour supprimer un fichier s'il existe
function Remove-FileIfExists {
    param([string]$Path)
    if (Test-Path $Path) {
        Write-Host "🗑️ Suppression de: $Path" -ForegroundColor Yellow
        Remove-Item -Force $Path
    } else {
        Write-Host "ℹ️ Fichier inexistant: $Path" -ForegroundColor Gray
    }
}

Write-Host "`n📦 Nettoyage des fichiers temporaires..." -ForegroundColor Yellow

# Supprimer les caches Node.js
Remove-DirectoryIfExists "node_modules/.cache"
Remove-DirectoryIfExists ".vite"
Remove-DirectoryIfExists ".parcel-cache"

# Supprimer les builds
Remove-DirectoryIfExists "dist"
Remove-DirectoryIfExists "build"
Remove-DirectoryIfExists ".next"
Remove-DirectoryIfExists ".nuxt"

# Supprimer les fichiers de test temporaires
Remove-FileIfExists "src/pages/ChatbotTest.jsx"
Remove-FileIfExists "src/pages/ChatbotTest.css"
Remove-FileIfExists "src/pages/ButtonTest.jsx"
Remove-FileIfExists "src/components/FormDebugger.jsx"

# Supprimer les composants redondants
Remove-FileIfExists "src/components/DarkModeToggle.jsx"
Remove-FileIfExists "src/components/ThemeToggle.jsx"

# Supprimer les fichiers de rapport temporaires
Remove-FileIfExists "DEMARRAGE_CHATBOT.md"
Remove-FileIfExists "INTEGRATION_INSTRUCTIONS.md"
Remove-FileIfExists "SUPPRESSION_CSV_REPORT.md"
Remove-FileIfExists "CORRECTION_API_PORTS_REPORT.md"
Remove-FileIfExists "CORRECTION_COPY_PASTE_REPORT.md"
Remove-FileIfExists "CORRECTION_PORT_5173_REPORT.md"
Remove-FileIfExists "CORRECTION_400_ERROR_REPORT.md"
Remove-FileIfExists "CLEANUP_FINAL_REPORT.md"

Write-Host "`n📁 Création de la structure organisée..." -ForegroundColor Yellow

# Créer les dossiers s'ils n'existent pas
$directories = @("docs", "scripts", "tests", "logs", "temp")

foreach ($dir in $directories) {
    if (-not (Test-Path $dir)) {
        Write-Host "📁 Création du dossier: $dir" -ForegroundColor Green
        New-Item -ItemType Directory -Name $dir -Force | Out-Null
    } else {
        Write-Host "ℹ️ Dossier existant: $dir" -ForegroundColor Gray
    }
}

Write-Host "`n🔍 Vérification de la structure finale..." -ForegroundColor Yellow

# Afficher la structure finale
Write-Host "`n📋 Structure du projet après nettoyage:" -ForegroundColor Cyan
Get-ChildItem -Recurse -Directory | ForEach-Object {
    $indent = "  " * ($_.FullName.Split('\').Count - $PWD.Path.Split('\').Count)
    Write-Host "$indent📁 $($_.Name)" -ForegroundColor White
}

Get-ChildItem -File | ForEach-Object {
    $indent = "  "
    Write-Host "$indent📄 $($_.Name)" -ForegroundColor White
}

Write-Host "`n✅ Nettoyage terminé!" -ForegroundColor Green
Write-Host "`n💡 Prochaines étapes:" -ForegroundColor Cyan
Write-Host "1. Installer les dépendances: npm install" -ForegroundColor White
Write-Host "2. Démarrer le serveur: npm run dev" -ForegroundColor White
Write-Host "3. Construire pour production: npm run build" -ForegroundColor White

Write-Host "`n🎉 Projet frontend nettoyé et organisé avec succès!" -ForegroundColor Green 