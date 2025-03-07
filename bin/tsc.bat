@echo off
cd ..\
echo Compiling TypeScript...
docker exec -it app-typescript-compiler-container npm run build
echo Done.
cmd /k