@echo off
title Borc ve Kredi Takip Uygulamasi
echo ========================================================
echo       BORC VE KREDI TAKIP UYGULAMASI BASLATILIYOR       
echo ========================================================
echo.
set PATH=C:\Users\User\AppData\Local\Programs\nodejs;%PATH%
cd /d C:\borc-takip
echo Tarayicinizda http://localhost:3005 adresini acabilirsiniz...
echo.
npm.cmd run dev
pause
