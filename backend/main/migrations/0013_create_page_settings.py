# Create page settings models

from django.db import migrations, models
import cloudinary.models


class Migration(migrations.Migration):
    dependencies = [
        ('main', '0012_sitesettings_mpesa_logo'),
    ]

    operations = [
        migrations.CreateModel(
            name='HomePageSettings',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('hero_image', cloudinary.models.CloudinaryField(blank=True, folder='missculture/pages/home', max_length=255, null=True, verbose_name='hero')),
                ('hero_video_url', models.URLField(blank=True, help_text='YouTube embed URL for hero background', null=True, verbose_name='hero_video_url')),
                ('welcome_title', models.CharField(default='Welcome to Miss Culture Global Kenya', max_length=200)),
                ('welcome_subtitle', models.TextField(blank=True, default='')),
                ('upcoming_event_enabled', models.BooleanField(default=True)),
                ('kenya_highlight_enabled', models.BooleanField(default=True)),
                ('ambassador_highlight_enabled', models.BooleanField(default=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
            ],
            options={
                'verbose_name': 'Home Page Settings',
                'verbose_name_plural': 'Home Page Settings',
            },
        ),
        migrations.CreateModel(
            name='KenyaPageSettings',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('hero_image', cloudinary.models.CloudinaryField(blank=True, folder='missculture/pages/kenya', max_length=255, null=True, verbose_name='hero')),
                ('page_title', models.CharField(default='Kenya', max_length=200)),
                ('page_subtitle', models.TextField(blank=True, default='Our homeland, our culture, our global stage.')),
                ('show_cultural_facts', models.BooleanField(default=True)),
                ('show_regions', models.BooleanField(default=True)),
                ('show_communities', models.BooleanField(default=True)),
                ('show_heritage', models.BooleanField(default=True)),
                ('show_achievements', models.BooleanField(default=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
            ],
            options={
                'verbose_name': 'Kenya Page Settings',
                'verbose_name_plural': 'Kenya Page Settings',
            },
        ),
        migrations.CreateModel(
            name='AmbassadorPageSettings',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('hero_image', cloudinary.models.CloudinaryField(blank=True, folder='missculture/pages/ambassador', max_length=255, null=True, verbose_name='hero')),
                ('profile_image', cloudinary.models.CloudinaryField(blank=True, folder='missculture/pages/ambassador', max_length=255, null=True, verbose_name='profile')),
                ('video_url', models.URLField(blank=True, help_text='Featured video URL', null=True, verbose_name='video_url')),
                ('page_title', models.CharField(default="Susan — Kenya's Voice on the World Stage", max_length=200)),
                ('page_subtitle', models.TextField(blank=True, default='Miss Culture Global Kenya Ambassador · Cultural diplomat · Youth champion')),
                ('show_story_arc', models.BooleanField(default=True)),
                ('show_impact_stats', models.BooleanField(default=True)),
                ('show_core_messages', models.BooleanField(default=True)),
                ('show_gallery', models.BooleanField(default=True)),
                ('show_videos', models.BooleanField(default=True)),
                ('show_contact_cta', models.BooleanField(default=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
            ],
            options={
                'verbose_name': 'Ambassador Page Settings',
                'verbose_name_plural': 'Ambassador Page Settings',
            },
        ),
        migrations.CreateModel(
            name='EventsPageSettings',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('hero_image', cloudinary.models.CloudinaryField(blank=True, folder='missculture/pages/events', max_length=255, null=True, verbose_name='hero')),
                ('page_title', models.CharField(default='Events', max_length=200)),
                ('page_subtitle', models.TextField(blank=True, default='Upcoming events and past highlights')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
            ],
            options={
                'verbose_name': 'Events Page Settings',
                'verbose_name_plural': 'Events Page Settings',
            },
        ),
        migrations.CreateModel(
            name='GalleryPageSettings',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('hero_image', cloudinary.models.CloudinaryField(blank=True, folder='missculture/pages/gallery', max_length=255, null=True, verbose_name='hero')),
                ('page_title', models.CharField(default='Gallery', max_length=200)),
                ('page_subtitle', models.TextField(blank=True, default='Photos and videos from our journey')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
            ],
            options={
                'verbose_name': 'Gallery Page Settings',
                'verbose_name_plural': 'Gallery Page Settings',
            },
        ),
        migrations.CreateModel(
            name='PartnershipPageSettings',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('hero_image', cloudinary.models.CloudinaryField(blank=True, folder='missculture/pages/partnership', max_length=255, null=True, verbose_name='hero')),
                ('page_title', models.CharField(default='Partnership', max_length=200)),
                ('page_subtitle', models.TextField(blank=True, default='Partner with us to make a difference')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
            ],
            options={
                'verbose_name': 'Partnership Page Settings',
                'verbose_name_plural': 'Partnership Page Settings',
            },
        ),
        migrations.CreateModel(
            name='AboutPageSettings',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('hero_image', cloudinary.models.CloudinaryField(blank=True, folder='missculture/pages/about', max_length=255, null=True, verbose_name='hero')),
                ('mission_image', cloudinary.models.CloudinaryField(blank=True, folder='missculture/pages/about', max_length=255, null=True, verbose_name='mission')),
                ('page_title', models.CharField(default='About Us', max_length=200)),
                ('page_subtitle', models.TextField(blank=True, default='Our story, mission, and values')),
                ('leader_1_image', cloudinary.models.CloudinaryField(blank=True, folder='missculture/pages/about/leaders', max_length=255, null=True, verbose_name='leader_1')),
                ('leader_2_image', cloudinary.models.CloudinaryField(blank=True, folder='missculture/pages/about/leaders', max_length=255, null=True, verbose_name='leader_2')),
                ('leader_3_image', cloudinary.models.CloudinaryField(blank=True, folder='missculture/pages/about/leaders', max_length=255, null=True, verbose_name='leader_3')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
            ],
            options={
                'verbose_name': 'About Page Settings',
                'verbose_name_plural': 'About Page Settings',
            },
        ),
    ]
