import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Send, MapPin, Phone, Mail, Sparkles, CheckCircle2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { trackLeadConversion } from "@/lib/tracking";
import auditVisual from "@/assets/ai-audit-visual.jpg";

interface AuditResult {
  score?: number;
  summary?: string;
  recommendations?: string[];
}

const BUSINESS_TYPES = [
  "E-commerce",
  "Local services",
  "Restaurant / Hospitality",
  "Professional services",
  "Real estate",
  "Health & wellness",
  "Non-profit",
  "Other",
];

const LeadAuditForm = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [audit, setAudit] = useState<AuditResult | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    website: "",
    businessType: "",
    message: "",
  });

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.email.trim()) {
      toast({ title: "Please add your name and email", variant: "destructive" });
      return;
    }
    if (!emailRegex.test(formData.email)) {
      toast({ title: "Please enter a valid email address", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);
    setAudit(null);

    try {
      const { data, error } = await supabase.functions.invoke("run-ai-audit", {
        body: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone || undefined,
          website: formData.website || undefined,
          businessType: formData.businessType || undefined,
          message: formData.message || undefined,
        },
      });

      if (error) {
        console.error("Audit error:", error);
        toast({
          title: "Could not submit",
          description: "Please try again or email us directly.",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      // Fire Google Ads conversion
      trackLeadConversion({ has_website: !!formData.website });

      setSubmitted(true);
      if (data?.audit) {
        setAudit(data.audit as AuditResult);
        toast({ title: "Your free AI audit is ready!" });
      } else {
        toast({
          title: "Message received!",
          description: "We'll be in touch within 24 hours.",
        });
      }

      setFormData({
        name: "",
        email: "",
        phone: "",
        website: "",
        businessType: "",
        message: "",
      });
    } catch (err) {
      console.error(err);
      toast({
        title: "Something went wrong",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="relative py-24 px-4 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 -left-32 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 -right-32 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
      </div>
      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="grid lg:grid-cols-2 gap-16">
          {/* Left column — info */}
          <div className="animate-fade-up">
            <span className="text-primary font-medium text-sm uppercase tracking-wider">
              Get In Touch
            </span>
            <h2 className="font-heading text-4xl md:text-5xl font-bold mt-4 mb-6">
              Free AI Website <span className="gradient-text">Audit</span>
            </h2>
            <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
              Drop your website URL below and our AI will instantly score your site
              and give you 3-5 actionable recommendations — for free, no obligation.
            </p>

            <div className="relative mb-10 rounded-3xl overflow-hidden border border-border">
              <img
                src={auditVisual}
                alt="AI scanning a website to generate an instant audit report"
                loading="lazy"
                width={1024}
                height={1024}
                className="w-full h-48 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
            </div>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-heading font-semibold mb-1">Our Office</h4>
                  <p className="text-muted-foreground">
                    10 Winklespruit Road, Winklespruit
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Phone className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-heading font-semibold mb-1">Phone</h4>
                  <p className="text-muted-foreground">031 100 0683</p>
                  <p className="text-muted-foreground">073 645 6141</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-heading font-semibold mb-1">Email</h4>
                  <p className="text-muted-foreground">sales@nativedigital.co.za</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right column — form / audit result */}
          <div className="animate-fade-up-delay-2">
            {audit ? (
              <article className="p-8 rounded-3xl card-gradient border border-border space-y-5">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-heading text-2xl font-bold">Your AI Audit</h3>
                    {typeof audit.score === "number" && (
                      <p className="text-muted-foreground text-sm">
                        Overall score:{" "}
                        <span className="text-primary font-semibold">
                          {audit.score}/100
                        </span>
                      </p>
                    )}
                  </div>
                </div>

                {audit.summary && (
                  <p className="text-foreground/90 leading-relaxed">{audit.summary}</p>
                )}

                {audit.recommendations && audit.recommendations.length > 0 && (
                  <div>
                    <h4 className="font-heading font-semibold mb-3">
                      Recommendations
                    </h4>
                    <ul className="space-y-2">
                      {audit.recommendations.map((rec, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                          <span className="text-muted-foreground">{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <p className="text-sm text-muted-foreground pt-4 border-t border-border">
                  We've also emailed this audit to our team — expect a follow-up
                  within 24 hours with a tailored growth plan.
                </p>

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    setAudit(null);
                    setSubmitted(false);
                  }}
                >
                  Run another audit
                </Button>
              </article>
            ) : submitted ? (
              <div className="p-8 rounded-3xl card-gradient border border-border text-center space-y-4">
                <CheckCircle2 className="w-12 h-12 text-primary mx-auto" />
                <h3 className="font-heading text-2xl font-bold">Message received!</h3>
                <p className="text-muted-foreground">
                  Thanks for reaching out — we'll get back to you within 24 hours.
                </p>
                <Button variant="outline" onClick={() => setSubmitted(false)}>
                  Send another message
                </Button>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="p-8 rounded-3xl card-gradient border border-border"
              >
                <div className="space-y-5">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-2">
                      Full Name *
                    </label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={handleChange}
                      maxLength={100}
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-2">
                      Email Address *
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      maxLength={255}
                      required
                    />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium mb-2">
                        Phone Number
                      </label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        placeholder="+27 XX XXX XXXX"
                        value={formData.phone}
                        onChange={handleChange}
                        maxLength={20}
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="businessType"
                        className="block text-sm font-medium mb-2"
                      >
                        Business Type
                      </label>
                      <Select
                        value={formData.businessType}
                        onValueChange={(v) =>
                          setFormData((p) => ({ ...p, businessType: v }))
                        }
                      >
                        <SelectTrigger id="businessType">
                          <SelectValue placeholder="Select..." />
                        </SelectTrigger>
                        <SelectContent>
                          {BUSINESS_TYPES.map((t) => (
                            <SelectItem key={t} value={t}>
                              {t}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="website" className="block text-sm font-medium mb-2">
                      Website URL{" "}
                      <span className="text-primary text-xs">
                        (for free AI audit)
                      </span>
                    </label>
                    <Input
                      id="website"
                      name="website"
                      type="url"
                      placeholder="https://yourbusiness.co.za"
                      value={formData.website}
                      onChange={handleChange}
                      maxLength={255}
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium mb-2">
                      Tell us about your project
                    </label>
                    <Textarea
                      id="message"
                      name="message"
                      placeholder="Goals, challenges, timeline..."
                      value={formData.message}
                      onChange={handleChange}
                      maxLength={1000}
                    />
                  </div>

                  <Button
                    type="submit"
                    variant="hero"
                    size="lg"
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Sparkles className="w-4 h-4 mr-2 animate-pulse" />
                        {formData.website ? "Generating your audit..." : "Sending..."}
                      </>
                    ) : (
                      <>
                        {formData.website ? "Get My Free AI Audit" : "Send Message"}
                        <Send className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>

                  <p className="text-xs text-muted-foreground text-center">
                    By submitting, you agree to be contacted by Native Digital Media.
                  </p>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default LeadAuditForm;
