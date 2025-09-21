import rcpImg from "../assets/figma/rcp.png";
import rbabImg from "../assets/figma/rbab.png";
import maniobraImg from "../assets/figma/maniobra.png";
import rbanImg from "../assets/figma/rban.png";
import hemoImg from "../assets/figma/hemo.png";
import quemaImg from "../assets/figma/quema.png";

const techniques: Record<string, any> = {
  rcp: {
    slug: "rcp",
    title: "Reanimación Cardiopulmonar para Adultos (RCP)",
    hero: rcpImg,
    intro:
      "Sigue estos pasos para realizar RCP básico hasta que llegue ayuda profesional.",
    videoUrl: "https://www.youtube.com/watch?v=8VH2Y6bGkz0",
    action: {
      label: "Iniciar práctica",
      href: "#start-practice",
    },
    howToApply: {
      title: "¿Cómo aplicarlo?",
      reasons: ["Un ataque al corazón", "Paro cardiaco"],
      symptomsTitle: "Los síntomas pueden ser:",
      symptoms: [
        {
          id: "s1",
          img: rcpImg,
          label: "Dolor en el pecho",
          details:
            "Dolor intenso o presión en el pecho, que se puede irradiar a hombros, brazos o mandíbula.",
        },
        {
          id: "s2",
          img: rbabImg,
          label: "Dificultad para respirar",
          details:
            "Respiración rápida, corta o sensación de ahogo que acompaña al evento cardíaco.",
        },
        {
          id: "s3",
          img: hemoImg,
          label: "Pérdida de conciencia",
          details:
            "Desmayo o pérdida de respuesta; la persona no responde ni respira normalmente.",
        },
      ],
    },
    steps: [
      {
        title: "Verificar seguridad",
        body: "Asegúrate de que el sitio es seguro para aproximarte a la víctima.",
      },
      {
        title: "Comprobar respuesta",
        body: "Habla y sacude suavemente los hombros para comprobar si responde.",
      },
      {
        title: "Llamar a emergencias",
        body: "Pide a alguien que llame al número local de emergencias.",
      },
      {
        title: "Compresiones torácicas",
        body: "Coloca las manos en el centro del pecho y comprime a ritmo constante.",
      },
    ],
  },
  quema: {
    slug: "quema",
    title: "Detección de quemaduras de piel",
    hero: quemaImg,
    intro:
      "Usa la cámara para evaluar visualmente si una lesión presenta signos de quemadura o piel sana.",
    action: {
      label: "Iniciar práctica",
      href: "#start-skin-practice",
    },
    howToApply: {
      title: "¿Cómo evaluarlo?",
      reasons: [
        "Quemaduras térmicas",
        "Quemaduras químicas",
        "Quemaduras por fricción",
      ],
      symptomsTitle: "Señales visuales:",
      symptoms: [
        {
          id: "q1",
          img: quemaImg,
          label: "Enrojecimiento",
          details: "Zona rojiza o ampollada que puede indicar daño en la piel.",
        },
        {
          id: "q2",
          img: quemaImg,
          label: "Ampollas",
          details: "Presencia de ampollas o piel levantada sobre la lesión.",
        },
      ],
    },
    steps: [
      {
        title: "Evaluación visual",
        body: "Sitúa la cámara sobre la lesión con buena iluminación.",
      },
      {
        title: "Iniciar detector",
        body: "Pulsa 'Iniciar práctica' y espera la clasificación.",
      },
    ],
  },
};

export default techniques;
