import type { ComponentType } from "react";
import type { SeasonalTheme } from "@/lib/seasonal";

/** Peças visuais de um tema. Cada tema vive no próprio chunk (carregado sob demanda). */
export interface SeasonalDecor {
  theme: SeasonalTheme;
  /** Camada fixa global: atmosfera, partículas e "voos" ocasionais. */
  Scene: ComponentType;
  /** Enfeite pendurado logo abaixo do header fixo. */
  HeaderTrim: ComponentType;
  /** Acessório sobre o logo do header. */
  LogoAccessory: ComponentType;
  /** Ornamento acima dos títulos (`variant` alterna o desenho entre seções). */
  TitleOrnament: ComponentType<{ variant: number }>;
  /** Enfeite dos cartazes: "back" fica atrás do pôster, "front" por cima. */
  CardTrim: ComponentType<{ index: number; layer: "back" | "front" }>;
  /** Faixa decorativa logo acima do rodapé. */
  Ground: ComponentType;
  /** Efeito de entrada sobre a ilustração do hero. */
  HeroBurst: ComponentType;
}
