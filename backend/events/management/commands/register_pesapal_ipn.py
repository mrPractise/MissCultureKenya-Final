"""
Management command to register an IPN URL with PesaPal.

Run once per environment (sandbox / production) to obtain the
notification_id that must be stored as PESAPAL_IPN_ID in .env.

Usage:
    python manage.py register_pesapal_ipn
    python manage.py register_pesapal_ipn --url https://yourdomain.com/api/events/pesapal-ipn/
    python manage.py register_pesapal_ipn --list   # show already-registered IPNs
"""

from django.core.management.base import BaseCommand, CommandError
from events.pesapal import register_ipn_url, get_registered_ipns


class Command(BaseCommand):
    help = "Register an IPN URL with PesaPal and print the notification_id to store in .env"

    def add_arguments(self, parser):
        parser.add_argument(
            "--url",
            type=str,
            default="",
            help="IPN URL to register. Defaults to PESAPAL_IPN_URL setting or <FRONTEND_URL>/api/events/pesapal-ipn/.",
        )
        parser.add_argument(
            "--list",
            action="store_true",
            dest="list_ipns",
            help="List currently registered IPN URLs instead of registering a new one.",
        )

    def handle(self, *args, **options):
        if options["list_ipns"]:
            self._list_ipns()
            return

        ipn_url = options["url"]
        if not ipn_url:
            from django.conf import settings

            ipn_url = getattr(settings, "PESAPAL_IPN_URL", "")
            if not ipn_url:
                # Derive from FRONTEND_URL / BACKEND_URL
                frontend = getattr(settings, "FRONTEND_URL", "")
                backend_url = getattr(settings, "INTASEND_CALLBACK_URL", "")
                if backend_url:
                    # Replace the path portion
                    base = backend_url.rsplit("/", 2)[0]  # strip /api/events/intasend-callback/
                    ipn_url = f"{base}/api/events/pesapal-ipn/"
                elif frontend:
                    base = frontend.rstrip("/")
                    ipn_url = f"{base}/api/events/pesapal-ipn/"
                else:
                    raise CommandError(
                        "Could not determine IPN URL. Pass --url explicitly or set "
                        "PESAPAL_IPN_URL / FRONTEND_URL in settings."
                    )

        self.stdout.write(f"Registering IPN URL: {ipn_url}")

        result = register_ipn_url(ipn_url)

        if result.get("error"):
            raise CommandError(f"PesaPal IPN registration failed: {result['error']}")

        # PesaPal returns the notification_id in the response
        notification_id = (
            result.get("ipn_id")
            or result.get("notification_id")
            or result.get("id")
            or ""
        )

        self.stdout.write(self.style.SUCCESS("IPN URL registered successfully!"))
        self.stdout.write(f"  URL:             {ipn_url}")
        self.stdout.write(f"  notification_id: {notification_id}")
        self.stdout.write("")
        self.stdout.write(
            "Add this to your .env:\n"
            f"  PESAPAL_IPN_ID={notification_id}"
        )

        # Also show the full response for debugging
        self.stdout.write(f"\nFull PesaPal response:\n{result}")

    def _list_ipns(self):
        ipns = get_registered_ipns()
        if not ipns:
            self.stdout.write("No IPN URLs currently registered with PesaPal.")
            return

        self.stdout.write(self.style.SUCCESS(f"Found {len(ipns)} registered IPN URL(s):"))
        for ipn in ipns:
            self.stdout.write(f"  - {ipn}")
