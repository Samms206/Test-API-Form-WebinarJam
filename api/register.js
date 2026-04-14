export default async function handler(req, res) {
    // 1. Buka Pintu CORS (Agar Framer tidak diblokir)
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*'); // Bisa diganti URL Framer klien untuk ekstra aman
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    // 2. Handle request 'OPTIONS' (Syarat wajib CORS dari browser)
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    // 3. Blokir jika bukan request POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed. Gunakan POST.' });
    }

    // 4. Ambil data yang dikirim dari form Framer
    const { webinar_id, first_name, email } = req.body;

    // Validasi singkat jika data kosong
    if (!webinar_id || !first_name || !email) {
        return res.status(400).json({ error: 'Data tidak lengkap. Pastikan form terisi.' });
    }

    try {
        // 5. Ambil API Key dari brankas rahasia (.env)
        const apiKey = process.env.WEBINARJAM_API_KEY;

        // 6. Tembak data ke API resmi WebinarJam
        const response = await fetch('https://api.webinarjam.com/webinarjam/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                api_key: apiKey, 
                webinar_id: webinar_id, 
                first_name: first_name, 
                email: email 
            })
        });

        const data = await response.json();
        
        // 7. Kembalikan jawaban dari WebinarJam kembali ke Framer
        return res.status(200).json(data);

    } catch (error) {
        console.error("WebinarJam Error:", error);
        return res.status(500).json({ error: 'Gagal terhubung ke server internal.' });
    }
}