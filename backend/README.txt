# Running backend
npm install
npm start

#deploying backend
zip up backend, log into aws console and upload to elastic beanstalk

# Elastic search sync (need pem file -> elastic-search.pem, must sync everytime you make a new collection or delete collection)
- sign in to ec2 instance
ssh -i elastic-search.pem bitnami@ec2-54-202-77-103.us-west-2.compute.amazonaws.com

- go into screen

# for redeploy dev
screen -r 11082

# for redploy prod
screen -r 13700


- run command to sync mongodb w elastic search
alias abc="./abc-0.5.1"

# Old DEV sync
abc import --tail --src_type=mongodb --src_uri="mongodb://oploguser:egExqJJLAe3czUtIK5XQXCEtTJ9FGRC7_VCaoCYcvdI@aws-us-west-2-portal.1.dblayer.com:18095/alma?authSource=admin" "https://l1v8Qa8Fk:a1efbcf0-a49c-4ec2-a6e6-684c9079444e@scalr.api.appbase.io/Alma-Search"

# Old PROD sync

abc import --tail --src_type=mongodb --src_uri="mongodb://oploguser:egExqJJLAe3czUtIK5XQXCEtTJ9FGRC7_VCaoCYcvdI@aws-us-west-2-portal.1.dblayer.com:18095/alma-prod?authSource=admin" "https://aPbtzmzZ6:1dd94c94-f022-4b00-af9a-a2e9876b0abc@scalr.api.appbase.io/Alma-Prod"

# redeploy sync prod
abc import --tail --src_type=mongodb --src_uri="mongodb://oploguser:Phorl-oHdGz7q69ROCRYTXn7_Sw3Qr6MpHlBs-4f2S0@aws-us-west-2-portal.0.dblayer.com:18220/alma-prod?authSource=admin" "https://aPbtzmzZ6:1dd94c94-f022-4b00-af9a-a2e9876b0abc@scalr.api.appbase.io/Alma-Prod"

# respoly sync dev
abc import --tail --src_type=mongodb --src_uri="mongodb://oploguser:bJx1ZiBrp86wOwm6IDZ8jd1rGzVj3skcucqLo5c7oYE@aws-us-west-2-portal.1.dblayer.com:18222/alma-dev?authSource=admin" "https://l1v8Qa8Fk:a1efbcf0-a49c-4ec2-a6e6-684c9079444e@scalr.api.appbase.io/Alma-Search"

# detach 
Ctrl+a
Ctrl+d

#API endpoint url
http://api.almacampus.com/v1/

#Mongo URI for dev
mongodb://aramaswa:Vince.carter15@aws-us-west-2-portal.1.dblayer.com:18090,aws-us-west-2-portal.0.dblayer.com:18090/alma?ssl=true

# Mongo URI for prod
mongodb://aramaswa:Vince.carter15@aws-us-west-2-portal.1.dblayer.com:18090,aws-us-west-2-portal.0.dblayer.com:18090/alma-prod?ssl=true


# New Mongo URI for prod
mongodb://aramaswa:Vince.carter15@aws-us-west-2-portal.0.dblayer.com:18219,aws-us-west-2-portal.1.dblayer.com:18219/alma-prod?ssl=true

# New Mongo URl for dev
mongodb://aramaswa:Vince.carter15@aws-us-west-2-portal.0.dblayer.com:18221,aws-us-west-2-portal.1.dblayer.com:18221/alma-dev?ssl=true


# Code walkthrough
app.js is the meat of the server
In the app directory, there are two subdirectories: models and routes
1) models
- Has our MongoDB schemas. See babyUser.js for simple example of a schema and user.js for a more sophisticated example
2) routes 
- These are our controllers and endpoints for the server
- Naming convention: name it the same as its model i.e. for the babyUser endpoints, there is a babyUser.js model and a babyUser.js route