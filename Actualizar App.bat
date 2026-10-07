@echo off
chcp 65001 >nul
cd /d "%~dp0"

if not exist "node_modules\" (
  echo Instalando dependencias ^(solo la primera vez^)...
  call npm install
  if errorlevel 1 (
    echo Error: no se pudo ejecutar npm install. Compruebe que Node.js esta instalado.
    pause
    exit /b 1
  )
)

echo Compilando la aplicacion...
call npm run build
if errorlevel 1 (
  echo Error: no se pudo compilar la aplicacion.
  pause
  exit /b 1
)

echo.
echo Aplicacion actualizada correctamente.
echo Ya puede abrirla con "Abrir App.bat".
echo.
pause
