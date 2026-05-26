from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('events', '0017_add_ticket_and_registration_urls'),
    ]

    operations = [
        migrations.CreateModel(
            name='Contribution',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('full_name', models.CharField(max_length=200)),
                ('email', models.EmailField(max_length=254)),
                ('phone_number', models.CharField(blank=True, max_length=20)),
                ('amount', models.DecimalField(decimal_places=2, max_digits=10)),
                ('status', models.CharField(choices=[('pending', 'Pending'), ('successful', 'Successful'), ('failed', 'Failed'), ('cancelled', 'Cancelled'), ('reversed', 'Reversed')], default='pending', max_length=20)),
                ('intasend_invoice_id', models.CharField(blank=True, max_length=50, null=True, unique=True)),
                ('intasend_api_ref', models.CharField(max_length=80, unique=True)),
                ('intasend_response', models.JSONField(blank=True, default=dict)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
            ],
            options={
                'verbose_name': 'Events - Contribution',
                'verbose_name_plural': 'Events - Contributions',
                'ordering': ['-created_at'],
            },
        ),
    ]
