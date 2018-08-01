from django.conf.urls import url, include
from rest_framework.routers import DefaultRouter
from api import views
from rest_framework.schemas import get_schema_view

schema_view = get_schema_view(title='Lyst')

# Create a router and register our viewsets with it.
router = DefaultRouter()
router.register(r'users', views.UserViewSet)
router.register(r'ingredient', views.IngredientViewSet)
router.register(r'recipe', views.RecipeViewSet)
router.register(r'procedure', views.ProcedureViewSet)

# The API URLs are now determined automatically by the router.
urlpatterns = [
    url(r'^schema/$', schema_view),
    url(r'^', include(router.urls))
]