Hier is de **deep‑dive in de rol van AI binnen Pad B (365 Hub)**, met **concrete, meteen inzetbare voorbeelden**. Ik organiseer het langs 7 AI‑taken, gevolgd door end‑to‑end scenario’s, voorbeeldprompts/RAG, safety & privacy, en beslisregels.

---

## 1) AI‑takenkaart in Pad B

**Planner**

* Orkestreert weekritme (2 pulsen), agendeert voorstellen, bewaakt deadlines/24–48u‑vensters.

**Retriever (“Second Brain”)**

* Haalt context op: VREDE‑rituelen, tone‑of‑voice, lokale plekken, eerdere interacties, groepsdynamiek.

**Composer**

* Schrijft **kort‑maar‑warm** UI‑copy, draaiboekjes, ICS‑uitnodigingen, “Samen‑kaartjes”, gastavond‑invites.

**Matchmaker (lichtgewicht)**

* Koppelt buddy’s (soft‑match op beschikbaarheid/wijk/voorkeur), **zonder** psychologische claims.

**Health & Safety**

* Detecteert stilte/spanning/risicotaal → **Care‑alert** of host‑tip met kant‑en‑klare interventie.

**Experimenter**

* Voert kleine A/B’s uit (timing/copy/ritueelvolgorde) en rapporteert effect op TTFM/RSVP/Warmte.

**Navigator (situatiebewustzijn)**

* Houdt rekening met **weer**, **openingstijden**, **locaties op loop/fietsafstand**, **toegankelijkheid**.

> Leitmotiv: **AI faciliteert en versnelt**, de **mens verbindt**.

---

## 2) Praktische voorbeelden per AI‑taak

### 2.1 Onboarding & Matching (Planner + Retriever + Composer)

**Doel**: in 90 seconden een warme start + eerste concrete stap.

**Voorbeeld‑flow**

* **Input**: postcode = 1033 (Noord), beschikbaarheid = “wo avond / za ochtend”, comfort = “korte groepjes”.
* **AI‑beslissing**: cirkel “Noord‑oost (15 min fietsen)”; voorstel **wo 19:00** stille wandeling (laagdrempelig).
* **Output (Hub‑copy)**

  > “Welkom in **Cirkel Noord‑oost** 👋
  > **Wo 19:00** stille wandeling past bij je voorkeuren. Verzamelpunt: Vliegenbos (Hamerkanaal‑ingang).
  > **Ja, in agenda** • **Liever za 10:00**”

**Achter de schermen**

* Retriever haalt: korte VREDE‑intro, 2 veilige locaties in buurt, host‑naam, vorige groepsactiviteit.
* Composer maakt ICS + kaartlink.

---

### 2.2 Puls‑engine (Planner + Composer + Experimenter)

**Doel**: **2 pulsen/week** die tot **reële afspraken** leiden.

**Pulse A (ritueel + voorstel)**

* **Korte variant (A/B test)**

  > “**V van Vrijheid (3 min)**. Welke micro‑keuze maakt je week lichter?
  > Samen **wo 19:00** of **za 10:00**? Kies → ik zet ‘t in je agenda.”

**Pulse B (reflectie + buddy/gastavond)**

> “Wat maakte je week lichter? Deel 1 zin.
> Volgende week **gastavond** — wil je een **Samen‑kaart** sturen?”

**Beslisregels**

* Als Pulse A <45% keuze binnen 36 uur → automatische **reminder** (kort, zonder schuld):

  > “Kiezen duurt 3 seconden: **Wo** of **Za**? 🌱”

---

### 2.3 Meetup‑composer (Navigator + Composer)

**Doel**: **1‑klik** van voorstel → agenda → bijeenkomst.

**Inputs die AI weegt**

* Wijk, standaardplek(ken), **weer** (regen? → café/bibliotheek), toegankelijkheid, groepsgrootte.

**Voorbeeld‑uitkomst (Hub)**

> “**Stille wandeling — Vliegenbos**
> Wo 19:00 • ingang Hamerkanaal • 25 min
> Neem 1 zin mee: *‘Waar zeg ik ja tegen?’*
> **Ja, ik kom** (ICS)”

**Fallbacks**

* Slecht weer ontdekt →

  > “Regen verwacht 🌧️. Wil je **café De Ruimte** (stil hoekje) als alternatief? **Ja/Nee**”

---

### 2.4 Host Co‑pilot (Retriever + Composer)

**Doel**: host krijgt **alles kant‑en‑klaar**, hoeft alleen te “accepteren”.

**Voorbeelden**

* **Draaiboek ‘zacht’ (7 minuten totaal)**

  1. Welkom (30s) + 30s stilte
  2. 2× rondje *“Waar zeg je ja tegen?”* (4–5m)
  3. Afronding (1m): *“Wat neem je mee?”* + voorstel volgende datum

* **Check‑in post (bij lage energie)**

  > “Korte check‑in: **1 woord** voor je energie vandaag.
  > Mini‑stap: **1 micro‑keuze** voor morgen.”

* **Stille leden (suggesties)**

  * “Tag **Annemarie** en **Bilal** warm bij naam; ze reageerden wel op DM.”

* **Celdeling‑post (vriendelijk)**

  > “We worden gezellig groot 🌱. Voor nabijheid starten we **twee buurcirkels**: **A**) Noord‑oost • **B**) Noord‑west. Kies je voorkeur — ritme en stijl blijven hetzelfde.”

---

### 2.5 Community Health & Safety (Health & Safety)

**Doel**: bewaken van **warmte en veiligheid** zonder te medicaliseren.

**Signalen die AI checkt**

* **Stilte**: niemand reageert binnen 72u; 30%+ van leden inactief 2 weken.
* **Taal**: agressie, belediging, extreme wanhoop, medische claims.
* **Spanning**: scherpe toon in check‑outs, dalende RSVP’s.

**Acties**

* **Host‑tip** (zacht)

  > “Energie is laag. Plaats **korte variant** (2 zinnen) + vraag om 1 micro‑actie.”
* **Care‑alert** (mens pakt op):

  * Samenvatting + voorbeeld‑DM (neutraal, uitnodigend).
  * Geen diagnose/advies; enkel **contact & doorverwijzing** indien nodig.

**Grenzen‑copy (in flows zichtbaar)**

> “Ik ben je digitale 365‑gids — **geen therapeut/arts**. Bij gevoelige thema’s vraag ik een collega‑mens om mee te kijken.”

---

### 2.6 Light Buddy‑match (Matchmaker)

**Doel**: **micro‑duo’s** vormen **zonder** psychologische typeringen.

**Voorbeeld‑prompt (Hub)**

> “Deze week een **koffie‑buddy** in je buurt?
> Ik koppel je op **tijdstip/wijk** — geen testjes. **Ja/Nee**”

**AI‑logica**

* Woont dicht bij je, beschikbaar op hetzelfde slot, vergelijkbare voorkeur voor ‘korte groepjes’ → voorstel.

**DM‑template**

> “Hoi **{naam}**, ik ben aan **{jij}** gekoppeld voor koffie **za 10:00** bij **{plek}**. Zien we elkaar 25 min?”

---

### 2.7 Experimenter & Insights

**Doel**: **kleine** experimenten, **grote** impact op TTFM, RSVP, Warmte.

**Voorbeelden**

* **A/B**: ritueel vóór vs. na het voorstel.
* **Tijd‑slot**: wo 19:00 vs. do 19:30 (groep‑specifiek leren).
* **Copy‑lengte**: 2 regels vs. 4 regels.

**Rapport (wekelijks)**

* “TTFM daalde van **9 → 6 dagen** door **voorstel vóór ritueel**.
  RSVP steeg **+11%** op **za 10:00**.
  Warmte +12% na **buddy‑invite** na Pulse B (niet na Pulse A).”

---

## 3) End‑to‑end scenario’s (volledig uitgewerkt)

### Scenario A — Nieuw lid → 1e ontmoeting in 5 dagen

1. **Login** → postcode → cirkel.
2. **Pulse A** direct actief (voorkeuren meegenomen).
3. **AI** kiest **wo 19:00** (populair in wijk + host beschikbaar), stelt plek voor.
4. **Lid kiest** Wo → **ICS** + maplink.
5. **Host** accepteert auto‑gegenereerd draaiboek.
6. **Na afloop**: check‑outvraag “Wat neem je mee?” (1 zin) → **Warmte‑score +1**.

### Scenario B — Stilte & laag ritme

* Detectie: 72u geen reacties; inactief cohort.
* **AI → Host**: “Plaats ultrakorte variant + *‘wie haakt 20 min aan voor koffie za 10:00?’*”
* **Host plaatst**; 4 aanmeldingen → **TTFM herstelt**.

### Scenario C — Conflictgevoelige taal

* Detectie: “ongefundeerde claims/aanval”.
* **AI** stopt de flow, toont **grenzen‑copy**, stuurt **Care‑alert** met snippet (context + postgeschiedenis).
* **Mens** (Care) benadert betrokkenen 1‑op‑1.

### Scenario D — Celdeling

* Trigger: 22 leden; RSVP < 40%.
* **AI** stelt **2 buurcirkels** voor met tijdstippen + host‑teksten.
* Leden kiezen A/B; **AI** bouwt nieuwe lijsten; host doet warme overdracht.
* **Meet**: Celdeling‑NPS +40, RSVP herstelt >60%.

### Scenario E — Regen

* **Navigator** ziet regen 18:30–20:00 → alternatief: **stil hoekje in café**.
* **Pulse‑update**: “Regen 🌧️ → **Café De Ruimte**. Zelfde tijd. **Ja/Nee**”

---

## 4) Prompting, RAG & tool‑calling (concreet)

### 4.1 System‑instructie (uittreksel, toon & grenzen)

```
Rol: 365-gids (AI-facilitator). Doel: offline ontmoetingen versnellen, warmte verhogen.
Stijl: warm, eenvoudig, kort. Geen diagnoses of medische/psychische adviezen.
Altijd afronden met 1 concrete stap (keuze/actie).
Guardrails: bij risicotaal → escalate_to_care(reason, snippet).
```

### 4.2 Retrieval (Second Brain) — documenttypen

* **VREDE‑rituelen** (korte varianten + 3 langere),
* **Tone‑of‑voice** (do’s/don’ts, voorbeelden),
* **Host‑playbooks** (zacht/energiek/reflectief),
* **Locatie‑gidsen** per wijk (park/café/bib, openingstijden),
* **Copy‑bibliotheek** (Pulse A/B, buddy, celdeling, gastavond),
* **Safety‑lexicon** (triggerwoorden, de‑escalatie‑teksten).

**Retrieval‑query (voorbeeld)**

```
vraag: "Pulse A voor Noord-oost, woensdagavond, lage energie, korte variant"
filters: {type:"pulseA", wijk:"noord-oost", toon:"kort", energie:"laag"}
```

### 4.3 Functie‑aanroepen (tool‑calling) — denkmodel

* `propose_meetup({wijk, vensters[], weer, voorkeuren[]}) -> {plek, tijd, duur, fallback}`
* `make_ics({titel, tijd, plek, duur}) -> ics_url`
* `send_notification({kanaal, user_id, body, deeplink})`
* `escalate_to_care({user_id, reason, snippet, urgency})`

### 4.4 Prompt‑template (Pulse A composer)

```
Context:
- Wijk: Noord-oost; Populaire sloten: wo 19:00, za 10:00
- Ritueel: V van Vrijheid (3 min), korte variant
- Doel: keuze afdwingen in ≤2 zinnen
Schrijf 2 versies; eindig met keuze-knoppen (Wo / Za).
```

---

## 5) Safety, ethiek & grenzen (operationeel)

**Classifiers**

* *Harassment/Offense*, *Self‑harm/Severe distress*, *Medical claims*, *Spam/Scams*.
* Thresholds → *soft intervention* (host‑tip) vs. *Care‑alert* (mens).

**Escalatie‑matrix**

* **Mild conflict** → host krijgt de‑escalatie‑tekst (korte aanname‑vrije taal).
* **Ernstig/risico** → **Care** 1‑op‑1; AI stopt interactie, toont grenzen‑copy.

**Dataminimalisatie**

* Geen diagnose‑tags; enkel: *stilte‑score*, *respons‑ratio*, *RSVP*, *warmte‑indicatoren* (naam‑naar‑naam, buddy’s).
* Locatie op **wijkniveau**, geen exacte adressen tenzij vrijwillig voor meetup.

---

## 6) Beslisregels (samenvatting als “if‑this‑then‑that”)

* **<45%** keuzes 36u na Pulse A → **reminder kort**.
* **Regen** tijdens gepland slot → voorstel **binnenlocatie** binnen 500–800 m.
* **>20 leden** & **RSVP <50%** 2 weken op rij → **celdeling** voorstellen.
* **Stilte** (≥30% lid inactief 14 dagen) → **Host‑tip** + 3 DM‑suggesties.
* **Warmte daalt** 2 weken → ritueel eerst, **kort** copy, buddy‑invite na Pulse B.

---

## 7) Wat de AI **automatisch** mag doen vs. **op verzoek/acceptatie**

**Automatisch**

* ICS genereren en meesturen bij een “Ja”.
* Reminders binnen afgesproken vensters.
* A/B‑variant kiezen binnen vastgestelde opties.
* Safety‑checks uitvoeren en Care‑alerts maken.

**Op verzoek/acceptatie (host)**

* Plaatsen van cirkelbrede berichten.
* Celdeling communiceren.
* Grote toonwijzigingen (van ‘zacht’ naar ‘energiek’).

---

## 8) Testset voor acceptatie (uitvoerbaar in pilot)

1. **Slecht‑weer**: regen 2 uur vóór voorstel → alternatief binnen 1 km, copy ≤ 2 zinnen.
2. **Stilte‑cohort**: 40% inactief → host‑tip + 2 DM’s met naam‑suggesties.
3. **Conflictzin**: “Dit slaat nergens op, je…” → AI stopt, toont grenzen‑copy + Care‑alert.
4. **Celdeling**: 22 leden; RSVP 38% → 2 buurcirkels, NPS‑vraag na 3 dagen.
5. **Buddy‑match**: 2 leden, zelfde wijk & slot → DM‑tekst genereren, RSVP loggen.

---

## 9) Voorbeeldteksten (klaar‑om‑te‑gebruiken)

**Grenzen‑copy (universeel)**

> “Ik ben je 365‑gids (digitaal) en help je om **in het echt** te verbinden.
> Voor medische of zware persoonlijke thema’s betrek ik een **menselijke collega**.”

**De‑escalatie (host‑tool)**

> “Dank voor het delen. Laten we het **bij eigen ervaring** houden, in korte zinnen.
> Iedereen krijgt 1 minuut — wie wil beginnen?”

**Buddy‑DM**

> “Hoi **{naam}**, ik ben aan **{jij}** gekoppeld voor **za 10:00** bij **{plek}**.
> 25 min is genoeg. **Zien we elkaar?**”

**Gastavond‑invite**

> “Volgende week **gastavond**. Iemand in gedachten die dit kan gebruiken?
> Ik stuur je een **Samen‑kaart** met 3 startvragen.”

---

## 10) Implementatie‑notities (kort en nuchter)

* **RAG**: houd fragmenten **kort** (≤ 500 tokens), tag op *type, wijk, toon, energie*.
* **Copy‑kwaliteit**: enforce **korte zinnen**, max 2–4 regels per card.
* **Meet** op **TTFM, RSVP, Warmte** (niet likes/scroll).
* **Privacy**: wijk‑niveau, opt‑in, eenvoudige export/delete.
* **Observatie**: begin **klein**; schaaf elke week op 1–2 keuzes (tijd, copy, ritueelvolgorde).

> Noot m.b.t. tooling: libraries en LLM‑API’s ontwikkelen zich snel. Check altijd de actuele mogelijkheden/limieten van jullie vector‑store, e‑mail/WA‑provider en kalender‑integraties voordat je bouwt.

---

### In 1 zin

De AI in Pad B is een **stille regisseur**: hij plant ritme, haalt context, schrijft korte warme teksten, bewaakt veiligheid, en zorgt dat mensen **zo snel mogelijk in het echt** bij elkaar komen — terwijl **hosts** en **Care** het menselijke werk doen.
