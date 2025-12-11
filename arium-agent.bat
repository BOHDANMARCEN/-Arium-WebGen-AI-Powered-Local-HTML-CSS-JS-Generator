@echo off
REM Run Arium WebGen AI agent
if "%1"=="" (
    echo Usage: arium-agent.bat ^<task^> [options]
    echo Available tasks: create-landing, fix-site, generate-content
    echo Example: arium-agent.bat create-landing --dry-run
    exit /b 1
)
node ./bin/arium agent %*

