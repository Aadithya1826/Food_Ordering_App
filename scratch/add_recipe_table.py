import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'backend')))
from app.db import SessionLocal, engine
from app.models.recipe import RecipeIngredient
# Create the table
RecipeIngredient.__table__.create(bind=engine, checkfirst=True)
print("recipe_ingredients table created successfully.")
