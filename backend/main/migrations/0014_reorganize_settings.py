# Generated migration to reorganize settings - move hero images to page-specific models

from django.db import migrations, models
import cloudinary.models


class Migration(migrations.Migration):
    dependencies = [
        ('main', '0013_create_page_settings'),
    ]

    operations = [
        # Remove fields from SiteSettings
        migrations.RemoveField(
            model_name='sitesettings',
            name='home_hero_image',
        ),
        migrations.RemoveField(
            model_name='sitesettings',
            name='home_hero_video_url',
        ),
        migrations.RemoveField(
            model_name='sitesettings',
            name='kenya_hero_image',
        ),
        migrations.RemoveField(
            model_name='sitesettings',
            name='ambassador_hero_image',
        ),
        migrations.RemoveField(
            model_name='sitesettings',
            name='ambassador_profile_image',
        ),
        migrations.RemoveField(
            model_name='sitesettings',
            name='ambassador_video_url',
        ),
        migrations.RemoveField(
            model_name='sitesettings',
            name='events_hero_image',
        ),
        migrations.RemoveField(
            model_name='sitesettings',
            name='gallery_hero_image',
        ),
        migrations.RemoveField(
            model_name='sitesettings',
            name='voting_hero_image',
        ),
        migrations.RemoveField(
            model_name='sitesettings',
            name='voting_event_1_image',
        ),
        migrations.RemoveField(
            model_name='sitesettings',
            name='voting_event_2_image',
        ),
        migrations.RemoveField(
            model_name='sitesettings',
            name='voting_event_3_image',
        ),
        migrations.RemoveField(
            model_name='sitesettings',
            name='voting_event_4_image',
        ),
        migrations.RemoveField(
            model_name='sitesettings',
            name='voting_participant_1_image',
        ),
        migrations.RemoveField(
            model_name='sitesettings',
            name='voting_participant_2_image',
        ),
        migrations.RemoveField(
            model_name='sitesettings',
            name='voting_participant_3_image',
        ),
        migrations.RemoveField(
            model_name='sitesettings',
            name='voting_participant_4_image',
        ),
        migrations.RemoveField(
            model_name='sitesettings',
            name='voting_participant_5_image',
        ),
        migrations.RemoveField(
            model_name='sitesettings',
            name='voting_participant_6_image',
        ),
        migrations.RemoveField(
            model_name='sitesettings',
            name='partnership_hero_image',
        ),
        migrations.RemoveField(
            model_name='sitesettings',
            name='contribute_hero_image',
        ),
        migrations.RemoveField(
            model_name='sitesettings',
            name='contact_hero_image',
        ),
        migrations.RemoveField(
            model_name='sitesettings',
            name='faq_hero_image',
        ),
        migrations.RemoveField(
            model_name='sitesettings',
            name='about_hero_image',
        ),
        migrations.RemoveField(
            model_name='sitesettings',
            name='about_mission_image',
        ),
        migrations.RemoveField(
            model_name='sitesettings',
            name='about_leader_1_image',
        ),
        migrations.RemoveField(
            model_name='sitesettings',
            name='about_leader_2_image',
        ),
        migrations.RemoveField(
            model_name='sitesettings',
            name='about_leader_3_image',
        ),
        migrations.RemoveField(
            model_name='sitesettings',
            name='privacy_hero_image',
        ),
        # Remove leader/committee text fields from SiteSettings
        migrations.RemoveField(
            model_name='sitesettings',
            name='leader_1_name',
        ),
        migrations.RemoveField(
            model_name='sitesettings',
            name='leader_1_title',
        ),
        migrations.RemoveField(
            model_name='sitesettings',
            name='leader_1_bio',
        ),
        migrations.RemoveField(
            model_name='sitesettings',
            name='leader_2_name',
        ),
        migrations.RemoveField(
            model_name='sitesettings',
            name='leader_2_title',
        ),
        migrations.RemoveField(
            model_name='sitesettings',
            name='leader_2_bio',
        ),
        migrations.RemoveField(
            model_name='sitesettings',
            name='leader_3_name',
        ),
        migrations.RemoveField(
            model_name='sitesettings',
            name='leader_3_title',
        ),
        migrations.RemoveField(
            model_name='sitesettings',
            name='leader_3_bio',
        ),
        migrations.RemoveField(
            model_name='sitesettings',
            name='committee_1_name',
        ),
        migrations.RemoveField(
            model_name='sitesettings',
            name='committee_1_role',
        ),
        migrations.RemoveField(
            model_name='sitesettings',
            name='committee_1_bio',
        ),
        migrations.RemoveField(
            model_name='sitesettings',
            name='committee_2_name',
        ),
        migrations.RemoveField(
            model_name='sitesettings',
            name='committee_2_role',
        ),
        migrations.RemoveField(
            model_name='sitesettings',
            name='committee_2_bio',
        ),
        migrations.RemoveField(
            model_name='sitesettings',
            name='committee_3_name',
        ),
        migrations.RemoveField(
            model_name='sitesettings',
            name='committee_3_role',
        ),
        migrations.RemoveField(
            model_name='sitesettings',
            name='committee_3_bio',
        ),
        migrations.RemoveField(
            model_name='sitesettings',
            name='committee_4_name',
        ),
        migrations.RemoveField(
            model_name='sitesettings',
            name='committee_4_role',
        ),
        migrations.RemoveField(
            model_name='sitesettings',
            name='committee_4_bio',
        ),
        migrations.RemoveField(
            model_name='sitesettings',
            name='committee_5_name',
        ),
        migrations.RemoveField(
            model_name='sitesettings',
            name='committee_5_role',
        ),
        migrations.RemoveField(
            model_name='sitesettings',
            name='committee_5_bio',
        ),
        migrations.RemoveField(
            model_name='sitesettings',
            name='committee_6_name',
        ),
        migrations.RemoveField(
            model_name='sitesettings',
            name='committee_6_role',
        ),
        migrations.RemoveField(
            model_name='sitesettings',
            name='committee_6_bio',
        ),
        # Add new fields to HomePageSettings
        migrations.AddField(
            model_name='homepagesettings',
            name='kenya_highlight_image',
            field=cloudinary.models.CloudinaryField(blank=True, folder='missculture/pages/home/highlights', max_length=255, null=True, verbose_name='kenya_highlight'),
        ),
        migrations.AddField(
            model_name='homepagesettings',
            name='ambassador_highlight_image',
            field=cloudinary.models.CloudinaryField(blank=True, folder='missculture/pages/home/highlights', max_length=255, null=True, verbose_name='ambassador_highlight'),
        ),
        # Add leader/committee text fields to AboutPageSettings
        migrations.AddField(
            model_name='aboutpagesettings',
            name='leader_1_name',
            field=models.CharField(blank=True, default='', max_length=100),
        ),
        migrations.AddField(
            model_name='aboutpagesettings',
            name='leader_1_title',
            field=models.CharField(blank=True, default='', max_length=200),
        ),
        migrations.AddField(
            model_name='aboutpagesettings',
            name='leader_1_bio',
            field=models.TextField(blank=True, default=''),
        ),
        migrations.AddField(
            model_name='aboutpagesettings',
            name='leader_2_name',
            field=models.CharField(blank=True, default='', max_length=100),
        ),
        migrations.AddField(
            model_name='aboutpagesettings',
            name='leader_2_title',
            field=models.CharField(blank=True, default='', max_length=200),
        ),
        migrations.AddField(
            model_name='aboutpagesettings',
            name='leader_2_bio',
            field=models.TextField(blank=True, default=''),
        ),
        migrations.AddField(
            model_name='aboutpagesettings',
            name='leader_3_name',
            field=models.CharField(blank=True, default='', max_length=100),
        ),
        migrations.AddField(
            model_name='aboutpagesettings',
            name='leader_3_title',
            field=models.CharField(blank=True, default='', max_length=200),
        ),
        migrations.AddField(
            model_name='aboutpagesettings',
            name='leader_3_bio',
            field=models.TextField(blank=True, default=''),
        ),
        migrations.AddField(
            model_name='aboutpagesettings',
            name='committee_1_name',
            field=models.CharField(blank=True, default='', max_length=100),
        ),
        migrations.AddField(
            model_name='aboutpagesettings',
            name='committee_1_role',
            field=models.CharField(blank=True, default='', max_length=200),
        ),
        migrations.AddField(
            model_name='aboutpagesettings',
            name='committee_1_bio',
            field=models.TextField(blank=True, default=''),
        ),
        migrations.AddField(
            model_name='aboutpagesettings',
            name='committee_2_name',
            field=models.CharField(blank=True, default='', max_length=100),
        ),
        migrations.AddField(
            model_name='aboutpagesettings',
            name='committee_2_role',
            field=models.CharField(blank=True, default='', max_length=200),
        ),
        migrations.AddField(
            model_name='aboutpagesettings',
            name='committee_2_bio',
            field=models.TextField(blank=True, default=''),
        ),
        migrations.AddField(
            model_name='aboutpagesettings',
            name='committee_3_name',
            field=models.CharField(blank=True, default='', max_length=100),
        ),
        migrations.AddField(
            model_name='aboutpagesettings',
            name='committee_3_role',
            field=models.CharField(blank=True, default='', max_length=200),
        ),
        migrations.AddField(
            model_name='aboutpagesettings',
            name='committee_3_bio',
            field=models.TextField(blank=True, default=''),
        ),
        migrations.AddField(
            model_name='aboutpagesettings',
            name='committee_4_name',
            field=models.CharField(blank=True, default='', max_length=100),
        ),
        migrations.AddField(
            model_name='aboutpagesettings',
            name='committee_4_role',
            field=models.CharField(blank=True, default='', max_length=200),
        ),
        migrations.AddField(
            model_name='aboutpagesettings',
            name='committee_4_bio',
            field=models.TextField(blank=True, default=''),
        ),
        migrations.AddField(
            model_name='aboutpagesettings',
            name='committee_5_name',
            field=models.CharField(blank=True, default='', max_length=100),
        ),
        migrations.AddField(
            model_name='aboutpagesettings',
            name='committee_5_role',
            field=models.CharField(blank=True, default='', max_length=200),
        ),
        migrations.AddField(
            model_name='aboutpagesettings',
            name='committee_5_bio',
            field=models.TextField(blank=True, default=''),
        ),
        migrations.AddField(
            model_name='aboutpagesettings',
            name='committee_6_name',
            field=models.CharField(blank=True, default='', max_length=100),
        ),
        migrations.AddField(
            model_name='aboutpagesettings',
            name='committee_6_role',
            field=models.CharField(blank=True, default='', max_length=200),
        ),
        migrations.AddField(
            model_name='aboutpagesettings',
            name='committee_6_bio',
            field=models.TextField(blank=True, default=''),
        ),
        # Create VotingPageSettings model
        migrations.CreateModel(
            name='VotingPageSettings',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('hero_image', cloudinary.models.CloudinaryField(blank=True, folder='missculture/pages/voting', max_length=255, null=True, verbose_name='hero')),
                ('page_title', models.CharField(default='Vote', max_length=200)),
                ('page_subtitle', models.TextField(blank=True, default='Support your favorite contestants')),
                ('event_1_image', cloudinary.models.CloudinaryField(blank=True, folder='missculture/pages/voting/events', max_length=255, null=True, verbose_name='event_1')),
                ('event_2_image', cloudinary.models.CloudinaryField(blank=True, folder='missculture/pages/voting/events', max_length=255, null=True, verbose_name='event_2')),
                ('event_3_image', cloudinary.models.CloudinaryField(blank=True, folder='missculture/pages/voting/events', max_length=255, null=True, verbose_name='event_3')),
                ('event_4_image', cloudinary.models.CloudinaryField(blank=True, folder='missculture/pages/voting/events', max_length=255, null=True, verbose_name='event_4')),
                ('participant_1_image', cloudinary.models.CloudinaryField(blank=True, folder='missculture/pages/voting/participants', max_length=255, null=True, verbose_name='participant_1')),
                ('participant_2_image', cloudinary.models.CloudinaryField(blank=True, folder='missculture/pages/voting/participants', max_length=255, null=True, verbose_name='participant_2')),
                ('participant_3_image', cloudinary.models.CloudinaryField(blank=True, folder='missculture/pages/voting/participants', max_length=255, null=True, verbose_name='participant_3')),
                ('participant_4_image', cloudinary.models.CloudinaryField(blank=True, folder='missculture/pages/voting/participants', max_length=255, null=True, verbose_name='participant_4')),
                ('participant_5_image', cloudinary.models.CloudinaryField(blank=True, folder='missculture/pages/voting/participants', max_length=255, null=True, verbose_name='participant_5')),
                ('participant_6_image', cloudinary.models.CloudinaryField(blank=True, folder='missculture/pages/voting/participants', max_length=255, null=True, verbose_name='participant_6')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
            ],
            options={
                'verbose_name': 'Voting Page Settings',
                'verbose_name_plural': 'Voting Page Settings',
            },
        ),
        # Create ContactPageSettings model
        migrations.CreateModel(
            name='ContactPageSettings',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('hero_image', cloudinary.models.CloudinaryField(blank=True, folder='missculture/pages/contact', max_length=255, null=True, verbose_name='hero')),
                ('page_title', models.CharField(default='Contact Us', max_length=200)),
                ('page_subtitle', models.TextField(blank=True, default='Get in touch with us')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
            ],
            options={
                'verbose_name': 'Contact Page Settings',
                'verbose_name_plural': 'Contact Page Settings',
            },
        ),
        # Create FAQPageSettings model
        migrations.CreateModel(
            name='FAQPageSettings',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('hero_image', cloudinary.models.CloudinaryField(blank=True, folder='missculture/pages/faq', max_length=255, null=True, verbose_name='hero')),
                ('page_title', models.CharField(default='FAQ', max_length=200)),
                ('page_subtitle', models.TextField(blank=True, default='Frequently asked questions')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
            ],
            options={
                'verbose_name': 'FAQ Page Settings',
                'verbose_name_plural': 'FAQ Page Settings',
            },
        ),
    ]
