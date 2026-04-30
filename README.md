# PingFin – Clearing Bank

## Dag 1 – Analysis & Planning

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


## Dag 2 – Implementation

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


## Dag 3 – Validation, Testing & Deployment

### API Testing (Postman)
- Testen van endpoints (/po_in, /po_out, /ack_in, /ack_out)
- Controle van responses (statuscodes, JSON)

### Validatie & Exception Handling
- Validatie van inkomende data (IBAN, bedrag, bankcodes)
- Afhandeling van fouten (NACK, error responses)

### Interbank Communicatie
- Testen van volledige flow (OB → CB → BB → ACK)
- Controle van correcte routing en responses

### Logging & Foutcodes
- Logging van transacties en events
- Gebruik van foutcodes voor analyse

### Timeout & Retry Handling
- Detectie van timeouts (geen ACK)
- Retry bij tijdelijke fouten

### Deployment
- Deployment via Docker containers
- Backend en database op server
- API bereikbaar voor integratie


## Dag 4 – Final Presentation

### Application Design
- Overzicht van architectuur (Database, API, GUI)
- Samenwerking tussen componenten

### Resultaten
- Werkende onderdelen (API, flow, logging)
- Beperkingen (GUI, validaties)

### Demo / Test Run
- End-to-end flow (OB → CB → BB → ACK)
- Test via Postman

### Project Management
- Gebruik van Trello (taken & planning)
- Verdeling van rollen binnen team

### Communicatie & Samenwerking
- Gebruik van GitHub (branches, PR’s)
- Teamoverleg en samenwerking

### Reflectie & Verbeterpunten
- Uitbreiding GUI en validatie
- Verbetering testing en planning
