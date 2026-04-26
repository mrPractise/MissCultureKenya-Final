# Generated manually

from django.db import migrations, models
import django.db.models.deletion
import django.contrib.contenttypes.fields
import django.contrib.contenttypes.models


class Migration(migrations.Migration):

    dependencies = [
        ('contenttypes', '0002_remove_content_type_name'),
        ('main', '0002_alter_achievement_options_alter_blogpost_options_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='KenyaGalleryPhoto',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('object_id', models.PositiveIntegerField()),
                ('caption', models.CharField(blank=True, max_length=200)),
                ('order', models.PositiveIntegerField(default=0)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('content_type', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='contenttypes.contenttype')),
                ('image', models.ImageField(upload_to='kenya-gallery/')),
            ],
            options={
                'verbose_name': 'Kenya Gallery Photo',
                'verbose_name_plural': 'Kenya Gallery Photos',
                'ordering': ['order', 'created_at'],
            },
        ),
        migrations.AlterModelOptions(
            name='achievement',
            options={'verbose_name': 'Kenya - Achievement', 'verbose_name_plural': 'Kenya - Achievements'},
        ),
        migrations.AlterModelOptions(
            name='culturalcommunity',
            options={'verbose_name': 'Kenya - Community', 'verbose_name_plural': 'Kenya - Communities'},
        ),
        migrations.AlterModelOptions(
            name='culturalheritage',
            options={'verbose_name': 'Kenya - Heritage', 'verbose_name_plural': 'Kenya - Heritage'},
        ),
        migrations.AlterModelOptions(
            name='kenyaregion',
            options={'verbose_name': 'Kenya - Region', 'verbose_name_plural': 'Kenya - Regions'},
        ),
    ]
