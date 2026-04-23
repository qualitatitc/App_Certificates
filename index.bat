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

echo Iniciando la aplicacion...
echo Cierre esta ventana para detener el servidor.
call npm start

pause
