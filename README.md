# Disney Travel Planner V2

This is a static Firebase web app. Open `index.html` through a web server (not `file://`) so that ES modules and Web Crypto are available.

## Firestore model

Data is scoped by anonymous Firebase user:

```
artifacts/{appId}/users/{uid}/cards/{cardId}
artifacts/{appId}/users/{uid}/vault/{cardId}
artifacts/{appId}/users/{uid}/settings/{settingId}
```

`cards` contains standard itinerary and guide cards. Every `vault` document contains only `ciphertext`, `iv`, and a format version (plus non-sensitive update metadata). The `vault/_check` record is encrypted and verifies the PIN without saving a PIN or password verifier. `settings/vault-meta` holds only the random PBKDF2 salt and format version.

## Firebase rules

Deploy [firestore.rules](./firestore.rules) before use. It restricts every V2 document to its authenticated user; anonymous authentication must be enabled in Firebase Authentication.

## Security model

- PIN is held only during the unlock interaction and is never stored.
- Web Crypto PBKDF2 (SHA-256, 210,000 iterations) derives a non-extractable AES-256-GCM key.
- A fresh random 96-bit IV is generated for every encrypted Vault record.
- Changing PIN decrypts Vault data in memory and re-encrypts it under a fresh salt/key.
- Sharing sends only the app URL; Vault data is never added to a link or share payload.
