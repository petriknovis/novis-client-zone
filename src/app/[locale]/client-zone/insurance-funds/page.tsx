'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import ProtectedRoute from "@/components/ProtectedRoute";
import { ArrowRight, Shield, TrendingUp, Lock, HelpCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useTranslations } from 'next-intl';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function InsuranceFundsPage() {
  const t = useTranslations('insuranceFunds');

  const benefits = [
    {
      icon: <Shield className="h-8 w-8 text-blue-600" />,
      title: t('benefits.secureInvestment.title'),
      description: t('benefits.secureInvestment.description'),
    },
    {
      icon: <TrendingUp className="h-8 w-8 text-blue-600" />,
      title: t('benefits.growthPotential.title'),
      description: t('benefits.growthPotential.description'),
    },
    {
      icon: <Lock className="h-8 w-8 text-blue-600" />,
      title: t('benefits.financialStability.title'),
      description: t('benefits.financialStability.description'),
    },
  ];

  const testimonials = [
    {
      quote: t('testimonials.quote'),
      author: t('testimonials.author'),
      role: t('testimonials.role'),
    },
  ];

  const faqs = [
    {
      question: t('faq.items.what.question'),
      answer: t('faq.items.what.answer'),
    },
    {
      question: t('faq.items.how.question'),
      answer: t('faq.items.how.answer'),
    },
    {
      question: t('faq.items.unique.question'),
      answer: t('faq.items.unique.answer'),
    },
  ];

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="grid gap-6">
            {/* Hero Section */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold tracking-tight mb-4">{t('pageTitle')}</h1>
              <p className="text-gray-600 max-w-2xl mx-auto">
                {t('pageDescription')}
              </p>
            </div>

            {/* Main CTA */}
            <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-none mb-8">
              <CardContent className="flex flex-col md:flex-row items-center justify-between p-8">
                <div className="mb-4 md:mb-0">
                  <h2 className="text-2xl font-bold text-blue-900 mb-2">
                    {t('exploreTitle')}
                  </h2>
                  <p className="text-blue-700">
                    {t('exploreDescription')}
                  </p>
                </div>
                <Link 
                  href="https://www.novis.eu/sk/novis-fondy"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    {t('visitFunds')}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Benefits Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {benefits.map((benefit, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="mb-4">{benefit.icon}</div>
                    <h3 className="font-semibold mb-2">{benefit.title}</h3>
                    <p className="text-gray-600">{benefit.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Testimonials Section */}
            <Card className="mb-8 bg-gray-50">
              <CardHeader>
                <CardTitle>{t('testimonials.title')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6">
                  {testimonials.map((testimonial, index) => (
                    <div key={index} className="text-center">
                      <blockquote className="text-lg text-gray-700 italic mb-4">
                        "{testimonial.quote}"
                      </blockquote>
                      <cite className="not-italic">
                        <div className="font-semibold">{testimonial.author}</div>
                        <div className="text-gray-600">{testimonial.role}</div>
                      </cite>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* FAQ Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HelpCircle className="h-5 w-5" />
                  {t('faq.title')}
                </CardTitle>
                <CardDescription>
                  {t('faq.description')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible>
                  {faqs.map((faq, index) => (
                    <AccordionItem key={index} value={`item-${index}`}>
                      <AccordionTrigger>{faq.question}</AccordionTrigger>
                      <AccordionContent>{faq.answer}</AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>

            {/* Contact Support Section */}
            <Card className="bg-gray-50 mt-8">
              <CardContent className="p-6">
                <div className="text-center">
                  <h3 className="text-xl font-semibold mb-2">{t('support.title')}</h3>
                  <p className="text-gray-600 mb-4">
                    {t('support.description')}
                  </p>
                  <Button variant="outline">{t('support.button')}</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
