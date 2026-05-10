

@admin.register(VotingPageSettings)
class VotingPageSettingsAdmin(admin.ModelAdmin):
    """Voting page settings - hero and voting images"""
    readonly_fields = ['created_at', 'updated_at']
    
    fieldsets = (
        ('Hero Section', {
            'fields': ('hero_image', 'page_title', 'page_subtitle')
        }),
        ('Event Images', {
            'fields': ('event_1_image', 'event_2_image', 'event_3_image', 'event_4_image'),
            'classes': ('collapse',)
        }),
        ('Participant Images', {
            'fields': (
                'participant_1_image', 'participant_2_image', 'participant_3_image',
                'participant_4_image', 'participant_5_image', 'participant_6_image'
            ),
            'classes': ('collapse',)
        }),
        ('Metadata', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def has_add_permission(self, request):
        return not VotingPageSettings.objects.exists()

    def changeform_view(self, request, object_id=None, form_url="", extra_context=None):
        try:
            return super().changeform_view(
                request, object_id=object_id, form_url=form_url, extra_context=extra_context
            )
        except cloudinary.exceptions.AuthorizationRequired as e:
            self.message_user(
                request,
                f"Cloudinary upload failed: {e}. Check CLOUDINARY credentials on Railway.",
                level=messages.ERROR,
            )
            return HttpResponseRedirect(request.path)


@admin.register(ContactPageSettings)
class ContactPageSettingsAdmin(admin.ModelAdmin):
    """Contact page settings - hero only"""
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
        return not ContactPageSettings.objects.exists()

    def changeform_view(self, request, object_id=None, form_url="", extra_context=None):
        try:
            return super().changeform_view(
                request, object_id=object_id, form_url=form_url, extra_context=extra_context
            )
        except cloudinary.exceptions.AuthorizationRequired as e:
            self.message_user(
                request,
                f"Cloudinary upload failed: {e}. Check CLOUDINARY credentials on Railway.",
                level=messages.ERROR,
            )
            return HttpResponseRedirect(request.path)


@admin.register(FAQPageSettings)
class FAQPageSettingsAdmin(admin.ModelAdmin):
    """FAQ page settings - hero only"""
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
        return not FAQPageSettings.objects.exists()

    def changeform_view(self, request, object_id=None, form_url="", extra_context=None):
        try:
            return super().changeform_view(
                request, object_id=object_id, form_url=form_url, extra_context=extra_context
            )
        except cloudinary.exceptions.AuthorizationRequired as e:
            self.message_user(
                request,
                f"Cloudinary upload failed: {e}. Check CLOUDINARY credentials on Railway.",
                level=messages.ERROR,
            )
            return HttpResponseRedirect(request.path)
