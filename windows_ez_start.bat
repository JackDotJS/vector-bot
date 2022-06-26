@echo off
call npm run build
call npm run start -- --debug
pause