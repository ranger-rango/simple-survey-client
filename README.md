# simple-survey-client
Web-UI code for the simple survey API

The Web-UI can be accessed through various API endpoints to:.
1. Access the Sky Survey - http://localhost:8000/api/questions
2. Submit your Responses - http://localhost:8000/api/questions/responses
3. View Responses - http://localhost:8000/api/questions/responses
The responses can be filtered through the email through - http://localhost:8000/api/questions/responses?email=example@example.com
4. Download Submitted Certificates - http://localhost:8000/api/questions/responses/certificates/{id} .
The id is the certificateId
