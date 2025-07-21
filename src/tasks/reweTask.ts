// ============================================================================
// TASK CONFIGURATION - REWE Supermarkt with Tools System
// ============================================================================

export const REWE_TASK = {
  id: "rewe-supermarkt-v2",
  title: "REWE Supermarkt",
  description: "Lerne Deutsch beim Einkaufen von Lebensmitteln!",
  emoji: "🛒",
  language: "de",
  
  theme: {
    primaryColor: "red",
    backgroundGradient: "from-red-50 to-pink-100",
    characterBg: "bg-red-100"
  },
  
  character: {
    name: "Sandra",
    emoji: "👩‍💼",
    role: "Verkäuferin"
  },
  
  learningObjective: "Grüßen → Lebensmittel auswählen → Nach dem Preis fragen → Bezahlen → Sich bedanken",
  
  initialization: {
    selectedItem: null
  },

  workflow: [
    {
      id: "item_selection",
      advanceOn: ["item_selected"],
      tools: [
        {
          type: "item_selector",
          config: {
            title: "Wähle Lebensmittel zum Einkaufen",
            items: [
              { id: "milch", name: "die Milch", display: "🥛 Milch", price: "1,29€" },
              { id: "brot", name: "das Brot", display: "🍞 Brot", price: "1,99€" },
              { id: "äpfel", name: "die Äpfel", display: "🍎 Äpfel", price: "2,49€/kg" },
              { id: "käse", name: "der Käse", display: "🧀 Käse", price: "3,99€" },
              { id: "eier", name: "die Eier", display: "🥚 Eier", price: "2,19€" },
              { id: "bananen", name: "die Bananen", display: "🍌 Bananen", price: "1,89€/kg" }
            ]
          }
        }
      ]
    },
    {
      id: "greeting_exchange",
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
            message: "Guten Tag! Kann ich Ihnen helfen?",
            autoAdvance: false
          }
        },
        {
          type: "options_selector",
          config: {
            instruction: "Antworte höflich auf die Begrüßung:",
            options: [
              { text: "Guten Tag! Ja, bitte.", emoji: "😊" },
              { text: "Hallo! Danke, ich schaue nur.", emoji: "👋" },
              { text: "Guten Tag! Ich suche etwas Bestimmtes.", emoji: "🔍" }
            ],
            responseDelay: 1000
          }
        }
      ]
    },
    {
      id: "price_inquiry",
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
            message: "Gerne! Was suchen Sie denn?",
            autoAdvance: false
          }
        },
        {
          type: "sentence_builder",
          config: {
            instruction: "Frage nach dem Preis deines Produkts:",
            components: [
              {
                id: "question_word",
                label: "1. Fragewort wählen:",
                required: true,
                options: [
                  { 
                    text: "Was kostet", 
                    explanation: "(What does ... cost)",
                    pattern: "QUESTION ITEM?"
                  },
                  { 
                    text: "Wie viel kostet", 
                    explanation: "(How much does ... cost)",
                    pattern: "QUESTION ITEM?"
                  },
                  { 
                    text: "Können Sie mir sagen, was", 
                    explanation: "(Can you tell me what ... costs)",
                    pattern: "QUESTION ITEM kostet?"
                  }
                ]
              },
              {
                id: "item",
                label: "2. Produkt:",
                type: "auto_filled",
                source: "selectedItem.name"
              },
              {
                id: "politeness",
                label: "3. Höflichkeitswort (optional):",
                required: false,
                options: [
                  { text: "bitte", explanation: "(please)" },
                  { text: "denn", explanation: "(then - softens the question)" }
                ]
              }
            ],
            buildLogic: (components, selectedItem) => {
              const { question_word, item, politeness } = components;
              if (question_word && item) {
                if (question_word === "Können Sie mir sagen, was") {
                  return politeness ? 
                    `${question_word} ${item} kostet, ${politeness}?` : 
                    `${question_word} ${item} kostet?`;
                } else {
                  return politeness ? 
                    `${question_word} ${item} ${politeness}?` : 
                    `${question_word} ${item}?`;
                }
              }
              return '';
            },
            responseDelay: 1000
          }
        }
      ]
    },
    {
      id: "purchase_decision",
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
            message: (selectedItem) => 
              `${selectedItem?.name} kostet ${selectedItem?.price}. Möchten Sie ${selectedItem?.name} kaufen?`,
            autoAdvance: false
          }
        },
        {
          type: "options_selector",
          config: {
            instruction: "Entscheide, ob du kaufen möchtest:",
            options: [
              { text: "Ja, das nehme ich.", emoji: "✅" },
              { text: "Ja, bitte. Das ist gut.", emoji: "👍" },
              { text: "Nein, danke. Das ist zu teuer.", emoji: "❌" }
            ]
          }
        }
      ]
    },
    {
      id: "payment",
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
            message: (selectedItem) => 
              `Sehr gut! Das macht ${selectedItem?.price}. Wie möchten Sie bezahlen?`,
            autoAdvance: false
          }
        },
        {
          type: "options_selector",
          config: {
            instruction: "Wähle deine Zahlungsart:",
            options: [
              { text: "Mit Karte, bitte.", emoji: "💳" },
              { text: "Bar, bitte.", emoji: "💵" },
              { text: "Kontaktlos, bitte.", emoji: "📱" }
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
            message: "Vielen Dank! Haben Sie einen schönen Tag!",
            autoAdvance: false
          }
        },
        {
          type: "options_selector",
          config: {
            instruction: "Verabschiede dich höflich:",
            options: [
              { text: "Danke! Ihnen auch!", emoji: "😊" },
              { text: "Vielen Dank! Auf Wiedersehen!", emoji: "👋" },
              { text: "Danke schön! Bis bald!", emoji: "🙋‍♂️" }
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
              title: "Fantastisch!",
              message: `Du hast erfolgreich ${selectedItem?.display.split(' ')[1]} eingekauft!`,
              emoji: "🛍️"
            }),
            actions: [
              {
                text: "Wieder einkaufen",
                className: "bg-red-600 hover:bg-red-700 text-white",
                handler: (context) => context.resetTask()
              },
              {
                text: "Supermarkt verlassen",
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
            label: "Einkauf abgeschlossen"
          }
        }
      ]
    }
  ]
};