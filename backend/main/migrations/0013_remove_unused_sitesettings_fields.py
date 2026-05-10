# Generated migration to remove unused SiteSettings fields

from django.db import migrations


class Migration(migrations.Migration):
    dependencies = [
        ('main', '0012_sitesettings_mpesa_logo'),
    ]

    operations = [
        # Remove unused Home page fields
        migrations.RemoveField(
            model_name='sitesettings',
            name='home_upcoming_event_image',
        ),
        migrations.RemoveField(
            model_name='sitesettings',
            name='home_kenya_highlight_image',
        ),
        migrations.RemoveField(
            model_name='sitesettings',
            name='home_ambassador_highlight_image',
        ),
        # Remove unused Kenya page artisan fields
        migrations.RemoveField(
            model_name='sitesettings',
            name='kenya_artisan_1_image',
        ),
        migrations.RemoveField(
            model_name='sitesettings',
            name='kenya_artisan_2_image',
        ),
        migrations.RemoveField(
            model_name='sitesettings',
            name='kenya_artisan_3_image',
        ),
        migrations.RemoveField(
            model_name='sitesettings',
            name='kenya_artisan_4_image',
        ),
    ]
