from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand
from decouple import config


class Command(BaseCommand):
    help = "Creates a superuser from environment variables if one does not already exist"

    def handle(self, *args, **options):
        username = config(
            "DJANGO_SUPERUSER_USERNAME",
            default=config("ADMIN_USERNAME", default="mickey"),
        ).strip()
        email = config(
            "DJANGO_SUPERUSER_EMAIL",
            default=config("ADMIN_EMAIL", default=""),
        ).strip()
        password = config(
            "DJANGO_SUPERUSER_PASSWORD",
            default=config("ADMIN_PASSWORD", default="mickey"),
        )

        if not username or not password:
            self.stdout.write(self.style.ERROR("Superuser username and password are required."))
            return

        if not email:
            email = f"{username}@example.com"

        User = get_user_model()
        username_field = getattr(User, "USERNAME_FIELD", "username")
        lookup = {username_field: username}

        user, created = User.objects.get_or_create(**lookup, defaults={"email": email})

        changed = False

        if getattr(user, "email", None) != email and email:
            user.email = email
            changed = True

        if not getattr(user, "is_staff", False):
            user.is_staff = True
            changed = True

        if not getattr(user, "is_superuser", False):
            user.is_superuser = True
            changed = True

        if hasattr(user, "is_active") and not user.is_active:
            user.is_active = True
            changed = True

        user.set_password(password)
        changed = True

        if changed:
            user.save()

        if created:
            self.stdout.write(self.style.SUCCESS(f'Superuser "{username}" created/ensured successfully.'))
        else:
            self.stdout.write(self.style.SUCCESS(f'Superuser "{username}" updated/ensured successfully.'))
