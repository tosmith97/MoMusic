require('dotenv').config(); //instatiate environment variables

CONFIG = {} //Make this global to use all over the application

CONFIG.app = process.env.APP || 'development';
CONFIG.port = process.env.PORT || '8000';

CONFIG.db_dialect = process.env.DB_DIALECT || 'mongo';
CONFIG.db_host = process.env.DB_HOST || '';
CONFIG.db_ip = process.env.DB_IP || 'hi@12.345.678.910'
CONFIG.db_port = process.env.DB_PORT || '27017';
CONFIG.db_name = process.env.DB_NAME || 'name';
CONFIG.db_user = process.env.DB_USER || 'root';
CONFIG.db_password = process.env.DB_PASSWORD || 'db-password';
CONFIG.mongo_uri = process.env.MONGO_URI || 'mongo-uri';

CONFIG.mailgun_username = process.env.MAILGUN_USERNAME || 'username';
CONFIG.mailgun_password = process.env.MAILGUN_PASSWORD || 'password';
CONFIG.jwt_encryption = process.env.JWT_ENCRYPTION || 'jwt_please_change';
CONFIG.jwt_expiration = process.env.JWT_EXPIRATION || '10000';

CONFIG.spotify_client_id = process.env.SPOTIFY_CLIENT_ID;
CONFIG.spotify_client_secret = process.env.SPOTIFY_CLIENT_SECRET;
CONFIG.spotify_redirect_uri = process.env.SPOTIFY_REDIRECT_URI;

CONFIG.twilio_auth_token = process.env.TWILIO_AUTH_TOKEN;
CONFIG.twilio_account_sid = process.env.TWILIO_ACCOUNT_SID;
CONFIG.twilio_number = process.env.TWILIO_NUMBER;
