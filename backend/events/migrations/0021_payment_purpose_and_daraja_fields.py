from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('events', '0020_pesapal_fields_remove_intasend_daraja'),
    ]

    operations = [
        # Add payment_purpose field (nullable first, with default)
        migrations.AddField(
            model_name='payment',
            name='payment_purpose',
            field=models.CharField(
                max_length=10,
                choices=[('ticket', 'Ticket'), ('vote', 'Vote'), ('donation', 'Donation')],
                help_text="Purpose of this payment: ticket, vote, or donation",
                default='ticket',
                null=True,
                blank=True
            ),
        ),
        # Copy data from payment_type to payment_purpose for existing records
        migrations.RunSQL(
            """
            UPDATE events_payment 
            SET payment_purpose = payment_type 
            WHERE payment_purpose IS NULL OR payment_purpose = '';
            """,
            reverse_sql=migrations.RunSQL.noop
        ),
        # Make payment_purpose not nullable after data migration
        migrations.AlterField(
            model_name='payment',
            name='payment_purpose',
            field=models.CharField(
                max_length=10,
                choices=[('ticket', 'Ticket'), ('vote', 'Vote'), ('donation', 'Donation')],
                help_text="Purpose of this payment: ticket, vote, or donation",
                default='ticket'
            ),
        ),
        # Remove old payment_type field
        migrations.RemoveField(
            model_name='payment',
            name='payment_type',
        ),
        # Re-add Daraja STK Push fields
        migrations.AddField(
            model_name='payment',
            name='checkout_request_id',
            field=models.CharField(
                blank=True,
                max_length=50,
                help_text='Daraja CheckoutRequestID from STK Push'
            ),
        ),
        migrations.AddField(
            model_name='payment',
            name='merchant_request_id',
            field=models.CharField(
                blank=True,
                max_length=50,
                help_text='Daraja MerchantRequestID from STK Push'
            ),
        ),
        migrations.AddField(
            model_name='payment',
            name='stk_response',
            field=models.JSONField(
                blank=True,
                default=dict,
                help_text='Raw STK Push response/callback data for debugging'
            ),
        ),
    ]
