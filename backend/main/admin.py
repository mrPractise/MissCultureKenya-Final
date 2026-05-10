from django.contrib import admin, messages
from django.contrib.contenttypes.admin import GenericTabularInline
from django.http import HttpResponseRedirect
import cloudinary
from .models import (
    Ambassador, CulturalCommunity, CulturalHeritage, KenyaRegion,
    Achievement, Partner, SocialMediaPost, KenyaGalleryPhoto, SiteSettings,
    HomePageSettings, KenyaPageSettings, AmbassadorPageSettings,
    EventsPageSettings, GalleryPageSettings, PartnershipPageSettings, AboutPageSettings,
    VotingPageSettings, ContactPageSettings, FAQPageSettings
)


class KenyaGalleryPhotoInline(GenericTabularInline):
    model = KenyaGalleryPhoto
    extra = 3
    max_num = 10
    fields = ['image', 'caption', 'order']
    ct_field = 'content_type'
    ct_fk_field = 'object_id'


@admin.register(Ambassador)
class AmbassadorAdmin(admin.ModelAdmin):
    list_display = ['name', 'title', 'created_at']
    list_filter = ['created_at']
    search_fields = ['name', 'title']
    readonly_fields = ['created_at', 'updated_at']

    def has_add_permission(self, request):
        # Only allow one ambassador in the system
        return not Ambassador.objects.exists()


@admin.register(CulturalCommunity)
class CulturalCommunityAdmin(admin.ModelAdmin):
    list_display = ['name', 'region', 'featured', 'created_at']
    list_filter = ['region', 'featured', 'created_at']
    search_fields = ['name', 'region', 'description']
    list_editable = ['featured']
    inlines = [KenyaGalleryPhotoInline]


@admin.register(CulturalHeritage)
class CulturalHeritageAdmin(admin.ModelAdmin):
    list_display = ['title', 'heritage_type', 'featured', 'created_at']
    list_filter = ['heritage_type', 'featured', 'created_at']
    search_fields = ['title', 'description']
    list_editable = ['featured']
    inlines = [KenyaGalleryPhotoInline]


@admin.register(KenyaRegion)
class KenyaRegionAdmin(admin.ModelAdmin):
    list_display = ['name', 'featured', 'created_at']
    list_filter = ['featured', 'created_at']
    search_fields = ['name', 'description']
    list_editable = ['featured']
    inlines = [KenyaGalleryPhotoInline]


@admin.register(Achievement)
class AchievementAdmin(admin.ModelAdmin):
    list_display = ['title', 'achievement_type', 'year', 'featured', 'created_at']
    list_filter = ['achievement_type', 'year', 'featured', 'created_at']
    search_fields = ['title', 'description']
    list_editable = ['featured']
    inlines = [KenyaGalleryPhotoInline]


@admin.register(KenyaGalleryPhoto)
class KenyaGalleryPhotoAdmin(admin.ModelAdmin):
    list_display = ['__str__', 'content_type', 'object_id', 'order', 'created_at']
    list_filter = ['content_type', 'created_at']
    raw_id_fields = ['content_type']


@admin.register(Partner)
class PartnerAdmin(admin.ModelAdmin):
    list_display = ['name', 'partner_type', 'featured', 'created_at']
    list_filter = ['partner_type', 'featured', 'created_at']
    search_fields = ['name', 'description']
    list_editable = ['featured']


@admin.register(SocialMediaPost)
class SocialMediaPostAdmin(admin.ModelAdmin):
    list_display = ['platform', 'created_at', 'featured', 'imported_at']
    list_filter = ['platform', 'featured', 'created_at', 'imported_at']
    search_fields = ['content', 'post_id']
    list_editable = ['featured']
    readonly_fields = ['imported_at']


@admin.register(SiteSettings)
class SiteSettingsAdmin(admin.ModelAdmin):
    """Site-wide logos only — organized on their own tab"""
    readonly_fields = ['created_at', 'updated_at']

    fieldsets = (
        ('Logos', {
            'fields': (
                'logo_kenya',
                'logo_global',
                'mpesa_logo',
            ),
            'description': 'Upload logos for Miss Culture Global Kenya, Miss Culture Global, and M-Pesa payment branding'
        }),
        ('Metadata', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

    def has_add_permission(self, request):
        return not SiteSettings.objects.exists()

    def changeform_view(self, request, object_id=None, form_url="", extra_context=None):
        try:
            return super().changeform_view(
                request, object_id=object_id, form_url=form_url, extra_context=extra_context
            )
        except Exception as e:
            self.message_user(
                request,
                f"Error saving settings: {str(e)}",
                level=messages.ERROR,
            )
            return HttpResponseRedirect(request.path)


# ── Individual Page Settings Admins ──────────────────────────────────────────

@admin.register(HomePageSettings)
class HomePageSettingsAdmin(admin.ModelAdmin):
    """Home page settings — hero, highlights, and feature toggles"""
    readonly_fields = ['created_at', 'updated_at']
    
    fieldsets = (
        ('Hero Section', {
            'fields': ('hero_image', 'hero_video_url'),
            'description': 'Upload hero image or provide YouTube video URL'
        }),
        ('Welcome Message', {
            'fields': ('welcome_title', 'welcome_subtitle')
        }),
        ('Kenya Highlight Card (on Homepage)', {
            'fields': ('kenya_highlight_image', 'kenya_highlight_enabled'),
            'description': 'Image and toggle for the Kenya highlight card shown on homepage'
        }),
        ('Ambassador Highlight Card (on Homepage)', {
            'fields': ('ambassador_highlight_image', 'ambassador_highlight_enabled'),
            'description': 'Image and toggle for the Ambassador spotlight card shown on homepage'
        }),
        ('Metadata', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def has_add_permission(self, request):
        return not HomePageSettings.objects.exists()

    def changeform_view(self, request, object_id=None, form_url="", extra_context=None):
        try:
            return super().changeform_view(
                request, object_id=object_id, form_url=form_url, extra_context=extra_context
            )
        except Exception as e:
            self.message_user(
                request,
                f"Error saving settings: {str(e)}",
                level=messages.ERROR,
            )
            return HttpResponseRedirect(request.path)


@admin.register(KenyaPageSettings)
class KenyaPageSettingsAdmin(admin.ModelAdmin):
    """Kenya page settings — hero, content toggles"""
    readonly_fields = ['created_at', 'updated_at']
    
    fieldsets = (
        ('Hero Section', {
            'fields': ('hero_image', 'page_title', 'page_subtitle')
        }),
        ('Content Sections', {
            'fields': (
                'show_cultural_facts',
                'show_regions',
                'show_communities',
                'show_heritage',
                'show_achievements'
            ),
            'description': 'Toggle which sections appear on the Kenya page'
        }),
        ('Metadata', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def has_add_permission(self, request):
        return not KenyaPageSettings.objects.exists()

    def changeform_view(self, request, object_id=None, form_url="", extra_context=None):
        try:
            return super().changeform_view(
                request, object_id=object_id, form_url=form_url, extra_context=extra_context
            )
        except Exception as e:
            self.message_user(
                request,
                f"Error saving settings: {str(e)}",
                level=messages.ERROR,
            )
            return HttpResponseRedirect(request.path)


@admin.register(AmbassadorPageSettings)
class AmbassadorPageSettingsAdmin(admin.ModelAdmin):
    """Ambassador page settings — hero, profile, content toggles"""
    readonly_fields = ['created_at', 'updated_at']
    
    fieldsets = (
        ('Hero Section', {
            'fields': ('hero_image', 'page_title', 'page_subtitle')
        }),
        ('Profile Media', {
            'fields': ('profile_image', 'video_url'),
            'description': 'Profile image and featured video for the ambassador'
        }),
        ('Content Sections', {
            'fields': (
                'show_story_arc',
                'show_impact_stats',
                'show_core_messages',
                'show_gallery',
                'show_videos',
                'show_contact_cta'
            ),
            'description': 'Toggle which sections appear on the Ambassador page'
        }),
        ('Metadata', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def has_add_permission(self, request):
        return not AmbassadorPageSettings.objects.exists()

    def changeform_view(self, request, object_id=None, form_url="", extra_context=None):
        try:
            return super().changeform_view(
                request, object_id=object_id, form_url=form_url, extra_context=extra_context
            )
        except Exception as e:
            self.message_user(
                request,
                f"Error saving settings: {str(e)}",
                level=messages.ERROR,
            )
            return HttpResponseRedirect(request.path)


@admin.register(EventsPageSettings)
class EventsPageSettingsAdmin(admin.ModelAdmin):
    """Events page settings"""
    readonly_fields = ['created_at', 'updated_at']
    
    fieldsets = (
        ('Hero Section', {
            'fields': ('hero_image', 'page_title', 'page_subtitle')
        }),
        ('Metadata', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def has_add_permission(self, request):
        return not EventsPageSettings.objects.exists()

    def changeform_view(self, request, object_id=None, form_url="", extra_context=None):
        try:
            return super().changeform_view(
                request, object_id=object_id, form_url=form_url, extra_context=extra_context
            )
        except Exception as e:
            self.message_user(
                request,
                f"Error saving settings: {str(e)}",
                level=messages.ERROR,
            )
            return HttpResponseRedirect(request.path)


@admin.register(GalleryPageSettings)
class GalleryPageSettingsAdmin(admin.ModelAdmin):
    """Gallery page settings"""
    readonly_fields = ['created_at', 'updated_at']
    
    fieldsets = (
        ('Hero Section', {
            'fields': ('hero_image', 'page_title', 'page_subtitle')
        }),
        ('Metadata', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def has_add_permission(self, request):
        return not GalleryPageSettings.objects.exists()

    def changeform_view(self, request, object_id=None, form_url="", extra_context=None):
        try:
            return super().changeform_view(
                request, object_id=object_id, form_url=form_url, extra_context=extra_context
            )
        except Exception as e:
            self.message_user(
                request,
                f"Error saving settings: {str(e)}",
                level=messages.ERROR,
            )
            return HttpResponseRedirect(request.path)


@admin.register(PartnershipPageSettings)
class PartnershipPageSettingsAdmin(admin.ModelAdmin):
    """Partnership page settings"""
    readonly_fields = ['created_at', 'updated_at']
    
    fieldsets = (
        ('Hero Section', {
            'fields': ('hero_image', 'page_title', 'page_subtitle')
        }),
        ('Metadata', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def has_add_permission(self, request):
        return not PartnershipPageSettings.objects.exists()

    def changeform_view(self, request, object_id=None, form_url="", extra_context=None):
        try:
            return super().changeform_view(
                request, object_id=object_id, form_url=form_url, extra_context=extra_context
            )
        except Exception as e:
            self.message_user(
                request,
                f"Error saving settings: {str(e)}",
                level=messages.ERROR,
            )
            return HttpResponseRedirect(request.path)


@admin.register(AboutPageSettings)
class AboutPageSettingsAdmin(admin.ModelAdmin):
    """About page settings — hero, mission, leaders, committee"""
    readonly_fields = ['created_at', 'updated_at']
    
    fieldsets = (
        ('Hero Section', {
            'fields': ('hero_image', 'page_title', 'page_subtitle')
        }),
        ('Mission Section', {
            'fields': ('mission_image',)
        }),
        ('Leader 1', {
            'fields': ('leader_1_image', 'leader_1_name', 'leader_1_title', 'leader_1_bio'),
            'classes': ('collapse',)
        }),
        ('Leader 2', {
            'fields': ('leader_2_image', 'leader_2_name', 'leader_2_title', 'leader_2_bio'),
            'classes': ('collapse',)
        }),
        ('Leader 3', {
            'fields': ('leader_3_image', 'leader_3_name', 'leader_3_title', 'leader_3_bio'),
            'classes': ('collapse',)
        }),
        ('Committee Members', {
            'fields': (
                'committee_1_name', 'committee_1_role', 'committee_1_bio',
                'committee_2_name', 'committee_2_role', 'committee_2_bio',
                'committee_3_name', 'committee_3_role', 'committee_3_bio',
                'committee_4_name', 'committee_4_role', 'committee_4_bio',
                'committee_5_name', 'committee_5_role', 'committee_5_bio',
                'committee_6_name', 'committee_6_role', 'committee_6_bio',
            ),
            'classes': ('collapse',),
            'description': 'Organizing committee member details'
        }),
        ('Metadata', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def has_add_permission(self, request):
        return not AboutPageSettings.objects.exists()

    def changeform_view(self, request, object_id=None, form_url="", extra_context=None):
        try:
            return super().changeform_view(
                request, object_id=object_id, form_url=form_url, extra_context=extra_context
            )
        except Exception as e:
            self.message_user(
                request,
                f"Error saving settings: {str(e)}",
                level=messages.ERROR,
            )
            return HttpResponseRedirect(request.path)

 
 
 
 @ a d m i n . r e g i s t e r ( V o t i n g P a g e S e t t i n g s ) 
 
 c l a s s   V o t i n g P a g e S e t t i n g s A d m i n ( a d m i n . M o d e l A d m i n ) : 
 
         " " " V o t i n g   p a g e   s e t t i n g s   � �    h e r o ,   e v e n t   i m a g e s ,   p a r t i c i p a n t   i m a g e s " " " 
 
         r e a d o n l y _ f i e l d s   =   [ ' c r e a t e d _ a t ' ,   ' u p d a t e d _ a t ' ] 
 
         
 
         f i e l d s e t s   =   ( 
 
                 ( ' H e r o   S e c t i o n ' ,   { 
 
                         ' f i e l d s ' :   ( ' h e r o _ i m a g e ' ,   ' p a g e _ t i t l e ' ,   ' p a g e _ s u b t i t l e ' ) , 
 
                 } ) , 
 
                 ( ' V o t i n g   E v e n t   I m a g e s ' ,   { 
 
                         ' f i e l d s ' :   ( 
 
                                 ' v o t i n g _ e v e n t _ 1 _ i m a g e ' ,   ' v o t i n g _ e v e n t _ 2 _ i m a g e ' , 
 
                                 ' v o t i n g _ e v e n t _ 3 _ i m a g e ' ,   ' v o t i n g _ e v e n t _ 4 _ i m a g e ' , 
 
                         ) , 
 
                         ' c l a s s e s ' :   ( ' c o l l a p s e ' , ) 
 
                 } ) , 
 
                 ( ' V o t i n g   P a r t i c i p a n t   I m a g e s ' ,   { 
 
                         ' f i e l d s ' :   ( 
 
                                 ' v o t i n g _ p a r t i c i p a n t _ 1 _ i m a g e ' ,   ' v o t i n g _ p a r t i c i p a n t _ 2 _ i m a g e ' , 
 
                                 ' v o t i n g _ p a r t i c i p a n t _ 3 _ i m a g e ' ,   ' v o t i n g _ p a r t i c i p a n t _ 4 _ i m a g e ' , 
 
                                 ' v o t i n g _ p a r t i c i p a n t _ 5 _ i m a g e ' ,   ' v o t i n g _ p a r t i c i p a n t _ 6 _ i m a g e ' , 
 
                         ) , 
 
                         ' c l a s s e s ' :   ( ' c o l l a p s e ' , ) 
 
                 } ) , 
 
                 ( ' C o n t e n t   T o g g l e s ' ,   { 
 
                         ' f i e l d s ' :   ( ' s h o w _ v o t i n g _ e v e n t s ' ,   ' s h o w _ v o t i n g _ p a r t i c i p a n t s ' ,   ' s h o w _ l e a d e r b o a r d ' ) , 
 
                 } ) , 
 
                 ( ' M e t a d a t a ' ,   { 
 
                         ' f i e l d s ' :   ( ' c r e a t e d _ a t ' ,   ' u p d a t e d _ a t ' ) , 
 
                         ' c l a s s e s ' :   ( ' c o l l a p s e ' , ) 
 
                 } ) , 
 
         ) 
 
         
 
         d e f   h a s _ a d d _ p e r m i s s i o n ( s e l f ,   r e q u e s t ) : 
 
                 r e t u r n   n o t   V o t i n g P a g e S e t t i n g s . o b j e c t s . e x i s t s ( ) 
 
 
 
         d e f   c h a n g e f o r m _ v i e w ( s e l f ,   r e q u e s t ,   o b j e c t _ i d = N o n e ,   f o r m _ u r l = " " ,   e x t r a _ c o n t e x t = N o n e ) : 
 
                 t r y : 
 
                         r e t u r n   s u p e r ( ) . c h a n g e f o r m _ v i e w ( 
 
                                 r e q u e s t ,   o b j e c t _ i d = o b j e c t _ i d ,   f o r m _ u r l = f o r m _ u r l ,   e x t r a _ c o n t e x t = e x t r a _ c o n t e x t 
 
                         ) 
 
                 e x c e p t   E x c e p t i o n   a s   e : 
 
                         s e l f . m e s s a g e _ u s e r ( 
 
                                 r e q u e s t , 
 
                                 f " E r r o r   s a v i n g   s e t t i n g s :   { s t r ( e ) } " , 
 
                                 l e v e l = m e s s a g e s . E R R O R , 
 
                         ) 
 
                         r e t u r n   H t t p R e s p o n s e R e d i r e c t ( r e q u e s t . p a t h ) 
 
 
 
 
 
 @ a d m i n . r e g i s t e r ( C o n t a c t P a g e S e t t i n g s ) 
 
 c l a s s   C o n t a c t P a g e S e t t i n g s A d m i n ( a d m i n . M o d e l A d m i n ) : 
 
         " " " C o n t a c t   p a g e   s e t t i n g s   � �    h e r o   a n d   p a g e   d e t a i l s " " " 
 
         r e a d o n l y _ f i e l d s   =   [ ' c r e a t e d _ a t ' ,   ' u p d a t e d _ a t ' ] 
 
         
 
         f i e l d s e t s   =   ( 
 
                 ( ' H e r o   S e c t i o n ' ,   { 
 
                         ' f i e l d s ' :   ( ' h e r o _ i m a g e ' ,   ' p a g e _ t i t l e ' ,   ' p a g e _ s u b t i t l e ' ) , 
 
                 } ) , 
 
                 ( ' C o n t e n t   T o g g l e s ' ,   { 
 
                         ' f i e l d s ' :   ( ' s h o w _ c o n t a c t _ f o r m ' ,   ' s h o w _ s o c i a l _ l i n k s ' ,   ' s h o w _ o f f i c e _ l o c a t i o n s ' ) , 
 
                 } ) , 
 
                 ( ' M e t a d a t a ' ,   { 
 
                         ' f i e l d s ' :   ( ' c r e a t e d _ a t ' ,   ' u p d a t e d _ a t ' ) , 
 
                         ' c l a s s e s ' :   ( ' c o l l a p s e ' , ) 
 
                 } ) , 
 
         ) 
 
         
 
         d e f   h a s _ a d d _ p e r m i s s i o n ( s e l f ,   r e q u e s t ) : 
 
                 r e t u r n   n o t   C o n t a c t P a g e S e t t i n g s . o b j e c t s . e x i s t s ( ) 
 
 
 
         d e f   c h a n g e f o r m _ v i e w ( s e l f ,   r e q u e s t ,   o b j e c t _ i d = N o n e ,   f o r m _ u r l = " " ,   e x t r a _ c o n t e x t = N o n e ) : 
 
                 t r y : 
 
                         r e t u r n   s u p e r ( ) . c h a n g e f o r m _ v i e w ( 
 
                                 r e q u e s t ,   o b j e c t _ i d = o b j e c t _ i d ,   f o r m _ u r l = f o r m _ u r l ,   e x t r a _ c o n t e x t = e x t r a _ c o n t e x t 
 
                         ) 
 
                 e x c e p t   E x c e p t i o n   a s   e : 
 
                         s e l f . m e s s a g e _ u s e r ( 
 
                                 r e q u e s t , 
 
                                 f " E r r o r   s a v i n g   s e t t i n g s :   { s t r ( e ) } " , 
 
                                 l e v e l = m e s s a g e s . E R R O R , 
 
                         ) 
 
                         r e t u r n   H t t p R e s p o n s e R e d i r e c t ( r e q u e s t . p a t h ) 
 
 
 
 
 
 @ a d m i n . r e g i s t e r ( F A Q P a g e S e t t i n g s ) 
 
 c l a s s   F A Q P a g e S e t t i n g s A d m i n ( a d m i n . M o d e l A d m i n ) : 
 
         " " " F A Q   p a g e   s e t t i n g s   � �    h e r o   a n d   p a g e   d e t a i l s " " " 
 
         r e a d o n l y _ f i e l d s   =   [ ' c r e a t e d _ a t ' ,   ' u p d a t e d _ a t ' ] 
 
         
 
         f i e l d s e t s   =   ( 
 
                 ( ' H e r o   S e c t i o n ' ,   { 
 
                         ' f i e l d s ' :   ( ' h e r o _ i m a g e ' ,   ' p a g e _ t i t l e ' ,   ' p a g e _ s u b t i t l e ' ) , 
 
                 } ) , 
 
                 ( ' C o n t e n t   T o g g l e s ' ,   { 
 
                         ' f i e l d s ' :   ( ' s h o w _ s e a r c h ' ,   ' s h o w _ c a t e g o r i e s ' ,   ' s h o w _ c o n t a c t _ c t a ' ) , 
 
                 } ) , 
 
                 ( ' M e t a d a t a ' ,   { 
 
                         ' f i e l d s ' :   ( ' c r e a t e d _ a t ' ,   ' u p d a t e d _ a t ' ) , 
 
                         ' c l a s s e s ' :   ( ' c o l l a p s e ' , ) 
 
                 } ) , 
 
         ) 
 
         
 
         d e f   h a s _ a d d _ p e r m i s s i o n ( s e l f ,   r e q u e s t ) : 
 
                 r e t u r n   n o t   F A Q P a g e S e t t i n g s . o b j e c t s . e x i s t s ( ) 
 
 
 
         d e f   c h a n g e f o r m _ v i e w ( s e l f ,   r e q u e s t ,   o b j e c t _ i d = N o n e ,   f o r m _ u r l = " " ,   e x t r a _ c o n t e x t = N o n e ) : 
 
                 t r y : 
 
                         r e t u r n   s u p e r ( ) . c h a n g e f o r m _ v i e w ( 
 
                                 r e q u e s t ,   o b j e c t _ i d = o b j e c t _ i d ,   f o r m _ u r l = f o r m _ u r l ,   e x t r a _ c o n t e x t = e x t r a _ c o n t e x t 
 
                         ) 
 
                 e x c e p t   E x c e p t i o n   a s   e : 
 
                         s e l f . m e s s a g e _ u s e r ( 
 
                                 r e q u e s t , 
 
                                 f " E r r o r   s a v i n g   s e t t i n g s :   { s t r ( e ) } " , 
 
                                 l e v e l = m e s s a g e s . E R R O R , 
 
                         ) 
 
                         r e t u r n   H t t p R e s p o n s e R e d i r e c t ( r e q u e s t . p a t h ) 
 
 