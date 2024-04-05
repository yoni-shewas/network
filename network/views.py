from logging import PlaceHolder
import time
import json
from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render
from django.urls import reverse
from .models import User, Post, Like
from django import forms
from django.http import JsonResponse
from django.core.serializers import serialize


from .models import User


class postForm(forms.ModelForm):

    post = forms.Textarea(attrs={'maxlength': 500})

    # def __init__(self, *args, **kwargs):
    #     super(postForm, self).__init__(**kwargs)
    #     self.fields['post'].widget.attrs['class'] = "form-control"
    #     self.fields['post'].widget.attrs['maxlength'] = 500
    #     self.fields['post'].widget.attrs['rows'] = 5
    #     self.fields['post'].widget.attrs['required'] = True
    #     self.fields['post'].widget.attrs['label'] = "New Post"
    #     placeHolder = kwargs.get('placeholder')

    #     if placeHolder is not None:
    #         self.fields['post'].widget.attrs['placeholder'] = placeHolder

    class Meta:
        model = Post
        fields = ['post']


def index(request):
    form = postForm()
    return render(request, "network/index.html", {
        "form": form,
    })


def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "network/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "network/login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "network/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "network/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "network/register.html")


def post_view(request):
    if request.method == "POST":
        form = postForm(request.POST)
        if form.is_valid():
            post = form.save(commit=False)
            post.poster = request.user
            post.save()
            return HttpResponseRedirect(reverse("index"))
        else:
            print("hi")
    else:
        form = postForm()

    return render(request, "network/index.html", {
        "form": form,
    })


def posts_list(request):

    # Get start and end points
    start = int(request.GET.get("start") or 0)
    end = int(request.GET.get("end") or (start + 9))
    try:
        start = int(start)
        end = int(end)
    except (TypeError, ValueError):
        # Handle invalid start or end values
        return JsonResponse({'error': 'Invalid start or end value'}, status=400)

    posts = Post.objects.all().order_by('-date')[start:end+1]
    print(request.user.id)
    id = request.user.id

    data = {
        "posts": [
            {
                "id": post.id,
                "post": post.post,
                "likes": Like.objects.filter(post=post, liked=True).count(),
                "date": post.formatted_dateListed(),
                "poster": post.poster.username,
                "poster_id": post.poster.id,
                "edited": post.edited,
                "viewer": id,
                "liked": (lambda: Like.objects.get(post=post, user=request.user).liked if Like.objects.filter(post=post, user=request.user).exists() else False)()
            }
            for post in posts
        ],
    }
    # serialized_posts = serialize('json', posts)
    # deserialized_posts = json.loads(serialized_posts)
    # serialized_viewer = serialize('json', data)
    # deserialized_viewer = json.loads(serialized_viewer)

    # Artificially delay speed of response
    time.sleep(1)

    # Return list of posts
    return JsonResponse({
        "posts": data,
    })


def edit(request):

    if request.method == "PUT":
        data = json.loads(request.body)
        id = data.get("id")
        try:
            post = Post.objects.get(pk=id)
            post.post = data.get("content")
            post.save()
            return JsonResponse({"message": "Post updated successfully"})
        except Post.DoesNotExist:
            return JsonResponse({"error": "Post does not exist"}, status=404)
    else:
        return JsonResponse({"error": "Method not allowed"}, status=405)


def like(request):
    if request.method == "POST":
        data = json.loads(request.body)
        id = data.get("id")
        print(str(id) + " post id")
        post_id = id

        if id is None:
            return JsonResponse({'error': 'ID is missing or invalid'}, status=400)

        try:
            post = Post.objects.get(pk=post_id)
        except Post.DoesNotExist:
            return JsonResponse({'error': 'Post does not exist'}, status=404)

        try:
            user = Like.objects.get(post=post, user=request.user)
        except Like.DoesNotExist:
            # Handle the case where Like object doesn't exist
            # For example, you can create a new Like object here
            user = Like.objects.create(
                post=post, user=request.user, liked=False)

        if user.liked is True:
            user.liked = False
            user.save()
        else:
            user.liked = True
            user.save()

        likes = Like.objects.filter(post=post, liked=True).count()
        print(f'{likes} likes')

        return JsonResponse({
            "likes": likes,
            "isLiked": user.liked
        })
    else:
        return JsonResponse({
            "likes": 0
        })
