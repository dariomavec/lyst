from rest_framework import serializers
from api.models import Ingredient, Recipe, List, Procedure
from django.contrib.auth.models import User


class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ('url', 'id', 'username')


class IngredientSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField()
    unit = serializers.SerializerMethodField()
    type = serializers.SerializerMethodField()

    class Meta:
        model = Ingredient
        fields = ('name', 'unit', 'type')

    def get_name(self, obj):
        return obj.name.title()

    def get_unit(self, obj):
        return obj.unit if obj.unit != 'none' else ''

    def get_type(self, obj):
        return obj.type.title()


class ListSerializer(serializers.HyperlinkedModelSerializer):
    ingredient = IngredientSerializer()
    quantity = serializers.SerializerMethodField()

    class Meta:
        model = List
        fields = ('ingredient', 'quantity',)

    def get_quantity(self, obj):
        return round(100 * obj.quantity) / 100


class RecipeSerializer(serializers.HyperlinkedModelSerializer):
    name = serializers.CharField()
    # ingredient = IngredientSerializer(read_only=True, many=True)
    list = ListSerializer(source='list_set', many=True)

    class Meta:
        model = Recipe
        fields = ('name', 'list')


class ProcedureSerializer(serializers.HyperlinkedModelSerializer):
    recipe = serializers.CharField(max_length=200)
    step_id = serializers.IntegerField()
    step_details = serializers.CharField(max_length=5000)

    class Meta:
        model = Procedure
        fields = ('recipe', 'step_id', 'step_details')

# groups = MembershipSerializer(source='membership_set', many=True)
# class MembershipSerializer(serializers.HyperlinkedModelSerializer):
#
#     id = serializers.Field(source='group.id')
#     name = serializers.Field(source='group.name')
#
#     class Meta:
#         model = Membership
#
#         fields = ('id', 'name', 'join_date', )
