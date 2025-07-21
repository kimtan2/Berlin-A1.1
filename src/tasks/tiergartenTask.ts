// ============================================================================
// TASK CONFIGURATION - Tiergarten Park with Tools System
// ============================================================================

export const TIERGARTEN_TASK = {
  id: "tiergarten-park-v2",
  title: "Tiergarten",
  description: "Lerne Deutsch durch Gespräche mit Einheimischen!",
  emoji: "🌳",
  language: "de",
  
  theme: {
    primaryColor: "green",
    backgroundGradient: "from-green-50 to-emerald-100",
    characterBg: "bg-green-100"
  },
  
  character: {
    name: "Thomas",
    emoji: "🚶‍♂️",
    role: "Einheimischer"
  },
  
  learningObjective: "Sich vorstellen → Smalltalk führen → Nach dem Weg fragen → Sich verabschieden",
  
  initialization: {
    selectedItem: null
  },

  workflow: [
    {
      id: "topic_selection",
      advanceOn: ["item_selected"],
      tools: [
        {
          type: "item_selector",
          config: {
            title: "Wähle ein Gesprächsthema",
            items: [
              { id: "weather", name: "das Wetter", display: "🌤️ Wetter", price: "" },
              { id: "directions", name: "der Weg", display: "🗺️ Wegbeschreibung", price: "" },
              { id: "park", name: "der Park", display: "🌳 Park", price: "" },
              { id: "time", name: "die Uhrzeit", display: "⏰ Uhrzeit", price: "" },
              { id: "tourism", name: "der Tourismus", display: "📸 Sehenswürdigkeiten", price: "" },
              { id: "language", name: "die Sprache", display: "🗣️ Sprache lernen", price: "" }
            ]
          }
        }
      ]
    },
    {
      id: "initial_greeting",
      advanceOn: ["option_selected"],
      tools: [
        {
          type: "conversation_display",
          config: {
            visible: true,
            height: "200px",
            autoScroll: true
          }
        },
        {
          type: "character_message",
          config: {
            message: "Entschuldigung, sprechen Sie Deutsch?",
            autoAdvance: false
          }
        },
        {
          type: "options_selector",
          config: {
            instruction: "Antworte auf die Frage:",
            options: [
              { text: "Ja, ein bisschen.", emoji: "😊" },
              { text: "Ja, aber ich lerne noch.", emoji: "📚" },
              { text: "Ja, sprechen Sie Englisch?", emoji: "🇬🇧" }
            ],
            responseDelay: 1000
          }
        }
      ]
    },
    {
      id: "conversation_starter",
      advanceOn: ["sentence_built"],
      tools: [
        {
          type: "conversation_display",
          config: {
            visible: true,
            height: "200px"
          }
        },
        {
          type: "character_message",
          config: {
            message: (selectedItem, context) => {
              const responses = {
                weather: "Ah, toll! Das Wetter ist heute schön, oder?",
                directions: "Prima! Können Sie mir vielleicht helfen?",
                park: "Sehr gut! Gefällt Ihnen der Tiergarten?",
                time: "Schön! Haben Sie vielleicht die Uhrzeit?",
                tourism: "Toll! Sind Sie Tourist hier in Berlin?",
                language: "Wunderbar! Wie lange lernen Sie schon Deutsch?"
              };
              return responses[selectedItem?.id] || "Das ist schön!";
            },
            autoAdvance: false
          }
        },
        {
          type: "sentence_builder",
          config: {
            instruction: "Baue deine Antwort zusammen:",
            components: [
              {
                id: "response_starter",
                label: "1. Antwort beginnen:",
                required: true,
                options: [
                  { 
                    text: "Ja, das stimmt", 
                    explanation: "(Yes, that's right)",
                    pattern: "STARTER DETAILS."
                  },
                  { 
                    text: "Ja, sehr", 
                    explanation: "(Yes, very)",
                    pattern: "STARTER DETAILS."
                  },
                  { 
                    text: "Oh ja", 
                    explanation: "(Oh yes)",
                    pattern: "STARTER DETAILS."
                  },
                  { 
                    text: "Natürlich", 
                    explanation: "(Of course)",
                    pattern: "STARTER DETAILS."
                  }
                ]
              },
              {
                id: "context_response",
                label: "2. Passende Antwort wählen:",
                required: true,
                options: [
                  { text: "schön", explanation: "(beautiful/nice)" },
                  { text: "gerne", explanation: "(gladly)" },
                  { text: "gut", explanation: "(good)" },
                  { text: "interessant", explanation: "(interesting)" }
                ]
              },
              {
                id: "follow_up",
                label: "3. Nachfrage (optional):",
                required: false,
                options: [
                  { text: "Und Sie?", explanation: "(And you?)" },
                  { text: "Kommen Sie oft hier her?", explanation: "(Do you come here often?)" },
                  { text: "Wohnen Sie in Berlin?", explanation: "(Do you live in Berlin?)" }
                ]
              }
            ],
            buildLogic: (components, selectedItem) => {
              const { response_starter, context_response, follow_up } = components;
              if (response_starter && context_response) {
                return follow_up ? 
                  `${response_starter}, ${context_response}! ${follow_up}` : 
                  `${response_starter}, ${context_response}!`;
              }
              return '';
            },
            responseDelay: 1000
          }
        }
      ]
    },
    {
      id: "deeper_conversation",
      advanceOn: ["option_selected"],
      tools: [
        {
          type: "conversation_display",
          config: {
            visible: true,
            height: "200px"
          }
        },
        {
          type: "character_message",
          config: {
            message: (selectedItem, context) => {
              const responses = {
                weather: "Ja, ich auch! Ich gehe gerne hier spazieren. Woher kommen Sie denn?",
                directions: "Ja, sehr gerne! Ich wohne schon lange hier. Was suchen Sie denn?",
                park: "Ja, ich komme jeden Tag hier her. Das ist mein Lieblings-Park! Woher kommen Sie?",
                time: "Ja, es ist jetzt 14:30 Uhr. Haben Sie einen Termin?",
                tourism: "Ja, ich wohne hier. Berlin ist sehr schön! Was möchten Sie sehen?",
                language: "Das ist toll! Deutsch ist nicht einfach. Wie lange sind Sie schon hier?"
              };
              return responses[selectedItem?.id] || "Das ist interessant!";
            },
            autoAdvance: false
          }
        },
        {
          type: "options_selector",
          config: {
            instruction: "Führe das Gespräch weiter:",
            options: [
              { text: "Ich komme aus [dein Land]. Und Sie?", emoji: "🌍" },
              { text: "Ich bin seit [Zeit] hier. Es gefällt mir sehr!", emoji: "😊" },
              { text: "Können Sie mir einen Tipp geben?", emoji: "💡" }
            ]
          }
        }
      ]
    },
    {
      id: "helpful_exchange",
      advanceOn: ["option_selected"],
      tools: [
        {
          type: "conversation_display",
          config: {
            visible: true,
            height: "200px"
          }
        },
        {
          type: "character_message",
          config: {
            message: (selectedItem, context) => {
              const responses = {
                weather: "Aus Berlin! Wenn Sie möchten, kann ich Ihnen den Park zeigen.",
                directions: "Gerne! Was suchen Sie denn? Das Brandenburger Tor ist ganz in der Nähe.",
                park: "Das ist schön! Hier gibt es viele schöne Wege. Kennen Sie schon das Schloss Bellevue?",
                time: "Ich bin nur spazieren. Aber falls Sie Hilfe brauchen, fragen Sie gerne!",
                tourism: "Natürlich! Sie müssen unbedingt das Brandenburger Tor und den Reichstag sehen!",
                language: "Das verstehe ich! Sprechen Sie ruhig mit den Leuten hier - wir helfen gerne!"
              };
              return responses[selectedItem?.id] || "Sehr gerne!";
            },
            autoAdvance: false
          }
        },
        {
          type: "options_selector",
          config: {
            instruction: "Antworte dankbar:",
            options: [
              { text: "Das ist sehr nett von Ihnen!", emoji: "🙏" },
              { text: "Vielen Dank für den Tipp!", emoji: "😊" },
              { text: "Das hilft mir sehr!", emoji: "👍" }
            ]
          }
        }
      ]
    },
    {
      id: "farewell",
      advanceOn: ["option_selected"],
      tools: [
        {
          type: "conversation_display",
          config: {
            visible: true,
            height: "200px"
          }
        },
        {
          type: "character_message",
          config: {
            message: "Gern geschehen! Viel Spaß noch in Berlin und beim Deutsch lernen!",
            autoAdvance: false
          }
        },
        {
          type: "options_selector",
          config: {
            instruction: "Verabschiede dich freundlich:",
            options: [
              { text: "Vielen Dank! Auf Wiedersehen!", emoji: "👋" },
              { text: "Das war sehr nett! Tschüss!", emoji: "😊" },
              { text: "Danke für alles! Bis bald!", emoji: "🙋‍♂️" }
            ]
          }
        }
      ]
    },
    {
      id: "completion",
      advanceOn: [],
      tools: [
        {
          type: "conversation_display",
          config: {
            visible: true,
            height: "300px"
          }
        },
        {
          type: "completion_message",
          config: {
            content: (selectedItem) => ({
              title: "Wunderbar!",
              message: `Du hast ein tolles Gespräch über ${selectedItem?.display.split(' ')[1]} geführt!`,
              emoji: "🗣️"
            }),
            actions: [
              {
                text: "Neues Gespräch beginnen",
                className: "bg-green-600 hover:bg-green-700 text-white",
                handler: (context) => context.resetTask()
              },
              {
                text: "Park verlassen",
                className: "bg-gray-600 hover:bg-gray-700 text-white",
                handler: (context) => context.resetTask()
              }
            ]
          }
        },
        {
          type: "progress_indicator",
          config: {
            visible: true,
            label: "Gespräch beendet"
          }
        }
      ]
    }
  ]
};