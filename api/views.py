# Models
from api.models import Ingredient, Recipe
from django.contrib.auth.models import User
# Serializers
from api.serializers import IngredientSerializer, UserSerializer, RecipeSerializer
# Permissions
# from api.permissions import
# Rest Framework
from rest_framework import permissions, viewsets
from django_filters.rest_framework import DjangoFilterBackend


class IngredientViewSet(viewsets.ReadOnlyModelViewSet):
    """
    This viewset automatically provides `list` and `detail` actions.
    """
    queryset = Ingredient.objects.all()
    serializer_class = IngredientSerializer
    permission_classes = (permissions.IsAuthenticatedOrReadOnly,)

    def get_queryset(self):
        queryset = Ingredient.objects.all()
        return queryset


class RecipeViewSet(viewsets.ReadOnlyModelViewSet):
    """
    This viewset automatically provides `list` and `detail` actions.
    """
    queryset = Recipe.objects.all()
    serializer_class = RecipeSerializer
    permission_classes = (permissions.IsAuthenticatedOrReadOnly,)
    filter_backends = (DjangoFilterBackend,)
    filter_fields = ('name',)

    def get_queryset(self):
        queryset = Recipe.objects.all()

        return queryset


class UserViewSet(viewsets.ReadOnlyModelViewSet):
    """
    This viewset automatically provides `list` and `detail` actions.
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer
