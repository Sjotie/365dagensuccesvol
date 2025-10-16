plan2

Hier is een **uitgewerkt, deelbaar document** voor *Pad A — WhatsApp‑first*, aangevuld met **actuele (2025) technische mogelijkheden én beperkingen** van WhatsApp Business / Cloud API, en verweven met de AI‑rollen die de menselijke verbinding versterken.

---

# Pad A — WhatsApp‑first

**AI‑gefaciliteerde cirkels in WhatsApp, met focus op offline verbinding**

## 1) Executive summary

We benutten WhatsApp als laagdrempelige voordeur om mensen lokaal te verbinden en kleine “cirkels” te laten ontstaan. Technisch leunen we op de **WhatsApp Cloud API** (door Meta gehost) voor 1‑op‑1 onboarding, **Flows** (mini‑formulieren in chat), interactieve berichten en—sinds 2025—op de **Groups API** om groepschats programmatisch aan te maken en te beheren via invite‑links. Belangrijke spelregels: 24‑uurs service‑window, vooraf goedgekeurde **message templates** voor proactieve berichten, en aantoonbare **opt‑in**. Pricing is in transitie van “per conversatie” naar **per bericht**; we ontwerpen daarom “spaarzaam‑proactief” en “rijk‑in‑reactie”. ([Facebook for Developers][1])

---

## 2) Wat kan nu wél (en wat niet) op WhatsApp

### 2.1 Capabilities die we inzetten

* **1‑op‑1 gesprekken** via Cloud API (tekst, knoppen, lijsten, media, locatie). ([Facebook for Developers][2])
* **WhatsApp Flows**: ingebedde formulieren/keuzepaden voor onboarding, locatie, voorkeuren, consent, etc. (native in chat).
* **Groups API** (nieuw): via API **groep aanmaken** + **invite‑link genereren**; groepen zijn “invite‑only” (deelnemers treden zelf toe). We kunnen groepsdetails beheren en notificaties ontvangen via webhooks. ([Facebook for Developers][3])
* **Webhooks**: status‑updates, inkomende berichten, joins/leave events verwerken en automations/AI‑acties triggeren. ([Facebook for Developers][4])
* **Schaalbaarheid**: Cloud API is door Meta gehost en ondersteunt hoge doorvoer; we plannen batch/vertraging om “rate‑limit spikes” te vermijden. (Cloud API documentatie; throughput/hosted vs on‑prem verschillen gedocumenteerd.) ([Facebook for Developers][1])

### 2.2 Beperkingen en belangrijke “regels van de weg”

* **24‑uurs service‑window**: op een 1‑op‑1 chat mag je vrij antwoorden tot 24 uur na het laatste user‑bericht. Buiten dat venster zijn **template‑berichten** nodig (voor o.a. reminders/nudges). Dit beleid blijft leidend, ook als de gebruiker in een groep zit. ([WhatsApp Business][5])
* **Templates & opt‑in**: proactieve berichten (marketing/utility/authentication) vereisen **door WhatsApp goedgekeurde templates** én aantoonbare **opt‑in**. ([Facebook for Developers][6])
* **Groepen zijn uitnodigings‑gebaseerd**: de API **voegt mensen niet stilzwijgend toe**; je deelt een **invite‑link** en een deelnemer kiest zelf voor “Join”. Dit borgt consent en privacy by design. ([Facebook for Developers][3])
* **Flows in groepen**: Flows zijn primair gedocumenteerd voor 1‑op‑1 conversaties. Voor elke stap met persoonsgegevens (adres, contact, voorkeuren) routeren we **naar 1‑op‑1**, daarna kan de AI in de groep samenvatten/activeren. (Best‑practice; groepsondersteuning is niet als zodanig gedocumenteerd.)
* **Groepsgrootte & UX**: WhatsApp‑groepen ondersteunen **tot 1.024 leden**; “Threads” bestaan wel in de consumenten‑app maar hebben (nog) geen gedocumenteerde API‑exposure—niet op vertrouwen voor MVP. ([WhatsApp Help Center][7])
* **Pricing verandert**: Meta verschuift van “conversation‑based pricing” (deprecated) naar **per‑message pricing** per categorie/land. We ontwerpen flows en nudges met minimale template‑calls. Check actuele tarieven per markt & categorie. ([Facebook for Developers][8])

> **Kortom**: 1‑op‑1 = rijk en formeel (Flows, consent, data); **groep** = sociaal en activerend (nudges, samenvattingen, afspraken). De AI schakelt ertussen.

---

## 3) AI‑rollen (met praktische voorbeelden in WhatsApp)

We modelleren vier AI‑rollen die **menselijke verbinding** versterken in plaats van vervangen:

### A) **Concierge (1‑op‑1, Flow‑gedreven)**

* **Wat**: verwelkomt, vraagt woonplaats (globaal), beschikbaarheid, gewenste intensiteit (1 of 2 “contactmomenten” p/w), comfortniveau (introvert/extern), consent voor groeps‑uitnodiging.
* **Hoe**: WhatsApp **Flow** met keuzeknoppen (dagen/tijden), vrije tekst voor woonwijk, expliciete **opt‑in** (checkbox + korte privacytekst).
* **Output**: profielkaartje (bv. *“Amsterdam‑Noord, avond, 2× per week, introvert”*), en **AI‑suggestie** voor passende cirkel (postcode‑cluster).
* **Menselijke verbinding**: maakt drempel laag; stelt gerust (“je hoeft niets, we bouwen het rustig op”).

### B) **Cirkel‑bouwer (Groups API)**

* **Wat**: maakt een WhatsApp‑groep met duidelijke naam (bv. *“A’dam‑Noord | Cirkeltje 27 | okt 2025”*), plaatst omschrijving/huishoudregels, en deelt **invite‑link** in 1‑op‑1 chats met kandidaten. ([Facebook for Developers][9])
* **Hoe**: *Create Group* → invite‑link → gepersonaliseerde **template‑uitnodiging** (“Je bent gematcht met een cirkeltje om de hoek — klik om te joinen”). ([Facebook for Developers][9])
* **Menselijke verbinding**: benadrukt nabijheid (*“3 deelnemers wonen binnen 1 km”*), en stelt meteen een **eerste offline micro‑actie** voor (koffiewandeling).

### C) **Facilitator (in de groep)**

* **Wat**: start ritme (bv. **ma/vr**), post *korte* check‑ins, stelt *één concrete vraag*, en sluit af met “knoop‑doorhakker” (poll/keuze).
* **Hoe**: in‑groep berichten + **1‑op‑1 Flow** voor agenda‑prikken of voorkeuren (met terugkoppeling in de groep). Flows blijven 1‑op‑1; de groep krijgt de samenvatting (“4/6 kunnen woensdag 19:30 → locatie: Noorderpark”).
* **Menselijke verbinding**: AI bewaakt dat ieder **aan bod komt** (noemt namen, waardeert kleine stappen), en **herinnert zacht** (“Stilte is oké. Zin in een ‘tien‑minuten‑ommetje’ check‑in?”).

### D) **Safety‑ & Quality‑sentry**

* **Wat**: monitort toon en veiligheidssignalen, beschermt privacy (verzoekt 1‑op‑1 bij gevoelige thema’s), escaleert bij flags naar mens.
* **Hoe**: content‑filters + regels (geen medische claims, geen persoonlijke diagnoses). **Beleid compliant** (24‑uurs venster, opt‑in, template‑gebruik). ([WhatsApp Business][5])
* **Menselijke verbinding**: AI is **duidelijk géén therapeut**; stimuleert juist **mens‑mens** contact (bijv. buddyparen, mini‑walks).

---

## 4) Einde‑tot‑einde gebruikersflow (MVP)

1. **Aanmelding (1‑op‑1)**

   * Ingang via **QR/wa.me** → “JOIN”. Concierge start **Flow** (locatie globaal, beschikbaarheid, consent).
2. **Match & uitnodiging**

   * AI vormt een cluster (postcode/voorkeur) → **Create Group** → **invite‑link** per persoon via **template** (proactief; voldoet aan opt‑in). ([Facebook for Developers][9])
3. **Groepsstart**

   * Facilitator post welkom, huishoudregels en **eerste mini‑challenge** met eenvoudige call‑to‑action (bv. *“Wie is er dit weekend vrij voor een 20‑minuten wandeling? Reageer met 1/2/3.”*).
4. **Informatie verzamelen/afspraken vastleggen**

   * **1‑op‑1 Flow** vraagt beknopt om exacte wijk/voorkeursdagen; AI post in groep de **aggregate** (geen PII).
5. **Ritme & nudges**

   * Binnen 24u‑vensters **vrije** service‑berichten; voor “stilgevallen” groepen stuurt AI **template‑nudges** (max 1–2 p/w), met opt‑out. ([WhatsApp Business][5])
6. **Offline ontmoeting**

   * AI bevestigt samenvatting (tijd/plek), deelt **locatie‑pin** (API ondersteunt locatie‑berichten), en checkt achteraf kort in. ([Facebook for Developers][10])

---

## 5) Technische architectuur (overzicht)

* **WABA / Cloud API** (Meta) + **phone_number_id** voor 1‑op‑1 & Groups API. Webhook endpoint (HTTPS) voor events. ([Facebook for Developers][1])
* **AI‑orchestrator** met RAG (boek/methodiek, tone‑of‑voice) + **policy‑guard** (no‑go’s, safety).
* **Template‑beheer** (lifecycle: indienen → goedkeuring → versiebeheer). ([Facebook for Developers][6])
* **Flows‑definities** (onboarding, agenda‑prikker, feedback).
* **CRM/ESP‑koppeling** (MailBlue/ActiveCampaign) voor consent‑logging en lifecycle‑segmentatie.
* **Analytics**: deelname, respons‑latency, no‑shows, “twee contactmomenten per week” KPI.

**Schaal & doorvoer**
Cloud API is gehost door Meta (minder infra‑zorg). Documentatie vermeldt hoge throughput; we implementeren **back‑off & queueing** om pieken te dempen en foutcodes (bv. throughput reached) op te vangen. ([Facebook for Developers][1])

---

## 6) Policy, privacy & pricing (samengevat)

* **24‑uur user care** (service‑window) → vrij antwoorden binnen 24u na user‑bericht; daarna templates. **Altijd** aantoonbare opt‑in. ([WhatsApp Business][5])
* **Templates**: categorieën **marketing / utility / authentication / service**; vooraf indienen & laten goedkeuren. Slimme variabelen, neutrale copy. ([Facebook for Developers][6])
* **Pricing**: Meta zet in 2025 door naar **per‑message**; raadpleeg actuele tarieven per markt/categorie en plan template‑economy (zo min mogelijk proactief, zoveel mogelijk user‑initiated). ([WhatsApp Business][11])
* **Data**: E2E naar de gebruiker; binnen jullie backend behandelen we inhoud conform privacybeleid (data‑minimisatie, audit‑log van consent). (Cloud API algemene docs.) ([Facebook for Developers][1])

---

## 7) Concrete AI‑interacties (voorbeeldteksten)

**Template‑uitnodiging (utility / opt‑in vereist)**

> *Hoi {{first_name}}! We hebben een **buurt‑cirkeltje** voor je gevonden (±{{distance}} km). Wil je meedoen?*
> **Join‑link:** {{invite_url}}
> *Je kunt altijd stoppen met “STOP”.*

**Facilitator (groepsbericht, maandagochtend)**

> *Goedemorgen cirkel! Deze week een **10‑min ommetje** + één vraag:*
> *“Wat gaf je gisteren een klein moment van rust?”*
> *Reageer met 1/2/3 en wie wil, stelt een tijd voor (kort is goed).*

**Check‑in (1‑op‑1 Flow, na eerste meetup)**

> *Fijn dat je erbij was! Wil je aangeven hoe het was (⭐–⭐⭐⭐⭐⭐) en of woensdagavond vaker past?*

---

## 8) Risico’s & mitigatie

| Risico                                              | Mitigatie                                                                                                                                     |
| --------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| **Te veel proactieve berichten** → kosten/kwaliteit | Strikt **template‑budget**; voorkeur voor user‑initiated; **samengestelde** groepsupdates i.p.v. individuele pings. ([WhatsApp Business][11]) |
| **Groeps‑ruis / geen threads**                      | Strakke micro‑rituelen: één vraag per post; samenvattingen; “stilte is oké”‑cadans; polls via simpele knoppen.                                |
| **Beleidsschending** (24u, consent)                 | Policy‑guard in AI; automatische checks vóór verzenden; alle consents **gelogd**. ([WhatsApp Business][5])                                    |
| **Flows in groep**                                  | **Altijd 1‑op‑1** voor formulieren; groep krijgt alleen non‑PII samenvattingen.                                                               |
| **Adoptie**                                         | QR’s op events/boek; “probeer 10 dagen” micro‑challenge; eerste winst binnen 48u.                                                             |

---

## 9) MVP‑scoping (6–8 weken, functioneel)

**Scope**

* 1‑op‑1 **onboarding Flow** + consent logging.
* **Create Group** + invite‑verspreiding per template. ([Facebook for Developers][9])
* **Facilitator‑cadans** (welkomstpost, 2× p/w check‑in, “knoop‑doorhakker”).
* **Safety‑guard** + escalatiepad naar mens.
* **Dashboards**: aantal aanmeldingen, join‑ratio, 1e offline afspraak, retentie 4 weken.

**Niet in MVP (bewust)**

* Community‑threads of kanaalweergaven (niet API‑gedocumenteerd). ([The Verge][12])
* Volledige CRM‑journeys; beperken tot consent/segmenten.

---

## 10) Waarom dit pad **menselijke verbinding** maximaliseert

* WhatsApp is **drempelloos**; AI doet het **organiseren**, mensen doen het **ontmoeten**.
* De AI wisselt vanzelf tussen **intiem 1‑op‑1** (Flow, intenties) en **sociale groep** (ritme, aanmoediging).
* Alle “zware” UX (plannen, samenvatten, herinneren) wordt **frictieloos** afgehandeld, zodat de **mens‑mens interactie** centraal staat.

---

### Bijlage A — Referenties (key specs & policies)

* WhatsApp Cloud API — **Overzicht / Messaging types / Webhooks**. ([Facebook for Developers][1])
* **Flows** (formulieren in chat).
* **Groups API** (invite‑only, create & manage). ([Facebook for Developers][3])
* **Message templates** (gebruik/limieten). ([Facebook for Developers][6])
* **Business Messaging Policy** (24‑uur, consent, content). ([WhatsApp Business][5])
* **Pricing** (per‑message; deprecatie conversatiemodel). ([WhatsApp Business][11])
* **Groepsgrootte** (tot 1.024 deelnemers). ([WhatsApp Help Center][7])

---

## Wat je hiermee kunt doen

* **Intern delen** als vertrekdocument voor besluitvorming.
* **Templates & Flows** direct laten schrijven/bouwen op basis van de voorbeelden.
* **Pilothypotheses** formuleren (bv. *“2 contactmomenten per week → 35% hogere offline‑deelname”*) en in 3–4 cirkels A/B‑testen.

Als je wilt, werk ik dit meteen om naar een **kick‑off backlog** (user stories + acceptatiecriteria) met template‑teksten en Flow‑schemas per stap.

[1]: https://developers.facebook.com/docs/whatsapp/cloud-api/?utm_source=chatgpt.com "WhatsApp Cloud API - Documentation"
[2]: https://developers.facebook.com/docs/whatsapp/cloud-api/guides/send-messages/?utm_source=chatgpt.com "Messaging - WhatsApp Cloud API - Meta for Developers"
[3]: https://developers.facebook.com/docs/whatsapp/cloud-api/groups/?utm_source=chatgpt.com "Groups - WhatsApp Cloud API"
[4]: https://developers.facebook.com/docs/whatsapp/cloud-api/guides/set-up-webhooks/?utm_source=chatgpt.com "Webhooks - WhatsApp Cloud API"
[5]: https://business.whatsapp.com/policy?utm_source=chatgpt.com "WhatsApp Business Messaging Policy"
[6]: https://developers.facebook.com/docs/whatsapp/business-management-api/message-templates/?utm_source=chatgpt.com "Templates - WhatsApp Cloud API - Meta for Developers"
[7]: https://faq.whatsapp.com/967457667545238?utm_source=chatgpt.com "How to join a group in a community"
[8]: https://developers.facebook.com/docs/whatsapp/pricing/conversation-based-pricing/?utm_source=chatgpt.com "Conversation-based pricing - WhatsApp Business Platform"
[9]: https://developers.facebook.com/docs/whatsapp/cloud-api/groups/reference/?utm_source=chatgpt.com "Group Management - WhatsApp Cloud API"
[10]: https://developers.facebook.com/docs/whatsapp/cloud-api/reference/messages/?utm_source=chatgpt.com "Messages - WhatsApp Cloud API - Meta for Developers"
[11]: https://business.whatsapp.com/products/platform-pricing?utm_source=chatgpt.com "WhatsApp Business Platform Pricing | WhatsApp API Pricing"
[12]: https://www.theverge.com/news/628850/whatsapp-message-thread-replies-feature-development?utm_source=chatgpt.com "Message threads are coming to WhatsApp"
