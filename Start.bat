@echo off

REM
node -v >nul 2>&1
if %errorlevel% neq 0 (
    REM 
    echo Node.js not found. Downloading and installing...
    powershell -command "Invoke-WebRequest -Uri 'https://nodejs.org/dist/latest/node.exe' -OutFile 'node.exe'"
    set "PATH=%~dp0;%PATH%"
)

REM 
if not exist "node_modules" (
    REM
    echo Installing dependencies...
    npm install
)

REM 
echo Starting the application...
node .