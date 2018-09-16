TITLE Environment Setting

@echo off
echo compile typescript

PUSHD %~dp0
PUSHD tools

call compileTSScripts.bat

POPD
POPD

echo.
echo Finished Environment Setting
