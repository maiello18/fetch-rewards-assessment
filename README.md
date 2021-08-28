# fetch-rewards-assessment

# Installing
1. Have Node installed. Any recent version should be sufficient. Docs/Installer (https://nodejs.org/en/download/)
1.5 Have Postman (or any other tool/browswer where you can fire off the HTTP request to the backend). Postman download (https://www.postman.com/)
2. Clone the repo (https://docs.github.com/en/github/creating-cloning-and-archiving-repositories/cloning-a-repository-from-github/cloning-a-repository)
3. cd (change directory) into the cloned repo
4. Install the dependencies by running ```npm install```
5. Start the server by running ```npm start```
6. Now the server should be running and listening for requests

# Interacting With Server
- Using Postman import the example requests in this repo. You can use any API platform/broswer as well. These directions are tailored for Postman. 
    - See the fetch rewards.postman_collection.json file. 
    - In Postman - File -> Import -> Upload/browse to the file/select it. 
    - Postman then loads up the requests and you can fire them off from there
    - See the image below for where the requests are in the collection section, the send button, the response area, and also relevant url data, request body data, and the type of request. 
      ![alt text](https://github.com/maiello18/fetch-rewards-assessment/blob/main/postman-image.PNG?raw=true)

# Database Discussion
- This project uses an 'in memory' database. 
- It consists of a Map that maps a user id to that respective user's transaction/payer data
- Here is more of a breakdown and example
    - database.get(1) would be the same as getting user 1's (user id equal to 1) data.
    - The data object itself is an array of JSON objects that represent a single transaction. Example of this below. 
      ```json 
      {
        "payer": Nike,
        "points": 500,
        "timestamp": "2020-10-31T10:00:00Z",
        "used": false,
      }
      ```
      - **payer** - Represents the payer name for this transaction.
      - **points** - Represents the amount of points for the given payer transaction. Will be change over time if the points are used, eventually reaching zero. At which point used will go to 'true'. 
      - **timestamp** - Represents a Date object for this transaction.
      - **used** - Represents if the points for this transaction have been used.
  
# Endpoints Discussion
- This server has three visible endpoints
    1. /v1/fetch/users/#/balances
        - Get balances. Returns JSON representing the payer balances for the given user. The user is dictated by the id passed in the URL (see the #).
    2. /v1/fetch/users/#/transaction
        - Add transaction. Returns JSON representing if the transaction was successfully added or failed to be added for the given user. The user is dictated by the id passed in the URL (see the #). In the body of the request there must be a JSON object representing the transaction being wished to be added. Ex - { "payer": "DANNON", "points": -200, "timestamp": "2020-10-31T15:00:00Z" }.
    3. /v1/fetch/users/#/spend
        - Spend points. Returns JSON representing if the points were successfully added or failed to be added for the given user. The user is dictated by the id passed in the URL (see the #). In the body of the request there must be a JSON object representing the amount of points being wished to spent. Ex - { "points": 5000 }.