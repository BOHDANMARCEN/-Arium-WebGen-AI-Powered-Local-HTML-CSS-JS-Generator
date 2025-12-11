@echo off
REM Initialize a new Arium WebGen project
if "%1"=="" (
    echo Usage: arium-init.bat ^<project-name^>
    exit /b 1
)
node ./bin/arium init %1

