"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Info, Clock, FileCheck, Users, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

// WhatsApp UI Components
interface WhatsAppMessageProps {
  text: string | React.ReactNode
  sender: "user" | "ai" | "system"
  timestamp?: string
  isFlow?: boolean
}

function WhatsAppMessage({ text, sender, timestamp, isFlow }: WhatsAppMessageProps) {
  const isUser = sender === "user"
  const isSystem = sender === "system"

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-2`}>
      <div
        className={`max-w-[85%] rounded-lg px-3 py-2 ${
          isUser
            ? "bg-[#D9FDD3] text-slate-900"
            : isSystem
            ? "bg-[#F0F0F0] text-slate-700 text-xs text-center mx-auto"
            : "bg-white text-slate-900 shadow-sm"
        } ${isFlow ? "border-2 border-[#FF0837]" : ""}`}
      >
        <div className="text-[15px] leading-relaxed">{text}</div>
        {timestamp && !isSystem && (
          <div className={`text-[11px] mt-1 ${isUser ? "text-right text-slate-600" : "text-slate-500"}`}>
            {timestamp}
          </div>
        )}
      </div>
    </div>
  )
}

interface WhatsAppChatProps {
  children: React.ReactNode
  title?: string
  subtitle?: string
  isGroup?: boolean
}

function WhatsAppChat({ children, title, subtitle, isGroup }: WhatsAppChatProps) {
  return (
    <div className="w-full max-w-md mx-auto bg-[#ECE5DD] rounded-2xl overflow-hidden shadow-xl border border-slate-200">
      {/* WhatsApp Header */}
      <div className="bg-[#075E54] text-white p-3 flex items-center gap-3">
        <ArrowLeft className="h-5 w-5" />
        <div className="flex-1">
          <div className="font-semibold text-sm flex items-center gap-2">
            {title || "365 Concierge"}
            {isGroup && <Users className="h-4 w-4" />}
          </div>
          {subtitle && <div className="text-xs opacity-90">{subtitle}</div>}
        </div>
      </div>

      {/* Chat Content */}
      <div className="p-4 min-h-[400px] max-h-[600px] overflow-y-auto space-y-2">{children}</div>
    </div>
  )
}

interface TechnicalBadgeProps {
  icon: React.ReactNode
  text: string
}

function TechnicalBadge({ icon, text }: TechnicalBadgeProps) {
  return (
    <Badge className="bg-[#FFF0F5] text-[#FF0837] border border-[#FFE6ED] text-xs">
      <span className="mr-1">{icon}</span>
      {text}
    </Badge>
  )
}

interface ScenarioSectionProps {
  id: string
  number: number
  title: string
  subtitle: string
  explanation: string
  technicalNotes?: string[]
  chat: React.ReactNode
  badges?: React.ReactNode[]
}

function ScenarioSection({ id, number, title, subtitle, explanation, technicalNotes, chat, badges }: ScenarioSectionProps) {
  return (
    <section id={id} className="py-16 scroll-mt-20">
      <div className="container mx-auto px-6 max-w-6xl">
        {/* Section Header */}
        <div className="text-center mb-8">
          <Badge className="bg-[#FF0837] text-white mb-3">Scenario {number}</Badge>
          <h2 className="text-4xl font-bold text-slate-900 mb-2">{title}</h2>
          <p className="text-lg text-slate-600">{subtitle}</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* Chat UI */}
          <div className="order-2 lg:order-1">{chat}</div>

          {/* Explanation */}
          <div className="order-1 lg:order-2 space-y-6">
            <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
              <div className="flex items-start gap-3 mb-4">
                <Info className="h-5 w-5 text-[#FF0837] flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-slate-900 mb-2">Wat gebeurt hier?</h3>
                  <p className="text-slate-700 leading-relaxed">{explanation}</p>
                </div>
              </div>

              {/* Technical Badges */}
              {badges && badges.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-slate-100">
                  {badges}
                </div>
              )}
            </div>

            {/* Technical Notes */}
            {technicalNotes && technicalNotes.length > 0 && (
              <div className="bg-[#FFF0F5] rounded-xl p-6 border border-[#FFE6ED]">
                <h4 className="font-semibold text-slate-900 mb-3 text-sm">Technische beperkingen</h4>
                <ul className="space-y-2 text-sm text-slate-700">
                  {technicalNotes.map((note, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-[#FF0837] font-bold">•</span>
                      <span>{note}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default function WhatsAppLandingPage() {
  const router = useRouter()
  const [activeScenario, setActiveScenario] = useState(1)

  const scenarios = [
    { id: 1, label: "Onboarding", anchor: "onboarding" },
    { id: 2, label: "Match", anchor: "match" },
    { id: 3, label: "Groepsstart", anchor: "groep" },
    { id: 4, label: "Check-ins", anchor: "checkins" },
    { id: 5, label: "Afspraak", anchor: "afspraak" },
    { id: 6, label: "Feedback", anchor: "feedback" },
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Top Navigation */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 md:px-6 py-2 md:py-4">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <img src="/365-logo.svg" alt="365 Hub" className="h-8 md:h-10 w-8 md:w-10" />
              <span className="text-sm md:text-xl font-bold text-slate-900 hidden sm:inline">365 Hub — WhatsApp Versie</span>
              <span className="text-sm font-bold text-slate-900 sm:hidden">WhatsApp</span>
            </div>
            <Button
              variant="outline"
              onClick={() => router.push("/")}
              className="border-[#FF0837] text-[#FF0837] hover:bg-[#FFF0F5] text-xs md:text-sm px-2 md:px-4 py-1 md:py-2 h-auto"
            >
              <span className="hidden sm:inline">Terug naar Hub →</span>
              <span className="sm:hidden">Hub →</span>
            </Button>
          </div>
        </div>
      </nav>

      {/* Scenario Navigation */}
      <div className="sticky top-[50px] md:top-[73px] z-40 bg-white border-b border-slate-200 shadow-sm">
        <div className="relative">
          {/* Left gradient fade */}
          <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />

          {/* Right gradient fade */}
          <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

          <div className="overflow-x-auto scrollbar-hide">
            <div className="flex gap-2 px-6 py-3 min-w-max snap-x snap-mandatory">
              {scenarios.map((scenario) => (
                <button
                  key={scenario.id}
                  onClick={() => {
                    setActiveScenario(scenario.id)
                    document.getElementById(scenario.anchor)?.scrollIntoView({ behavior: "smooth" })
                  }}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors snap-center ${
                    activeScenario === scenario.id
                      ? "bg-[#FF0837] text-white"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  {scenario.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-[#FFF0F5] to-white py-20">
        <div className="container mx-auto px-6 max-w-4xl text-center">
          <Badge className="bg-[#FF0837] text-white mb-4 text-sm px-4 py-2">WhatsApp-first concept</Badge>
          <h1 className="text-5xl font-bold text-slate-900 mb-6">
            Van eenzaamheid naar verbinding,
            <br />
            <span className="text-[#FF0837]">in de app die iedereen al heeft</span>
          </h1>
          <p className="text-xl text-slate-700 leading-relaxed mb-8">
            Ontdek hoe AI lokale cirkels faciliteert via WhatsApp—met 1-op-1 onboarding, groepsuitnodigingen, en een ritme dat
            mensen echt helpt elkaar te ontmoeten. Geen nieuwe app. Geen drempels. Gewoon WhatsApp.
          </p>
          <div className="flex justify-center gap-4">
            <Button
              size="lg"
              onClick={() => document.getElementById("onboarding")?.scrollIntoView({ behavior: "smooth" })}
              className="bg-[#FF0837] hover:bg-[#E6061F] text-white text-lg py-6 px-8"
            >
              Bekijk de user journey →
            </Button>
          </div>
        </div>
      </section>

      {/* Scenario 1: Onboarding */}
      <ScenarioSection
        id="onboarding"
        number={1}
        title="Onboarding Flow"
        subtitle="1-op-1 gesprek met AI Concierge"
        explanation="De gebruiker krijgt een persoonlijk welkom via WhatsApp. De AI Concierge gebruikt WhatsApp Flows (ingebedde formulieren) om locatie, beschikbaarheid, en voorkeuren te vragen. Dit voelt natuurlijk en laagdrempelig—geen aparte app, gewoon een gesprek in WhatsApp. Alle data wordt privé verzameld en de gebruiker geeft expliciet toestemming voor groepsuitnodiging."
        technicalNotes={[
          "WhatsApp Flows zijn ingebedde formulieren die binnen de chat werken—native UX, geen externe links",
          "Alle persoonlijke data (woonplaats, beschikbaarheid) blijft 1-op-1 en wordt niet in groepen gedeeld",
          "Gebruiker moet expliciet opt-in geven voor groepsuitnodiging (privacy by design)",
        ]}
        badges={[
          <TechnicalBadge key="flow" icon="📋" text="WhatsApp Flow" />,
          <TechnicalBadge key="1on1" icon="🔒" text="1-op-1 privacy" />,
          <TechnicalBadge key="optin" icon="✅" text="Opt-in vereist" />,
        ]}
        chat={
          <WhatsAppChat title="365 Concierge" subtitle="online">
            <WhatsAppMessage
              sender="ai"
              text="Hoi! Welkom bij 365 🌟 We helpen je om mensen in je buurt te vinden voor kleine, laagdrempelige ontmoetingen. Zullen we beginnen?"
              timestamp="14:32"
            />
            <WhatsAppMessage sender="user" text="Ja, graag!" timestamp="14:33" />
            <WhatsAppMessage
              sender="ai"
              text="Top! Ik stel je een paar korte vragen om een passend cirkeltje voor je te vinden. Het duurt maar 2 minuten."
              timestamp="14:33"
            />
            <WhatsAppMessage
              sender="ai"
              isFlow
              text={
                <div className="space-y-3 py-2">
                  <div className="font-semibold text-sm">📍 Waar woon je ongeveer?</div>
                  <input
                    type="text"
                    placeholder="Bijv. Amsterdam-Noord"
                    className="w-full p-2 border border-slate-300 rounded text-sm"
                    readOnly
                  />
                  <div className="font-semibold text-sm mt-4">📅 Wanneer kun je meestal?</div>
                  <div className="space-y-1">
                    {["Ma", "Di", "Wo", "Do", "Vr", "Za", "Zo"].map((day) => (
                      <label key={day} className="flex items-center gap-2 text-sm">
                        <input type="checkbox" className="rounded" disabled />
                        {day}
                      </label>
                    ))}
                  </div>
                  <div className="font-semibold text-sm mt-4">💬 Hoe voel je je?</div>
                  <select className="w-full p-2 border border-slate-300 rounded text-sm" disabled>
                    <option>Introvert (klein beginnen)</option>
                    <option>Extravert (bring it on!)</option>
                  </select>
                  <Button size="sm" className="w-full bg-[#FF0837] text-white mt-3">
                    Volgende →
                  </Button>
                </div>
              }
              timestamp="14:33"
            />
          </WhatsAppChat>
        }
      />

      {/* Scenario 2: Match & Invitation */}
      <ScenarioSection
        id="match"
        number={2}
        title="Match & Groepsuitnodiging"
        subtitle="AI maakt een groep en stuurt invite links"
        explanation="De AI analyseert alle onboarding data en vormt een cluster van mensen die dichtbij elkaar wonen en vergelijkbare beschikbaarheid hebben. Via de WhatsApp Groups API maakt de AI een nieuwe groep aan en genereert een invite link. Deze link wordt via een goedgekeurde template naar elke deelnemer gestuurd. Mensen joinen vrijwillig—WhatsApp voegt niemand automatisch toe."
        technicalNotes={[
          "WhatsApp Groups API maakt groepen aan en genereert invite-only links (geen automatisch toevoegen)",
          "Template message vereist vooraf goedkeuring van WhatsApp (utility category)",
          "24-uurs service window geldt: na laatste user bericht kan AI 24 uur vrij antwoorden, daarna alleen templates",
        ]}
        badges={[
          <TechnicalBadge key="groups" icon="👥" text="Groups API" />,
          <TechnicalBadge key="template" icon="✉️" text="Template bericht" />,
          <TechnicalBadge key="invite" icon="🔗" text="Invite-only" />,
        ]}
        chat={
          <WhatsAppChat title="365 Concierge" subtitle="online">
            <WhatsAppMessage
              sender="ai"
              text="Goed nieuws! We hebben een cirkeltje voor je gevonden 🎉"
              timestamp="Gisteren 16:45"
            />
            <WhatsAppMessage
              sender="ai"
              text={
                <div>
                  <div className="mb-2">Je match:</div>
                  <div className="bg-[#F0F0F0] rounded p-2 text-sm space-y-1">
                    <div>📍 3 mensen binnen 1 km</div>
                    <div>📅 Beschikbaar: wo/za</div>
                    <div>💬 Mix van intro/extravert</div>
                  </div>
                </div>
              }
              timestamp="Gisteren 16:45"
            />
            <WhatsAppMessage
              sender="ai"
              text={
                <div>
                  Klik om te joinen:
                  <div className="mt-2 p-2 bg-[#FFF0F5] border border-[#FFE6ED] rounded text-center">
                    <div className="text-xs text-slate-600 mb-1">💬 A'dam-Noord | Cirkeltje 27</div>
                    <div className="font-semibold text-[#FF0837] text-sm underline">chat.whatsapp.com/invite123</div>
                  </div>
                  <div className="text-xs text-slate-500 mt-2">Je kunt altijd stoppen met "STOP"</div>
                </div>
              }
              timestamp="Gisteren 16:46"
            />
            <WhatsAppMessage sender="user" text="Ik doe mee! 🙌" timestamp="Gisteren 17:03" />
          </WhatsAppChat>
        }
      />

      {/* Scenario 3: Group Start */}
      <ScenarioSection
        id="groep"
        number={3}
        title="Groepsstart & Welkom"
        subtitle="Eerste bericht in de WhatsApp groep"
        explanation="Zodra iemand de groep joint via de invite link, stuurt de AI Facilitator automatisch een welkomstbericht. Dit bericht introduceert de groep, legt de huishoudregels uit, en stelt direct een eerste micro-challenge voor (bijv. een koffiewandeling van 20 minuten). De toon is warm, persoonlijk en activerend—AI faciliteert, mensen verbinden."
        technicalNotes={[
          "AI ontvangt webhook notifications wanneer iemand de groep joint",
          "Binnen 24 uur na laatste user bericht kan AI vrij berichten sturen (service window)",
          "Groepen hebben geen threads API—AI houdt berichten kort en gefocust per onderwerp",
        ]}
        badges={[
          <TechnicalBadge key="group" icon="👥" text="Groepschat" />,
          <TechnicalBadge key="webhook" icon="🔔" text="Join webhook" />,
          <TechnicalBadge key="24h" icon="⏱️" text="24u window" />,
        ]}
        chat={
          <WhatsAppChat title="A'dam-Noord | Cirkeltje 27" subtitle="6 leden" isGroup>
            <WhatsAppMessage sender="system" text="Emma is toegevoegd" />
            <WhatsAppMessage sender="system" text="Thomas is toegevoegd" />
            <WhatsAppMessage sender="system" text="Sophie is toegevoegd" />
            <WhatsAppMessage
              sender="ai"
              text="Welkom in jullie cirkeltje! 👋 We zijn een lokale groep die kleine, fijne ontmoetingen organiseert—denk aan koffiewandelingen, micro-walks, samen even rustig zijn."
              timestamp="14:10"
            />
            <WhatsAppMessage
              sender="ai"
              text={
                <div>
                  <div className="mb-2">🏡 Huishoudregels:</div>
                  <div className="text-sm space-y-1">
                    <div>• Respect & veiligheid eerst</div>
                    <div>• Kleine stappen = goed</div>
                    <div>• Stilte is ook oké</div>
                  </div>
                </div>
              }
              timestamp="14:10"
            />
            <WhatsAppMessage
              sender="ai"
              text="Eerste mini-challenge: Wie wil dit weekend een 20-minuten wandeling doen? Reageer met 1/2/3 als je erbij bent!"
              timestamp="14:11"
            />
            <WhatsAppMessage sender="user" text="1! Zaterdag 10:00?" timestamp="14:23" />
          </WhatsAppChat>
        }
      />

      {/* Scenario 4: Facilitator Check-ins */}
      <ScenarioSection
        id="checkins"
        number={4}
        title="Wekelijkse Check-ins"
        subtitle="AI faciliteert ritme met korte vragen"
        explanation="De AI Facilitator houdt een vast ritme aan (bijv. elke maandag en vrijdag). Elke check-in is kort en concreet: één vraag, één actie. De AI noemt namen om iedereen bij te betrekken, waardeert kleine stappen, en sluit af met een 'knoop-doorhakker' (poll of keuze). Dit ritme creëert voorspelbaarheid en laagdrempelige momenten om elkaar te zien."
        technicalNotes={[
          "Binnen 24 uur na user activiteit kan AI vrij reageren",
          "Voor groepen die stil vallen: AI stuurt max 1-2 template nudges per week (opt-out mogelijk)",
          "Polls en buttons zijn beschikbaar via interactive messages API",
        ]}
        badges={[
          <TechnicalBadge key="ritme" icon="📅" text="Vast ritme" />,
          <TechnicalBadge key="poll" icon="📊" text="Interactive messages" />,
          <TechnicalBadge key="nudge" icon="🔔" text="Template nudge" />,
        ]}
        chat={
          <WhatsAppChat title="A'dam-Noord | Cirkeltje 27" subtitle="6 leden" isGroup>
            <WhatsAppMessage
              sender="ai"
              text="Goedemorgen cirkel! ☀️ Deze week een 10-min ommetje + één vraag:"
              timestamp="Ma 09:00"
            />
            <WhatsAppMessage
              sender="ai"
              text={
                <div>
                  <div className="font-semibold mb-2">"Wat gaf je gisteren een klein moment van rust?"</div>
                  <div className="text-sm text-slate-600">Reageer kort (1 zin is genoeg) en wie wil, stelt een tijd voor!</div>
                </div>
              }
              timestamp="Ma 09:00"
            />
            <WhatsAppMessage sender="user" text="Koffie in de ochtendzon ☕" timestamp="Ma 09:34" />
            <WhatsAppMessage sender="user" text="Mijn kat die op m'n schoot lag 😊" timestamp="Ma 10:12" />
            <WhatsAppMessage
              sender="ai"
              text="Mooie momenten! Emma en Thomas, hoe was het bij jullie? (stilte is ook goed hoor)"
              timestamp="Ma 11:05"
            />
            <WhatsAppMessage
              sender="ai"
              text="Zin om woensdag 19:00 samen het Noorderpark in te lopen? Reactie met 👍 = ja!"
              timestamp="Ma 11:06"
            />
          </WhatsAppChat>
        }
      />

      {/* Scenario 5: Planning Offline Meetup */}
      <ScenarioSection
        id="afspraak"
        number={5}
        title="Offline Afspraak Plannen"
        subtitle="1-op-1 Flow voor details, groep krijgt samenvatting"
        explanation="Voor het plannen van afspraken (exacte tijd, locatie, voorkeuren) stuurt de AI een 1-op-1 WhatsApp Flow naar elke deelnemer. Dit houdt persoonlijke info privé. Zodra iedereen heeft gereageerd, post de AI een aggregate samenvatting in de groep (geen PII). De AI stuurt ook een locatie-pin en bevestigt tijd/plek—alles wat nodig is om de afspraak écht te laten gebeuren."
        technicalNotes={[
          "Flows blijven 1-op-1 om privacy te waarborgen (groepen krijgen geen persoonlijke data)",
          "WhatsApp API ondersteunt locatie-berichten (latitude/longitude + label)",
          "Na afspraak: AI checkt kort in via 1-op-1 (feedback, hoe was het?)",
        ]}
        badges={[
          <TechnicalBadge key="flow" icon="📋" text="1-op-1 Flow" />,
          <TechnicalBadge key="location" icon="📍" text="Locatie bericht" />,
          <TechnicalBadge key="aggregate" icon="📊" text="Aggregate data" />,
        ]}
        chat={
          <div className="space-y-6">
            {/* 1-on-1 Flow */}
            <div>
              <div className="text-sm text-slate-600 mb-2 text-center">1-op-1 met elke deelnemer:</div>
              <WhatsAppChat title="365 Facilitator" subtitle="online">
                <WhatsAppMessage
                  sender="ai"
                  text="Hoi Sophie! Het cirkeltje wil woensdag 19:00 afspreken. Kun jij dan?"
                  timestamp="Di 14:20"
                />
                <WhatsAppMessage
                  sender="ai"
                  isFlow
                  text={
                    <div className="space-y-3 py-2">
                      <div className="font-semibold text-sm">Kun je woensdag 19:00?</div>
                      <div className="space-y-1">
                        <label className="flex items-center gap-2 text-sm">
                          <input type="radio" name="tijd" disabled />
                          Ja, 19:00 is goed
                        </label>
                        <label className="flex items-center gap-2 text-sm">
                          <input type="radio" name="tijd" disabled />
                          Liever 19:30
                        </label>
                        <label className="flex items-center gap-2 text-sm">
                          <input type="radio" name="tijd" disabled />
                          Kan helaas niet
                        </label>
                      </div>
                      <Button size="sm" className="w-full bg-[#FF0837] text-white mt-3">
                        Opslaan
                      </Button>
                    </div>
                  }
                  timestamp="Di 14:20"
                />
                <WhatsAppMessage sender="user" text="Ja, 19:00 is prima!" timestamp="Di 14:42" />
              </WhatsAppChat>
            </div>

            {/* Group Summary */}
            <div>
              <div className="text-sm text-slate-600 mb-2 text-center">Samenvatting in groep:</div>
              <WhatsAppChat title="A'dam-Noord | Cirkeltje 27" subtitle="6 leden" isGroup>
                <WhatsAppMessage
                  sender="ai"
                  text={
                    <div>
                      <div className="font-semibold mb-2">✅ Afspraak bevestigd!</div>
                      <div className="bg-[#F0F0F0] rounded p-2 text-sm space-y-1">
                        <div>📅 Woensdag 19:00</div>
                        <div>📍 Noorderpark (ingang Noord)</div>
                        <div>👥 4/6 kunnen komen</div>
                      </div>
                    </div>
                  }
                  timestamp="Di 16:30"
                />
                <WhatsAppMessage
                  sender="ai"
                  text={
                    <div>
                      <div className="text-sm mb-1">📍 Locatie:</div>
                      <div className="bg-slate-200 rounded h-24 flex items-center justify-center text-xs text-slate-600">
                        [Kaart: Noorderpark ingang]
                      </div>
                    </div>
                  }
                  timestamp="Di 16:30"
                />
              </WhatsAppChat>
            </div>
          </div>
        }
      />

      {/* Scenario 6: Post-Meetup Feedback */}
      <ScenarioSection
        id="feedback"
        number={6}
        title="Na de Ontmoeting"
        subtitle="Korte feedback flow en doorsturen"
        explanation="Na de offline ontmoeting stuurt de AI een korte 1-op-1 check-in naar elke deelnemer. Hoe was het? Wil je vaker? Dit feedback wordt gebruikt om matches te verbeteren en het ritme aan te passen. De AI viert de 'win' ook in de groep—zonder details te delen. Dit bevestigt dat de ontmoeting echt gebeurde en motiveert anderen."
        technicalNotes={[
          "Feedback blijft 1-op-1 (privacy)",
          "AI gebruikt feedback om matching-algoritme te verbeteren (toon, timing, locatie-voorkeur)",
          "Voor no-shows: AI stuurt zacht nudge-bericht (geen shaming, wel zachte aanmoediging)",
        ]}
        badges={[
          <TechnicalBadge key="flow" icon="📋" text="Feedback Flow" />,
          <TechnicalBadge key="analytics" icon="📈" text="Data voor matching" />,
          <TechnicalBadge key="celebrate" icon="🎉" text="Celebrate wins" />,
        ]}
        chat={
          <div className="space-y-6">
            {/* 1-on-1 Feedback */}
            <div>
              <div className="text-sm text-slate-600 mb-2 text-center">1-op-1 feedback:</div>
              <WhatsAppChat title="365 Facilitator" subtitle="online">
                <WhatsAppMessage
                  sender="ai"
                  text="Hoi Sophie! Fijn dat je erbij was gisteravond 😊 Hoe vond je het?"
                  timestamp="Do 09:15"
                />
                <WhatsAppMessage
                  sender="ai"
                  isFlow
                  text={
                    <div className="space-y-3 py-2">
                      <div className="font-semibold text-sm">Hoe was de wandeling?</div>
                      <div className="flex gap-2 justify-center text-2xl">
                        {["😞", "😐", "🙂", "😊", "🤩"].map((emoji) => (
                          <button key={emoji} className="p-2 hover:bg-slate-100 rounded">
                            {emoji}
                          </button>
                        ))}
                      </div>
                      <div className="font-semibold text-sm mt-4">Past woensdag vaker?</div>
                      <div className="space-y-1">
                        <label className="flex items-center gap-2 text-sm">
                          <input type="radio" name="vaker" disabled />
                          Ja, perfect!
                        </label>
                        <label className="flex items-center gap-2 text-sm">
                          <input type="radio" name="vaker" disabled />
                          Liever weekend
                        </label>
                      </div>
                      <Button size="sm" className="w-full bg-[#FF0837] text-white mt-3">
                        Verstuur feedback
                      </Button>
                    </div>
                  }
                  timestamp="Do 09:15"
                />
                <WhatsAppMessage sender="user" text="Het was echt fijn! Ja, woensdag past prima 😊" timestamp="Do 09:28" />
              </WhatsAppChat>
            </div>

            {/* Group Celebration */}
            <div>
              <div className="text-sm text-slate-600 mb-2 text-center">Viering in groep:</div>
              <WhatsAppChat title="A'dam-Noord | Cirkeltje 27" subtitle="6 leden" isGroup>
                <WhatsAppMessage
                  sender="ai"
                  text="🎉 Goed gedaan, team! Gisteren is de eerste wandeling geweest—wat mooi dat jullie elkaar écht hebben ontmoet!"
                  timestamp="Do 10:00"
                />
                <WhatsAppMessage
                  sender="ai"
                  text="Volgende week weer? Reactie met 🙌 als je erbij bent!"
                  timestamp="Do 10:00"
                />
                <WhatsAppMessage sender="user" text="🙌" timestamp="Do 10:05" />
                <WhatsAppMessage sender="user" text="Ja! 🙌" timestamp="Do 10:12" />
              </WhatsAppChat>
            </div>
          </div>
        }
      />

      {/* Footer CTA */}
      <section className="bg-[#FFF0F5] py-20">
        <div className="container mx-auto px-6 max-w-3xl text-center">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">Waarom dit werkt</h2>
          <div className="space-y-4 text-lg text-slate-700 mb-8">
            <p>
              WhatsApp is drempelloos—iedereen heeft het al. De AI doet het organiseren (matching, plannen, herinneren), zodat
              mensen zich kunnen focussen op wat echt telt: elkaar ontmoeten.
            </p>
            <p>
              Door te wisselen tussen intieme 1-op-1 (onboarding, feedback) en sociale groep (ritme, aanmoediging) maximaliseert
              de AI menselijke verbinding zonder opdringerig te zijn.
            </p>
            <p className="font-semibold text-[#FF0837]">
              Het resultaat: van eenzaamheid naar verbinding, in de app die iedereen al heeft.
            </p>
          </div>
          <Button
            size="lg"
            onClick={() => router.push("/")}
            className="bg-[#FF0837] hover:bg-[#E6061F] text-white text-lg py-6 px-8"
          >
            Terug naar Hub →
          </Button>
        </div>
      </section>
    </div>
  )
}
