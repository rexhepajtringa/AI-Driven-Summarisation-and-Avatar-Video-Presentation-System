@echo off
REM Change to the directory where docker-compose.yml is located
cd /d %~dp0

REM Build Docker images
echo Building Docker images...
docker-compose build

REM Start all services
echo Starting all services...
docker-compose up

pause
