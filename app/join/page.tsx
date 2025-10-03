"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Users, Code, Lightbulb, Award, ArrowRight, Loader2, AlertCircle, PartyPopper } from 'lucide-react'
import { useState } from "react"

const initialFormData = {
  fullName: '',
  email: '',
  phone: '',
  specializedIn: '',
  year: '',
  major: '',
  specialization: '',
  experience: '',
  motivation: '',
  portfolio: '',
  availability: [] as string[],
  agreeTerms: false
};

export default function JoinPage() {
  const [formData, setFormData] = useState(initialFormData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string | null>>({});

  const requirements = [
    "Currently enrolled at Assiut International Technological University",
    "Basic programming knowledge in at least one language",
    "Passion for technology and continuous learning",
    "Commitment to attend regular meetings and events",
    "Willingness to collaborate and help fellow team members"
  ]

  const benefits = [
    {
      icon: <Code className="h-6 w-6 text-blue-500" />,
      title: "Skill Development",
      description: "Learn cutting-edge technologies through hands-on projects and workshops"
    },
    {
      icon: <Users className="h-6 w-6 text-green-500" />,
      title: "Networking",
      description: "Connect with like-minded students and industry professionals"
    },
    {
      icon: <Lightbulb className="h-6 w-6 text-orange-500" />,
      title: "Innovation",
      description: "Work on real-world projects that make a difference"
    },
    {
      icon: <Award className="h-6 w-6 text-purple-500" />,
      title: "Recognition",
      description: "Gain certificates, recommendations, and portfolio projects"
    }
  ]

  const specializations = [
    "Web Development (Frontend)",
    "Web Development (Backend)",
    "Full-Stack Development",
    "Mobile App Development",
    "Artificial Intelligence & Machine Learning",
    "Data Science & Analytics",
    "UI/UX Design",
    "DevOps & Cloud Computing",
    "Cybersecurity",
    "Game Development",
    "IoT & Hardware",
    "Project Management"
  ]

  const availabilityOptions = ['Weekday Evenings', 'Weekend Mornings', 'Weekend Afternoons', 'Online Meetings', 'Workshops', 'Competitions'];

  const handleAvailabilityChange = (checked: boolean, time: string) => {
    setFormData(prev => {
      if (checked) {
        return { ...prev, availability: [...prev.availability, time] };
      } else {
        return { ...prev, availability: prev.availability.filter(item => item !== time) };
      }
    });
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);
    setFormErrors({}); // Clear previous errors

    const newErrors: Record<string, string> = {};

    // Required field validation
    if (!formData.fullName.trim()) newErrors.fullName = 'Full Name is required.';
    if (!formData.email.trim()) newErrors.email = 'Email Address is required.';
    if (!formData.phone.trim()) newErrors.phone = 'Phone Number is required.';
    if (!formData.specializedIn.trim()) newErrors.specializedIn = 'Specialization is required.';
    if (!formData.year) newErrors.year = 'Academic Year is required.';
    if (!formData.major) newErrors.major = 'Major is required.';
    if (!formData.specialization) newErrors.specialization = 'Area of Interest is required.';
    if (!formData.experience) newErrors.experience = 'Programming Experience is required.';
    if (!formData.motivation.trim()) newErrors.motivation = 'Motivation is required.';
    if (formData.availability.length === 0) newErrors.availability = 'Please select at least one availability option.';
    if (!formData.agreeTerms) newErrors.agreeTerms = 'You must agree to the terms and conditions.';

    // Email format validation
    const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
    if (formData.email.trim() && !emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address.';
    }

    // Phone number format validation (basic example, can be more complex)
    const phoneRegex = /^(\+?\d{1,4}[-.\s]?)?(\(?\d{1,}\)?[-.\s]?)?\d{1,}[-.\s]?\d{1,}[-.\s]?\d{1,}$/;
    if (formData.phone.trim() && !phoneRegex.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number.';
    }

    if (Object.keys(newErrors).length > 0) {
      setFormErrors(newErrors);
      setLoading(false);
      return; // Prevent form submission
    }

    try {
      const response = await fetch('/api/join', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'has error');
      }

      setSuccess(true);
      setFormData(initialFormData);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="container mx-auto px-4 text-center">
          <Card className="max-w-2xl mx-auto p-8">
            <CardHeader>
              <div className="mx-auto bg-green-100 rounded-full p-4 w-20 h-20 flex items-center justify-center mb-4">
                <PartyPopper className="h-10 w-10 text-green-600" />
              </div>
              <CardTitle className="text-3xl">Application Submitted!</CardTitle>
              <CardDescription className="text-lg text-gray-600 mt-2">
                Thank you for your interest in joining AITU Dev. We have received your application and will get back to you soon.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => setSuccess(false)}>Submit Another Application</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h1 className="text-4xl font-bold mb-6 text-slate-900">Join AITU Dev</h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            Ready to be part of an innovative tech community? Join us and accelerate your journey 
            in technology while making lasting connections and building amazing projects.
          </p>
        </div>

        {/* Benefits Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12 text-slate-900">Why Join Us?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {benefits.map((benefit, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="bg-gray-50 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    {benefit.icon}
                  </div>
                  <CardTitle className="text-lg">{benefit.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Requirements */}
        <section className="mb-16 bg-gray-50 py-16 -mx-4 px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 text-slate-900">Requirements</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-6 text-slate-800">Basic Requirements</h3>
                <div className="space-y-4">
                  {requirements.map((requirement, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{requirement}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-6 text-slate-800">Preferred Skills</h3>
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">JavaScript</Badge>
                    <Badge variant="outline">Python</Badge>
                    <Badge variant="outline">Java</Badge>
                    <Badge variant="outline">C++</Badge>
                    <Badge variant="outline">C#</Badge>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">React</Badge>
                    <Badge variant="outline">Node.js</Badge>
                    <Badge variant="outline">Flutter</Badge>
                    <Badge variant="outline">Django</Badge>
                    <Badge variant="outline">React Native</Badge>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">Git</Badge>
                    <Badge variant="outline">SQL</Badge>
                    <Badge variant="outline">Linux</Badge>
                    <Badge variant="outline">AWS</Badge>
                    <Badge variant="outline">Azure</Badge>
                  </div>
                  <p className="text-sm text-gray-600 mt-4">
                    Don't worry if you don't have all these skills - we'll help you learn!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Application Form */}
        <section className="mb-16">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 text-slate-900">Application Form</h2>
            <Card>
              <CardHeader>
                <CardTitle>Join Our Team</CardTitle>
                <CardDescription>
                  Fill out this form to apply for membership in AITU Dev. We'll review your application 
                  and get back to you within 5-7 business days.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {error && (
                  <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-md flex items-start gap-3 text-right">
                    <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Error</p>
                      <p className="text-sm">{error}</p>
                    </div>
                  </div>
                )}
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Personal Information */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="fullName">Full Name *</Label>
                      <Input
                        id="fullName"
                        value={formData.fullName}
                        onChange={(e) => {
                          setFormData({...formData, fullName: e.target.value});
                          setFormErrors(prev => ({...prev, fullName: null}));
                        }}
                        placeholder="Enter your full name"
                        required
                        disabled={loading}
                      />
                      {formErrors.fullName && <p className="text-red-500 text-sm mt-1">{formErrors.fullName}</p>}
                    </div>
                    <div>
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => {
                          setFormData({...formData, email: e.target.value});
                          setFormErrors(prev => ({...prev, email: null}));
                        }}
                        placeholder="your.email@aitu.edu.eg"
                        required
                        disabled={loading}
                      />
                      {formErrors.email && <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => {
                          setFormData({...formData, phone: e.target.value});
                          setFormErrors(prev => ({...prev, phone: null}));
                        }}
                        placeholder="+20 101 234 5678"
                        required
                        disabled={loading}
                      />
                      {formErrors.phone && <p className="text-red-500 text-sm mt-1">{formErrors.phone}</p>}
                    </div>
                    <div>
                      <Label htmlFor="studentId">Specialized in *</Label>
                      <Input
                        id="specializedIn"
                        value={formData.specializedIn}
                        onChange={(e) => {
                          setFormData({...formData, specializedIn: e.target.value});
                          setFormErrors(prev => ({...prev, specializedIn: null}));
                        }}
                        placeholder="Specialized in..."
                        required
                        disabled={loading}
                      />
                      {formErrors.specializedIn && <p className="text-red-500 text-sm mt-1">{formErrors.specializedIn}</p>}
                    </div>
                  </div>

                  {/* Academic Information */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="year">Academic Year *</Label>
                      <Select 
                        value={formData.year}
                        onValueChange={(value) => {
                          setFormData({...formData, year: value});
                          setFormErrors(prev => ({...prev, year: null}));
                        }}
                        disabled={loading}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select your year" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">First Year</SelectItem>
                          <SelectItem value="2">Second Year</SelectItem>
                          <SelectItem value="3">Third Year</SelectItem>
                          <SelectItem value="4">Fourth Year</SelectItem>
                          <SelectItem value="graduate">Graduate Student</SelectItem>
                        </SelectContent>
                      </Select>
                      {formErrors.year && <p className="text-red-500 text-sm mt-1">{formErrors.year}</p>}
                    </div>
                    <div>
                      <Label htmlFor="major">Major *</Label>
                      <Select 
                        value={formData.major}
                        onValueChange={(value) => {
                          setFormData({...formData, major: value});
                          setFormErrors(prev => ({...prev, major: null}));
                        }}
                        disabled={loading}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select your major" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="cs">Computer Science</SelectItem>
                          <SelectItem value="se">Software Engineering</SelectItem>
                          <SelectItem value="ai">Artificial Intelligence</SelectItem>
                          <SelectItem value="is">Information Systems</SelectItem>
                          <SelectItem value="it">Information Technology</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      {formErrors.major && <p className="text-red-500 text-sm mt-1">{formErrors.major}</p>}
                    </div>
                  </div>

                  {/* Specialization */}
                  <div>
                    <Label htmlFor="specialization">Area of Interest *</Label>
                    <Select 
                      value={formData.specialization}
                      onValueChange={(value) => {
                        setFormData({...formData, specialization: value});
                        setFormErrors(prev => ({...prev, specialization: null}));
                      }}
                      disabled={loading}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select your primary area of interest" />
                      </SelectTrigger>
                      <SelectContent>
                        {specializations.map((spec, index) => (
                          <SelectItem key={index} value={spec}>
                            {spec}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {formErrors.specialization && <p className="text-red-500 text-sm mt-1">{formErrors.specialization}</p>}
                  </div>

                  {/* Experience */}
                  <div>
                    <Label htmlFor="experience">Programming Experience *</Label>
                    <Select 
                      value={formData.experience}
                      onValueChange={(value) => {
                        setFormData({...formData, experience: value});
                        setFormErrors(prev => ({...prev, experience: null}));
                      }}
                      disabled={loading}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select your experience level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="beginner">Beginner (0-1 years)</SelectItem>
                        <SelectItem value="intermediate">Intermediate (1-2 years)</SelectItem>
                        <SelectItem value="advanced">Advanced (2+ years)</SelectItem>
                      </SelectContent>
                    </Select>
                    {formErrors.experience && <p className="text-red-500 text-sm mt-1">{formErrors.experience}</p>}
                  </div>

                  {/* Motivation */}
                  <div>
                    <Label htmlFor="motivation">Why do you want to join AITU Dev? *</Label>
                    <Textarea
                      id="motivation"
                      value={formData.motivation}
                      onChange={(e) => {
                        setFormData({...formData, motivation: e.target.value});
                        setFormErrors(prev => ({...prev, motivation: null}));
                      }}
                      placeholder="Tell us about your motivation, goals, and what you hope to contribute to the team..."
                      rows={4}
                      required
                      disabled={loading}
                    />
                    {formErrors.motivation && <p className="text-red-500 text-sm mt-1">{formErrors.motivation}</p>}
                  </div>

                  {/* Portfolio */}
                  <div>
                    <Label htmlFor="portfolio">Portfolio/GitHub (Optional)</Label>
                    <Input
                      id="portfolio"
                      value={formData.portfolio}
                      onChange={(e) => setFormData({...formData, portfolio: e.target.value})}
                      placeholder="https://github.com/yourusername or your portfolio website"
                      disabled={loading}
                    />
                  </div>

                  {/* Availability */}
                  <div>
                    <Label className="text-base font-medium">Availability (Select all that apply) *</Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-3">
                      {availabilityOptions.map((time) => (
                        <div key={time} className="flex items-center space-x-2">
                          <Checkbox 
                            id={time} 
                            checked={formData.availability.includes(time)}
                            onCheckedChange={(checked) => {
                              handleAvailabilityChange(checked as boolean, time);
                              setFormErrors(prev => ({...prev, availability: null}));
                            }}
                            disabled={loading}
                          />
                          <Label htmlFor={time} className="text-sm">{time}</Label>
                        </div>
                      ))}
                    </div>
                    {formErrors.availability && <p className="text-red-500 text-sm mt-1">{formErrors.availability}</p>}
                  </div>

                  {/* Terms Agreement */}
                  <div className="flex items-start space-x-2">
                    <Checkbox 
                      id="terms" 
                      checked={formData.agreeTerms}
                      onCheckedChange={(checked) => {
                        setFormData({...formData, agreeTerms: checked as boolean});
                        setFormErrors(prev => ({...prev, agreeTerms: null}));
                      }}
                      disabled={loading}
                      required 
                    />
                    <Label htmlFor="terms" className="text-sm leading-relaxed">
                      I agree to the team's code of conduct and commit to actively participating in team activities. 
                      I understand that membership requires regular attendance and contribution to team projects. *
                    </Label>
                    {formErrors.agreeTerms && <p className="text-red-500 text-sm mt-1">{formErrors.agreeTerms}</p>}
                  </div>

                  {/* Submit Button */}
                  <Button 
                    type="submit" 
                    size="lg" 
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        Submit Application
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Next Steps */}
        <section className="bg-slate-900 text-white py-16 -mx-4 px-4 rounded-lg">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-8">What Happens Next?</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div>
                <div className="bg-blue-500 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl font-bold">1</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Application Review</h3>
                <p className="text-gray-300">
                  Our team will review your application within 5-7 business days.
                </p>
              </div>
              <div>
                <div className="bg-green-500 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl font-bold">2</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Interview</h3>
                <p className="text-gray-300">
                  If selected, you'll have a brief interview with our leadership team.
                </p>
              </div>
              <div>
                <div className="bg-orange-500 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl font-bold">3</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Welcome!</h3>
                <p className="text-gray-300">
                  Join our orientation session and start your journey with AITU Dev.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
