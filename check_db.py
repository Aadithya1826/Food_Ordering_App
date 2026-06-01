import sqlite3

conn = sqlite3.connect('backend/food_ordering.db')
cursor = conn.cursor()
cursor.execute("PRAGMA table_info(tables);")
columns = cursor.fetchall()
for col in columns:
    print(col)
