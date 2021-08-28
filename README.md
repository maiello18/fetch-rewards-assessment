# fetch-rewards-assessment
## Interview coding assessment for Fetch Rewards

# Installing
1. Have Node installed. Any recent version should be sufficient. Docs/Installer (https://nodejs.org/en/download/)
1.5 Have Postman (or any other tool/browswer where you can fire off the HTTP request to the backend). Postman download (https://www.postman.com/)
2. Clone the repo (https://docs.github.com/en/github/creating-cloning-and-archiving-repositories/cloning-a-repository-from-github/cloning-a-repository)
3. cd (change directory) into the cloned repo
4. Install the dependencies by running ```npm install```
5. Start the server by running ```npm start```
6. Now the server should be running and listening for requests

# Interacting With Server
- Using Postman import the example requests in this repo. 
    - See the fetch rewards.postman_collection.json file. 
    - In Postman - File -> Import -> Browse to the file/select it. 
    - Postman then loads up the requests and you can fire them off from there
    - See the image below for where the requests are in the collection section, the send button, the response area, and also relevant url data, and body data. 

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
  