@echo off
where mvn >nul 2>nul
if errorlevel 1 (
  echo Maven no esta instalado. Instala Apache Maven 3.9+ y vuelve a ejecutar: mvn %*
  exit /b 1
)
mvn %*
