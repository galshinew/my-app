@echo off
title Stop My App Server

echo Stopping local server on port 8000...

REM Kill only the process LISTENING on port 8000
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":8000" ^| findstr "LISTENING"') do (
    echo Killing listening process PID: %%a
    taskkill /F /T /PID %%a >nul 2>&1
)

REM Fallback: kill any python http.server just in case
taskkill /F /IM python.exe >nul 2>&1
taskkill /F /IM py.exe >nul 2>&1

echo.
echo Done. Any existing browser tabs may still show old connections in TIME_WAIT, 
echo but no new requests will be accepted anymore.
echo.
timeout /t 2 >nul
