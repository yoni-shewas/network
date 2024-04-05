from django.contrib import admin
from .models import User, Post, Comment, followers, Like

# Register your models here.

admin.site.register(User)
admin.site.register(Post)
admin.site.register(Comment)
admin.site.register(followers)
admin.site.register(Like)
