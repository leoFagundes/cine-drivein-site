"use client";

import React, { useState } from "react";
import RevealOnScroll from "@/components/revealOnScroll";
import FeedbackIllustration from "@/components/feedbackIllustration";
import StarRating from "@/components/starRating";
import Button from "@/components/button";
import FeedbackList, { saveMyFeedbackId } from "@/components/feedbackList";
import FeedbackRepositories from "@/services/repositories/FeedbackRepositories";
import { FaPaperPlane, FaCheckCircle } from "react-icons/fa";
import { IoWarning } from "react-icons/io5";

export default function FeedbackPage() {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [rating, setRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(false);
  const [listRefreshKey, setListRefreshKey] = useState(0);

  const canSubmit = rating > 0 && message.trim().length > 0;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;

    setSubmitting(true);
    setError(false);

    const id = await FeedbackRepositories.createFeedback({
      name: name.trim() || "Anônimo",
      rating,
      message: message.trim(),
    });

    setSubmitting(false);

    if (id) {
      saveMyFeedbackId(id);
      setSubmitted(true);
      setName("");
      setMessage("");
      setRating(0);
      setListRefreshKey((k) => k + 1);
    } else {
      setError(true);
    }
  }

  return (
    <section className="flex flex-col items-center gap-6 w-11/12 sm:w-10/12 max-w-[700px] my-8">
      <RevealOnScroll className="flex flex-col items-center gap-3 text-center">
        <FeedbackIllustration />
        <h1 className="text-primary text-center text-4xl font-semibold">
          SUA OPINIÃO EM CENA
        </h1>
        <p className="text-center font-semibold max-w-[500px]">
          O Cine Drive-In é feito para você! Deixe sua avaliação, conte
          sugestões, elogios ou reclamações — sua opinião nos ajuda a tornar
          cada sessão ainda melhor.
        </p>
        <p className="text-center text-sm font-medium max-w-[500px] text-stone-500">
          Esse espaço existe para nos ajudar a melhorar cada vez mais. Se for
          fazer uma reclamação, conte com detalhes o que aconteceu e, se
          possível, traga uma crítica construtiva: como podemos melhorar?
          Assim conseguimos transformar seu feedback em mudanças reais.
        </p>
      </RevealOnScroll>

      <RevealOnScroll delay={100} className="w-full">
        {submitted ? (
          <div className="bg-white shadow-card rounded-lg p-8 flex flex-col items-center text-center gap-3">
            <FaCheckCircle className="text-primary" size={"40px"} />
            <h2 className="font-semibold text-xl">Obrigado pelo carinho!</h2>
            <p className="font-medium text-sm max-w-[400px]">
              Sua avaliação foi enviada com sucesso. Ela passa por uma breve
              análise da nossa equipe antes de ficar visível aqui — assim que
              for aprovada, ela aparece na lista abaixo pra todo mundo ver.
            </p>
            <button
              onClick={() => setSubmitted(false)}
              className="text-primary font-semibold text-sm underline sm:decoration-transparent sm:hover:decoration-inherit sm:hover:underline"
            >
              Enviar outra mensagem
            </button>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="bg-white shadow-card rounded-lg p-6 sm:p-8 flex flex-col gap-5 w-full"
          >
            <div className="flex flex-col items-center gap-2">
              <p className="font-semibold text-sm text-center">
                Como você avalia sua experiência no Cine Drive-In?
              </p>
              <StarRating value={rating} onChange={setRating} />
              {rating === 0 && (
                <p className="text-xs text-stone-400 font-medium">
                  Selecione de 1 a 5 estrelas
                </p>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold" htmlFor="feedback-name">
                Nome <span className="font-normal text-stone-400">(opcional)</span>
              </label>
              <input
                id="feedback-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Como podemos te chamar?"
                maxLength={80}
                className="border border-stone-200 rounded-lg px-3 py-2.5 text-sm font-medium outline-none focus:border-primary transition-colors"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold" htmlFor="feedback-message">
                Sua mensagem
              </label>
              <textarea
                id="feedback-message"
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Conte pra gente sobre sua experiência, sugestões, elogios ou reclamações..."
                rows={5}
                maxLength={1000}
                className="border border-stone-200 rounded-lg px-3 py-2.5 text-sm font-medium outline-none focus:border-primary transition-colors resize-none"
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 text-orange-700">
                <IoWarning size={"18px"} />
                <p className="text-sm font-medium">
                  Não foi possível enviar sua mensagem. Tente novamente.
                </p>
              </div>
            )}

            <Button
              type="submit"
              disabled={!canSubmit || submitting}
              className="flex items-center justify-center gap-2 w-full sm:w-auto sm:self-center sm:px-12 disabled:opacity-50 disabled:saturate-50 disabled:hover:saturate-50 disabled:cursor-not-allowed disabled:hover:cursor-not-allowed"
            >
              <FaPaperPlane size={"14px"} />
              {submitting ? "Enviando..." : "Enviar mensagem"}
            </Button>
          </form>
        )}
      </RevealOnScroll>

      <RevealOnScroll delay={150} className="w-full flex flex-col gap-3">
        <h2 className="text-center font-semibold text-lg">
          O que estão dizendo
        </h2>
        <FeedbackList refreshKey={listRefreshKey} />
      </RevealOnScroll>
    </section>
  );
}
