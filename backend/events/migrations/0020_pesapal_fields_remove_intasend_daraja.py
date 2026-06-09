from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('events', '0019_contribution_pesapal_fields_and_more'),
    ]

    operations = [
        # Add PesaPal fields to Payment
        migrations.AddField(
            model_name='payment',
            name='pesapal_merchant_ref',
            field=models.CharField(blank=True, default='', max_length=100),
        ),
        migrations.AddField(
            model_name='payment',
            name='pesapal_response',
            field=models.JSONField(blank=True, default=dict),
        ),
        migrations.AddField(
            model_name='payment',
            name='pesapal_tracking_id',
            field=models.CharField(blank=True, default='', max_length=100),
        ),
        # Remove Daraja/IntaSend fields from Payment
        migrations.RemoveField(
            model_name='payment',
            name='checkout_request_id',
        ),
        migrations.RemoveField(
            model_name='payment',
            name='merchant_request_id',
        ),
        migrations.RemoveField(
            model_name='payment',
            name='stk_response',
        ),
        # Remove IntaSend fields from Contribution
        migrations.RemoveField(
            model_name='contribution',
            name='intasend_api_ref',
        ),
        migrations.RemoveField(
            model_name='contribution',
            name='intasend_invoice_id',
        ),
        migrations.RemoveField(
            model_name='contribution',
            name='intasend_response',
        ),
    ]
