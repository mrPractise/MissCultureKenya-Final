from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("main", "0014_reorganize_settings"),
    ]

    operations = [
        migrations.AddField(
            model_name="homepagesettings",
            name="recent_event_enabled",
            field=models.BooleanField(
                default=True,
                help_text="Show recent events section on homepage",
            ),
        ),
    ]

