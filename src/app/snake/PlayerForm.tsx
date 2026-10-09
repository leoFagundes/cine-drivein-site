"use client";

import { useId, useState, type FormEvent } from "react";
import {
  digitsOnly,
  formatPhone,
  isValidFullName,
  isValidPhone,
  normalizeName,
  type PlayerProfile,
} from "@/lib/snakeIdentity";
import type { SnakeThemeCopy } from "./themes/types";

interface PlayerFormProps {
  mode: "register" | "edit";
  copy: SnakeThemeCopy;
  initialName?: string;
  initialPhone?: string;
  onSubmit: (profile: PlayerProfile) => void;
  onCancel?: () => void;
}

/** Cadastro obrigatório antes de jogar: nome completo + telefone com DDD. */
export default function PlayerForm({
  mode,
  copy,
  initialName = "",
  initialPhone = "",
  onSubmit,
  onCancel,
}: PlayerFormProps) {
  const id = useId();
  const [name, setName] = useState(initialName);
  const [phone, setPhone] = useState(formatPhone(initialPhone));
  const [touched, setTouched] = useState({ name: false, phone: false });
  const [submitted, setSubmitted] = useState(false);

  const phoneDigits = digitsOnly(phone);
  const nameOk = isValidFullName(name);
  const phoneOk = isValidPhone(phoneDigits);
  const showNameError = (touched.name || submitted) && !nameOk;
  const showPhoneError = (touched.phone || submitted) && !phoneOk;

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitted(true);
    if (!nameOk || !phoneOk) return;
    onSubmit({ fullName: normalizeName(name), phone: phoneDigits });
  }

  return (
    <form onSubmit={handleSubmit} className="sk-card sk-form" noValidate>
      <div className="flex flex-col gap-1">
        <h2 className="sk-form__title">
          {mode === "register" ? copy.registerTitle : "Editar cadastro"}
        </h2>
        {mode === "register" && <p className="sk-form__subtitle">{copy.registerSubtitle}</p>}
      </div>

      <label className="sk-field" htmlFor={`${id}-name`}>
        <span className="sk-field__label">Nome completo</span>
        <input
          id={`${id}-name`}
          className={`sk-input${showNameError ? " is-invalid" : ""}`}
          value={name}
          onChange={(e) => setName(e.target.value)}
          onBlur={() => setTouched((t) => ({ ...t, name: true }))}
          placeholder="Ex.: Maria Eduarda Oliveira"
          autoComplete="name"
          autoCapitalize="words"
          maxLength={80}
          aria-invalid={showNameError}
          aria-describedby={showNameError ? `${id}-name-error` : undefined}
          autoFocus={mode === "edit"}
        />
        {showNameError && (
          <span id={`${id}-name-error`} className="sk-field__error">
            Digite seu nome e sobrenome.
          </span>
        )}
      </label>

      <label className="sk-field" htmlFor={`${id}-phone`}>
        <span className="sk-field__label">Telefone (WhatsApp)</span>
        <input
          id={`${id}-phone`}
          className={`sk-input${showPhoneError ? " is-invalid" : ""}`}
          value={phone}
          onChange={(e) => setPhone(formatPhone(e.target.value))}
          onBlur={() => setTouched((t) => ({ ...t, phone: true }))}
          placeholder="(61) 99999-9999"
          type="tel"
          inputMode="numeric"
          autoComplete="tel-national"
          aria-invalid={showPhoneError}
          aria-describedby={showPhoneError ? `${id}-phone-error` : undefined}
        />
        {showPhoneError && (
          <span id={`${id}-phone-error`} className="sk-field__error">
            Digite um telefone válido com DDD.
          </span>
        )}
      </label>

      <p className="sk-form__note">{copy.privacyNote}</p>

      <div className="flex flex-col sm:flex-row gap-2">
        <button type="submit" className="sk-btn sk-btn--primary sk-btn--block">
          {mode === "register" ? copy.registerCta : "Salvar"}
        </button>
        {onCancel && (
          <button type="button" className="sk-btn sk-btn--ghost sk-btn--block" onClick={onCancel}>
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
}
