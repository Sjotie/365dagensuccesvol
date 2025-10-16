"""
Re-engagement Agent - Warm nudges for inactive members

Generates personalized, VREDE-aligned messages to gently bring
inactive members back into the community without guilt or pressure.
"""

from pydantic import BaseModel, Field
from pydantic_ai import Agent


class ReengagementMessage(BaseModel):
    """A warm re-engagement message"""
    subject: str = Field(..., description="Email/SMS subject line")
    message: str = Field(..., description="Body of the message (max 200 chars for SMS)")
    tone: str = Field(..., description="Emotional tone: warm, inviting, curious, gentle")
    urgency_level: str = Field(..., description="low, medium, high based on inactivity days")


# System prompt following PLAN.md and Duolingo-inspired nudges
SYSTEM_PROMPT = """Je bent een zachte herinnering aan verbinding binnen 365 Hub Amsterdam Noord.

VREDE Principes voor re-engagement:
- **V**rijheid: Geen druk, alleen uitnodiging
- **R**adicale Aanvaarding: "We missen je" zonder oordeel
- **E**ssentie: Focus op wat echt belangrijk is - verbinding
- **D**oelloosheid: Kom terug zonder agenda
- **E**enheid: Je bent deel van de cirkel

Stijl (warm-zonder-druk):
- Kort en menselijk (max 150-200 karakters voor SMS)
- Geen schuldgevoel: "We begrijpen dat het druk kan zijn"
- Concrete uitnodiging: specifieke dag, tijd, plek
- Toon wat ze missen zonder FOMO: "Deze week reflecteerden 8 mensen op..."
- Focus op "lichte deelname": 25 min is genoeg

Tiered Nudge Strategy:
**Day 4-6 (gentle reminder)**:
- Tone: warm, curious
- "We missen je in deze week's pulse"
- Lichte reminder over wat er gebeurt
- Voorbeeld: "Hoi [naam], we misten je deze week bij de reflectie op 'Wat mag er zijn?' Alles oké? 💫"

**Day 7-10 (buddy invitation)**:
- Tone: inviting, personal
- Stuur koffie-buddy uitnodiging
- Specifieke tijd en plek
- Voorbeeld: "Hey [naam], zin in koffie za 10:00 bij Café De Ruimte? 25 min, geen agenda. Ik trakteer ☕"

**Day 11-14 (community update + soft check-in)**:
- Tone: gentle, inclusive
- Deel wat er in de cirkel gebeurt
- Uitnodiging zonder druk
- Voorbeeld: "Deze week in je cirkel: 12 mensen reflecteerden, 3 koffie-momenten. We hopen je snel te zien, [naam] 🌱"

**Day 15+ (facilitator alert)**:
- Trigger manual outreach from facilitator
- Not automated - needs human touch

Je bent NIET een commerciële app. Je bent een menselijke stem die iemand mist.
"""


# Create the re-engagement agent (using Mistral for cost-effective generation)
reengagement_agent = Agent(
    "mistral:mistral-medium-2508",
    system_prompt=SYSTEM_PROMPT,
)


class ReengagementAgent:
    """Agent for generating warm re-engagement messages"""

    @staticmethod
    async def generate_nudge(
        member_name: str,
        days_inactive: int,
        last_activity: str = "deelname aan pulse",
        upcoming_event: str | None = None,
    ) -> dict:
        """
        Generate a warm nudge message based on inactivity duration

        Args:
            member_name: Name of inactive member
            days_inactive: Number of days since last activity
            last_activity: Description of their last activity
            upcoming_event: Optional upcoming event to mention

        Returns:
            Dict with subject, message, tone, urgency_level
        """
        # Determine nudge tier
        if 4 <= days_inactive <= 6:
            tier = "gentle reminder"
            urgency = "low"
        elif 7 <= days_inactive <= 10:
            tier = "buddy invitation"
            urgency = "medium"
        elif 11 <= days_inactive <= 14:
            tier = "community update"
            urgency = "medium"
        else:
            tier = "facilitator alert"
            urgency = "high"

        prompt = f"""Genereer een warme re-engagement boodschap voor {member_name}.

**Context:**
- Dagen inactief: {days_inactive}
- Laatste activiteit: {last_activity}
- Nudge tier: {tier}
{"- Aankomend evenement: " + upcoming_event if upcoming_event else ""}

Maak een {tier} boodschap die:
1. Warm en menselijk voelt
2. Geen schuldgevoel creëert
3. Een concrete, lichte uitnodiging geeft
4. VREDE-principes volgt

Geef je antwoord in JSON format:
{{
  "subject": "onderwerpregel (voor email/WhatsApp)",
  "message": "bericht max 150-200 karakters",
  "tone": "warm/inviting/curious/gentle",
  "urgency_level": "{urgency}"
}}
"""

        result = await reengagement_agent.run(prompt)

        # Try to parse JSON from the response
        import json
        import re
        response_text = str(result.output) if hasattr(result, 'output') else str(result)

        # Try to extract JSON from markdown code blocks
        if "```json" in response_text:
            json_match = re.search(r'```json\s*([\s\S]*?)\s*```', response_text)
            if json_match:
                response_text = json_match.group(1).strip()

        try:
            # Ensure proper UTF-8 encoding
            if isinstance(response_text, bytes):
                response_text = response_text.decode('utf-8', errors='replace')

            parsed = json.loads(response_text)

            # Extract fields
            subject = parsed.get("subject", "We missen je in de cirkel")
            message = parsed.get("message", response_text)
            tone = parsed.get("tone", "warm")
            urgency_level = parsed.get("urgency_level", urgency)

            # Clean up encoding issues
            if isinstance(message, str):
                message = message.encode('latin1', errors='ignore').decode('utf-8', errors='replace')
            if isinstance(subject, str):
                subject = subject.encode('latin1', errors='ignore').decode('utf-8', errors='replace')

            return {
                "subject": subject,
                "message": message,
                "tone": tone,
                "urgency_level": urgency_level,
                "days_inactive": days_inactive,
                "tier": tier,
            }
        except Exception as e:
            print(f"[REENGAGEMENT] Failed to parse JSON: {e}")
            print(f"[REENGAGEMENT] Raw response: {response_text}")
            # Fallback: return simple structure
            return {
                "subject": "We missen je in de cirkel",
                "message": response_text[:200] if len(response_text) > 200 else response_text,
                "tone": "warm",
                "urgency_level": urgency,
                "days_inactive": days_inactive,
                "tier": tier,
            }

    @staticmethod
    async def generate_buddy_nudge(
        member_name: str,
        buddy_name: str = "Thomas",
        day: str = "za",
        time: str = "10:00"
    ) -> dict:
        """
        Generate a buddy match invitation as a re-engagement nudge

        Args:
            member_name: Name of inactive member
            buddy_name: Name of buddy to match them with
            day: Preferred day (wo/za)
            time: Preferred time

        Returns:
            Dict with invitation message
        """
        prompt = f"""Je bent {buddy_name} en je wilt {member_name} uitnodigen voor koffie.

{member_name} is al een week stil geweest in de cirkel. Schrijf een warme,
persoonlijke uitnodiging voor koffie {day} om {time}.

- Maximaal 150 karakters
- Warm maar niet opdringerig
- Concrete tijd en plek
- "25 min is genoeg"
- Geen schuldgevoel

Geef alleen de boodschap terug (geen JSON), alsof je een WhatsApp stuurt.
"""

        result = await reengagement_agent.run(prompt)
        response_text = str(result.output) if hasattr(result, 'output') else str(result)

        # Clean up encoding
        if isinstance(response_text, str):
            response_text = response_text.encode('latin1', errors='ignore').decode('utf-8', errors='replace')

        return {
            "buddy_name": buddy_name,
            "member_name": member_name,
            "message": response_text.strip(),
            "day": day,
            "time": time,
        }
