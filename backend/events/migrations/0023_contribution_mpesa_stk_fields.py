from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('events', '0022_drop_orphan_payment_type_column'),
    ]

    operations = [
        migrations.AddField(
            model_name='contribution',
            name='mpesa_code',
            field=models.CharField(blank=True, default='', help_text='M-Pesa transaction code', max_length=20),
        ),
        migrations.AddField(
            model_name='contribution',
            name='checkout_request_id',
            field=models.CharField(blank=True, default='', help_text='Daraja CheckoutRequestID from STK Push', max_length=50),
        ),
        migrations.AddField(
            model_name='contribution',
            name='merchant_request_id',
            field=models.CharField(blank=True, default='', help_text='Daraja MerchantRequestID from STK Push', max_length=50),
        ),
        migrations.AddField(
            model_name='contribution',
            name='stk_response',
            field=models.JSONField(blank=True, default=dict, help_text='Raw STK Push response/callback data for debugging'),
        ),
    ]
