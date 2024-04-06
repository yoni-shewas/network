
from django.urls import path, include
from django.conf import settings

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    path("posts/", views.posts_list, name="posts"),
    path("post", views.post_view, name="post"),
    path("like", views.like, name="like"),
    path("edit", views.edit, name="edit"),
]

# if settings.DEBUG:
#     import debug_toolbar
#     urlpatterns = [
#         path('__debug__/', include(debug_toolbar.urls)),
#         path("", views.index, name="index"),
#         path("login", views.login_view, name="login"),
#         path("logout", views.logout_view, name="logout"),
#         path("register", views.register, name="register"),
#         path("posts/", views.posts_list, name="posts"),
#         path("post", views.post_view, name="post"),
#         path("like", views.like, name="like"),
#         path("edit", views.edit, name="edit"),
#     ] + urlpatterns
