@echo off
REM Step 1: Ensure logs directory exists
if not exist "C:\workspace\user-admin-app\logs" (
    mkdir "C:\workspace\user-admin-app\logs"
    echo Created logs directory
) else (
    echo Logs directory exists
)

echo.
echo === Port Listeners ===
netstat -ano | findstr ":8080.*LISTENING"
if %ERRORLEVEL% NEQ 0 echo Port 8080: NOT LISTENING

netstat -ano | findstr ":3000.*LISTENING"
if %ERRORLEVEL% NEQ 0 echo Port 3000: NOT LISTENING
