# WhatsApp Bot Conversation Example

## Complete Conversation Flow

### 1. Welcome Message
**Bot**: Ciao 👋 Benvenuto nel servizio di trading con bot automatico. Alla registrazione ottieni 20€ di bonus e il bot si attiva subito. Vuoi registrarti ora? Rispondi "Sì".

### 2. User Confirmation
**User**: Sì
**Bot**: Perfetto. Inviami nome e cognome in un unico messaggio (es. "Marco Rossi").

### 3. Name Collection
**User**: Marco Rossi
**Bot**: Ora scrivi la tua email che userai per accedere (es. nome@dominio.com).

### 4. Email Collection
**User**: marco.rossi@example.com
**Bot**: [Typing indicator...]
**Bot**: Fatto ✅ Il tuo account è stato creato. Bonus 20€ attivo e bot operativo.

### 5. Login Button
**Bot**: 🔗 Accedi al Trading Platform
**Bot**: 🔗 Link di accesso: https://v2-platform.dtrader.tech?token=BKNMnhi2QxqvpSlCWzznUqYN0qCaU5.1752669149

### 6. Support Request (Optional)
**User**: supporto
**Bot**: Se ti serve aiuto, scrivi "supporto"

## Error Handling Examples

### Invalid Email
**User**: invalid-email
**Bot**: Per favore inserisci un indirizzo email valido (es. nome@dominio.com).

### Invalid Name
**User**: A
**Bot**: Per favore inserisci un nome valido (almeno 2 caratteri).

### Wrong Confirmation
**User**: No
**Bot**: Per favore rispondi "Sì" per continuare con la registrazione.

## API Integration

The bot automatically:
1. Validates user input
2. Calls the API with proper headers
3. Handles API responses
4. Provides login URL on success
5. Shows appropriate error messages

## Features

- ✅ Italian language support
- ✅ Input validation
- ✅ API integration
- ✅ Error handling
- ✅ One-time login URLs
- ✅ Support system
- ✅ Session management 