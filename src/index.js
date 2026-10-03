export default {
  async fetch(request, env) {
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type"
        }
      });
    }

    if (request.method !== "POST") {
      return new Response("JARVIS Worker online 🤖", {
        headers: {
          "Access-Control-Allow-Origin": "*"
        }
      });
    }

    try {
      const body = await request.json();

      if (!body.message) {
        return new Response(
          JSON.stringify({ error: "Keine Nachricht erhalten." }),
          {
            status: 400,
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*"
            }
          }
        );
      }

      const response = await fetch(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" +
          env.GEMINI_API_KEY,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: body.message
                  }
                ]
              }
            ]
          })
        }
      );

      const data = await response.json();

      const reply =
        data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "Keine Antwort von Gemini erhalten.";

      return new Response(JSON.stringify({ reply }), {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      });
    } catch (error) {
      return new Response(
        JSON.stringify({ error: "Fehler beim Verarbeiten." }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
          }
        }
      );
    }
  }
};
