# Generated manually - Add logos to SiteSettings

from django.db import migrations, models
import cloudinary.models


class Migration(migrations.Migration):
    dependencies = [
        ('main', '0010_add_heritage_video'),
    ]

    operations = [
        migrations.AddField(
            model_name='sitesettings',
            name='logo_kenya',
            field=cloudinary.models.CloudinaryField(
                blank=True,
                folder='missculture/logos',
                help_text='Logo for Miss Culture Global Kenya (local franchise)',
                max_length=255,
                null=True,
                verbose_name='logo_kenya'
            ),
        ),
        migrations.AddField(
            model_name='sitesettings',
            name='logo_global',
            field=cloudinary.models.CloudinaryField(
                blank=True,
                folder='missculture/logos',
                help_text='Logo for Miss Culture Global (parent organization)',
                max_length=255,
                null=True,
                verbose_name='logo_global'
            ),
        ),
    ]
