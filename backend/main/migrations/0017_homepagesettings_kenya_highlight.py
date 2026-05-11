from django.db import migrations, models
import cloudinary.models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0016_alter_ambassador_options_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='homepagesettings',
            name='kenya_highlight_image',
            field=cloudinary.models.CloudinaryField(blank=True, folder='missculture/pages/home/highlights', max_length=255, null=True, verbose_name='kenya_highlight'),
        ),
        migrations.AddField(
            model_name='homepagesettings',
            name='kenya_highlight_enabled',
            field=models.BooleanField(default=True, help_text='Show Kenya highlight section on homepage'),
        ),
    ]
