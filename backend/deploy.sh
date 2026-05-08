#!/bin/bash

echo "--- Running Migrations ---"
python manage.py migrate --noinput

echo "--- Collecting Static Files ---"
python manage.py collectstatic --noinput

echo "--- Deployment Script Complete ---"
