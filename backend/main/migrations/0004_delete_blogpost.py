from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0003_kenyagalleryphoto_and_verbose_name_updates'),
    ]

    operations = [
        migrations.DeleteModel(
            name='BlogPost',
        ),
    ]
