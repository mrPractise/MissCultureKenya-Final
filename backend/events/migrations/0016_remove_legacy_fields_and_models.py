from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('events', '0015_alter_event_payment_method'),
    ]

    operations = [
        # Remove legacy fields from Event model
        migrations.RemoveField(
            model_name='event',
            name='status',
        ),
        migrations.RemoveField(
            model_name='event',
            name='venue_address',
        ),
        migrations.RemoveField(
            model_name='event',
            name='ticket_price',
        ),
        migrations.RemoveField(
            model_name='event',
            name='ticket_url',
        ),
        migrations.RemoveField(
            model_name='event',
            name='registration_url',
        ),
        migrations.RemoveField(
            model_name='event',
            name='paybill_number',
        ),
        migrations.RemoveField(
            model_name='event',
            name='account_number',
        ),
        # Delete EventInquiry model
        migrations.DeleteModel(
            name='EventInquiry',
        ),
        # Delete EventSettings model
        migrations.DeleteModel(
            name='EventSettings',
        ),
    ]
