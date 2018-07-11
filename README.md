# bamazon
bamazon is an Amazon-like storefront that takes in orders from customers and deplete stock from the store's inventory.

## How to place an order:
1. Start application on command line by running the following commands:
  > *$ node bamazonCustomer.js*
2. Product list will be displayed:
  > ![Sketch](/images/products_list.png)
3. Enter **item_id** once list of products is displayed:
  > ![Sketch](/images/item_id.png)
4. Enter the number of **units** to buy for the selected item:
  > ![Sketch](/images/units.png)
5. If the selected product has sufficient stock, order will be placed and total cost will be displayed:
  >![Sketch](/images/place_order.png)
6. If there is no sufficient stock for the entered quantity, the following message is displayed:
  >![Sketch](/images/no_stock.png)
7. User will need to confirm if he/she would like to buy another product (this message is prompted when user submits an order or when there is no sufficient stock):
  >![Sketch](/images/loop.png)
8. If user enters **Yes** to question in step 7, application will start over.
9. If user enters **No** to question in step 7, session ends:
  >![Sketch](/images/end_session.png)
