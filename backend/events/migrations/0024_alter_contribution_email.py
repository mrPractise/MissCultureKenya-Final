from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('events', '0023_contribution_mpesa_stk_fields'),
    ]

    operations = [
        migrations.AlterField(
            model_name='contribution',
            name='email',
            field=models.EmailField(blank=True, default='', max_length=254),
        ),
    ]
