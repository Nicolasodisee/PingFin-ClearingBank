=========================
# PingFin – Clearing Bank

--------------------------------------
## Dag 1 – Analysis & Planning
-------------------

### SEPA Flow
- OB → CB → BB → ACK terug  
- Validatie en status update op elke stap  
- Gebruik van timestamps  

### Use Cases
- OB validation fails  
- CB validation fails  
- BB validation fails  
- Successful payment  

### Exceptions
- CB niet bereikbaar → retry  
- Geen ACK → timeout/fail  
- API errors → logging  

### Setup
- GitHub, Trello, Postman, Excel  
- Basis project structuur  

### API Basis
- POST /token  
- GET /banks  
- POST /po_in  
- GET /po_out  
- POST /ack_in  
- GET /ack_out  

### Database (concept)
- PO_IN, PO_OUT, ACK_IN, ACK_OUT, BANKS, LOGS  
- Logging + status tracking  

### Simulation
- PO’s genereren (valid + invalid)  
- Flow testen: OB → CB → BB → ACK  

### Output
- Flow analyse  
- Use cases & exceptions  
- Basis API & database ontwerp  


-----------------------------------
## Dag 2 – Implementation
-----------------------

### API Endpoints Design
- Implementatie van endpoints: /po_in, /po_out, /ack_in, /ack_out, /banks
- Correcte JSON request/response structuur volgens Swagger

### Random Payment Order Generation
- Genereren van PO’s (geldig + foutieve cases)
- Gebruiken voor API testing (Postman)

### API Documentation
- Documentatie van alle endpoints (Swagger)
- Beschrijving van parameters, responses en foutcodes

### GUI Design (Mock-ups)
- Ontwerp van basis schermen (PO overzicht, logs)
- Weergave van status (success/fail, codes)
