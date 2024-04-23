
from django.urls import path, re_path
from django.conf import settings
from django.conf.urls.static import static
from django.views.static import serve
from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    path("posts", views.posts_list, name="posts"),
    path("post", views.post_view, name="post"),
    path("like", views.like, name="like"),
    path("edit", views.edit, name="edit"),
    path("profile", views.profile, name="profile"),
    path("follow", views.follow, name="follow"),
    path("comment", views.comment, name="comment"),
    path("comments", views.comment, name="comments"),
    path("editComment", views.comment, name="editComment"),
    path("delete", views.comment, name="delete"),

    re_path(r'^media/(?P<path>.*)$', serve,
            {'document_root': settings.MEDIA_ROOT}),
    re_path(r'^static/(?P<path>.*)$', serve,
            {'document_root': settings.STATIC_ROOT})

]
if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL,
                          document_root=settings.STATIC_ROOT)

handler404 = 'network.views.error_404'
