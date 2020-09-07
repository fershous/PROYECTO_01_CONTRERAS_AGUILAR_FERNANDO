from flask import Flask, jsonify, request
from flask_cors import CORS, cross_origin
from lifestore_file import lifestore_products, lifestore_sales, lifestore_searches
from auth import users

app = Flask(__name__)
app.config["DEBUG"] = True
CORS(app, support_credentials=True)

products = lifestore_products
sales = lifestore_sales
searches = lifestore_searches

productDictionary = [] #Diccionario de productos
productDictionary.append(0) #El primer elemento es cero para coincidir el id del producto con su posición
for product in products:
    newProduct = {
        "total_sold" : 0         ,
        "pieces_sold": 0         ,
        "id"         : product[0],
        "name"       : product[1],
        "price"      : product[2],
        "category"   : product[3],
        "stock"      : product[4],
        "reviews"    : [0]       ,
        "score"      : 0         ,
        "searches"   : 0
    }
    productDictionary.append(newProduct)

salesDictionary = []
for sale in sales:
    newSale = {
        "id_sale"   : sale[0],
        "id_product": sale[1],
        "score"     : sale[2],
        "date"      : sale[3],
        "refund"    : sale[4],
        "name"      : productDictionary[sale[1]]["name"]
    }
    salesDictionary.append(newSale)

"Product´s sales"
for sale in sales:
    productDictionary[sale[1]]["pieces_sold"] += 1 #Sum 1 to the product´s sales
    productDictionary[sale[1]]["total_sold"]  += productDictionary[sale[1]]["price"] #Sum the product´s price when a piece is sold

"Yearly sales"
total_annual = 0
for i in range(1, len(productDictionary)):
    total_annual += productDictionary[i]["total_sold"]

"Monthly sales"
monthly_average = 0
months =  [1,"Jan", 0, 0], [2,"Feb", 0, 0], [3,"Mar", 0, 0],[4,"Apr", 0, 0], [5,"May", 0, 0], [6,"Jun", 0, 0], [7,"Jul", 0, 0], [8,"Aug", 0, 0],[9,"Sep", 0, 0], [10,"Oct", 0, 0], [11,"Nov", 0, 0], [12,"Dec", 0, 0],

for sale in sales:
    month = sale[3].split('/')[1] #Split the date string and extract the month
    months[int(month) - 1][2] += productDictionary[sale[1]]["price"] #Get the sale and add it in it´s month(-1)
    months[int(month) - 1][3] += 1 #Get the sale and add it in it´s month(-1)

"Average pieces sold"
pieces_sold = len(sales)
average_sold = pieces_sold / 12
    
"Monthly average"
monthly_average = total_annual/12

"Customer´s reviews"
for sale in sales:
    productDictionary[sale[1]]["reviews"].append(sale[2]) #Array of customer´s reviews
    sale += [0]
    sale[5] = productDictionary[sale[1]]["name"]

"Review average"
for i in range(1, len(productDictionary)):
    if ((len(productDictionary[i]["reviews"]) - 1) > 0): #Avoid dividing by zero
        productDictionary[i]["score"] = sum(productDictionary[i]["reviews"]) / (len(productDictionary[i]["reviews"]) - 1)

"Searches"
top_products = [] * len(productDictionary)
for i in range(1, len(productDictionary)):
    productDictionary[searches[i-1][1]]["searches"] += 1

"Top 5 Selling months"
top_selling = []
for i in range (0, 5):
    top_selling.append(months[i]) #Insert first 5 months

top_selling.sort(reverse=True) #Order descending
    
for i in range(5, 12):
    if(months[i][3] > top_selling[4][3]): #If the last one (the smallest) is smaller than the next month, replace it
        top_selling.pop()
        top_selling.append(months[i])

"Top Selling products"
sorted_products = []
sorted_products = productDictionary[1:len(productDictionary)]
sorted_products = sorted(sorted_products, key = lambda k: k['pieces_sold'], reverse=True)
top_products = sorted_products[0:51]
worst_products = sorted_products[51:len(productDictionary)]

"Get categories and ocurrencies"
categories = []
for product in sorted_products:
    pieces = product["pieces_sold"]
    for i in range(0, pieces):
        categories.append(product["category"])
categories_count = {i: categories.count(i) for i in categories}


sorted_reviews = productDictionary[1:len(productDictionary)]
sorted_reviews = sorted(sorted_reviews, key = lambda k: k['score'], reverse=True)
top_reviews = sorted_reviews[0:50]
worst_reviews = sorted_reviews[51: len(productDictionary)]

most_popular = sorted_reviews[0]
less_popular = sorted_reviews[len(sorted_reviews) - 1]
sort = sorted(sorted_reviews, key = lambda k: k['pieces_sold'], reverse=True)
best_seller = sort[0]
worst_seller = sort[len(sorted_reviews) - 1]

@app.route('/data', methods=['GET'])
@cross_origin(supports_credentials=True)
def get_data():

    return jsonify({
        'total_annual' : total_annual,
        'monthly_sales' : months,
        'monthly_average': monthly_average,
        'pieces_sold': pieces_sold,
        'average_sold': average_sold,
        'product_dictionary': productDictionary,
        'top_selling': top_selling,
        'top_products': top_products,
        'worst_products': worst_products
        })

@app.route('/reviews', methods=['GET'])
@cross_origin(supports_credentials=True)
def get_reviews():


    return jsonify({
        'top_reviews': top_reviews,
        'worst_reviews': worst_reviews,
        'best_seller': best_seller,
        'worst_seller': worst_seller,
        'most_popular': most_popular,
        'less_popular': less_popular,
        'categories': categories_count
        })

@app.route('/stock', methods=['GET'])
@cross_origin(supports_credentials=True)
def get_stock():

    return jsonify({
        'products': productDictionary,
        'categories': categories_count
    })

@app.route('/sales', methods=['GET'])
@cross_origin(supports_credentials=True)
def get_sales():

    return jsonify({
        'sales': salesDictionary,
        'categories': categories_count,
        'filtered': sort
        
    })

@app.route('/auth', methods=['GET'])
@cross_origin(supports_credentials=True)
def auth():

    data = []
    flag = 0

    user = request.args.to_dict()
    for key, value in user.items():
        data.append(value)
    name = data[0]
    password = data[1]

    for user in users:
        if(user[0] == name):
            if(user[1] == password):
                flag = 1

    return jsonify({
        'auth': flag,
        'name': name,
        'password': password
    })

app.run()