"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ArrowLeft, ArrowRight, Sparkles } from "lucide-react"
import { useRouter } from "next/navigation"

interface OnboardingData {
  postcode: string
  availability: string
  comfort: string
}

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState<OnboardingData>({
    postcode: "",
    availability: "",
    comfort: "",
  })

  const updateField = (field: keyof OnboardingData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const canProceed = () => {
    if (step === 1) return formData.postcode.length >= 4
    if (step === 2) return formData.availability !== ""
    if (step === 3) return formData.comfort !== ""
    return false
  }

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1)
    }
  }

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  const handleSubmit = async () => {
    // TODO: POST to /api/onboarding
    console.log("Submitting onboarding data:", formData)

    // For now, redirect to main dashboard
    router.push("/")
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <Card className="w-full max-w-lg border-[#FFE6ED] shadow-xl">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-[#FF0837] flex items-center justify-center">
            <Sparkles className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-3xl font-bold text-slate-900">
            Welkom bij 365 Hub
          </CardTitle>
          <CardDescription className="text-base text-slate-600">
            Van eenzaamheid naar verbinding. Laten we je cirkel vinden.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Progress indicator */}
          <div className="flex gap-2 mb-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className={`h-2 flex-1 rounded-full transition-colors ${
                  i <= step ? "bg-[#FF0837]" : "bg-[#FFE6ED]"
                }`}
              />
            ))}
          </div>

          {/* Step 1: Postcode */}
          {step === 1 && (
            <div className="space-y-4 animate-in fade-in duration-300">
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  Waar woon je?
                </h3>
                <p className="text-slate-600 mb-6">
                  We koppelen je aan een cirkel in jouw buurt. Alleen je eerste 4 cijfers.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="postcode" className="text-slate-700">
                  Postcode
                </Label>
                <Input
                  id="postcode"
                  type="text"
                  placeholder="1033"
                  maxLength={4}
                  value={formData.postcode}
                  onChange={(e) => updateField("postcode", e.target.value)}
                  className="text-lg h-12"
                  autoFocus
                />
                <p className="text-sm text-slate-500">
                  Bijvoorbeeld: 1033 voor Amsterdam Noord
                </p>
              </div>
            </div>
          )}

          {/* Step 2: Availability */}
          {step === 2 && (
            <div className="space-y-4 animate-in fade-in duration-300">
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  Wanneer kun je?
                </h3>
                <p className="text-slate-600 mb-6">
                  We organiseren 2 momenten per week. Wanneer past het beste?
                </p>
              </div>

              <RadioGroup
                value={formData.availability}
                onValueChange={(value) => updateField("availability", value)}
                className="space-y-3"
              >
                <div className="flex items-center space-x-3 border-2 border-[#FFE6ED] rounded-lg p-4 hover:border-[#FF0837] transition-colors cursor-pointer">
                  <RadioGroupItem value="doordeweeks" id="doordeweeks" />
                  <Label
                    htmlFor="doordeweeks"
                    className="flex-1 cursor-pointer text-slate-900"
                  >
                    <span className="font-semibold">Doordeweeks avond</span>
                    <p className="text-sm text-slate-600">Meestal woensdag 19:00</p>
                  </Label>
                </div>

                <div className="flex items-center space-x-3 border-2 border-[#FFE6ED] rounded-lg p-4 hover:border-[#FF0837] transition-colors cursor-pointer">
                  <RadioGroupItem value="weekend" id="weekend" />
                  <Label
                    htmlFor="weekend"
                    className="flex-1 cursor-pointer text-slate-900"
                  >
                    <span className="font-semibold">Weekend ochtend</span>
                    <p className="text-sm text-slate-600">Meestal zaterdag 10:00</p>
                  </Label>
                </div>

                <div className="flex items-center space-x-3 border-2 border-[#FFE6ED] rounded-lg p-4 hover:border-[#FF0837] transition-colors cursor-pointer">
                  <RadioGroupItem value="beide" id="beide" />
                  <Label
                    htmlFor="beide"
                    className="flex-1 cursor-pointer text-slate-900"
                  >
                    <span className="font-semibold">Beide werken</span>
                    <p className="text-sm text-slate-600">Maximale flexibiliteit</p>
                  </Label>
                </div>
              </RadioGroup>
            </div>
          )}

          {/* Step 3: Comfort level */}
          {step === 3 && (
            <div className="space-y-4 animate-in fade-in duration-300">
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  Waar voel je je prettig?
                </h3>
                <p className="text-slate-600 mb-6">
                  We houden rekening met wat voor jou werkt. Je kunt dit later altijd aanpassen.
                </p>
              </div>

              <RadioGroup
                value={formData.comfort}
                onValueChange={(value) => updateField("comfort", value)}
                className="space-y-3"
              >
                <div className="flex items-center space-x-3 border-2 border-[#FFE6ED] rounded-lg p-4 hover:border-[#FF0837] transition-colors cursor-pointer">
                  <RadioGroupItem value="korte-groepjes" id="korte-groepjes" />
                  <Label
                    htmlFor="korte-groepjes"
                    className="flex-1 cursor-pointer text-slate-900"
                  >
                    <span className="font-semibold">Korte groepjes (4-6)</span>
                    <p className="text-sm text-slate-600">Intiem, iedereen komt aan bod</p>
                  </Label>
                </div>

                <div className="flex items-center space-x-3 border-2 border-[#FFE6ED] rounded-lg p-4 hover:border-[#FF0837] transition-colors cursor-pointer">
                  <RadioGroupItem value="grote-groepen" id="grote-groepen" />
                  <Label
                    htmlFor="grote-groepen"
                    className="flex-1 cursor-pointer text-slate-900"
                  >
                    <span className="font-semibold">Grote groepen (10+)</span>
                    <p className="text-sm text-slate-600">Veel energie, diverse gesprekken</p>
                  </Label>
                </div>

                <div className="flex items-center space-x-3 border-2 border-[#FFE6ED] rounded-lg p-4 hover:border-[#FF0837] transition-colors cursor-pointer">
                  <RadioGroupItem value="1-op-1" id="1-op-1" />
                  <Label
                    htmlFor="1-op-1"
                    className="flex-1 cursor-pointer text-slate-900"
                  >
                    <span className="font-semibold">Liever 1-op-1</span>
                    <p className="text-sm text-slate-600">Dieper contact, op je eigen tempo</p>
                  </Label>
                </div>
              </RadioGroup>
            </div>
          )}

          {/* Navigation buttons */}
          <div className="flex gap-3 pt-4">
            {step > 1 && (
              <Button
                onClick={handleBack}
                variant="outline"
                className="flex-1 border-2 border-[#FFE6ED] text-[#FF0837] hover:bg-[#FFF0F5]"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Vorige
              </Button>
            )}

            {step < 3 ? (
              <Button
                onClick={handleNext}
                disabled={!canProceed()}
                className={`flex-1 bg-[#FF0837] hover:bg-[#E6061F] text-white ${
                  step === 1 ? "w-full" : ""
                }`}
              >
                Volgende
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={!canProceed()}
                className="flex-1 bg-[#FF0837] hover:bg-[#E6061F] text-white"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Start mijn reis
              </Button>
            )}
          </div>

          {/* Helper text */}
          <p className="text-center text-sm text-slate-500 pt-2">
            Stap {step} van 3
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
