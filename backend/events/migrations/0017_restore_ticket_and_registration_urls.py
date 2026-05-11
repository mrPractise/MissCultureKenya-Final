from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('events', '0016_remove_legacy_fields_and_models'),
    ]

    operations = [
        # Restore ticket_url and registration_url fields
        migrations.AddField(
            model_name='event',
            name='ticket_url',
            field=models.URLField(blank=True, help_text='External ticketing URL (e.g. Eventbrite). If set, users will be redirected here to buy tickets.'),
        ),
        migrations.AddField(
            model_name='event',
            name='registration_url',
            field=models.URLField(blank=True, help_text='External registration URL. If set, users will be redirected here to register.'),
        ),
    ]
