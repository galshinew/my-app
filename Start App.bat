@echo off
title My App - local server
cd /d "%~dp0"

where python >nul 2>nul
if %errorlevel%==0 (
  set PY=python
) else (
  where py >nul 2>nul
  if %errorlevel%==0 (
    set PY=py
  ) else (
    echo Python was not found. Install it from https://www.python.org/downloads/
    pause
    exit /b 1
  )
)

echo Starting local server at http://localhost:8000
echo Press Ctrl+C to stop.
echo.
start "" http://localhost:8000
%PY% -m http.server 8000
pause
