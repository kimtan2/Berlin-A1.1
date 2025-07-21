// ============================================================================
// TASK CONFIGURATION - Lukas Bäckerei with Tools System
// ============================================================================

export const LUKAS_BÄCKEREI_TASK = {
  id: "lukas-bäckerei-v2",
  title: "Lukas Bäckerei",
  description: "Lerne Deutsch beim Bestellen mit fortgeschrittenen Tools!",
  emoji: "🥨",
  language: "de",
  
  theme: {
    primaryColor: "amber",
    backgroundGradient: "from-amber-50 to-orange-100",
    characterBg: "bg-amber-100"
  },
  
  character: {
    name: "Lukas",
    emoji: "👨‍🍳",
    role: "Verkäufer"
  },
  
  learningObjective: "Höflich grüßen → Ein Produkt bestellen → Sich bedanken → Auf Wiedersehen sagen",
  
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
            title: "Wähle ein Produkt zum Bestellen",
            items: [
              { id: "brot", name: "ein Brot", display: "🍞 Brot", price: "2,50€" },
              { id: "brötchen", name: "ein Brötchen", display: "🥖 Brötchen", price: "0,80€" },
              { id: "croissant", name: "ein Croissant", display: "🥐 Croissant", price: "1,20€" },
              { id: "kuchen", name: "einen Kuchen", display: "🧁 Kuchen", price: "3,00€" },
              { id: "brezel", name: "eine Brezel", display: "🥨 Brezel", price: "1,00€" },
              { id: "kaffee", name: "einen Kaffee", display: "☕ Kaffee", price: "1,80€" }
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
            message: "Guten Morgen!",
            autoAdvance: false
          }
        },
        {
          type: "options_selector",
          config: {
            instruction: "Wähle eine höfliche Begrüßung:",
            options: [
              { text: "Guten Morgen!", emoji: "🌅" },
              { text: "Hallo!", emoji: "👋" },
              { text: "Guten Tag!", emoji: "☀️" }
            ],
            responseDelay: 1000
          }
        }
      ]
    },
    {
      id: "ordering",
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
            message: "Was darf es sein?",
            autoAdvance: false
          }
        },
        {
          type: "sentence_builder",
          config: {
            instruction: "Baue deinen Bestellsatz zusammen:",
            components: [
              {
                id: "politeness",
                label: "1. Höflichkeitsform wählen:",
                required: true,
                options: [
                  { 
                    text: "Ich möchte", 
                    explanation: "(I would like)",
                    pattern: "POLITENESS ITEM, PLEASE."
                  },
                  { 
                    text: "Ich hätte gern", 
                    explanation: "(I would like to have)",
                    pattern: "POLITENESS ITEM, PLEASE."
                  },
                  { 
                    text: "Können Sie mir", 
                    explanation: "(Can you give me)",
                    pattern: "POLITENESS ITEM geben, PLEASE?"
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
                id: "please",
                label: "3. Höflichkeitswort:",
                required: true,
                options: [
                  { text: "bitte", explanation: "(please)" },
                  { text: "bitte schön", explanation: "(please - more polite)" }
                ]
              }
            ],
            buildLogic: (components, selectedItem) => {
              const { politeness, item, please } = components;
              if (politeness && item && please) {
                if (politeness === "Können Sie mir") {
                  return `${politeness} ${item} geben, ${please}?`;
                } else {
                  return `${politeness} ${item}, ${please}.`;
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
      id: "payment_thanks",
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
              `Hier ist ${selectedItem?.name.replace('ein', 'Ihr').replace('eine', 'Ihre').replace('einen', 'Ihr')}. Das macht ${selectedItem?.price}.`,
            autoAdvance: false
          }
        },
        {
          type: "options_selector",
          config: {
            instruction: "Bedanke dich höflich:",
            options: [
              { text: "Danke schön!", emoji: "😊" },
              { text: "Vielen Dank!", emoji: "🙏" },
              { text: "Danke!", emoji: "👍" }
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
            message: "Bitte schön. Auf Wiedersehen!",
            autoAdvance: false
          }
        },
        {
          type: "options_selector",
          config: {
            instruction: "Verabschiede dich höflich:",
            options: [
              { text: "Auf Wiedersehen!", emoji: "👋" },
              { text: "Tschüss!", emoji: "😊" },
              { text: "Bis bald!", emoji: "🙋‍♂️" }
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
              title: "Ausgezeichnet!",
              message: `Du hast erfolgreich ${selectedItem?.display.split(' ')[1]} bestellt!`,
              emoji: "🎉"
            }),
            actions: [
              {
                text: "Nochmal bestellen",
                className: "bg-amber-600 hover:bg-amber-700 text-white",
                handler: (context) => context.resetTask()
              },
              {
                text: "Bäckerei verlassen",
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
            label: "Aufgabe abgeschlossen"
          }
        }
      ]
    }
  ]
};