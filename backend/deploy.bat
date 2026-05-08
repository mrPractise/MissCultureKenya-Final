@echo off
echo Setting up Miss Culture Kenya Backend for Railway...

REM Run migrations
python manage.py migrate

REM Collect static files
python manage.py collectstatic --noinput

REM Create superuser if environment variables are set
python manage.py ensure_superuser

echo Deployment setup complete!
