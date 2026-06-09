from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('events', '0018_contribution'),
    ]

    operations = [
        migrations.AlterField(
            model_name='contribution',
            name='intasend_api_ref',
            field=models.CharField(blank=True, max_length=80, null=True, unique=True),
        ),
        migrations.AddField(
            model_name='contribution',
            name='pesapal_merchant_ref',
            field=models.CharField(blank=True, default='', max_length=100),
        ),
        migrations.AddField(
            model_name='contribution',
            name='pesapal_response',
            field=models.JSONField(blank=True, default=dict),
        ),
        migrations.AddField(
            model_name='contribution',
            name='pesapal_tracking_id',
            field=models.CharField(blank=True, default='', max_length=100),
        ),
    ]
