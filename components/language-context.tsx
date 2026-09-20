"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export type SupportedLang = "en" | "fr" | "es" | "pt" | "de";

export const SUPPORTED_LANGS: SupportedLang[] = [
  "en",
  "fr",
  "es",
  "pt",
  "de",
];

export const COUNTRY_TO_LANGUAGE: Record<string, SupportedLang> = {
  US: "en",
  GB: "en",
  AU: "en",
  CA: "en",
  NZ: "en",
  IE: "en",
  ZA: "en",
  SG: "en",
  PH: "en",
  IN: "en",
  NG: "en",
  KE: "en",
  GH: "en",
  FR: "fr",
  BE: "fr",
  CH: "fr",
  CA_FR: "fr",
  LU: "fr",
  MC: "fr",
  ES: "es",
  MX: "es",
  AR: "es",
  CO: "es",
  CL: "es",
  PE: "es",
  VE: "es",
  CL_: "es",
  EC: "es",
  GT: "es",
  CU: "es",
  BO: "es",
  HN: "es",
  PY: "es",
  SV: "es",
  NI: "es",
  CR: "es",
  PA: "es",
  UY: "es",
  GQ: "es",
  BR: "pt",
  PT: "pt",
  AO: "pt",
  MZ: "pt",
  DE: "de",
  AT: "de",
  CH_DE: "de",
  LI: "de",
  LU_DE: "de",
  PL: "en",
  RU: "en",
  CN: "en",
  TW: "en",
  JP: "en",
  KR: "en",
  SA: "en",
  AE: "en",
  EG: "en",
  JO: "en",
  MA: "en",
  TN: "en",
  ID: "en",
  MY: "en",
  TH: "en",
  VN: "en",
  TR: "en",
  NL: "en",
  SE: "en",
  NO: "en",
  DK: "en",
  FI: "en",
  IT: "en",
  CZ: "en",
  HU: "en",
  RO: "en",
  UA: "en",
  BG: "en",
  HR: "en",
  GR: "en",
  IL: "en",
  IR: "en",
  PK: "en",
  BD: "en",
  LK: "en",
  NP: "en",
  ET: "en",
};

type TranslationTable = Record<string, string>;

type TranslationDict = Record<SupportedLang, TranslationTable>;

export const translations: TranslationDict = {
  en: {
    "nav.home": "Home",
    "nav.about": "About Us",
    "nav.plans": "Plans",
    "nav.whatWeDo": "What We Do",
    "nav.faqs": "FAQs",
    "nav.contact": "Contact",
    "nav.login": "Login",
    "nav.register": "Get Started",
    "nav.selectLanguage": "Select Language",
    "nav.switchLight": "Switch to light mode",
    "nav.switchDark": "Switch to dark mode",
    "nav.openMenu": "Open menu",
    "nav.closeMenu": "Close menu",

    "hero.tag": "Intelligent Digital Asset Investing",
    "hero.title": "Build lasting wealth with institutional-grade",
    "hero.titleAccent": "AI-driven trading",
    "hero.subtitle":
      "TeveXtra partners with licensed liquidity providers to deliver transparent, sustainable returns across crypto, forex and commodities — from a single dashboard.",
    "hero.ctaInvest": "Start Investing",
    "hero.ctaPlans": "View Investment Plans",
    "hero.statsReturns": "Avg. Monthly Returns",
    "hero.statsReturnsValue": "~18.4%",
    "hero.statsMembers": "Active Members",
    "hero.statsMembersValue": "42,800+",
    "hero.statsAum": "Assets Under Management",
    "hero.statsAumValue": "$142M",
    "hero.statsCountries": "Countries Served",
    "hero.statsCountriesValue": "90+",

    "plans.heading": "Investment Plans",
    "plans.subheading":
      "Choose a plan that matches your capital and goals. All plans include 24/7 dashboard access, instant deposit notifications, and audited trade reports.",
    "plans.minDeposit": "Minimum deposit",
    "plans.dailyRoi": "Daily ROI",
    "plans.term": "Term",
    "plans.referralBonus": "Referral bonus",
    "plans.totalReturn": "Total return",
    "plans.investNow": "Invest Now",
    "plans.recommended": "Most Popular",
    "plans.planStarterName": "Starter Plan",
    "plans.planSilverName": "Silver Plan",
    "plans.planGoldName": "Gold Plan",
    "plans.planDiamondName": "Diamond Plan",
    "plans.planVipName": "VIP Plan",

    "howItWorks.heading": "How it works",
    "howItWorks.step1Title": "Create your free account",
    "howItWorks.step1Desc":
      "Sign up in under 60 seconds, verify your email and access your investor dashboard.",
    "howItWorks.step2Title": "Fund your wallet",
    "howItWorks.step2Desc":
      "Deposit BTC, ETH, USDT or fiat via our secured payment partners. Funds reflect instantly.",
    "howItWorks.step3Title": "Choose an investment plan",
    "howItWorks.step3Desc":
      "Select a plan aligned with your risk profile. Our AI engine begins trading within one block confirmation.",
    "howItWorks.step4Title": "Withdraw profits anytime",
    "howItWorks.step4Desc":
      "Monitor earnings live. Submit a withdrawal request and receive funds within 24 hours.",

    "features.heading": "Why professional investors choose TeveXtra",
    "features.securityTitle": "Bank-grade custody",
    "features.securityDesc":
      "98% of client assets held in multi-sig cold wallets with Fireblocks + Ledger Vault insurance up to $375M.",
    "features.aiTitle": "AI execution engine",
    "features.aiDesc":
      "Reinforcement-learning models scan 280+ pairs across 14 exchanges with 0.6ms average execution.",
    "features.transparencyTitle": "Audited transparency",
    "features.transparencyDesc":
      "Monthly Proof-of-Reserves + trade-level P&L reports available inside every client dashboard.",
    "features.supportTitle": "24/7 VIP concierge",
    "features.supportDesc":
      "Dedicated relationship manager, WhatsApp priority line and live-chat in 30+ languages.",

    "cta.heading": "Ready to put your capital to work?",
    "cta.subheading":
      "Join 42,800+ members earning predictable returns from regulated digital-asset strategies.",
    "cta.primary": "Open an account in 60 seconds",
    "cta.secondary": "Talk to an advisor",

    "footer.tagline":
      "Institutional-grade digital asset management for every investor.",
    "footer.products": "Products",
    "footer.productsSpot": "Spot trading",
    "footer.productsPlans": "Investment plans",
    "footer.productsMatrix": "Matrix plan",
    "footer.productsCopy": "Copy trading",
    "footer.company": "Company",
    "footer.companyAbout": "About us",
    "footer.companyWhat": "What we do",
    "footer.companyCareers": "Careers",
    "footer.companyPress": "Press kit",
    "footer.resources": "Resources",
    "footer.resourcesFaq": "FAQs",
    "footer.resourcesContact": "Contact",
    "footer.resourcesTerms": "Terms",
    "footer.resourcesPrivacy": "Privacy",
    "footer.legal": "Legal",
    "footer.legalTerms": "Terms of Service",
    "footer.legalPrivacy": "Privacy Policy",
    "footer.legalRisk": "Risk Disclosure",
    "footer.legalAmld": "AML Policy",
    "footer.newsletter": "Get market insights in your inbox",
    "footer.newsletterPlaceholder": "you@domain.com",
    "footer.newsletterCta": "Subscribe",
    "footer.rights": "All rights reserved.",
  },
  fr: {
    "nav.home": "Accueil",
    "nav.about": "À propos",
    "nav.plans": "Plans",
    "nav.whatWeDo": "Notre activité",
    "nav.faqs": "FAQ",
    "nav.contact": "Contact",
    "nav.login": "Connexion",
    "nav.register": "Commencer",
    "nav.selectLanguage": "Choisir la langue",
    "nav.switchLight": "Passer en mode clair",
    "nav.switchDark": "Passer en mode sombre",
    "nav.openMenu": "Ouvrir le menu",
    "nav.closeMenu": "Fermer le menu",

    "hero.tag": "Investissement intelligent en actifs numériques",
    "hero.title": "Construisez une richesse durable avec du trading",
    "hero.titleAccent": "algorithme de niveau institutionnel",
    "hero.subtitle":
      "TeveXtra s'associe à des fournisseurs de liquidité agréés pour offrir des rendements transparents et durables sur le crypto, le forex et les matières premières — depuis un seul tableau de bord.",
    "hero.ctaInvest": "Commencer à investir",
    "hero.ctaPlans": "Voir les plans d'investissement",
    "hero.statsReturns": "Rendements mensuels moyens",
    "hero.statsReturnsValue": "~18,4 %",
    "hero.statsMembers": "Membres actifs",
    "hero.statsMembersValue": "42 800+",
    "hero.statsAum": "Actifs sous gestion",
    "hero.statsAumValue": "142 M$",
    "hero.statsCountries": "Pays desservis",
    "hero.statsCountriesValue": "90+",

    "plans.heading": "Plans d'investissement",
    "plans.subheading":
      "Choisissez un plan adapté à votre capital et à vos objectifs. Tous les plans incluent un accès tableau de bord 24h/24, des notifications de dépôt instantanées et des rapports de transactions audités.",
    "plans.minDeposit": "Dépôt minimum",
    "plans.dailyRoi": "Rendement quotidien",
    "plans.term": "Durée",
    "plans.referralBonus": "Prime de parrainage",
    "plans.totalReturn": "Rendement total",
    "plans.investNow": "Investir maintenant",
    "plans.recommended": "Le plus populaire",
    "plans.planStarterName": "Plan Débutant",
    "plans.planSilverName": "Plan Argent",
    "plans.planGoldName": "Plan Or",
    "plans.planDiamondName": "Plan Diamant",
    "plans.planVipName": "Plan VIP",

    "howItWorks.heading": "Comment ça marche",
    "howItWorks.step1Title": "Créez votre compte gratuit",
    "howItWorks.step1Desc":
      "Inscrivez-vous en moins de 60 secondes, vérifiez votre e-mail et accédez à votre tableau de bord investisseur.",
    "howItWorks.step2Title": "Approvisionnez votre portefeuille",
    "howItWorks.step2Desc":
      "Déposez du BTC, ETH, USDT ou en devise fiduciaire via nos partenaires de paiement sécurisés. Les fonds apparaissent instantanément.",
    "howItWorks.step3Title": "Choisissez un plan d'investissement",
    "howItWorks.step3Desc":
      "Sélectionnez un plan aligné sur votre profil de risque. Notre moteur IA commence à trader dès une confirmation de bloc.",
    "howItWorks.step4Title": "Retirez vos gains à tout moment",
    "howItWorks.step4Desc":
      "Suivez vos revenus en direct. Soumettez une demande de retrait et recevez les fonds sous 24 heures.",

    "features.heading":
      "Pourquoi les investisseurs professionnels choisissent TeveXtra",
    "features.securityTitle": "Custodie de niveau bancaire",
    "features.securityDesc":
      "98 % des actifs clients conservés dans des portefeuilles froids multi-signatures avec assurance Fireblocks + Ledger Vault jusqu'à 375 M$.",
    "features.aiTitle": "Moteur d'exécution IA",
    "features.aiDesc":
      "Des modèles d'apprentissage par renforcement analysent 280+ paires sur 14 plateformes avec une exécution moyenne de 0,6 ms.",
    "features.transparencyTitle": "Transparence auditée",
    "features.transparencyDesc":
      "Preuves de réserves mensuelles + rapports P&L détaillés disponibles dans chaque tableau de bord client.",
    "features.supportTitle": "Conciergerie VIP 24h/24",
    "features.supportDesc":
      "Responsable relationnel dédié, ligne prioritaire WhatsApp et chat en direct en 30+ langues.",

    "cta.heading": "Prêt à faire travailler votre capital ?",
    "cta.subheading":
      "Rejoignez 42 800+ membres obtenant des rendements prévisibles grâce à des stratégies d'actifs numériques régulées.",
    "cta.primary": "Ouvrir un compte en 60 secondes",
    "cta.secondary": "Parler à un conseiller",

    "footer.tagline":
      "Gestion d'actifs numériques de niveau institutionnel pour chaque investisseur.",
    "footer.products": "Produits",
    "footer.productsSpot": "Trading spot",
    "footer.productsPlans": "Plans d'investissement",
    "footer.productsMatrix": "Plan matriciel",
    "footer.productsCopy": "Copy trading",
    "footer.company": "Entreprise",
    "footer.companyAbout": "À propos",
    "footer.companyWhat": "Notre activité",
    "footer.companyCareers": "Carrières",
    "footer.companyPress": "Presse",
    "footer.resources": "Ressources",
    "footer.resourcesFaq": "FAQ",
    "footer.resourcesContact": "Contact",
    "footer.resourcesTerms": "CGV",
    "footer.resourcesPrivacy": "Confidentialité",
    "footer.legal": "Mentions légales",
    "footer.legalTerms": "Conditions d'utilisation",
    "footer.legalPrivacy": "Politique de confidentialité",
    "footer.legalRisk": "Déclaration de risque",
    "footer.legalAmld": "Politique AML",
    "footer.newsletter": "Recevez les analyses du marché",
    "footer.newsletterPlaceholder": "vous@domaine.com",
    "footer.newsletterCta": "S'inscrire",
    "footer.rights": "Tous droits réservés.",
  },
  es: {
    "nav.home": "Inicio",
    "nav.about": "Nosotros",
    "nav.plans": "Planes",
    "nav.whatWeDo": "Qué hacemos",
    "nav.faqs": "Preguntas",
    "nav.contact": "Contacto",
    "nav.login": "Iniciar sesión",
    "nav.register": "Comenzar",
    "nav.selectLanguage": "Seleccionar idioma",
    "nav.switchLight": "Cambiar al modo claro",
    "nav.switchDark": "Cambiar al modo oscuro",
    "nav.openMenu": "Abrir menú",
    "nav.closeMenu": "Cerrar menú",

    "hero.tag": "Inversión inteligente en activos digitales",
    "hero.title": "Construye riqueza duradera con trading",
    "hero.titleAccent": "institucional impulsado por IA",
    "hero.subtitle":
      "TeveXtra se asocia con proveedores de liquidez licenciados para ofrecer retornos transparentes y sostenibles en cripto, forex y materias primas desde un único panel.",
    "hero.ctaInvest": "Empezar a invertir",
    "hero.ctaPlans": "Ver planes de inversión",
    "hero.statsReturns": "Rentabilidad mensual media",
    "hero.statsReturnsValue": "~18,4 %",
    "hero.statsMembers": "Miembros activos",
    "hero.statsMembersValue": "42.800+",
    "hero.statsAum": "Activos bajo gestión",
    "hero.statsAumValue": "142 M$",
    "hero.statsCountries": "Países atendidos",
    "hero.statsCountriesValue": "90+",

    "plans.heading": "Planes de inversión",
    "plans.subheading":
      "Elige un plan acorde a tu capital y objetivos. Todos incluyen acceso al panel 24/7, notificaciones instantáneas de depósito e informes auditados.",
    "plans.minDeposit": "Depósito mínimo",
    "plans.dailyRoi": "ROI diario",
    "plans.term": "Plazo",
    "plans.referralBonus": "Bono por referencia",
    "plans.totalReturn": "Rentabilidad total",
    "plans.investNow": "Invertir ahora",
    "plans.recommended": "Más popular",
    "plans.planStarterName": "Plan Inicial",
    "plans.planSilverName": "Plan Plata",
    "plans.planGoldName": "Plan Oro",
    "plans.planDiamondName": "Plan Diamante",
    "plans.planVipName": "Plan VIP",

    "howItWorks.heading": "Cómo funciona",
    "howItWorks.step1Title": "Crea tu cuenta gratuita",
    "howItWorks.step1Desc":
      "Regístrate en menos de 60 segundos, verifica tu correo y accede a tu panel de inversor.",
    "howItWorks.step2Title": "Fondea tu monedero",
    "howItWorks.step2Desc":
      "Deposita BTC, ETH, USDT o moneda fiduciaria a través de nuestros partners de pago seguros. Los fondos se reflejan al instante.",
    "howItWorks.step3Title": "Elige un plan de inversión",
    "howItWorks.step3Desc":
      "Selecciona un plan acorde a tu perfil de riesgo. Nuestro motor de IA empieza a operar tras una confirmación de bloque.",
    "howItWorks.step4Title": "Retira beneficios cuando quieras",
    "howItWorks.step4Desc":
      "Monitoriza ganancias en vivo. Solicita un retiro y recibe fondos en menos de 24 horas.",

    "features.heading":
      "Por qué los inversores profesionales eligen TeveXtra",
    "features.securityTitle": "Custodia de nivel bancario",
    "features.securityDesc":
      "98 % de los activos de clientes en carteras frías multi-firma con seguro Fireblocks + Ledger Vault hasta 375 M$.",
    "features.aiTitle": "Motor de ejecución con IA",
    "features.aiDesc":
      "Modelos de aprendizaje por refuerzo analizan 280+ pares en 14 exchanges con ejecución media de 0,6 ms.",
    "features.transparencyTitle": "Transparencia auditada",
    "features.transparencyDesc":
      "Prueba de reservas mensual + informes P&L detallados en cada panel de cliente.",
    "features.supportTitle": "Concierge VIP 24/7",
    "features.supportDesc":
      "Gestor dedicado, línea prioritaria WhatsApp y chat en vivo en 30+ idiomas.",

    "cta.heading": "¿Listo para poner tu capital a trabajar?",
    "cta.subheading":
      "Únete a 42.800+ miembros obteniendo retornos predecibles con estrategias reguladas de activos digitales.",
    "cta.primary": "Abrir cuenta en 60 segundos",
    "cta.secondary": "Hablar con un asesor",

    "footer.tagline":
      "Gestión de activos digitales de nivel institucional para cada inversor.",
    "footer.products": "Productos",
    "footer.productsSpot": "Mercado spot",
    "footer.productsPlans": "Planes de inversión",
    "footer.productsMatrix": "Plan matricial",
    "footer.productsCopy": "Copy trading",
    "footer.company": "Empresa",
    "footer.companyAbout": "Sobre nosotros",
    "footer.companyWhat": "Qué hacemos",
    "footer.companyCareers": "Carreras",
    "footer.companyPress": "Prensa",
    "footer.resources": "Recursos",
    "footer.resourcesFaq": "FAQ",
    "footer.resourcesContact": "Contacto",
    "footer.resourcesTerms": "Términos",
    "footer.resourcesPrivacy": "Privacidad",
    "footer.legal": "Legal",
    "footer.legalTerms": "Términos de servicio",
    "footer.legalPrivacy": "Política de privacidad",
    "footer.legalRisk": "Declaración de riesgos",
    "footer.legalAmld": "Política AML",
    "footer.newsletter": "Recibe análisis de mercado",
    "footer.newsletterPlaceholder": "tucorreo@dominio.com",
    "footer.newsletterCta": "Suscribirme",
    "footer.rights": "Todos los derechos reservados.",
  },
  pt: {
    "nav.home": "Início",
    "nav.about": "Sobre nós",
    "nav.plans": "Planos",
    "nav.whatWeDo": "O que fazemos",
    "nav.faqs": "Perguntas",
    "nav.contact": "Contato",
    "nav.login": "Entrar",
    "nav.register": "Começar",
    "nav.selectLanguage": "Selecionar idioma",
    "nav.switchLight": "Mudar para modo claro",
    "nav.switchDark": "Mudar para modo escuro",
    "nav.openMenu": "Abrir menu",
    "nav.closeMenu": "Fechar menu",

    "hero.tag": "Investimento inteligente em ativos digitais",
    "hero.title": "Construa riqueza duradoura com trading",
    "hero.titleAccent": "institucional movido a IA",
    "hero.subtitle":
      "A TeveXtra faz parceria com provedores de liquidez licenciados para entregar retornos transparentes e sustentáveis em cripto, forex e commodities — em um único painel.",
    "hero.ctaInvest": "Começar a investir",
    "hero.ctaPlans": "Ver planos de investimento",
    "hero.statsReturns": "Retornos mensais médios",
    "hero.statsReturnsValue": "~18,4%",
    "hero.statsMembers": "Membros ativos",
    "hero.statsMembersValue": "42.800+",
    "hero.statsAum": "Ativos sob gestão",
    "hero.statsAumValue": "US$ 142M",
    "hero.statsCountries": "Países atendidos",
    "hero.statsCountriesValue": "90+",

    "plans.heading": "Planos de investimento",
    "plans.subheading":
      "Escolha um plano alinhado com seu capital e metas. Todos incluem acesso ao painel 24h/7, notificações de depósito instantâneas e relatórios auditados.",
    "plans.minDeposit": "Depósito mínimo",
    "plans.dailyRoi": "ROI diário",
    "plans.term": "Prazo",
    "plans.referralBonus": "Bônus de indicação",
    "plans.totalReturn": "Retorno total",
    "plans.investNow": "Investir agora",
    "plans.recommended": "Mais popular",
    "plans.planStarterName": "Plano Iniciante",
    "plans.planSilverName": "Plano Prata",
    "plans.planGoldName": "Plano Ouro",
    "plans.planDiamondName": "Plano Diamante",
    "plans.planVipName": "Plano VIP",

    "howItWorks.heading": "Como funciona",
    "howItWorks.step1Title": "Crie sua conta gratuita",
    "howItWorks.step1Desc":
      "Cadastre-se em menos de 60 segundos, confirme seu e-mail e acesse seu painel de investidor.",
    "howItWorks.step2Title": "Financie sua carteira",
    "howItWorks.step2Desc":
      "Deposite BTC, ETH, USDT ou moeda fiduciária via nossos parceiros de pagamento. O saldo aparece na hora.",
    "howItWorks.step3Title": "Escolha um plano de investimento",
    "howItWorks.step3Desc":
      "Selecione um plano alinhado ao seu perfil de risco. Nosso motor de IA começa a operar após 1 confirmação de bloco.",
    "howItWorks.step4Title": "Saque lucros quando quiser",
    "howItWorks.step4Desc":
      "Acompanhe os ganhos ao vivo. Solicite um saque e receba em até 24 horas.",

    "features.heading": "Por que investidores profissionais escolhem TeveXtra",
    "features.securityTitle": "Custódia de nível bancário",
    "features.securityDesc":
      "98% dos ativos dos clientes em carteiras frias multi-sig com seguro Fireblocks + Ledger Vault de até US$ 375M.",
    "features.aiTitle": "Motor de execução com IA",
    "features.aiDesc":
      "Modelos de aprendizado por reforço escaneiam 280+ pares em 14 exchanges com execução média de 0,6 ms.",
    "features.transparencyTitle": "Transparência auditada",
    "features.transparencyDesc":
      "Prova de reservas mensal + relatórios P&L detalhados dentro de cada painel.",
    "features.supportTitle": "Concierge VIP 24/7",
    "features.supportDesc":
      "Gerente de relacionamento dedicado, linha prioritária WhatsApp e atendimento em 30+ idiomas.",

    "cta.heading": "Pronto para fazer seu capital trabalhar?",
    "cta.subheading":
      "Junte-se a 42.800+ membros obtendo retornos previsíveis via estratégias reguladas.",
    "cta.primary": "Abrir conta em 60 segundos",
    "cta.secondary": "Falar com um consultor",

    "footer.tagline":
      "Gestão de ativos digitais de nível institucional para qualquer investidor.",
    "footer.products": "Produtos",
    "footer.productsSpot": "Mercado à vista",
    "footer.productsPlans": "Planos de investimento",
    "footer.productsMatrix": "Plano matricial",
    "footer.productsCopy": "Copy trading",
    "footer.company": "Empresa",
    "footer.companyAbout": "Sobre nós",
    "footer.companyWhat": "O que fazemos",
    "footer.companyCareers": "Carreiras",
    "footer.companyPress": "Imprensa",
    "footer.resources": "Recursos",
    "footer.resourcesFaq": "FAQ",
    "footer.resourcesContact": "Contato",
    "footer.resourcesTerms": "Termos",
    "footer.resourcesPrivacy": "Privacidade",
    "footer.legal": "Legal",
    "footer.legalTerms": "Termos de serviço",
    "footer.legalPrivacy": "Política de privacidade",
    "footer.legalRisk": "Aviso de risco",
    "footer.legalAmld": "Política AML",
    "footer.newsletter": "Receba análises de mercado",
    "footer.newsletterPlaceholder": "voce@dominio.com",
    "footer.newsletterCta": "Inscrever-se",
    "footer.rights": "Todos os direitos reservados.",
  },
  de: {
    "nav.home": "Startseite",
    "nav.about": "Über uns",
    "nav.plans": "Pläne",
    "nav.whatWeDo": "Was wir tun",
    "nav.faqs": "FAQ",
    "nav.contact": "Kontakt",
    "nav.login": "Anmelden",
    "nav.register": "Jetzt starten",
    "nav.selectLanguage": "Sprache wählen",
    "nav.switchLight": "Zum hellen Modus wechseln",
    "nav.switchDark": "Zum dunklen Modus wechseln",
    "nav.openMenu": "Menü öffnen",
    "nav.closeMenu": "Menü schließen",

    "hero.tag": "Intelligentes Investieren in digitale Vermögenswerte",
    "hero.title": "Bauen Sie nachhaltigen Wohlstand mit",
    "hero.titleAccent": "institutionellem KI-Trading auf",
    "hero.subtitle":
      "TeveXtra arbeitet mit lizenzierten Liquiditätsanbietern zusammen, um transparente, nachhaltige Renditen in Krypto, Forex und Rohstoffen zu liefern — aus einem einzigen Dashboard.",
    "hero.ctaInvest": "Investition beginnen",
    "hero.ctaPlans": "Investitionspläne ansehen",
    "hero.statsReturns": "Ø monatliche Rendite",
    "hero.statsReturnsValue": "~18,4 %",
    "hero.statsMembers": "Aktive Mitglieder",
    "hero.statsMembersValue": "42.800+",
    "hero.statsAum": "Verwaltetes Vermögen",
    "hero.statsAumValue": "142 M$",
    "hero.statsCountries": "Betreute Länder",
    "hero.statsCountriesValue": "90+",

    "plans.heading": "Investitionspläne",
    "plans.subheading":
      "Wählen Sie einen Plan, der zu Kapital und Zielen passt. Alle Pläne enthalten 24/7-Dashboard-Zugriff, sofortige Einzahlungsbenachrichtigungen und auditierte Handelsberichte.",
    "plans.minDeposit": "Mindestanlage",
    "plans.dailyRoi": "Täglicher ROI",
    "plans.term": "Laufzeit",
    "plans.referralBonus": "Empfehlungsbonus",
    "plans.totalReturn": "Gesamtrendite",
    "plans.investNow": "Jetzt investieren",
    "plans.recommended": "Am beliebtesten",
    "plans.planStarterName": "Starter-Plan",
    "plans.planSilverName": "Silber-Plan",
    "plans.planGoldName": "Gold-Plan",
    "plans.planDiamondName": "Diamant-Plan",
    "plans.planVipName": "VIP-Plan",

    "howItWorks.heading": "So funktioniert es",
    "howItWorks.step1Title": "Kostenloses Konto erstellen",
    "howItWorks.step1Desc":
      "In unter 60 Sekunden registrieren, E-Mail verifizieren und Investoren-Dashboard öffnen.",
    "howItWorks.step2Title": "Wallet aufladen",
    "howItWorks.step2Desc":
      "BTC, ETH, USDT oder Fiat über sichere Zahlungspartner einzahlen. Guthaben sofort verfügbar.",
    "howItWorks.step3Title": "Investitionsplan wählen",
    "howItWorks.step3Desc":
      "Risikogerechten Plan auswählen. Unsere KI beginnt nach einer Blockbestätigung mit dem Trading.",
    "howItWorks.step4Title": "Gewinne jederzeit auszahlen",
    "howItWorks.step4Desc":
      "Einnahmen live verfolgen. Auszahlung beantragen und innerhalb von 24 Stunden erhalten.",

    "features.heading":
      "Warum professionelle Investoren TeveXtra wählen",
    "features.securityTitle": "Bankenstabile Verwahrung",
    "features.securityDesc":
      "98 % der Kundenvermögen in Multi-Sig-Cold-Wallets mit Fireblocks + Ledger Vault Versicherung bis 375 M$.",
    "features.aiTitle": "KI-Ausführungsengine",
    "features.aiDesc":
      "Reinforcement-Learning analysiert 280+ Paare auf 14 Börsen in durchschnittlich 0,6 ms.",
    "features.transparencyTitle": "Auditierte Transparenz",
    "features.transparencyDesc":
      "Monatliche Nachweise der Rücklagen + detaillierte P&L-Berichte in jedem Kunden-Dashboard.",
    "features.supportTitle": "VIP-Concierge 24/7",
    "features.supportDesc":
      "Dedizierter Kundenbetreuer, WhatsApp-Prioritätsleitung und Live-Chat in 30+ Sprachen.",

    "cta.heading": "Bereit, Ihr Kapital arbeiten zu lassen?",
    "cta.subheading":
      "Schließen Sie sich 42.800+ Mitgliedern mit vorhersehbaren Renditen regulierter Digital-Asset-Strategien an.",
    "cta.primary": "Konto in 60 Sekunden eröffnen",
    "cta.secondary": "Mit einem Berater sprechen",

    "footer.tagline":
      "Digital-Asset-Management auf Institutionsebene für jeden Investor.",
    "footer.products": "Produkte",
    "footer.productsSpot": "Spot-Handel",
    "footer.productsPlans": "Investitionspläne",
    "footer.productsMatrix": "Matrix-Plan",
    "footer.productsCopy": "Copy Trading",
    "footer.company": "Unternehmen",
    "footer.companyAbout": "Über uns",
    "footer.companyWhat": "Was wir tun",
    "footer.companyCareers": "Karriere",
    "footer.companyPress": "Presse",
    "footer.resources": "Ressourcen",
    "footer.resourcesFaq": "FAQ",
    "footer.resourcesContact": "Kontakt",
    "footer.resourcesTerms": "AGB",
    "footer.resourcesPrivacy": "Datenschutz",
    "footer.legal": "Rechtliches",
    "footer.legalTerms": "Nutzungsbedingungen",
    "footer.legalPrivacy": "Datenschutzrichtlinie",
    "footer.legalRisk": "Risikohinweis",
    "footer.legalAmld": "AML-Richtlinie",
    "footer.newsletter": "Marktanalysen in Ihrem Postfach",
    "footer.newsletterPlaceholder": "sie@domain.de",
    "footer.newsletterCta": "Abonnieren",
    "footer.rights": "Alle Rechte vorbehalten.",
  },
};

const COUNTRY_STORAGE_KEY = "tevextra -country";

function readSavedCountry(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(COUNTRY_STORAGE_KEY);
    if (!raw) return null;
    return raw.trim();
  } catch {
    return null;
  }
}

function countryToLang(code: string | null): SupportedLang {
  if (!code) return "en";
  const direct = COUNTRY_TO_LANGUAGE[code.toUpperCase()];
  if (direct) return direct;
  const prefix = code.split(/[-_]/)[0].toUpperCase();
  const fallbackPrefix = COUNTRY_TO_LANGUAGE[prefix];
  if (fallbackPrefix) return fallbackPrefix;
  const compound = Object.keys(COUNTRY_TO_LANGUAGE).find((k) =>
    k.toUpperCase().startsWith(prefix),
  );
  if (compound) return COUNTRY_TO_LANGUAGE[compound];
  return "en";
}

type LanguageContextValue = {
  country: string | null;
  language: SupportedLang;
  setCountry: (countryCode: string | null) => void;
  t: (key: string) => string;
};

const LanguageContext = createContext<LanguageContextValue | undefined>(
  undefined,
);

export function LanguageProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [country, setCountryState] = useState<string | null>(null);
  const [language, setLanguage] = useState<SupportedLang>("en");

  useEffect(() => {
    const stored = readSavedCountry();
    setCountryState(stored);
    setLanguage(countryToLang(stored));
  }, []);

  const setCountry = (countryCode: string | null) => {
    setCountryState(countryCode);
    setLanguage(countryToLang(countryCode));
    try {
      if (countryCode == null) {
        localStorage.removeItem(COUNTRY_STORAGE_KEY);
      } else {
        localStorage.setItem(COUNTRY_STORAGE_KEY, countryCode);
      }
    } catch {
    }
    try {
      window.dispatchEvent(
        new CustomEvent("tevextra:country-changed", {
          detail: { country: countryCode, language: countryToLang(countryCode) },
        }),
      );
    } catch {
    }
  };

  const value = useMemo<LanguageContextValue>(() => {
    const t = (key: string): string => {
      const currentTable = translations[language];
      const englishTable = translations.en;
      const hit = currentTable?.[key];
      if (typeof hit === "string" && hit.length > 0) return hit;
      const fallback = englishTable[key];
      if (typeof fallback === "string" && fallback.length > 0) return fallback;
      return key;
    };
    return { country, language, setCountry, t };
  }, [country, language]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return ctx;
}
