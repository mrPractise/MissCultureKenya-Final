#!/bin/bash

echo "--- Running Migrations ---"
python manage.py migrate --noinput

echo "--- Ensuring Superuser (Env Vars) ---"
python manage.py ensure_superuser

echo "--- Collecting Static Files ---"
python manage.py collectstatic --noinput

echo "--- Deployment Script Complete ---"
