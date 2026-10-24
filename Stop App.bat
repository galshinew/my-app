@echo off
setlocal enabledelayedexpansion
title Stop My App Server
echo Stopping local server on port 8000...

set "FOUND="
set "KILLED="
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":8000" ^| findstr "LISTENING"') do (
  set "FOUND=1"
  if not "%%a"=="!KILLED!" (
    set "KILLED=%%a"
    echo Killing PID %%a
    taskkill /F /T /PID %%a >nul 2>&1
  )
)

REM Fallback: kill any leftover python http.server process
powershell -NoProfile -Command "Get-CimInstance Win32_Process | Where-Object { $_.CommandLine -like '*http.server*' } | ForEach-Object { Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue }" >nul 2>&1

if not defined FOUND (
  echo No server was listening on port 8000.
) else (
  echo Server stopped.
)
ping -n 2 127.0.0.1 >nul
