@echo off

chcp 65001 >nul

cd /d "%~dp0"



rem Si la app aun no esta compilada, la generamos automaticamente (solo la 1a vez)

if not exist "dist\index.html" (

  echo La aplicacion no esta compilada todavia. Generandola...

  call "%~dp0Actualizar App.bat"

)



echo Iniciando servidor local...

start "App Certificados" /MIN cmd /c "node server.mjs"



timeout /t 2 /nobreak >nul

echo Abriendo la aplicacion en el navegador...

start "" "http://localhost:3789"

