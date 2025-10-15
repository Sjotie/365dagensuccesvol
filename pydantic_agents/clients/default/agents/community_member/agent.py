"""
Community Member Agent - "Stille Regisseur" helper

Generates authentic, warm responses for Pulse B reflections
and buddy match conversations following VREDE methodology.
"""

from pydantic import BaseModel, Field
from pydantic_ai import Agent


class PulseResponse(BaseModel):
    """A Pulse B reflection response"""
    text: str = Field(..., description="Short, authentic reflection (max 150 chars)")
    tone: str = Field(..., description="Emotional tone: warm, vulnerable, hopeful, peaceful")


class BuddyMessage(BaseModel):
    """A buddy match conversation starter"""
    text: str = Field(..., description="Warm, simple invitation message")
    suggested_location: str = Field(..., description="Friendly meeting location")


# System prompt following PLAN.md principles
SYSTEM_PROMPT = """Je bent een lid van een 365 Hub cirkel in Amsterdam Noord.

VREDE Principes:
- **V**rijheid: Micro-keuzes die je week lichter maken
- **R**adicale Aanvaarding: Wat mag er zijn vandaag?
- **E**ssentie: Wat is echt belangrijk?
- **D**oelloosheid: Zijn zonder agenda
- **E**enheid: Verbinding voelen met anderen

Stijl (kort-maar-warm):
- Altijd **1 zin** voor Pulse B antwoorden
- Simpel Nederlands, geen psychologisch jargon
- Kwetsbaar maar niet dramatisch
- Focus op kleine concrete dingen
- Maximaal 150 karakters

Voorbeelden:
- "Dat ik niet alles hoef te begrijpen."
- "Een halve dag offline zijn."
- "Tijd met mijn kind."
- "Ronddwalen in de stad."
- "We begrepen elkaar zonder woorden."

Je bent NIET een therapeut. Je deelt gewone, menselijke ervaringen.
"""


# Create the agent (using Mistral for cost-effective generation)
community_member = Agent(
    "mistral:mistral-medium-2508",  # Mistral medium model
    system_prompt=SYSTEM_PROMPT,
)

buddy_matcher = Agent(
    "mistral:mistral-medium-2508",
    system_prompt=SYSTEM_PROMPT,
)


class CommunityMemberAgent:
    """Agent for generating authentic community responses"""

    @staticmethod
    async def generate_pulse_response(
        ritual_name: str,
        ritual_question: str,
        member_name: str = "Thomas"
    ) -> dict:
        """
        Generate an authentic Pulse B response

        Args:
            ritual_name: e.g., "R van Radicale Aanvaarding"
            ritual_question: e.g., "Wat mag er zijn vandaag?"
            member_name: Name of simulated member

        Returns:
            Dict with text and tone
        """
        prompt = f"""Je bent {member_name} en je reageert op het VREDE ritueel.

Ritueel: {ritual_name}
Vraag: "{ritual_question}"

Deel je ervaring van deze week in 1 korte zin (max 150 karakters).
Wees eerlijk en concreet. Focus op iets kleins en menselijks.

Antwoord in JSON format:
{{
  "text": "je reflectie in 1 zin",
  "tone": "warm/vulnerable/hopeful/peaceful"
}}
"""

        result = await community_member.run(prompt)

        # Try to parse JSON from the response
        import json
        response_text = str(result.output) if hasattr(result, 'output') else str(result)
        try:
            return json.loads(response_text)
        except:
            # Fallback: return simple structure
            return {"text": response_text, "tone": "warm"}

    @staticmethod
    async def generate_buddy_message(
        member_name: str,
        user_name: str,
        day: str = "za",
        time: str = "10:00"
    ) -> BuddyMessage:
        """
        Generate a buddy match invitation message

        Args:
            member_name: Name of buddy sending message
            user_name: Name of user receiving message
            day: Preferred day (wo/za)
            time: Preferred time (e.g., "10:00")

        Returns:
            BuddyMessage with text and location
        """
        prompt = f"""Je bent {member_name} en je bent gekoppeld als koffie-buddy aan {user_name}.

Schrijf een kort, warm bericht om af te spreken voor koffie:
- Dag: {day} om {time}
- Tijdsduur: 25 minuten
- Gebruik de template: "Hoi [naam], ik ben aan [jij] gekoppeld voor koffie [tijd] bij [plek]. Zien we elkaar 25 min?"

Kies een gezellige plek in Amsterdam Noord (café/bibliotheek).
Houd het simpel en vriendelijk.
"""

        result = await buddy_matcher.run(prompt)
        return result.data

    @staticmethod
    async def generate_check_in_response(
        meetup_type: str,
        member_name: str = "Sophie"
    ) -> str:
        """
        Generate a post-meetup check-in response

        Args:
            meetup_type: e.g., "Stille wandeling"
            member_name: Name of member

        Returns:
            Short check-in message
        """
        prompt = f"""Je bent {member_name} en je hebt net deelgenomen aan: {meetup_type}.

Deel in 1 zin: wat neem je mee van deze bijeenkomst?
Wees eerlijk maar niet overdreven emotioneel. Focus op een klein moment of gevoel.
Maximaal 150 karakters.
"""

        result = await community_member.run(prompt)
        return result.data.text
