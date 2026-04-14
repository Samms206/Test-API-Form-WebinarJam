export default async function handler(req, res) {
    res.setHeader("Access-Control-Allow-Origin", "*")
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS")
    res.setHeader("Access-Control-Allow-Headers", "Content-Type")

    if (req.method === "OPTIONS") {
        return res.status(200).end()
    }

    if (req.method !== "POST") {
        return res.status(405).json({ error: "POST only" })
    }

    try {
        const body =
            typeof req.body === "string"
                ? JSON.parse(req.body)
                : req.body

        const { first_name, email } = body

        const response = await fetch(
            "https://api.webinarjam.com/webinarjam/register",
            {
                method: "POST",
                headers: {
                    "Content-Type":
                        "application/x-www-form-urlencoded",
                },
                body: new URLSearchParams({
                    api_key: process.env.WEBINARJAM_API_KEY,
                    webinar_id: "16",
                    schedule: "16", // 🔥 dari hasil kamu
                    first_name,
                    email,
                }),
            }
        )

        const data = await response.json()

        return res.status(200).json(data)
    } catch (err) {
        console.error(err)
        return res.status(500).json({
            error: "Server error",
        })
    }
}