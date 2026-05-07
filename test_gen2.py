import os
import sys
from backend.app.utils.image_generator import generate_menu_item_image

result = generate_menu_item_image(39, "Finger Chips", "Delicious finger chips")
print("Result URL:", result)
