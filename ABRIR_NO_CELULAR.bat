@echo off
setlocal
cd /d "%~dp0"
set PORTA=5500
set IP=

for /f "tokens=2 delims=:" %%A in ('ipconfig ^| findstr /C:"IPv4"') do (
  set IP=%%A
  goto :ip_encontrado
)

:ip_encontrado
set IP=%IP: =%
echo.
echo Financas AI vai abrir no computador em:
echo http://localhost:%PORTA%
echo.
if defined IP (
  echo Para abrir no celular, use o mesmo Wi-Fi e acesse:
  echo http://%IP%:%PORTA%
  echo.
)
echo Mantenha esta janela aberta enquanto estiver usando no celular.
echo.
start "" "http://localhost:%PORTA%"

where py >nul 2>nul
if not errorlevel 1 (
  py -3 -m http.server %PORTA% --bind 0.0.0.0
) else (
  python -m http.server %PORTA% --bind 0.0.0.0
)

pause
