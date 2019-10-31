# Class 13

## Basic Auth
- sign up with raw string
- sign in is base64 encoded
- this takes strings and gives back tokens

## Bearer Auth
- Verify token and pull out any USER data
- Token contains id tied to user and any info
- Token is required for *Authorization* 
- *Authorization*: once I know who you are, are you authorized to do what you are attempting?
- Check tokens for validity

## JWT
- encodes JSON string
- protects data btwn 2 parties
- takes a public/private key and uses it to decode your information
