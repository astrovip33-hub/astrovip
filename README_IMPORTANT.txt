ASTROVIP V5 ALL-IN-ONE

Include:
- design V4 Mobile păstrat
- butoane pentru plăți Stripe
- Articole & ghiduri
- Comunitate / forum local
- Programări prin WhatsApp
- formular contact prin WhatsApp

IMPORTANT DESPRE STRIPE
Butoanele sunt pregătite, dar pentru plăți reale trebuie introduse cele două Stripe Payment Links în index.html, la:
const STRIPE_LINKS={complete:'',premium:'https://buy.stripe.com/4gMeVcbz75J207y6fefjG00'};

Exemplu:
const STRIPE_LINKS={complete:'https://buy.stripe.com/...',premium:'https://buy.stripe.com/...'};

IMPORTANT DESPRE FORUM
În acest ZIP static forumul salvează mesajele doar în browserul vizitatorului (localStorage). Pentru un forum public comun tuturor utilizatorilor este necesar un backend/bază de date (de ex. Supabase/Cloudflare D1).
