import React, { useState } from "react";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { testimonials } from "../../constants/testimonials";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";

export function TestimonialsCarousel() {
  const [index, setIndex] = useState(0);
  const prev = () => setIndex((i) => (i - 1 + testimonials.length) % testimonials.length);
  const next = () => setIndex((i) => (i + 1) % testimonials.length);
  const t = testimonials[index];

  return (
    <section id="testimonials" className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-4 mb-10">
          <h2 className="font-heading text-3xl lg:text-4xl font-bold text-blue-900">Depoimentos de quem faz parte</h2>
        </div>
        <div className="relative max-w-4xl mx-auto">
          <Card className="border-0 shadow-lg">
            <CardContent className="p-0">
              <div className="flex flex-col md:flex-row">
                {/* Área do texto - lado esquerdo */}
                <div className="flex-1 p-6 md:p-8">
                  <div className="flex mb-4 text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-slate-700 mb-6 text-lg leading-relaxed">"{t.quote}"</p>
                  <div className="flex items-center gap-3">
                    <div>
                      <p className="font-semibold text-slate-900 text-lg">{t.name}</p>
                      <p className="text-sm text-slate-600">{t.role}</p>
                    </div>
                  </div>
                </div>
                
                {/* Área da foto - lado direito */}
                <div className="w-full md:w-1/3 p-6 md:p-8 flex items-center justify-center">
                  <img 
                    src={t.avatar} 
                    alt={t.name} 
                    className="w-full h-64 md:h-80 object-cover rounded-lg shadow-md" 
                  />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <button aria-label="Anterior" onClick={prev} className="absolute -left-4 top-1/2 -translate-y-1/2 rounded-full bg-white shadow p-2 hover:bg-slate-50">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button aria-label="Próximo" onClick={next} className="absolute -right-4 top-1/2 -translate-y-1/2 rounded-full bg-white shadow p-2 hover:bg-slate-50">
            <ChevronRight className="h-5 w-5" />
          </button>
          
          <div className="mt-4 flex justify-center gap-2">
            {testimonials.map((_, i) => (
              <span key={i} className={`h-2 w-2 rounded-full ${i === index ? "bg-blue-900" : "bg-slate-300"}`} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}


