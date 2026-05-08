from getpass import getpass

from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand
from decouple import config

class Command(BaseCommand):
    help = 'Creates a superuser if it does not exist'

    def add_arguments(self, parser):
        parser.add_argument(
            "--noinput",
            action="store_true",
            help="Do not prompt for input; only create from environment variables.",
        )

    def handle(self, *args, **options):
        noinput = bool(options.get("noinput"))

        username = config("DJANGO_SUPERUSER_USERNAME", default="").strip()
        email = config("DJANGO_SUPERUSER_EMAIL", default="").strip()
        password = config("DJANGO_SUPERUSER_PASSWORD", default="")

        if not username or not email or not password:
            if noinput:
                self.stdout.write(
                    self.style.WARNING(
                        "Superuser environment variables not set. Skipping superuser creation."
                    )
                )
                return

            username = (input("Username: ") or "").strip()
            email = (input("Email address: ") or "").strip()
            password = getpass("Password: ")

            if not username or not email or not password:
                self.stdout.write(self.style.ERROR("Username, email, and password are required."))
                return

        User = get_user_model()

        if User.objects.filter(username=username).exists():
            self.stdout.write(
                self.style.SUCCESS(f'Superuser "{username}" already exists.')
            )
            return

        User.objects.create_superuser(
            username=username,
            email=email,
            password=password
        )

        self.stdout.write(
            self.style.SUCCESS(f'Superuser "{username}" created successfully.')
        )
