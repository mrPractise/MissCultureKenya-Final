from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand
from decouple import config


class Command(BaseCommand):
    help = "Creates a superuser from environment variables if one does not already exist"

    def handle(self, *args, **options):
        username = config("DJANGO_SUPERUSER_USERNAME", default="")
        email = config("DJANGO_SUPERUSER_EMAIL", default="")
        password = config("DJANGO_SUPERUSER_PASSWORD", default="")

        if not username or not email or not password:
            self.stdout.write(
                self.style.WARNING(
                    "Superuser environment variables not set. Skipping superuser creation."
                )
            )
            return

        User = get_user_model()

        if User.objects.filter(username=username).exists():
            self.stdout.write(self.style.SUCCESS(f'Superuser "{username}" already exists.'))
            return

        User.objects.create_superuser(username=username, email=email, password=password)
        self.stdout.write(self.style.SUCCESS(f'Superuser "{username}" created successfully.'))
