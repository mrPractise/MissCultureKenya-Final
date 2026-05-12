# Removes the legacy SocialMediaPost model.
# The model class was already deleted from main/models.py but the DB table
# (main_socialmediapost) and Django's migration state still referenced it.
# This migration drops both cleanly.

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0017_contributepagesettings_privacypagesettings_and_more'),
    ]

    operations = [
        migrations.DeleteModel(
            name='SocialMediaPost',
        ),
    ]
