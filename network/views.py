from logging import PlaceHolder
import time
import json
from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render
from django.urls import reverse

from .models import User, Post, Like, Follower, Comment
from django import forms
from django.http import JsonResponse
from django.core.serializers import serialize
from django.utils import timezone
from django.contrib.auth import get_user_model
from django.contrib.auth.decorators import login_required


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


@login_required
def post_view(request):
    print(timezone.now())
    if request.method == "POST":
        # Access the 'post' field directly from the form data
        data = json.loads(request.body)
        post = data.get("post")

        if not post:
            return JsonResponse({'error': 'No post provided'}, status=400)
        else:
            post = Post.objects.create(post=post, poster=request.user)
            post.save()
            Id = request.user.id
            data = {
                "id": post.id,
                "post": post.post,
                "likes": 0,
                "date": post.formatted_dateListed(),
                "poster": post.poster.username,
                "poster_id": post.poster.id,
                "edited": post.edited,
                "viewer": Id,
                "liked": False
            }
            # Artificially delay speed of response
            time.sleep(1)

            return JsonResponse({
                "data": data
            })
    else:
        return JsonResponse({'error': 'No post provided'}, status=400)


@login_required
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
    Id = request.user.id

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
                "viewer": Id,
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


@login_required
def edit(request):

    if request.method == "PUT":
        data = json.loads(request.body)
        id = data.get("id")
        try:
            post = Post.objects.get(pk=id)
            post.post = data.get("content")
            post.edited = True
            print(data.get("content"))
            post.save()
            return JsonResponse({"message": "Post updated successfully"})
        except Post.DoesNotExist:
            return JsonResponse({"error": "Post does not exist"}, status=404)
    else:
        return JsonResponse({"error": "Method not allowed"}, status=405)


@login_required
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


is_following = False  # Set initial value


@login_required
def profile(request):
    isUser = False

    start = int(request.GET.get("startP") or 0)
    end = int(request.GET.get("endP") or (start + 9))
    user = request.GET.get("user", None)

    print("User query parameter sadas")

    print(start, " ", end)

    try:
        start = int(start)
        end = int(end)
    except (TypeError, ValueError):
        # Handle invalid start or end values
        return JsonResponse({'error': 'Invalid start or end value'}, status=400)

    try:
        currentUser = str(request.user)
        currentuserID = User.objects.get(username=currentUser)
        currentuserID = int(currentuserID.id)

        if user != "null":
            is_following = False
            print("given user P" + str(user))
            try:
                userID = User.objects.get(username=user)
                userID = int(userID.id)
            except User.DoesNotExist:
                return JsonResponse({'error': 'User does not exist'}, status=404)

            posts = Post.objects.filter(
                poster=userID).order_by('-date')[start:end+1]
            try:
                follows = Follower.objects.get(
                    followed_user=userID, follower=currentuserID)
                followes_U = True
            except Follower.DoesNotExist:
                followes_U = False
        else:
            is_following = True
            user = str(request.user.username)
            # Update is_following here
            print("requested user P" + str(request.user.username))
            try:
                userID = User.objects.get(username=request.user.username)
                userID = int(userID.id)
                follows = Follower.objects.filter(follower=userID)
            except User.DoesNotExist:
                return JsonResponse({'error': 'User does not exist'}, status=404)

            posts = []

            if follows.exists():
                for user_obj in follows:
                    # Verify Follower objects
                    print(f"Follower object: {user_obj}")
                    followed_posts = Post.objects.filter(
                        poster=user_obj.followed_user.id).order_by('-date')[start:end+1]
                    for post in followed_posts:
                        # Verify followed posts
                        print(f"Followed post: {post}")
                        posts.append(post)

            followes_U = True

    except User.DoesNotExist:
        return JsonResponse({'error': 'User does not exist'}, status=404)

    try:
        followers = Follower.objects.filter(followed_user=userID).count()
    except Follower.DoesNotExist:
        followers = 0

    try:
        following = Follower.objects.filter(follower=userID).count()
    except Follower.DoesNotExist:
        following = 0

    # print(request.user)
    if str(request.user) == str(user) or user == "null":
        isUser = True
        # print("user here")
        # print(f"{posts} posts")
        Id = request.user.id

        data = {
            "isfollowing": followes_U,
            "followers": int(followers),
            "following": int(following),
            "userProfile": user,
            "user": currentUser,
            "isUser": isUser,
            "is_following": is_following,
            "posts": [
                {
                    "id": post.id,
                    "post": post.post,
                    "likes": Like.objects.filter(post=post, liked=True).count(),
                    "date": post.formatted_dateListed(),
                    "poster": post.poster.username,
                    "poster_id": post.poster.id,
                    "edited": post.edited,
                    "viewer": Id,
                    "liked": (lambda: Like.objects.get(post=post, user=request.user).liked if Like.objects.filter(post=post, user=request.user).exists() else False)()
                }
                for post in posts
            ]
        }
        # Artificially delay speed of response
        time.sleep(1)

        # Return list of posts
        return JsonResponse({
            "posts": data,
        })

    else:
        Id = request.user.id

        data = {
            "isfollowing": followes_U,
            "followers": int(followers),
            "following": int(following),
            "userProfile": user,
            "user": currentUser,
            "isUser": isUser,
            "posts": [
                {
                    "id": post.id,
                    "post": post.post,
                    "likes": Like.objects.filter(post=post, liked=True).count(),
                    "date": post.formatted_dateListed(),
                    "poster": post.poster.username,
                    "poster_id": post.poster.id,
                    "edited": post.edited,
                    "viewer": Id,
                    "liked": (lambda: Like.objects.get(post=post, user=request.user).liked if Like.objects.filter(post=post, user=request.user).exists() else False)()
                }
                for post in posts
            ]
        }
        # Artificially delay speed of response
        time.sleep(1)

        # Return list of posts
        return JsonResponse({
            "posts": data,
        })


User = get_user_model()


@login_required
def follow(request):
    if request.method == "POST":
        data = json.loads(request.body)
        userJs = data.get("user")

        try:
            userGet = User.objects.get(username=userJs)
        except User.DoesNotExist:
            return JsonResponse({'error': 'User does not exist'}, status=404)

        # Get the count of followers for the user being followed
        following_count = Follower.objects.filter(
            followed_user=userGet).count()
        print(f"{following_count} followed user")

        if request.user != userGet:
            try:
                follower = Follower.objects.get(
                    follower=request.user, followed_user=userGet)
                follower.delete()

                # If the follower relationship is deleted, decrement the following count
                following_count -= 1
                return JsonResponse({
                    "message": "You are no longer following this user.",
                    "isFollow": False,
                    "following": following_count,
                    "user": userJs
                })
            except Follower.DoesNotExist:
                follower = Follower.objects.create(
                    follower=request.user, followed_user=userGet)
                follower.save()
                # If a new follower relationship is created, increment the following count
                following_count += 1
                return JsonResponse({
                    "message": "You are now following this user.",
                    "isFollow": True,
                    "following": following_count,
                    "user": userJs
                })
        else:
            return JsonResponse({
                "message": "You cannot follow yourself.",
                "isFollow": False
            })
    else:
        return JsonResponse({"error": "Method not allowed"}, status=405)


@login_required
def comment(request):
    if request.method == "POST":
        data = json.loads(request.body)
        id = data.get("id")
        comment = data.get("comment")
        try:
            user = User.objects.get(username=request.user)
            post = Post.objects.get(pk=id)
            commented = Comment.objects.create(
                comment=comment, post=post, commenter=user)
            commented.save()
            return JsonResponse({"message": "Post updated successfully"})
        except Post.DoesNotExist:
            return JsonResponse({"error": "Post does not exist"}, status=404)
    elif request.method == "GET":
        start = int(request.GET.get("start") or 0)
        end = int(request.GET.get("end") or (start + 9))
        id = str(request.GET.get("id") or None)

        try:
            start = int(start)
            end = int(end)
        except (TypeError, ValueError):
            # Handle invalid start or end values
            return JsonResponse({'error': 'Invalid start or end value'}, status=400)

        comments = Comment.objects.filter(
            post=id).order_by('date')[start:end+1]

        data = {
            "comments": [
                {
                    "id": comment.id,
                    "post_id": comment.post.id,
                    "comment": comment.comment,
                    "commenter": str(comment.commenter.username),
                    "date": comment.formatted_dateListed(),
                    "user": str(request.user.username)
                }
                for comment in comments
            ],
        }

        # Return list of comments
        return JsonResponse(data)

    elif request.method == "DELETE":
        data = json.loads(request.body)
        id = data.get("id")
        try:
            comment = Comment.objects.get(pk=id)
            comment.delete()
            return JsonResponse({"message": "Post deleted successfully"})
        except Comment.DoesNotExist:
            return JsonResponse({"error": "Post does not exist"}, status=404)
    elif request.method == "PUT":
        data = json.loads(request.body)
        id = data.get("id")
        comment = data.get("comment")
        try:
            user = User.objects.get(username=request.user)
            post = Post.objects.get(pk=id)
            # Update the comment directly in the database
            Comment.objects.filter(
                post=post, commenter=user).update(comment=comment)
            return JsonResponse({"message": "Post updated successfully"})
        except Post.DoesNotExist:
            return JsonResponse({"error": "Post does not exist"}, status=404)

    else:
        return JsonResponse({"error": "Method not allowed"}, status=405)


def error_404(request, exception):
    return render(request, '404.html', status=404)
