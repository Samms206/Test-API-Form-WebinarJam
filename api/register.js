export default async function handler(req, res) {
    // CORS
    res.setHeader("Access-Control-Allow-Origin", "*")
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS")
    res.setHeader("Access-Control-Allow-Headers", "Content-Type")

    // Preflight request (CORS wajib)
    if (req.method === "OPTIONS") {
        return res.status(200).end()
    }

    // hanya POST
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Only POST allowed" })
    }

    try {
        // parse body aman (Vercel kadang string)
        const body =
            typeof req.body === "string"
                ? JSON.parse(req.body)
                : req.body

        const { webinar_id, first_name, email } = body

        // validasi
        if (!webinar_id || !first_name || !email) {
            return res.status(400).json({
                error: "Missing required fields",
            })
        }

        // ambil API key dari ENV
        const apiKey = process.env.WEBINARJAM_API_KEY

        if (!apiKey) {
            return res.status(500).json({
                error: "Missing API key in server env",
            })
        }

        // kirim ke WebinarJam
        const response = await fetch(
            "https://api.webinarjam.com/webinarjam/register",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    api_key: apiKey,
                    webinar_id,
                    first_name,
                    email,
                }),
            }
        )

        const data = await response.json()

        return res.status(200).json(data)
    } catch (error) {
        console.error("API Error:", error)

        return res.status(500).json({
            error: "Internal server error",
        })
    }
}