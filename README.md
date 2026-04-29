=========================
# PingFin – Clearing Bank

---------------------------
## Dag 1 – Key Requirements
---------------------------
### SEPA Flow
- OB → CB → BB → ACK terug  
- Validatie op elke stap  
- Status, codes en timestamps worden aangepast  

### Use Cases
- OB validation fails  
- Internal payment  
- CB validation fails  
- BB validation fails  
- Successful payment  

### Exceptions
- CB niet bereikbaar → retry  
- Geen ACK → timeout/fail   

### Setup
- GitHub repository  
- Trello (task management)  
- Postman (API testing)  
- Excel (simulatie)  

### API Basis
- POST /token  
- GET /banks  
- POST /po_in  
- GET /po_out  
- GET /ack_in  

### Simulation
- PO’s genereren (ook fouten)  
- PO versturen naar CB  
- ACK ophalen en verwerken


---------------------------
## Dag 2 – Key Requirements
---------------------------
### API Endpoints Design
- Ontwerp endpoints: /po_in, /po_out, /ack_in, /ack_out, /banks
- Definieer request/response structuur (JSON)

### Random Payment Order Generation
- Genereren van PO’s (geldig + foutieve cases)
- Gebruik voor testing van API

### API Documentation
- Documenteer alle endpoints (Swagger)
- Beschrijf parameters, responses en foutcodes

### GUI Design (Mock-ups)
- Ontwerp basis schermen (PO overzicht, logs)
- Toon status van transacties (success/fail)
